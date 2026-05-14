from __future__ import annotations

import plotly.graph_objects as go
import streamlit as st

from data_layer import ASSETS, get_price_history
from logic_layer import analyze_asset, plain_thai_advice

st.set_page_config(page_title="วิเคราะห์การลงทุนส่วนตัว", page_icon="📈", layout="wide")

SIGNAL_STYLES = {
    "ซื้อได้": ("🟢", "#16a34a"),
    "รอก่อน": ("🟡", "#ca8a04"),
    "หลีกเลี่ยง": ("🔴", "#dc2626"),
}

GLOSSARY = {
    "RSI": "ตัววัดว่าราคาขึ้นหรือลงแรงเกินไปหรือไม่ ค่าสูงกว่า 70 มักแปลว่าเริ่มร้อนแรง ต่ำกว่า 30 แปลว่าลงแรง",
    "MACD": "ตัวดูแรงส่งของราคา ถ้าเส้น MACD อยู่เหนือเส้นสัญญาณ มักแปลว่าโมเมนตัมดีขึ้น",
    "DCA": "การทยอยซื้อเป็นรอบ ๆ เช่น ทุกสัปดาห์หรือทุกเดือน เพื่อลดความเสี่ยงจากการซื้อผิดจังหวะ",
    "ค่าเฉลี่ย 30/90 วัน": "เส้นราคาเฉลี่ยย้อนหลัง ใช้ดูว่าราคาปัจจุบันอยู่ในแนวโน้มขึ้น ลง หรือแกว่งตัว",
    "ความผันผวน": "ระดับการแกว่งของราคา ยิ่งสูงยิ่งมีโอกาสกำไรและขาดทุนเร็ว",
}


def main() -> None:
    st.title("📈 โปรแกรมวิเคราะห์การลงทุนส่วนตัว")
    st.caption("ช่วยแปลตัวเลขการลงทุนให้เป็นภาษาคน เหมาะสำหรับผู้เริ่มต้น และใช้ฟรี 100%")

    with st.sidebar:
        st.header("เลือกสินทรัพย์")
        asset_key = st.selectbox("สินทรัพย์", list(ASSETS.keys()), format_func=_asset_label)
        days = st.slider("จำนวนวันย้อนหลัง", min_value=120, max_value=1095, value=365, step=30)
        st.info("ผลลัพธ์นี้ไม่ใช่คำแนะนำทางการเงิน แต่เป็นเครื่องมือช่วยศึกษา")

    try:
        data = get_price_history(asset_key, days)
        analysis = analyze_asset(data)
    except Exception as error:
        st.error(f"ดึงข้อมูลหรือวิเคราะห์ไม่ได้: {error}")
        st.stop()

    _render_signal(asset_key, analysis)
    _render_metrics(analysis)

    chart_col, explanation_col = st.columns([2, 1], gap="large")
    with chart_col:
        st.subheader("กราฟราคาและแนวโน้ม")
        st.plotly_chart(_price_chart(analysis["frame"], asset_key), use_container_width=True)
    with explanation_col:
        _render_explanation(analysis)

    st.divider()
    _render_glossary()


def _asset_label(asset_key: str) -> str:
    asset = ASSETS[asset_key]
    return f"{asset_key} — {asset.name}"


def _render_signal(asset_key: str, analysis: dict[str, object]) -> None:
    signal = str(analysis["signal"])
    emoji, color = SIGNAL_STYLES[signal]
    st.markdown(
        f"""
        <div style="padding: 1.25rem; border-radius: 1rem; background: #f8fafc; border: 1px solid #e2e8f0;">
            <div style="font-size: 1rem; color: #475569;">ผลวิเคราะห์สำหรับ {_asset_label(asset_key)}</div>
            <div style="font-size: 2.4rem; font-weight: 800; color: {color};">{emoji} {signal}</div>
            <div style="font-size: 1.1rem; color: #334155;">{plain_thai_advice(analysis)}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def _render_metrics(analysis: dict[str, object]) -> None:
    cols = st.columns(5)
    cols[0].metric("ราคาล่าสุด", f"{analysis['latest_price']:,.2f}")
    cols[1].metric("เปลี่ยนแปลง 30 วัน", _format_percent(analysis["change_30d"]))
    cols[2].metric("เปลี่ยนแปลง 90 วัน", _format_percent(analysis["change_90d"]))
    cols[3].metric("RSI", f"{analysis['rsi']:.1f}")
    cols[4].metric("ความผันผวน", _format_percent(float(analysis["volatility"]) * 100))


def _render_explanation(analysis: dict[str, object]) -> None:
    st.subheader("อ่านผลแบบภาษาคน")
    reasons = analysis["reasons"]
    cautions = analysis["cautions"]

    if reasons:
        st.success("จุดที่ดูดี")
        for reason in reasons:
            st.write(f"- {reason}")

    if cautions:
        st.warning("จุดที่ควรระวัง")
        for caution in cautions:
            st.write(f"- {caution}")

    st.subheader("ตัวเลขสำคัญ")
    st.write(f"- ค่าเฉลี่ย 30 วัน: {analysis['ma30']:,.2f}")
    st.write(f"- ค่าเฉลี่ย 90 วัน: {analysis['ma90']:,.2f}")
    st.write(f"- MACD: {analysis['macd']:.2f}")
    st.write(f"- เส้นสัญญาณ MACD: {analysis['macd_signal']:.2f}")


def _render_glossary() -> None:
    st.subheader("อธิบายศัพท์แบบง่าย")
    for term, description in GLOSSARY.items():
        with st.expander(term):
            st.write(description)


def _price_chart(frame, asset_key: str) -> go.Figure:
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=frame["date"], y=frame["close"], mode="lines", name="ราคา"))
    fig.add_trace(go.Scatter(x=frame["date"], y=frame["ma30"], mode="lines", name="ค่าเฉลี่ย 30 วัน"))
    fig.add_trace(go.Scatter(x=frame["date"], y=frame["ma90"], mode="lines", name="ค่าเฉลี่ย 90 วัน"))
    fig.update_layout(
        title=f"แนวโน้มราคา {asset_key}",
        xaxis_title="วันที่",
        yaxis_title="ราคา",
        hovermode="x unified",
        legend_title="ข้อมูล",
        margin={"l": 20, "r": 20, "t": 60, "b": 20},
    )
    return fig


def _format_percent(value: float) -> str:
    if value != value:
        return "-"
    return f"{value:+.2f}%"


if __name__ == "__main__":
    main()
