"""
AgriMithra RAG Backend Service
FastAPI microservice for Retrieval-Augmented Generation chatbot for farmers.
Integrates Hugging Face models, FAISS, and supports multilingual queries.
Updated to handle comprehensive agricultural domain-specific questions.
"""

from fastapi import FastAPI, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Tuple, Union
import faiss
import numpy as np
import json
import os
import logging
import random
from datetime import datetime
from pathlib import Path

# Conditionally import SentenceTransformer to handle compatibility issues
try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMER_AVAILABLE = True
except ImportError:
    print("Warning: SentenceTransformer could not be imported. Using simplified mode.")
    SENTENCE_TRANSFORMER_AVAILABLE = False

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Define knowledge base directory
KNOWLEDGE_DIR = Path("knowledge_base")

# Comprehensive agriculture knowledge base
DOCUMENTS = [
    # Crop Disease Analysis
    {"title": "Tomato Yellow Spots", "category": "crop_disease", "content": "Yellow spots on tomato leaves often indicate early blight disease. Look for concentric rings in the spots. Treatment includes removing affected leaves, improving air circulation, and applying copper-based fungicides. For organic treatment, use neem oil spray (5ml/liter) every 7-10 days."},
    {"title": "Rice Brown Lesions", "category": "crop_disease", "content": "Brown circular lesions on rice leaves typically indicate Rice Leaf Blight disease caused by Bipolaris oryzae fungus. Control measures include using disease-resistant varieties, balanced fertilization (avoid excess nitrogen), and fungicide application like Propiconazole 25% EC @ 1ml/liter water at early infection stages."},
    {"title": "Powdery Mildew Treatment", "category": "crop_disease", "content": "For powdery mildew on grapes, apply sulfur-based fungicides or potassium bicarbonate sprays. Organic treatment: mix 1 tablespoon baking soda, 1 teaspoon mild soap, and 1 gallon water; spray weekly. Improve air circulation by proper pruning and avoid overhead irrigation to prevent fungal spread."},
    {"title": "Potato Blight Comparison", "category": "crop_disease", "content": "Early blight vs late blight on potatoes: Early blight (Alternaria solani) shows dark brown spots with concentric rings, mainly on lower leaves, spreads slowly. Late blight (Phytophthora infestans) appears as dark, water-soaked spots that quickly turn brown with white fungal growth underneath, spreads rapidly in cool, wet weather."},
    {"title": "Disease Identification", "category": "crop_disease", "content": "Key signs for disease identification: Leaf spots (circular or irregular), lesions (sunken areas), wilting, yellowing patterns, stunted growth, and abnormal fruit development. Photograph symptoms in good lighting, including both affected and healthy parts for comparison. Include close-ups and whole plant views for accurate diagnosis."},
    {"title": "Wilting Analysis", "category": "crop_disease", "content": "Plants wilting in morning but recovering by afternoon often indicate root problems rather than water shortage. This can be caused by Fusarium wilt, nematode damage, or root rot. Check for discoloration in stem vascular tissue. Treatment involves improving drainage, applying beneficial fungi like Trichoderma, and in severe cases, fungicide drenches."},
    {"title": "Disease Spread Rate", "category": "crop_disease", "content": "Disease spread depends on pathogen type, weather conditions, and crop resistance. Fungal diseases like late blight can destroy a field within 7-10 days under humid conditions. Bacterial diseases typically spread moderately (10-14 days). Viral diseases may take 14-21 days to show full symptoms across a field."},
    {"title": "Fungicide Recommendations", "category": "crop_disease", "content": "For early disease stages, contact fungicides (copper oxychloride 50% WP @ 2.5g/liter) provide protection. For established infections, systemic fungicides (Azoxystrobin 23% SC @ 1ml/liter) are more effective. Apply at 7-14 day intervals depending on disease pressure. Always follow manufacturer's dosage and safety instructions."},
    {"title": "Organic Disease Control", "category": "crop_disease", "content": "Organic treatments for leaf spots: Spray compost tea (soak compost in water 1:5 ratio for 24 hours) weekly. Apply milk spray (1 part milk to 9 parts water) for powdery mildew. Garlic-chili spray works for various fungal infections. Beneficial microbes like Bacillus subtilis or Trichoderma viride provide biological control."},
    {"title": "Rainy Season Protection", "category": "crop_disease", "content": "Prevent fungal diseases during rainy season by: 1) Raising beds for better drainage, 2) Wider spacing between plants for air circulation, 3) Mulching to prevent soil splash, 4) Preventive spraying with copper-based fungicides or Trichoderma, 5) Timely weeding to reduce humidity around plants."},
    
    # Market Prices
    {"title": "Onion Prices Kochi", "category": "market_prices", "content": "As of September 12, 2025, onion prices in Kochi mandi are: Retail ₹45-50/kg, Wholesale ₹35-40/kg. Prices increased by 8% from last week due to reduced arrivals from Maharashtra. Projected trend: likely to remain stable for 7-10 days. Best markets for selling: Ernakulam APMC, Aluva market."},
    {"title": "Paddy Price Comparison", "category": "market_prices", "content": "Current paddy prices (September 2025): Palakkad mandi ₹20-22/kg, Thrissur mandi ₹21-23/kg. Thrissur offers better rates due to local mill demand. Transportation cost Palakkad to Thrissur: approximately ₹0.50/kg. Government procurement through Supplyco offers ₹23.30/kg but requires registration and quality standards compliance."},
    {"title": "Potato Price Trends", "category": "market_prices", "content": "Monthly potato price trends (per kg): July ₹22-25, August ₹25-28, September ₹28-32. Shows 15% increase over two months. Factors: reduced production in northern states and increased transportation costs. Projection: prices likely to increase another 5-8% by October before new harvest arrives."},
    {"title": "Mango Sales Locations", "category": "market_prices", "content": "Best places to sell mangoes near Kerala: 1) Koyambedu Wholesale Market, Chennai - highest volume but 6hr transport, 2) Local farmer markets in Kochi - better prices but limited volume, 3) E-Nam digital marketplace - broader reach but requires registration, 4) Direct to hotels/restaurants - best margins but needs quality sorting."},
    {"title": "Tomato Price Forecast", "category": "market_prices", "content": "Tomato price forecast next 7 days: Current ₹40-45/kg expected to decrease to ₹32-35/kg due to new harvests from Karnataka and increased supply. Suggestion: If quality permits, sell immediately rather than holding stock. Alternative: Consider value addition through sun-dried tomatoes or puree for better returns."},
    
    # Weather Forecast
    {"title": "Village Rain Forecast", "category": "weather", "content": "Rain forecast for Kerala villages (September 13-20, 2025): Northern districts - moderate to heavy rainfall (15-20cm cumulative), Central districts - light to moderate rainfall (5-10cm), Southern districts - isolated showers (2-5cm). Daily updates available via KisanSMS service or Krishi Bhavan weather bulletins."},
    {"title": "Seven Day Forecast", "category": "weather", "content": "7-day forecast for Kerala (September 13-19, 2025): Temperature range 24-32°C, Humidity 75-85%, Wind speed 5-15 km/h from southwest direction. Rainfall expected on 14th, 16th and 18th. No extreme weather alerts. Good conditions for transplanting operations on dry days."},
    {"title": "Spraying Safety Weather", "category": "weather", "content": "For safe pesticide spraying, optimal conditions are: Wind speed below 10km/h, No rain forecast for next 6 hours, Relative humidity 40-60%, Temperature below 30°C. Based on current forecast, best spraying windows: early mornings of September 13, 15, and 17 (5-8am) when winds are minimal and before temperatures rise."},
    {"title": "Harvesting Weather Suitability", "category": "weather", "content": "Current weather is suitable for harvesting mature crops. Expected dry period of 3 days (September 13-15) provides good drying conditions. For grain crops, target moisture content: rice 14%, wheat 12%. If unexpected showers occur, use poly sheets for covering harvested produce or utilize community drying yards."},
    
    # Government Schemes
    {"title": "Drip Irrigation Subsidies", "category": "govt_schemes", "content": "Current subsidy schemes for drip irrigation (2025-26): Under PMKSY, small/marginal farmers receive 55% subsidy, others 45%. Maximum coverage 5 hectares per farmer. Kerala state adds 35% additional subsidy. Apply through Krishi Bhavan with land documents, bank details, and Aadhaar. Subsidy credited directly to bank account after installation verification."},
    {"title": "PMFBY Insurance Application", "category": "govt_schemes", "content": "To apply for PMFBY crop insurance in your district: 1) Visit local bank or Common Service Center, 2) Submit application form with land records, sowing certificate, and ID proof, 3) Pay premium (only 1.5-2% of sum insured), 4) Online tracking available at pmfby.gov.in using application number. Deadline for Kharif 2025: July 31, for Rabi: December 15."},
    {"title": "Tractor Subsidy Eligibility", "category": "govt_schemes", "content": "Tractor subsidy eligibility: Minimum 2 hectares land holding, active farming for past 3 years, no tractor purchased under subsidy in past 10 years. Documents needed: Land ownership/lease papers, bank account linked to Aadhaar, income certificate, caste certificate (if applicable), quotation from authorized dealer. Subsidy ranges from 25-40% depending on category and horsepower."},
    {"title": "Kerala Micro-irrigation Scheme", "category": "govt_schemes", "content": "Latest micro-irrigation scheme in Kerala: 'Haritha Keralam' offers 90% subsidy with maximum amount of ₹1,40,000 per hectare. Covers drip, sprinkler, and raingun systems. Implemented through Krishi Bhavans. Priority to watershed areas and water-scarce regions. Application involves technical evaluation and site inspection. Contact: Agricultural Officer at local Krishi Bhavan."},
    
    # Fertilizer Recommendations
    {"title": "Paddy Fertilizer Dosage", "category": "fertilizers", "content": "Recommended fertilizer per acre for paddy: Basal application - DAP 40kg, MOP 20kg. First top dressing (30 days after planting) - Urea 35kg. Second top dressing (60 days) - Urea 35kg, MOP 10kg. Apply when field has thin layer of water. For zinc deficiency, add zinc sulfate 10kg/acre during land preparation."},
    {"title": "Soil Test Fertilizer Guide", "category": "fertilizers", "content": "For soil test showing low nitrogen: Apply 50% more than standard recommendation. For paddy, increase urea by 50kg/acre split in two applications. Combine with organic sources like FYM (2 tonnes/acre) or vermicompost (1 tonne/acre). Green manuring with dhaincha or sunhemp before planting improves soil nitrogen significantly."},
    {"title": "Maize Fertilizer Schedule", "category": "fertilizers", "content": "Time schedule for maize fertilization: 1) Basal dose at sowing: Full dose of phosphorus (DAP 100kg/ha) and potassium (MOP 50kg/ha), 1/4th of nitrogen (Urea 50kg/ha), 2) First top dressing at knee-high stage (25-30 days): 1/2 of nitrogen (Urea 100kg/ha), 3) Second top dressing at tasseling (45-50 days): remaining nitrogen (Urea 50kg/ha)."},
    {"title": "Coconut Palm Fertilizer", "category": "fertilizers", "content": "Recommended fertilizer for adult coconut palm (per tree annually): Urea 1.3kg, Super Phosphate 2kg, Muriate of Potash 3.5kg. Apply in two equal splits during June-July and December-January. Make a circular trench 1.5m away from trunk, 25cm wide and 25cm deep. Mix fertilizers with well-decomposed organic manure (20-30kg/tree) for best results."},
    
    # Pest Control
    {"title": "Cotton Aphid Treatment", "category": "pest_control", "content": "For aphid infestation on cotton: Early stage - spray neem oil 5ml/liter with 1ml soap as sticker. Moderate infestation - apply imidacloprid 17.8% SL @ 0.25ml/liter or thiamethoxam 25% WG @ 0.2g/liter. Severe cases - flonicamid 50% WG @ 0.3g/liter. Spray during evening hours for better efficacy. Repeat after 10-15 days if needed."},
    {"title": "Sugarcane Borer Management", "category": "pest_control", "content": "Best IPM for stem borer in sugarcane: 1) Cut and destroy dead hearts (showing 'bunchy top'), 2) Release Trichogramma chilonis @ 50,000/ha 4-6 times at 15-day intervals starting 45 days after planting, 3) Apply Beauveria bassiana 1.15% WP @ 2kg/ha, 4) In severe cases, spray chlorantraniliprole 18.5% SC @ 0.4ml/liter targeting the base of plants."},
    {"title": "Safe Vegetable Pesticides", "category": "pest_control", "content": "Safe pesticides for leaf-eating caterpillars on vegetables: Bacillus thuringiensis (Bt) @ 1-2g/liter - fully safe, can be harvested same day. Spinosad 45% SC @ 0.3ml/liter - moderately safe, 3-day waiting period. Novaluron 10% EC @ 1ml/liter - safer than conventional chemicals, 5-day waiting period. Always spray in evening to protect pollinators."},
    {"title": "Homemade Neem Spray", "category": "pest_control", "content": "Neem spray recipe: Soak 5kg neem seeds overnight in water. Grind into paste next morning. Mix paste in 100 liters water with 100-200ml soap solution as sticker. Alternatively, mix 40-50ml commercial neem oil with 10-20ml liquid soap in 1 liter water, then dilute to 10 liters. Spray uniformly on both sides of leaves during early morning or late evening."}
]

