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
    runArray.sort((a, b) => a._id > b._id ? -1 : 1);

    const last = undefined;
    const sent = 0;
    runArray.forEach((run) => {
        if (run._id !== last) {
            batch.find({ _id: `${run._id}` })
                .upsert()
                .updateOne({
                    $set: run
                });
            sent++;
        }
        last = run._id;
    });
    if (runArray.length === 0) {
        console.log('no new runs');
        tempReceipt(runArray.length, 0);
        return;
    }
    const results = await batch.execute();
    console.log(`${runArray.length} runs, ${sent} sent, ${results.result.nUpserted} added`);
    tempReceipt(sent, results.result.nUpserted, results.result.upserted.map(({ _id }) =>  _id ));
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

const tempReceipt = async (countFound, countNew, news = []) => {
    const receiptColl = await getDb()
        .db(DATABASES.DEFAULT)
        .collection("testReceipts");
    const abc = new Date();
    await receiptColl.insertOne({
        stamp: abc.toISOString(),
        countFound,
        countNew,
        news
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
