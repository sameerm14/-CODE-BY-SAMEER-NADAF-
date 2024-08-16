# Logiflow Inventory Management and Shipment Tracking System

Logiflow is a comprehensive inventory management and shipment tracking system designed to manage product categories, handle shipments, and generate invoices. The project also includes features like generating QR codes for products and sending product information via email.

## Features

- **Inventory Management**: Manage products across multiple categories (Electronics, Groceries, Clothing, Furniture). Includes functionality to add products, update quantities, and retrieve product details.
- **Shipment Tracking**: Create, manage, and track shipments. Generate detailed invoices for shipments.
- **QR Code Generation**: Generate and retrieve QR codes for products to easily track and identify items.
- **Email Notifications**: Send product details to users via email.
- **REST API**: Exposes endpoints for managing products, shipments, and generating invoices.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/username/logiflow.git
   cd logiflow
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up MongoDB**:
   Ensure MongoDB is running on your system. By default, the project connects to `mongodb://localhost:27017/logiflow`. If your MongoDB is running on a different host or port, update the connection string in `server.js`.

4. **Configure Email Service**:
   Update the email credentials in the `nodemailer` section of `server.js`:

   ```javascript
   const transporter = nodemailer.createTransport({
     host: "smtp.gmail.com",
     port: 587,
     secure: false, // or 'STARTTLS'
     auth: {
       user: "your-email@gmail.com",
       pass: "your-email-password",
     },
   });
   ```

5. **Start the Server**:
   ```bash
   npm start
   ```
   The server will be running on `http://localhost:3002`.

## API Endpoints

### Products

- **Get Product by ID**: `GET /api/products/:productId`
- **Get Latest Product ID**: `GET /api/latestProductId`
- **Add/Update Product**: `POST /api/products`
- **Get Category Quantities**: `GET /api/quantities`
- **Generate QR Code**: `GET /api/product/:productId/qrcode`

### Shipments

- **Create Shipment**: `POST /api/shipments`
- **Get All Shipments**: `GET /api/shipments`
- **Generate Invoice for Shipment**: `POST /api/shipments/:id/invoice`

### Contact Form

- **Submit Contact Form**: `POST /api/contact`

### Email

- **Send Product Details via Email**: `POST /api/email`

## Project Structure

- **Models/**: Contains Mongoose models for managing data in MongoDB.
- **server.js**: Main server file containing API routes and logic.
- **README.md**: Project documentation.

## Dependencies

- **Express**: Web framework for Node.js
- **Mongoose**: ODM library for MongoDB
- **QRCode**: Library to generate QR codes
- **Nodemailer**: Module to send emails
- **Cors**: Middleware for enabling CORS
- **dotenv**: Environment variable loader

## Contribution

Contributions are welcome! Please fork this repository, make your changes, and submit a pull request.
