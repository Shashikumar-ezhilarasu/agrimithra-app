#!/usr/bin/env python3
"""
Server script for running the AgriMithra RAG service.
Sets up appropriate environment variables and runs the FastAPI server.
"""

import os
import logging
import subprocess
import sys
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

def run_server():
    """Set up environment and run the server."""
    try:
        # Set environment variables for TF compatibility
        os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"  # Reduce TensorFlow logging
        
        # Try to import necessary libraries to check availability
        try:
            import fastapi
            logger.info("FastAPI available")
        except ImportError:
            logger.error("FastAPI not available. Installing...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", "fastapi", "uvicorn"])
        
        try:
            import faiss
            logger.info("FAISS available")
        except ImportError:
            logger.error("FAISS not available. Installing...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", "faiss-cpu"])
            
        try:
            from sentence_transformers import SentenceTransformer
            logger.info("SentenceTransformers available")
        except ImportError:
            logger.warning("SentenceTransformers not available. Installing...")
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", "sentence-transformers"])
            except:
                logger.error("Could not install SentenceTransformers. The service will run with limited functionality.")
                
        # Run the server
        from rag_service import app
        import uvicorn
        
        logger.info("Starting AgriMithra RAG service...")
        uvicorn.run(app, host="0.0.0.0", port=8000)
        
    except Exception as e:
        logger.error(f"Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_server()
