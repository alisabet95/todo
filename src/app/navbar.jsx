"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import classNames from "classnames";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentPath = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "To-Do", href: "/todo" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="flex-col">
      <ul className="navbar-links flex-col">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              className={classNames({
                "text-slate-800": currentPath === link.href,
                "bg-slate-500": currentPath === link.href,
              })}
              href={link.href}
            >
              {link.name}
            </Link>
          </li>
        ))}
        <li>
          <button
            onTouchMove={toggleDropdown}
            onClick={toggleDropdown}
            className="hover-effect"
          >
            Menu
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu flex-column">
              <li>
                <Link href="/profile" className="hover-effect">
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
