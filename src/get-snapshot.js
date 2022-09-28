const {
    queueUntilResolved,
    getMythicLeaderboard
} = require('@dungeoneer-io/nodejs-utils');
const { mapApiRunToRun } = require('./bapi-mapper/run-snapshot');

const getSnapshot = async (lambdaEvent) => {
    const { crealmIds, dungeonIds, period, afterEpoch = 0, isAGlobalScan = false } = lambdaEvent;

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
