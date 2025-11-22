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