const {
    queueUntilResolved,
    getMythicLeaderboard
} = require('@dungeoneer-io/nodejs-utils');

const facToIdMap = {
    NEUTRAL: 2,
    HORDE: 1,
    ALLIANCE: 0
};

const getSnapshot = async (lambdaEvent) => {
    const { crealmIds, dungeonIds, period, afterEpoch = 0 } = lambdaEvent;

    const mapRunMember = (member) => ({
        nme: member.profile.name,
        rlm: member.profile.realm.id,
        fac: facToIdMap[member.faction.type],
        spc: member.specialization.id
    });
    
    const fetchLeaderboardAndTransformResult = async ({
        afterEpoch,
        ...dpr
    }) => {
        const leaderboard = await getMythicLeaderboard(dpr);
        
        const recentRuns = (leaderboard.leading_groups || [])
            .filter((lg) => (lg.completed_timestamp / 1000) > afterEpoch)
            .map(lg => ({
                _id: `${lg.keystone_level}-${leaderboard.map_challenge_mode_id}-${lg.duration}-${lg.completed_timestamp / 1000}`,
                end: lg.completed_timestamp / 1000,
                map: leaderboard.map_challenge_mode_id,
                lvl: lg.keystone_level,
                dur: lg.duration,
                who: lg.members.map(m => mapRunMember(m, lg)),
                p: leaderboard.period
              }));
    
        const lbData = {
            recentRuns,
            mvr: {}
        };
        return lbData;
    };

    const leaderboardsToScan = crealmIds.map(realm => ({ realm }))
        .map(({ realm }) => dungeonIds.map(dungeon => ({ dungeon, period, realm, afterEpoch })))
        .reduce((acc, arr) => [...acc, ...arr], []);

    const runLists = await queueUntilResolved(
        fetchLeaderboardAndTransformResult,
        leaderboardsToScan,
        40,
        3,
        { showBar: true, debug: true }
    )
    .catch(o => console.log('uncaught all the way up to doProcess'));

    const fullRunList = Object.assign({}, ...runLists.results
        .flatMap(({ recentRuns }) =>
            recentRuns.map((run) => ({
                [run._id]: run
            }))
        )
    );
    
    return {
        runs: Object.values(fullRunList)
    };
};

module.exports = getSnapshot;
