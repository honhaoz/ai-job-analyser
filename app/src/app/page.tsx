"use client";
import { useState } from "react";
import { analyseJDAction } from "@/lib/actions/analyse";
import { AnalysedJD } from "@/lib/services/ai";
import { ResultCard } from "../components/result-card";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysedJD | null>(null);
  const [error, setError] = useState<string | null>(null);
  const characterCount = jobDescription.length;
  const isValid = characterCount > 0;

  const handleSubmit = async (formData: FormData) => {
    if (!isValid) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await analyseJDAction(formData);

      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || "Failed to analyse");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-400 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="cursor-pointer">
              <h1 className="text-blue-600 text-3xl font-smibold">
                AI-Powered Job Description analyser
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
        <form action={handleSubmit}>
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8 sm:mb-12 transition-all hover:shadow-lg">
            <label
              htmlFor="job-description"
              className="block text-gray-700 mb-3"
            >
              Paste job description here...
            </label>
            <textarea
              id="job-description"
              name="jobDescription"
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
                    ✓ Ready to analyse
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || isAnalyzing}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                {isAnalyzing ? "Analyzing..." : "analyse"}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                Failed to analyse job description
              </div>
            )}
          </div>
        </form>

        {result && (
          <div className="animate-fadeIn">
            <h2 className="text-gray-800 mb-6">Analysis Results</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResultCard
                title="Hard Skills"
                type="skills"
                content={result.hardSkills}
              />
              <ResultCard
                title="Soft Skills"
                type="skills"
                content={result.softSkills}
              />
              <ResultCard
                title="Resume Improvement Suggestions"
                type="tips"
                content={result.resumeImprovements}
              />
              <ResultCard
                title="Cover Letter Snippet"
                type="text"
                content={result.coverLetterSnippet}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
