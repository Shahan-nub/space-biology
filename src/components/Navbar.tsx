"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-gray-800 py-4 px-8 flex justify-between items-center">
      <motion.h1
        className="text-2xl max-sm:text-base text-center font-bold text-indigo-400 tracking-tight"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        SpaceBio Explorer
      </motion.h1>

      <ul className="flex gap-8 text-gray-300 text-sm md:text-base">
        <li>
          <Link href="/" className="hover:text-indigo-400 transition">
            About
          </Link>
        </li>
        <li>
          <Link href="/search" className="hover:text-indigo-400 transition">
            Search
          </Link>
        </li>
        <li>
          <Link href="#footer" className="hover:text-indigo-400 transition">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};
