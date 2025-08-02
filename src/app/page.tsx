'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Re-using the same great icons
const CollaborateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const AIIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 16.84c.425-.219.751-.69.826-1.212C10.593 14.943 11 14.25_11 13.5c0-.966-.394-1.84-1.03-2.478C9.278 10.323 8.423 10 7.5 10c-.923 0-1.778.323-2.47.922C4.394 11.66 4 12.534 4 13.5c0 .75.407 1.443.51 2.128.075.522.401.993.826 1.212" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.5c.69 0 1.25.56 1.25 1.25S17.19 11 16.5 11h-9c-.69 0-1.25-.56-1.25-1.25S6.81 8.5 7.5 8.5h9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 20a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h12z" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};


export default function Home() {
  return (
    <div data-theme="dark" className="bg-gradient-animation">
      {/* Navbar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="navbar bg-base-100/30 backdrop-blur-lg shadow-lg fixed top-0 z-50"
      >
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">SmartBoard</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><Link href="#features">Features</Link></li>
            <li><Link href="#how-it-works">How It Works</Link></li>
          </ul>
           <Link href="/login" className="btn btn-ghost">
                Login
            </Link>
          <Link href="/register" className="btn btn-primary ml-2">
            Sign Up
          </Link>
        </div>
      </motion.div>

      {/* Hero Section */}
      <div className="hero min-h-screen">
        <div className="hero-overlay bg-opacity-10"></div>
        <div className="hero-content text-center text-neutral-content">
          <motion.div
            className="max-w-md"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={fadeIn} className="mb-5 text-5xl font-bold">Collaborate Without Limits</motion.h1>
            <motion.p variants={fadeIn} className="mb-5">The intelligent whiteboard for teams that think big. Brainstorm, plan, and create together in real-time with the power of AI.</motion.p>
            <motion.div variants={fadeIn}>
              <Link href="/room" className="btn btn-primary btn-lg">Create a Whiteboard</Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        id="features"
        className="container mx-auto px-4 py-24 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeIn} className="text-4xl font-bold mb-2">Everything You Need to Collaborate</motion.h2>
        <motion.p variants={fadeIn} className="text-lg mb-12 text-gray-400">All in one shared workspace.</motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div variants={fadeIn} className="card bg-base-100/30 shadow-xl backdrop-blur-sm">
            <div className="card-body">
              <CollaborateIcon />
              <h3 className="card-title justify-center text-2xl font-bold">Real-Time Sync</h3>
              <p>Draw and brainstorm with your team. Every stroke is synced instantly across all devices.</p>
            </div>
          </motion.div>
          <motion.div variants={fadeIn} className="card bg-base-100/30 shadow-xl backdrop-blur-sm">
            <div className="card-body">
              <AIIcon />
              <h3 className="card-title justify-center text-2xl font-bold">AI Assistant</h3>
              <p>Supercharge your creativity. Our AI can analyze your drawings, suggest ideas, and automate tasks.</p>
            </div>
          </motion.div>
          <motion.div variants={fadeIn} className="card bg-base-100/30 shadow-xl backdrop-blur-sm">
            <div className="card-body">
              <ChatIcon />
              <h3 className="card-title justify-center text-2xl font-bold">Integrated Chat</h3>
              <p>Communicate seamlessly with your team without leaving the board. Discuss ideas as they happen.</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-24">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-12">Get Started in Seconds</h2>
            <ul className="steps steps-vertical lg:steps-horizontal w-full">
                <li data-content="✓" className="step step-primary">Create a Room</li>
                <li data-content="✓" className="step step-primary">Share the Link</li>
                <li data-content="★" className="step step-primary">Start Collaborating</li>
                <li data-content="🚀" className="step">Unleash Your Ideas</li>
            </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer p-10 bg-base-200 text-base-content">
        <div>
          <span className="footer-title">SmartBoard</span>
          <p>Redefining online collaboration.<br/>© 2025 SmartBoard Inc. All rights reserved.</p>
        </div>
        <div>
          <span className="footer-title">Product</span>
          <a className="link link-hover">Features</a>
          <a className="link link-hover">Pricing</a>
          <a className="link link-hover">Changelog</a>
        </div>
        <div>
          <span className="footer-title">Company</span>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Careers</a>
        </div>
      </footer>
    </div>
  );
}
