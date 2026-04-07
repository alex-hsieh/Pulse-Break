# Pulse Break 💚

**Workplace stress management app for Gen Z professionals**

A proactive wellness tool that helps users recognize stress early and take intentional breaks using the Let Them Theory framework.

---

## About This Project

**Pulse Break** is a mobile wellness application developed as part of Johnson & Johnson's **Technology Awareness Program (TAP)**. This MVP demonstrates a behavioral approach to workplace stress management, specifically designed for new graduates and young professionals transitioning into the workforce.

### The Problem

Workplace stress is an invisible burden affecting millions of employees daily:
- **62% of workers** report high stress levels impacting job performance *(UKG Global Study 2024)*
- **52% of Gen Z professionals** experience burnout within their first year of work *(Seramount 2025)*
- **83% of U.S. workers** suffer from work-related stress, costing American businesses $300B annually *(American Institute of Stress)*
- Existing wellness resources (gym memberships, hotlines, courses) require time and effort that stressed workers don't have

### Our Solution

Pulse Break takes a **proactive, behavioral approach**:

1. **Early Detection** — Users manually log stress levels before they escalate
2. **Immediate Intervention** — App suggests short breaks (10-15 min) when stress is high
3. **Mindset Reset** — Guided reflection using Mel Robbins' *Let Them Theory* helps users distinguish controllable vs. uncontrollable stressors
4. **Pattern Recognition** — History dashboard helps users identify stress triggers over time

**Key Differentiator:** Unlike reactive wellness apps, Pulse Break combines stress tracking with behavioral psychology (Let Them Theory) to address root causes, not just symptoms.

---

## Project Objectives

### MVP Scope (2-Week Build)
Build a functional mobile app prototype demonstrating:
- ✅ Stress check-in with emoji scale (1-5)
- ✅ Smart evaluation (low/moderate/high stress detection)
- ✅ Break recommendation when stress is high
- ✅ Let Them Theory reflection prompts
- ✅ Stress history dashboard

### Future Vision (Full Product)
The complete Pulse Break platform would include:
- Smartwatch biometric integration (Apple HealthKit, Wear OS)
- Machine learning stress prediction (Azure ML)
- Microsoft Calendar integration for proactive scheduling
- Manager notification system (privacy-preserving)
- Enterprise dashboard for HR wellness programs

---

## Research & Data Sources

This project is grounded in verified research on workplace stress and wellness:

### Primary Sources

**Workplace Stress Statistics:**
- **UKG Global Study 2024** — Employee burnout and performance impact data
- **Seramount 2025** — Gen Z workplace stress and retention trends
- **American Institute of Stress** — U.S. workplace stress prevalence and economic impact
- **Wellhub 2024** — Corporate wellness program effectiveness research

**Behavioral Framework:**
- **Mel Robbins, *The Let Them Theory* (2024)** — Framework for distinguishing controllable vs. uncontrollable stressors, core to our reflection prompts

### Voice of Customer Research
- Direct interviews with employees experiencing workplace stress
- Insights on existing wellness program limitations (energy courses, gym memberships, hotlines)

---

## Development Team

**The Winning Team** — Johnson & Johnson TAP Program, Sprint 1

| Role | Name | Responsibilities |
|------|------|------------------|
| **Project Lead & Developer** | Alexander Hsieh | Technical architecture, React Native development, data integration, presentation lead |
| **UX/Design Lead** | Vince Watson | User experience design, visual design, Let Them Theory content, presentation design |
| **Data Engineer** | Javin Vance | Data models, storage strategy, analytics, QA testing |

### Acknowledgments
- **TAP Faculty & Mentors** — Project guidance and technical mentorship
- **J&J IT Management** — Industry insights and enterprise context
- **Subject Matter Experts** — McKenzie Henry, Zandria Johnson

---

## Tech Stack

### Current MVP (Day 1 Decision)

