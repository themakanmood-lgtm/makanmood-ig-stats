"""
export_json.py
─────────────────────────────────────────────────────────────────────────────
Lit le Google Sheet "Makan Mood — Dashboard IG" et produit docs/data.json
consommable par le Cockpit Makan Mood (Analyste IG).

À exécuter après le script de collecte. Utilise le même service account.

Dépendances : gspread, google-auth (déjà installées si la collecte tourne)
"""

import json
import os
from datetime import datetime, timezone
from pathlib import Path

import gspread
from google.oauth2.service_account import Credentials

# ─── CONFIG ─────────────────────────────────────────────────────────────────
SHEET_ID = "1rscVUw8ZNP1bpsUUQdn1XdM-QSp2Ku1zTNFV_t3p0yM"
OUTPUT_PATH = Path("docs/data.json")
SERVICE_ACCOUNT_FILE = os.environ.get(
    "GOOGLE_APPLICATION_CREDENTIALS", "service-account.json"
)
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]


# ─── HELPERS ────────────────────────────────────────────────────────────────
def safe_int(v, default=0):
    """Convertit en int, gère 'None', '', None."""
    if v is None or v == "" or str(v).strip().lower() == "none":
        return default
    try:
        return int(float(str(v).replace(",", "")))
    except (ValueError, TypeError):
        return default


def safe_str(v, default=""):
    if v is None:
        return default
    return str(v).strip()


def parse_ts(ts):
    """Parse '2026-05-29 11:58' ou ISO 8601."""
    if not ts:
        return None
    s = str(ts).strip()
    for fmt in ("%Y-%m-%d %H:%M", "%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S%z"):
        try:
            return datetime.strptime(s, fmt)
        except ValueError:
            continue
    # Try ISO with timezone variations
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except ValueError:
        return None


# ─── LOAD SHEET ─────────────────────────────────────────────────────────────
def load_sheet():
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    client = gspread.authorize(creds)
    return client.open_by_key(SHEET_ID)


# ─── BUILD SECTIONS ─────────────────────────────────────────────────────────
def build_account_section(sheet):
    """Compte_Daily → derniers snapshots + série journalière."""
    ws = sheet.worksheet("Compte_Daily")
    rows = ws.get_all_records()
    if not rows:
        return {"current": None, "history": []}

    # Sort by timestamp
    rows.sort(key=lambda r: safe_str(r.get("collected_at", "")))

    current = rows[-1]
    previous_week = None
    # Find the row from ~7 days ago for delta
    current_ts = parse_ts(current.get("collected_at"))
    if current_ts:
        for r in reversed(rows):
            r_ts = parse_ts(r.get("collected_at"))
            if r_ts and (current_ts - r_ts).total_seconds() >= 6 * 86400:
                previous_week = r
                break

    # Daily series: one point per day (last snapshot of each day)
    by_day = {}
    for r in rows:
        ts = parse_ts(r.get("collected_at"))
        if not ts:
            continue
        day = ts.strftime("%Y-%m-%d")
        by_day[day] = {
            "date": day,
            "followers": safe_int(r.get("followers_count")),
            "follows": safe_int(r.get("follows_count")),
            "media": safe_int(r.get("media_count")),
        }
    history = sorted(by_day.values(), key=lambda x: x["date"])

    return {
        "username": safe_str(current.get("username")),
        "name": safe_str(current.get("name")),
        "biography": safe_str(current.get("biography")),
        "website": safe_str(current.get("website")),
        "followers": safe_int(current.get("followers_count")),
        "follows": safe_int(current.get("follows_count")),
        "media": safe_int(current.get("media_count")),
        "followers_delta_week": (
            safe_int(current.get("followers_count"))
            - safe_int(previous_week.get("followers_count"))
            if previous_week
            else None
        ),
        "follows_delta_week": (
            safe_int(current.get("follows_count"))
            - safe_int(previous_week.get("follows_count"))
            if previous_week
            else None
        ),
        "media_delta_week": (
            safe_int(current.get("media_count"))
            - safe_int(previous_week.get("media_count"))
            if previous_week
            else None
        ),
        "history": history,
        "snapshots_count": len(rows),
    }


