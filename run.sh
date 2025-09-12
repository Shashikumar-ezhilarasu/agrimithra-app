#!/bin/bash

# AgriMithra Setup and Run Script
echo "=== AgriMithra Setup and Run ==="

# Check if Python is installed
if command -v python3 &>/dev/null; then
    PYTHON_CMD=python3
elif command -v python &>/dev/null; then
    PYTHON_CMD=python
else
    echo "Error: Python is not installed. Please install Python 3.9+"
    exit 1
fi

# Function to create knowledge base directory if it doesn't exist
create_knowledge_dir() {
    if [ ! -d "knowledge_base" ]; then
        echo "Creating knowledge base directory..."
        mkdir -p knowledge_base
    fi
}

# Install dependencies
install_deps() {
    echo "Installing Python dependencies..."
    $PYTHON_CMD -m pip install --upgrade pip
    $PYTHON_CMD -m pip install -r requirements.txt

    echo "Installing Node.js dependencies..."
    if command -v pnpm &>/dev/null; then
        pnpm install
    elif command -v npm &>/dev/null; then
        npm install
    else
        echo "Warning: Neither pnpm nor npm found. Skipping Node.js dependencies."
    fi
}

# Start RAG service
start_rag() {
    echo "Starting RAG service..."
    $PYTHON_CMD rag_service.py &
    RAG_PID=$!
    echo "RAG service started with PID: $RAG_PID"
}

# Start frontend
start_frontend() {
    echo "Starting Next.js frontend..."
    if command -v pnpm &>/dev/null; then
        pnpm dev &
    elif command -v npm &>/dev/null; then
        npm run dev &
    else
        echo "Error: Neither pnpm nor npm found. Cannot start frontend."
        return 1
    fi
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
}

# Clean up on exit
cleanup() {
    echo "Shutting down services..."
    if [ ! -z "$RAG_PID" ]; then
        kill $RAG_PID
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID
    fi
}

# Main execution
main() {
    create_knowledge_dir
    
    # Check if installing dependencies is needed
    if [ "$1" == "install" ]; then
        install_deps
    fi
    
    # Start services
    start_rag
    start_frontend
    
    # Set up cleanup on exit
    trap cleanup EXIT
    
    # Keep script running
    echo "AgriMithra is running. Press Ctrl+C to stop."
    while true; do
        sleep 1
    done
}

# Process command line arguments
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "Usage: ./run.sh [install]"
    echo "  install: Install dependencies before starting services"
    exit 0
else
    main $1
fi
