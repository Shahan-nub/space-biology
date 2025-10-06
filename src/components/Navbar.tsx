"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MusicPlayer } from "./MusicPlayer";
import { useState } from "react";
import { usePathname } from "next/navigation";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Explore", path: "/explore", icon: "🚀" },
    { name: "Search", path: "/search", icon: "🔍" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 bg-gradient-to-b from-black via-black/95 to-transparent backdrop-blur-md border-b border-gray-800/50"
    >
      {/* Animated gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

      <div className="flex justify-between items-center max-w-7xl mx-auto py-4 px-6 md:px-8">
        {/* Left: Logo with Gradient */}
        <Link href="/" passHref>
          <motion.div
            className="group cursor-pointer flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {/* Logo Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>

            {/* Logo Text */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SpaceBio
              </h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
                Explorer
              </p>
            </div>
          </motion.div>
        </Link>

        {/* Center: Music Player */}
        <div className="absolute left-1/2 -translate-x-1/2 max-sm:hidden">
          <MusicPlayer />
        </div>

        {/* Right: Navigation Links */}
        <ul className="flex gap-2 md:gap-4">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link href={link.path}>
                <motion.div
                  className={`relative px-4 py-2 rounded-xl text-sm md:text-base font-medium transition-all ${
                    isActive(link.path)
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onHoverStart={() => setHoveredLink(link.path)}
                  onHoverEnd={() => setHoveredLink(null)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Active indicator */}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 border border-indigo-500/50 rounded-xl"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  {/* Hover effect */}
                  {hoveredLink === link.path && !isActive(link.path) && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}

                  {/* Link content */}
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-base">{link.icon}</span>
                    <span className="max-sm:hidden">{link.name}</span>
                  </span>
                </motion.div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-sm"></div>
    </motion.nav>
  );
};
