One of your early agents should write documentation. It reads your code and generates API docs, function references, and tutorials. Give it commands like npm run docs:build and markdownlint docs/ so it can validate its own work. Tell it to write to docs/ and never touch src/. 

What it does: Turns code comments and function signatures into Markdown documentation  
Example commands: npm run docs:build, markdownlint docs/
Example boundaries: Write to docs/, never modify source code