const {
    queueUntilResolved,
    getMythicLeaderboard,
    getDb
} = require('@dungeoneer-io/nodejs-utils');
const { mapApiRunToRun } = require('./bapi-mapper/run-snapshot');
const {
    COLLECTIONS,
    DATABASES
} = require('./entity-enums');

const getPeriodFixture = async (periodid) => {
    const fixtureCollection = await getDb()
        .db(DATABASES.DEFAULT)
        .collection(COLLECTIONS.PERIODFIXTURES);

    console.log(`retrieving snapshot ${ periodid }`);
    let snapshot;

    if (periodid) {
        snapshot = await fixtureCollection.findOne({ _id: periodid });
    }
    if (!snapshot) {
        console.log('undefined or unavailable fixture, using latest');
        snapshot = await fixtureCollection.findOne({}, { sort: {$natural:-1}});
    }

    const periodFixture = {
        dungeonIds: Object.keys(snapshot.dungeonMap),
        crealmIds: [...new Set(Object.values(snapshot.rlmToCrlm))],
        period: snapshot._id
    };

    return periodFixture;
};

const getSnapshot = async (lambdaEvent) => {
    let {
        crealmIds,
        dungeonIds,
        period,
        afterEpoch = 0,
        isAGlobalScan = false
    } = lambdaEvent;

    if (!crealmIds || !dungeonIds || !period) {
        const periodFixture = await getPeriodFixture(period);

        if (!crealmIds) {
            crealmIds = periodFixture.crealmIds;
        }

        if (!dungeonIds) {
            dungeonIds = [periodFixture.dungeonIds[0]];
        }

        period = periodFixture.period;
    }

    const fetchLeaderboardAndTransformResult = async ({
        afterEpoch,
        ...dpr
    }) => {
        const leaderboard = await getMythicLeaderboard(dpr);
        
        const recentRuns = (leaderboard.leading_groups || [])
            .filter((lg) => (lg.completed_timestamp / 1000) > afterEpoch)
            .map(mapApiRunToRun(leaderboard.map_challenge_mode_id, leaderboard.period));
    
        const count = recentRuns.length;
        const lastRun = recentRuns[recentRuns.length - 1];

        let min = { lvl: 0, dur: 0 };

        if (count === 500) {
            min = { lvl: lastRun.lvl, dur: lastRun.dur };
        }

        const { dungeon, period, realm } = dpr;
        const lbData = {
            mvr: {
                _id: `${period}-${realm}-${dungeon}`,
                asof: Date.now(),
                count,
                min,
                ...dpr
            },
            recentRuns
        };
        return lbData;
    };


    const leaderboardsToScan = crealmIds.map(realm => ({ realm }))
        .map(({ realm }) => dungeonIds.map(dungeon => ({ dungeon, period, realm, afterEpoch })))
        .reduce((acc, arr) => [...acc, ...arr], []);

    const promiseTimeoutMs = process.env.SCAN_TIMEOUT_MS || 12000;
    const runLists = await queueUntilResolved(
        fetchLeaderboardAndTransformResult,
        leaderboardsToScan,
        40,
        3,
        { showBar: true, debug: true, promiseTimeoutMs }
    )
    .catch(o => console.log('uncaught all the way up to doProcess'));

    const fullRunList = runLists.results.flatMap(({ recentRuns }) => recentRuns);
    const mvrs = runLists.results.map(({ mvr }) => mvr);
    
    let globalScanAttrs = {};
    if (isAGlobalScan) {
        globalScanAttrs = {
            dungeonIds,
            period
        };
    }

    return {
        runs: fullRunList,
        mvrs,
        global: globalScanAttrs
    };
};

module.exports = getSnapshot;
