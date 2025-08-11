import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-purple-800 mb-6 text-center">
        SkillSync Pro 🚀
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        One platform for students to upskill, mentors to earn, and admins to
        manage it all.
      </p>
      <div className="flex space-x-4">
        <Link to="/login">
          <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg shadow-md transition">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="bg-white hover:bg-gray-100 text-purple-700 border border-purple-700 px-6 py-3 rounded-lg shadow-md transition">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
