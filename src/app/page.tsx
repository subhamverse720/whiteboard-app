'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">AI Whiteboard</h1>
          </div>
          
          <div className="space-x-4">
            <Link href="/login" className="px-4 py-2 text-blue-600 hover:text-blue-800">
              Sign In
            </Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Collaborative Whiteboard
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Perfect for researchers, students, and teachers. Real-time collaboration with intelligent AI assistance.
          </p>
          
          <div className="flex justify-center space-x-4 mb-12">
            <Link href="/register" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Start Free Session
            </Link>
            <Link href="/login" className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Teaching Assistant</h3>
            <p className="text-gray-600">
              Get instant explanations, diagram analysis, and educational insights powered by advanced AI.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Real-time Collaboration</h3>
            <p className="text-gray-600">
              Multiple users can draw, write, and interact simultaneously with live cursor tracking.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Educational Focus</h3>
            <p className="text-gray-600">
              Designed specifically for academic environments with tools for teaching and learning.
            </p>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Perfect For</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">👩‍🏫 Teachers</h3>
              <p className="text-gray-600">Interactive lessons, visual explanations, and student collaboration</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">👨‍🎓 Students</h3>
              <p className="text-gray-600">Study groups, project collaboration, and AI-assisted learning</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">🔬 Researchers</h3>
              <p className="text-gray-600">Brainstorming sessions, diagram creation, and team discussions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}