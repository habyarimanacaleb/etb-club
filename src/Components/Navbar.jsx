import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/programs", label: "Programs" },
    { to: "/projects", label: "Projects" },
    // { to: "/mentorship", label: "Mentorship" },
    { to: "/community", label: "Community" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
    <nav className="bg-white shadow-md px-4 py-2 border-b border-gray-200 fixed w-full z-10">
      <div className="container mx-auto px-0 lg:px-4 py-3 flex items-center justify-between">
        <div className='flex items-center hover:scale-105 transition-all hover:rotate-1'>
        <NavLink to="/" className="text-2xl font-bold text-blue-600">
          ETB
        </NavLink>
        <p className='text-[10px] mt-2'>Engineering Tech Builds</p>
        </div>

       
        <ul className="hidden md:flex space-x-3 lg:space-x-6 text-gray-700 font-medium">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `hover:text-blue-800 ${isActive ? "text-blue-600 font-semibold" : ""}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        
        <NavLink to="/register" className="hidden sm:inline">
          <button className="ml-4 px-6 py-2 border-2 border-blue-600 duration-300 hover:text-white rounded-full hover:bg-blue-800 transition ease-in-out font-semibold">
            Sign up
          </button>
        </NavLink>

        
        <button
          className="md:hidden text-gray-500 hover:rotate-90 transition-all ease-in-out bg-gray-300 p-1 rounded-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      
      {isOpen && (
        <ul className="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-3 text-gray-700 font-medium">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `block hover:text-blue-600 ${isActive ? "text-blue-600 font-semibold" : ""}`
                }
                onClick={() => setIsOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink
              to="/register"
              className="block text-blue-600 font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Join Cohort
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
    <div className='pb-16'></div>
    </>
  );
};

export default Navbar;
