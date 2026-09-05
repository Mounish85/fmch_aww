import os
import httpx
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL")

if not BACKEND_URL:
    raise RuntimeError(
        "BACKEND_URL is not configured"
    )

async def get_user_from_backend(user_id: str):
    url = f"{BACKEND_URL}/api/users/{user_id}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    if response.status_code == 404:
        raise ValueError(
            "User not found in backend"
        )

    if response.status_code != 200:
        raise RuntimeError(
            f"Failed to retrieve user data "
            f"from backend: {response.status_code}"
        )

    data = response.json()

    if not data.get("success"):
        raise RuntimeError(
            "Backend returned an unsuccessful user response"
        )

    user = data.get("data")

    if not user:
        raise ValueError(
            "Backend returned empty user data"
        )

    return user

async def get_counselling_from_backend(
    counselling_id: str
):
    url = (
        f"{BACKEND_URL}/api/counselling/"
        f"{counselling_id}"
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    if response.status_code == 404:
        raise ValueError(
            "Counselling record not found in backend"
        )

    if response.status_code != 200:
        raise RuntimeError(
            "Failed to retrieve counselling data "
            f"from backend: {response.status_code}"
        )

    data = response.json()

    if not data.get("success"):
        raise RuntimeError(
            "Backend returned an unsuccessful response"
        )

    counselling = data.get("data")

    if not counselling:
        raise ValueError(
            "Backend returned empty counselling data"
        )

    return counselling