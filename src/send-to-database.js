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
    if (runArray.length === 0) {
        console.log('no new runs');
        tempReceipt(runArray.length, 0);
        return;
    }
    const results = await batch.execute();
    console.log(`${runArray.length} sent, ${results.result.nUpserted} added`);
    tempReceipt(runArray.length, results.result.nUpserted);
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

const tempReceipt = async (countFound, countNew) => {
    const receiptColl = await getDb()
        .db(DATABASES.DEFAULT)
        .collection("testReceipts");

    await receiptColl.insertOne({
        stamp: Date.now(),
        countFound,
        countNew
    });
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

    if (global.period) {
        console.log('transmitting dungeon last scan stamps...');
        await updatePeriodFixtureWithScanStamps(global);
    }
};

module.exports = sendToDatabase;
