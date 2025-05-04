import React from "react";
import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import Navbar from "../components/Navbar";
import assets from "../assets/assets";

const Home = () => {
  return (
    <div className="font-default flex flex-col min-h-screen items-center bg-[url(/bg_img.png)]">
      <Navbar />

      <div className="flex flex-col gap-4 items-center mt-20 py-4 text-center text-gray-800">
        <div>
          <img
            src={assets.header_img}
            className="w-36 h-36 rounded-full mb-6"
            alt="Header"
          />
        </div>

        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex items-center space-x-2"
        >
          <span className="text-lg sm:text-2xl font-semibold">
            Hey Developer
          </span>
          <span>
            <img
              src={assets.hand_wave}
              className="w-8 aspect-square"
              alt="Wave"
            />
          </span>
        </motion.h2>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-bold"
        >
          Welcome to our App
        </motion.h1>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="ssm:px-2"
        >
          Let's start with a quick product tour and we will have you up and
          running in no time!
        </motion.div>

        <motion.button
          className="rounded-full px-8 py-2.5 flex items-center gap-2 border border-gray-500 hover:bg-gray-100 transition-all"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
};

export default Home;
