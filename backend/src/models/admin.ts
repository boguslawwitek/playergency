import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  userid:  {type: String, default: ""},
  rolePL: {type: String, default: ""},
  roleEN: {type: String, default: ""},
  descPL: {type: String, default: ""},
  descEN: {type: String, default: ""},
  adminDashboard: {type: Boolean, default: false},
  visibilityOnHomepage: {type: Boolean, default: false}
}, { collection: 'admins' });

export default mongoose.model('admin', adminSchema);