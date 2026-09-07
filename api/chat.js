export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const userMessage = req.body.message;
  const apiKey = process.env.GROQ_API_KEY; // Pulled securely from Vercel

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Fast, free Llama 3 model
        messages: [{ role: 'user', content: userMessage }]
      })
    });
    
    const data = await groqRes.json();
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
}