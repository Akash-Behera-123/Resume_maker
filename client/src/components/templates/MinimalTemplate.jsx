const MinimalTemplate = ({ data, accentColor }) => {
  const color = accentColor || "#4f46e5"; // ✅ fallback fix

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
    <div
      className="max-w-4xl mx-auto p-8 text-gray-900 font-light"
      style={{
        background: `linear-gradient(135deg, ${color}15, white)`
      }}
    >

      {/* HEADER */}
      <header
        className="mb-10"
        style={{ borderBottom: `1px solid ${color}30`, paddingBottom: "16px" }}
      >
        <h1 className="text-4xl font-thin mb-4 tracking-wide">
          {personal.fullName || "Your Name"}
        </h1>

        <div className="flex flex-wrap gap-6 text-sm">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && (
            <span className="break-all">{personal.linkedin}</span>
          )}
          {personal.website && (
            <span className="break-all">{personal.website}</span>
          )}
        </div>
      </header>

      {/* SUMMARY */}
      {data.professionalSummary && (
        <section className="mb-10">
          <p className="text-gray-800">
            {data.professionalSummary}
          </p>
        </section>
      )}

      {/* EXPERIENCE */}
      {data.experience?.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color }}
          >
            Experience
          </h2>

          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-medium font-medium">
                    {exp.position}
                  </h3>

                  <span className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} -{" "}
                    {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>

                <p className="mb-2" style={{ color }}>
                  {exp.company}
                </p>

                {exp.description && (
                  <div className="text-gray-800 whitespace-pre-line">
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
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color }}
          >
            Projects
          </h2>

          <div className="space-y-4">
            {data.projects.map((proj, index) => (
              <div key={index}>
                <h3 className="text-medium font-medium">{proj.name}</h3>

                {proj.type && (
                  <p className="text-sm" style={{ color }}>
                    {proj.type}
                  </p>
                )}

                <p className="text-gray-700">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {data.education?.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color }}
          >
            Education
          </h2>

          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>

                {/* DEGREE + DATE */}
                <div className="flex justify-between items-baseline">
                  <h3 className="font-sm">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>

                  <span className="text-sm text-gray-600">
                    {formatDate(edu.graduationDate)}
                  </span>
                </div>

                {/* INSTITUTION + CGPA */}
                <div className="flex justify-between items-baseline">
                  <p className="text-gray-700">{edu.institution}</p>

                  {edu.gpa && (
                    <span className="text-sm" style={{ color }}>
                      CGPA: {edu.gpa}
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {data.skills?.length > 0 && (
        <section>
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color }}
          >
            Skills
          </h2>

          <div className="text-gray-800">
            {data.skills.join(" • ")}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;