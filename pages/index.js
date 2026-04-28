import { useState } from 'react';
import Head from 'next/head';

const s = {
  page: { minHeight: '100vh', background: '#09090b', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif" },
  header: { borderBottom: '1px solid #27272a', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: '#f59e0b', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' },
  subLabel: { color: '#52525b', fontSize: 13, marginLeft: 12 },
  version: { color: '#3f3f46', fontSize: 11 },
  inner: { maxWidth: 680, margin: '0 auto', padding: '48px 24px' },

  heading: { fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 12, lineHeight: 1.25 },
  subheading: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.6, marginBottom: 32 },
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 11, fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em' },
  charCount: { fontSize: 11, color: '#3f3f46' },
  textarea: { width: '100%', borderRadius: 12, border: '1px solid #3f3f46', background: '#18181b', padding: '16px 20px', fontSize: 13, color: '#fff', outline: 'none', resize: 'none', lineHeight: 1.6, transition: 'border-color 0.15s', boxSizing: 'border-box' },
  hint: { color: '#3f3f46', fontSize: 11, marginTop: 8, marginBottom: 24 },
  error: { color: '#f87171', fontSize: 13, marginBottom: 16 },

  loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '128px 0', textAlign: 'center' },
  spinner: { width: 40, height: 40, border: '2px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', marginBottom: 24 },
  loadingText: { color: '#d4d4d8', fontWeight: 500, marginBottom: 8 },
  loadingHint: { color: '#52525b', fontSize: 12 },

  resultHeader: { marginBottom: 32 },
  resultName: { fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 },
  resultYears: { fontSize: 13, color: '#a1a1aa' },
  resultMeta: { fontSize: 13, color: '#52525b', marginTop: 4 },
  skillGrid: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 },
  card: { background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: '20px 24px', position: 'relative' },
  cardPersonal: { background: '#18181b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 16, padding: '20px 24px', position: 'relative' },
  filmLabel: { fontSize: 11, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 },
  industryLabel: { fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 10 },
  evidence: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.65, marginBottom: 14 },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tag: { fontSize: 11, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 999, padding: '3px 10px' },
  tagPersonal: { fontSize: 11, color: '#a78bfa', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 999, padding: '3px 10px' },
  copyBtn: { position: 'absolute', top: 16, right: 16, fontSize: 11, color: '#52525b', background: 'transparent', border: '1px solid #27272a', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' },
  copyBtnDone: { color: '#4ade80', borderColor: '#4ade80' },
  actionsRow: { display: 'flex', gap: 12 },

  surfaceMoreBanner: { background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: '24px', marginBottom: 24, textAlign: 'center' },
  surfaceMoreTitle: { fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 },
  surfaceMoreText: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.6, marginBottom: 20 },

  personalCard: { background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: '20px 24px', marginBottom: 12 },
  personalQ: { fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 },
  personalHint: { fontSize: 11, color: '#52525b', marginBottom: 12 },
  tagPill: { display: 'inline-block', padding: '7px 14px', borderRadius: 999, border: '1px solid #3f3f46', fontSize: 13, color: '#71717a', cursor: 'pointer', margin: '0 6px 6px 0', transition: 'all 0.15s', background: 'transparent' },
  tagPillActive: { display: 'inline-block', padding: '7px 14px', borderRadius: 999, border: '1px solid rgba(245,158,11,0.5)', fontSize: 13, color: '#f59e0b', cursor: 'pointer', margin: '0 6px 6px 0', background: 'rgba(245,158,11,0.08)' },

  deeperToggle: { fontSize: 12, color: '#52525b', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', marginBottom: 24, display: 'block' },
  sectionDivider: { borderTop: '1px solid #27272a', margin: '32px 0', paddingTop: 32 },
  personalBadge: { fontSize: 10, color: '#a78bfa', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 999, padding: '2px 8px', marginBottom: 6, display: 'inline-block' },
};

const spinKeyframes = `@keyframes spin { to { transform: rotate(360deg); } }`;

