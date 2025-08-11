import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roleFromStorage = localStorage.getItem("role");
    if (!token) navigate("/login");
    else setRole(roleFromStorage);
  }, [navigate]);

  const blocks = [
    { id: 1, title: "Customers", path: "/customers" },
    { id: 2, title: "Daily Data Entry", path: "/daily-entry" },
    { id: 3, title: "Monthly Hishob", path: "/monthly-hishob" },
    { id: 4, title: "Warehouse Report", path: "/warehouse-report" },
    { id: 5, title: "Overall Analysis", path: "/overall-analysis" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-purple-700">Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition"
          >
            Logout
          </button>
        </div>

        <p className="mb-6 text-gray-600">
          Welcome, <strong>{role === "admin" ? "Admin" : "User"}</strong>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blocks.map((block) => (
            <div
              key={block.id}
              onClick={() => navigate(block.path)}
              className="cursor-pointer p-6 bg-gray-100 hover:bg-purple-100 text-center rounded-xl shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {block.title}
              </h3>
            </div>
          ))}
        </div>

        {role === "admin" && (
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/admin")}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Go to Admin Panel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
