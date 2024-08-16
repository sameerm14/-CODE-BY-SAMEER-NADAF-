import mongoose from "mongoose";

const User = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    message: { type: String, require: true },
  },
  { collection: "user-data" }
);

const model = mongoose.model("userdata", User);

export default model;
