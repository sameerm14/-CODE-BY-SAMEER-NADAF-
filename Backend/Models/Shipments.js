import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    sendername: {
      type: String,
      required: true,
    },
    receivername: {
      type: String,
      required: true,
    },
    senderaddress: {
      type: String,
      required: true,
    },
    receiveraddress: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    itemname: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    units: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { collection: "shipments-data" }
);

const Shipment = mongoose.model("Shipments", shipmentSchema);

export default Shipment;
