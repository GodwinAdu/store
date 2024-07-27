import { Schema, models, model } from "mongoose";

const UnitSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    code: String,
    active: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
    // versionKey: false,
    // minimize: false,
    // toObject: { virtuals: true }
});


const Unit = models.Unit || model("Unit", UnitSchema);

export default Unit;