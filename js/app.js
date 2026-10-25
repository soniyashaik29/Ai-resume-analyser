/**
 * ResumeIQ — AI Resume Analyzer
 * Simulated AI engine that scores resumes across 5 metrics
 * and provides actionable "add this" suggestions to reach 10/10.
 */
(function () {
  "use strict";

  /* ---------- DOM refs ---------- */
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const placeholderMsg = document.getElementById("placeholderMsg");
  const analysisContent = document.getElementById("analysisContent");
  const overallScoreEl = document.getElementById("overallScore");
  const wordCountBadge = document.getElementById("wordCountBadge");
  const metricsGrid = document.getElementById("metricsGrid");
  const insightList = document.getElementById("insightList");

  /* ---------- State ---------- */
  let currentFile = null;
  let isAnalyzing = false;

  /* ---------- Constants ---------- */
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const METRIC_COLORS = {
    structure: "linear-gradient(90deg, #1a73e8, #4285f4)",
    keywords: "linear-gradient(90deg, #8b5cf6, #a78bfa)",
    readability: "linear-gradient(90deg, #0ea5e9, #38bdf8)",
    impact: "linear-gradient(90deg, #10b981, #34d399)",
    contact: "linear-gradient(90deg, #f59e0b, #fbbf24)",
  };

  const METRIC_LABELS = {
    structure: "Structure",
    keywords: "Keywords",
    readability: "Readability",
    impact: "Impact",
    contact: "Contact & Links",
  };

  /* ---------- Utilities ---------- */
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  }

  /* ---------- Simulated text extraction (demo) ---------- */
  function simulateExtractText(file) {
    const fileName = file.name.toLowerCase();

    let sampleText = `John Doe
Senior Software Engineer | 5+ years experience
john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe | github.com/johndoe

PROFESSIONAL SUMMARY
Passionate software engineer with expertise in full-stack development, cloud architecture, and team leadership.
Led migration of legacy monolith to microservices, improving deployment frequency by 40%.

SKILLS
JavaScript, TypeScript, React, Node.js, Python, Java, SQL, MongoDB, AWS, Docker, Kubernetes, CI/CD, Git

EXPERIENCE
Senior Software Engineer — TechCorp (2021–Present)
• Architected and deployed scalable REST APIs serving 2M+ requests/day.
• Mentored 4 junior developers and introduced code review best practices.
• Reduced AWS costs by 18% through resource optimization.

Software Engineer — InnovateLabs (2018–2021)
• Built responsive front-end with React, improving user engagement by 22%.
• Integrated payment gateways and implemented automated testing (Jest, Cypress).

EDUCATION
B.S. Computer Science — University of Technology (2018)

CERTIFICATIONS
AWS Certified Solutions Architect (2022), Scrum Master (2021)`;

    if (fileName.includes("data") || fileName.includes("analyst")) {
      sampleText = `Jane Smith
Data Analyst | 4 years experience
jane.smith@email.com | (555) 987-6543 | github.com/janesmith

SUMMARY
Data analyst with strong background in statistical modeling, ETL pipelines, and dashboarding.
Experienced in Python, SQL, and Tableau.

SKILLS
Python, SQL, R, Pandas, NumPy, Tableau, Power BI, Excel, A/B Testing, Machine Learning

EXPERIENCE
Data Analyst — DataCorp (2022–Present)
• Built automated dashboards saving 10+ hours/week of manual reporting.
• Analyzed customer churn and provided actionable insights to reduce churn by 12%.

Junior Analyst — InsightCo (2020–2022)
• Performed data cleaning and exploratory analysis on 1M+ records.

EDUCATION
B.S. Statistics — State University (2020)`;
    } else if (fileName.includes("design") || fileName.includes("ux")) {
      sampleText = `Alex Rivera
UX/UI Designer | 6 years experience
alex.rivera@email.com | dribbble.com/alexr

SUMMARY
User-centric designer with a passion for creating intuitive and beautiful digital experiences.
Led design sprints and usability testing for B2B SaaS products.

SKILLS
Figma, Sketch, Adobe XD, Prototyping, User Research, Wireframing, HTML/CSS, Design Systems

EXPERIENCE
Senior Product Designer — PixelWorks (2021–Present)
• Redesigned core dashboard, increasing user satisfaction by 30%.
• Established design system adopted by 5 product teams.

EDUCATION
BFA in Graphic Design — Art Institute (2017)`;
    }

    if (file.size > 120000) {
      sampleText +=
        "\n\nADDITIONAL PROJECTS\n• Built open-source tool with 200+ stars.\n• Spoke at 3 industry conferences.";
    }
    if (file.size < 2000) {
      sampleText =
        sampleText.substring(0, 400) +
        "\n\n[This resume appears quite short. Consider adding more detail.]";
    }

    return sampleText;
  }

  function extractTextFromFile(file) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(simulateExtractText(file)), 250);
    });
  }

  /* ---------- AI analysis ---------- */
  function analyzeResume(text) {
    const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
    const wordCount = words.length;
    const lowerText = text.toLowerCase();

    /* --- 1. Structure --- */
    const sections = [
      "experience",
      "education",
      "skills",
      "summary",
      "projects",
      "certification",
    ];
    const foundSections = sections.filter((s) => lowerText.includes(s));
    const missingSections = sections.filter((s) => !lowerText.includes(s));
    const structureScore = Math.min(100, 40 + foundSections.length * 12);

    /* --- 2. Keywords / action verbs --- */
    const actionWords = [
      "led", "built", "created", "improved", "reduced", "increased",
      "managed", "developed", "designed", "implemented", "optimized",
      "mentored", "architected", "launched", "delivered", "achieved",
    ];
    const usedActions = actionWords.filter((aw) => lowerText.includes(aw));
    const missingActions = actionWords
      .filter((aw) => !lowerText.includes(aw))
      .slice(0, 4);
    const actionCount = usedActions.length;
    const keywordScore = Math.min(
      100,
      30 + actionCount * 6 + (lowerText.includes("team") ? 8 : 0)
    );

    /* --- 3. Readability / length --- */
    let readabilityScore = 70;
    let lengthFeedback = "";
    if (wordCount < 150) {
      readabilityScore = 30;
      lengthFeedback = `Only ${wordCount} words — too short for a professional resume.`;
    } else if (wordCount < 300) {
      readabilityScore = 50;
      lengthFeedback = `${wordCount} words — a bit short. Aim for 400–700 words.`;
    } else if (wordCount < 600) {
      readabilityScore = 80;
      lengthFeedback = `${wordCount} words — good length.`;
    } else if (wordCount < 1000) {
      readabilityScore = 95;
      lengthFeedback = `${wordCount} words — ideal length.`;
    } else {
      readabilityScore = 80;
      lengthFeedback = `${wordCount} words — quite long. Trim to under 2 pages.`;
    }

    /* --- 4. Quantified impact --- */
    const numberMatches = text.match(
      /\d+%|\d+ percent|\$\d+|\d+ years|\d+ million|\d+ users|\d+ projects|\d+x/g
    );
    const quantCount = numberMatches ? numberMatches.length : 0;
    const impactScore = Math.min(100, 35 + quantCount * 12);

    /* --- 5. Contact & links --- */
    const hasLinkedIn = /linkedin\.com/i.test(text);
    const hasGitHub = /github\.com/i.test(text);
    const hasPortfolio =
      /dribbble\.com|behance\.net|portfolio|\.me\b/i.test(text);
    const hasEmail = /\S+@\S+\.\S+/.test(text);

    let contactScore = 60;
    if (hasEmail) contactScore = 75;
    if (hasEmail && (hasLinkedIn || hasGitHub)) contactScore = 90;
    if (hasEmail && hasLinkedIn && (hasGitHub || hasPortfolio))
      contactScore = 100;

    /* --- Overall score --- */
    const overall = Math.round(
      structureScore * 0.25 +
        keywordScore * 0.25 +
        readabilityScore * 0.2 +
        impactScore * 0.2 +
        contactScore * 0.1
    );

    /* --- Build insights --- */
    const insights = [];

    /* Structure */
    if (foundSections.length < 6) {
      const missing = missingSections
        .filter((s) => s !== "certification")
        .slice(0, 3);
      let suggestion = "";
      if (missing.includes("experience"))
        suggestion +=
          "Add a dedicated <strong>Experience</strong> section with job titles, company names, dates, and bullet points. ";
      if (missing.includes("education"))
        suggestion +=
          "Add an <strong>Education</strong> section with your degree, institution, and graduation year. ";
      if (missing.includes("skills"))
        suggestion +=
          "Add a <strong>Skills</strong> section grouped by category (Languages, Frameworks, Tools). ";
      if (missing.includes("summary"))
        suggestion +=
          "Add a 2–3 line <strong>Professional Summary</strong> at the top highlighting your top achievements. ";
      if (missing.includes("projects"))
        suggestion +=
          "Add a <strong>Projects</strong> section showcasing 2–3 relevant projects with links. ";
      if (missing.includes("certification"))
        suggestion +=
          "Optionally add a <strong>Certifications</strong> section if you hold any industry credentials. ";

      insights.push({
        type: "critical",
        icon: "📋",
        text: `Your resume is missing ${6 - foundSections.length} of 6 core sections (${foundSections.length}/6 found).`,
        fix: `To reach 10/10 in structure, add the missing sections: ${suggestion}`,
        example: `PROFESSIONAL SUMMARY\nResults-driven [Role] with X+ years...\n\nSKILLS\nLanguages: ... | Frameworks: ... | Tools: ...`,
      });
    } else {
      insights.push({
        type: "positive",
        icon: "✅",
        text: "Excellent! All 6 core sections detected (Summary, Skills, Experience, Education, Projects, Certifications).",
        fix: "To lock in a perfect structure score, ensure each section uses a <strong>consistent heading</strong> and reverse-chronological order.",
      });
    }

    /* Action verbs */
    if (actionCount < 8) {
      const examples = missingActions.join('", "');
      insights.push({
        type: actionCount < 4 ? "critical" : "warning",
        icon: "⚡",
        text: `Only ${actionCount} strong action verbs detected. Top resumes use 8–12+ across experience bullets.`,
        fix: `Start every bullet with a strong action verb. Try adding: <strong>"${examples}"</strong> and others like "spearheaded", "streamlined", "accelerated".`,
        example: `❌ "Responsible for managing team"\n✅ "Led a 6-person team to deliver X, reducing costs by 25%"`,
      });
    } else {
      insights.push({
        type: "positive",
        icon: "🚀",
        text: `Strong action-verb usage (${actionCount} unique verbs detected). Great for ATS and recruiter scans.`,
        fix: "To push higher, <strong>vary your verbs</strong> — avoid repeating \"led\" or \"built\" more than twice.",
      });
    }

    /* Quantified impact */
    if (quantCount < 4) {
      insights.push({
        type: quantCount < 2 ? "critical" : "warning",
        icon: "📊",
        text: `Only ${quantCount} quantified achievement${quantCount === 1 ? "" : "s"} found. Recruiters expect at least 4–6 metrics.`,
        fix: 'Add numbers to your bullet points. Try formats like: <strong>"increased X by 30%"</strong>, <strong>"reduced costs by $50K"</strong>, <strong>"managed a team of 8"</strong>, <strong>"served 1M+ users"</strong>.',
        example: `❌ "Improved website performance"\n✅ "Improved website load time by 45%, boosting conversion 12%"`,
      });
    } else {
      insights.push({
        type: "positive",
        icon: "📈",
        text: `Great quantification (${quantCount} metrics detected). Data-backed bullets stand out.`,
        fix: "To get to 10/10, ensure <strong>every</strong> experience bullet has at least one number or outcome.",
      });
    }

    /* Length */
    if (readabilityScore < 90) {
      insights.push({
        type: readabilityScore < 50 ? "critical" : "warning",
        icon: "📏",
        text: lengthFeedback,
        fix:
          wordCount < 400
            ? "Expand your <strong>Experience</strong> bullets with details on scope, tools, and outcomes. Add a <strong>Projects</strong> section if you have side work or open-source contributions."
            : "Trim less relevant experience. Keep <strong>10–15 years max</strong> and remove outdated skills or unrelated jobs.",
      });
    } else {
      insights.push({
        type: "positive",
        icon: "📐",
        text: lengthFeedback,
        fix: 'Keep it tight — aim for <strong>400–700 words</strong> (1–2 pages). Use 10.5–11pt font with 0.5–1" margins.',
      });
    }

    /* Contact */
    if (contactScore < 100) {
      const missingLinks = [];
      if (!hasEmail) missingLinks.push("<strong>professional email</strong>");
      if (!hasLinkedIn) missingLinks.push("<strong>LinkedIn URL</strong>");
      if (!hasGitHub && !hasPortfolio)
        missingLinks.push("<strong>GitHub or portfolio URL</strong>");

      insights.push({
        type: contactScore < 80 ? "critical" : "warning",
        icon: "🔗",
        text: `Missing ${missingLinks.length} essential contact element${missingLinks.length === 1 ? "" : "s"}.`,
        fix: `Add to your header: ${missingLinks.join(", ")}. Place them on one line under your name — recruiters expect them at a glance.`,
        example: `john.doe@email.com | linkedin.com/in/johndoe | github.com/johndoe`,
      });
    } else {
      insights.push({
        type: "positive",
        icon: "📧",
        text: "All contact essentials present — email, LinkedIn, and portfolio/GitHub.",
        fix: "For a perfect 10/10, make sure links are <strong>clickable</strong> and up to date.",
      });
    }

    /* Bonus ATS tip */
    if (insights.length < 6) {
      insights.push({
        type: "tip",
        icon: "🎯",
        text: "ATS optimization tip: mirror keywords from the job description.",
        fix: 'For each job you apply to, <strong>re-read the description</strong> and weave in 5–8 of its exact keywords (e.g., "Agile", "CI/CD", "stakeholder management") into your summary and experience bullets.',
        example: `If the job says "cross-functional collaboration", use that exact phrase in a bullet.`,
      });
    }

    return {
      overallScore: overall,
      wordCount,
      metrics: {
        structure: Math.round(structureScore),
        keywords: Math.round(keywordScore),
        readability: Math.round(readabilityScore),
        impact: Math.round(impactScore),
        contact: Math.round(contactScore),
      },
      insights,
    };
  }

  /* ---------- Rendering ---------- */
  function renderMetrics(metrics) {
    metricsGrid.innerHTML = "";
    Object.keys(METRIC_LABELS).forEach((key) => {
      const val = metrics[key] || 0;
      const card = document.createElement("div");
      card.className = "metric-card";
      const dotColor =
        METRIC_COLORS[key].match(/#[0-9a-f]{6}/i)?.[0] || "#1a73e8";

      card.innerHTML = `
        <div class="metric-title">
          <span>${METRIC_LABELS[key]}</span>
          <span class="metric-dot" style="background:${dotColor}"></span>
        </div>
        <div class="metric-bar-bg">
          <div class="metric-bar-fill" style="width:0%; background:${METRIC_COLORS[key]};"></div>
        </div>
        <div class="metric-score">${val}<span>/100</span></div>
      `;
      metricsGrid.appendChild(card);

      requestAnimationFrame(() => {
        setTimeout(() => {
          card.querySelector(".metric-bar-fill").style.width = val + "%";
        }, 50);
      });
    });
  }

  function renderInsights(insights) {
    insightList.innerHTML = "";
    insights.forEach((ins) => {
      const li = document.createElement("li");
      li.className = "insight-item " + (ins.type || "");

      const suggestion = ins.fix
        ? `<div class="add-suggestion"><strong>➕ Add this:</strong> ${ins.fix}${
            ins.example
              ? `<span class="example">${ins.example.replace(/\n/g, "<br>")}</span>`
              : ""
          }</div>`
        : "";

      li.innerHTML = `
        <span class="insight-icon">${ins.icon}</span>
        <div class="insight-content">
          <div class="insight-text">${ins.text}</div>
          ${suggestion}
        </div>
      `;
      insightList.appendChild(li);
    });
  }

  function renderAnalysis(analysis, fileName) {
    placeholderMsg.style.display = "none";
    analysisContent.style.display = "block";

    overallScoreEl.textContent = analysis.overallScore;
    wordCountBadge.textContent = `${analysis.wordCount} words · ${fileName.substring(0, 28)}${fileName.length > 28 ? "…" : ""}`;

    renderMetrics(analysis.metrics);
    renderInsights(analysis.insights);
  }

  function resetDisplay() {
    placeholderMsg.style.display = "block";
    analysisContent.style.display = "none";
  }

  /* ---------- File selection ---------- */
  function setSelectedFile(file) {
    currentFile = file;
    if (file) {
      fileNameDisplay.textContent = `📄 ${file.name} (${formatFileSize(file.size)})`;
      fileNameDisplay.style.display = "inline-flex";
      analyzeBtn.disabled = false;
    } else {
      fileNameDisplay.style.display = "none";
      analyzeBtn.disabled = true;
      resetDisplay();
    }
  }

  /* ---------- Analyze action ---------- */
  async function handleAnalyze() {
    if (!currentFile || isAnalyzing) return;

    isAnalyzing = true;
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = "<i>⏳</i> Analyzing…";

    try {
      const text = await extractTextFromFile(currentFile);
      await new Promise((r) => setTimeout(r, 450));
      const analysis = analyzeResume(text);
      renderAnalysis(analysis, currentFile.name);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try a different file.");
      resetDisplay();
    } finally {
      isAnalyzing = false;
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = "<i>⚡</i> Analyze resume";
    }
  }

  /* ---------- Events ---------- */
  dropZone.addEventListener("click", () => fileInput.click());
  dropZone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) setSelectedFile(e.target.files[0]);
    else setSelectedFile(null);
  });

  ["dragenter", "dragover", "dragleave", "drop"].forEach((evt) => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  dropZone.addEventListener("dragenter", () =>
    dropZone.classList.add("highlight")
  );
  dropZone.addEventListener("dragover", () =>
    dropZone.classList.add("highlight")
  );
  dropZone.addEventListener("dragleave", () =>
    dropZone.classList.remove("highlight")
  );
  dropZone.addEventListener("drop", (e) => {
    dropZone.classList.remove("highlight");
    const files = e.dataTransfer.files;
    if (!files.length) return;
    const file = files[0];
    if (file.size > MAX_FILE_SIZE) {
      alert("File too large (max 5MB).");
      return;
    }
    setSelectedFile(file);
    fileInput.files = files;
  });

  analyzeBtn.addEventListener("click", handleAnalyze);

  /* ---------- Init ---------- */
  setSelectedFile(null);
})();