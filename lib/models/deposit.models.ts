import { model, models, Schema } from "mongoose";

const DepositSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index: true,
    },
    depositName: {
        type: String,
        required: true,
        trim: true,
    },
    depositAmount: {
        type: Number,
        required: true,
        min: 0,
        index: true,
    },
    depositDate: {
        type: Date,
        required: true,
        index: true,

    },
    saleId: {
        type: Schema.Types.ObjectId,
        ref: 'Sale',
        default: null
    },
    payVia: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
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
    timestamps: true // Automatically add createdAt and updatedAt fields
});

const Deposit = models.Deposit || model("Deposit", DepositSchema);

export default Deposit;