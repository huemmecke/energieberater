# die energieweiser – KI-Energieberater

Website und UI-Design-System als zwei getrennte Preview-Bereiche.

## Zwei Previews starten

**Terminal 1 – Website:**
```bash
npm run dev:website
```
→ http://localhost:5173/

**Terminal 2 – UI-Set:**
```bash
npm run dev:ui
```
→ http://localhost:5174/ui.html

Beide können parallel laufen.

## Gemini API

```bash
cp .env.example .env.local
# GEMINI_API_KEY eintragen
```

Key: https://aistudio.google.com/apikey

## Auf Vercel deployen (MVP)

### Voraussetzungen
- Vercel-Account: https://vercel.com
- Gemini API Key aus Google AI Studio
- Projekt auf GitHub (empfohlen) oder Vercel CLI

### Schritt 1: Repository verbinden
1. Code auf GitHub pushen
2. In Vercel: **Add New → Project** → Repository auswählen
3. Framework Preset: **Other** (Vite, kein Next.js)
4. Build Command: `npm run build` (steht auch in `vercel.json`)
5. Output Directory: `dist`

### Schritt 2: Umgebungsvariable setzen
In Vercel unter **Project → Settings → Environment Variables**:

| Name | Wert |
|------|------|
| `GEMINI_API_KEY` | Ihr Key aus AI Studio |

Für Production, Preview und Development aktivieren.

### Schritt 3: Deploy
Nach dem ersten Deploy sind erreichbar:
- `/` – Startseite
- `/berater` oder `/berater.html` – KI-Berater
- `/checkliste` oder `/checkliste.html` – Checkliste
- `/api/chat` – Gemini-Backend (Serverless Function)

### Alternative: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
# Beim ersten Mal GEMINI_API_KEY als Secret setzen:
vercel env add GEMINI_API_KEY
vercel --prod
```

### Hinweise
- Der API Key liegt **nur** auf dem Server (Vercel Env), nie im Frontend
- `api/chat.ts` nutzt dieselbe Logik wie der lokale Dev-Server
- Bei Quota-Fehlern greift der lokale Fallback im Browser

## Design System

| Element | Quelle |
|---------|--------|
| Schrift | [BioRhyme](https://fonts.google.com/specimen/BioRhyme) |
| Farbe | `#1c2f76` Navy |
| Logo | `assets/ewe_logo_light_landscape.svg` |
| Pfeil-Bullets | `ewe_arrow_regular.svg` (klein) / `ewe_arrow_light.svg` (groß) |
| Klimastreifen | Warming Stripes als schmaler Footer-Streifen |

UI-Komponenten: `src/components/ui/`
