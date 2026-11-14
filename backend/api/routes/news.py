"""Normalize both legacy and newer yfinance news payloads."""
from datetime import datetime, timezone
from flask import Blueprint, jsonify
import yfinance as yf

news_bp = Blueprint("news", __name__)
TICKERS = {"GC=F": "Or", "SI=F": "Argent", "^GSPC": "S&P 500", "ISDW.L": "Finance islamique"}


def normalize_item(item, label):
    article = item.get("content") or item
    title = article.get("title")
    link = article.get("link") or (article.get("canonicalUrl") or {}).get("url") or (article.get("clickThroughUrl") or {}).get("url")
    if not title or not link or not link.startswith(("http://", "https://")):
        return None
    provider = article.get("provider")
    provider = provider.get("displayName") if isinstance(provider, dict) else (provider or item.get("publisher"))
    published = article.get("pubDate") or article.get("displayTime")
    timestamp = item.get("providerPublishTime") or 0
    if published:
        try:
            timestamp = int(datetime.fromisoformat(published.replace("Z", "+00:00")).timestamp())
        except (ValueError, TypeError):
            pass
    thumb = article.get("thumbnail") or item.get("thumbnail") or {}
    resolutions = thumb.get("resolutions") or []
    img = (resolutions[0].get("url") if resolutions else (thumb.get("originalUrl") or None))
    date = datetime.fromtimestamp(timestamp, tz=timezone.utc).strftime("%d/%m/%Y %H:%M UTC") if timestamp else ""
    return {
        "title": title,
        "publisher": provider or "Source non précisée",
        "link": link,
        "date": date,
        "timestamp": timestamp,
        "asset_label": label,
        "thumbnail": img,
        "summary": article.get("summary") or "",
    }


@news_bp.get("/latest")
def latest():
    results = {}
    for symbol, label in TICKERS.items():
        try:
            items = yf.Ticker(symbol).news or []
        except Exception:
            continue
        for item in items:
            normalized = normalize_item(item, label)
            if normalized:
                results[normalized["link"]] = normalized
    return jsonify(sorted(results.values(), key=lambda item: item["timestamp"], reverse=True)[:12])
