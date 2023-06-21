import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  roleId:  String,
  categories: { type: Array, default: [] },
}, { collection: 'roles' });

export default mongoose.model('role', roleSchema);