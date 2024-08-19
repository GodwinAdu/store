import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  picture: String,
});

const Transaction = models.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
