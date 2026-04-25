import { useState } from 'react';
import Head from 'next/head';

const s = {
  page: { minHeight: '100vh', background: '#09090b', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif" },
  header: { borderBottom: '1px solid #27272a', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: '#f59e0b', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' },
  subLabel: { color: '#52525b', fontSize: 13, marginLeft: 12 },
  version: { color: '#3f3f46', fontSize: 11 },
  inner: { maxWidth: 680, margin: '0 auto', padding: '48px 24px' },

  // Input
  heading: { fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 12, lineHeight: 1.25 },
  subheading: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.6, marginBottom: 32 },
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 11, fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em' },
  charCount: { fontSize: 11, color: '#3f3f46' },
  textarea: { width: '100%', borderRadius: 12, border: '1px solid #3f3f46', background: '#18181b', padding: '16px 20px', fontSize: 13, color: '#fff', outline: 'none', resize: 'none', lineHeight: 1.6, transition: 'border-color 0.15s' },
  hint: { color: '#3f3f46', fontSize: 11, marginTop: 8, marginBottom: 24 },
  error: { color: '#f87171', fontSize: 13, marginBottom: 16 },

  // Loading
  loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '128px 0', textAlign: 'center' },
  spinner: { width: 40, height: 40, border: '2px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', marginBottom: 24 },
  loadingText: { color: '#d4d4d8', fontWeight: 500, marginBottom: 8 },
  loadingHint: { color: '#52525b', fontSize: 12 },

  // Results
  resultHeader: { marginBottom: 32 },
  resultName: { fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 },
  resultYears: { fontSize: 13, color: '#a1a1aa' },
  resultMeta: { fontSize: 13, color: '#52525b', marginTop: 4 },
  skillGrid: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 },
  card: { background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: '20px 24px', position: 'relative' },
  filmLabel: { fontSize: 11, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 },
  industryLabel: { fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 10 },
  evidence: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.65, marginBottom: 14 },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tag: { fontSize: 11, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 999, padding: '3px 10px' },
  copyBtn: { position: 'absolute', top: 16, right: 16, fontSize: 11, color: '#52525b', background: 'transparent', border: '1px solid #27272a', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' },
  copyBtnDone: { color: '#4ade80', borderColor: '#4ade80' },
  actionsRow: { display: 'flex', gap: 12 },
};

const spinKeyframes = `@keyframes spin { to { transform: rotate(360deg); } }`;

export default function Home() {
  const [step, setStep] = useState('input');
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleTranslate = async () => {
    if (!resumeText.trim()) return;
    setStep('loading');
    setError('');
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Translation failed');
      setResult(data);
      setStep('results');
    } catch (e) {
      setError(e.message);
      setStep('input');
    }
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
          <span style={s.version}>MVP v0.4</span>
        </div>

        <div style={s.inner}>

          {/* ── INPUT ── */}
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
                placeholder={`Maria Rodriguez\nGraphic Designer & Digital Matte Painter\nMontreal, QC\n\nEXPERIENCE\nSenior Matte Painter — Studio XYZ (2018–2024)\n...\n\nPaste your full resume here — the more detail, the richer the translation.`}
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
              />
              <p style={s.hint}>Your text is never stored. It's read once and translated.</p>
              {error && <p style={s.error}>{error}</p>}
              <button onClick={handleTranslate} disabled={!resumeText.trim()} style={btnStyle(resumeText.trim())}>
                Translate my experience →
              </button>
            </div>
          )}

          {/* ── LOADING ── */}
          {step === 'loading' && (
            <div style={s.loadingWrap}>
              <div style={{ ...s.spinner, animation: 'spin 0.8s linear infinite' }} />
              <p style={s.loadingText}>Translating your experience...</p>
              <p style={s.loadingHint}>Reading between the lines of your resume</p>
            </div>
          )}

          {/* ── RESULTS ── */}
          {step === 'results' && result && (
            <div>
              <div style={s.resultHeader}>
                <div style={s.resultName}>{result.name}</div>
                <div style={s.resultYears}>{result.years} of experience</div>
                <div style={s.resultMeta}>{result.skills?.length} transferable skills identified</div>
              </div>

              <div style={s.skillGrid}>
                {result.skills?.map((skill, i) => (
                  <div key={i} style={s.card}>
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
                        <span key={j} style={s.tag}>{ind}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={s.actionsRow}>
                <button
                  onClick={copyAll}
                  style={{ ...btnStyle(true), background: copiedAll ? '#27272a' : '#f59e0b', color: copiedAll ? '#4ade80' : '#000' }}
                >
                  {copiedAll ? 'Copied all skills ✓' : 'Copy all skills'}
                </button>
                <button
                  onClick={() => { setStep('input'); setResult(null); setResumeText(''); }}
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
