Session
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
// server/demo-server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { askRAG } from './rag.js';
import { verifyRiddle } from './riddles.js';
import { getWishCount, incrementWishCount, hasRemainingWishes } from './session.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// --- Route: /verify
app.post('/verify', (req, res) => {
  const { answer } = req.body;
  const correct = verifyRiddle(answer);
  return res.json({ correct });
});

// --- Route: /ask
app.post('/ask', async (req, res) => {
  const { prompt } = req.body;
  const sessionId = req.ip || 'anonymous';

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const current = await getWishCount(sessionId);

    if (!hasRemainingWishes(current)) {
      return res.json({
        reply: "🧞‍♂️ That's 3 wishes, friend! If you'd like to know more, contact the conjurer 👉 https://fahrnbach.one"
      });
    }

    await incrementWishCount(sessionId);
    const reply = await askRAG(prompt);
    return res.json({ reply });

  } catch (err) {
    console.error('RAG error:', err);
    return res.status(500).json({ error: 'Error generating reply.' });
  }
});

app.listen(port, () => {
  console.log(`🧞‍♂️ Genie demo server running at http://localhost:${port}`);
});

