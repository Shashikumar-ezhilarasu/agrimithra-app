from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
from transformers import ViTImageProcessor, ViTForImageClassification
import io
import logging
import base64

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AI MODELS ---
model_name = "wambugu71/crop_leaf_diseases_vit"
logger.info("Loading AI models...")
try:
    processor = ViTImageProcessor.from_pretrained(model_name)
    model = ViTForImageClassification.from_pretrained(model_name)
    logger.info("✅ ML Models loaded successfully!")
    MODELS_AVAILABLE = True
except Exception as e:
    logger.error(f"❌ Error loading models: {e}")
    MODELS_AVAILABLE = False

@app.post("/predict")
async def predict(request: dict):
    if not MODELS_AVAILABLE:
        raise HTTPException(status_code=503, detail="ML Model not available")

    try:
        image_data = request.get("image")
        if not image_data:
            raise HTTPException(status_code=400, detail="No base64 image provided")
        
        # Decode base64 image
        if "," in image_data:
            image_data = image_data.split(",")[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # Preprocess and predict
        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)
        
        predicted_class_idx = outputs.logits.argmax(-1).item()
        predicted_label = model.config.id2label[predicted_class_idx]
        
        # Get confidence score
        probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
        confidence = probabilities[0][predicted_class_idx].item()

        return {
            "label": predicted_label,
            "confidence": confidence,
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
