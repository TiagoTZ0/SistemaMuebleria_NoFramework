import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    try:
        conn = psycopg2.connect(
            host=os.environ.get("SUPABASE_HOST"),
            database="postgres",
            user=os.environ.get("SUPABASE_USER"),
            password=os.environ.get("SUPABASE_PASSWORD"),
            port=os.environ.get("SUPABASE_PORT") 
        )
        return conn
    except Exception as e:
        print(f"Error conectando a la BD: {e}")
        return None