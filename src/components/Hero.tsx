import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState } from 'react';

// --- Types ---
interface SearchResult {
  title: string;
  author: string;
  text: string;
}

// --- Hero Section ---
export const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white px-6 py-24">
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Exploring the Biology of Space
      </motion.h1>
      <motion.p
        className="max-w-2xl text-lg md:text-xl text-gray-300 mb-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Unlock insights from 600+ NASA space biology publications. Search and explore how life adapts beyond Earth.
      </motion.p>
      <motion.a
        href="#search"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
      >
        Start Exploring
      </motion.a>
    </section>
  );
};




