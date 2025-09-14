import gradio as gr
from PIL import Image
import torch
from transformers import ViTImageProcessor, ViTForImageClassification
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import logging

# --- CONFIGURATION ---
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# --- KNOWLEDGE BASE (ULTIMATE SOUTH INDIA AGRICULTURAL GUIDE) ---
# This structured database contains comprehensive farming information for Kerala & South India.
DOCUMENTS = [
    # === Rice (Paddy) / നെല്ല് ===
    {
        "title": "Rice (Paddy)",
        "category": "crop_guide",
        "content": {
            "summary": "Rice is the primary staple food crop in South India. Proper management of nutrients, water, and pests is crucial for a high yield.",
            "varieties": "Popular Kerala varieties include Uma, Jyothi, Kanchana, and high-yield hybrids.",
            "fertilizer_management": {
                "organic": "Basal dose: Apply farmyard manure (FYM) or compost at 5 tonnes/ha before the last ploughing. Green leaf manure at 5 tonnes/ha is also recommended.",
                "chemical": "Recommended NPK dosage is 90:45:45 kg/ha. For hybrids, it may be 120:60:60 kg/ha.",
                "schedule": "Apply the full dose of Phosphorus (P) and Potassium (K) as a basal dressing. Apply Nitrogen (N) in three split doses: 50% as basal, 25% at the active tillering stage, and 25% at the panicle initiation stage."
            },
            "pest_management": [
                {"pest": "Brown Planthopper (ചാഴി)", "solution": "Maintain a 2-5 cm water level. Avoid excessive nitrogen. Use pest-resistant varieties. For severe attacks, spray insecticides like imidacloprid."},
                {"pest": "Stem Borer (തണ്ടുതുരപ്പൻ പുഴു)", "solution": "Use pheromone traps to monitor moth activity. Apply cartap hydrochloride or fipronil granules 20-25 days after transplanting."}
            ],
            "disease_management": [
                {"disease": "Rice Blast (പോളരോഗം)", "solution": "Use resistant varieties. Apply fungicides containing tricyclazole. Avoid excessive nitrogen fertilizer."},
                {"disease": "Bacterial Blight (ഇലകരിച്ചിൽ)", "solution": "Ensure proper drainage. Spray copper-based bactericides like copper oxychloride during the early stages of infection."}
            ]
        }
    },

    # === Coconut / തെങ്ങ് ===
    {
        "title": "Coconut",
        "category": "crop_guide",
        "content": {
            "summary": "Coconut is the 'kalpavriksha' (tree of heaven) and a vital commercial crop. It requires balanced nutrition for continuous bearing.",
            "varieties": "West Coast Tall (WCT), Dwarf varieties (Chowghat Orange Dwarf), and hybrids like Kerasankara (WCT x COD).",
            "fertilizer_management": {
                "organic": "Apply 25-50 kg of FYM or compost per palm per year in a basin around the trunk.",
                "chemical": "Recommended NPK dosage for a mature palm is 500:300:1200 grams/palm/year. Also apply Magnesium Sulphate at 500 grams/palm/year.",
                "schedule": "Apply fertilizers in two split doses: one-third at the beginning of the Southwest monsoon (May-June) and two-thirds at the end of the monsoon (Sept-Oct)."
            },
            "pest_management": [
                {"pest": "Rhinoceros Beetle (കൊമ്പൻചെല്ലി)", "solution": "Fill the top 2-3 leaf axils with a mix of sand and neem cake. Use pheromone traps to capture adult beetles."},
                {"pest": "Red Palm Weevil (ചെമ്പൻചെല്ലി)", "solution": "Avoid creating wounds on the palm trunk. If detected, inject the trunk with spinosad or imidacloprid. Use pheromone traps for monitoring and mass trapping."}
            ],
            "disease_management": [
                {"disease": "Bud Rot (മണ്ടചീയൽ)", "solution": "Fatal fungal disease. Remove and burn the infected palm. Apply Bordeaux mixture paste to the crowns of surrounding palms as a preventive measure."},
                {"disease": "Root Wilt (വേരുചീയൽ)", "solution": "Complex disease with no cure. Manage by improving soil health with organic manures and balanced nutrition to help the palm cope."}
            ]
        }
    },

    # === Banana & Plantain / വാഴ ===
    {
        "title": "Banana (Plantain)",
        "category": "crop_guide",
        "content": {
            "summary": "Banana is a key fruit crop, with varieties like Nendran being a staple. It is a heavy feeder and requires significant nutrients and water.",
            "varieties": "Nendran (Plantain), Robusta, Palayankodan, Rasakadali.",
            "fertilizer_management": {
                "organic": "Apply 10-15 kg of FYM or compost per plant at the time of planting.",
                "chemical": "Recommended NPK dosage is 190:115:300 grams/plant. Potash (K) is crucial for bunch development.",
                "schedule": "Apply N and K in 4-5 split doses at 2, 3, 4, 5, and 6 months after planting. Full P is applied as a basal dose."
            },
            "pest_management": [
                {"pest": "Rhizome Weevil (പിണ്ടിപ്പുഴു)", "solution": "Use healthy, weevil-free suckers for planting. Apply neem cake at the base of the plant."},
                {"pest": "Aphids (ഇലപ്പേൻ)", "solution": "Aphids transmit the Bunchy Top Virus. Spray a systemic insecticide like dimethoate on the leaves, especially the crown."}
            ],
            "disease_management": [
                {"disease": "Sigatoka Leaf Spot (ഇലപ്പുള്ളി രോഗം)", "solution": "Fungal disease causing yellow streaks on leaves. Remove and destroy infected leaves. Spray fungicides like propiconazole or mancozeb."},
                {"disease": "Bunchy Top Virus", "solution": "No cure. Infected plants must be uprooted and destroyed immediately to prevent spread. Control the aphid vector."}
            ]
        }
    }
]


