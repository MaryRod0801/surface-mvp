# Deploy Surface Translator to Vercel

## What this is
A Next.js app. Your API key lives server-side — it's never exposed in the browser.

## Steps

### 1. Install dependencies (run once on your machine)
```
cd surface-translator
npm install
```

### 2. Test locally (optional but recommended)
```
cp .env.example .env.local
# Open .env.local and paste your Anthropic API key
npm run dev
# Open http://localhost:3000
```

### 3. Push to GitHub
- Create a new repo at github.com (call it `surface-translator`)
- Then in this folder:
```
git init
git add .
git commit -m "Surface Translator MVP"
git remote add origin https://github.com/YOUR_USERNAME/surface-translator.git
git push -u origin main
```

### 4. Deploy to Vercel
1. Go to vercel.com → New Project
2. Import your `surface-translator` GitHub repo
3. In the Environment Variables section, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key
4. Click Deploy

Done. Vercel gives you a URL to share.

## Your Anthropic API key
Get one at: https://console.anthropic.com/settings/keys
