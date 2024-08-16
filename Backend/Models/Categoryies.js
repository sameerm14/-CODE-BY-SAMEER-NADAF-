import mongoose from "mongoose";

// Define schema for Electronics category
const electronicsSchema = new mongoose.Schema({
  productId: { type: String, unique: true, required: true, index: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }, // New field for unit of measure
  price: { type: Number, required: true }, // New field for price
});

// Define schema for Groceries category
const groceriesSchema = new mongoose.Schema({
  productId: { type: String, unique: true, required: true, index: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }, // Assuming all categories have a 'unit' field
  price: { type: Number, required: true }, // New field for price
});

// Define schema for Clothing category
const clothingSchema = new mongoose.Schema({
  productId: { type: String, unique: true, required: true, index: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }, // Assuming all categories have a 'unit' field
  price: { type: Number, required: true }, // New field for price
});

// Define schema for Furniture category
const furnitureSchema = new mongoose.Schema({
  productId: { type: String, unique: true, required: true, index: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }, // Assuming all categories have a 'unit' field
  price: { type: Number, required: true }, // New field for price
});

// Create models for each category
const Electronics = mongoose.model("Electronics", electronicsSchema);
const Groceries = mongoose.model("Groceries", groceriesSchema);
const Clothing = mongoose.model("Clothing", clothingSchema);
const Furniture = mongoose.model("Furniture", furnitureSchema);

export { Electronics, Groceries, Clothing, Furniture };
