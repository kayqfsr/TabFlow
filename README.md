# TabFlow

> **A Chrome extension that visualizes your browsing context via intelligent favicon manipulation.**

[![CI](https://github.com/kayqfsr/TabFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/kayqfsr/TabFlow/actions/workflows/ci.yml)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Version](https://img.shields.io/badge/Version-2.0.1-blue.svg)
![Chrome Extension Manifest V3](https://img.shields.io/badge/Manifest-V3-success.svg)
![Built with AI](https://img.shields.io/badge/Built%20with-AI%20%28Cursor%2FCopilot%29-blueviolet.svg)

---

## 📋 Project Overview

**TabFlow** is a production-ready Chrome extension developed **100% with AI-assisted development** using modern tooling and best practices. It solves the cognitive load problem of managing 10+ browser tabs by adding intelligent visual badges to tab favicons, creating an intuitive navigation history trail.

**Key Achievement:** This project demonstrates how AI can be effectively used in full-stack software engineering—from architecture and testing (TDD) to documentation and CI/CD pipeline setup.

---

## 🎯 The Problem

Modern web work involves juggling 10+ tabs simultaneously. Your browser doesn't provide visual cues about your navigation history—only the currently active tab stands out. This creates **cognitive overload**:

- Which tab did I just come from?
- Where's the documentation tab I had open?
- Did I check that Slack notification?

**Result:** Lost productivity, mental friction, wasted time hunting through tabs.

---

## ✨ The Solution

TabFlow injects **numeric position badges** directly into tab favicons, creating an instant visual memory anchor:

| Position        | Badge     | Meaning               |
| --------------- | --------- | --------------------- |
| 1               | 🔴 **1**  | Most recently visited |
| 2               | 🟠 **2**  | Second most recent    |
| 3+              | 🟡 **3+** | Third+ in history     |
| Outside history | —         | Original favicon      |

**Example:** Instead of searching 15 tabs, your brain instantly recalls "I need the red '1' tab"—dramatically faster than reading titles.

### Key Features

- ✅ Works on every website (no DOM injection needed)
- ✅ Real-time updates with MutationObserver
- ✅ Survives favicon updates from Single Page Applications (Gmail, Discord, etc.)
- ✅ Lightweight: <3 KB extension size
- ✅ Zero data collection—everything stays in your browser
- ✅ Configurable history depth (3-10 tabs)

---

## 🏗️ Technical Architecture

### Why This Matters (AI-Designed with Purpose)

This codebase was engineered with **deliberate architectural decisions**, each documented and tested:

1. **Favicon Injection Engine** — Replaces icons without DOM pollution
2. **MutationObserver Watcher** — Solves the "Favicon War" problem (SPA updates)
3. **Pure Business Logic** — Zero dependencies on Chrome APIs (testable & reusable)
4. **Service Worker Persistence** — Survives ephemeral Manifest V3 worker restarts
5. **Event-Driven Design** — Low-latency, responsive architecture

### Data Flow

```
User clicks Tab B
    ↓
chrome.tabs.onActivated event
    ↓
background.js: historyManager.activateTab(tabBId)
    ↓
chrome.storage.session: persist state
    ↓
Broadcast to all content scripts
    ↓
content.js: applyFaviconWithBadge()
    ↓
User sees badge instantly
```

Whenever a content script starts (e.g. after in-page navigation, not just tab switches), it also actively asks the service worker for its own current position via a `getPosition` message, instead of waiting passively for the next broadcast — this keeps the badge accurate even if a broadcast happened while the tab was reloading.

### Core Components

#### 1. `src/lib/historyLogic.js` (Pure Business Logic)

- **Purpose:** Manage tab history state independently from Chrome API
- **Advantage:** Testable in Jest without mocking
- **Methods:**
  - `activateTab(tabId)` — Add/move tab to front of history
  - `getPosition(tabId)` — Return position (0 = most recent, -1 = not in history)
  - `hydrate(savedArray)` — Restore state after Service Worker restart
  - `setMaxSize(n)` — Dynamic reconfiguration

**Why this matters:** Business logic is decoupled from infrastructure, making it reusable and maintainable.

#### 2. `src/background/background.js` (Service Worker)

- Listens to `chrome.tabs.onActivated`
- Calls `historyManager.activateTab()`
- Persists to `chrome.storage.session`
- Broadcasts changes to content scripts

#### 3. `src/content/content.js` (Tab Favicon Manipulation)

- Receives position from Service Worker
- Creates 16×16 canvas with colored background + white number
- Converts to PNG data URL
- Replaces favicon `<link>` href
- **Watches** for favicon mutations (SPA updates) and reapplies badge

#### 4. `src/options/` (Settings UI)

- Modern gradient UI with animated slider
- Live badge preview
- Persistent user configuration

### Resiliency: The "Favicon War"

**Problem:** Single Page Applications (Gmail, Discord, Slack, YouTube) update favicons to show notification badges. A naive approach would:

1. Draw favicon once → site updates its favicon → our badge disappears ❌

**Solution:** MutationObserver watches `<link rel="icon">` and reapplies badges intelligently.

**Why this works:**

- Detects when sites update favicons
- Recaptures + redraws without infinite loops
- Handles concurrent updates gracefully

---

## 🧪 Testing & Quality Assurance

**All business logic is covered by automated tests:**

```bash
npm test
```

**Test Results (71/71 Passing across 13 suites):**

- ✅ History ordering and sorting
- ✅ Max size enforcement and trimming
- ✅ Position calculation accuracy
- ✅ State hydration and recovery
- ✅ Invalid input handling
- ✅ Manifest permission scope (no unused/over-broad permissions)
- ✅ `.js`/`.cjs` module parity (guards against silent drift)

**Why TDD Matters:** Every feature was designed with tests first, ensuring reliability and making refactoring safe. This is a hallmark of professional software engineering.

---

## 📦 Installation & Usage

### For End Users

1. **Clone or download:**

   ```bash
   git clone https://github.com/kayqfsr/TabFlow.git
   cd TabFlow
   ```

2. **Load in Chrome:**
   - Go to `chrome://extensions/`
   - Enable **Developer mode** (top-right toggle)
   - Click **Load unpacked**
   - Select the `src` folder

3. **Configure:**
   - Click the extension icon in your toolbar
   - Click **Options** to adjust history size (3-10 tabs)
   - See live badge preview

### For Developers

```bash
# Install dependencies
npm install

# Run tests
npm test

# Watch mode (live reload on changes)
npm test -- --watch

# Coverage report
npm run test:coverage

# Lint and format check
npm run lint
npm run format:check

# Package a Chrome Web Store-ready zip (dist/TabFlow-v<version>.zip)
npm run package
```

---

## 🏢 Project Structure

```
TabFlow/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                  # GitHub Actions CI pipeline (lint, format, tests)
│   ├── ISSUE_TEMPLATE/             # Bug report & feature request templates
│   └── PULL_REQUEST_TEMPLATE.md
├── src/
│   ├── background/
│   │   └── background.js           # Service Worker (event handling)
│   ├── content/
│   │   └── content.js              # Favicon manipulation logic
│   ├── lib/
│   │   ├── historyLogic.js         # Pure business logic (ES Modules)
│   │   └── historyLogic.cjs        # CommonJS wrapper for tests
│   │       (plus other .js/.cjs pairs — see CONTRIBUTING.md)
│   ├── options/
│   │   ├── options.html            # Settings UI
│   │   ├── options.css             # Modern gradient design
│   │   └── options.js              # Settings interaction
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   └── manifest.json               # Chrome Extension manifest (V3)
├── tests/                          # Jest unit tests (mirrors src/lib/)
├── .editorconfig                   # Editor-agnostic formatting rules
├── .gitignore                      # Git exclusions
├── .prettierrc.json / .prettierignore
├── eslint.config.js                # ESLint flat config
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md                 # Contribution guidelines
├── LICENSE                         # MIT License
├── package.json                    # NPM dependencies & scripts
└── README.md                       # This file
```

---

## 🔐 Security & Privacy

- **Zero tracking:** TabFlow collects NO analytics, telemetry, or user data
- **Local-only:** All state stored in `chrome.storage.session` (cleared on browser close). On browsers without `chrome.storage.session` (Chrome < 102), TabFlow degrades gracefully to in-memory-only history instead of crashing.
- **Transparent permissions:**
  - `tabs` — Read tab metadata and activation events
  - `storage` — Save/restore user history and settings
  - `http://*/*`, `https://*/*` — Favicon access on regular web pages only (internal browser pages such as `chrome://` are never touched). The content script is declared statically in `manifest.json`, so no runtime `scripting` permission is requested.
- **Source code public:** Full transparency; anyone can audit the code
- **Minimal favicon disclosure:** the badge drawn into a page's favicon is derived by a single pure function (`getBadgeConfig`, see `src/lib/badgeConfig.js`) that only ever encodes the tab's own recency rank (a single digit) — never a tab title, URL, or any other tab's identifier. This is enforced by unit tests, since any page can read its own favicon `href` via the DOM.

See [PRIVACY.md](./PRIVACY.md) for the full privacy policy.

---

## 🤖 About AI-Assisted Development

**This project was developed 100% with AI assistance** (Claude, GitHub Copilot, Cursor) following industry best practices:

### What AI Handled

- ✅ Architecture design and refinement
- ✅ Full implementation (all source files)
- ✅ Test-Driven Development (TDD) workflow
- ✅ Documentation and comments
- ✅ CI/CD pipeline setup
- ✅ Deployment strategy

### Why This Matters

This project demonstrates that AI can be **trusted and effective** for building production-ready software when:

- Requirements are clear
- Testing framework is in place
- Code review and validation happen
- Documentation is thorough
- Best practices are followed

**Lesson:** AI is a powerful tool for accelerating development without sacrificing quality. However, human oversight of architecture and testing strategy is essential.

---

## 🚀 Current Status

### v2.0.1

- ✅ Numeric badges (1, 2, 3+)
- ✅ MutationObserver for SPA favicon updates
- ✅ Configurable history depth
- ✅ Modern settings UI with live preview
- ✅ Full test coverage (71/71 tests passing)

### Known Limitations

- Favicon manipulation does not work on pages with strict Content Security Policy (CSP)
- SPAs that use canvas-based favicons may have visual conflicts
- Badge numbers limited to 1-10 for visual clarity (history size constraint)

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

**Quick Start:**

```bash
# 1. Fork and clone
# 2. Create a feature branch
git checkout -b feature/my-feature

# 3. Make changes and test
npm test

# 4. Commit with clear message
git commit -m "feat: add my feature"

# 5. Push and create Pull Request
git push origin feature/my-feature
```

---

## 📋 Permissions Explanation

TabFlow requests the following permissions—all necessary and minimal:

| Permission                        | Why                                 | Impact                                                     |
| --------------------------------- | ----------------------------------- | ---------------------------------------------------------- |
| `host_permissions: http(s)://*/*` | Favicon access on regular web pages | Required to inject badges; excludes internal browser pages |
| `tabs`                            | Tab activation events               | Know when user switches tabs                               |
| `storage`                         | Save settings & history             | Persist user preferences                                   |

**No personal data is collected or transmitted.**

---

## 📄 License

MIT License © 2025 Kayque Reis

See [LICENSE](./LICENSE) file for full details. You are free to use, modify, and distribute this software.

---

## 🙏 Acknowledgments

This project was built with:

- **[Chrome Extensions Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)** — Secure extension framework
- **[Jest](https://jestjs.io/)** — Testing framework
- **[Claude AI / GitHub Copilot](https://github.com/features/copilot)** — AI assistance for development
- **Node.js & vanilla JavaScript** — No heavy frameworks needed

---

## Tech Stack

- **Chrome Extension Manifest V3**
- **Vanilla JavaScript** (ES2020+)
- **HTML5 Canvas API** (favicon generation)
- **MutationObserver API** (favicon monitoring)
- **Chrome Storage API** (state persistence)
- **Jest** (unit testing)
- **CSS3** (modern UI with gradients, animations)

---

## FAQ

**Q: Does TabFlow work on all websites?**  
A: Yes, except sites with strict Content Security Policies (CSP) that block inline canvas operations.

**Q: Does it collect my browsing data?**  
A: No. TabFlow is 100% offline and does not collect, store, or transmit any data outside your browser.

**Q: Why do badges disappear on some tabs?**  
A: Some sites dynamically update favicons (notifications, status changes). TabFlow's MutationObserver should catch and reapply badges automatically.

**Q: Can I customize badge colors?**  
A: Not yet, but it's on the roadmap! Currently uses red (#FF4444), orange (#FF8800), and yellow (#FFFF00).

**Q: How is this different from tab session managers?**  
A: TabFlow is lightweight and visual-only. It doesn't restore sessions or manage tab groups—just shows which tabs you recently used via favicon badges.

---

## Contact

**Author:** Kayque Reis  
**Repository:** [github.com/kayqfsr/TabFlow](https://github.com/kayqfsr/TabFlow)  
**Issues:** [Report bugs or request features](https://github.com/kayqfsr/TabFlow/issues)

---

**⭐ Star this project if you find it useful!**

---

## Author

Built by **Kayque Reis** as a demonstration of production-grade browser extension development with:

- ✅ Clean architecture (separation of concerns)
- ✅ Comprehensive testing (Jest unit tests)
- ✅ Modern UI/UX (gradient design, animations)
- ✅ Professional documentation (README, CONTRIBUTING)
- ✅ State persistence (chrome.storage.session)

Perfect for portfolios showcasing Chrome Extension development skills.

---
