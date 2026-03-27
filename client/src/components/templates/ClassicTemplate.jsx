import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ClassicTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const personal = data.personalInfo || {};

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 leading-relaxed">

      {/* ================= HEADER ================= */}
      <header
        className="flex items-center gap-6 mb-8 pb-6 border-b-2"
        style={{ borderColor: accentColor }}
      >

        {personal.image && (
          <img
            src={personal.image}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        )}

        <div className="flex-1">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: accentColor }}
          >
            {personal.fullName || "Your Name"}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {personal.email && (
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {personal.email}
              </div>
            )}

            {personal.phone && (
              <div className="flex items-center gap-1">
                <Phone className="size-4" />
                {personal.phone}
              </div>
            )}

            {personal.location && (
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                {personal.location}
              </div>
            )}

            {personal.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="size-4" />
                {personal.linkedin}
              </div>
            )}

            {personal.website && (
              <div className="flex items-center gap-1">
                <Globe className="size-4" />
                {personal.website}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= SUMMARY ================= */}
      {data.professionalSummary && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3" style={{ color: accentColor }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p>{data.professionalSummary}</p>
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}
      {data.experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
            EXPERIENCE
          </h2>

          {data.experience.map((exp, i) => (
            <div key={i} className="mb-4 border-l-2 pl-4" style={{ borderColor: accentColor }}>
              <h3 className="font-semibold">{exp.position || "Position"}</h3>
              <p className="text-gray-700">{exp.company}</p>

              <p className="text-sm text-gray-500">
                {formatDate(exp.startDate)} -{" "}
                {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
              </p>

              {exp.description && (
                <p className="mt-2 text-gray-700 whitespace-pre-line">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ================= PROJECTS ================= */}
      {data.projects?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
            PROJECTS
          </h2>

          {data.projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <h3 className="font-semibold">{proj.name}</h3>
              {proj.type && (
                <p className="text-sm text-gray-500">{proj.type}</p>
              )}
              <p className="text-gray-700">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* ================= EDUCATION ================= */}
      {data.education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
            EDUCATION
          </h2>

          {data.education.map((edu, i) => (
            <div key={i} className="mb-3">
              <h3 className="font-semibold">
                {edu.degree} {edu.field && `in ${edu.field}`}
              </h3>
              <p className="text-gray-700">{edu.institution}</p>

              <p className="text-sm text-gray-500">
                {formatDate(edu.graduationDate)}
              </p>

              {edu.gpa && (
                <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {data.skills?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: accentColor }}>
            SKILLS
          </h2>

          <div className="flex flex-wrap gap-3">
            {data.skills.map((s, i) => (
              <span key={i} className="text-gray-700">
                • {s}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;