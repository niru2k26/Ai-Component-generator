import React, { useState, useEffect } from 'react'
import { FaUser, FaHistory } from 'react-icons/fa'
import { HiSun, HiMoon } from 'react-icons/hi'
import { RiSettings3Fill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true)
  const [showUser, setShowUser] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  // ✅ Check login + get user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    setIsLoggedIn(!!token);

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // 🌙 Theme toggle
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-[#0f0f0f]", "text-white")
      document.body.classList.remove("bg-white", "text-black")
    } else {
      document.body.classList.remove("bg-[#0f0f0f]", "text-white")
      document.body.classList.add("bg-white", "text-black")
    }
  }, [darkMode])

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowUser(false);
    navigate("/login");
  };

  return (
    <>
      <div className="nav flex items-center justify-between px-[100px] h-[90px] border-b border-gray-800 relative">

        {/* LOGO */}
        <div className="logo cursor-pointer" onClick={() => navigate("/")}>
          <h3 className='text-[25px] font-[700] sp-text'>GenUI</h3>
        </div>

        {/* ICONS */}
        <div className="icons flex items-center gap-[18px] text-[20px]">

          {/* 🕘 HISTORY */}
          <div
            className="icon cursor-pointer hover:text-purple-400"
            onClick={() => {
              if (!isLoggedIn) {
                navigate("/login");
              } else {
                navigate("/history");
              }
            }}
            title="History"
          >
            <FaHistory />
          </div>

          {/* 🌞 DARK MODE */}
          <div
            className="icon cursor-pointer hover:text-yellow-400"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <HiSun /> : <HiMoon />}
          </div>

          {/* 👤 USER */}
          <div
            className="icon cursor-pointer hover:text-blue-400"
            onClick={() => {
              if (!isLoggedIn) {
                navigate("/login");
              } else {
                setShowUser(!showUser)
                setShowSettings(false)
              }
            }}
          >
            <FaUser />
          </div>

          {/* ⚙️ SETTINGS */}
          <div
            className="icon cursor-pointer hover:text-green-400"
            onClick={() => {
              setShowSettings(!showSettings)
              setShowUser(false)
            }}
          >
            <RiSettings3Fill />
          </div>
        </div>

        {/* 👤 USER DROPDOWN */}
        {
          showUser && isLoggedIn && (
            <div className="absolute right-[120px] top-[80px] bg-[#1a1a1a] p-4 rounded-xl shadow-lg w-[200px] z-50">
              <p className="font-bold">User Profile</p>

              <p className="text-sm text-gray-400 mt-1">
                {user?.name || "User"}
              </p>

              <button
                onClick={handleLogout}
                className="mt-3 w-full bg-blue-500 p-2 rounded-lg hover:opacity-80"
              >
                Logout
              </button>
            </div>
          )
        }

        {/* ⚙️ SETTINGS PANEL */}
        {
          showSettings && (
            <div className="absolute right-[50px] top-[80px] bg-[#1a1a1a] p-4 rounded-xl shadow-lg w-[220px] z-50">
              <p className="font-bold">Settings</p>

              <div className="mt-3">
                <label className="text-sm">Theme</label>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-full mt-1 p-2 bg-gray-700 rounded-lg"
                >
                  Toggle Theme
                </button>
              </div>

              <div className="mt-3">
                <label className="text-sm">Version</label>
                <p className="text-gray-400 text-sm">v1.0</p>
              </div>
            </div>
          )
        }

      </div>
    </>
  )
}

export default Navbar