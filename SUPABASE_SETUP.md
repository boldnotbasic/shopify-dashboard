# 🚀 Supabase Setup Guide - Shopify Dashboard

Complete gids om je Shopify Dashboard te verbinden met Supabase voor permanente data opslag.

## 📋 Stap 1: Supabase Account Aanmaken

1. Ga naar [supabase.com](https://supabase.com)
2. Klik op "Start your project"
3. Sign in met GitHub of email
4. **Gratis tier is perfect voor jouw project!**

## 🏗️ Stap 2: Nieuw Project Aanmaken

1. Klik op "New Project"
2. Vul in:
   - **Project Name**: `shopify-dashboard`
   - **Database Password**: Maak een sterk wachtwoord (bewaar deze!)
   - **Region**: Kies `West EU (Ireland)` voor beste performance vanuit Europa
   - **Pricing Plan**: Free (blijf gratis!)

3. Wacht 2-3 minuten tot het project klaar is

## 🗄️ Stap 3: Database Schema Opzetten

1. Open je project in Supabase Dashboard
2. Ga naar **SQL Editor** (linkermenu)
3. Klik op **"New query"**
4. Kopieer de VOLLEDIGE inhoud van `supabase-schema.sql` uit dit project
5. Plak in de SQL editor
6. Klik op **"Run"** (of druk Ctrl/Cmd + Enter)
7. ✅ Je zou "Success. No rows returned" moeten zien

Dit heeft aangemaakt:
- ✅ `apps` tabel (voor Shopify apps)
- ✅ `themes` tabel (voor themes)
- ✅ `projects` tabel (voor projecten)
- ✅ `branding_resources` tabel (voor branding assets)
- ✅ `sales` tabel (voor offertes)
- ✅ Public access policies (iedereen kan lezen/schrijven)
- ✅ Automatic timestamps

## 📦 Stap 4: Storage Bucket Aanmaken (voor bestanden)

1. Ga naar **Storage** in het linkermenu
2. Klik op **"New bucket"**
3. Vul in:
   - **Name**: `branding-assets`
   - **Public bucket**: ✅ JA (aanvinken!)
4. Klik **"Create bucket"**

### Bucket Policies Instellen:
1. Klik op de `branding-assets` bucket
2. Ga naar **Policies** tab
3. Klik **"New Policy"**
4. Kies **"For full customization"**
5. Voeg deze policy toe:

```sql
-- Allow public upload
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'branding-assets');

-- Allow public read
CREATE POLICY "Public Read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'branding-assets');

-- Allow public delete
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'branding-assets');
```

## 🔑 Stap 5: API Keys Ophalen

1. Ga naar **Project Settings** (tandwiel icoon links onderaan)
2. Klik op **API** in het menu
3. Kopieer deze twee values:
   - **Project URL** (bijvoorbeeld: `https://abcdefgh.supabase.co`)
   - **anon public** key (lange string die begint met `eyJ...`)

## 💻 Stap 6: Environment Variables Instellen

### Lokaal (voor development):

1. Maak een nieuw bestand `.env` in de root van je project:
```bash
REACT_APP_SUPABASE_URL=https://jouw-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. Vervang de waardes met jouw eigen URL en Key van Stap 5

### Vercel (voor production):

1. Ga naar je project op [vercel.com](https://vercel.com)
2. Ga naar **Settings** → **Environment Variables**
3. Voeg toe:
   - **Name**: `REACT_APP_SUPABASE_URL`
   - **Value**: Jouw Supabase URL
   - **Environment**: Production, Preview, Development (alle 3!)
   
4. Voeg toe:
   - **Name**: `REACT_APP_SUPABASE_ANON_KEY`
   - **Value**: Jouw anon key
   - **Environment**: Production, Preview, Development (alle 3!)

5. Klik **"Redeploy"** om de changes toe te passen

## 📦 Stap 7: Dependencies Installeren

```bash
npm install
```

Dit installeert `@supabase/supabase-js` (staat al in package.json)

## 🚀 Stap 8: Testen

### Lokaal testen:
```bash
npm start
```

1. Open http://localhost:3000
2. Ga naar **Apps** pagina
3. Je zou moeten zien: "Apps laden vanuit database..."
4. Daarna: "25 apps in database" (met de default apps)
5. Probeer een nieuwe app toe te voegen
6. Refresh de pagina - de app blijft staan! ✅

### Vercel testen:
1. Push je changes naar GitHub:
```bash
git add .
git commit -m "Add Supabase integration"
git push origin main
```

2. Vercel deploy automatisch
3. Open je Vercel URL
4. Test dezelfde flow als lokaal

## 🔍 Stap 9: Data Verificatie

### In Supabase Dashboard:
1. Ga naar **Table Editor**
2. Klik op de `apps` tabel
3. Je zou je apps moeten zien! 🎉

### Test met collega's:
1. Deel je Vercel URL met een collega
2. Laat hen een app toevoegen
3. Refresh jouw browser
4. Je ziet de nieuwe app! ✅

## ✅ Checklist

- [ ] Supabase account aangemaakt
- [ ] Project aangemaakt
- [ ] Database schema uitgevoerd (supabase-schema.sql)
- [ ] Storage bucket `branding-assets` aangemaakt
- [ ] Storage policies ingesteld
- [ ] API keys gekopieerd
- [ ] `.env` bestand aangemaakt (lokaal)
- [ ] Environment variables ingesteld op Vercel
- [ ] `npm install` uitgevoerd
- [ ] Lokaal getest
- [ ] Naar GitHub gepushed
- [ ] Op Vercel getest
- [ ] Met collega's getest

## 🎯 Wat werkt nu?

✅ **Apps** - Volledig werkend met Supabase
✅ **Export/Import** - Lokale backup functionaliteit
✅ **Real-time** - Iedereen ziet dezelfde data
✅ **Persistent** - Data blijft bewaard tussen sessies
✅ **Team-shared** - Collega's zien jouw wijzigingen

## ⚠️ Veelvoorkomende Problemen

### "Error loading apps"
- Check of je `.env` bestand correct is
- Check of de URL en Key kloppen
- Check of het schema correct is uitgevoerd

### "No rows returned" na schema run
- Dit is NORMAAL en betekent success! ✅

### Apps laden niet
- Open browser console (F12)
- Kijk naar error messages
- Check of de Supabase URL bereikbaar is

### Vercel deployment errors
- Check of environment variables zijn ingesteld
- Check of je hebt geredeploy'd na het instellen

## 📞 Support

Als je problemen hebt:
1. Check de browser console voor errors
2. Check de Supabase logs (Logs tab in dashboard)
3. Verify dat RLS policies correct zijn ingesteld

## 🎉 Klaar!

Je Shopify Dashboard is nu verbonden met Supabase!
- ✅ Permanente data opslag
- ✅ Gedeeld tussen team members
- ✅ Gratis en schaalbaar
- ✅ Veilig met Row Level Security
