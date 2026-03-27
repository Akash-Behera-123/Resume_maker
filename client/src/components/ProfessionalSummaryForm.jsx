import { Loader2, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";

const ProfessionalSummaryForm = ({ data, onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    if (!data || !data.trim()) {
      toast.error("Please enter a summary to enhance.");
      return;
    }

    try {
      setIsGenerating(true);
      const prompt = `Enhance my professional summary: "${data}"`;
      const response = await api.post(
        "/api/ai/enhance-pro-sum",
        { userContent: prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.enhancedContent) {
        onChange(response.data.enhancedContent); // Use onChange to update parent state
        toast.success("Professional summary enhanced!");
      } else {
        toast.error("No enhanced content returned.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Add summary for your resume here
          </p>
        </div>

        <button
          disabled={isGenerating}
          onClick={generateSummary}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100
          text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isGenerating ? "Enhancing..." : "AI Enhance"}
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