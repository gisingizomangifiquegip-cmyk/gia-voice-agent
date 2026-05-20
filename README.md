# GIA — Global Intelligent Advisor
### AI Voice Agent for Global Institute of People LLC — Rwanda

---

## 🚀 Deploy to Vercel (5 Minutes)

### Prerequisites
- [Vercel account](https://vercel.com) (free)
- [Anthropic API key](https://console.anthropic.com)
- [GitHub account](https://github.com)

---

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: GIA Voice Agent"
git remote add origin https://github.com/YOUR_USERNAME/gia-voice-agent.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Framework: **Vite** (auto-detected)
4. Click **Deploy**

### Step 3 — Add Environment Variable

In your Vercel project dashboard:
1. Go to **Settings → Environment Variables**
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-...` (your Anthropic API key)
3. Click **Save**
4. Go to **Deployments → Redeploy** (required for env vars to take effect)

---

## 🎤 Features

- **Voice Input** — Click the microphone to speak in English, French, or Kinyarwanda
- **Voice Output** — GIA speaks responses aloud (toggle with 🔊 button)
- **Text Chat** — Type questions if voice isn't available
- **Quick Prompts** — One-tap common questions
- **Language Switcher** — EN / FR / RW
- **Fully Rwanda-focused** — Knows local context: MTN MoMo, Airtel Money, Kigali tech scene, Vision 2050

## 🔒 Security

The Anthropic API key is **never exposed to the browser**. All calls go through the `/api/proxy` Vercel Edge Function.

## 🌍 Rwanda Context

GIA is trained specifically for Rwanda:
- Payment via **MTN MoMo** and **Airtel Money**
- References to **Kigali Innovation City** and **Smart Rwanda**
- Kinyarwanda language support
- Rwanda Vision 2050 tech ecosystem awareness

---

*Built for Global Institute of People LLC — Rwanda*
