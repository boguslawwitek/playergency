import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    userid:  String,
    coins: {type: Number, default: 0}
}, { collection: 'wallet' });

export default mongoose.model('wallet', walletSchema);