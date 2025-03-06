"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import classNames from "classnames";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentPath = usePathname();
  const [time, setTime] = useState(new Date());
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const links = [
    { name: "Home", href: "/" },
    { name: "To-Do", href: "/todo" },
    { name: "RPC Game", href: "/rpcgame" },
    { name: "Album", href: "/album" },
    { name: "Ali", href: "/stuff" },
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 60000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <nav className="bg-blue-400 rounded-lg p-4 shadow-md">
      <ul className="navbar-links flex flex-wrap items-center space-x-4">
        <p className="text-white text-left fade-in">
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className={classNames({
                underline: currentPath === link.href,
                "text-white": currentPath !== link.href,
              })}
            >
              {link.name}
            </Link>
          </li>
        ))}
        <li className="relative">
          <button
            onClick={toggleDropdown}
            className="button-drop text-xl text-white"
            ref={buttonRef}
          >
            Menu
          </button>
          {dropdownOpen && (
            <ul
              className="dropdown-menu absolute bg-cyan-400 rounded-lg shadow-lg mt-2 p-2 flex flex-col space-y-2"
              ref={dropdownRef}
            >
              <li>
                <Link
                  className={classNames({
                    underline: currentPath === "/profile",
                    "hover-effect": true,
                  })}
                  href="/profile"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover-effect">
                  Settings
                </Link>
              </li>
              <li>
                <Link href="/logout" className="hover-effect">
                  Logout
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
