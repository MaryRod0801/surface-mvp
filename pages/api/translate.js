const SYSTEM_PROMPT = `You are a career translation expert specializing in helping creative and film industry professionals reframe their experience for new industries.

When given a resume, you will:
1. Extract core transferable skills — not job titles, but actual capabilities
2. Translate each skill into language that hiring managers outside their current industry understand
3. Add an evidence sentence that proves the claim using their specific experience, years, or projects from the resume
4. Tag which industries or roles would value each skill most

Return ONLY a valid JSON object. No preamble, no markdown, no explanation. Just the raw JSON.

Format:
{
  "name": "first name only, from the resume",
  "years": "total years of professional experience as a string e.g. '16 years'",
  "hasPersonalContext": false,
  "skills": [
    {
      "filmLabel": "what they called it on their resume",
      "industryLabel": "what employers in other industries call it",
      "evidence": "one specific sentence proving this using their actual experience, projects, or timeline from the resume",
      "industries": ["Specific Industry 1", "Specific Industry 2", "Specific Industry 3"],
      "source": "resume"
    }
  ]
}

Rules:
- Extract 8 to 12 skills minimum
- Be specific — avoid generic terms like "teamwork" or "communication"
- The evidence sentence must reference real details from their resume — years, project names, team sizes, outputs
- Industry tags must be specific: "UX/UI Design" not just "Tech", "Architectural Visualization" not just "Design"
- Think unconventionally — surface skills they would never think to list, including leadership, teaching, and emotional resilience
- If parenting, caregiving, or volunteer work appears, include those competencies too
- Set "source": "resume" for all skills when no personal context is provided`;

const SYSTEM_PROMPT_WITH_PERSONAL = `You are a career translation expert specializing in helping creative and film industry professionals reframe their experience for new industries.

You have been given both a resume AND personal life context. Your job is to translate both layers into professional competencies — treating personal experience with the same weight as paid work.

Return ONLY a valid JSON object. No preamble, no markdown, no explanation. Just the raw JSON.

Format:
{
  "name": "first name only, from the resume",
  "years": "total years of professional experience as a string e.g. '16 years'",
  "hasPersonalContext": true,
  "skills": [
    {
      "filmLabel": "what they called it on their resume or life",
      "industryLabel": "what employers in other industries call it",
      "evidence": "one specific sentence proving this using their actual experience, projects, or timeline",
      "industries": ["Specific Industry 1", "Specific Industry 2", "Specific Industry 3"],
      "source": "resume or personal"
    }
  ]
}

Rules for resume skills:
- Extract 8 to 12 skills from the resume
- Be specific — avoid generic terms like "teamwork" or "communication"
- Evidence must reference real resume details — years, project names, team sizes, outputs
- Set "source": "resume"

Rules for personal skills:
- Extract 3 to 5 additional skills from the personal context
- Treat these as professional competencies stated as fact — never introduce them as "things I learned from parenting" or "from my hobby"
- Connect personal skills to professional ones where genuine overlap exists
- Only include personal skills where the transfer is genuine — do not stretch connections that are not there
- Set "source": "personal"

Industry tags must be specific: "UX/UI Design" not "Tech", "Architectural Visualization" not "Design"
Think unconventionally — surface skills the user would never think to list`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { resumeText, personalContext } = req.body;

  if (!resumeText || !resumeText.trim()) {
    return res.status(400).json({ error: 'Resume text is required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const systemPrompt = personalContext ? SYSTEM_PROMPT_WITH_PERSONAL : SYSTEM_PROMPT;

  const userMessage = personalContext
    ? `Here is my resume:\n\n${resumeText}\n\n---\n\nHere is my personal life context:\n\n${personalContext}\n\n---\n\nExtract and translate my transferable skills from both my resume and my personal life. Think beyond the obvious — surface every real capability. Personal experience is professional experience — treat it that way.`
    : `Here is my resume:\n\n${resumeText}\n\nExtract and translate my transferable skills into language that works outside my current industry. Think beyond the obvious — include every real capability, leadership skills, and anything non-traditional that appears.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: userMessage
        }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err?.error?.message || 'Claude API error' });
    }

    const data = await response.json();
    const raw = data.content?.find(b => b.type === 'text')?.text || '{}';
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