**Option A: React Native + Expo (Functional App)**
- **Framework:** React Native with Expo SDK 51+
- **Navigation:** React Navigation 6+ (tab-based)
- **UI Library:** React Native Paper
- **Data Storage:** AsyncStorage / Expo SecureStore
- **Charts:** Victory Native or React Native Chart Kit
- **Language:** JavaScript (with optional TypeScript)
- **Deployment:** Expo Go for testing, EAS Build for standalone app


### Future Vision Architecture (Azure)

**Cloud Infrastructure:**
- **Azure Functions** — Serverless stress evaluation processing
- **Azure Machine Learning** — Stress prediction and pattern recognition
- **Azure SQL Database** — User profiles, wellness history, reflections
- **Azure Blob Storage** — Raw biometric logs (compliance)
- **Azure Service Bus** — Manager notifications (privacy-preserving)
- **Azure API Management** — Rate limiting, security

**Integration Layer:**
- **Microsoft Graph API** — Calendar sync for proactive break scheduling
- **Apple HealthKit / Wear OS SDK** — Biometric data (heart rate, HRV)

**Why Azure?**
- J&J is Microsoft-heavy (Office 365, Teams environment)
- Seamless integration with Microsoft Calendar
- Enterprise-grade security and compliance (HIPAA, GDPR)

---

## Getting Started

### Prerequisites

**For React Native Path:**
- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app on your phone (optional, for device testing)

**For Figma Path:**
- Figma account (free)
- Figma desktop app or browser access

### Installation (React Native)

```bash
# Clone the repository
git clone https://github.com/[your-username]/pulse-break.git
cd pulse-break

# Install dependencies
npm install

# Start the development server
npx expo start

# Scan QR code with Expo Go app (iOS/Android)
# Or press 'i' for iOS simulator, 'a' for Android emulator
```

### Project Structure

```
pulse-break/
├── screens/           # Main app screens
│   ├── HomeScreen.js       # Stress check-in
│   ├── BreakScreen.js      # Break recommendation
│   ├── ReflectionScreen.js # Let Them Theory prompts
│   └── HistoryScreen.js    # Stress history dashboard
├── components/        # Reusable UI components
├── utils/            # Helper functions
│   └── storage.js          # AsyncStorage utilities
├── data/             # Sample data for testing
├── content/          # Reflection prompts, copy
├── docs/             # Project documentation
│   ├── MVP_BUILD_SPEC.md
│   ├── WORK_SPLIT.md
│   ├── GITHUB_ISSUES.md
│   ├── AI_PROMPTS.md
│   └── GITHUB_ISSUES_FOR_BEGINNERS.md
├── App.js            # Entry point
├── package.json
└── README.md
```

---

## Documentation

### Core Documents
- **[MVP_BUILD_SPEC.md](docs/MVP_BUILD_SPEC.md)** — What we're building (features, priorities, timeline)
- **[WORK_SPLIT.md](docs/WORK_SPLIT.md)** — Team responsibilities and daily breakdown
- **[GITHUB_ISSUES.md](docs/GITHUB_ISSUES.md)** — 20 pre-written issues for project tracking

### Development Guides
- **[AI_PROMPTS.md](docs/AI_PROMPTS.md)** — Ready-to-use prompts for Claude/ChatGPT code generation
- **[GITHUB_ISSUES_FOR_BEGINNERS.md](docs/GITHUB_ISSUES_FOR_BEGINNERS.md)** — How to use GitHub Issues (beginner-friendly)

