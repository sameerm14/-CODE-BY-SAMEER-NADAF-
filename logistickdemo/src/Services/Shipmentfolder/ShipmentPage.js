import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Shipment.css";

const unitsByCategory = {
  Electronics: ["Pieces", "Kilograms"],
  Groceries: ["Kilograms"],
  Clothing: ["Pieces"],
  Furniture: ["Pieces"],
};

export default function ShipmentPage() {
  const [sendername, setSenderName] = useState("");
  const [senderaddress, setSenderAddress] = useState("");
  const [receivername, setReceiverName] = useState("");
  const [receiveraddress, setReceiverAddress] = useState("");
  const [productId, setProductId] = useState("");
  const [itemname, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("Active");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [shipments, setShipments] = useState([]);
  const [category, setCategory] = useState("");
  const [selectedUnits, setSelectedUnits] = useState("");
  const [price, setPrice] = useState(0); // State to store the price of the product
  const [totalPrice, setTotalPrice] = useState(0); // State to calculate total price
  const invoiceRef = useRef();

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const response = await fetch("http://localhost:3002/api/shipments");
      if (response.ok) {
        const data = await response.json();
        setShipments(data);
      } else {
        setError("Failed to fetch shipments");
      }
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setError("Error fetching shipments");
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/products/${productId}`
      );

      if (response.ok) {
        const product = await response.json();
        setItemName(product.name);
        setCategory(product.category); // Assuming product object has category
        setPrice(product.price); // Set the price fetched from API
      } else {
        console.error(`Product fetch failed with status ${response.status}`);
        setItemName("");
        setCategory("");
        setPrice(0); // Reset price if fetch fails
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
      setItemName("");
      setCategory("");
      setPrice(0);
      setError("Error fetching product details");
    }
  };

  const handleProductIdChange = (e) => {
    const productId = e.target.value;
    setProductId(productId);
    if (productId) {
      fetchProductDetails(productId);
    } else {
      setItemName("");
      setCategory("");
      setPrice(0);
    }
  };

  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
    setQuantity(quantity);
    // Calculate total price based on quantity and price per unit
    if (quantity && price) {
      const totalPrice = parseFloat(quantity) * parseFloat(price);
      setTotalPrice(totalPrice.toFixed(2)); // Round to 2 decimal places
    } else {
      setTotalPrice(0);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSelectedUnits(""); // Reset selected units when category changes
  };

  const createShipment = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3002/api/shipments", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
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
          units: selectedUnits,
          price, // Include price in the shipment data
          totalPrice, // Include total price in the shipment data
        }),
      });

      if (response.ok) {
        setSenderName("");
        setReceiverName("");
        setSenderAddress("");
        setReceiverAddress("");
        setProductId("");
        setItemName("");
        setQuantity("");
        setOrigin("");
        setDestination("");
        setStatus("Active");
        setPrice(0); // Reset price after shipment creation
        setTotalPrice(0); // Reset total price after shipment creation
        setSuccess("Shipment created successfully!");
        fetchShipments();
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.message || "Failed to create shipment.");
      }
    } catch (err) {
      console.error("Error creating shipment:", err);
      setError("Error creating shipment");
    }
  };

  const generateInvoice = async (shipment) => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/shipments/${shipment._id}/invoice`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const invoiceHTML = await response.text();
        invoiceRef.current.innerHTML = invoiceHTML;
        createPDF();
      } else {
        setError("Failed to generate invoice");
      }
    } catch (err) {
      console.error("Error generating invoice:", err);
      setError("Error generating invoice");
    }
  };

  const createPDF = () => {
    const doc = new jsPDF();
    html2canvas(invoiceRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      doc.save("invoice.pdf");
    });
  };

  return (
    <div className="shipment-container d-flex mt-2 mb-2">
      <div className="create-shipment w-75">
        <div className="col-md-10 offset-md-1">
          <h1 className="text-center text-warning">Create Shipments</h1>
          <form onSubmit={createShipment} className="bg-dark forms">
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}
            <div className="d-flex justify-content-around">
              <div className="w-50 mx-2">
                <label htmlFor="senderName" className="form-label">
                  Sender Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="senderName"
                  value={sendername}
                  onChange={(e) => setSenderName(e.target.value)}
                  required
                />
              </div>
              <div className="w-50 mx-2">
                <label htmlFor="receiverName" className="form-label">
                  Receiver Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="receiverName"
                  value={receivername}
                  onChange={(e) => setReceiverName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="d-flex justify-content-around">
              <div className="w-50 mx-2">
                <label htmlFor="senderAddress" className="form-label">
                  Sender Address:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="senderAddress"
                  value={senderaddress}
                  onChange={(e) => setSenderAddress(e.target.value)}
                  required
                />
              </div>
              <div className="w-50 mx-2">
                <label htmlFor="receiverAddress" className="form-label">
                  Receiver Address:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="receiverAddress"
                  value={receiveraddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="d-flex justify-content-around">
              <div className="w-50 mx-2">
                <label htmlFor="productId" className="form-label">
                  Product ID:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="productId"
                  value={productId}
                  onChange={handleProductIdChange}
                  required
                />
              </div>
              <div className="w-50 mx-2">
                <label htmlFor="itemname" className="form-label">
                  Item Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="itemname"
                  value={itemname}
                  readOnly
                />
              </div>
            </div>
            <div className="d-flex justify-content-around">
              <div className="w-50 mx-2">
                <label htmlFor="quantity" className="form-label">
                  Quantity:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  required
                />
              </div>
              <div className="w-50 mx-2">
                <label htmlFor="category" className="form-label">
                  Category:
                </label>
                <select
                  className="form-control"
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Select Category</option>
                  {Object.keys(unitsByCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-around">
              <div className="w-50 mx-2">
                <label htmlFor="units" className="form-label">
                  Units:
                </label>
                <select
                  className="form-control"
                  id="units"
                  value={selectedUnits}
                  onChange={(e) => setSelectedUnits(e.target.value)}
                  required
                  disabled={!category}
                >
                  <option value="">Select Units</option>
                  {category &&
                    unitsByCategory[category].map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-50 mx-2">
                <label htmlFor="origin" className="form-label">
                  Origin:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="d-flex justify-content-around">
              <div className="w-50 mx-2">
                <label htmlFor="destination" className="form-label">
                  Destination:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
              <div className="w-50 mx-2">
                <label htmlFor="status" className="form-label">
                  Status:
                </label>
                <select
                  className="form-control"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="In-Process">In-Process</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-around">
              <div className="w-50 mx-2">
                <label htmlFor="price" className="form-label">
                  Price per Unit:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="price"
                  value={price}
                  readOnly
                />
              </div>
              <div className="w-50 mx-2">
                <label htmlFor="totalPrice" className="form-label">
                  Total Price:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="totalPrice"
                  value={totalPrice}
                  readOnly
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3 create">
              Create
            </button>
          </form>
        </div>
      </div>
      <div className="shipment-list text-light w-35">
        <h1>All Shipments</h1>
        {shipments.length > 0 ? (
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th scope="col">Sender Name</th>
                <th scope="col">Receiver Name</th>
                <th scope="col">Status</th>
                <th scope="col">Product ID</th>
                <th scope="col">Invoices</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment._id}>
                  <td>{shipment.sendername}</td>
                  <td>{shipment.receivername}</td>
                  <td>{shipment.status}</td>
                  <td>{shipment.productId}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => generateInvoice(shipment)}
                    >
                      Generate Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No shipments available</p>
        )}
      </div>
      <div
        ref={invoiceRef}
        style={{ position: "absolute", left: "-9999px" }}
      ></div>
    </div>
  );
}
