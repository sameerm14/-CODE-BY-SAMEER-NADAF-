import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import QRCode from "qrcode";

import User from "./Models/contact.model.js";
import productSchema from "./Models/Product.js";
import Quantities from "./Models/Category.js";
import shipments from "./Models/Shipments.js";
import {
  Electronics,
  Groceries,
  Clothing,
  Furniture,
} from "./Models/Categoryies.js";
import categoryPrefixes from "./Models/Constunts.js";
import nodemailer from "nodemailer";

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/logiflow", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/api/products/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    // Check each category model for the product
    let product = await Electronics.findOne({ productId });
    if (!product) {
      product = await Groceries.findOne({ productId });
    }
    if (!product) {
      product = await Clothing.findOne({ productId });
    }
    if (!product) {
      product = await Furniture.findOne({ productId });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/latestProductId", async (req, res) => {
  try {
    // Find the latest product in each collection
    const latestElectronics = await Electronics.findOne().sort({
      productId: -1,
    });
    const latestGroceries = await Groceries.findOne().sort({ productId: -1 });
    const latestClothing = await Clothing.findOne().sort({ productId: -1 });
    const latestFurniture = await Furniture.findOne().sort({ productId: -1 });

    // Gather all latest product IDs
    const latestProductIds = [
      latestElectronics?.productId,
      latestGroceries?.productId,
      latestClothing?.productId,
      latestFurniture?.productId,
    ].filter((id) => id !== undefined); // Filter out undefined values (if any)

    if (latestProductIds.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Fetch product names based on the latestProductIds array
    const productNames = await Promise.all(
      latestProductIds.map(async (id) => {
        try {
          // Fetch product details using the /api/products/:productId endpoint
          const response = await fetch(
            `http://localhost:3002/api/products/${id}`
          );
          if (response.ok) {
            const product = await response.json();
            return product.name;
          } else {
            console.error(
              `Failed to fetch product name for ID ${id}. Status: ${response.status}`
            );
            return `Product not found for ID: ${id}`;
          }
        } catch (error) {
          console.error(`Error fetching product name for ID ${id}:`, error);
          return `Error fetching product name for ID: ${id}`;
        }
      })
    );

    res.json(productNames);
  } catch (error) {
    console.error("Error fetching latest product IDs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create shipment
//...

// Create shipment
// Create shipment
app.post("/api/shipments", async (req, res) => {
  try {
    const {
      sendername,
      receivername,
      senderaddress,
      receiveraddress,
      productId,
      itemname,
      quantity,
      origin,
      destination,
      status,
      units,
      price,
      totalPrice,
    } = req.body;

    const newShipment = await shipments.create({
      sendername,
      receivername,
      senderaddress,
      receiveraddress,
      productId,
      itemname,
      quantity,
      origin,
      destination,
      status,
      units,
      price,
      totalPrice,
    });

    res.json({ status: "ok", shipment: newShipment });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/api/shipments/:id/invoice", async (req, res) => {
  const { id } = req.params;
  try {
    const shipment = await shipments.findById(id);
    if (!shipment) {
      return res
        .status(404)
        .json({ status: "error", message: "Shipment not found" });
    }

    // Format date
    const invoiceDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Generate the HTML for the invoice
    const invoiceHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f9f9f9;
              padding: 20px;
            }
            .invoice-container {
              max-width: 800px;
              margin: auto;
              border: 1px solid #ddd;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              background-color: #fff;
              padding: 20px;
              display: flex;
              flex-direction: column;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #007bff;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .invoice-header h1 {
              margin: 0;
              font-size: 24px;
              color: #007bff;
            }
            .invoice-header img {
              max-width: 100px;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .invoice-details div {
              flex: 1;
            }
            .invoice-details p {
              margin: 5px 0;
            }
            .invoice-details p span {
              font-weight: bold;
            }
            .invoice-items {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .invoice-items th, .invoice-items td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            .invoice-items th {
              background-color: #007bff;
              color: #fff;
            }
            .invoice-footer {
              text-align: center;
              margin-top: 20px;
            }
            .invoice-footer p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <h1>INVOICE</h1>
              <img src="LOGO_URL" alt="Logo">
            </div>
            <div class="invoice-details">
              <div>
                <p><span>Logiflow </span></p>
                <p>Hanuman Nagar 591313</p>
                <p>Belgavi</p>
              </div>
              <div>
                <p><span>Bill To:</span></p>
                <p>${shipment.sendername}</p>
                <p>${shipment.senderaddress}</p>
              </div>
              <div>
                <p><span>Ship To:</span></p>
                <p>${shipment.receivername}</p>
                <p>${shipment.receiveraddress}</p>
              </div>
              <div>
                <p><span>Invoice #: </span>US-001</p>
                <p><span>Invoice Date: </span>${invoiceDate}</p>
              </div>
            </div>
            <table class="invoice-items">
              <tr>
                <th>QTY</th>
                <th>DESCRIPTION</th>
                <th>UNIT PRICE</th>
                <th>AMOUNT</th>
              </tr>
              <tr>
                <td>1</td>
                <td>${shipment.itemname}</td>
                <td>${shipment.price}</td>
                <td>${shipment.price}</td>
              </tr>
            </table>
            <div class="invoice-details">
              <div>
                <p><span>Subtotal:</span> ${shipment.totalPrice}</p>
                <p><span>Sales Tax 6.25%:</span> ${(
                  shipment.totalPrice * 0.0625
                ).toFixed(2)}</p>
                <p><span>TOTAL:</span> ${(shipment.totalPrice * 1.0625).toFixed(
                  2
                )}</p>
              </div>
            </div>
            <div class="invoice-footer">
              <p>Thank you for your business!</p>
              <p><span>Terms & Conditions</span></p>
              <p>Payment is due within 15 days</p>
              <p>Please make checks payable to: Logiflow.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // Send the HTML as a response
    res.status(200).send(invoiceHTML);
  } catch (err) {
    console.error("Error generating invoice:", err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// Fetch shipments
app.get("/api/shipments", async (req, res) => {
  try {
    const allShipments = await shipments.find(
      {},
      "sendername receivername status productId"
    );
    res.json(allShipments);
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Contact form submission
app.post("/api/contact", async (req, res) => {
  await User.create({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });
  res.json({ status: "ok" });
});

const categoryModels = {
  Electronics,
  Groceries,
  Clothing,
  Furniture,
};

app.post("/api/products", async (req, res) => {
  const { name, quantity, unit, price, category } = req.body;

  const model = categoryModels[category];
  if (!model) {
    return res.status(400).send({ error: "Invalid category" });
  }

  try {
    const lastProduct = await model.findOne().sort({ productId: -1 });

    let lastProductId = categoryPrefixes[category] + "001";
    if (lastProduct) {
      const lastNumericPart = parseInt(lastProduct.productId.slice(3), 10);
      lastProductId =
        categoryPrefixes[category] +
        String(lastNumericPart + 1).padStart(3, "0");
    }

    // Check if the product already exists
    const existingProduct = await model.findOne({ name });

    if (existingProduct) {
      // Update the quantity of the existing product
      if (existingProduct.unit === unit) {
        existingProduct.quantity += quantity;
        await existingProduct.save();
        res.status(200).send(existingProduct);
      } else {
        return res
          .status(400)
          .send({ error: "Unit mismatch for existing product" });
      }
    } else {
      // Create a new product
      const newProduct = new model({
        productId: lastProductId,
        name,
        quantity,
        unit,
        price,
      });

      await newProduct.save();
      res.status(201).send(newProduct);
    }
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(400).send({ error: error.message });
  }
});

app.get("/api/quantities", async (req, res) => {
  try {
    const electronicsCount = await Electronics.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" },
          productId: { $max: "$productId" },
        },
      },
    ]);
    const groceriesCount = await Groceries.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" },
          productId: { $max: "$productId" },
        },
      },
    ]);
    const clothingCount = await Clothing.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" },
          productId: { $max: "$productId" },
        },
      },
    ]);
    const furnitureCount = await Furniture.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" },
          productId: { $max: "$productId" },
        },
      },
    ]);

    const categoryQuantities = {
      Electronics: electronicsCount[0]?.total || 0,
      Groceries: groceriesCount[0]?.total || 0,
      Clothing: clothingCount[0]?.total || 0,
      Furniture: furnitureCount[0]?.total || 0,
    };

    const lastProductIds = {
      Electronics: electronicsCount[0]?.productId || "ELE000",
      Groceries: groceriesCount[0]?.productId || "GRO000",
      Clothing: clothingCount[0]?.productId || "CLO000",
      Furniture: furnitureCount[0]?.productId || "FUR000",
    };

    res.send({ categoryQuantities, lastProductIds });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Generate QR code for product
