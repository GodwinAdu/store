import { Schema, model, models } from "mongoose";

const SalesSchema = new Schema({
  customer: {
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
    unit: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true
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
}, { timestamps: true });

const Sale = models.Sale || model("Sale", SalesSchema);

export default Sale;
