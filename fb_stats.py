import os
import json
import requests
from datetime import datetime, timedelta

# ── CONFIG ────────────────────────────────────────────────────────────────────
TOKEN   = os.environ["META_ACCESS_TOKEN"]
PAGE_ID = "1113066855225187"
BASE    = "https://graph.facebook.com/v19.0"
OUTPUT  = "docs/fb_data.json"

def get(endpoint, params={}):
    params["access_token"] = TOKEN
    r = requests.get(f"{BASE}/{endpoint}", params=params)
    r.raise_for_status()
    return r.json()

# ── 1. PAGE TOKEN ─────────────────────────────────────────────────────────────
def get_page_token():
    data = get("me/accounts")
    for page in data.get("data", []):
        if page["id"] == PAGE_ID:
            return page["access_token"]
    raise Exception(f"Page {PAGE_ID} non trouvée dans me/accounts")

# ── 2. INFOS PAGE ─────────────────────────────────────────────────────────────
def get_page_info(page_token):
    data = requests.get(
        f"{BASE}/{PAGE_ID}",
        params={
            "fields": "name,fan_count,followers_count,cover",
            "access_token": page_token
        }
    ).json()
    return {
        "name":       data.get("name", "Makan Mood"),
        "fans":       data.get("fan_count", 0),
        "followers":  data.get("followers_count", 0),
    }

# ── 3. INSIGHTS PAGE ──────────────────────────────────────────────────────────
def get_page_insights(page_token):
    metrics = "page_impressions_unique,page_impressions,page_engaged_users,page_post_engagements"
    try:
        data = requests.get(
            f"{BASE}/{PAGE_ID}/insights",
            params={
                "metric": metrics,
                "period": "week",
                "access_token": page_token
            }
        ).json()
        result = {}
        for item in data.get("data", []):
            name = item["name"]
            values = item.get("values", [])
            result[name] = values[-1]["value"] if values else 0
        return {
            "reach_7d":       result.get("page_impressions_unique", 0),
            "impressions_7d": result.get("page_impressions", 0),
            "engaged_users":  result.get("page_engaged_users", 0),
            "engagements":    result.get("page_post_engagements", 0),
        }
    except Exception as e:
        print(f"Insights non disponibles : {e}")
        return {"reach_7d": 0, "impressions_7d": 0, "engaged_users": 0, "engagements": 0}

# ── 4. TOP POSTS ──────────────────────────────────────────────────────────────
def get_posts(page_token):
    data = requests.get(
        f"{BASE}/{PAGE_ID}/posts",
        params={
            "fields": "message,created_time,likes.summary(true),comments.summary(true),shares",
            "limit": 10,
            "access_token": page_token
        }
    ).json()
    posts = []
    for p in data.get("data", []):
        posts.append({
            "id":        p.get("id", ""),
            "message":   p.get("message", "")[:120],
            "timestamp": p.get("created_time", ""),
            "likes":     p.get("likes", {}).get("summary", {}).get("total_count", 0),
            "comments":  p.get("comments", {}).get("summary", {}).get("total_count", 0),
            "shares":    p.get("shares", {}).get("count", 0),
        })
    return posts

# ── 5. HISTORIQUE FANS 30 jours ───────────────────────────────────────────────
def get_fans_history(page_token):
    try:
        data = requests.get(
            f"{BASE}/{PAGE_ID}/insights/page_fans",
            params={
                "period": "day",
                "since": (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d"),
                "until": datetime.now().strftime("%Y-%m-%d"),
                "access_token": page_token
            }
        ).json()
        history = []
        for item in data.get("data", [{}])[0].get("values", []):
            history.append({
                "date":  item.get("end_time", "")[:10],
                "fans":  item.get("value", 0)
            })
        return history
    except Exception as e:
        print(f"Historique fans non disponible : {e}")
        return []

# ── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    print("Collecte stats Facebook — Makan Mood Page")
    page_token    = get_page_token()
    page_info     = get_page_info(page_token)
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

    print(f"✓ fb_data.json écrit — {page_info['fans']} fans, {len(posts)} posts")

if __name__ == "__main__":
    main()