# --- AI MODELS (Vision + RAG) ---
try:
    logger.info("Loading AI models... This may take several minutes on the first run.")
    model_name = "wambugu71/crop_leaf_diseases_vit"
    detector_processor = ViTImageProcessor.from_pretrained(model_name)
    detector_model = ViTForImageClassification.from_pretrained(model_name)
    
    documents_dict = {doc['title'].lower(): doc for doc in DOCUMENTS}
    all_titles = [doc['title'] for doc in DOCUMENTS]
    embedding_model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
    embeddings = embedding_model.encode(all_titles, convert_to_numpy=True)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)
    
    logger.info("✅ AI Models loaded successfully!")
    MODELS_LOADED = True
except Exception as e:
    logger.error(f"❌ Error loading AI models: {e}")
    MODELS_LOADED = False

# --- FORMATTING FUNCTION ---
def format_guide(doc):
    """Takes a structured document and formats it into beautiful Markdown."""
    content = doc['content']
    output = f"## Comprehensive Guide: {doc['title']}\n\n"
    output += f"**Summary:** {content.get('summary', 'N/A')}\n\n"
    output += f"**Popular Varieties:** {content.get('varieties', 'N/A')}\n\n"
    
    if 'fertilizer_management' in content:
        fm = content['fertilizer_management']
        output += "###  Fertilizer Management (വളപ്രയോഗം)\n"
        output += f"- **Organic:** {fm.get('organic', 'N/A')}\n"
        output += f"- **Chemical (NPK):** {fm.get('chemical', 'N/A')}\n"
        output += f"- **Application Schedule:** {fm.get('schedule', 'N/A')}\n\n"

    if 'pest_management' in content:
        output += "### Pest Management (കീടനിയന്ത്രണം)\n"
        for item in content['pest_management']:
            output += f"- **{item['pest']}:** {item['solution']}\n"
        output += "\n"

    if 'disease_management' in content:
        output += "### Disease Management (രോഗനിയന്ത്രണം)\n"
        for item in content['disease_management']:
            output += f"- **{item['disease']}:** {item['solution']}\n"
        output += "\n"
        
    return output

# --- CORE ANALYSIS FUNCTION (MORE ROBUST) ---
def analyze_plant_health(image_to_analyze):
    if not MODELS_LOADED:
        return "Error: AI models could not be loaded. Please check the terminal for errors."

    try:
        # Stage 1: Analyze the image
        image = Image.fromarray(image_to_analyze).convert("RGB")
        inputs = detector_processor(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = detector_model(**inputs)
        predicted_class_idx = outputs.logits.argmax(-1).item()
        predicted_label = detector_model.config.id2label[predicted_class_idx]
        
        logger.info(f"Model prediction: '{predicted_label}'")

        # Stage 2: Extract the plant name more safely
        plant_name_parts = predicted_label.replace("_", " ").split("___")
        plant_name = plant_name_parts[0].strip()

        logger.info(f"Parsed plant name for search: '{plant_name}'")

        # Stage 3: Use RAG to find the comprehensive guide
        query_emb = embedding_model.encode([plant_name], convert_to_numpy=True)
        distances, indices = index.search(query_emb, 1)
        best_match_doc = DOCUMENTS[indices[0][0]]

        # Stage 4: Format and return the full guide
        return format_guide(best_match_doc)
    
    except Exception as e:
        logger.error(f"An error occurred during analysis: {e}", exc_info=True)
        return f"Sorry, an error occurred while analyzing the image. Please try a different image.\n\n**Technical Error:** {e}"

# --- CREATE AND LAUNCH THE WEB APP ---
demo = gr.Interface(
    fn=analyze_plant_health,
    inputs=gr.Image(type="numpy", label="Upload any Leaf Image (ഏതെങ്കിലും ഇലയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക)"),
    outputs=gr.Markdown(label="Comprehensive Agricultural Guide (വിശദമായ കാർഷിക ഗൈഡ്)"),
    title="🌱 AgriMithra - Your South Indian Farming Expert",
    description="Upload an image of a leaf. AgriMithra will identify the plant and provide a complete guide on fertilizers, pests, and diseases for it.",
    allow_flagging="never"
)

if __name__ == "__main__":
    demo.launch(share=True)
