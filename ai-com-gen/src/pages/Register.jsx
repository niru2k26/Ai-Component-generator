import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Registered successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#0f0f0f] text-white">
      
      <div className="w-[350px] bg-[#141319] p-8 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6 sp-text">
          Create Account 🚀
        </h2>

        <input
          className="w-full p-3 mb-4 rounded-lg bg-[#09090B] border border-gray-700 outline-none"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 rounded-lg bg-[#09090B] border border-gray-700 outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 🔐 Password with Eye Icon */}
        <div className="relative w-full mb-4">
          <input
            className="w-full p-3 pr-10 rounded-lg bg-[#09090B] border border-gray-700 outline-none"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-purple-600 hover:opacity-80 py-3 rounded-lg font-semibold"
        >
          Register
        </button>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-purple-400 cursor-pointer"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;