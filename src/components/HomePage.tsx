"use client"

import { useState } from "react";
import { AboutSection } from "./About";
import { HeroSection } from "./Hero";
import {motion} from 'framer-motion';
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

// --- Types ---
interface SearchResult {
  title: string;
  author: string;
  text: string;
}

// --- Example Integration ---
export const HomePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

//   const handleSearch = async () => {
//     setLoading(true);
//     const res = await fetch('/api/search', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ query, top_k: 5 }),
//     });
//     const data = await res.json();
//     setResults(data.results);
//     setLoading(false);
//   };

  return (
    <main className="bg-black text-white min-h-screen">
      <HeroSection />
      <AboutSection />
    </main>
  );
};