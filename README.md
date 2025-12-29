# PastorBuddy 🕊️

An AI-powered sermon assistant built with React, Node.js, and OpenAI.

## Features
- Scripture-based sermon generation
- Pastor-friendly language and theological tone
- Deployed with Vercel (frontend) and Render (backend)

## Try It Live
👉 https://pastorbuddy.vercel.app

## Tech Stack
- React + Create React App
- Node.js + Express
- OpenAI API (GPT-4o / GPT-3.5)

## Local development

### Prereqs
- Node.js 18+
- OpenAI API key

### Setup
```bash
git clone https://github.com/paulfmilne/pastorbuddy.git
cd pastorbuddy

# install deps
npm install --prefix server
npm install --prefix client

# set env
cp server/.env.example server/.env
cp client/.env.example client/.env
# edit the copied files with your values
```

Minimum required env:
- `server/.env`: `OPENAI_API_KEY=sk-...` (and optionally `PORT=5050`)
- `client/.env`: `REACT_APP_API_URL=http://localhost:5050`

### Run
```bash
# terminal 1
npm run start --prefix server

# terminal 2
npm start --prefix client
```
Frontend: http://localhost:3000 (CRA).  
Backend: http://localhost:5050 (Express).

### Notes
- The client streams responses from `/api/sermon`.
- Backend uses `gpt-4o` by default; change in `server/server.js` if needed.
- A helper script `server/list-models.js` lists available models with your key.
