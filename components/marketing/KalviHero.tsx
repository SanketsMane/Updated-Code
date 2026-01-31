"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function KalviHero() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="absolute inset-0 h-full w-full bg-grid-kalvi" />
        <div className="absolute inset-0 h-full w-full bg-radial-fade" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-sm font-bold tracking-wide"
          >
            NEET PG 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-7xl"
          >
            India's Best <span className="text-blue-600">NEET PG</span> <br />
            <span className="text-slate-800">Preparation Courses</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-lg md:text-xl leading-relaxed text-slate-600 max-w-2xl"
          >
            NEET PG/INI-CET preparation comes with an overwhelming pressure, 
            a vast syllabus, and limited time. That’s exactly why we built 
            <span className="font-bold text-slate-900"> Version X</span>—to simplify tough concepts, 
            boost retention, and make every minute of your prep count.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 flex items-center justify-center gap-x-6"
          >
            <Link
              href="/register"
              className="rounded-xl bg-[#2D334A] px-10 py-4 text-base font-bold text-white shadow-xl hover:bg-[#1E2235] transition-all transform hover:scale-105"
            >
              Enrol now
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
