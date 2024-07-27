import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  phone:{
    type: String,
    required: true,
    index: true,
  },
  gender:{
    type: String,
    required: true,
  },
  address: String,
  country: String,
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },

}, {
  timestamps: true,
});

const User = models?.User || model("User", UserSchema);

export default User;
