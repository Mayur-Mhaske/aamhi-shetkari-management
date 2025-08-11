import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);
import { toast } from "react-toastify";

export default function UserDashboard() {
  const [skills, setSkills] = useState([
    { name: "React", progress: 80 },
    { name: "Node.js", progress: 65 },
    { name: "MongoDB", progress: 50 },
    { name: "HTML", progress: 90 },
  ]);

  const [newSkill, setNewSkill] = useState({ name: "", progress: "" });

  const handleChange = (e) => {
    setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/skills",
        newSkill,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSkills([...skills, res.data]);
      setNewSkill({ name: "", progress: "" });
    } catch (err) {
      toast.error("Failed to add skill");
    }
  };

  const data = {
    labels: skills.map((skill) => skill.name),
    datasets: [
      {
        label: "Skill Progress (%)",
        data: skills.map((skill) => skill.progress),
        backgroundColor: "#8b5cf6",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Skill Progress Chart" },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
        Welcome to User Dashboard
      </h2>

      {/* Skill Form */}
      <form
        onSubmit={handleAddSkill}
        className="bg-white p-4 rounded-lg shadow-md max-w-2xl mx-auto mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            name="name"
            placeholder="Skill name"
            value={newSkill.name}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg w-full"
            required
          />
          <input
            type="number"
            name="progress"
            placeholder="Progress (%)"
            value={newSkill.progress}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg w-full"
            required
            min="0"
            max="100"
          />
          <button
            type="submit"
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition"
          >
            Add
          </button>
        </div>
      </form>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md max-w-3xl mx-auto">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
