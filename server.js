const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const API_KEY = process.env.OPENAI_API_KEY;

app.get('/', (req, res) => {
  res.send("✅ OpenAI Proxy is working!");
});

app.post('/generate', async (req, res) => {
  const { topic } = req.body;

  if (!topic) return res.status(400).json({ error: "Topic is required" });

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: `Generate 5 SEO blog titles for: "${topic}"`,
        max_tokens: 150,
        temperature: 0.8
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ result: response.data.choices[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
