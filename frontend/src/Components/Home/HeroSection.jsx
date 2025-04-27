import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import curveImg from "../assets/curve.png";

// 🎈 Custom Floating Elements
const FloatingElement = ({ top, left, size, color, blur, delay, rotate }) => (
  <motion.div
    className={`absolute rounded-full ${blur ? "backdrop-blur-md" : ""}`}
    style={{
      top,
      left,
      width: size,
      height: size,
      background: color,
      filter: blur ? "blur(20px)" : "none",
      opacity: 0.3,
    }}
    initial={{ y: 0, rotate: 0 }}
    animate={{ y: [0, -30, 0], rotate: rotate ? [0, 360, 0] : 0 }}
    transition={{
      duration: 10,
      ease: "easeInOut",
      repeat: Infinity,
      delay,
    }}
  />
);

const HeroSection = () => {
  const parallaxRef = useRef(null);

  return (
    <section
      className="relative flex flex-col items-center justify-center h-screen w-screen fixed inset-0 text-center overflow-hidden"
      ref={parallaxRef}
      style={{
        background: "radial-gradient(circle at 50% 50%, #f5f7fa, #c3cfe2)",
      }}
    >
      {/* 🌟 Floating Elements */}
      <FloatingElement top="10%" left="15%" size="100px" color="#FFD700" delay={0} blur />
      <FloatingElement top="25%" left="70%" size="80px" color="#FF69B4" delay={1} rotate />
      <FloatingElement top="60%" left="40%" size="60px" color="#87CEFA" delay={1.5} blur />
      <FloatingElement top="70%" left="20%" size="90px" color="#7B68EE" delay={2} rotate />
      <FloatingElement top="80%" left="80%" size="50px" color="#FF8C00" delay={2.5} blur />
      <FloatingElement top="40%" left="50%" size="70px" color="#00FA9A" delay={3} rotate />
      <FloatingElement top="20%" left="85%" size="60px" color="#20B2AA" delay={1.2} blur />

      {/* 🌈 Hero Text */}
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center max-w-4xl mx-auto p-6"
      >
        <h1 className="text-6xl sm:text-8xl font-extrabold bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 text-transparent bg-clip-text leading-tight animate-pulse">
          <ReactTyped
            className="font-bold"
            strings={["Elevate", "Optimize", "Conquer"]}
            typeSpeed={50}
            backSpeed={50}
            loop
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="text-xl font-bold sm:text-3xl text-gray-800 max-w-2xl mt-6 shadow-lg p-4 bg-white bg-opacity-40 rounded-lg backdrop-blur-md"
        >
          A comprehensive platform for developers to monitor progress, visualize achievements, and connect with the coding community. <br />
          <span className="inline-block relative text-center">
            <span className="relative z-20 text-blue-500 font-extrabold text-2xl tracking-wide drop-shadow-lg">
              Launch<span className="text-pink-500">Track</span>
            </span>
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
              src={curveImg}
              className="absolute top-full left-1 transform -translate-x-1/2 w-36"
              width="170"
              height="20"
              alt="Curve"
            />
          </span>
        </motion.p>
      </motion.div>

      {/* 🚀 Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 1 }}
        className="relative z-10 mt-10 flex flex-wrap justify-center gap-8"
      >
        <motion.a
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          href="/question-tracker"
          className="px-8 py-4 text-xl font-semibold text-white border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition shadow-lg bg-black bg-opacity-40 backdrop-blur-lg"
        >
          Question Tracker
        </motion.a>

        <motion.a
          whileHover={{ scale: 1.1, rotate: -3 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          href="/profile"
          className="px-8 py-4 text-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
        >
          Profile Tracker
        </motion.a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
