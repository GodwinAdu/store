import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  customer: {
    type: String,
    required: true
  },
  billingAddress: {
    type: String,
  },
  shippingAddress: {
    type: String,
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
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  description:{type: String},
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
}, { timestamps: true });

const Order = models.Order || model("Order", OrderSchema);

export default Order;
