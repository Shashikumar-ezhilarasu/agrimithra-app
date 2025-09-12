"""
AgriMithra Simple RAG Backend Service
FastAPI microservice with a simplified RAG implementation that doesn't rely on external ML libraries.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import json
import os
import logging
import random
from datetime import datetime
from pathlib import Path

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
    
    # Market Prices
    {"title": "Onion Prices Kochi", "category": "market_prices", "content": "As of September 12, 2025, onion prices in Kochi mandi are: Retail ₹45-50/kg, Wholesale ₹35-40/kg. Prices increased by 8% from last week due to reduced arrivals from Maharashtra. Projected trend: likely to remain stable for 7-10 days. Best markets for selling: Ernakulam APMC, Aluva market."},
    {"title": "Paddy Price Comparison", "category": "market_prices", "content": "Current paddy prices (September 2025): Palakkad mandi ₹20-22/kg, Thrissur mandi ₹21-23/kg. Thrissur offers better rates due to local mill demand. Transportation cost Palakkad to Thrissur: approximately ₹0.50/kg. Government procurement through Supplyco offers ₹23.30/kg but requires registration and quality standards compliance."},
    {"title": "Potato Price Trends", "category": "market_prices", "content": "Monthly potato price trends (per kg): July ₹22-25, August ₹25-28, September ₹28-32. Shows 15% increase over two months. Factors: reduced production in northern states and increased transportation costs. Projection: prices likely to increase another 5-8% by October before new harvest arrives."},
    
    # Weather Forecast
    {"title": "Village Rain Forecast", "category": "weather", "content": "Rain forecast for Kerala villages (September 13-20, 2025): Northern districts - moderate to heavy rainfall (15-20cm cumulative), Central districts - light to moderate rainfall (5-10cm), Southern districts - isolated showers (2-5cm). Daily updates available via KisanSMS service or Krishi Bhavan weather bulletins."},
    {"title": "Seven Day Forecast", "category": "weather", "content": "7-day forecast for Kerala (September 13-19, 2025): Temperature range 24-32°C, Humidity 75-85%, Wind speed 5-15 km/h from southwest direction. Rainfall expected on 14th, 16th and 18th. No extreme weather alerts. Good conditions for transplanting operations on dry days."},
    
    # Government Schemes
    {"title": "Drip Irrigation Subsidies", "category": "govt_schemes", "content": "Current subsidy schemes for drip irrigation (2025-26): Under PMKSY, small/marginal farmers receive 55% subsidy, others 45%. Maximum coverage 5 hectares per farmer. Kerala state adds 35% additional subsidy. Apply through Krishi Bhavan with land documents, bank details, and Aadhaar. Subsidy credited directly to bank account after installation verification."},
    {"title": "PMFBY Insurance Application", "category": "govt_schemes", "content": "To apply for PMFBY crop insurance in your district: 1) Visit local bank or Common Service Center, 2) Submit application form with land records, sowing certificate, and ID proof, 3) Pay premium (only 1.5-2% of sum insured), 4) Online tracking available at pmfby.gov.in using application number. Deadline for Kharif 2025: July 31, for Rabi: December 15."},
    
    # Fertilizer Recommendations
    {"title": "Paddy Fertilizer Dosage", "category": "fertilizers", "content": "Recommended fertilizer per acre for paddy: Basal application - DAP 40kg, MOP 20kg. First top dressing (30 days after planting) - Urea 35kg. Second top dressing (60 days) - Urea 35kg, MOP 10kg. Apply when field has thin layer of water. For zinc deficiency, add zinc sulfate 10kg/acre during land preparation."},
    {"title": "Soil Test Fertilizer Guide", "category": "fertilizers", "content": "For soil test showing low nitrogen: Apply 50% more than standard recommendation. For paddy, increase urea by 50kg/acre split in two applications. Combine with organic sources like FYM (2 tonnes/acre) or vermicompost (1 tonne/acre). Green manuring with dhaincha or sunhemp before planting improves soil nitrogen significantly."},
    
    # Pest Control
    {"title": "Cotton Aphid Treatment", "category": "pest_control", "content": "For aphid infestation on cotton: Early stage - spray neem oil 5ml/liter with 1ml soap as sticker. Moderate infestation - apply imidacloprid 17.8% SL @ 0.25ml/liter or thiamethoxam 25% WG @ 0.2g/liter. Severe cases - flonicamid 50% WG @ 0.3g/liter. Spray during evening hours for better efficacy. Repeat after 10-15 days if needed."},
    {"title": "Homemade Neem Spray", "category": "pest_control", "content": "Neem spray recipe: Soak 5kg neem seeds overnight in water. Grind into paste next morning. Mix paste in 100 liters water with 100-200ml soap solution as sticker. Alternatively, mix 40-50ml commercial neem oil with 10-20ml liquid soap in 1 liter water, then dilute to 10 liters. Spray uniformly on both sides of leaves during early morning or late evening."}
]

class SimpleRAGChatbot:
    """Simple RAG chatbot that doesn't require ML libraries"""
    
    def __init__(self):
        """Initialize the chatbot with documents"""
        self.documents = DOCUMENTS
        logger.info(f"Initialized Simple RAG chatbot with {len(self.documents)} documents")

    def search(self, query: str, top_k: int = 5) -> List[Dict]:
        """Simple keyword-based search"""
        query = query.lower()
        results = []
        
        # Simple scoring based on keyword matching
        for doc in self.documents:
            score = 0
            content = doc["content"].lower()
            title = doc["title"].lower()
            
            # Check query words in content
            for word in query.split():
                if len(word) > 3:  # Only consider words with more than 3 characters
                    if word in content:
                        score += 1
                    if word in title:
                        score += 2  # Title matches are weighted higher
            
            if score > 0:
                results.append({
                    "content": doc["content"],
                    "metadata": {
                        "title": doc["title"],
                        "category": doc["category"]
                    },
                    "score": score
                })
        
        # Sort by score and return top_k
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def generate_answer(self, query: str, retrieved_docs: List[Dict], language: str = "en") -> str:
        """Generate answer from retrieved documents"""
        if not retrieved_docs:
            return "I don't have enough information to answer this query. Please try asking something else."
                
        # Get the category from retrieved docs
        categories = [doc["metadata"].get("category", "general") for doc in retrieved_docs]
        main_category = max(set(categories), key=categories.count) if categories else "general"
        
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
        
        # Use the first (most relevant) document as the main content
        if retrieved_docs:
            main_doc = retrieved_docs[0]
            answer = f"{intro}{main_doc['content']}"
            
            # Add information from other docs
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

    def chat(self, query: str, language: str = "en", top_k: int = 5) -> Dict:
        """Process a chat query and return a response"""
        # Get category of query
        category = self._categorize_query(query)
        
        # Search for relevant documents
        retrieved_docs = self.search(query, top_k=top_k)
        
        # Generate answer
        answer = self.generate_answer(query, retrieved_docs, language)
        
        # Prepare response
        response = {
            "query": query,
            "answer": answer,
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
        
        if category in category_questions:
            response["suggested_followups"] = random.sample(category_questions[category], 2)
        
        return response
    
    def _categorize_query(self, query: str) -> str:
        """Categorize the query based on keywords"""
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

# Predefined queries for UI buttons
PREDEFINED_QUERIES = {
    "crop_disease": [
        "My tomato leaves have yellow spots — what is this?",
        "Brown circular lesions on rice leaves — disease name?",
        "How to treat powdery mildew on grapes?",
        "How to identify early blight vs late blight on potato?"
    ],
    "market_prices": [
        "What is today's mandi price for onion in Kochi?",
        "Compare price of paddy in Palakkad vs Thrissur",
        "How have prices changed this month for potatoes?"
    ],
    "weather": [
        "Is there rain expected in my village tomorrow?",
        "What is the 7-day forecast for my GPS location?"
    ],
    "govt_schemes": [
        "What are the current subsidy schemes for drip irrigation?",
        "How to apply for PMFBY crop insurance in my district?"
    ],
    "fertilizers": [
        "How much urea and DAP per acre for paddy?",
        "Soil test says N low — what fertilizer & dose?"
    ],
    "pest_control": [
        "Aphid infestation on cotton — treatment now?",
        "How to make neem-based spray recipe?"
    ]
}

# Initialize FastAPI app
app = FastAPI(
    title="AgriMithra Simple RAG Service",
    description="Simple Retrieval-Augmented Generation chatbot for agricultural queries",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Initialize RAG chatbot
logger.info("Initializing Simple RAG chatbot...")
rag_bot = SimpleRAGChatbot()
logger.info("Simple RAG chatbot initialized successfully")

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "service": "AgriMithra Simple RAG Service",
        "version": "1.0.0",
        "documentation": "/docs"
    }

@app.post("/rag-chatbot")
async def process_query(request: Request):
    """Process a query using the Simple RAG chatbot"""
    try:
        data = await request.json()
        query = data.get("query", "")
        language = data.get("language", "en")
        
        logger.info(f"Received query: '{query}' (language: {language})")
        
        if not query:
            return {
                "query": "",
                "answer": "Please provide a query.",
                "sources": [],
                "timestamp": datetime.now().isoformat()
            }
        
        # Generate response using Simple RAG chatbot
        response = rag_bot.chat(query, language)
        return response
        
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        return {
            "query": query if 'query' in locals() else "",
            "answer": "I apologize, but I encountered an error processing your query. Please try again.",
            "sources": [],
            "timestamp": datetime.now().isoformat()
        }

@app.post("/chat")
async def chat_endpoint(request: Request):
    """Chat endpoint that matches the route expected by the frontend"""
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

@app.get("/categories")
async def get_categories():
    """Get all available query categories with sample questions"""
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

@app.get("/models")
async def list_models():
    """Return available model options"""
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

@app.post("/analyze-image")
async def analyze_image(request: Request):
    """Simplified image analysis endpoint"""
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
                }
            ],
            "fruit": [
                {
                    "status": "success",
                    "analysis": "This tomato fruit shows signs of blossom end rot, caused by calcium deficiency.",
                    "confidence": 0.91,
                    "condition": "Blossom End Rot",
                    "recommendation": "Maintain consistent watering. Apply calcium spray. Add lime to soil."
                }
            ],
            "plant": [
                {
                    "status": "success",
                    "analysis": "The plant shows signs of nitrogen deficiency with yellowing of older leaves.",
                    "confidence": 0.88,
                    "condition": "Nitrogen Deficiency",
                    "recommendation": "Apply urea or composted manure. Side-dress with nitrogen fertilizer."
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
