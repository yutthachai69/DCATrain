from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

import pandas as pd
import requests
import streamlit as st
import yfinance as yf

AssetSource = Literal["yfinance", "coingecko"]


@dataclass(frozen=True)
class AssetConfig:
    name: str
    symbol: str
    source: AssetSource
    coingecko_id: str | None = None


ASSETS: dict[str, AssetConfig] = {
    "BTC": AssetConfig("Bitcoin", "BTC", "coingecko", "bitcoin"),
    "ETH": AssetConfig("Ethereum", "ETH", "coingecko", "ethereum"),
    "AAPL": AssetConfig("Apple", "AAPL", "yfinance"),
    "PTT.BK": AssetConfig("PTT", "PTT.BK", "yfinance"),
    "ทอง": AssetConfig("Gold Futures", "GC=F", "yfinance"),
    "S&P500": AssetConfig("S&P 500", "^GSPC", "yfinance"),
}


@st.cache_data(ttl=900, show_spinner=False)
def get_price_history(asset_key: str, days: int = 365) -> pd.DataFrame:
    asset = ASSETS[asset_key]
    if asset.source == "coingecko":
        return _get_coingecko_history(asset.coingecko_id or asset.symbol, days)
    return _get_yfinance_history(asset.symbol, days)


def _get_yfinance_history(symbol: str, days: int) -> pd.DataFrame:
    period = f"{max(days, 30)}d"
    raw = yf.download(symbol, period=period, interval="1d", progress=False, auto_adjust=True)
    if raw.empty:
        raise ValueError(f"ไม่พบข้อมูลราคาของ {symbol}")

    data = raw.reset_index()
    data = data.rename(columns={"Date": "date", "Close": "close", "Open": "open", "High": "high", "Low": "low", "Volume": "volume"})
    return _clean_price_frame(data)


def _get_coingecko_history(coin_id: str, days: int) -> pd.DataFrame:
    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
    response = requests.get(url, params={"vs_currency": "usd", "days": days, "interval": "daily"}, timeout=20)
    response.raise_for_status()
    payload = response.json()

    prices = payload.get("prices", [])
    volumes = payload.get("total_volumes", [])
    if not prices:
        raise ValueError(f"ไม่พบข้อมูลราคาของ {coin_id}")

    price_df = pd.DataFrame(prices, columns=["timestamp", "close"])
    volume_df = pd.DataFrame(volumes, columns=["timestamp", "volume"])
    data = price_df.merge(volume_df, on="timestamp", how="left")
    data["date"] = pd.to_datetime(data["timestamp"], unit="ms").dt.tz_localize(None)
    data["open"] = data["close"]
    data["high"] = data["close"]
    data["low"] = data["close"]
    return _clean_price_frame(data)


def _clean_price_frame(data: pd.DataFrame) -> pd.DataFrame:
    cleaned = data[["date", "open", "high", "low", "close", "volume"]].copy()
    cleaned["date"] = pd.to_datetime(cleaned["date"]).dt.tz_localize(None)
    for column in ["open", "high", "low", "close", "volume"]:
        cleaned[column] = pd.to_numeric(cleaned[column], errors="coerce")
    cleaned = cleaned.dropna(subset=["date", "close"]).sort_values("date")
    return cleaned.drop_duplicates(subset=["date"], keep="last").reset_index(drop=True)
