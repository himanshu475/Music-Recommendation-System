from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific origins, e.g., ["http://127.0.0.1:5500"]
    allow_credentials=True,
    allow_methods=["*"],  # Or specify allowed methods, e.g., ["GET", "POST"]
    allow_headers=["*"],  # Or specify allowed headers
)

# Function to get Spotify API access token
def get_spotify_access_token():
    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    }
    data = {
        "grant_type": "client_credentials",
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET,
    }
    response = requests.post(url, headers=headers, data=data)
    return response.json().get("access_token")

# Test route to verify token
@app.get("/test-token")
def test_token():
    access_token = get_spotify_access_token()
    return {"access_token": access_token}

@app.get("/")
def home():
    return "Welcome"

@app.get("/search")
async def search_song(q: str):
    access_token = get_spotify_access_token()
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    search_url = f"https://api.spotify.com/v1/search?q={q}&type=track"
    response = requests.get(search_url, headers=headers)
    data = response.json()

    print(data)

    song_data = []

    for item in data['tracks']['items']:
        album_cover = item['album']['images'][0]['url'] if item['album']['images'] else "https://via.placeholder.com/150"
        spotify_url = item['external_urls']['spotify']
        song_data.append({
            "name": item['name'],
            "artist": ", ".join(artist['name'] for artist in item['artists']),
            "album_cover": album_cover, 
            "spotify_url": spotify_url 
            
           

        })
        


    return {"songs": song_data}
