import os
import google.generativeai as genai
from google import genai as genai_new
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "superadmin@latelier.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "SuperAdmin@2024")
ADMIN_SECRET = os.getenv("ADMIN_SECRET", "latelier-admin-secret-2024")

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-2.5-flash")
genai_client = genai_new.Client(api_key=GEMINI_API_KEY)

preferences_store: dict = {}
campaigns_store: dict = {}
