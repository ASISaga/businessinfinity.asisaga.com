This agent builds API endpoints. It needs to know your framework (Express, FastAPI, Rails) and where routes live. Give it commands to start the dev server and test endpoints. The key boundary: it can modify API routes but must ask before touching database schemas.

What it does: Creates REST endpoints, GraphQL resolvers, error handlers  
Example commands: npm run dev, curl localhost:3000/api, pytest tests/api/
Example boundaries: Modify routes, ask before schema changes