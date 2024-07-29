import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "Name must be at least 2 characters."],
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: "Brand"
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
  expiryDate: {
    type: Date,
  },
  barcode: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tags: [{ type: String }],
  color: [{ type: String }],
  size: [{ type: String }],
  cost: {
    type: Number,
    default: 0,
    min: 0
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  prices: [{
    name: {
      type: String
    },
    price: {
      type: Number,
    },
  }],
  taxes: [{
    name: {
      type: String,
    },
    amount: {
      type: Number,
    },
  }],
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

const Product = models.Product || model("Product", ProductSchema);

export default Product;
