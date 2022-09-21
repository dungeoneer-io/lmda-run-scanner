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

const sendToDatabase = async ({ runs }) => {
    console.log('transmitting unique runs...');
    await upsertRuns(runs);
};

module.exports = sendToDatabase;
