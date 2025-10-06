// --- Footer ---
export const Footer: React.FC = () => {
  return (
    <footer
      id="footer"
      className="bg-black border-t border-gray-800 py-10 text-center text-gray-400 text-sm"
    >
      <p>Built with ❤️ for NASA Space Apps Challenge 2025 — Team Techlicious</p>
      <p className="mt-2 text-gray-500">
        © {new Date().getFullYear()} Team Techlicious. All rights reserved.
      </p>
    </footer>
  );
};
