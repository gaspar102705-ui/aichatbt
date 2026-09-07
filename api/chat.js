export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const conversation = req.body.messages;
  const apiKey = process.env.GROQ_API_KEY; 

  // 1. Check if Vercel loaded the API key
  if (!apiKey) {
    return res.status(200).json({ reply: "ERROR: The GROQ_API_KEY is missing from Vercel." });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      model: 'openai/gpt-oss-20b',
        messages: conversation
      })
    });
    
    const data = await groqRes.json();
    
    // 2. Check if Groq rejected the key or payload
    if (!groqRes.ok) {
      return res.status(200).json({ reply: `GROQ API ERROR: ${data.error?.message || 'Unknown error'}` });
    }
    
    // 3. Success
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (error) {
    // 4. Check for code syntax crashes
    res.status(200).json({ reply: `SERVER ERROR: ${error.message}` });
  }
}