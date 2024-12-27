import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  const [selected, setSelected] = useState("Home");

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    
  };

  const menuItems = [
    { label: "Home", icon: <HomeOutlined />, link: "/" },
    { label: "Members", icon: <UserOutlined />, link: "/members" },
    { label: "Conference", icon: <FormOutlined />, link: "/conference" },
    { label: "Payment", icon: <MoneyCollectOutlined />, link: "/payment" },
    { label: "Logout", icon: <LogoutOutlined />, link: "/logout" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex ${
          collapsed ? "w-16" : "w-64"
        } bg-[#0D47A1] text-white flex-col justify-between h-screen transition-all duration-300 font-custom`}
      >
        {/* Top Section */}
        <div>
          <div className="flex items-center justify-center bg-[#0B3A91] h-16  border-b border-[#073574]">
           
            <button
              onClick={toggleCollapse}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
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
                    selected === item.label ? "bg-[#1565C0]" : ""
                  }`}
                  onClick={() => setSelected(item.label)}
                >
                  {item.icon}
                  {!collapsed && <Link to={item.link}>{item.label}</Link>}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4">
          <Link
            to="/logout"
            className="w-full flex items-center justify-center space-x-3 bg-[#1565C0] hover:bg-[#1E88E5] text-white py-2 px-4 rounded text-sm transition-all"
          >
            <LogoutOutlined className="text-lg" />
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-svw bg-white shadow-lg py-2 flex justify-around items-center md:hidden z-10">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.link}
            className={`flex flex-col items-center ${
              selected === item.label ? "text-blue-600" : "text-gray-500"
            }`}
            onClick={() => setSelected(item.label)}
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
