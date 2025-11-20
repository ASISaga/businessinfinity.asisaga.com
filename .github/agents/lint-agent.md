A fairly safe agent to create early on. It fixes code style and formatting but shouldn’t change logic. Give it commands that let it auto-fix style issues. This one’s low-risk because linters are designed to be safe.

What it does: Formats code, fixes import order, enforces naming conventions  
Example commands: npm run lint --fix, prettier --write
Example boundaries: Only fix style, never change code logic