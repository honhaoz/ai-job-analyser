"use client";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { analyseJDAction } from "@/lib/actions/analyse";
import { AnalysedJD } from "@/lib/services/ai";
import { ResultCard, ResultCardProps } from "../components/result-card";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [result, setResult] = useState<AnalysedJD | null>(null);
  const [error, setError] = useState<string | null>(null);
  const characterCount = jobDescription.length;
  const isValid = characterCount > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;

    setIsAnalysing(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await analyseJDAction(formData);

      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || "Failed to analyse");
      }
    } catch (err) {
      setError("An unexpected error occurred submitting the form.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const ResultCardsContent: ResultCardProps[] = useMemo(
    () => [
      {
        title: "Hard Skills",
        type: "skills",
        content: result?.hardSkills ?? null,
      },
      {
        title: "Soft Skills",
        type: "skills",
        content: result?.softSkills ?? null,
      },
      {
        title: "Resume Improvement Suggestions",
        type: "tips",
        content: result?.resumeImprovements ?? null,
      },
      {
        title: "Cover Letter Snippet",
        type: "text",
        content: result?.coverLetterSnippet ?? null,
      },
    ],
    [result]
  );

  return (
    <>
      <InputJDForm
        jobDescription={jobDescription}
        characterCount={characterCount}
        setJobDescription={setJobDescription}
        isAnalysing={isAnalysing}
        handleSubmit={handleSubmit}
        isValid={isValid}
        error={error}
      />
      {result && (
        <div className="animate-fadeIn">
          <h2 className="text-gray-800 mb-6">Analysis Results</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ResultCardsContent.map((card) => (
              <ResultCard
                key={card.title}
                title={card.title}
                type={card.type}
                content={card.content}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

const InputJDForm = ({
  jobDescription,
  characterCount,
  setJobDescription,
  isAnalysing,
  handleSubmit,
  isValid,
  error,
}: {
  jobDescription: string;
  characterCount: number;
  setJobDescription: Dispatch<SetStateAction<string>>;
  isAnalysing: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isValid: boolean;
  error: string | null;
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8 sm:mb-12 transition-all hover:shadow-lg">
        <label htmlFor="job-description" className="block text-gray-700 mb-3">
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
              <span className="text-green-600 text-sm">✓ Ready to analyse</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isAnalysing}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            {isAnalysing ? "Analysing..." : "Analyse"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>
    </form>
  );
};
