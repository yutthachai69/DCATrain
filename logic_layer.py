from __future__ import annotations

import numpy as np
import pandas as pd


def add_indicators(data: pd.DataFrame) -> pd.DataFrame:
    frame = data.copy()
    frame["ma30"] = frame["close"].rolling(30).mean()
    frame["ma90"] = frame["close"].rolling(90).mean()
    frame["rsi"] = _calculate_rsi(frame["close"])

    ema12 = frame["close"].ewm(span=12, adjust=False).mean()
    ema26 = frame["close"].ewm(span=26, adjust=False).mean()
    frame["macd"] = ema12 - ema26
    frame["macd_signal"] = frame["macd"].ewm(span=9, adjust=False).mean()

    daily_return = frame["close"].pct_change()
    frame["volatility"] = daily_return.rolling(30).std() * np.sqrt(252)
    frame["drawdown"] = frame["close"] / frame["close"].cummax() - 1
    return frame


def analyze_asset(data: pd.DataFrame) -> dict[str, object]:
    frame = add_indicators(data).dropna().reset_index(drop=True)
    if len(frame) < 30:
        raise ValueError("ข้อมูลยังไม่พอสำหรับวิเคราะห์แนวโน้ม")

    latest = frame.iloc[-1]
    previous = frame.iloc[-2]
    score = 0
    reasons: list[str] = []
    cautions: list[str] = []

    if latest["close"] > latest["ma30"] > latest["ma90"]:
        score += 2
        reasons.append("ราคาอยู่เหนือค่าเฉลี่ย 30 และ 90 วัน แปลว่าแนวโน้มโดยรวมยังดูแข็งแรง")
    elif latest["close"] < latest["ma30"] < latest["ma90"]:
        score -= 2
        cautions.append("ราคาอยู่ต่ำกว่าค่าเฉลี่ยสำคัญ แนวโน้มยังอ่อนแรง")
    else:
        reasons.append("แนวโน้มยังไม่ชัดเจน ราคาแกว่งใกล้ค่าเฉลี่ย")

    if 45 <= latest["rsi"] <= 65:
        score += 1
        reasons.append("RSI อยู่ในโซนกลาง ยังไม่ร้อนแรงเกินไป")
    elif latest["rsi"] > 70:
        score -= 1
        cautions.append("RSI สูงกว่า 70 อาจเริ่มแพงหรือถูกซื้อมากเกินไป")
    elif latest["rsi"] < 30:
        score -= 1
        cautions.append("RSI ต่ำกว่า 30 แปลว่าราคาลงแรง ควรรอสัญญาณฟื้นตัวก่อน")

    if latest["macd"] > latest["macd_signal"] and previous["macd"] <= previous["macd_signal"]:
        score += 1
        reasons.append("MACD เพิ่งตัดขึ้น เป็นสัญญาณบวกในระยะสั้น")
    elif latest["macd"] < latest["macd_signal"]:
        score -= 1
        cautions.append("MACD ยังต่ำกว่าเส้นสัญญาณ โมเมนตัมระยะสั้นยังไม่ดี")

    if latest["volatility"] > 0.75:
        score -= 1
        cautions.append("ความผันผวนสูงมาก เหมาะกับเงินเย็นและควรแบ่งไม้")
    elif latest["volatility"] < 0.25:
        score += 1
        reasons.append("ความผันผวนไม่สูงมากเมื่อเทียบกับสินทรัพย์เสี่ยง")

    signal = _signal_from_score(score)
    return {
        "signal": signal,
        "score": score,
        "latest_price": float(latest["close"]),
        "change_30d": _period_change(frame, 30),
        "change_90d": _period_change(frame, 90),
        "rsi": float(latest["rsi"]),
        "macd": float(latest["macd"]),
        "macd_signal": float(latest["macd_signal"]),
        "volatility": float(latest["volatility"]),
        "ma30": float(latest["ma30"]),
        "ma90": float(latest["ma90"]),
        "reasons": reasons,
        "cautions": cautions,
        "frame": frame,
    }


def plain_thai_advice(analysis: dict[str, object]) -> str:
    signal = str(analysis["signal"])
    if signal == "ซื้อได้":
        return "ภาพรวมค่อนข้างดี ถ้าต้องการลงทุนควรทยอยซื้อแบบ DCA ไม่จำเป็นต้องซื้อทั้งหมดครั้งเดียว"
    if signal == "รอก่อน":
        return "ยังไม่ใช่จังหวะที่ชัดเจน ควรรอดูราคาและสัญญาณอีกระยะ หรือทยอยน้อยกว่าปกติ"
    return "ความเสี่ยงตอนนี้ค่อนข้างสูง สำหรับมือใหม่ควรหลีกเลี่ยงหรือรอให้แนวโน้มดีขึ้นก่อน"


def _calculate_rsi(close: pd.Series, period: int = 14) -> pd.Series:
    delta = close.diff()
    gain = delta.clip(lower=0).rolling(period).mean()
    loss = -delta.clip(upper=0).rolling(period).mean()
    rs = gain / loss.replace(0, np.nan)
    return 100 - (100 / (1 + rs))


def _period_change(frame: pd.DataFrame, days: int) -> float:
    if len(frame) <= days:
        return float("nan")
    return float((frame["close"].iloc[-1] / frame["close"].iloc[-days] - 1) * 100)


def _signal_from_score(score: int) -> str:
    if score >= 3:
        return "ซื้อได้"
    if score >= 0:
        return "รอก่อน"
    return "หลีกเลี่ยง"
