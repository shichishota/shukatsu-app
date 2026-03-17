"use client";
import { useState } from "react";

const FORMATS = ["ES向け（400字）", "面接トーク（話し言葉）", "簡潔版（200字）"];
const QUESTIONS = {
  "重視すること": ["給与・年収", "安定性・福利厚生", "成長・裁量", "ブランド・知名度", "海外関与", "社会的意義"],
  "希望職種": ["営業・法人営業", "マーケ・広告企画", "事業開発・新規", "人材・採用", "コンサル・戦略", "デジタル・DX"],
  "社風": ["体育会・熱量高め", "実力主義・成果重視", "チームワーク重視", "自由・フラット", "年功序列あり"],
  "避けたいこと": ["細かいルーティン", "完全な縦割り組織", "海外赴任必須", "長時間労働", "転勤が多い"],
};

// ── カラーパレット ──────────────────────────────────────────────────
const C = {
  red: "#E8251A", redD: "#B81A10", redL: "#FFEEEE",
  yellow: "#F5C800", yellowD: "#C9A200", yellowL: "#FFFDE0",
  blue: "#1464C8", blueD: "#0A4A9E", blueL: "#E0EEFF",
  green: "#18A058", greenD: "#0E7A40", greenL: "#E0F5EB",
  orange: "#F07820", orangeL: "#FFF0E0",
  bg: "#FFFAE8",
  card: "#FFFFFF",
  text: "#2A1A00",
  textSub: "#6B4E00",
};

const funFont = "'Helvetica Neue', 'Arial Rounded MT Bold', Arial, sans-serif";

// ── 共通スタイル ───────────────────────────────────────────────────
const card = (borderColor = C.yellow, extra = {}) => ({
  background: C.card,
  border: `3px solid ${borderColor}`,
  borderRadius: 16,
  boxShadow: `4px 4px 0px ${borderColor}`,
  padding: 24,
  marginBottom: 20,
  ...extra,
});

const sectionBanner = (bg, text) => ({
  background: bg,
  color: text || "#fff",
  fontWeight: 900,
  fontSize: 13,
  letterSpacing: 3,
  textTransform: "uppercase",
  textAlign: "center",
  padding: "8px 0",
  borderRadius: 8,
  marginBottom: 16,
  border: `2px solid rgba(0,0,0,0.12)`,
  textShadow: "1px 1px 0 rgba(0,0,0,0.2)",
});

const funBtn = (disabled, colors) => ({
  width: "100%",
  padding: "14px 0",
  borderRadius: 12,
  fontSize: 15,
  fontWeight: 900,
  cursor: disabled ? "not-allowed" : "pointer",
  background: disabled ? "#ccc" : `linear-gradient(180deg, ${colors[0]}, ${colors[1]})`,
  color: disabled ? "#999" : "#fff",
  border: `none`,
  boxShadow: disabled ? "none" : `0 4px 0 ${colors[2]}`,
  transform: "translateY(0)",
  transition: "all 0.1s",
  letterSpacing: 1,
  textShadow: disabled ? "none" : "1px 1px 2px rgba(0,0,0,0.3)",
  fontFamily: funFont,
});

const inputStyle = {
  width: "100%",
  background: "#FFFFF8",
  border: `2px solid ${C.yellow}`,
  borderRadius: 10,
  padding: "10px 14px",
  color: C.text,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: funFont,
};
const taStyle = { ...inputStyle, resize: "vertical", lineHeight: 1.7 };

const callClaude = async (prompt) => {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  return data.text;
};

// ── ストライプ背景 ─────────────────────────────────────────────────
const stripeBg = {
  background: `repeating-linear-gradient(
    -45deg,
    #FFFAE8,
    #FFFAE8 20px,
    #FFF3C0 20px,
    #FFF3C0 40px
  )`,
  minHeight: "100vh",
  fontFamily: funFont,
  color: C.text,
  padding: "24px 16px 48px",
};

