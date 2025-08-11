import React from "react";
import AddStockForm from "../components/AddStockForm";
import WarehouseReport from "../components/WarehouseReport";

export default function Warehouse() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Warehouse Management</h1>
      <AddStockForm onStockAdded={() => window.location.reload()} />
      <WarehouseReport />
    </div>
  );
}
