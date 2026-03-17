"use client";
import { useState } from "react";

const FORMATS = ["ES向け（400字）", "面接トーク（話し言葉）", "簡潔版（200字）"];
const QUESTIONS = {
  "重視すること（優先順に選んで）": ["給与・年収", "安定性・福利厚生", "成長・裁量", "ブランド・知名度", "海外関与", "社会的意義"],
  "希望職種（優先順に選んで）": ["営業・法人営業", "マーケ・広告企画", "事業開発・新規", "人材・採用", "コンサル・戦略", "デジタル・DX"],
  "社風（優先順に選んで）": ["体育会・熱量高め", "実力主義・成果重視", "チームワーク重視", "自由・フラット", "年功序列あり"],
  "避けたいこと": ["細かいルーティン", "完全な縦割り組織", "海外赴任必須", "長時間労働", "転勤が多い"],
};

const inputStyle = { width: "100%", background: "#0f0f18", border: "1px solid #2e2e42", borderRadius: 10, padding: "10px 14px", color: "#e8e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" };
const taStyle = { ...inputStyle, resize: "vertical", lineHeight: 1.7 };
const tc = { "難関": { accent: "#f59e0b", bg: "#2a1f0a", border: "#4a3010", badge: "#f59e0b22" }, "上位": { accent: "#60a5fa", bg: "#0a1a2a", border: "#103050", badge: "#60a5fa22" }, "標準": { accent: "#4ade80", bg: "#0a2a1a", border: "#104030", badge: "#4ade8022" } };

const callClaude = async (prompt) => {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  return data.text;
};

