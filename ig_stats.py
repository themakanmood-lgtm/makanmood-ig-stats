"""
Makan Mood - Instagram Stats Collector - Phase 1 (Version enrichie)
Collecte 5 blocs de donnees via API Meta officielle et ecrit dans Google Sheets.

Onglets crees automatiquement :
- Compte_Daily    : snapshot quotidien du compte
- Posts           : tous les posts/reels avec metriques
- Audience        : demographie audience
- Stories         : stories actives
- Hashtags        : analyse hashtags
"""

import os
import re
import requests
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv
import gspread
from google.oauth2.service_account import Credentials

# ===== CONFIGURATION =====
load_dotenv()
TOKEN = os.getenv("META_ACCESS_TOKEN")
IG_ID = os.getenv("IG_BUSINESS_ACCOUNT_ID")
SHEET_ID = os.getenv("GOOGLE_SHEET_ID")
CREDS_PATH = os.getenv("GOOGLE_CREDENTIALS_PATH")
API_VERSION = "v22.0"
BASE_URL = "https://graph.facebook.com/" + API_VERSION

if not all([TOKEN, IG_ID, SHEET_ID, CREDS_PATH]):
    raise SystemExit("ERREUR : .env incomplet. Verifie les 4 variables.")


# ===== HELPERS API META =====
def api_get(path, params=None):
    params = params or {}
    params["access_token"] = TOKEN
    url = BASE_URL + "/" + path
    try:
        r = requests.get(url, params=params, timeout=20)
        if r.status_code != 200:
            print("[!] Erreur sur " + path + " : " + str(r.status_code) + " - " + r.text[:150])
            return None
        return r.json()
    except Exception as e:
        print("[!] Exception sur " + path + " : " + str(e))
        return None


# ===== BLOC 1 : COMPTE =====
def collect_account():
    print("\n[1/5] Collecte donnees compte...")
    data = api_get(IG_ID, {
        "fields": "id,username,name,followers_count,follows_count,media_count,biography,website"
    })
    if not data:
        return []
    today = datetime.now().strftime("%Y-%m-%d %H:%M")
    return [{
        "collected_at": today,
        "username": data.get("username"),
        "name": data.get("name"),
        "followers_count": data.get("followers_count"),
        "follows_count": data.get("follows_count"),
        "media_count": data.get("media_count"),
        "biography": data.get("biography", ""),
        "website": data.get("website", "")
    }]


# ===== BLOC 2 : POSTS =====
def collect_posts(limit=30):
    print("\n[2/5] Collecte donnees posts...")
    data = api_get(IG_ID + "/media", {
        "fields": "id,caption,media_type,media_product_type,timestamp,permalink",
        "limit": limit
    })
    if not data or "data" not in data:
        return []

    posts = []
    today = datetime.now().strftime("%Y-%m-%d %H:%M")
    for m in data["data"]:
        media_type = m["media_type"]
        if media_type == "VIDEO":
            metrics = "reach,views,likes,comments,saved,shares,total_interactions"
        else:
            metrics = "reach,likes,comments,saved,shares,total_interactions"

        insights_data = api_get(m["id"] + "/insights", {"metric": metrics})
        insights = {}
        if insights_data and "data" in insights_data:
            for ins in insights_data["data"]:
                insights[ins["name"]] = ins["values"][0]["value"] if ins["values"] else None

        caption = m.get("caption", "") or ""
        hashtags = re.findall(r"#\w+", caption)
        mentions = re.findall(r"@\w+", caption)

        row = {
            "collected_at": today,
            "media_id": m["id"],
            "type": m.get("media_product_type", media_type),
            "timestamp": m["timestamp"],
            "caption_full": caption[:500],
            "permalink": m["permalink"],
            "hashtag_count": len(hashtags),
            "mention_count": len(mentions),
            "hashtags": " ".join(hashtags),
            "reach": insights.get("reach"),
            "views": insights.get("views"),
            "likes": insights.get("likes"),
            "comments": insights.get("comments"),
            "saved": insights.get("saved"),
            "shares": insights.get("shares"),
            "total_interactions": insights.get("total_interactions")
        }
        posts.append(row)
        print("   - " + m["id"] + " : " + str(row.get("reach")) + " reach")

    return posts


# ===== BLOC 3 : AUDIENCE (DEMOGRAPHIE) =====
def collect_audience():
    print("\n[3/5] Collecte donnees audience...")
    rows = []
    today = datetime.now().strftime("%Y-%m-%d %H:%M")

    breakdowns = [
        ("country", "follower_demographics"),
        ("city", "follower_demographics"),
        ("age", "follower_demographics"),
        ("gender", "follower_demographics")
    ]

    for breakdown, metric in breakdowns:
        data = api_get(IG_ID + "/insights", {
            "metric": metric,
            "period": "lifetime",
            "metric_type": "total_value",
            "breakdown": breakdown,
            "timeframe": "last_30_days"
        })
        if not data or "data" not in data:
            print("   - " + breakdown + " : non disponible")
            continue
        for item in data["data"]:
            tv = item.get("total_value", {})
            breakdowns_list = tv.get("breakdowns", [])
            for b in breakdowns_list:
                for result in b.get("results", []):
                    rows.append({
                        "collected_at": today,
                        "breakdown_type": breakdown,
                        "value": ",".join(result.get("dimension_values", [])),
                        "count": result.get("value")
                    })
        nb = len([r for r in rows if r["breakdown_type"] == breakdown])
        print("   - " + breakdown + " : " + str(nb) + " entrees")

    return rows


