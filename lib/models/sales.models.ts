import { Schema, model, models } from "mongoose";

const SalesSchema = new Schema({
  customerId: {
    type: String,
    required: true
  },
  billingAddress: {
    type: String,
    required: true
  },
  shippingAddress: {
    type: String,
    required: true
  },
  invoiceNo: {
    type: String,
    required: true,
  },
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    unitId: {
      type: Schema.Types.ObjectId,
      ref: 'Unit',
    },
    quantity: {
      type: Number,
      min: 1
    },
    price: {
      type: Number,
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  paymentAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Other'],
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  taxes: {
    type: Number,
    default: 0
  },
  shippingCharge: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Completed', 'Cancelled', 'Suspended'],
    default: 'Completed'
  }
}, { timestamps: true });

const Sales = models.Sales || model("Sales", SalesSchema);

export default Sales;