def build_posts_section(sheet):
    """Posts → dernière version de chaque post + classement."""
    ws = sheet.worksheet("Posts")
    rows = ws.get_all_records()
    if not rows:
        return {"posts": [], "totals": {}}

    # Group by media_id, keep latest snapshot
    latest_by_id = {}
    for r in rows:
        mid = safe_str(r.get("media_id"))
        if not mid:
            continue
        collected = safe_str(r.get("collected_at"))
        if mid not in latest_by_id or collected > latest_by_id[mid]["_collected"]:
            latest_by_id[mid] = {**r, "_collected": collected}

    posts = []
    for r in latest_by_id.values():
        hashtags_raw = safe_str(r.get("hashtags"))
        hashtags_list = [h.strip() for h in hashtags_raw.split() if h.strip().startswith("#")]

        posts.append(
            {
                "media_id": safe_str(r.get("media_id")),
                "type": safe_str(r.get("type")),
                "published_at": safe_str(r.get("timestamp")),
                "caption": safe_str(r.get("caption_full")),
                "permalink": safe_str(r.get("permalink")),
                "hashtags": hashtags_list,
                "hashtag_count": safe_int(r.get("hashtag_count")),
                "mention_count": safe_int(r.get("mention_count")),
                "reach": safe_int(r.get("reach")),
                "views": safe_int(r.get("views")),
                "likes": safe_int(r.get("likes")),
                "comments": safe_int(r.get("comments")),
                "saved": safe_int(r.get("saved")),
                "shares": safe_int(r.get("shares")),
                "total_interactions": safe_int(r.get("total_interactions")),
            }
        )

    # Sort by published_at desc
    posts.sort(key=lambda p: p["published_at"], reverse=True)

    # Aggregates
    totals = {
        "count": len(posts),
        "reach_total": sum(p["reach"] for p in posts),
        "views_total": sum(p["views"] for p in posts),
        "likes_total": sum(p["likes"] for p in posts),
        "comments_total": sum(p["comments"] for p in posts),
        "saves_total": sum(p["saved"] for p in posts),
        "shares_total": sum(p["shares"] for p in posts),
    }

    # Top posts by views
    top_by_views = sorted(posts, key=lambda p: p["views"], reverse=True)[:5]
    top_by_engagement = sorted(
        posts,
        key=lambda p: (p["likes"] + p["saved"] * 3 + p["shares"] * 2 + p["comments"] * 5),
        reverse=True,
    )[:5]

    return {
        "posts": posts,
        "totals": totals,
        "top_by_views": [p["media_id"] for p in top_by_views],
        "top_by_engagement": [p["media_id"] for p in top_by_engagement],
    }


def build_hashtags_section(sheet):
    """Hashtags → dernière performance par tag."""
    try:
        ws = sheet.worksheet("Hashtags")
    except gspread.WorksheetNotFound:
        return {"hashtags": []}

    rows = ws.get_all_records()
    if not rows:
        return {"hashtags": []}

    # Keep latest per hashtag
    latest = {}
    for r in rows:
        tag = safe_str(r.get("hashtag"))
        if not tag:
            continue
        collected = safe_str(r.get("collected_at"))
        if tag not in latest or collected > latest[tag]["_collected"]:
            latest[tag] = {**r, "_collected": collected}

    hashtags = []
    for r in latest.values():
        hashtags.append(
            {
                "hashtag": safe_str(r.get("hashtag")),
                "uses": safe_int(r.get("uses")),
                "avg_reach": safe_int(r.get("avg_reach")),
                "avg_views": safe_int(r.get("avg_views")),
                "avg_likes": safe_int(r.get("avg_likes")),
            }
        )

    hashtags.sort(key=lambda h: h["avg_views"], reverse=True)
    return {"hashtags": hashtags}


def build_stories_section(sheet):
    """Stories → dernier snapshot par story."""
    try:
        ws = sheet.worksheet("Stories")
    except gspread.WorksheetNotFound:
        return {"stories": [], "totals": {}}

    rows = ws.get_all_records()
    if not rows:
        return {"stories": [], "totals": {}}

    latest = {}
    for r in rows:
        sid = safe_str(r.get("story_id"))
        if not sid:
            continue
        collected = safe_str(r.get("collected_at"))
        if sid not in latest or collected > latest[sid]["_collected"]:
            latest[sid] = {**r, "_collected": collected}

    stories = []
    for r in latest.values():
        stories.append(
            {
                "story_id": safe_str(r.get("story_id")),
                "type": safe_str(r.get("type")),
                "published_at": safe_str(r.get("timestamp")),
                "permalink": safe_str(r.get("permalink")),
                "reach": safe_int(r.get("reach")),
                "views": safe_int(r.get("views")),
                "replies": safe_int(r.get("replies")),
                "total_interactions": safe_int(r.get("total_interactions")),
            }
        )

    stories.sort(key=lambda s: s["published_at"], reverse=True)

    totals = {
        "count": len(stories),
        "reach_total": sum(s["reach"] for s in stories),
        "views_total": sum(s["views"] for s in stories),
        "replies_total": sum(s["replies"] for s in stories),
    }

    return {"stories": stories, "totals": totals}


# ─── MAIN ───────────────────────────────────────────────────────────────────
def main():
    print("→ Connexion au Sheet…")
    sheet = load_sheet()

    print("→ Compte_Daily…")
    account = build_account_section(sheet)
    print(f"   {account['snapshots_count']} snapshots · {account['followers']} followers")

    print("→ Posts…")
    posts = build_posts_section(sheet)
    print(f"   {posts['totals']['count']} posts uniques")

    print("→ Hashtags…")
    hashtags = build_hashtags_section(sheet)
    print(f"   {len(hashtags['hashtags'])} hashtags")

    print("→ Stories…")
    stories = build_stories_section(sheet)
    print(f"   {stories['totals'].get('count', 0)} stories")

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "schema_version": 1,
        "brand": "Makan Mood",
        "account": account,
        "posts_section": posts,
        "hashtags_section": hashtags,
        "stories_section": stories,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    size_kb = OUTPUT_PATH.stat().st_size / 1024
    print(f"✓ Écrit {OUTPUT_PATH} · {size_kb:.1f} Ko")


if __name__ == "__main__":
    main()
