# DawaJaanch

Responsive medicine-information site with dedicated medicine-name comparison, generic-information, and side-effect/interaction pages, plus Gemini-powered search, type-ahead spelling suggestions, and prescription image text reading.

## Run in VS Code

1. Install Node.js, then open this folder in VS Code.
2. In the terminal run `npm install` and `npx vercel login`.
3. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` from Google AI Studio. Keep this key private; never put it in `index.html` or commit `.env.local`.
4. Run `npm run dev` and open the local URL Vercel prints.

Do not open `index.html` directly with a `file://` URL for AI features. The page sections will display, but browser security prevents those requests from reaching `/api/medicine`.

## Deploy

Import this folder into a Vercel project. Add `GEMINI_API_KEY` in Project Settings → Environment Variables. The default model is `gemini-3.8-flash`; if you have a `GEMINI_MODEL` variable already set, update it to that value. Redeploy after changing files or environment variables.

Prescription scanning currently accepts JPG, PNG, or WebP images up to 3 MB. The image is sent to Gemini for text reading and is not saved by this app. Do not upload patient-identifying information.

Gemini responses can be wrong. This prototype is educational and must not be used to make treatment or dosing decisions.
