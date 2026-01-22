import { Copy, Check } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export interface ResultCardProps {
  title: string;
  type: "skills" | "tips" | "text";
  content: string[] | string | null;
}

export function ResultCard({ title, type, content }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  if (content === null) {
    return null;
  }
  return (
    <div className="rounded-xl shadow-md p-6 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <CopyButton content={content} copied={copied} setCopied={setCopied} />
      </div>

      {type === "skills" && Array.isArray(content) && (
        <ul className="flex flex-wrap gap-2" aria-label="Extracted skills">
          {content.map((skill, index) => (
            <li
              key={index}
              className="px-3 py-1.5 text-blue-700 rounded-full text-sm border hover:bg-blue-100 transition-colors"
            >
              {skill}
            </li>
          ))}
        </ul>
      )}

      {type === "tips" && Array.isArray(content) && (
        <ul className="space-y-3">
          {content.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-700 mt-1">•</span>
              <span className="flex-1">{tip}</span>
            </li>
          ))}
        </ul>
      )}

      {type === "text" && typeof content === "string" && <p>{content}</p>}

      {copied && (
        <div
          className="mt-3 text-sm text-green-600 text-center"
          role="status"
          aria-live="polite"
        >
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}

export const CopyButton = ({
  content,
  copied,
  setCopied,
}: {
  content: string[] | string;
  copied: boolean;
  setCopied: Dispatch<SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied, setCopied]);

  const handleCopy = () => {
    let textToCopy = "";

    if (Array.isArray(content)) {
      textToCopy = content.join(", ");
    } else {
      textToCopy = content;
    }

    try {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (_error) {
      console.error("Failed to copy to clipboard");
      // TODO: show an error message to the user
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="p-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
      title="Copy to clipboard"
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
    >
      {copied ? (
        <Check className="w-5 h-5 text-green-600" aria-hidden="true" />
      ) : (
        <Copy className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
};
