// .env
require('dotenv').config();

// used for requires
const path = require('path');
global.__approot = path.resolve(__dirname);

// main bot
const Mainframe = require(__approot+'/main');
var mainframe = new Mainframe();

mainframe.start();
