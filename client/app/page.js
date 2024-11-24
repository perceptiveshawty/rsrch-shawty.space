"use client"
import React, { useState } from 'react';
import { Entries } from '../components/Entries';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [showPapers, setShowPapers] = useState(false);

  const handleRedirect = () => {
    window.location.href = 'https://perceptiveshawty.github.io';
  };

  return (
    <div className="min-h-screen bg-[#ebebed]">
      <div className="fixed top-0 left-0 right-0 bg-[#ebebed]">
        <div className="max-w-[56em] mx-auto">
          <h1 className="text-2xl font-bold text-center pt-6 pb-1">rsrch-shawty</h1>
          <div className="text-center text-sm text-gray-500 pb-3">
            <a href="https://rsrch.space" className="hover:underline">a fork of rsrch.space</a>
          </div>
          <nav className="text-center pb-4 space-x-8">
            <button
              className={`px-4 text-black hover:underline ${!showPapers ? 'underline' : ''}`}
              onClick={() => {
                setShowPapers(false);
                window.scrollTo(0, 0);
              }}
            >
              Links
            </button>
            <button
              className={`px-4 text-black hover:underline ${showPapers ? 'underline' : ''}`}
              onClick={() => {
                setShowPapers(true);
                window.scrollTo(0, 0);
              }}
            >
              Papers
            </button>
            <button
              className="px-4 text-black hover:underline"
              onClick={handleRedirect}
            >
              About
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-[56em] mx-auto pt-[132px]">
        <div className="border border-black bg-white">
          <Entries database={showPapers ? "papers" : "links"} supabase={supabase} />
        </div>
      </div>
    </div>
  );
}