app.get("/api/product/:productId/qrcode", async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(`Fetching product with ID: ${productId}`);

    let product = null;
    let category = null;

    // Search through each category's model
    for (const cat in categoryModels) {
      const model = categoryModels[cat];
      product = await model.findOne({ productId });

      if (product) {
        category = cat;
        break; // Exit loop if product found in any category
      }
    }

    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("Product found:", product);

    const locationInfo = {
      productId: product.productId,
      product: product.name,
      category,
    };
    const qrCodeData = JSON.stringify(locationInfo);
    console.log("QR Code data:", qrCodeData);

    const qrCode = await QRCode.toDataURL(qrCodeData, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    res.setHeader("Content-Type", "image/png");
    res.send(qrCode);
  } catch (error) {
    console.error("Error generating QR code:", error.message);
    console.error(error.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//////////////////
app.post("/api/email", async (req, res) => {
  const { productId, email } = req.body;

  try {
    let product = null;

    // Search through each category's model
    for (const cat in categoryModels) {
      const model = categoryModels[cat];
      product = await model.findOne({ productId });

      if (product) {
        break; // Exit loop if product found in any category
      }
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const emailContent = `
      <h2>Product Information</h2>
      <p>Product Name: ${product.name}</p>
      <p>Product Description: ${product.description}</p>
      <p>Product Quantity: ${product.quantity}</p>
    `;

    console.log("Email User:", "snadaf576@gmail.com");
    console.log("Email Pass:", "sanxxopfakshsb12");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // or 'STARTTLS'
      auth: {
        user: "snadaf576@gmail.com",
        pass: "sanxxopfakshsb",
      },
    });

    const mailOptions = {
      from: "snadaf576@gmail.com",
      to: email,
      subject: "Product Information",
      html: emailContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email" });
      }
      res.json({ message: "Email sent successfully" });
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch category quantities
app.get("/api/quantities", async (req, res) => {
  try {
    const categoryQuantities = await Quantities.findOne();
    if (!categoryQuantities) {
      res.status(404).json({ message: "Category quantities not found" });
      return;
    }
    res.json(categoryQuantities);
  } catch (error) {
    console.error("Error fetching category quantities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);

  const initialData = await Quantities.findOne();
  if (!initialData) {
    const initialCategoryQuantities = new Quantities({
      Electronics: 0,
      Groceries: 0,
      Clothing: 0,
      Furniture: 0,
    });
    await initialCategoryQuantities.save();
    console.log("Initialized category quantities in the database");
  }
});
