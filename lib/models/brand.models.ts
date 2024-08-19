import { Schema, models, model } from "mongoose";

const BrandSchema = new Schema({
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
        ref: "User",
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    mod_flag: {
        type: Boolean,
        default: false,
    },
    del_flag: {
        type: Boolean,
        default: false,
    },
    action_type: {
        type: String,
    }
}, {
    timestamps: true,
});


const Brand = models.Brand || model("Brand", BrandSchema);

export default Brand;