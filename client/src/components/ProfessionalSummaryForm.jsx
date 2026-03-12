import { Sparkles } from "lucide-react";
import React from "react";

const ProfessionalSummaryForm = ({ data, onChange }) => {

  const handleAIEnhance = () => {
    if (!data || !data.trim()) return;

    const enhanced =
      data +
      " Passionate about delivering high-quality results and continuous learning.";

    onChange(enhanced);
  };

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Sparkles className="size-5 text-purple-600" />
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Add summary for your resume here
          </p>
        </div>

        <button
          onClick={handleAIEnhance}
          disabled={!data}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100
          text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          <Sparkles className="size-4" />
          AI Enhance
        </button>
      </div>

      <textarea
        value={data || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={7}
        className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg 
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none 
        transition-all resize-none"
        placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
      />

      <p className="text-xs text-gray-500 text-center">
        Tip: keep it concise (3–4 sentences) and focus on your most relevant achievements.
      </p>

    </div>
  );
};

export default ProfessionalSummaryForm;