### Design Assets
- **Storyboard v2** — 7-scene user journey with Azure architecture
- **Color Palette:** Sage (#7A9E7E), Teal (#3D8B8B), Coral (#D4715A), Cream (#F8F5EF)
- **Typography:** DM Sans (body), DM Serif Display (headings)

---

## Design Philosophy

**Visual Identity:**
- **Calm and professional** — Not clinical or urgent
- **Approachable** — Friendly without being childish
- **Minimal cognitive load** — Clear hierarchy, single action per screen
- **Encouraging tone** — Supportive, not judgmental

**UX Principles:**
- **Zero onboarding** — Understand how to use in < 5 seconds
- **< 3 taps to start break** — Reduce friction when stressed
- **Progressive disclosure** — Advanced features don't clutter basics
- **Privacy-first** — User data stays on device (MVP), opt-in sharing (future)

---

## Privacy & Security

### MVP Approach
- **Local storage only** — All data stays on device (AsyncStorage)
- **No cloud sync** — No external data transmission
- **No tracking** — No analytics, telemetry, or third-party SDKs
- **User control** — Clear data with one tap in settings

### Future Vision
- **Privacy-preserving notifications** — Managers get stress signals, not raw data
- **Opt-in data sharing** — Explicit consent required
- **Encryption at rest** — Azure SQL Database encryption
- **HIPAA/GDPR compliance** — Enterprise-grade data protection
- **Anonymized aggregation** — Company trends without individual identification

---

## Testing

### Manual Testing Checklist
- [ ] Check-in flow: Tap emoji → see confirmation → data saves
- [ ] Stress evaluation: High stress (4-5) triggers break screen
- [ ] Break flow: Start break → see reflection → return home
- [ ] Reflection: Both response options work, data saves correctly
- [ ] History: Past check-ins display, sorted by date
- [ ] Data persistence: Restart app, data still there

### Test on Multiple Devices
- [ ] iOS simulator (various iPhone sizes)
- [ ] Android emulator (various screen sizes)
- [ ] Real device via Expo Go

### Known Limitations (MVP)
- No offline sync conflict resolution
- No multi-user support
- No real calendar integration (hardcoded sample data)
- Limited to past 7 days of history

---

## Development Timeline

**Total Duration:** 7-8 days (aggressive sprint)

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Setup & Decision** | Day 1 | Tech stack chosen, project initialized |
| **Core Features** | Days 2-5 | Check-in, evaluation, break, reflection working |
| **Nice-to-Haves** | Days 6-7 | History dashboard, data persistence |
| **Polish & Demo** | Day 8 | UI refined, demo ready, backup prepared |

**Milestone:** Minimum viable demo (check-in → break → reflection) complete by Day 5.

---

## Success Metrics

### Technical Success
- [ ] All Priority 1 features functional
- [ ] App runs without crashes
- [ ] Data persists across sessions
- [ ] Demo-ready on real device

### Presentation Success
- [ ] Live demo works smoothly (< 3 minutes)
- [ ] Audience understands Let Them Theory differentiator
- [ ] Clear connection between MVP and full vision
- [ ] Team can answer technical questions confidently

### Learning Success
- [ ] Team gained mobile development skills
- [ ] Connected conceptual design to implementation
- [ ] Demonstrated working software to stakeholders

---

## Contributing

This is an academic project for J&J's TAP Program. External contributions are not currently accepted.

### For Team Members

**Daily Workflow:**
1. Check GitHub Issues assigned to you
2. Review AI_PROMPTS.md for coding assistance
3. Build, test, commit your work
4. Update issue checklists and close when done
5. Attend daily 10-min standup

**Before Committing:**
- Test your changes manually
- Ensure no console errors
- Follow existing code style
- Update relevant documentation

---

## License

This project is developed as part of Johnson & Johnson's Technology Awareness Program and is intended for educational and demonstration purposes only.

**Not for commercial use.**

---

### Quick Links
- [GitHub Issues](../../issues) — Track project progress
- [Project Documentation](docs/) — Full specs and guides
- [Storyboard](docs/storyboard_v2.html) — Visual user journey

---

## Acknowledgments

**Special Thanks:**
- Johnson & Johnson IT Management for the TAP opportunity
- TAP Faculty for guidance and mentorship
- Subject Matter Experts (McKenzie Henry, Zandria Johnson) for industry insights
- Mel Robbins for the Let Them Theory framework
- Our families and supporters

**Built with ❤️ by The Winning Team**

---

**Pulse Break** — Because stress doesn't take a day off, but you can. 💚