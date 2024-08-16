import React, { useState, useEffect } from "react";
import "./Inventorymanage.css";
import Navbar from "../../components/Navbar.js";
import Footer from "../../Footer/Footer.js";
import axios from "axios";

const categoryPrefixes = {
  Electronics: "ELE",
  Groceries: "GRO",
  Clothing: "CLO",
  Furniture: "FUR",
};

const unitsByCategory = {
  Electronics: ["Pieces", "Kilograms", "Grams"],
  Groceries: ["Pieces", "Kilograms", "Grams"],
  Clothing: ["Pieces", "Meters", "Centimeters", "Inches"],
  Furniture: ["Pieces", "Meters", "Centimeters", "Feet", "Inches"],
};

const Inventorymanage = () => {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categoryQuantities, setCategoryQuantities] = useState({
    Electronics: 0,
    Groceries: 0,
    Clothing: 0,
    Furniture: 0,
  });
  const [lastProductIds, setLastProductIds] = useState({
    Electronics: "ELE001",
    Groceries: "GRO001",
    Clothing: "CLO001",
    Furniture: "FUR001",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryQuantities();
  }, []);

  const fetchCategoryQuantities = async () => {
    try {
      const response = await axios.get("http://localhost:3002/api/quantities");
      const data = response.data;
      setCategoryQuantities(data.categoryQuantities);
      setLastProductIds(data.lastProductIds);
    } catch (error) {
      setError("Error fetching category quantities");
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    if (lastProductIds[selectedCategory]) {
      setProductId(incrementProductId(selectedCategory));
    } else {
      setProductId(categoryPrefixes[selectedCategory] + "000");
    }

    // Reset unit and price when category changes
    setUnit("");
    setPrice("");
  };

  const incrementProductId = (selectedCategory) => {
    const lastProductId = lastProductIds[selectedCategory];
    const numericPart = parseInt(lastProductId.slice(3), 10);
    const incrementedNumericPart = numericPart + 1;
    const paddedIncrementedNumericPart = String(
      incrementedNumericPart
    ).padStart(3, "0");
    return categoryPrefixes[selectedCategory] + paddedIncrementedNumericPart;
  };

  const submitProduct = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3002/api/products", {
        productId,
        name,
        quantity: parseInt(quantity, 10),
        unit,
        price: parseFloat(price),
        category,
      });

      // Handle response
      if (!response.status === 200) {
        throw new Error(`Error adding product: ${response.status}`);
      }

      // Clear form fields after successful submission
      setProductId("");
      setName("");
      setQuantity("");
      setUnit("");
      setPrice("");

      // Fetch updated quantities immediately after adding product
      await fetchCategoryQuantities();
    } catch (error) {
      console.error("Error adding product:", error);
      setError(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="d-flex inven">
        <div className="d-flex w-50">
          <div className="contact-forms mt-2 p-3 bg-dark">
            <h4 className="text-warning">Add product</h4>
            <form onSubmit={submitProduct}>
              <div>
                <label htmlFor="productId" className="text-white">
                  Product ID:
                </label>
                <input
                  type="text"
                  id="productId"
                  value={productId}
                  required
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="name" className="text-white">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="quantity" className="text-white">
                  Quantity:
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="unit" className="text-white">
                  Unit:
                </label>
                <select
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                >
                  <option value="">Select Unit</option>
                  {unitsByCategory[category] &&
                    unitsByCategory[category].map((unitOption) => (
                      <option key={unitOption} value={unitOption}>
                        {unitOption}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label htmlFor="price" className="text-white">
                  Price:
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="text-white">
                  Category:
                </label>
                <br />
                <select
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                  required
                  className="p-2"
                >
                  <option value="">Select Category</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Groceries">Groceries</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success">
                Add item
              </button>
            </form>
            {error && <div style={{ color: "red" }}>{error}</div>}
          </div>
        </div>
        <div className="w-50 cent">
          <div className="d-flex justify-content-around m-2">
            <div className="text-center bg-light m-auto widt">
              <h2>Electronics</h2>
              <h1>
                {categoryQuantities.Electronics} <span>Left</span>
              </h1>
            </div>
            <div className="text-center bg-light m-auto widt">
              <h2>Furniture</h2>
              <h1>
                {categoryQuantities.Furniture} <span>Left</span>
              </h1>
            </div>
          </div>
          <div className="d-flex justify-content-around m-2">
            <div className="text-center bg-light m-auto widt">
              <h2>Groceries</h2>
              <h1>
                {categoryQuantities.Groceries} <span>Left</span>
              </h1>
            </div>
            <div className="text-center bg-light m-auto widt">
              <h2>Clothing</h2>
              <h1>
                {categoryQuantities.Clothing} <span>Left</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Inventorymanage;
