# Contributing to TabFlow

Thank you for your interest in contributing to TabFlow! This document provides guidelines for participating in the project.

## 📋 Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to kayque@example.com.

---

## 🚀 How to Contribute

### Reporting Bugs

**Before reporting:** Check [existing issues](https://github.com/yourusername/TabFlow/issues) to avoid duplicates.

**When reporting, include:**
- Clear, descriptive title
- Steps to reproduce the bug
- Expected behavior vs. actual behavior
- Chrome version, OS, and Extension version
- Screenshots or screen recordings (if applicable)
- Console errors (if any)

**Example:**
```
Title: Badge not appearing on Gmail favicons after refresh
Steps:
1. Open Gmail
2. Open 3+ tabs
3. Switch between tabs to activate history
4. Refresh the Gmail tab
5. Badge disappears and doesn't reappear

Expected: Badge should persist and update on refresh
Actual: Badge is gone and doesn't come back
Chrome: 131.0.6778.69 (Windows 11)
```

### Suggesting Enhancements

Open an issue with label `enhancement` and include:
- **Use case:** Why is this feature needed?
- **Proposed solution:** How would you implement it?
- **Alternative approaches:** What other solutions exist?

### Development Setup

#### Prerequisites
- Node.js 18+ (verify with `node --version`)
- npm 8+ (verify with `npm --version`)
- Git

#### Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/TabFlow.git
cd TabFlow

# Install dependencies
npm install

# Run tests to verify setup
npm test
```

#### Load Extension in Chrome

1. Go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select your local `TabFlow` directory
5. The extension appears in your toolbar

#### Hot Reload During Development

After making changes:
1. **For `src/lib/` changes:** Run tests to validate logic changes
   ```bash
   npm test -- --watch
   ```

2. **For content scripts or background:** Reload the extension in Chrome
   - Go to `chrome://extensions/`
   - Click the refresh icon on TabFlow
   - Reload your tab or open a new one to test

---

## 💻 Making Changes

### 1. Create a Feature Branch

```bash
git checkout -b feature/my-feature-name
```

Use descriptive branch names:
- `feature/dark-mode` ✅ Good
- `fix/favicon-mutation-race-condition` ✅ Good
- `my-changes` ❌ Vague
- `branch1` ❌ Unhelpful

### 2. Code Style Guidelines

#### JavaScript/ES6 Standards
- Use **ES6+ syntax** (arrow functions, destructuring, const/let, etc.)
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes
- Use **UPPERCASE_SNAKE_CASE** for constants

#### Comments & Documentation
- Write **JSDoc** comments for exported functions and classes
- Document non-obvious logic with inline comments
- Avoid over-commenting obvious code

**Example:**
```javascript
/**
 * Applies a favicon badge to indicate tab position in history
 * @param {number} tabId - The Chrome tab ID
 * @param {number} position - Position in history (0 = most recent)
 * @returns {Promise<void>}
 */
export async function applyFaviconBadge(tabId, position) {
  // Only badge tabs in history
  if (position < 0) return;

  // Create canvas for badge
  const badge = createBadge(position);
  // ... rest of implementation
}
```

#### File Organization
- One class/export per file (when reasonable)
- Group related functionality together
- Keep files under 300 lines (refactor if larger)

### 3. Write Tests

**All business logic changes require tests.**

#### For `src/lib/historyLogic.js` changes
- Add tests to `tests/historyLogic.test.js`
- Tests should cover:
  - Happy path (normal operation)
  - Edge cases (max size, empty history, invalid input)
  - Boundary conditions

**Example test:**
```javascript
test('should handle large history gracefully', () => {
  const manager = new TabHistoryManager(5);
  
  // Add 100 tabs
  for (let i = 1; i <= 100; i++) {
    manager.activateTab(i);
  }
  
  // Should only keep last 5
  expect(manager.getHistory().length).toBe(5);
  expect(manager.getHistory()[0]).toBe(100);
});
```

#### Running Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode (re-run on file change)
npm test -- --watch

# Run with coverage report
npm run test:coverage
```

**Coverage targets:** Aim for >80% line coverage on all new code.

### 4. Keep Commits Logical and Clean

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature: New functionality
git commit -m "feat: add badge color customization"

# Fix: Bug fix
git commit -m "fix: prevent infinite favicon redraw loop (#123)"

# Docs: Documentation changes
git commit -m "docs: update CONTRIBUTING.md with examples"

# Test: Test additions or changes
git commit -m "test: add edge case coverage for hydrate()"

# Refactor: Code refactoring without behavior change
git commit -m "refactor: extract favicon creation into helper function"

# Chore: Build, dependencies, CI
git commit -m "chore: update Jest to 29.5"
```

**Commit message format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example:**
```
feat(favicon): add support for custom badge colors

Users can now customize badge colors through the options page.
This required:
- Updating TabHistoryManager to store color preferences
- Modifying badge creation logic to use custom colors
- Extending options UI with color picker

Closes #42
```

### 5. Push and Create a Pull Request

```bash
# Push your branch
git push origin feature/my-feature-name
```

**In the PR description:**
- Reference related issues: `Closes #123`
- Describe what changed and why
- Include screenshots for UI changes
- List testing done

**PR Template:**
```markdown
## Description
What does this PR do?

## Related Issues
Closes #123

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] No regressions observed

## Screenshots (if applicable)
Before/After screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass locally (`npm test`)
- [ ] Commits follow conventional format
```

---

## 🔍 Code Review Process

1. **Automated checks:**
   - GitHub Actions runs tests on every push
   - All tests must pass before merge

2. **Manual review:**
   - Project maintainer reviews code
   - Feedback provided constructively
   - Changes requested if needed

3. **Approval & merge:**
   - Once approved, PR is merged
   - Your contribution is published in the next release

---

## 📚 Project Architecture (for Contributors)

### Core Files to Understand

1. **`src/lib/historyLogic.js`** — Pure business logic
   - No Chrome API dependencies
   - Fully testable
   - Reusable in other contexts

2. **`src/background/background.js`** — Service Worker
   - Listens to tab events
   - Manages state persistence
   - Broadcasts to content scripts

3. **`src/content/content.js`** — Content Script
   - Runs on every page
   - Manipulates favicons
   - Watches for favicon mutations
   - Depends on `src/lib/badgeConfig.js` and `src/lib/headObserver.js`, which the manifest injects as classic scripts *before* `content.js` (see `content_scripts.js` order) and expose their functions on `globalThis.TabFlowLib`. This keeps the two helper files out of `web_accessible_resources`, since nothing outside the extension's own content script needs to reach them.

4. **`src/options/`** — Settings UI
   - Modern gradient design
   - Live badge preview
   - Stores user configuration

### Key Concepts

**State Management:**
- History is an array of tab IDs ordered by recency
- Max size limits how many tabs are tracked
- State persists to `chrome.storage.session`

**Favicon Manipulation:**
- Create 16×16 canvas
- Draw colored background (red/orange/yellow)
- Draw white number
- Convert to PNG data URL
- Replace favicon `<link>` href

**The "Favicon War":**
- SPAs update favicons for notifications
- MutationObserver detects changes
- We recapture and redraw our badge on top

---

## 🔒 Security Considerations

### Permission Scope

TabFlow requests `host_permissions` and `content_scripts.matches` for all `http(s)://*/*` origins. This is broader than `activeTab` on purpose: the badge must render on tabs that are *not* currently active (any tab present in the tracked history gets its favicon updated on every activation event), and the content script needs to run at `document_start` on page load without waiting for user interaction. `activeTab` only grants access after an explicit user gesture on the active tab, which is incompatible with these requirements. Only permissions the code actually calls (`tabs`, `storage`) are declared — do not add `scripting` or other capabilities unless a change genuinely requires them.

## 🎯 Priority Areas for Contribution

**Good for first-time contributors:**
- Documentation improvements
- Bug fixes in non-core logic
- Test coverage improvements
- UI/UX refinements

**More complex (reach out first):**
- Architecture changes
- Core algorithm modifications
- Performance optimizations
- New major features

---

## 📞 Questions?

- Open a [GitHub Discussion](https://github.com/yourusername/TabFlow/discussions)
- Check existing issues and documentation
- Email: kayque@example.com

---

**Thank you for contributing to TabFlow! 🚀**

Together, we build better tools for better productivity.

