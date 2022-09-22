const { getDb } = require('@dungeoneer-io/nodejs-utils');
const {
    COLLECTIONS,
    DATABASES
} = require('./entity-enums');

const upsertRuns = async (runArray) => {
    const runColl = await getDb()
        .db(DATABASES.DEFAULT)
        .collection(COLLECTIONS.RUNS);
    const batch = runColl.initializeUnorderedBulkOp();

    runArray.forEach((run) => {
        batch.find({ _id: `${run._id}` })
            .upsert()
            .updateOne({
                $set: run
            });
    });
    const results = await batch.execute();
    console.log(`${runArray.length} sent, ${results.result.nUpserted} added`);
};

const upsertMvrs = async (mvrArray) => {
    const mvrColl = await getDb()
        .db(DATABASES.DEFAULT)
        .collection(COLLECTIONS.MVRS);
    const batch = mvrColl.initializeUnorderedBulkOp();

    mvrArray.forEach((mvr) => {
        batch.find({ _id: `${mvr._id}` })
            .upsert()
            .updateOne({
                $set: mvr
            });
    });
    await batch.execute();
};

const updatePeriodFixtureWithScanStamps = async ({ period, dungeonIds }) => {
    const periodFixtureColl = await getDb()
        .db(DATABASES.DEFAULT)
        .collection(COLLECTIONS.PERIODFIXTURES);

    const setObj = Object.assign({}, ...dungeonIds.map((o) => ({ [`dungeonLastScans.${o}`]: Date.now() })));

    await periodFixtureColl.updateOne(
        { _id: period },
        {
            $set: setObj
        }
    );
};

const sendToDatabase = async ({ runs, mvrs, global }) => {
    console.log('transmitting unique runs...');
    await upsertRuns(runs);

    console.log('transmitting current mvrs...');
    await upsertMvrs(mvrs);

    if (global) {
        console.log('transmitting dungeon last scan stamps...');
        await updatePeriodFixtureWithScanStamps(global);
    }
};

module.exports = sendToDatabase;