// ─── Profile Setup ─────────────────────────────────────────────────
function ProfileSetup({ onComplete }) {
  const [exp, setExp] = useState("");
  const [want, setWant] = useState("");
  const [grad, setGrad] = useState("27卒");

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f13", color: "#e8e8f0", fontFamily: "'Helvetica Neue', Arial, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 520, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#6b6b8a", textTransform: "uppercase", marginBottom: 8 }}>Job Hunt Tool</div>
          <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 800, color: "#fff" }}>就活アシスタント</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#6b6b8a" }}>ざっくりでOK。経験とやりたいことを書くだけで、業界・企業・ES対策まで全部サポートするよ。</p>
        </div>
        <div style={{ background: "#1a1a24", borderRadius: 16, padding: 28, border: "1px solid #2a2a3a" }}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: "#9090aa", display: "block", marginBottom: 4 }}>卒業予定</label>
            <select value={grad} onChange={e => setGrad(e.target.value)} style={{ ...inputStyle, cursor: "pointer", marginBottom: 18 }}>
              {["25卒","26卒","27卒","28卒","既卒"].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, color: "#9090aa", display: "block", marginBottom: 4 }}>これまでの経験・やってきたこと <span style={{ color: "#ef4444" }}>*</span></label>
            <p style={{ fontSize: 11, color: "#6b6b8a", margin: "0 0 8px" }}>バイト・インターン・部活・起業・趣味でもOK。ざっくりでいい。</p>
            <textarea value={exp} onChange={e => setExp(e.target.value)} rows={4} placeholder={"例：\n・飲食店バイトでホールリーダーをやってた\n・大学でサークルの会計担当\n・個人でYouTubeチャンネル運営してた"} style={taStyle} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: "#9090aa", display: "block", marginBottom: 4 }}>やりたいこと・気になること（なんとなくでもOK）</label>
            <p style={{ fontSize: 11, color: "#6b6b8a", margin: "0 0 8px" }}>「人と関わる仕事がしたい」「稼ぎたい」くらいの解像度でも全然いい。</p>
            <textarea value={want} onChange={e => setWant(e.target.value)} rows={3} placeholder={"例：\n・人に影響を与える仕事がしたい\n・とにかく給料が高いところに行きたい\n・まだ特にない"} style={taStyle} />
          </div>
          <button onClick={() => exp.trim() && onComplete({ exp, want, grad })} disabled={!exp.trim()} style={{ width: "100%", padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: exp.trim() ? "pointer" : "not-allowed", background: exp.trim() ? "linear-gradient(135deg, #5b5bf0, #8b5cf6)" : "#2a2a3a", color: exp.trim() ? "#fff" : "#555", border: "none" }}>
            分析してもらう →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 企業おすすめセクション（自己分析の下に統合）────────────────────
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
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "#2a2a3a" }} />
        <span style={{ fontSize: 11, letterSpacing: 2, color: "#5b5bf0", textTransform: "uppercase" }}>企業おすすめ</span>
        <div style={{ flex: 1, height: 1, background: "#2a2a3a" }} />
      </div>

      {!result && !loading && (
        <div style={{ background: "#1a1a24", borderRadius: 16, padding: 28, marginBottom: 16, border: "1px solid #2a2a3a", textAlign: "center" }}>
          <p style={{ margin: "0 0 6px", fontSize: 14, color: "#e8e8f0", fontWeight: 600 }}>上の自己分析をもとに企業をおすすめするよ</p>
          <p style={{ margin: "0 0 20px", fontSize: 12, color: "#6b6b8a" }}>あなたの強みや経験に合った企業を難易度別に30社出します</p>
          <button onClick={generate} style={{ padding: "12px 32px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", background: "linear-gradient(135deg, #5b5bf0, #8b5cf6)", color: "#fff", border: "none" }}>
            ✦ おすすめ企業を出す
          </button>
        </div>
      )}

      {loading && <div style={{ background: "#1a1a24", borderRadius: 16, padding: 24, border: "1px solid #2a2a3a", color: "#6b6b8a", fontSize: 13 }}>● あなたの強みと照合して分析中...</div>}

      {result && (
        <div>
          <div style={{ background: "#1a1a24", borderRadius: 16, padding: 24, border: "1px solid #2a2a3a", marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#8b5cf6", textTransform: "uppercase", marginBottom: 16 }}>おすすめ業界</div>
            {result.industries?.map((ind, i) => (
              <div key={i} style={{ marginBottom: i < result.industries.length - 1 ? 16 : 0, paddingBottom: i < result.industries.length - 1 ? 16 : 0, borderBottom: i < result.industries.length - 1 ? "1px solid #2a2a3a" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><span style={{ fontWeight: 700, color: "#e8e8f0", fontSize: 15 }}>{ind.name}</span><span style={{ fontSize: 12, color: "#8b5cf6", background: "#2a1a4a", padding: "3px 10px", borderRadius: 20 }}>マッチ度 {ind.fit_score}%</span></div>
                <p style={{ margin: 0, fontSize: 13, color: "#9090aa", lineHeight: 1.7 }}>{ind.reason}</p>
              </div>
            ))}
          </div>
          {result.tiers?.map(tier => { const c = tc[tier.level] || tc["標準"]; const open = openTiers[tier.level]; return (
            <div key={tier.level} style={{ background: "#1a1a24", borderRadius: 16, border: `1px solid ${c.border}`, marginBottom: 16, overflow: "hidden" }}>
              <button onClick={() => setOpenTiers(p => ({ ...p, [tier.level]: !p[tier.level] }))} style={{ width: "100%", background: c.bg, border: "none", padding: "14px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontWeight: 800, fontSize: 15, color: c.accent }}>{tier.level}</span><span style={{ fontSize: 12, color: "#9090aa" }}>{tier.label}</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 11, color: c.accent, background: c.badge, padding: "3px 10px", borderRadius: 20 }}>{tier.companies?.length}社</span><span style={{ color: "#6b6b8a" }}>{open ? "▲" : "▼"}</span></div>
              </button>
              {open && <div style={{ padding: "4px 20px 20px" }}>
                {tier.companies?.map((co, i) => (
                  <div key={i} style={{ marginTop: 14, paddingTop: 14, borderTop: i === 0 ? "none" : "1px solid #2a2a3a" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <div><span style={{ fontWeight: 700, color: "#e8e8f0", fontSize: 14 }}>{co.name}</span><span style={{ marginLeft: 8, fontSize: 11, color: "#6b6b8a", background: "#1f1f2e", padding: "2px 8px", borderRadius: 10 }}>{co.industry}</span></div>
                      {co.salary && <span style={{ fontSize: 11, color: "#22c55e", whiteSpace: "nowrap", marginLeft: 8 }}>{co.salary}</span>}
                    </div>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9090aa", lineHeight: 1.7 }}>{co.reason}</p>
                    {co.note && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#a07040", background: "#2a1a0a", padding: "3px 10px", borderRadius: 8, display: "inline-block" }}>⚠ {co.note}</p>}
                    <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {co.recruit_url && <a href={co.recruit_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#5b5bf0", background: "#1a1a3a", border: "1px solid #3a3a6a", borderRadius: 8, padding: "4px 12px", textDecoration: "none" }}>📄 募集要項を見る</a>}
                      <a href={`https://www.google.com/search?q=${encodeURIComponent(co.name + " 新卒採用 2027")}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#9090aa", background: "#1a1a24", border: "1px solid #2e2e42", borderRadius: 8, padding: "4px 12px", textDecoration: "none" }}>🔍 採用情報を検索</a>
                    </div>
                  </div>
                ))}
              </div>}
            </div>
          ); })}
        </div>
      )}
    </div>
  );
}

// ─── Tab: 自己分析 + 企業おすすめ ──────────────────────────────────
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
  "strengths": [
    { "title": "強みのタイトル", "desc": "その強みの説明と、どの経験から言えるか（2文）" }
  ],
  "industry_logic": [
    { "industry": "業界名", "reason": "なぜこの業界が合うか（経験・希望との接点を具体的に、2〜3文）", "caution": "この業界を選ぶ上での注意点や現実（1文）" }
  ],
  "positioning": "この学生が就活でどう自分を位置づけるべきか、戦略的なアドバイス（3〜4文）",
  "next_actions": ["具体的な次のアクション（短く）"]
}

ルール：強みは3つ、業界は3〜4つ、next_actionsは3〜4個。経験が薄くても前向きに、でも現実的に。`;
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
    <div style={{ background: "#1a1a24", borderRadius: 16, padding: 32, border: "1px solid #2a2a3a", textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>🔍</div>
      <p style={{ fontSize: 14, color: "#9090aa", marginBottom: 24, lineHeight: 1.8 }}>入力した経験とやりたいことをもとに<br />強み・おすすめ業界・就活戦略を分析するよ</p>
      <button onClick={analyze} style={{ padding: "12px 32px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", background: "linear-gradient(135deg, #5b5bf0, #8b5cf6)", color: "#fff", border: "none" }}>
        ✦ 自己分析をスタート
      </button>
    </div>
  );

  if (loading) return (
    <div style={{ background: "#1a1a24", borderRadius: 16, padding: 32, border: "1px solid #2a2a3a", color: "#6b6b8a", fontSize: 13, textAlign: "center" }}>
      <div style={{ marginBottom: 12, fontSize: 24 }}>⏳</div>
      あなたの経験を分析中...
    </div>
  );

  if (!result) return <div style={{ color: "#ef4444", padding: 24 }}>エラーが発生しました。</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#1a1a24", borderRadius: 16, padding: 24, border: "1px solid #2a2a3a" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#8b5cf6", textTransform: "uppercase", marginBottom: 16 }}>あなたの強み</div>
        {result.strengths?.map((s, i) => (
          <div key={i} style={{ marginBottom: i < result.strengths.length - 1 ? 16 : 0, paddingBottom: i < result.strengths.length - 1 ? 16 : 0, borderBottom: i < result.strengths.length - 1 ? "1px solid #2a2a3a" : "none", display: "flex", gap: 12 }}>
            <span style={{ fontSize: 18, minWidth: 28 }}>{"💡✨🔥"[i]}</span>
            <div>
              <div style={{ fontWeight: 700, color: "#e8e8f0", fontSize: 14, marginBottom: 4 }}>{s.title}</div>
              <p style={{ margin: 0, fontSize: 13, color: "#9090aa", lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#1a1a24", borderRadius: 16, padding: 24, border: "1px solid #2a2a3a" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#5b5bf0", textTransform: "uppercase", marginBottom: 16 }}>業界の絞り方・理由</div>
        {result.industry_logic?.map((ind, i) => (
          <div key={i} style={{ marginBottom: i < result.industry_logic.length - 1 ? 16 : 0, paddingBottom: i < result.industry_logic.length - 1 ? 16 : 0, borderBottom: i < result.industry_logic.length - 1 ? "1px solid #2a2a3a" : "none" }}>
            <div style={{ fontWeight: 700, color: "#e8e8f0", fontSize: 14, marginBottom: 6 }}>{ind.industry}</div>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#9090aa", lineHeight: 1.7 }}>{ind.reason}</p>
            {ind.caution && <p style={{ margin: 0, fontSize: 11, color: "#a07040", background: "#2a1a0a", padding: "4px 10px", borderRadius: 8, display: "inline-block" }}>⚠ {ind.caution}</p>}
          </div>
        ))}
      </div>

      <div style={{ background: "#12122a", borderRadius: 16, padding: 24, border: "1px solid #3a2a6a" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#8b5cf6", textTransform: "uppercase", marginBottom: 12 }}>就活戦略・ポジショニング</div>
        <p style={{ margin: 0, fontSize: 14, color: "#c8c0e8", lineHeight: 1.9 }}>{result.positioning}</p>
      </div>

      <div style={{ background: "#1a1a24", borderRadius: 16, padding: 24, border: "1px solid #2a2a3a" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#22c55e", textTransform: "uppercase", marginBottom: 14 }}>次にやること</div>
        {result.next_actions?.map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < result.next_actions.length - 1 ? 10 : 0 }}>
            <span style={{ color: "#22c55e", fontWeight: 800, fontSize: 13, minWidth: 20 }}>{i + 1}.</span>
            <span style={{ fontSize: 13, color: "#d8d8ee", lineHeight: 1.6 }}>{a}</span>
          </div>
        ))}
      </div>

      {/* 企業おすすめを自動表示 */}
      {profile && <RecommendSection profile={profile} />}
    </div>
  );
}

// ─── Tab: ES・面接回答 ─────────────────────────────────────────────
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
      {!profile && <div style={{ background: "#2a1a0a", border: "1px solid #4a3010", borderRadius: 12, padding: "10px 16px", marginBottom: 16, fontSize: 12, color: "#f59e0b" }}>⚠ 先に「自己分析」タブを実行すると、より精度の高い回答が生成されます</div>}
      <div style={{ background: "#1a1a24", borderRadius: 16, padding: 24, marginBottom: 20, border: "1px solid #2a2a3a" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}><label style={{ fontSize: 12, color: "#9090aa", display: "block", marginBottom: 6 }}>企業名</label><input value={company} onChange={e => setCompany(e.target.value)} placeholder="例：電通、三菱商事" style={inputStyle} /></div>
          <div style={{ flex: 1 }}><label style={{ fontSize: 12, color: "#9090aa", display: "block", marginBottom: 6 }}>業界</label><input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="例：総合商社、広告" style={inputStyle} /></div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: "#9090aa", display: "block", marginBottom: 6 }}>質問文をそのまま貼り付けて <span style={{ color: "#5b5bf0", fontSize: 11 }}>← ここがポイント</span></label>
          <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder={"例：\n「最も困難だったことと、どう乗り越えたかを教えてください。」"} rows={4} style={taStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: "#9090aa", display: "block", marginBottom: 8 }}>出力フォーマット</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {FORMATS.map(f => <button key={f} onClick={() => setFormat(f)} style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: "1px solid", background: format === f ? "#5b5bf0" : "transparent", borderColor: format === f ? "#5b5bf0" : "#2e2e42", color: format === f ? "#fff" : "#9090aa" }}>{f}</button>)}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}><label style={{ fontSize: 12, color: "#9090aa", display: "block", marginBottom: 6 }}>追加メモ（任意）</label><input value={extra} onChange={e => setExtra(e.target.value)} placeholder="例：営業職志望、海外事業部に興味あり" style={inputStyle} /></div>
        <button onClick={generate} disabled={!company || !industry || !question || loading} style={{ width: "100%", padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: company && industry && question && !loading ? "pointer" : "not-allowed", background: company && industry && question && !loading ? "linear-gradient(135deg, #5b5bf0, #8b5cf6)" : "#2a2a3a", color: company && industry && question && !loading ? "#fff" : "#555", border: "none" }}>
          {loading ? "生成中..." : "✦ 回答を生成する"}
        </button>
      </div>
      {(result || loading) && (
        <div style={{ background: "#1a1a24", borderRadius: 16, padding: 24, border: "1px solid #2a2a3a" }}>
          {loading ? <div style={{ color: "#6b6b8a", fontSize: 13 }}>● 質問の意図を読み取って生成中...</div> : (
            <>
              {result.intent && <div style={{ background: "#12122a", border: "1px solid #3a2a6a", borderRadius: 12, padding: "12px 16px", marginBottom: 18 }}><div style={{ fontSize: 10, letterSpacing: 2, color: "#8b5cf6", textTransform: "uppercase", marginBottom: 6 }}>この質問の意図</div><p style={{ margin: 0, fontSize: 13, color: "#b0a8d0", lineHeight: 1.7 }}>{result.intent}</p></div>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><span style={{ fontSize: 12, color: "#9090aa" }}>生成された回答</span><button onClick={() => navigator.clipboard.writeText(result?.answer || "")} style={{ background: "#2a2a3a", border: "1px solid #3a3a52", borderRadius: 8, padding: "5px 12px", fontSize: 11, color: "#9090aa", cursor: "pointer" }}>コピー</button></div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.9, color: "#d8d8ee", whiteSpace: "pre-wrap" }}>{result.answer}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────
export default function App() {
  const [userInput, setUserInput] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState(0);
  const tabs = ["自己分析 & 企業おすすめ", "ES・面接回答"];

  if (!userInput) return <ProfileSetup onComplete={input => { setUserInput(input); setTab(0); }} />;

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f13", color: "#e8e8f0", fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: "28px 16px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 10, letterSpacing: 3, color: "#6b6b8a", textTransform: "uppercase", marginBottom: 4 }}>Job Hunt Tool</div><h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" }}>就活アシスタント</h1></div>
          <button onClick={() => { setUserInput(null); setProfile(null); }} style={{ fontSize: 11, color: "#6b6b8a", background: "transparent", border: "1px solid #2a2a3a", borderRadius: 8, padding: "5px 12px", cursor: "pointer" }}>← 最初から</button>
        </div>
        <div style={{ display: "flex", gap: 4, background: "#1a1a24", borderRadius: 12, padding: 4, marginBottom: 24, border: "1px solid #2a2a3a" }}>
          {tabs.map((t, i) => <button key={t} onClick={() => setTab(i)} style={{ flex: 1, padding: "9px 0", borderRadius: 9, fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: "pointer", border: "none", background: tab === i ? "#5b5bf0" : "transparent", color: tab === i ? "#fff" : "#9090aa", transition: "all 0.2s" }}>{t}</button>)}
        </div>
        {tab === 0 && <AnalysisTab userInput={userInput} onProfileReady={setProfile} />}
        {tab === 1 && <ESTab profile={profile} />}
      </div>
    </div>
  );
}
