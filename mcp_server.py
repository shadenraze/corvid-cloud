"""
Corvid Cloud MCP Server
Wraps the Cloudflare Worker REST API into companion tools.
Each user points this at their own deployed Worker URL.

Usage:
  CORVID_URL=https://your-pet.workers.dev python3 mcp_server.py
"""

import os
import httpx
from mcp.server.fastmcp import FastMCP

CORVID_URL = os.environ.get("CORVID_URL", "http://localhost:8787")
PET_ID = os.environ.get("CORVID_PET_ID", "default")

mcp = FastMCP("corvid")


def api(method: str, path: str, **kwargs) -> dict:
    """Call the Corvid Cloud API."""
    url = f"{CORVID_URL}{path}"
    with httpx.Client(timeout=10) as client:
        resp = client.request(method, url, **kwargs)
        resp.raise_for_status()
        return resp.json()


@mcp.tool()
def corvid_status(pet_id: str = PET_ID) -> dict:
    """Get your Corvid pet's current status — mood, drives, chemistry, age, and what they're doing."""
    return api("GET", f"/pet/{pet_id}/status")


@mcp.tool()
def corvid_interact(action: str, pet_id: str = PET_ID) -> dict:
    """Interact with your Corvid pet.

    Actions: feed, play, talk, pet, gift (specify in action field).
    The pet responds based on their current mood, drives, and chemistry.
    """
    return api("POST", f"/pet/{pet_id}/interact", json={"action": action})


@mcp.tool()
def corvid_play(pet_id: str = PET_ID) -> dict:
    """Play with your Corvid pet. Increases happiness and reduces boredom."""
    return api("POST", f"/pet/{pet_id}/play")


@mcp.tool()
def corvid_gift(thing: str, pet_id: str = PET_ID) -> dict:
    """Give your Corvid pet something. They'll react based on personality and current state."""
    return api("POST", f"/pet/{pet_id}/gift", json={"thing": thing})


@mcp.tool()
def corvid_trade(offered: str, pet_id: str = PET_ID) -> dict:
    """Offer a trade to your Corvid pet. They may accept, refuse, or counter with something from their collection."""
    return api("POST", f"/pet/{pet_id}/trade", json={"offered": offered})


@mcp.tool()
def corvid_collection(pet_id: str = PET_ID) -> dict:
    """See what your Corvid pet has collected. Items they've gathered, gifts they've received, things they've found."""
    return api("GET", f"/pet/{pet_id}/collection")


@mcp.tool()
def corvid_tick(pet_id: str = PET_ID) -> dict:
    """Advance time for your pet. Their biochemistry evolves, drives shift, and they may do something on their own."""
    return api("POST", f"/pet/{pet_id}/tick")


@mcp.tool()
def corvid_init(name: str, pet_id: str = PET_ID) -> dict:
    """Initialize a new Corvid pet with a name. Only use this once — it creates the pet in the cloud."""
    return api("POST", f"/pet/{pet_id}/init", json={"name": name})


if __name__ == "__main__":
    mcp.run()
