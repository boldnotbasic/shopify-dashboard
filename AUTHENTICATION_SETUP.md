# 🔐 Authentication Setup Guide

## Overzicht
Dit project is nu beveiligd met Supabase Authentication. Alle data is beschermd met Row Level Security (RLS) policies.

## ⚠️ KRITIEKE VEILIGHEIDSSTAPPEN

### 1. Supabase Credentials Rotatie (VERPLICHT!)
De oude credentials in `.env.example` zijn nu verwijderd, maar **DE OUDE KEYS MOETEN WORDEN GERESET** omdat ze mogelijk publiek zijn geworden:

1. Ga naar [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecteer je project `vqmsryuqfunihyeotafm`
3. Ga naar **Settings** → **API**
4. Klik op **Reset** bij zowel de `anon` key als de `service_role` key
5. Update je `.env` bestand met de nieuwe keys

### 2. Nieuwe .env bestand aanmaken
Maak een nieuw `.env` bestand aan in de root met je NIEUWE credentials:

```env
REACT_APP_SUPABASE_URL=https://vqmsryuqfunihyeotafm.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<je-nieuwe-anon-key>
```

## 📊 Database Schema Toepassen

### Stap 1: Supabase SQL Editor openen
1. Ga naar [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecteer je project
3. Klik op **SQL Editor** in de zijbalk

### Stap 2: Schema toepassen
1. Open het bestand `supabase-schema.sql` in deze repo
2. Kopieer de **volledige** inhoud
3. Plak in de SQL Editor
4. Klik op **Run** (of Ctrl/Cmd + Enter)

### Stap 3: Verificatie
Controleer of alles correct is aangemaakt:

```sql
-- Check of profiles tabel bestaat
SELECT * FROM profiles LIMIT 1;

-- Check of RLS is ingeschakeld
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check of trigger werkt (dit zou TRUE moeten returnen voor alle tabellen)
```

## 👤 Eerste Gebruiker Aanmaken

### Optie 1: Via de App (Aanbevolen)
1. Start de app: `npm start`
2. Je wordt naar de loginpagina geleid
3. Klik op "Nog geen account? Maak er één aan"
4. Vul je gegevens in:
   - Email: je@email.com
   - Wachtwoord: minimaal 6 karakters
   - Volledige naam: Je Naam
5. Klik op "Account aanmaken"

De trigger zal automatisch een profiel aanmaken in de `profiles` tabel!

### Optie 2: Via Supabase Dashboard
1. Ga naar **Authentication** → **Users**
2. Klik op **Add User**
3. Vul email en wachtwoord in
4. Voor de `user_metadata`, voeg toe:
   ```json
   {
     "full_name": "Je Naam"
   }
   ```
5. Klik op **Create User**

### Admin Rechten Geven
Standaard krijgen nieuwe users de rol `user`. Om iemand admin te maken:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'je@email.com';
```

## 🔒 Wat is er Beveiligd?

### Row Level Security Policies
Alle tabellen zijn nu beschermd met RLS:

- ✅ **profiles** - Users kunnen alle profielen zien, maar alleen hun eigen bijwerken
- ✅ **apps** - Alleen authenticated users kunnen CRUD operaties doen
- ✅ **themes** - Alleen authenticated users kunnen CRUD operaties doen
- ✅ **projects** - Alleen authenticated users kunnen CRUD operaties doen
- ✅ **branding_resources** - Alleen authenticated users kunnen CRUD operaties doen
- ✅ **sales** - Alleen authenticated users kunnen CRUD operaties doen
- ✅ **faqs** - Alleen authenticated users kunnen CRUD operaties doen
- ✅ **upsells** - Alleen authenticated users kunnen CRUD operaties doen

### Auto Profile Creation
Wanneer een nieuwe user zich aanmeldt via Supabase Auth:
1. De `on_auth_user_created` trigger wordt geactiveerd
2. Automatisch wordt een profiel aangemaakt in de `profiles` tabel
3. Email en full_name worden overgenomen van de signup data

## 🧪 Testing

### Test Authentication Flow
1. Log uit (als je ingelogd bent)
2. Probeer in te loggen met foute credentials → Moet error geven
3. Log in met correcte credentials → Moet succesvol zijn
4. Open DevTools en check `localStorage` voor session token

### Test RLS Policies
Probeer data op te halen zonder ingelogd te zijn:

```javascript
// In browser console (zonder ingelogd te zijn)
const { data, error } = await supabase.from('projects').select('*');
// Dit zou een lege array moeten returnen of een auth error
```

## 🚀 Deployment Checklist

- [x] Supabase credentials gereset
- [x] Nieuwe `.env` bestand aangemaakt
- [x] SQL schema toegepast in Supabase
- [x] Eerste admin user aangemaakt
- [x] RLS policies getest
- [x] Authentication flow getest
- [x] Code gepusht naar GitHub
- [ ] Vercel environment variables bijgewerkt met nieuwe credentials

## 📝 Volgende Stappen

### Vercel Environment Variables Updaten
1. Ga naar [Vercel Dashboard](https://vercel.com/boldnotbasic/shopify-dashboard)
2. Ga naar **Settings** → **Environment Variables**
3. Update of voeg toe:
   - `REACT_APP_SUPABASE_URL` = je Supabase URL
   - `REACT_APP_SUPABASE_ANON_KEY` = je NIEUWE anon key
4. Redeploy de applicatie

### Extra Beveiliging (Aanbevolen)
1. **Email Verificatie Inschakelen**
   - Ga naar Supabase Dashboard → Authentication → Settings
   - Enable "Confirm email"

2. **Password Complexity Requirements**
   - Minimum password length instellen
   - Password strength requirements configureren

3. **Rate Limiting**
   - Configure rate limiting in Supabase voor login attempts

4. **2FA Overwegen** (Optioneel)
   - Supabase ondersteunt TOTP 2FA
   - Implementeer dit voor admin accounts

## 🆘 Troubleshooting

### "Session not found" error
- Clear browser cache en localStorage
- Log opnieuw in

### RLS policies werken niet
- Controleer of RLS is ingeschakeld: `ALTER TABLE tabel_naam ENABLE ROW LEVEL SECURITY;`
- Controleer of de policies correct zijn: `SELECT * FROM pg_policies WHERE tablename = 'tabel_naam';`

### Trigger werkt niet
- Controleer trigger status: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';`
- Test handmatig: Maak een user aan en check of profiel wordt aangemaakt

### Login werkt niet na deployment
- Verifieer dat Vercel environment variables correct zijn
- Check browser console voor errors
- Controleer Supabase logs in Dashboard

## 📚 Meer Informatie

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [React Auth with Supabase](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)
