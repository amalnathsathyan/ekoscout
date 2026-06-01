# EkoScout Deployment Guide

This guide will walk you through deploying the EkoScout MVP across all the free-tier services chosen in the architecture.

## 1. Gather API Keys & Environment Setup
First, copy the template and fill in the values:
\`\`\`bash
cp .env.example .env
\`\`\`
- **Gemini**: Get a free API key from [Google AI Studio](https://aistudio.google.com/).
- **CoinMarketCap**: Get a free tier key from [CoinMarketCap Developer Portal](https://coinmarketcap.com/api/).
- **Discord/Telegram**: Create a Discord Webhook in your server settings, and talk to BotFather on Telegram to get a bot token.

## 2. Supabase Setup (Database)
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Go to the SQL Editor and paste the contents of `supabase/migrations/20260601000000_init.sql` and click **Run**.
3. Go to Project Settings -> API and copy the `Project URL` and `anon public` key. Put these in your `.env` file.

## 3. Deploy Backend to Google Cloud Run
1. Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
2. Authenticate: \`gcloud auth login\`
3. Set your project: \`gcloud config set project [YOUR-PROJECT-ID]\`
4. Deploy using the included Cloud Build config:
   \`\`\`bash
   gcloud builds submit --config cloudbuild.yaml
   \`\`\`
5. In the Cloud Run console, make sure to set your **Environment Variables** (from your `.env` file).

## 4. Deploy Dashboard to Cloudflare Pages
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) -> Pages.
2. Connect your GitHub repository (`amalnathsathyan/ekoscout`).
3. Set the build settings:
   - Framework preset: **Vite**
   - Build command: \`npm run build\`
   - Build output directory: \`dist\`
   - Root directory: \`dashboard\`
4. Add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Cloudflare Pages settings.
5. Click **Save and Deploy**.

## 5. Deploy Health Pinger to Koyeb
To keep your Cloud Run instance warm and prevent slow cold starts:
1. Create an account on [Koyeb](https://www.koyeb.com/).
2. Create a new App and link your GitHub repo.
3. Koyeb will automatically detect the `koyeb.yaml` file. Just ensure you update the `CLOUD_RUN_URL` environment variable in Koyeb's dashboard to match your actual deployed Google Cloud Run URL.

## 6. GitHub Actions Cron Setup
1. Go to your GitHub repository -> Settings -> Secrets and variables -> Actions.
2. Add a new repository secret named `CRON_SECRET` (make up a strong password).
3. Add a new repository secret named `CLOUD_RUN_URL` pointing to your deployed service.
4. The `.github/workflows/cron.yml` will now run every 6 hours automatically!
