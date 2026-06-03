import os
import json
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()
TOKEN   = os.getenv("META_ACCESS_TOKEN")
PAGE_ID = "1113066855225187"
BASE    = "https://graph.facebook.com/v19.0"
OUTPUT  = "docs/fb_data.json"

if not TOKEN:
    raise SystemExit("ERREUR : META_ACCESS_TOKEN manquant dans .env")

def api_get(endpoint, token, params={}):
    p = dict(params)
    p["access_token"] = token
    r = requests.get(f"{BASE}/{endpoint}", params=p, timeout=20)
    if r.status_code != 200:
        print(f"[!] Erreur {endpoint} : {r.status_code} - {r.text[:200]}")
        return None
    return r.json()

def get_page_token():
    # Essai 1 : via me/accounts
    data = api_get("me/accounts", TOKEN)
    if data:
        for page in data.get("data", []):
            if page["id"] == PAGE_ID:
                print("✓ Page token trouvé via me/accounts")
                return page["access_token"]
    # Essai 2 : token utilisateur directement
    print("[!] Page non trouvée dans me/accounts — utilisation du token utilisateur")
    return TOKEN

def get_page_info(pt):
    data = api_get(PAGE_ID, pt, {
        "fields": "name,fan_count,followers_count"
    })
    if not data:
        return {"name": "Makan Mood", "fans": 0, "followers": 0}
    return {
        "name":      data.get("name", "Makan Mood"),
        "fans":      data.get("fan_count", 0),
        "followers": data.get("followers_count", 0),
    }

def get_page_insights(pt):
    metrics = "page_impressions_unique,page_impressions,page_engaged_users,page_post_engagements"
    try:
        data = api_get(f"{PAGE_ID}/insights", pt, {
            "metric": metrics,
            "period": "week",
        })
        if not data:
            return {"reach_7d": 0, "impressions_7d": 0, "engaged_users": 0, "engagements": 0}
        result = {}
        for item in data.get("data", []):
            values = item.get("values", [])
            result[item["name"]] = values[-1]["value"] if values else 0
        return {
            "reach_7d":       result.get("page_impressions_unique", 0),
            "impressions_7d": result.get("page_impressions", 0),
            "engaged_users":  result.get("page_engaged_users", 0),
            "engagements":    result.get("page_post_engagements", 0),
        }
    except Exception as e:
        print(f"[!] Insights non disponibles : {e}")
        return {"reach_7d": 0, "impressions_7d": 0, "engaged_users": 0, "engagements": 0}

def get_posts(pt):
    data = api_get(f"{PAGE_ID}/posts", pt, {
        "fields": "message,created_time,likes.summary(true),comments.summary(true),shares",
        "limit": 10,
    })
    if not data:
        return []
    posts = []
    for p in data.get("data", []):
        posts.append({
            "id":        p.get("id", ""),
            "message":   (p.get("message", "") or "")[:120],
            "timestamp": p.get("created_time", ""),
            "likes":     p.get("likes", {}).get("summary", {}).get("total_count", 0),
            "comments":  p.get("comments", {}).get("summary", {}).get("total_count", 0),
            "shares":    p.get("shares", {}).get("count", 0),
        })
    print(f"   - {len(posts)} posts collectés")
    return posts

def get_fans_history(pt):
    try:
        since = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        until = datetime.now().strftime("%Y-%m-%d")
        data = api_get(f"{PAGE_ID}/insights/page_fans", pt, {
            "period": "day",
            "since": since,
            "until": until,
        })
        if not data:
            return []
        history = []
        entries = data.get("data", [])
        if entries:
            for item in entries[0].get("values", []):
                history.append({
                    "date": item.get("end_time", "")[:10],
                    "fans": item.get("value", 0)
                })
        print(f"   - {len(history)} jours d'historique")
        return history
    except Exception as e:
        print(f"[!] Historique fans non disponible : {e}")
        return []

def main():
    print("=" * 50)
    print("MAKAN MOOD - COLLECTE STATS FACEBOOK")
    print("=" * 50)

    page_token    = get_page_token()
    page_info     = get_page_info(page_token)
    print(f"✓ Page : {page_info['name']} — {page_info['fans']} fans")

    page_insights = get_page_insights(page_token)
    posts         = get_posts(page_token)
    history       = get_fans_history(page_token)

    fans_delta = 0
    if len(history) >= 8:
        fans_delta = history[-1]["fans"] - history[-8]["fans"]

    output = {
        "collected_at": datetime.utcnow().isoformat() + "Z",
        "page": {
            "name":            page_info["name"],
            "fans":            page_info["fans"],
            "followers":       page_info["followers"],
            "fans_delta_week": fans_delta,
        },
        "insights": page_insights,
        "posts":    posts,
        "history":  history,
    }

    os.makedirs("docs", exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"✓ fb_data.json écrit — {len(posts)} posts, {len(history)} jours")
    print("=" * 50)

if __name__ == "__main__":
    main()
