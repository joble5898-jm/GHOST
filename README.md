# GHOST - Autonomous AI Agent for WhatsApp Lead Resurrection

GHOST is an autonomous AI agent that lives inside WhatsApp and hunts down every abandoned conversation.

## Deployment to Vercel

1. **Push to GitHub**: Push this repository to your GitHub account.
2. **Import to Vercel**: Go to [Vercel](https://vercel.com) and import the project.
3. **Environment Variables**: Add the following environment variable in the Vercel project settings:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
4. **Build Settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion
- **AI**: Google Gemini 3 Flash
- **Icons**: Lucide React
