# backend/app/__init__.py
import logging

# Set up logging for the app
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info("App package initialized")
