"use client";
import { useState } from "react";
import { analyzeJobDescription } from "@/lib/actions/analyse";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const characterCount = jobDescription.length;
  const isValid = characterCount > 0;

  const handleSubmit = async (formData: FormData) => {
    if (!isValid) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await analyzeJobDescription(formData);

      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || "Failed to analyze");
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
                    ✓ Ready to analyze
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || isAnalyzing}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </div>
        </form>

        {result && (
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Analysis Results
            </h2>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
