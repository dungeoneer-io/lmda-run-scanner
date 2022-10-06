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
        // crealmIds: [100, 104, 106, 1070, 1071, 1072, 11, 1129, 113, 1136, 1138, 114, 1147, 115, 1151, 1168],
        // dungeonIds: [391,392,370,369],
        // crealmIds: [
        //     3694, 1168,  151,    4,    5, 3661,  127,    9,  121,   11,
        //       12, 1190,  104,  155, 3693,   47,   52,   53,   54,   55,
        //     1129,   57,   58, 3684,   60,   61,   63,   64, 3683,   67,
        //     1175,   69,   77,   71,  157,   73,   96,   75,   76,   78,
        //      154, 1136,   84,   86,  113,  125, 1138,   99,  100,  106,
        //     1185,  114,  115,  117,  118,  120,  158,  160,  162,  163,
        //     1070, 1071, 1072, 1147, 1151, 1184, 3678, 3685, 1426, 3675,
        //     1171, 1425, 1427, 1428, 3676, 3207, 3208, 3209, 3234, 3721,
        //     3726, 3723, 3725
        //   ],
        // dungeonIds: [ 227
            //166, 169, 227,
            //234, 369, 370,
            // 391, 392
            // 391
          // ],
        //   period: 999
        // period: 875,
        // afterEpoch: 0,//Date.now()-86360,
        // isAGlobalScan: true
    });

    console.log('success.');
    process.exit(0);
};

doProcess();
