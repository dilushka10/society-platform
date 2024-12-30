import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  FormOutlined,
  MoneyCollectOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // Get the current location

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev); // Toggle the collapsed state
  };

  const menuItems = [
    { label: "Home", icon: <HomeOutlined />, link: "/" },
    { label: "Members", icon: <UserOutlined />, link: "/members" },
    { label: "Meetings", icon: <FormOutlined />, link: "/meetings" },
    { label: "Payments", icon: <MoneyCollectOutlined />, link: "/payments" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex ${
          collapsed ? "w-16" : "w-52"
        } bg-[#0D47A1] text-white flex-col justify-between h-screen transition-all duration-300 font-custom`}
      >
        {/* Top Section */}
        <div>
          <div className="flex items-center justify-center bg-[#0B3A91] h-16 border-b border-[#073574]">
            <button
              onClick={toggleCollapse}
              className="text-white hover:text-gray-300 focus:outline-none"
            >{!collapsed && <span className="mr-8">LOGO</span>}
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
          </div>

          {/* Menu */}
          <nav className="mt-6">
            <ul className="space-y-2 px-4">
              {menuItems.map((item) => (
                <li
                  key={item.label}
                  className={`flex items-center space-x-4 hover:bg-[#1565C0] p-2 rounded text-sm transition-all ${
                    location.pathname === item.link ? "bg-[#1565C0]" : ""
                  }`}
                >
                  <Link to={item.link} className="flex items-center space-x-4">
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4">
          <Link
            to="/logout"
            className={`w-full flex items-center justify-center space-x-3 bg-[#1565C0] hover:bg-[#1E88E5] text-white py-2 px-4 rounded text-sm transition-all ${
              location.pathname === "/logout" ? "bg-[#1E88E5]" : ""
            }`}
          >
            <LogoutOutlined className="text-lg" />
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-[#497afb] shadow-lg py-2 flex justify-around items-center md:hidden z-10">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.link}
            className={`flex flex-col items-center ${
              location.pathname === item.link ? "text-blue-600" : "text-white"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navbar;
