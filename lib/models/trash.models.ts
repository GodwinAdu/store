import { model, Schema, models } from 'mongoose';

const trashSchema = new Schema({
    originalCollection: { type: String, required: true },
    document: { type: Schema.Types.Mixed, required: true },
    message: { type: String },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date, default: Date.now },
});

const Trash = models.Trash || model('Trash', trashSchema);

export default Trash;