// ── タイトルバナー ─────────────────────────────────────────────────
function TitleBanner({ onReset }) {
  return (
    <div style={{ background: `linear-gradient(180deg, ${C.red} 0%, ${C.redD} 100%)`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, border: `3px solid ${C.redD}`, boxShadow: `0 5px 0 #7A0A06`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#FFEE88", textTransform: "uppercase", marginBottom: 4 }}>✦ Job Hunt Tool ✦</div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#fff", textShadow: "2px 2px 0 rgba(0,0,0,0.3)", letterSpacing: 1 }}>就活アシスタント！</h1>
      </div>
      <button onClick={onReset} style={{ fontSize: 11, color: "#FFEE88", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontFamily: funFont }}>← 最初から</button>
    </div>
  );
}

// ── Profile Setup ──────────────────────────────────────────────────
function ProfileSetup({ onComplete }) {
  const [exp, setExp] = useState("");
  const [want, setWant] = useState("");
  const [grad, setGrad] = useState("27卒");

  return (
    <div style={{ ...stripeBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 520, width: "100%" }}>
        {/* ヘッダー */}
        <div style={{ background: `linear-gradient(180deg, ${C.red}, ${C.redD})`, borderRadius: 20, padding: "24px 20px", marginBottom: 20, border: `3px solid ${C.redD}`, boxShadow: `0 6px 0 #7A0A06`, textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#FFEE88", marginBottom: 6 }}>✦ JOB HUNT TOOL ✦</div>
          <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 900, color: "#fff", textShadow: "2px 3px 0 rgba(0,0,0,0.3)" }}>就活アシスタント！</h1>
          <div style={{ background: C.yellow, borderRadius: 8, padding: "6px 16px", display: "inline-block", fontSize: 13, fontWeight: 700, color: C.text, boxShadow: `0 3px 0 ${C.yellowD}` }}>
            経験を入力するだけで就活を全力サポート！
          </div>
        </div>

        {/* フォームカード */}
        <div style={card(C.blue)}>
          <div style={sectionBanner(C.blue)}>📝 プロフィールを入力しよう</div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: C.blue, fontWeight: 700, display: "block", marginBottom: 6 }}>卒業予定</label>
            <select value={grad} onChange={e => setGrad(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              {["25卒","26卒","27卒","28卒","既卒"].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: C.red, fontWeight: 700, display: "block", marginBottom: 4 }}>これまでの経験・やってきたこと ★</label>
            <p style={{ fontSize: 11, color: C.textSub, margin: "0 0 8px" }}>バイト・インターン・部活・起業・趣味でもOK！ざっくりでいい</p>
            <textarea value={exp} onChange={e => setExp(e.target.value)} rows={4} placeholder={"例：\n・飲食店バイトでホールリーダーをやってた\n・大学でサークルの会計担当\n・個人でYouTubeチャンネル運営してた"} style={taStyle} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: C.green, fontWeight: 700, display: "block", marginBottom: 4 }}>やりたいこと・気になること（なんとなくでもOK）</label>
            <p style={{ fontSize: 11, color: C.textSub, margin: "0 0 8px" }}>「稼ぎたい」くらいの解像度で全然OK！</p>
            <textarea value={want} onChange={e => setWant(e.target.value)} rows={3} placeholder={"例：\n・人に影響を与える仕事がしたい\n・とにかく給料が高いところに行きたい\n・まだ特にない"} style={taStyle} />
          </div>

          <button
            onClick={() => exp.trim() && onComplete({ exp, want, grad })}
            disabled={!exp.trim()}
            style={funBtn(!exp.trim(), [C.red, C.redD, "#7A0A06"])}
          >
            ✦ 分析してもらう！ →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 企業おすすめセクション ─────────────────────────────────────────
const tierStyle = {
  "難関": { bg: "#FFF8E0", border: C.orange, shadow: C.yellowD, accent: C.orange, badge: "#F07820" },
  "上位": { bg: "#E8F0FF", border: C.blue, shadow: C.blueD, accent: C.blue, badge: C.blue },
  "標準": { bg: "#E8FFF2", border: C.green, shadow: C.greenD, accent: C.green, badge: C.green },
};

function RecommendSection({ profile }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openTiers, setOpenTiers] = useState({ 難関: true, 上位: false, 標準: false });

  const generate = async () => {
    setLoading(true); setResult(null);
    const prompt = `あなたは日本の就職活動の専門家です。JSONのみで回答。余計な説明・コードブロック不要。

以下の学生のプロフィール・強み・志向性を深く読み込んで、この学生に本当に合う企業をおすすめしてください。

${profile}

{
  "industries": [{"name":"","reason":"この学生の経験・強みとの具体的な接点（2文）","fit_score":0}],
  "tiers": [
    {"level":"難関","label":"トップ難関（倍率100倍超）","companies":[{"name":"","industry":"","reason":"この学生の強みや経験がどう活きるか具体的に（2文）","salary":"","note":"","recruit_url":""}]},
    {"level":"上位","label":"上位校向け（倍率30〜100倍）","companies":[]},
    {"level":"標準","label":"標準（倍率10〜30倍・一般大手）","companies":[]}
  ]
}

ルール：大手日系企業中心。各tier必ず10社。プロフィールの強み・経験・やりたいことを最大限に考慮する。理由は必ずこの学生の具体的な経験に紐づけること。`;
    try {
      const raw = await callClaude(prompt);
      setResult(JSON.parse(raw));
    } catch { alert("エラーが発生しました。"); }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: 8 }}>
      {/* セクション区切り */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "8px 0 20px" }}>
        <div style={{ flex: 1, height: 3, background: `repeating-linear-gradient(90deg, ${C.red} 0px, ${C.red} 10px, ${C.yellow} 10px, ${C.yellow} 20px)`, borderRadius: 2 }} />
        <span style={{ fontSize: 12, fontWeight: 900, color: C.red, letterSpacing: 2, whiteSpace: "nowrap" }}>★ おすすめ企業 ★</span>
        <div style={{ flex: 1, height: 3, background: `repeating-linear-gradient(90deg, ${C.yellow} 0px, ${C.yellow} 10px, ${C.red} 10px, ${C.red} 20px)`, borderRadius: 2 }} />
      </div>

      {!result && !loading && (
        <div style={{ ...card(C.orange), textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🏢</div>
          <p style={{ margin: "0 0 4px", fontSize: 15, color: C.text, fontWeight: 900 }}>自己分析をもとに企業をおすすめするよ！</p>
          <p style={{ margin: "0 0 20px", fontSize: 12, color: C.textSub }}>あなたの強みや経験に合った企業を難易度別に30社出します</p>
          <button onClick={generate} style={funBtn(false, [C.orange, "#C85A00", "#8A3A00"])}>
            ✦ おすすめ企業を出す！
          </button>
        </div>
      )}

      {loading && (
        <div style={{ ...card(C.yellow), textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <p style={{ margin: 0, fontSize: 14, color: C.textSub, fontWeight: 700 }}>あなたの強みと照合して分析中...</p>
        </div>
      )}

      {result && (
        <div>
          {/* おすすめ業界 */}
          <div style={card(C.blue)}>
            <div style={sectionBanner(C.blue)}>🏭 おすすめ業界</div>
            {result.industries?.map((ind, i) => (
              <div key={i} style={{ marginBottom: i < result.industries.length - 1 ? 14 : 0, paddingBottom: i < result.industries.length - 1 ? 14 : 0, borderBottom: i < result.industries.length - 1 ? `2px dashed ${C.yellow}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontWeight: 900, color: C.blue, fontSize: 15 }}>{ind.name}</span>
                  <span style={{ fontSize: 11, color: "#fff", background: C.orange, padding: "2px 10px", borderRadius: 20, fontWeight: 700, boxShadow: `0 2px 0 ${C.yellowD}` }}>マッチ度 {ind.fit_score}%</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: C.textSub, lineHeight: 1.7 }}>{ind.reason}</p>
              </div>
            ))}
          </div>

          {/* 企業リスト */}
          {result.tiers?.map(tier => {
            const s = tierStyle[tier.level] || tierStyle["標準"];
            const open = openTiers[tier.level];
            return (
              <div key={tier.level} style={{ background: s.bg, border: `3px solid ${s.border}`, borderRadius: 16, marginBottom: 16, overflow: "hidden", boxShadow: `4px 4px 0 ${s.shadow}` }}>
                <button onClick={() => setOpenTiers(p => ({ ...p, [tier.level]: !p[tier.level] }))} style={{ width: "100%", background: `linear-gradient(180deg, ${s.border}, ${s.shadow})`, border: "none", padding: "12px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: funFont }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 900, fontSize: 16, color: "#fff", textShadow: "1px 1px 0 rgba(0,0,0,0.3)" }}>{tier.level}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.9)" }}>{tier.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "#fff", background: "rgba(0,0,0,0.2)", padding: "2px 10px", borderRadius: 20, fontWeight: 700 }}>{tier.companies?.length}社</span>
                    <span style={{ color: "#fff", fontWeight: 900 }}>{open ? "▲" : "▼"}</span>
                  </div>
                </button>
                {open && (
                  <div style={{ padding: "4px 20px 20px" }}>
                    {tier.companies?.map((co, i) => (
                      <div key={i} style={{ marginTop: 14, paddingTop: 14, borderTop: i === 0 ? "none" : `2px dashed ${s.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                          <div>
                            <span style={{ fontWeight: 900, color: C.text, fontSize: 14 }}>{co.name}</span>
                            <span style={{ marginLeft: 8, fontSize: 11, color: "#fff", background: s.badge, padding: "1px 8px", borderRadius: 10, fontWeight: 700 }}>{co.industry}</span>
                          </div>
                          {co.salary && <span style={{ fontSize: 11, color: C.green, fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8, background: C.greenL, padding: "2px 8px", borderRadius: 8 }}>{co.salary}</span>}
                        </div>
                        <p style={{ margin: "3px 0 0", fontSize: 12, color: C.textSub, lineHeight: 1.7 }}>{co.reason}</p>
                        {co.note && <p style={{ margin: "4px 0 0", fontSize: 11, color: C.orange, background: C.orangeL, padding: "3px 10px", borderRadius: 8, display: "inline-block", fontWeight: 700 }}>⚠ {co.note}</p>}
                        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {co.recruit_url && <a href={co.recruit_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.blue, background: C.blueL, border: `1px solid ${C.blue}`, borderRadius: 8, padding: "4px 12px", textDecoration: "none", fontWeight: 700 }}>📄 募集要項を見る</a>}
                          <a href={`https://www.google.com/search?q=${encodeURIComponent(co.name + " 新卒採用 2027")}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.textSub, background: "#f5f5f0", border: "1px solid #ccc", borderRadius: 8, padding: "4px 12px", textDecoration: "none", fontWeight: 700 }}>🔍 採用情報を検索</a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Tab: 自己分析 ──────────────────────────────────────────────────
function AnalysisTab({ userInput, onProfileReady }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState(false);
  const [profile, setProfile] = useState(null);

  const analyze = async () => {
    setLoading(true);
    const prompt = `あなたは就活のプロのキャリアアドバイザーです。以下の学生の情報をもとに、JSONのみで回答してください。余計な説明・コードブロック不要。

【卒業予定】${userInput.grad}
【経験・やってきたこと】
${userInput.exp}
【やりたいこと・気になること】
${userInput.want || "特になし"}

以下のJSON形式で分析してください：
{
  "strengths": [{ "title": "強みのタイトル", "desc": "その強みの説明と、どの経験から言えるか（2文）" }],
  "industry_logic": [{ "industry": "業界名", "reason": "なぜこの業界が合うか（2〜3文）", "caution": "注意点（1文）" }],
  "positioning": "就活戦略・ポジショニングのアドバイス（3〜4文）",
  "next_actions": ["具体的な次のアクション（短く）"]
}

ルール：強みは3つ、業界は3〜4つ、next_actionsは3〜4個。`;
    try {
      const raw = await callClaude(prompt);
      const parsed = JSON.parse(raw);
      setResult(parsed);
      const p = `【卒業予定】${userInput.grad}\n【経験】\n${userInput.exp}\n【やりたいこと】${userInput.want || "特になし"}\n【強み（AI分析）】${parsed.strengths?.map(s => s.title).join("、")}`;
      setProfile(p);
      onProfileReady(p);
    } catch { setResult(null); }
    setLoading(false);
    setRan(true);
  };

  if (!ran) return (
    <div style={{ ...card(C.red), textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
      <p style={{ fontSize: 15, color: C.text, fontWeight: 900, marginBottom: 6 }}>自己分析をスタートしよう！</p>
      <p style={{ fontSize: 12, color: C.textSub, marginBottom: 24, lineHeight: 1.7 }}>入力した経験をもとに<br />強み・おすすめ業界・就活戦略を分析するよ</p>
      <button onClick={analyze} style={funBtn(false, [C.red, C.redD, "#7A0A06"])}>
        ✦ 自己分析をスタート！
      </button>
    </div>
  );

  if (loading) return (
    <div style={{ ...card(C.yellow), textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
      <p style={{ margin: 0, fontSize: 14, color: C.textSub, fontWeight: 700 }}>あなたの経験を分析中...</p>
    </div>
  );

  if (!result) return <div style={{ color: C.red, padding: 24, fontWeight: 700 }}>エラーが発生しました。</div>;

  const icons = ["💡", "✨", "🔥"];

  return (
    <div>
      {/* 強み */}
      <div style={card(C.red)}>
        <div style={sectionBanner(C.red)}>💪 あなたの強み</div>
        {result.strengths?.map((s, i) => (
          <div key={i} style={{ marginBottom: i < result.strengths.length - 1 ? 16 : 0, paddingBottom: i < result.strengths.length - 1 ? 16 : 0, borderBottom: i < result.strengths.length - 1 ? `2px dashed ${C.yellow}` : "none", display: "flex", gap: 12 }}>
            <span style={{ fontSize: 24, minWidth: 32 }}>{icons[i]}</span>
            <div>
              <div style={{ fontWeight: 900, color: C.red, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
              <p style={{ margin: 0, fontSize: 13, color: C.textSub, lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 業界 */}
      <div style={card(C.blue)}>
        <div style={sectionBanner(C.blue)}>🏭 おすすめ業界・理由</div>
        {result.industry_logic?.map((ind, i) => (
          <div key={i} style={{ marginBottom: i < result.industry_logic.length - 1 ? 16 : 0, paddingBottom: i < result.industry_logic.length - 1 ? 16 : 0, borderBottom: i < result.industry_logic.length - 1 ? `2px dashed ${C.yellow}` : "none" }}>
            <div style={{ fontWeight: 900, color: C.blue, fontSize: 14, marginBottom: 6 }}>{ind.industry}</div>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: C.textSub, lineHeight: 1.7 }}>{ind.reason}</p>
            {ind.caution && <p style={{ margin: 0, fontSize: 11, color: C.orange, background: C.orangeL, padding: "4px 10px", borderRadius: 8, display: "inline-block", fontWeight: 700 }}>⚠ {ind.caution}</p>}
          </div>
        ))}
      </div>

      {/* 戦略 */}
      <div style={{ ...card(C.yellow), background: C.yellowL }}>
        <div style={sectionBanner(C.yellowD, C.text)}>🎯 就活戦略・ポジショニング</div>
        <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.9, fontWeight: 500 }}>{result.positioning}</p>
      </div>

      {/* 次のアクション */}
      <div style={card(C.green)}>
        <div style={sectionBanner(C.green)}>✅ 次にやること</div>
        {result.next_actions?.map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < result.next_actions.length - 1 ? 10 : 0 }}>
            <span style={{ background: C.green, color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, flexShrink: 0, boxShadow: `0 2px 0 ${C.greenD}` }}>{i + 1}</span>
            <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6, fontWeight: 500 }}>{a}</span>
          </div>
        ))}
      </div>

      {/* 企業おすすめ */}
      {profile && <RecommendSection profile={profile} />}
    </div>
  );
}

// ── Tab: ES・面接回答 ──────────────────────────────────────────────
function ESTab({ profile }) {
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [question, setQuestion] = useState("");
  const [format, setFormat] = useState(FORMATS[0]);
  const [extra, setExtra] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!company || !industry || !question) return;
    setLoading(true); setResult(null);
    const fmtDesc = { "ES向け（400字）": "ESの記入欄向けに400字程度。である調。", "面接トーク（話し言葉）": "面接で自然に話せる話し言葉（です・ます調）、250〜300字程度。", "簡潔版（200字）": "200字以内のコンパクトな回答。である調。" };
    const prompt = `あなたは就職活動の専門家です。以下をもとにJSONのみで回答してください。余計な説明・コードブロック不要。

${profile || "（プロフィール未設定）"}
【志望企業】${company}／【業界】${industry}
【質問文】${question}
【フォーマット】${fmtDesc[format]}
${extra ? `【追加メモ】${extra}` : ""}

{"intent":"この質問が本当に見ている観点・意図（2〜3文）","answer":"回答本文のみ"}

ルール：実経験を企業・業界に自然につなげる。具体性重視。「御社」使用。テンプレ表現避ける。`;
    try {
      const raw = await callClaude(prompt);
      setResult(JSON.parse(raw));
    } catch { setResult({ intent: "", answer: "エラーが発生しました。" }); }
    setLoading(false);
  };

  return (
    <div>
      {!profile && (
        <div style={{ background: C.yellowL, border: `2px solid ${C.yellow}`, borderRadius: 12, padding: "10px 16px", marginBottom: 16, fontSize: 12, color: C.yellowD, fontWeight: 700 }}>
          ⚠ 先に「自己分析」タブを実行すると、より精度の高い回答が生成されます！
        </div>
      )}
      <div style={card(C.blue)}>
        <div style={sectionBanner(C.blue)}>📝 ES・面接回答を生成しよう</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}><label style={{ fontSize: 12, color: C.blue, fontWeight: 700, display: "block", marginBottom: 6 }}>企業名</label><input value={company} onChange={e => setCompany(e.target.value)} placeholder="例：電通、三菱商事" style={inputStyle} /></div>
          <div style={{ flex: 1 }}><label style={{ fontSize: 12, color: C.blue, fontWeight: 700, display: "block", marginBottom: 6 }}>業界</label><input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="例：総合商社、広告" style={inputStyle} /></div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: C.red, fontWeight: 700, display: "block", marginBottom: 6 }}>質問文をそのまま貼り付けて！ ← ここがポイント</label>
          <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder={"例：\n「最も困難だったことと、どう乗り越えたかを教えてください。」"} rows={4} style={taStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: C.green, fontWeight: 700, display: "block", marginBottom: 8 }}>出力フォーマット</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {FORMATS.map(f => (
              <button key={f} onClick={() => setFormat(f)} style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: `2px solid ${format === f ? C.green : "#ccc"}`, background: format === f ? C.green : "#fff", color: format === f ? "#fff" : C.textSub, fontWeight: format === f ? 700 : 400, boxShadow: format === f ? `0 2px 0 ${C.greenD}` : "none", fontFamily: funFont }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: C.textSub, fontWeight: 700, display: "block", marginBottom: 6 }}>追加メモ（任意）</label>
          <input value={extra} onChange={e => setExtra(e.target.value)} placeholder="例：営業職志望、海外事業部に興味あり" style={inputStyle} />
        </div>
        <button onClick={generate} disabled={!company || !industry || !question || loading} style={funBtn(!company || !industry || !question || loading, [C.red, C.redD, "#7A0A06"])}>
          {loading ? "生成中..." : "✦ 回答を生成する！"}
        </button>
      </div>

      {(result || loading) && (
        <div style={card(C.orange)}>
          {loading ? (
            <div style={{ textAlign: "center", color: C.textSub, fontSize: 13, fontWeight: 700 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
              質問の意図を読み取って生成中...
            </div>
          ) : (
            <>
              {result.intent && (
                <div style={{ background: C.blueL, border: `2px solid ${C.blue}`, borderRadius: 12, padding: "12px 16px", marginBottom: 18 }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: C.blue, fontWeight: 900, marginBottom: 6 }}>🎯 この質問の意図</div>
                  <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.7 }}>{result.intent}</p>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: C.textSub, fontWeight: 700 }}>✦ 生成された回答</span>
                <button onClick={() => navigator.clipboard.writeText(result?.answer || "")} style={{ background: C.yellowL, border: `2px solid ${C.yellow}`, borderRadius: 8, padding: "5px 12px", fontSize: 11, color: C.yellowD, cursor: "pointer", fontWeight: 700, fontFamily: funFont }}>コピー</button>
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.9, color: C.text, whiteSpace: "pre-wrap" }}>{result.answer}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────
export default function App() {
  const [userInput, setUserInput] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState(0);
  const tabs = ["自己分析 & 企業おすすめ", "ES・面接回答"];

  if (!userInput) return <ProfileSetup onComplete={input => { setUserInput(input); setTab(0); }} />;

  return (
    <div style={stripeBg}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <TitleBanner onReset={() => { setUserInput(null); setProfile(null); }} />

        {/* タブ */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              flex: 1, padding: "11px 0", borderRadius: 12, fontSize: 12, fontWeight: 900,
              cursor: "pointer", border: `3px solid ${tab === i ? C.redD : "#ccc"}`,
              background: tab === i ? `linear-gradient(180deg, ${C.red}, ${C.redD})` : "#fff",
              color: tab === i ? "#fff" : C.textSub,
              boxShadow: tab === i ? `0 4px 0 #7A0A06` : "0 3px 0 #ccc",
              textShadow: tab === i ? "1px 1px 0 rgba(0,0,0,0.3)" : "none",
              fontFamily: funFont,
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>

        {tab === 0 && <AnalysisTab userInput={userInput} onProfileReady={setProfile} />}
        {tab === 1 && <ESTab profile={profile} />}
      </div>
    </div>
  );
}
