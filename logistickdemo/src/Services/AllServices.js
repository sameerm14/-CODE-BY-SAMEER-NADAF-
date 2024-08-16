import React from "react";
import "./AllServices.css";

export default function AllServices() {
  return (
    <div className="divi mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <div className="nav-sidebar bg-dark">
              <ul className="nav nav-pills flex-column" id="services-nav">
                <li className="nav-item">
                  <a
                    className="nav-link text-white text-decoration-none"
                    href="/shipmentmanage"
                    data-toggle="pill"
                  >
                    Shipments
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link text-white text-decoration-none"
                    href="/trackingmanage"
                    data-toggle="pill"
                  >
                    Tracking
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link text-white text-decoration-none"
                    href="/inventorymanage"
                    data-toggle="pill"
                  >
                    Inventory
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