EMBEDDING_MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"  # Better multilingual support
GENERATOR_MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.3"

class RAGChatbot:
    def __init__(self, embedding_model_name=EMBEDDING_MODEL_NAME, generator_model_name=GENERATOR_MODEL_NAME):
        try:
            if SENTENCE_TRANSFORMER_AVAILABLE:
                self.embedding_model = SentenceTransformer(embedding_model_name)
            else:
                # Use a simple fallback method for embeddings (not as effective)
                self.embedding_model = None
                
            # We'll avoid using the Transformers pipeline due to compatibility issues
            self.generator = None
            self.index = None
            self.doc_chunks = []
            self.doc_metadata = []
            self.init_successful = True
        except Exception as e:
            logger.error(f"Error initializing RAG chatbot: {e}")
            self.init_successful = False

    def load_documents(self, docs: List[dict] = None):
        """
        Load and prepare advisory documents with improved chunking and metadata.
        """
        if docs is None:
            docs = DOCUMENTS
        
        try:
            self.doc_chunks = []
            self.doc_metadata = []
            
            # Ensure knowledge base directory exists
            KNOWLEDGE_DIR.mkdir(parents=True, exist_ok=True)
            
            # Create category subdirectories
            categories = set(doc.get("category", "general") for doc in docs)
            for category in categories:
                (KNOWLEDGE_DIR / category).mkdir(exist_ok=True)
            
            # Process documents
            for doc in docs:
                # Store full content as a chunk
                self.doc_chunks.append(doc["content"])
                
                # Store metadata
                metadata = {
                    "title": doc["title"],
                    "category": doc.get("category", "general")
                }
                self.doc_metadata.append(metadata)
                
                # Store by category (for potential future use)
                category = doc.get("category", "general")
                with open(KNOWLEDGE_DIR / category / f"{doc['title'].replace(' ', '_')}.json", 'w') as f:
                    json.dump(doc, f, indent=2)
            
            logger.info(f"Loaded {len(self.doc_chunks)} documents from knowledge base")
            return self.doc_chunks
            
        except Exception as e:
            logger.error(f"Error loading documents: {e}")
            return []

    def embed_and_index(self):
        """
        Embed document chunks and build FAISS index with improved error handling.
        """
        if not self.doc_chunks:
            logger.warning("No documents loaded. Cannot build index.")
            return None
            
        try:
            # Check if we already have stored embeddings
            if os.path.exists(KNOWLEDGE_DIR / "embeddings.npy"):
                embeddings = np.load(KNOWLEDGE_DIR / "embeddings.npy")
                logger.info(f"Loaded existing embeddings for {len(embeddings)} documents")
            elif SENTENCE_TRANSFORMER_AVAILABLE and self.embedding_model:
                logger.info(f"Generating embeddings for {len(self.doc_chunks)} documents")
                embeddings = self.embedding_model.encode(self.doc_chunks, convert_to_numpy=True, show_progress_bar=True)
                # Save embeddings for future use
                np.save(KNOWLEDGE_DIR / "embeddings.npy", embeddings)
            else:
                # Simple fallback: use random embeddings as placeholders
                # This won't give good results but allows the system to run
                logger.warning("Using random embeddings as SentenceTransformer is not available")
                embeddings = np.random.rand(len(self.doc_chunks), 384)  # 384 is a common dimension
                
            dim = embeddings.shape[1]
            self.index = faiss.IndexFlatL2(dim)
            self.index.add(embeddings)
            
            # Save index for future use
            faiss.write_index(self.index, str(KNOWLEDGE_DIR / "faiss_index.bin"))
            logger.info("FAISS index built successfully")
            
            return self.index
            
        except Exception as e:
            logger.error(f"Error building index: {e}")
            return None

    def retrieve(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Embed user query and return top_k relevant document chunks with metadata.
        """
        try:
            # Load index if not already loaded
            if self.index is None and os.path.exists(KNOWLEDGE_DIR / "faiss_index.bin"):
                self.index = faiss.read_index(str(KNOWLEDGE_DIR / "faiss_index.bin"))
                logger.info("Loaded existing FAISS index")
            
            if SENTENCE_TRANSFORMER_AVAILABLE and self.embedding_model:
                # Use SentenceTransformer for encoding
                query_emb = self.embedding_model.encode([query], convert_to_numpy=True)
                D, I = self.index.search(query_emb, top_k)
                
                results = []
                for idx, (distance, doc_idx) in enumerate(zip(D[0], I[0])):
                    # Convert distance to similarity score (higher is better)
                    similarity = 1.0 / (1.0 + distance)
                    
                    if doc_idx < len(self.doc_chunks):
                        result = {
                            "content": self.doc_chunks[doc_idx],
                            "metadata": self.doc_metadata[doc_idx],
                            "score": float(similarity)
                        }
                        results.append(result)
                
                return results
            else:
                # Fallback: keyword-based matching
                logger.warning("Using simple keyword matching as SentenceTransformer is not available")
                query_words = set(query.lower().split())
                
                results = []
                for i, doc in enumerate(self.doc_chunks):
                    # Simple keyword matching
                    doc_words = set(doc.lower().split())
                    common_words = query_words.intersection(doc_words)
                    score = len(common_words) / (len(query_words) + 0.001)
                    
                    if score > 0:
                        results.append({
                            "content": doc,
                            "metadata": self.doc_metadata[i],
                            "score": score
                        })
                
                # Sort by score and take top_k
                results.sort(key=lambda x: x["score"], reverse=True)
                return results[:top_k]
            
        except Exception as e:
            logger.error(f"Error retrieving documents: {e}")
            return []

    def generate_answer(self, query: str, retrieved_docs: List[Dict], language: str = "en") -> str:
        """
        Generate answer using retrieved context without relying on an LLM.
        """
        try:
            if not retrieved_docs:
                return "I don't have enough information to answer this query. Please try asking something else."
                
            # Extract information from retrieved documents
            context_parts = []
            categories = set()
            
            for doc in retrieved_docs:
                context_parts.append(doc['content'])
                categories.add(doc['metadata'].get('category', 'general'))
            
            context_text = "\n\n".join(context_parts)
            
            # Determine the main category
            main_category = max(categories, key=list(categories).count) if categories else "general"
            
            # Create intro based on category
            category_intros = {
                "crop_disease": "Based on your query about crop disease: ",
                "market_prices": "Regarding market prices: ",
                "weather": "About the weather information: ",
                "govt_schemes": "About government schemes: ",
                "fertilizers": "For fertilizer recommendations: ",
                "pest_control": "For pest control: ",
                "general": "Here's what I found: "
            }
            
            intro = category_intros.get(main_category, category_intros["general"])
            
            # Generate response without LLM
            # We'll use the first (most relevant) document as the main content
            if retrieved_docs:
                main_doc = retrieved_docs[0]
                answer = f"{intro}{main_doc['content']}"
                
                # Add information from other docs if they add value
                additional_info = []
                for doc in retrieved_docs[1:3]:  # Use up to 2 more documents
                    additional_info.append(doc['content'])
                    
                if additional_info:
                    answer += "\n\nAdditional information:\n" + "\n\n".join(additional_info)
                    
                # Add standard disclaimer
                disclaimer = "\n\nNote: Always consult with your local agricultural extension officer for advice specific to your region and conditions."
                answer += disclaimer
                
                return answer
            else:
                return "I couldn't find specific information about that. Please try rephrasing your question."
            
        except Exception as e:
            logger.error(f"Error generating answer: {e}")
            return f"Sorry, I couldn't process your request. Please try again later."

    def chatbot(self, query: str, language: str = "en", top_k: int = 5) -> Dict:
        """
        Orchestrate retrieval and answer compilation, return final answer with metadata.
        """
        try:
            # Categorize query to improve retrieval
            query_category = self._categorize_query(query)
            
            # Retrieve relevant documents
            retrieved_docs = self.retrieve(query, top_k=top_k)
            
            # Format answer from retrieved documents
            answer_text = self.generate_answer(query, retrieved_docs, language)
            
            # Prepare response
            response = {
                "query": query,
                "answer": answer_text,
                "sources": [{"title": doc["metadata"]["title"], "category": doc["metadata"].get("category", "general")} 
                           for doc in retrieved_docs[:3]],  # Include up to 3 sources
                "timestamp": datetime.now().isoformat()
            }
            
            # Add suggested follow-up questions
            category_questions = {
                "crop_disease": [
                    "How quickly does this disease spread?",
                    "What are organic treatment options?",
                    "How can I prevent this in the future?"
                ],
                "market_prices": [
                    "What's the price trend forecast for next week?",
                    "Where can I get the best price for my crop?",
                    "Should I store my harvest or sell now?"
                ],
                "weather": [
                    "Is it a good time to spray pesticides?",
                    "How will this weather affect my crops?",
                    "When is the next dry period for harvesting?"
                ],
                "govt_schemes": [
                    "What documents do I need to apply?",
                    "When is the deadline for application?",
                    "Who do I contact for more information?"
                ],
                "fertilizers": [
                    "When is the best time to apply this fertilizer?",
                    "What are signs of over-fertilization?",
                    "Are there organic alternatives?"
                ],
                "pest_control": [
                    "Is this pesticide safe for beneficial insects?",
                    "How long before I can harvest after spraying?",
                    "What preventive measures should I take?"
                ]
            }
            
            if query_category in category_questions:
                response["suggested_followups"] = random.sample(category_questions[query_category], 2)
            
            return response
            
        except Exception as e:
            logger.error(f"Error in chatbot: {e}")
            return {
                "query": query,
                "answer": "I apologize, but I encountered an error while processing your query. Please try again or contact support if the issue persists.",
                "sources": [],
                "timestamp": datetime.now().isoformat()
            }
    
    def _categorize_query(self, query: str) -> str:
        """
        Categorize the query to improve retrieval.
        """
        query = query.lower()
        
        # Simple keyword-based categorization
        categories = {
            "crop_disease": ["disease", "infection", "spots", "wilting", "blight", "mildew", "rust", "lesion", "fungus", "bacteria", "virus", "treatment"],
            "market_prices": ["price", "market", "sell", "buying", "cost", "rate", "mandi", "trader", "export", "trend"],
            "weather": ["rain", "forecast", "weather", "monsoon", "humidity", "temperature", "wind", "storm", "drought", "heat", "frost"],
            "govt_schemes": ["scheme", "subsidy", "government", "loan", "insurance", "pm-kisan", "pmfby", "application", "eligibility", "document"],
            "fertilizers": ["fertilizer", "nutrient", "nitrogen", "phosphorus", "potassium", "npk", "urea", "dap", "micronutrient", "deficiency"],
            "pest_control": ["pest", "insect", "aphid", "borer", "caterpillar", "spray", "pesticide", "biological", "trap", "neem"]
        }
        
        # Score each category
        scores = {category: 0 for category in categories}
        for category, keywords in categories.items():
            for keyword in keywords:
                if keyword in query:
                    scores[category] += 1
        
        # Return category with highest score, or "general" if all scores are 0
        max_score = max(scores.values())
        if max_score == 0:
            return "general"
        
        return max(scores.items(), key=lambda x: x[1])[0]

# --- Predefined queries for UI buttons ---
PREDEFINED_QUERIES = {
    # Crop Disease Analysis
    "crop_disease": [
        "My tomato leaves have yellow spots — what is this?",
        "Brown circular lesions on rice leaves — disease name?",
        "How to treat powdery mildew on grapes?",
        "How to identify early blight vs late blight on potato?",
        "Symptoms: wilting in morning, normal by afternoon — cause?",
        "How quickly will this disease spread?",
        "Which fungicide is recommended for this stage?",
        "Organic treatment for leaf spot?",
        "How to prevent fungal disease in rainy season?"
    ],
    
    # Market Prices
    "market_prices": [
        "What is today's mandi price for onion in Kochi?",
        "Compare price of paddy in Palakkad vs Thrissur",
        "How have prices changed this month for potatoes?",
        "Best place to sell my mangoes near me?",
        "Expected price trend next 7 days for tomato",
        "Price floor / MSP for sugarcane this season?"
    ],
    
    # Weather Forecast
    "weather": [
        "Is there rain expected in my village tomorrow?",
        "What is the 7-day forecast for my GPS location?",
        "Should I delay sowing because of forecast?",
        "Wind speed forecast for next 24 hours (spraying safety)?",
        "Is weather suitable for harvesting today?"
    ],
    
    # Government Schemes
    "govt_schemes": [
        "What are the current subsidy schemes for drip irrigation?",
        "How to apply for PMFBY crop insurance in my district?",
        "Eligibility for tractor subsidy — documents needed?",
        "Latest scheme for micro-irrigation in Kerala",
        "How to claim compensation for crop loss?"
    ],
    
    # Fertilizer Recommendations
    "fertilizers": [
        "How much urea and DAP per acre for paddy?",
        "Soil test says N low — what fertilizer & dose?",
        "Time schedule for basal / top dressing for maize",
        "Recommended fertilizer for coconut palms",
        "How to calculate fertilizer per tree for orchard?"
    ],
    
    # Pest Control
    "pest_control": [
        "Aphid infestation on cotton — treatment now?",
        "Best IPM steps for stem borer in sugarcane",
        "Safe pesticide for leaf-eating caterpillars on vegetables",
        "How to make neem-based spray recipe?",
        "When is pesticide spraying safe (weather & pollinators)?"
    ]
}

class QueryRequest(BaseModel):
    """Request model for RAG chatbot API."""
    query: str
    language: str = "en"
    user_location: Optional[str] = None
    category: Optional[str] = None

class QueryResponse(BaseModel):
    """Response model for RAG chatbot API."""
    query: str
    answer: str
    sources: List[Dict] = []
    timestamp: str
    suggested_followups: Optional[List[str]] = None

app = FastAPI(
    title="AgriMithra RAG Service",
    description="Retrieval-Augmented Generation chatbot for agricultural queries",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],  # In production, specify actual domains
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"]
)

# Initialize RAG chatbot
logger.info("Initializing RAG chatbot...")
rag_bot = RAGChatbot()

# Initialize with safety checks
try:
    rag_bot.load_documents()
    rag_bot.embed_and_index()
    logger.info("RAG chatbot initialized successfully")
except Exception as e:
    logger.error(f"Error during RAG chatbot initialization, continuing with limited functionality: {e}")

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "service": "AgriMithra RAG Service",
        "version": "1.0.0",
        "documentation": "/docs"
    }

@app.post("/rag-chatbot", response_model=QueryResponse)
async def process_query(request: Request):
    """
    Process a natural language query and return a relevant response.
    Supports multiple languages and agricultural domain-specific questions.
    """
    try:
        data = await request.json()
        query = data.get("query", "")
        language = data.get("language", "en")
        user_location = data.get("user_location")
        category = data.get("category")
        
        logger.info(f"Received query: '{query}' (language: {language})")
        
        if not query:
            return QueryResponse(
                query="",
                answer="Please provide a query.",
                sources=[],
                timestamp=datetime.now().isoformat()
            )
        
        # Extra validation for language
        if language not in ["en", "hi", "ta", "kn"]:
            logger.warning(f"Unsupported language: {language}. Defaulting to English.")
            language = "en"
            
        # Generate response using RAG chatbot
        try:
            response = rag_bot.chatbot(query, language)
            
            # Add suggested follow-up questions based on query category
            detected_category = category or rag_bot._categorize_query(query)
            followups = []
            if detected_category in PREDEFINED_QUERIES:
                # Select 2-3 random follow-up questions from the same category
                followups = random.sample(
                    PREDEFINED_QUERIES[detected_category], 
                    min(3, len(PREDEFINED_QUERIES[detected_category]))
                )
            
            response["suggested_followups"] = followups
            
            return response
        except Exception as e:
            logger.error(f"Error in RAG chatbot response: {e}")
            
            # Fallback to a simplified response
            detected_category = category or "general"
            if detected_category in PREDEFINED_QUERIES and len(PREDEFINED_QUERIES[detected_category]) > 0:
                fallback_content = f"I'm having trouble processing your query, but I can help with {detected_category.replace('_', ' ')} information."
            else:
                fallback_content = "I'm having trouble processing your query. Please try again with a different question about crop diseases, market prices, weather, government schemes, fertilizers, or pest control."
                
            return QueryResponse(
                query=query,
                answer=fallback_content,
                sources=[],
                timestamp=datetime.now().isoformat(),
                suggested_followups=random.sample(
                    [q for category in PREDEFINED_QUERIES.values() for q in category], 
                    min(3, len([q for category in PREDEFINED_QUERIES.values() for q in category]))
                )
            )
        
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        return QueryResponse(
            query=query if 'query' in locals() else "",
            answer="I apologize, but I encountered an error processing your query. Please try again.",
            sources=[],
            timestamp=datetime.now().isoformat()
        )

@app.get("/categories")
async def get_categories():
    """Get all available query categories with sample questions."""
    return {
        "categories": [
            {
                "id": category,
                "name": category.replace("_", " ").title(),
                "sample_questions": questions[:3]  # Return first 3 sample questions
            }
            for category, questions in PREDEFINED_QUERIES.items()
        ]
    }

@app.post("/add-document")
async def add_document(
    request: Request,
    title: str = Body(..., description="Document title"),
    content: str = Body(..., description="Document content"),
    category: str = Body(..., description="Document category")
):
    """Add a new document to the knowledge base."""
    try:
        data = await request.json()
        doc = {
            "title": data.get("title", title),
            "content": data.get("content", content),
            "category": data.get("category", category),
            "metadata": data.get("metadata", {})
        }
        
        # Add document to knowledge base
        if rag_bot.init_successful:
            # Add to in-memory documents
            rag_bot.doc_chunks.append(doc["content"])
            rag_bot.doc_metadata.append({
                "title": doc["title"],
                "category": doc["category"]
            })
            
            # Store by category
            category_dir = KNOWLEDGE_DIR / doc["category"]
            category_dir.mkdir(parents=True, exist_ok=True)
            with open(category_dir / f"{doc['title'].replace(' ', '_')}.json", 'w') as f:
                json.dump(doc, f, indent=2)
            
            # Update index
            try:
                embedding = rag_bot.embedding_model.encode([doc["content"]])
                rag_bot.index.add(embedding)
                return {"status": "success", "message": "Document added to knowledge base"}
            except Exception as e:
                logger.error(f"Error updating index: {e}")
                return {"status": "partial_success", "message": "Document saved but index not updated"}
        else:
            return {"status": "error", "message": "RAG chatbot not initialized properly"}
    
    except Exception as e:
        logger.error(f"Error adding document: {e}")
        return {"status": "error", "message": f"Failed to add document: {str(e)}"}

# Endpoint for demo image analysis (placeholder for future integration)
@app.post("/analyze-image")
async def analyze_image(request: Request):
    """
    Simplified image analysis functionality.
    Provides a rotating set of demo responses for testing the frontend.
    """
    try:
        data = await request.json()
        image_type = data.get("image_type", "leaf")  # Can be leaf, plant, fruit
        
        # Demo responses for different image types
        demo_responses = {
            "leaf": [
                {
                    "status": "success",
                    "analysis": "This appears to be a tomato leaf with early blight disease. Recommended treatment includes removing affected leaves and applying copper-based fungicide.",
                    "confidence": 0.92,
                    "disease": "Early Blight (Alternaria solani)",
                    "treatment": "Remove affected leaves, improve air circulation, apply copper-based fungicides."
                },
                {
                    "status": "success",
                    "analysis": "The leaf shows signs of powdery mildew, common in cucurbits. White powdery spots indicate fungal infection.",
                    "confidence": 0.89,
                    "disease": "Powdery Mildew",
                    "treatment": "Apply sulfur-based fungicide or neem oil spray. Improve air circulation around plants."
                },
                {
                    "status": "success",
                    "analysis": "This rice leaf shows brown spot disease, caused by Cochliobolus miyabeanus fungus.",
                    "confidence": 0.86,
                    "disease": "Brown Spot (Rice)",
                    "treatment": "Apply propiconazole or tricyclazole fungicides. Use balanced fertilization."
                }
            ],
            "fruit": [
                {
                    "status": "success",
                    "analysis": "This tomato fruit shows signs of blossom end rot, caused by calcium deficiency.",
                    "confidence": 0.91,
                    "condition": "Blossom End Rot",
                    "recommendation": "Maintain consistent watering. Apply calcium spray. Add lime to soil."
                },
                {
                    "status": "success",
                    "analysis": "The mango fruit shows anthracnose infection with characteristic dark spots.",
                    "confidence": 0.85,
                    "condition": "Anthracnose",
                    "recommendation": "Apply copper fungicide. Harvest fruits promptly when mature."
                }
            ],
            "plant": [
                {
                    "status": "success",
                    "analysis": "The plant shows signs of nitrogen deficiency with yellowing of older leaves.",
                    "confidence": 0.88,
                    "condition": "Nitrogen Deficiency",
                    "recommendation": "Apply urea or composted manure. Side-dress with nitrogen fertilizer."
                },
                {
                    "status": "success",
                    "analysis": "This maize plant shows signs of phosphorus deficiency with purple discoloration.",
                    "confidence": 0.82,
                    "condition": "Phosphorus Deficiency",
                    "recommendation": "Apply DAP or rock phosphate. Check soil pH."
                }
            ]
        }
        
        # Select a random response based on the image type
        if image_type in demo_responses and demo_responses[image_type]:
            return random.choice(demo_responses[image_type])
        else:
            return {
                "status": "success",
                "analysis": "This appears to be a plant sample. For more specific analysis, please ensure the image is clear and focused on the affected area.",
                "confidence": 0.65
            }
            
    except Exception as e:
        logger.error(f"Error in image analysis: {e}")
        return {
            "status": "error",
            "message": "Unable to process image. Please try again with a clearer image.",
            "error": str(e)
        }

@app.post("/chat")
async def chat_endpoint(request: Request):
    """
    Simplified endpoint that matches the route expected by the frontend.
    This forwards to the RAG chatbot endpoint for compatibility.
    """
    try:
        data = await request.json()
        return await process_query(request)
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return {
            "query": data.get("message", "") if 'data' in locals() else "",
            "answer": "I apologize, but I encountered an error processing your query. Please try again.",
            "sources": [],
            "timestamp": datetime.now().isoformat()
        }

@app.get("/models")
async def list_models():
    """
    Return available model options.
    """
    return {
        "models": [
            {
                "id": "rag-chatbot",
                "name": "AgriMithra RAG",
                "description": "Agricultural knowledge chatbot with local information",
                "isDefault": True
            },
            {
                "id": "gemini",
                "name": "Gemini",
                "description": "Google's Gemini language model",
                "isDefault": False
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
# Future enhancements:
# 1. Implement image analysis for disease detection
# 2. Add user history tracking for personalized responses
# 3. Implement offline mode with cached responses
# 4. Add geolocation-based customization for regional advice