const FREE_TIME = ['building / making','cooking / baking','drawing / painting','fixing / restoring','sewing / crafting','gardening','parenting / caregiving','teaching / mentoring','organizing / planning','photography / video','music','writing'];
const ROLES = ['organizer','problem-solver','explainer','finisher','creative one','calm one','connector','detail-checker'];
const GOOD_AT = ['staying calm under pressure','seeing what others miss','explaining complex things simply','finishing what others abandon','making things look right','keeping everyone on track','juggling many things at once','knowing when something is done'];
const MARKET = ['contracting fast','shifting, not disappearing','real opportunities if you look','honestly don\'t know','need to pivot entirely'];

export default function Home() {
  const [step, setStep] = useState('input');
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [deeperMode, setDeeperMode] = useState(false);

  const [freeTime, setFreeTime] = useState([]);
  const [groupRole, setGroupRole] = useState([]);
  const [goodAt, setGoodAt] = useState([]);
  const [marketRead, setMarketRead] = useState([]);
  const [projectPersonal, setProjectPersonal] = useState('');
  const [projectWork, setProjectWork] = useState('');
  const [dependants, setDependants] = useState('');
  const [deepFalling, setDeepFalling] = useState('');
  const [deepTeach, setDeepTeach] = useState('');
  const [deepInvisible, setDeepInvisible] = useState('');
  const [deepMarket, setDeepMarket] = useState('');

  const toggleTag = (val, arr, setArr) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const hasPersonalContent = () => {
    if (deeperMode) return deepFalling.trim() || projectPersonal.trim() || projectWork.trim() || deepTeach.trim() || deepInvisible.trim() || deepMarket.trim();
    return freeTime.length > 0 || groupRole.length > 0 || goodAt.length > 0 || marketRead.length > 0 || projectPersonal.trim() || projectWork.trim() || dependants.trim();
  };

  const buildPersonalContext = () => {
    if (deeperMode) {
      const parts = [];
      if (deepFalling.trim()) parts.push(`When everything was falling apart, I held it together by: ${deepFalling}`);
      if (projectPersonal.trim()) parts.push(`A project I drove start to finish outside work: ${projectPersonal}`);
      if (projectWork.trim()) parts.push(`A work project where I had to figure it out as I went: ${projectWork}`);
      if (deepTeach.trim()) parts.push(`A time I taught someone something: ${deepTeach}`);
      if (deepInvisible.trim()) parts.push(`Something I do regularly that nobody notices but everything would fall apart without it: ${deepInvisible}`);
      if (deepMarket.trim()) parts.push(`How I read what's happening in my field right now: ${deepMarket}`);
      return parts.join('\n\n');
    }
    const parts = [];
    if (freeTime.length > 0) parts.push(`What I do in my free time: ${freeTime.join(', ')}`);
    if (groupRole.length > 0) parts.push(`In a group I naturally become the: ${groupRole.join(', ')}`);
    if (goodAt.length > 0) parts.push(`People who know me would say I'm remarkably good at: ${goodAt.join(', ')}`);
    if (projectPersonal.trim()) parts.push(`A project I drove start to finish (paid or not): ${projectPersonal}`);
    if (projectWork.trim()) parts.push(`A work project where I had to figure it out as I went: ${projectWork}`);
    if (marketRead.length > 0) parts.push(`How I read what's happening in my field right now: ${marketRead.join(', ')}`);
    if (dependants.trim()) parts.push(`Managing dependants looks like: ${dependants}`);
    return parts.join('\n\n');
  };

  const handleTranslate = async (personalContext = null) => {
    setStep(personalContext ? 'enriching' : 'loading');
    setError('');
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, personalContext }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Translation failed');
      setResult(data);
      setStep('results');
    } catch (e) {
      setError(e.message);
      setStep(personalContext ? 'personal' : 'input');
    }
  };

  const handleEnrich = () => {
    const ctx = buildPersonalContext();
    if (ctx) handleTranslate(ctx);
  };

  const copyAll = () => {
    const text = result.skills.map(s =>
      `${s.industryLabel}\n${s.evidence}\nBest for: ${s.industries.join(', ')}`
    ).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const copyOne = (i, skill) => {
    navigator.clipboard.writeText(`${skill.industryLabel}\n${skill.evidence}`);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const btnStyle = (active) => ({
    width: '100%', padding: '14px 0', borderRadius: 12, fontWeight: 600, fontSize: 14,
    border: 'none', cursor: active ? 'pointer' : 'not-allowed',
    background: active ? '#f59e0b' : '#27272a',
    color: active ? '#000' : '#52525b',
    transition: 'background 0.15s',
  });

  const Tag = ({ val, arr, setArr }) => {
    const active = arr.includes(val);
    return (
      <span
        style={active ? s.tagPillActive : s.tagPill}
        onClick={() => toggleTag(val, arr, setArr)}
      >
        {val}
      </span>
    );
  };

  return (
    <>
      <Head>
        <title>Surface — The Translator</title>
        <meta name="description" content="Translate your film and creative experience into language any hiring manager can read." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <style>{spinKeyframes}</style>

      <div style={s.page}>
        <div style={s.header}>
          <div>
            <span style={s.logo}>Surface</span>
            <span style={s.subLabel}>The Translator</span>
          </div>
          <span style={s.version}>MVP v0.5</span>
        </div>

        <div style={s.inner}>

          {/* INPUT */}
          {step === 'input' && (
            <div>
              <h1 style={s.heading}>Your experience,<br />now legible.</h1>
              <p style={s.subheading}>
                Paste your resume below. Surface translates everything you've done into language any hiring manager can recognize — in under 60 seconds.
              </p>
              <div style={s.labelRow}>
                <span style={s.label}>Paste your resume</span>
                <span style={s.charCount}>{resumeText.length > 0 ? `${resumeText.length} characters` : ''}</span>
              </div>
              <textarea
                style={{ ...s.textarea, borderColor: resumeText.trim() ? '#52525b' : '#3f3f46' }}
                rows={14}
                placeholder={`Name Last Name\nJob Title & Industry\nCity, Province\n\nEXPERIENCE\nSenior Role — Studio or Company (2018–2024)\n...\n\nPaste your full resume here — the more detail, the richer the translation.`}
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
              />
              <p style={s.hint}>Your text is never stored. It's read once and translated.</p>
              {error && <p style={s.error}>{error}</p>}
              <button onClick={() => handleTranslate()} disabled={!resumeText.trim()} style={btnStyle(resumeText.trim())}>
                Translate my experience →
              </button>
            </div>
          )}

          {/* LOADING */}
          {step === 'loading' && (
            <div style={s.loadingWrap}>
              <div style={{ ...s.spinner, animation: 'spin 0.8s linear infinite' }} />
              <p style={s.loadingText}>Translating your experience...</p>
              <p style={s.loadingHint}>Reading between the lines of your resume</p>
            </div>
          )}

          {/* ENRICHING */}
          {step === 'enriching' && (
            <div style={s.loadingWrap}>
              <div style={{ ...s.spinner, animation: 'spin 0.8s linear infinite' }} />
              <p style={s.loadingText}>Surfacing the full picture...</p>
              <p style={s.loadingHint}>Connecting your life experience to your professional skills</p>
            </div>
          )}

          {/* PERSONAL QUESTIONS */}
          {step === 'personal' && (
            <div>
              <h1 style={{ ...s.heading, fontSize: 24 }}>Tell us more about you.</h1>
              <p style={s.subheading}>
                Your resume shows what you were paid to do. This surfaces everything else that counts — and connects it to your professional skills.
              </p>

              <button style={s.deeperToggle} onClick={() => setDeeperMode(!deeperMode)}>
                {deeperMode ? '← Back to quick version' : 'Go deeper with storytelling prompts'}
              </button>

              {!deeperMode && (
                <div>
                  <div style={s.personalCard}>
                    <p style={s.personalQ}>What do you do in your free time?</p>
                    <p style={s.personalHint}>Select all that apply</p>
                    <div>{FREE_TIME.map(v => <Tag key={v} val={v} arr={freeTime} setArr={setFreeTime} />)}</div>
                  </div>

                  <div style={s.personalCard}>
                    <p style={s.personalQ}>In a group, you naturally become the...</p>
                    <div>{ROLES.map(v => <Tag key={v} val={v} arr={groupRole} setArr={setGroupRole} />)}</div>
                  </div>

                  <div style={s.personalCard}>
                    <p style={s.personalQ}>People who know you well would say you're remarkably good at...</p>
                    <div>{GOOD_AT.map(v => <Tag key={v} val={v} arr={goodAt} setArr={setGoodAt} />)}</div>
                  </div>

                  <div style={s.personalCard}>
                    <p style={s.personalQ}>Tell me about a project you drove start to finish — paid or not.</p>
                    <p style={s.personalHint}>Personal life counts here. Furniture, home, kids, community — all of it.</p>
                    <textarea
                      style={{ ...s.textarea, borderColor: '#3f3f46' }}
                      rows={3}
                      placeholder="What was it, and how did you approach it..."
                      value={projectPersonal}
                      onChange={e => setProjectPersonal(e.target.value)}
                    />
                  </div>

                  <div style={s.personalCard}>
                    <p style={s.personalQ}>Tell me about a project at work where you had to figure it out as you went — no clear brief, no obvious answer.</p>
                    <textarea
                      style={{ ...s.textarea, borderColor: '#3f3f46' }}
                      rows={3}
                      placeholder="What was unclear, and how did you move forward anyway..."
                      value={projectWork}
                      onChange={e => setProjectWork(e.target.value)}
                    />
                  </div>

                  <div style={{ ...s.personalCard, border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p style={s.personalQ}>How do you read what's happening in your field right now?</p>
                    <div>{MARKET.map(v => <Tag key={v} val={v} arr={marketRead} setArr={setMarketRead} />)}</div>
                  </div>

                  <div style={s.personalCard}>
                    <p style={s.personalQ}>If you have kids or anyone depending on you — what does managing that actually look like?</p>
                    <p style={s.personalHint}>Optional — skip if not relevant</p>
                    <textarea
                      style={{ ...s.textarea, borderColor: '#3f3f46' }}
                      rows={3}
                      placeholder="Day to day, not the highlight reel..."
                      value={dependants}
                      onChange={e => setDependants(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {deeperMode && (
                <div>
                  <div style={s.personalCard}>
                    <p style={s.personalQ}>Tell me about a time when everything was falling apart and you held it together anyway.</p>
                    <textarea style={{ ...s.textarea, borderColor: '#3f3f46' }} rows={4} placeholder="What was happening, and what did holding it together actually look like..." value={deepFalling} onChange={e => setDeepFalling(e.target.value)} />
                  </div>
                  <div style={s.personalCard}>
                    <p style={s.personalQ}>Tell me about a project you drove start to finish — paid or not.</p>
                    <p style={s.personalHint}>Personal life counts here. Furniture, home, kids, community — all of it.</p>
                    <textarea style={{ ...s.textarea, borderColor: '#3f3f46' }} rows={4} placeholder="From the moment you decided to start..." value={projectPersonal} onChange={e => setProjectPersonal(e.target.value)} />
                  </div>
                  <div style={s.personalCard}>
                    <p style={s.personalQ}>Tell me about a project at work where you had to figure it out as you went.</p>
                    <textarea style={{ ...s.textarea, borderColor: '#3f3f46' }} rows={4} placeholder="What was unclear, and how did you move forward anyway..." value={projectWork} onChange={e => setProjectWork(e.target.value)} />
                  </div>
                  <div style={s.personalCard}>
                    <p style={s.personalQ}>Think of a time you taught someone something. How did you figure out how to explain it?</p>
                    <textarea style={{ ...s.textarea, borderColor: '#3f3f46' }} rows={4} placeholder="What did you have to unlearn to teach it clearly..." value={deepTeach} onChange={e => setDeepTeach(e.target.value)} />
                  </div>
                  <div style={s.personalCard}>
                    <p style={s.personalQ}>What's something you do regularly that nobody notices — but everything would fall apart without it?</p>
                    <textarea style={{ ...s.textarea, borderColor: '#3f3f46' }} rows={4} placeholder="The invisible work..." value={deepInvisible} onChange={e => setDeepInvisible(e.target.value)} />
                  </div>
                  <div style={{ ...s.personalCard, border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p style={s.personalQ}>How do you read what's happening in your field right now — and where do you think the real opportunities are?</p>
                    <textarea style={{ ...s.textarea, borderColor: '#3f3f46' }} rows={4} placeholder="Your honest take, not the polished version..." value={deepMarket} onChange={e => setDeepMarket(e.target.value)} />
                  </div>
                </div>
              )}

              {error && <p style={s.error}>{error}</p>}

              <div style={{ ...s.actionsRow, marginTop: 24 }}>
                <button onClick={handleEnrich} disabled={!hasPersonalContent()} style={btnStyle(hasPersonalContent())}>
                  Surface the full picture →
                </button>
                <button
                  onClick={() => setStep('results')}
                  style={{ ...btnStyle(true), background: '#27272a', color: '#a1a1aa' }}
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {/* RESULTS */}
          {step === 'results' && result && (
            <div>
              <div style={s.resultHeader}>
                <div style={s.resultName}>{result.name}</div>
                <div style={s.resultYears}>{result.years} of experience</div>
                <div style={s.resultMeta}>{result.skills?.length} transferable skills identified</div>
              </div>

              <div style={s.skillGrid}>
                {result.skills?.map((skill, i) => (
                  <div key={i} style={skill.source === 'personal' ? s.cardPersonal : s.card}>
                    {skill.source === 'personal' && <span style={s.personalBadge}>surfaced from your life</span>}
                    <button
                      style={{ ...s.copyBtn, ...(copiedIndex === i ? s.copyBtnDone : {}) }}
                      onClick={() => copyOne(i, skill)}
                    >
                      {copiedIndex === i ? 'Copied' : 'Copy'}
                    </button>
                    <p style={s.filmLabel}>{skill.filmLabel}</p>
                    <p style={s.industryLabel}>{skill.industryLabel}</p>
                    <p style={s.evidence}>{skill.evidence}</p>
                    <div style={s.tagRow}>
                      {skill.industries?.map((ind, j) => (
                        <span key={j} style={skill.source === 'personal' ? s.tagPersonal : s.tag}>{ind}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {!result.hasPersonalContext && (
                <div style={s.surfaceMoreBanner}>
                  <p style={s.surfaceMoreTitle}>There's more to your story.</p>
                  <p style={s.surfaceMoreText}>
                    Your resume shows what you were paid to do. Surface can also translate your life experience — DIY projects, parenting, caregiving, anything you've built or managed outside of work — into professional competencies hiring managers recognize.
                  </p>
                  <button onClick={() => setStep('personal')} style={{ ...btnStyle(true), maxWidth: 320, margin: '0 auto' }}>
                    Tell us more about you →
                  </button>
                </div>
              )}

              <div style={s.actionsRow}>
                <button
                  onClick={copyAll}
                  style={{ ...btnStyle(true), background: copiedAll ? '#27272a' : '#f59e0b', color: copiedAll ? '#4ade80' : '#000' }}
                >
                  {copiedAll ? 'Copied all skills ✓' : 'Copy all skills'}
                </button>
                <button
                  onClick={() => { setStep('input'); setResult(null); setResumeText(''); setFreeTime([]); setGroupRole([]); setGoodAt([]); setMarketRead([]); setProjectPersonal(''); setProjectWork(''); setDependants(''); setDeepFalling(''); setDeepTeach(''); setDeepInvisible(''); setDeepMarket(''); }}
                  style={{ ...btnStyle(true), background: '#27272a', color: '#a1a1aa' }}
                >
                  Start over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
