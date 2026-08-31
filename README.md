# 🧠 Synapse AI — The Adaptive AI-Based Personalized Learning Companion

> **"Your learning path shouldn't be generic."**  
> An AI-powered cognitive learning companion that transforms your career goals, existing competencies, and uploaded study materials into an adaptive, explainable path to mastery.

---

## 🌟 Key Features

- **Personalized Cognitive Onboarding**: 7-step wizard evaluating baseline knowledge, career goals, skill tags, learning preferences, and time commitment.
- **Adaptive Visual Roadmap**: Dynamic milestone graph spanning 7 stages (*Foundations* → *Core Engineering* → *Advanced Algorithms* → *Real-World Projects* → *Specialization* → *Job Ready*).
- **100% Explainable AI**: Every recommendation provides a distinct **"Why this?"** rationale with **Accept**, **Modify**, **Reject**, or **Regenerate** action controls.
- **Continuous Remediation Feedback Loop**: Diagnostic testing in Quiz Arena with instant rationale. Failing a topic automatically inserts an explainable remediation node in the roadmap.
- **Multi-Format Document Ingestion**: Ingests PDF, DOCX, and TXT study notes, extracts key concepts, identifies prerequisite gaps, and merges them directly into your roadmap.
- **Contextual AI Companion (Tutor)**: Interactive tutor with streaming typewriter effect, code snippets with one-click copy, and quick prompt pills.
- **Cognitive Analytics & Telemetry**: Recharts radar charts, weekly consistency heatmaps, and proactive AI insight cards.
- **Zero-Crash Demo Mode**: Fully functional offline without external API keys, with optional one-click switching to live Google Gemini or OpenAI in Settings.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Canvas Confetti
- **Backend**: Node.js, Express, TypeScript, Multer, Dotenv, CORS
- **AI Engine**: Modular `AIService` supporting Google Gemini (`gemini-1.5-flash`), OpenAI (`gpt-4o-mini`), and High-Fidelity Demo Mock Engine
- **Storage**: Stateful In-Memory / SQLite JSON Store with pre-seeded datasets

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd synapse-ai
```

### 2. Install all dependencies
```bash
npm run install:all
```

### 3. Setup environment variables (Optional)
Copy the example environment file:
```bash
cp .env.example server/.env
```
*(By default, `AI_PROVIDER=demo` works out of the box with zero external API keys).*

### 4. Run Development Servers
To run both backend and frontend concurrently:
```bash
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 📁 Repository Structure

```
synapse-ai/
├── client/                 # React 18 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── api/            # Typed REST API client
│   │   ├── components/     # UI components (dashboard, roadmap, quiz, tutor, etc.)
│   │   ├── context/        # Global LearningContext state manager
│   │   └── types/          # Shared frontend TypeScript interfaces
│   └── package.json
├── server/                 # Express + TypeScript backend API
│   ├── src/
│   │   ├── config/         # Environment configuration
│   │   ├── controllers/    # API endpoint controllers
│   │   ├── db/             # Database store & seed datasets
│   │   ├── routes/         # REST API routes
│   │   ├── services/       # AI, LearningPath, Quiz, Document services
│   │   └── types/          # Backend TypeScript interfaces
│   └── package.json
├── .env.example            # Environment variable template
├── .gitignore              # Git ignore rules for node_modules, build, secrets
└── package.json            # Root orchestration & scripts
```

---

## 📄 License
MIT License. Built for hackathon innovation.
