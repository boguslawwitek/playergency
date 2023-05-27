import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userid:  String,
  level: { type: Number, default: 0 },
  exp: { type: Number, default: 0 },
  goal: { type: Number, default: 100 },
  server: { type: Boolean, default: true }
}, { collection: 'leveling' });

export default mongoose.model('user', userSchema);