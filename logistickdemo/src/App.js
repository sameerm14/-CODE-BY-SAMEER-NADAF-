import { Routes, Route } from "react-router-dom";
import Services from "./Services/Services";
import Home from "./Home/Home";
import Contact from "./Contact/Contact";
import ShipmentManage from "./Services/Shipmentfolder/ShipmentManage";
import Reportingmanage from "./Services/Reportingfolder/Reportingmanage";
import Inventorymanage from "./Services/Inventoryfolder/Inventorymanage";
import TrackingManage from "./Services/Trackingfolder/TrackingManage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shipmentmanage" element={<ShipmentManage />} />
        <Route path="/trackingmanage" element={<TrackingManage />} />
        <Route path="/reportingmanage" element={<Reportingmanage />} />
        <Route path="/inventorymanage" element={<Inventorymanage />} />
      </Routes>
    </div>
  );
}

export default App;
