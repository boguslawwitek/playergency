import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  roleId:  String,
  categories: { type: Array, default: [{name: 'default', iconUrl: ''}] },
}, { collection: 'roles' });

export default mongoose.model('role', roleSchema);