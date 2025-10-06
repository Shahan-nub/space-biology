"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MusicPlayer } from "./MusicPlayer";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-sm border-b border-gray-800 py-4 px-8">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Left: Logo */}
        <Link href="/" passHref>
          <motion.h1
            className="cursor-pointer text-2xl max-sm:text-base text-center font-bold text-indigo-400 tracking-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            SpaceBio Explorer
          </motion.h1>
        </Link>

        {/* Center: Music Player */}
        <div className="absolute left-1/2 -translate-x-1/2 max-sm:hidden">
          <MusicPlayer />
        </div>

        {/* Right: Navigation Links */}
        <ul className="flex gap-8 text-gray-300 text-sm md:text-base">
          <li>
            <Link href="/explore" className="hover:text-indigo-400 transition">
              Explore
            </Link>
          </li>
          <li>
            <Link href="/search" className="hover:text-indigo-400 transition">
              Search
            </Link>
          </li>
          {/* <li>
          <Link href="#footer" className="hover:text-indigo-400 transition">
            Contact
          </Link>
        </li> */}
        </ul>
      </div>
    </nav>
  );
};
