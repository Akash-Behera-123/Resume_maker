import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import ResumePreview from "../components/ResumePreview";
import { ArrowLeftIcon, Loader } from "lucide-react";
import api from "../configs/api";

const Preview = () => {
  const { resumeId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);

 const loadResume = async () => {
  try {
    const { data } = await api.get('/api/resumes/public/' + resumeId);

    const r = data.resume;

    setResumeData({
      ...r,
      // ✅ Fix accent color mismatch
      accentColor: r.accentColor || r.accent_color,

      // ✅ Fix personal info mismatch
      personalInfo: {
        ...(r.personalInfo || r.personal_info || {}),
        // ✅ Fix image field mismatch
        profileImage:
          r.personalInfo?.profileImage ||
          r.personalInfo?.profile_image ||
          r.personal_info?.profileImage ||
          r.personal_info?.profile_image ||
          ""
      }
    });

  } catch (error) {
    console.log(error.message);
  }
  setIsLoading(false);
};

  useEffect(() => {
    loadResume();
  }, []);

  return resumeData ? (
    <div className="bg-slate-100">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          classes="py-4 bg-white"
        />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-center text-6xl text-slate-400 font-medium">
            Resume not found
          </p>

          <a
            href="/"
            className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors"
          >
            <ArrowLeftIcon className="mr-2 size-4" />
            Go to home page
          </a>
        </div>
      )}
    </div>
  );
};

export default Preview;
