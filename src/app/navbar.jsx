"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import classNames from "classnames";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentPath = usePathname();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const links = [
    { name: "Home", href: "/" },
    { name: "To-Do", href: "/todo" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
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

  // Debug: Log the current path and comparisons

  return (
    <nav className="flex-1 my-1">
      <ul className="navbar-links flex flex-wrap items-center">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className={classNames({
                underline: currentPath === link.href,
              })}
            >
              {link.name}
            </Link>
          </li>
        ))}
        <li className="relative">
          <button
            onClick={toggleDropdown}
            className="button-drop text-xl"
            ref={buttonRef}
          >
            Menu
          </button>
          {dropdownOpen && (
            <ul
              className="dropdown-menu dropdown-menu-below flex-col"
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
