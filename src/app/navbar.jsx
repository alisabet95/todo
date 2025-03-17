"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const currentPath = usePathname();
  const [time, setTime] = useState("");
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const userDropdownRef = useRef(null);
  const userButtonRef = useRef(null);

  const { status, data: session } = useSession();

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

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
    }
    if (
      userDropdownRef.current &&
      !userDropdownRef.current.contains(event.target) &&
      !userButtonRef.current.contains(event.target)
    ) {
      setUserDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen || userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, userDropdownOpen]);

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime(); // Initial time update
    const timerId = setInterval(updateTime, 60000);

    return () => clearInterval(timerId);
  }, []);

  console.log(session);

  return (
    <nav className="bg-blue-400 rounded-lg p-4 shadow-md">
      <ul className="navbar-links flex flex-wrap items-center space-x-4">
        <p className="text-white text-left fade-in">{time}</p>
        {status === "authenticated" && (
          <li className="relative">
            <button
              onClick={toggleUserDropdown}
              className="text-lg text-red-800 bg-none"
              style={{
                backgroundColor: "transparent",
                border: "solid black 0.5px",
              }}
              ref={userButtonRef}
            >
              {session.user.username
                ? session.user.username.charAt(0).toUpperCase() +
                  session.user.username.slice(1)
                : "Google user"}
              🔻
            </button>
            {userDropdownOpen && (
              <ul
                className="dropdown-menu absolute bg-cyan-400 rounded-lg shadow-lg mt-2 p-2 flex flex-col space-y-2"
                ref={userDropdownRef}
              >
                <li>
                  <button
                    onClick={() => signOut()}
                    className="hover-effect text-left w-full"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        )}
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
            className="button-drop text-xl text-white py-2 px-4"
            ref={buttonRef}
            style={{
              padding: "5px",
              border: "solid black 0.5px",
            }}
          >
            Menu🔻
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
                <Link href="/products" className="hover-effect">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/logout" className="hover-effect">
                  Logout
                </Link>
              </li>
              <li>
                <Link href="/sorting" className="hover-effect">
                  Sorting
                </Link>
              </li>

              <li>
                <Link href="/even" className="hover-effect">
                  Odd Or Even
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
