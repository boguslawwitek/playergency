import mongoose from 'mongoose';
import * as config from "../config.json";

const clientP = mongoose.connect(config.mongoUri).then(m => m.connection.getClient());
const db = mongoose.connection;
  
db.on('error', console.error.bind(console, '[MongoDB] connection error:'));
db.once('open', function() {
    console.log('[MongoDB] connection open');
});

process.on('SIGINT', function(){
    mongoose.connection.close();
    console.log('\n[MongoDB] Mongoose default connection is disconnected due to application termination');
    process.exit(0);
});

export default clientP;