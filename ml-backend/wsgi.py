import os

from dotenv import load_dotenv

from app import app

load_dotenv()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