# ===== BLOC 4 : STORIES =====
def collect_stories():
    print("\n[4/5] Collecte donnees stories...")
    data = api_get(IG_ID + "/stories", {"fields": "id,media_type,timestamp,permalink"})
    if not data or "data" not in data:
        print("   - Aucune story active")
        return []

    stories = []
    today = datetime.now().strftime("%Y-%m-%d %H:%M")
    for s in data["data"]:
        insights_data = api_get(s["id"] + "/insights", {
            "metric": "reach,views,replies,total_interactions"
        })
        insights = {}
        if insights_data and "data" in insights_data:
            for ins in insights_data["data"]:
                insights[ins["name"]] = ins["values"][0]["value"] if ins["values"] else None

        stories.append({
            "collected_at": today,
            "story_id": s["id"],
            "type": s["media_type"],
            "timestamp": s["timestamp"],
            "permalink": s.get("permalink", ""),
            "reach": insights.get("reach"),
            "views": insights.get("views"),
            "replies": insights.get("replies"),
            "total_interactions": insights.get("total_interactions")
        })
    print("   - " + str(len(stories)) + " stories actives")
    return stories


# ===== BLOC 5 : HASHTAGS ANALYSIS =====
def analyze_hashtags(posts):
    print("\n[5/5] Analyse hashtags...")
    today = datetime.now().strftime("%Y-%m-%d %H:%M")
    tag_stats = {}
    for post in posts:
        tags = (post.get("hashtags") or "").split()
        reach = post.get("reach") or 0
        views = post.get("views") or 0
        likes = post.get("likes") or 0
        for tag in tags:
            if tag not in tag_stats:
                tag_stats[tag] = {"uses": 0, "total_reach": 0, "total_views": 0, "total_likes": 0}
            tag_stats[tag]["uses"] += 1
            tag_stats[tag]["total_reach"] += reach
            tag_stats[tag]["total_views"] += views
            tag_stats[tag]["total_likes"] += likes

    rows = []
    for tag, s in tag_stats.items():
        uses = s["uses"]
        rows.append({
            "collected_at": today,
            "hashtag": tag,
            "uses": uses,
            "avg_reach": round(s["total_reach"] / uses) if uses else 0,
            "avg_views": round(s["total_views"] / uses) if uses else 0,
            "avg_likes": round(s["total_likes"] / uses) if uses else 0
        })
    rows.sort(key=lambda x: x["avg_reach"], reverse=True)
    print("   - " + str(len(rows)) + " hashtags uniques analyses")
    return rows


# ===== GOOGLE SHEETS WRITER =====
def write_to_sheet(tab_name, rows):
    if not rows:
        print("   - Onglet " + tab_name + " : aucune donnee a ecrire")
        return
    scopes = ["https://www.googleapis.com/auth/spreadsheets"]
    creds = Credentials.from_service_account_file(CREDS_PATH, scopes=scopes)
    gc = gspread.authorize(creds)
    sh = gc.open_by_key(SHEET_ID)

    try:
        worksheet = sh.worksheet(tab_name)
    except gspread.WorksheetNotFound:
        worksheet = sh.add_worksheet(title=tab_name, rows=1000, cols=30)

    headers = list(rows[0].keys())
    existing = worksheet.get_all_values()

    if not existing or existing[0] != headers:
        if existing:
            worksheet.clear()
        worksheet.append_row(headers)

    values = [[str(row.get(h, "")) for h in headers] for row in rows]
    worksheet.append_rows(values, value_input_option="USER_ENTERED")
    print("   + Onglet '" + tab_name + "' : " + str(len(rows)) + " lignes ecrites")


# ===== MAIN =====
def run():
    print("=" * 60)
    print("MAKAN MOOD - PHASE 1 - COLLECTE STATS IG")
    print("=" * 60)

    account = collect_account()
    posts = collect_posts(limit=30)
    audience = collect_audience()
    stories = collect_stories()
    hashtags = analyze_hashtags(posts)

    print("\n" + "=" * 60)
    print("ECRITURE DANS GOOGLE SHEET")
    print("=" * 60)
    write_to_sheet("Compte_Daily", account)
    write_to_sheet("Posts", posts)
    write_to_sheet("Audience", audience)
    write_to_sheet("Stories", stories)
    write_to_sheet("Hashtags", hashtags)

    # Backup CSV local
    today = datetime.now().strftime("%Y-%m-%d")
    if posts:
        pd.DataFrame(posts).to_csv("backup_posts_" + today + ".csv", index=False, encoding="utf-8-sig")

    print("\n" + "=" * 60)
    print("OK Collecte terminee. Verifie ton Google Sheet.")
    print("=" * 60)


if __name__ == "__main__":
    run()
