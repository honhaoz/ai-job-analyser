"use client";
import { useState } from "react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const characterCount = jobDescription.length;
  const isValid = characterCount > 0;

  const handleAnalyze = () => {
    if (!isValid) return;
    setIsAnalyzing(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-400 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="cursor-pointer">
              <h1 className="text-blue-600 text-3xl font-smibold">
                AI-Powered Job Description Analyzer
              </h1>
              <p className="text-gray-600 mt-1">
                Extract insights and improve your application materials
                instantly
              </p>
            </div>
            <nav className="flex gap-6">
              <button>Home</button>
              <button>About</button>
              <button>Contact</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <>
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8 sm:mb-12 transition-all hover:shadow-lg">
            <label
              htmlFor="job-description"
              className="block text-gray-700 mb-3"
            >
              Paste job description here...
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-48 sm:h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              placeholder="Paste the full job description text here. Include requirements, responsibilities, and any other relevant details..."
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${
                    isValid ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {characterCount} characters
                </span>
                {isValid && (
                  <span className="text-green-600 text-sm">
                    ✓ Ready to analyze
                  </span>
                )}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!isValid || isAnalyzing}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          </div>
        </>
      </main>
    </div>
  );
}
