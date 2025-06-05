# 🧞‍♂️ Genie Assistant
![CI](https://github.com/fahrnbach/genie-assistant/actions/workflows/ci.yml/badge.svg)

## 🧪⚠️ This Project is still experimental. You may experience a few quirks

A magical riddle-locked AI chat assistant — ask it 3 questions and discover Jacob Fahrnbach's work... or fork it for your own.

---

## ✍️ How to Customize Genie AI: Writing Chunks ![Docs](https://img.shields.io/badge/chunking-guide-blueviolet?style=flat-square)

To personalize what the Genie knows, just add your own content as `.md`, `.txt`, or `.html` files to:

```
data/chunks/
```

Each file is split into smaller pieces (“chunks”) and converted into vector embeddings used for RAG (Retrieval-Augmented Generation).

Then run:

```bash
npm run embed
```

This regenerates `utils/embeddings/data.json` and logs the time in `last-embed.log`. Your Genie is now smarter ✨

### 🧠 Chunk Writing Tips

✅ **Be concise** — short paragraphs (under ~300 tokens) are ideal for embedding.  
✅ **Stick to one topic per paragraph** to help the model retrieve the right info.  
✅ **Avoid too much formatting** — plain language works best.  
✅ **Use headings** (e.g. `## Project Name`) for clarity and searchability.  
✅ **Test with sample questions** to see if your chunks are retrieved effectively.  

---

## 🔑 Requirements

| Variable         | Description                              |
|------------------|------------------------------------------|
| `OPENAI_API_KEY` | Required. For GPT + embeddings API.      |
| `REDIS_URL`      | Optional. Used for wish count limits.    |

Create a `.env` file with:
```env
OPENAI_API_KEY=your-key-here
# Optional:
REDIS_URL=your-redis-url-here
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/fahrnbach/genie-assistant.git
cd genie-assistant
npm install
npm run start  # Starts both frontend and backend
```

- Frontend → http://localhost:5173  
- API Backend → http://localhost:3000

---

## 🔧 Customizing the Assistant

You can personalize Genie via `askRAG()` options:

| Option          | Type   | Purpose                            |
|-----------------|--------|------------------------------------|
| `personaPrompt` | string | Sets the system prompt / voice     |
| `resumeLink`    | string | Resume/portfolio URL for CTA       |
| `calendlyLink`  | string | Contact scheduling link            |

Example:
```js
await askRAG(prompt, {
  personaPrompt: "You are a witty AI mentor named Astra ✨...",
  resumeLink: 'https://myresume.link',
  calendlyLink: 'https://calendly.com/myname'
});
```

---

## 📜 NPM Scripts Overview

| Script               | Description                                                  |
|----------------------|--------------------------------------------------------------|
| `npm run start`      | Starts both frontend (Vite) and backend (Express)            |
| `npm run dev`        | Starts only the frontend in dev mode                         |
| `npm run start-server` | Starts only the backend API server                         |
| `npm run build`      | Builds frontend into `/dist`                                 |
| `npm run preview`    | Runs a production preview from `dist/`                       |
| `npm run embed`      | Builds a new embedding DB from `/chunks` input files         |
| `npm run copy-html`  | Copies the demo index.html to `/dist` for preview support    |

---

## 🧠 Embedding New Data

Put `.md`, `.txt`, or `.html` files into `/utils/chunks/`, then run:

```bash
npm run embed
```

This creates `utils/embeddings/data.json`, which is used for RAG context.

---

## 🔍 Why Copy `index.html` for Preview?

When building this project as a library using Vite, the `build` step does **not** include a demo HTML file by default.

To preview the final bundled assistant UI:

```bash
npm run copy-html
npm run preview
```

> ✅ Works cross-platform using `shx`

🎯 **Pro tip**: `vite preview` is like a mini production server — it shows you exactly what your site will look like *after deploy*.

---

## 🛠️ Future Improvements

Here are some ideas for future upgrades:

- 🔄 Use LangChain to manage retrieval, prompt construction, and model calls  
- 🧠 Switch to a full vector store like Chroma or Weaviate  
- ✨ Support multiple personas and switching themes  
- 🛡️ Add token/session auth or more advanced user controls  
- 📊 Visualize embedding coverage and chunk search relevance  

---

## 🤝 Contribute

Fork it, customize your own Genie, or submit a PR!

Made with ✨ by [Jacob Fahrnbach](https://fahrnbach.one)
