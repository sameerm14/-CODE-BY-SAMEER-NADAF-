import mongoose from "mongoose";

const Quantities = new mongoose.Schema({
  Electronics: {
    type: Number,
  },
  Groceries: {
    type: Number,
  },
  Clothing: {
    type: Number,
  },
  Furniture: {
    type: Number,
  },
});
const CategoryQuantities = mongoose.model("CategoryQuantities", Quantities);

export default CategoryQuantities;
