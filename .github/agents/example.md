/
Blog


Home / AI & ML / GitHub Copilot
How to write a great agents.md: Lessons from over 2,500 repositories
Learn how to write effective agents.md files for GitHub Copilot with practical tips, real examples, and templates from analyzing 2,500+ repositories.


Matt Nigh·@mattnigh
November 19, 2025
5 minutes
Share:
We recently released a new GitHub Copilot feature: custom agents defined in agents.md files. Instead of one general assistant, you can now build a team of specialists: a @docs-agent for technical writing, a @test-agent for quality assurance, and a @security-agent for security analysis. Each agents.md file acts as an agent persona, which you define with frontmatter and custom instructions.

agents.md is where you define all the specifics: the agent’s persona, the exact tech stack it should know, the project’s file structure, workflows, and the explicit commands it can run. It’s also where you provide code style examples and, most importantly, set clear boundaries of what not to do.

The challenge? Most agent files fail because they’re too vague. “You are a helpful coding assistant” doesn’t work. “You are a test engineer who writes tests for React components, follows these examples, and never modifies source code” does.

I analyzed over 2,500 agents.md files across public repos to understand how developers were using agents.md files. The analysis showed a clear pattern of what works: provide your agent a specific job or persona, exact commands to run, well-defined boundaries to follow, and clear examples of good output for the agent to follow. 

Here’s what the successful ones do differently.

What works in practice: Lessons from 2,500+ repos
My analysis of over 2,500 agents.md files revealed a clear divide between the ones that fail and the ones that work. The successful agents aren’t just vague helpers; they are specialists. Here’s what the best-performing files do differently:

Put commands early: Put relevant executable commands in an early section: npm test, npm run build, pytest -v. Include flags and options, not just tool names. Your agent will reference these often.
Code examples over explanations: One real code snippet showing your style beats three paragraphs describing it. Show what good output looks like.
Set clear boundaries: Tell AI what it should never touch (e.g., secrets, vendor directories, production configs, or specific folders). “Never commit secrets” was the most common helpful constraint.
Be specific about your stack: Say “React 18 with TypeScript, Vite, and Tailwind CSS” not “React project.” Include versions and key dependencies.
Cover six core areas: Hitting these areas puts you in the top tier: commands, testing, project structure, code style, git workflow, and boundaries. 
Example of a great agent.md file
Below is an example for adding a documentation agent.md persona in your repo to .github/agents/docs-agent.md:

---
name: docs_agent
description: Expert technical writer for this project
---

You are an expert technical writer for this project.

## Your role
- You are fluent in Markdown and can read TypeScript code
- You write for a developer audience, focusing on clarity and practical examples
- Your task: read code from `src/` and generate or update documentation in `docs/`

## Project knowledge
- **Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS
- **File Structure:**
  - `src/` – Application source code (you READ from here)
  - `docs/` – All documentation (you WRITE to here)
  - `tests/` – Unit, Integration, and Playwright tests

## Commands you can use
Build docs: `npm run docs:build` (checks for broken links)
Lint markdown: `npx markdownlint docs/` (validates your work)

## Documentation practices
Be concise, specific, and value dense
Write so that a new developer to this codebase can understand your writing, don’t assume your audience are experts in the topic/area you are writing about.

## Boundaries
- ✅ **Always do:** Write new files to `docs/`, follow the style examples, run markdownlint
- ⚠️ **Ask first:** Before modifying existing documents in a major way
- 🚫 **Never do:** Modify code in `src/`, edit config files, commit secrets