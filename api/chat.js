export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const conversation = req.body.messages; // Now receiving the full chat history
  const apiKey = process.env.GROQ_API_KEY; 

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', 
        messages: conversation // Passing the full history to the AI
      })
    });
    
    const data = await groqRes.json();
    
    if (data.error) throw new Error(data.error.message);
    
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
}