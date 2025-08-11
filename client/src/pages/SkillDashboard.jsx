import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function SkillDashboard() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Beginner");

  // 🔸 Fetch user role and token
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // 🔹 Fetch skills on load
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/skills", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(res.data);
    } catch (err) {
      toast.error("Failed to load skills");
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/skills/add",
        { name, level },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.msg);
      setName("");
      setLevel("Beginner");
      fetchSkills(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.error || "Error adding skill");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Skill deleted");
      fetchSkills();
    } catch (err) {
      toast.error("Error deleting skill");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Skill Tracker</h2>

      <form onSubmit={handleAddSkill} className="space-y-4">
        <input
          type="text"
          placeholder="Skill name (e.g., React)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded-lg"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800"
        >
          Add Skill
        </button>
      </form>

      <hr className="my-6" />

      <div>
        <h3 className="text-lg font-semibold mb-2">Your Skills:</h3>
        {skills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          skills.map((skill) => (
            <div
              key={skill._id}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded mb-2"
            >
              <div>
                <p className="font-medium">{skill.name}</p>
                <p className="text-sm text-gray-500">{skill.level}</p>
              </div>
              <button
                onClick={() => handleDelete(skill._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
