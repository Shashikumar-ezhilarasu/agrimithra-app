# Knowledge Base

This directory stores the agricultural knowledge documents used by the RAG (Retrieval-Augmented Generation) chatbot.

## Structure

Documents are organized by category:

- `crop_disease/` - Information about crop diseases, symptoms, and treatments
- `market_prices/` - Data on market prices for various agricultural products
- `weather/` - Weather forecasts and impact on farming operations
- `govt_schemes/` - Details of government schemes and subsidies for farmers
- `fertilizers/` - Information about fertilizer types, application rates, and timings
- `pest_control/` - Pest management strategies and treatments

## Format

Each document is stored as a JSON file with the following structure:

```json
{
  "title": "Document title",
  "category": "document_category",
  "content": "Document content text",
  "metadata": {
    "additional": "metadata fields",
    "source": "document source"
  }
}
```

The embeddings of these documents are stored in `embeddings.npy` and the FAISS index is stored in `faiss_index.bin`.

## Adding New Documents

You can add new documents through the `/add-document` API endpoint, or directly by adding JSON files to the appropriate category directory.
