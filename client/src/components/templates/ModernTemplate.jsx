import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr || !dateStr.includes("-")) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const personal = data.personalInfo || {};

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800">

      {/* HEADER */}
      <header className="p-8 text-white" style={{ backgroundColor: accentColor }}>
        <h1 className="text-4xl font-light mb-3">
          {personal.fullName || "Your Name"}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {personal.email && (
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              {personal.email}
            </div>
          )}

          {personal.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4" />
              {personal.phone}
            </div>
          )}

          {personal.location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              {personal.location}
            </div>
          )}

          {personal.linkedin && (
            <a
              target="_blank"
              rel="noreferrer"
              href={personal.linkedin}
              className="flex items-center gap-2"
            >
              <Linkedin className="size-4" />
              <span className="break-all text-xs">
                {personal.linkedin.replace("https://www.", "")}
              </span>
            </a>
          )}

          {personal.website && (
            <a
              target="_blank"
              rel="noreferrer"
              href={personal.website}
              className="flex items-center gap-2"
            >
              <Globe className="size-4" />
              <span className="break-all text-xs">
                {personal.website.replace("https://", "")}
              </span>
            </a>
          )}
        </div>
      </header>

      <div className="p-8">

        {/* SUMMARY */}
        {data.professionalSummary && (
          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
              Professional Summary
            </h2>
            <p className="text-gray-700">
              {data.professionalSummary}
            </p>
          </section>
        )}

        {/* EXPERIENCE */}
        {data.experience?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-light mb-6 pb-2 border-b border-gray-200">
              Experience
            </h2>

            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative pl-6 border-l border-gray-200">

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-medium text-gray-900">
                        {exp.position}
                      </h3>
                      <p style={{ color: accentColor }}>
                        {exp.company}
                      </p>
                    </div>

                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                      {formatDate(exp.startDate)} -{" "}
                      {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>

                  {exp.description && (
                    <div className="text-gray-700 mt-3 whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {data.projects?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
              Projects
            </h2>

            <div className="space-y-6">
              {data.projects.map((p, index) => (
                <div
                  key={index}
                  className="relative pl-6 border-l border-gray-200"
                  style={{ borderLeftColor: accentColor }}
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {p.name}
                  </h3>

                  {p.type && (
                    <p className="text-sm text-gray-500">{p.type}</p>
                  )}

                  {p.description && (
                    <div className="text-gray-700 text-sm mt-3">
                      {p.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {data.education?.length > 0 && (
          <section className="mb-10">
            <h2
              className="text-2xl font-light mb-4 pb-2 border-b border-gray-200"
              style={{ color: accentColor }}
            >
              Education
            </h2>

            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start">

                  {/* LEFT */}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>

                    <p style={{ color: accentColor }}>
                      {edu.institution}
                    </p>
                  </div>

                  {/* RIGHT (DATE + CGPA) */}
                  <div className="text-right text-sm text-gray-600">
                    <div>{formatDate(edu.graduationDate)}</div>

                    {edu.gpa && (
                      <div
                        className="font-medium"
                        style={{ color: accentColor }}
                      >
                        CGPA: {edu.gpa}
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS BELOW EDUCATION */}
        {data.skills?.length > 0 && (
          <section>
            <h2
              className="text-2xl font-light mb-4 pb-2 border-b border-gray-200"
              style={{ color: accentColor }}
            >
              Skills
            </h2>

            <div className="flex flex-wrap gap-3 text-gray-700">
              {data.skills.map((skill, index) => (
                <span key={index}>{skill}</span>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default ModernTemplate;