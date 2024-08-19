import { model, models, Schema } from "mongoose";


const ExpensesSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    expenseName: {
        type: String,
        required: true
    },
    expenseAmount: {
        type: Number,
        required: true
    },
    expenseDate: {
        type: Date,
        required: true
    },
    payVia: {
        type: String,
        required: true
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

const Expense = models.Expense || model("Expense", ExpensesSchema);

export default Expense;