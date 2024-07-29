import { model, models, Schema } from "mongoose";


const CategorySchema = new Schema({
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
    }
}, {
    timestamps: true,
    // versionKey: false,
    // minimize: false,
    // toObject: { virtuals: true }
});

const Category = models.Category || model("Category", CategorySchema);

export default Category; 
