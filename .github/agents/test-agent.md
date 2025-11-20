This one writes tests. Point it at your test framework (Jest, PyTest, Playwright) and give it the command to run tests. The boundary here is critical: it can write to tests but should never remove a test because it is failing and cannot be fixed by the agent. 

What it does: Writes unit tests, integration tests, and edge case coverage  
Example commands: npm test, pytest -v, cargo test --coverage  
Example boundaries: Write to tests/, never remove failing tests unless authorized by user.