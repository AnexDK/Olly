# Olly – webapp + installérbar mobilapp

Olly er bygget som en responsiv Next.js-app/PWA. Den kan bruges i browser på computer og installeres på Android/iPhone som en app-genvej med eget ikon og fuldskærmsvisning.

## Krav
- Node.js 20 eller nyere
- En Firebase-konto (gratis niveau kan bruges til login)
- En SerpApi-konto/API-nøgle til Google Shopping-søgeresultater. SerpApi kan have begrænsede gratis søgninger og derefter koste penge.

## 1. Installer projektet
```bash
npm install
```

Kopiér `.env.example` til `.env.local` og udfyld værdierne.

## 2. Google-login (Firebase)
1. Gå til https://console.firebase.google.com/ og opret et projekt med navnet Olly.
2. Tilføj en Web-app i projektindstillingerne.
3. Kopiér Firebase-konfigurationens `apiKey`, `authDomain`, `projectId` og `appId` til `.env.local`.
4. Åbn **Authentication → Sign-in method** og aktivér **Google**.
5. Under Authentication → Settings → Authorized domains skal dit domæne tilføjes. Til lokal udvikling skal `localhost` være tilladt.

## 3. Pris-søgning
1. Opret en konto på https://serpapi.com/.
2. Find din API key og sæt den som `SERPAPI_KEY` i `.env.local`.
3. Nøglen bruges kun på serveren i `/api/search` og sendes ikke til browseren.

Eksempel på `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=din_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=olly-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=olly-xxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
SERPAPI_KEY=din_serpapi_key
```

## 4. Start appen
```bash
npm run dev
```
Åbn http://localhost:3000.

## 5. Byg til produktion
```bash
npm run build
npm start
```
Deploy fx til Vercel. Tilføj de samme miljøvariabler i projektets Environment Variables. Tilføj derefter dit produktionsdomæne i Firebase Authorized domains.

## 6. Installer på mobilen
- **Android/Chrome:** Åbn den deployede HTTPS-adresse → browsermenu → Installér app / Føj til startskærm.
- **iPhone/Safari:** Åbn adressen → Del → Føj til hjemmeskærm.

## Vigtigt om priser
Søgeresultater leveres af en ekstern Google Shopping-datakilde via SerpApi. Olly kan sortere de priser, som tjenesten returnerer, men kan ikke garantere at den har alle butikker, fragt, rabatkoder eller lagerstatus med. Tjek altid totalprisen hos forhandleren.

## Om mobilapp
Denne version er en PWA, så samme kode virker på web og kan installeres på mobil. Den er ikke en færdig App Store-/Google Play-native app. Det kræver senere en separat native wrapper og gennemgang af butikkernes udgivelseskrav.
