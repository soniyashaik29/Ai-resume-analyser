# ResumeIQ — AI Resume Analyzer

A polished, single-page resume analyzer with a Google-inspired UI, animated gradient background, and a simulated AI engine that scores resumes across 5 metrics and suggests exactly what to add to reach a **10/10**.

## ✨ Features

- **Drag & drop / click upload** for PDF, DOCX, TXT (max 5 MB)
- **5-metric scoring**: Structure, Keywords, Readability, Impact, Contact & Links
- **Overall AI score** out of 100
- **Actionable "Add this" suggestions** with concrete examples to reach 10/10
- **Beautiful animated background** with floating orbs and subtle grid
- **Fully responsive** — works on mobile, tablet, and desktop
- **Accessible** — ARIA labels, keyboard support, semantic HTML

## 📁 Project Structure

resume-analyzer/
├── index.html # Markup
├── css/
│ └── styles.css # All styling
├── js/
│ └── app.js # Logic & simulated AI engine
└── README.md

## 🚀 Run Locally

1. Clone or download the folder.
2. Open `index.html` in any modern browser — no build step required.

Or serve it locally:

```bash
# Python 3
python -m http.server 8000

# Node (npx)
npx serve .
```
