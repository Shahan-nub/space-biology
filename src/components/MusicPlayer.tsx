"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2); // Set to 60%
  const [showVolume, setShowVolume] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio("/track.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Autoplay with user interaction handling
  useEffect(() => {
    const attemptAutoplay = async () => {
      if (audioRef.current && !hasInteracted) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setHasInteracted(true);
        } catch (error) {
          // Autoplay blocked - will play on first user interaction
          console.log("Autoplay blocked, waiting for user interaction");
        }
      }
    };

    // Try autoplay after a short delay
    const timer = setTimeout(attemptAutoplay, 500);

    // Also try on first user interaction
    const handleInteraction = async () => {
      if (!hasInteracted && audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setHasInteracted(true);
        } catch (error) {
          console.error("Playback failed:", error);
        }
      }
    };

    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("keydown", handleInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [hasInteracted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
      setHasInteracted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group"
    >
      {/* Pill Container with Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>

      <div className="relative flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-full shadow-2xl">
        {/* Spinning CD Animation */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          {/* CD Disc */}
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={
              isPlaying
                ? {
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }
                : { duration: 0.5 }
            }
            className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 shadow-lg"
          >
            {/* CD Center Hole */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-900 border border-gray-600"></div>
            </div>
            {/* CD Reflection Lines */}
            <div className="absolute inset-0 rounded-full overflow-hidden opacity-40">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-px bg-white"
                  style={{
                    top: "50%",
                    transform: `rotate(${i * 45}deg)`,
                    transformOrigin: "center",
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Play/Pause Icon Overlay */}
          <motion.button
            onClick={togglePlay}
            className="relative z-10 w-10 h-10 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.svg
                  key="pause"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="w-5 h-5 text-white drop-shadow-lg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="play"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="w-5 h-5 text-white drop-shadow-lg ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>

        {/* Volume Control */}
        <div
          className="relative flex items-center gap-2"
          onMouseEnter={() => setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
        >
          <motion.button
            className="text-gray-400 hover:text-white transition-colors p-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {volume === 0 ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : volume < 0.5 ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 9v6h4l5 5V4l-5 5H7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </motion.button>

          {/* Volume Percentage Display */}
          <span className="text-xs font-semibold text-gray-400 w-8 text-center">
            {Math.round(volume * 100)}%
          </span>

          {/* Volume Slider */}
          <AnimatePresence>
            {showVolume && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-3 bg-gray-900/95 backdrop-blur-xl border border-gray-700/80 rounded-2xl p-4 shadow-2xl"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium">
                    Volume
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-28 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(236, 72, 153) ${
                        volume * 100
                      }%, rgb(55, 65, 81) ${
                        volume * 100
                      }%, rgb(55, 65, 81) 100%)`,
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>

        {/* Music Label with Equalizer Animation */}
        <div className="flex items-center gap-2 min-w-[100px]">
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="playing"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <div className="flex gap-0.5 items-end h-4">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-gradient-to-t from-purple-500 via-pink-500 to-cyan-400 rounded-full"
                      animate={{
                        height: ["6px", "16px", "6px"],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-300 whitespace-nowrap font-semibold">
                  Now Playing
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="paused"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
                  Paused
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
