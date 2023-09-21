import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const roleCategorySchema = new Schema({
    namePL:  String,
    nameEN: String,
    iconUrl: String,
    index: Number
}, { collection: 'roleCategories' });

export default mongoose.model('roleCategory', roleCategorySchema);