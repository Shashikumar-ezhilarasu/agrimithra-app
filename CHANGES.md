# CHANGES.md

## RAG Service Updates

### Core Changes

1. Modified the RAGChatbot class to work without relying on advanced ML libraries that were causing compatibility issues
2. Created a simplified version of the `retrieve()` method that falls back to basic keyword matching when SentenceTransformers is unavailable
3. Replaced the LLM-dependent `generate_answer()` method with a simpler version that formats retrieved documents directly
4. Updated the `chatbot()` method to include suggested follow-up questions based on the query category
5. Created a new `simple_rag_service.py` with no external ML dependencies for maximum compatibility

### API Improvements

1. Added better error handling in all API endpoints
2. Created a `/chat` endpoint that's compatible with the frontend's expected interface
3. Added a `/models` endpoint to support model switching in the frontend
4. Enhanced the `/analyze-image` endpoint with more demonstration responses
5. Added CORS middleware to support cross-origin requests

### Deployment Improvements

1. Created a `run_server.py` script that sets up the environment correctly before starting the server
2. Made the server script executable for easier running
3. Added a knowledge base directory with a README to explain the structure
4. Updated the project README with accurate installation and running instructions

## AI Chat Component

The component was fixed by ensuring proper export/import syntax:

1. Added default export to `ai-chat.tsx`
2. Ensured language context is properly imported and used
3. Fixed model selection logic to support both Gemini and RAG options

These changes allow the application to run without "invalid hook call" errors and provide a fallback mechanism when ML libraries have compatibility issues.

## Running the Application

1. Start the Next.js frontend:

```bash
pnpm dev
```

2. Start the RAG service (choose one option):

   Option 1 - Simple RAG service (no ML dependencies):

   ```bash
   python3 run_simple_server.py
   ```

   Option 2 - Full RAG service (requires ML libraries):

   ```bash
   python3 run_server.py
   ```

3. Access the application at `http://localhost:3000`
