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
  "skills": [
    {
      "filmLabel": "what they called it on their resume",
      "industryLabel": "what employers in other industries call it",
      "evidence": "one specific sentence proving this using their actual experience, projects, or timeline from the resume",
      "industries": ["Specific Industry 1", "Specific Industry 2", "Specific Industry 3"]
    }
  ]
}

Rules:
- Extract 8 to 12 skills minimum
- Be specific — avoid generic terms like "teamwork" or "communication"
- The evidence sentence must reference real details from their resume — years, project names, team sizes, outputs
- Industry tags must be specific: "UX/UI Design" not just "Tech", "Architectural Visualization" not just "Design"
- Think unconventionally — surface skills they would never think to list, including leadership, teaching, and emotional resilience
- If parenting, caregiving, or volunteer work appears, include those competencies too`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { resumeText } = req.body;

  if (!resumeText || !resumeText.trim()) {
    return res.status(400).json({ error: 'Resume text is required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: `Here is my resume:\n\n${resumeText}\n\nExtract and translate my transferable skills into language that works outside my current industry. Think beyond the obvious — include every real capability, leadership skills, and anything non-traditional that appears.`
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
