import { Schema, model, models, Document } from 'mongoose';

interface LocationDetails {
    city: string;
    region: string;
    country: string;
    ip: string;
}

interface HistoryDetails {
    browserName: string;
    machineType: string;
    address?: string;
    location?: LocationDetails;
}

interface HistoryDocument extends Document {
    action: string;
    user: any;
    details: HistoryDetails;
    timestamp: Date;
}

const locationSchema = new Schema<LocationDetails>({
    city: { type: String },
    region: { type: String },
    country: { type: String },
    ip: { type: String },
});

const historyDetailsSchema = new Schema<HistoryDetails>({
    browserName: { type: String, },
    machineType: { type: String},
    location: { type: locationSchema, default: null },
});

const historySchema = new Schema<HistoryDocument>({
    action: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    details: { type: historyDetailsSchema },
    timestamp: { type: Date, default: Date.now }
});

const History = models.History || model<HistoryDocument>('History', historySchema);

export default History;



// const historySchema = new Schema<HistoryDocument>({
//     action: { type: String, required: true },
//     user: { type: Schema.Types.ObjectId, ref: "User" },
//     details: { type: Schema.Types.Mixed, default: null },
//     browserName: { type: String, required: true },
//     machineType: { type: String, required: true },
//     location: {
//         city: { type: String, required: true },
//         region: { type: String, required: true },
//         country: { type: String, required: true },
//         ip: { type: String, required: true },
//     },
//     timestamp: { type: Date, default: Date.now }
// });