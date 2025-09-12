# AgriMithra - Agricultural Assistant App

AgriMithra is an AI-powered agricultural assistant designed to help farmers with crop disease diagnosis, market price information, weather forecasts, government schemes, fertilizer recommendations, and pest control methods.

## Features

- **Dual-Model Chat System:**

  - Gemini API for general queries
  - RAG-based chatbot for specialized agricultural knowledge

- **Agricultural Knowledge Base:**

  - Crop disease analysis and treatment
  - Current market prices and trends
  - Weather forecasting and field operation guidance
  - Government schemes and subsidies
  - Fertilizer recommendations
  - Pest control methods

- **Multilingual Support:**

  - English
  - Hindi
  - Tamil
  - Kannada (partial)

- **Interactive UI:**
  - Voice input
  - Image analysis
  - Video analysis
  - NFC tag scanning

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.9+
- Gemini API key

### Installation

1. Install frontend dependencies:

```bash
pnpm install
```

2. Set up Python environment for the RAG service:

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sentence-transformers faiss-cpu numpy
```

3. Set up environment variables:

```bash
# Create .env.local
touch .env.local

# Add your Gemini API key and RAG service URL
echo "NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here" >> .env.local
echo "NEXT_PUBLIC_RAG_SERVICE_URL=http://localhost:8000" >> .env.local
```

### Running the Application

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

## RAG Service

The RAG (Retrieval-Augmented Generation) service uses specialized agricultural knowledge to provide context-aware responses. It works by:

1. Retrieving relevant information from the knowledge base
2. Generating a comprehensive response using the retrieved context
3. Providing references and follow-up questions

The RAG service has been designed to work in situations with limited ML library compatibility. It will automatically fall back to simpler methods if advanced features like SentenceTransformers are unavailable.

To add new documents to the knowledge base:

```bash
curl -X POST "http://localhost:8000/add-document" \
     -H "Content-Type: application/json" \
     -d '{"title": "Document Title", "content": "Document content...", "category": "crop_disease"}'
```

## Sample Questions

The application is designed to handle a wide range of agricultural queries, including:

### Crop Disease Analysis

- "My tomato leaves have yellow spots — what is this?"
- "How to treat powdery mildew on grapes?"
- "How to identify early blight vs late blight on potato?"

### Market Prices

- "What is today's mandi price for onion in Kochi?"
- "Compare price of paddy in Palakkad vs Thrissur"
- "Expected price trend next 7 days for tomato"

### Weather Forecast

- "Is there rain expected in my village tomorrow?"
- "Is weather suitable for harvesting today?"
- "Wind speed forecast for next 24 hours (spraying safety)?"

### Government Schemes

- "What are the current subsidy schemes for drip irrigation?"
- "How to apply for PMFBY crop insurance in my district?"
- "Latest scheme for micro-irrigation in Kerala"

### Fertilizer Recommendations

- "How much urea and DAP per acre for paddy?"
- "Soil test says N low — what fertilizer & dose?"
- "Recommended fertilizer for coconut palms"

### Pest Control Methods

- "Aphid infestation on cotton — treatment now?"
- "Best IPM steps for stem borer in sugarcane"
- "How to make neem-based spray recipe?"

## License

This project is part of SIH 2025. Created by students of SRM.
