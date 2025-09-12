#!/usr/bin/env python3
"""
Simple server script for running the AgriMithra Simple RAG service.
This version doesn't require any ML libraries and should run on any Python 3 installation.
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
        # Try to import necessary libraries to check availability
        try:
            import fastapi
            logger.info("FastAPI available")
        except ImportError:
            logger.error("FastAPI not available. Installing...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", "fastapi", "uvicorn"])
            
        # Run the server
        logger.info("Starting AgriMithra Simple RAG service...")
        from simple_rag_service import app
        import uvicorn
        
        uvicorn.run(app, host="0.0.0.0", port=8000)
        
    except Exception as e:
        logger.error(f"Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_server()
