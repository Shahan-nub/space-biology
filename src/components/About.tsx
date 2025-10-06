"use client";

import { motion } from "framer-motion";

// --- About Section ---
export const AboutSection: React.FC = () => {
  const features = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      title: "Mission",
      description:
        "To bridge data and discovery by making decades of space biology research easily searchable and understandable through cutting-edge AI technology.",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-900/20 to-pink-900/10",
      borderColor: "border-purple-500/30",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Technology",
      description:
        "Powered by advanced Natural Language Processing, Knowledge Graphs, and Embedding Models that capture semantic relationships between research topics.",
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-900/20 to-blue-900/10",
      borderColor: "border-cyan-500/30",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Impact",
      description:
        "Enabling scientists and the public to explore how organisms adapt, grow, and evolve beyond Earth's boundaries with unprecedented ease.",
      gradient: "from-pink-500 to-purple-500",
      bgGradient: "from-pink-900/20 to-purple-900/10",
      borderColor: "border-pink-500/30",
    },
  ];

  return (
    <section
      id="about"
      className="relative bg-gradient-to-b from-black via-gray-950 to-black text-gray-200 py-24 px-6 md:px-20 border-t border-gray-800 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.3) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-purple-500/30 rounded-full mb-6 backdrop-blur-sm"
          >
            <span className="text-sm font-medium text-purple-300">
              About the Project
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Powered by Innovation
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
            Built for{" "}
            <span className="text-purple-400 font-semibold">
              NASA Space Apps
            </span>
            , this project leverages machine learning to analyze over{" "}
            <span className="text-cyan-400 font-semibold">
              600 research papers
            </span>{" "}
            on space biology. It empowers researchers, students, and enthusiasts
            to instantly discover relevant findings and understand how life
            functions in space environments.
          </p>
        </motion.div>
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              {/* Card Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 rounded-2xl`}
              ></div>

              {/* Card */}
              <div
                className={`relative h-full p-8 bg-gradient-to-br ${feature.bgGradient} border ${feature.borderColor} rounded-2xl backdrop-blur-sm shadow-xl transition-all duration-300`}
              >
                {/* Icon */}
                <motion.div
                  className={`inline-flex p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 shadow-lg`}
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-white">{feature.icon}</div>
                </motion.div>

                {/* Title */}
                <h3
                  className={`text-2xl font-bold mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 w-20 h-20 opacity-10">
                  <div
                    className={`w-full h-full bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl`}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-8 bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-gray-800 rounded-2xl backdrop-blur-sm"
        >
          <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Powered By
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { name: "Next.js 15", icon: "⚡" },
              { name: "React Force Graph", icon: "🌐" },
              { name: "NLP & AI", icon: "🤖" },
              { name: "Knowledge Graphs", icon: "🔗" },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="p-4 bg-gray-800/40 border border-gray-700 rounded-xl"
              >
                <div className="text-3xl mb-2">{tech.icon}</div>
                <div className="text-sm text-gray-400 font-medium">
                  {tech.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
