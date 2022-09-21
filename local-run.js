require('dotenv').config();
const { handler } = require('./src/index');

console.log('    ____                                                      _     ');
console.log('   / __ \\__  ______  ____  ___  ____  ____  ___  ___  _____  (_)___ ');
console.log('  / / / / / / / __ \\/ __ `/ _ \\/ __ \\/ __ \\/ _ \\/ _ \\/ ___/ / / __ \\ ');
console.log(' / /_/ / /_/ / / / / /_/ /  __/ /_/ / / / /  __/  __/ /    / / /_/ /');
console.log('/_____/\\__,_/_/ /_/\\__, /\\___/\\____/_/ /_/\\___/\\___/_/ (_)/_/\\____/ ');
console.log('                  /____/               Scan to Mongo Local Utility');

const doProcess = async () => {
    
    console.log('starting.');
    await handler({
        crealmIds: [100, 104, 106, 1070, 1071, 1072, 11, 1129, 113, 1136, 1138, 114, 1147, 115, 1151, 1168],
        dungeonIds: [391,392,370,369],
        period: 873,
        afterEpoch: 0
    });

    console.log('success.');
    process.exit(0);
};

doProcess();
