const {
    connectToBlizzard,
    initDb,
    lambdaTry200Catch500,
} = require('@dungeoneer-io/nodejs-utils');
const sendToDatabase = require('./send-to-database');
const getSnapshot = require('./get-snapshot');

const harvestAndUpsertData = async (lambdaEvent) => {
    await initDb();
    await connectToBlizzard();
    
    const payloadToWrite = await getSnapshot(lambdaEvent);
    await sendToDatabase(payloadToWrite);
};

exports.handler = async (event = {}, context) => {
    console.log('Dungeoneer.io');
    console.log('lmda-run-scanner');
    console.log('================');

    await lambdaTry200Catch500({
        context,
        event,
        notifyOn200: true,
        fn200: harvestAndUpsertData,
        fn500: (e) => console.log('error', e)
    });
};
