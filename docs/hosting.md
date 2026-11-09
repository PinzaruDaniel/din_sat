# Hosting pentru DinSat și GitHub Education Pack

DinSat este conectat la proiectul Neon `late-cloud-11138544`, ramura `production`. În această integrare, Neon furnizează PostgreSQL. API-ul Express și interfața Vite sunt pornite local, fără o adresă publică de hosting. Autentificarea continuă să fie gestionată de API.

## Configurația Neon existentă

Din rădăcina repository-ului deja legat la Neon:

```bash
neon deploy
npm run db:migrate
npm run db:check
npm run build
npm start
```

`neon deploy` sincronizează serviciile declarate în `neon.ts` și generează `.env.local` pentru acest checkout. `DATABASE_URL` este conexiunea pooled a API-ului, iar `DATABASE_URL_UNPOOLED` este conexiunea directă utilizată pentru migrații, cu posibilitatea de a o suprascrie explicit prin `MIGRATION_DATABASE_URL`. Comenzile din rădăcină citesc aceste variabile și `SESSION_SECRET` din configurația locală a API-ului. Fișierele `.env`, `.env.local` și `.neon` sunt ignorate de Git. La publicarea ulterioară, configurează secretele în mediul privat al hostului API.

## Opțiuni pentru publicarea ulterioară

Ofertele de mai jos au fost verificate la **4 noiembrie 2026**; activarea, eligibilitatea și soldul beneficiilor pe contul personal nu au fost verificate.

**Heroku Basic** este o opțiune pentru API dacă poți activa oferta GitHub Students și poți introduce un card. Basic costă 7 USD/lună. Dacă alegi ulterior să muți și baza la Heroku Postgres Essential-0, aceasta costă încă 5 USD/lună: aproximativ **12 USD/lună** pentru ambele. Oferta pentru studenți afișează **13 USD credit/lună pentru 24 de luni**. Creditul nu este o limită automată a facturii. Programul cere card și cont personal Heroku, nu Heroku Teams. [Oferta Heroku pentru studenți](https://www.heroku.com/github-students/), [prețurile Heroku](https://www.heroku.com/pricing/).

Basic rămâne activ; Essential-0 are 1 GB și 20 de conexiuni. Pool-ul API-ului este configurat implicit la 5 conexiuni. Tipul și politica backup-urilor trebuie verificate pentru planul ales înaintea datelor reale. [Planurile Heroku Postgres](https://devcenter.heroku.com/articles/heroku-postgres-plans).

Unele pagini de ajutor pot încă menționa o durată diferită. Verifică oferta afișată în momentul activării, precum și suma facturabilă din dashboard.

## Alternative

| Variantă                                                 | Cost / beneficiu public                                                                | Compromis pentru proiect                                                                    |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Render Free pentru API + Neon Free pentru PostgreSQL** | Gratuit în limitele celor două planuri; nu necesită beneficiul Education Pack          | API-ul intră în sleep, iar DB poate face scale-to-zero; potrivit pentru învățare și demo    |
| **Azure for Students**                                   | 100 USD credit / 12 luni, fără card; eligibilitate universitară full-time de verificat | Configurare mai complexă; resursele suplimentare pot consuma creditul                       |
| **Railway Hobby**                                        | Minimum 5 USD/lună, cu 5 USD consum inclus; excesul se facturează                      | Simplu pentru Node + Postgres, dar nu am identificat un beneficiu Railway în Pack-ul actual |

Render Free are 750 de ore de instanță pe workspace pe lună, oprește serviciul după 15 minute fără trafic și poate avea un cold start de aproximativ un minut. Filesystem-ul este efemer. DinSat stochează imaginile încărcate în PostgreSQL. **Render Postgres Free expiră după 30 de zile și nu are backup-uri**, deci nu îl recomand ca bază principală pentru acest proiect. [Limitele Render Free](https://render.com/docs/free).

Neon Free listează 100 CU-ore pe proiect pe lună, 1 GB de stocare și scale-to-zero după 5 minute de inactivitate. Nu cere card pentru planul Free. Limitele sunt cele publicate acum, nu valorile mai mici din articole mai vechi. Alege aceeași regiune pentru API și DB, de exemplu Frankfurt la Render și Neon. [Neon Free](https://neon.com/pricing), [limitele Neon](https://neon.com/docs/introduction/plans), [regiuni Render](https://render.com/docs/regions), [regiuni Neon](https://neon.com/docs/introduction/regions).

Azure afișează pentru studenții eligibili și clienții noi o ofertă de 12 luni pentru PostgreSQL Flexible B1MS: 750 ore, 32 GB de date și 32 GB backup/lună. Verifică dacă acest beneficiu este disponibil în abonamentul tău și regiunea aleasă; nu presupune că toate componentele backend-ului sunt automat gratuite. [Azure for Students](https://azure.microsoft.com/en-us/free/students/).

Railway are și un trial de 5 USD/30 zile, urmat de un plan Free cu 1 USD/lună. Nu este suficient pentru a promite un API și PostgreSQL permanent active. [Prețurile Railway](https://railway.com/pricing).

Vechea ofertă DigitalOcean de 200 USD nu mai este o bază potrivită pentru alegere: GitHub consemnează ieșirea DigitalOcean din Pack la 31 iulie 2026. [Changelog GitHub Education](https://github.com/github-education-resources/Student-Developer-Pack-Current-Partners-FAQ/blob/main/SDP-changelog.md).

## Configurarea backend-ului deja pregătit în proiect

Deploy-ul folosește repository-ul copil **din_sat_api** ca rădăcină, unde sunt `package.json`, lockfile-ul, `src/`, `scripts/` și `database/`. Modificările locale trebuie revizuite și publicate în repository înainte ca furnizorul să le poată construi.

| Setare                                   | Valoare                                                                                          |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Runtime                                  | Node.js 24 sau mai nou, compatibil cu `package.json`                                             |
| Build                                    | `npm ci`                                                                                         |
| Comandă de pornire                       | `npm start`                                                                                      |
| Migrare, o dată înainte de noua versiune | `npm run db:migrate`                                                                             |
| Health check HTTP                        | `/api/v1/ready`                                                                                  |
| Verificare proces, fără DB               | `/api/v1/health`                                                                                 |
| Variabile necesare                       | `NODE_ENV=production`, `DEMO_MODE=false`, `DATABASE_URL`, `SESSION_SECRET`, `APP_ORIGIN`         |
| Host                                     | `HOST=0.0.0.0`; `PORT` este furnizat de platformă                                                |
| Pool                                     | `DB_POOL_MAX=5` inițial; totalul tuturor instanțelor și joburilor trebuie să încapă în limita DB |

`SESSION_SECRET` trebuie să aibă minimum 32 de caractere aleatoare și să rămână constant la restart / deploy. `DATABASE_URL` și secretul sesiunii se pun în setările private ale platformei, niciodată în Git sau în variabile `VITE_*`.

Migrarea și seed-ul sunt comenzi explicite. **Seed-ul demo este refuzat în producție** și nu este executat automat la pornire. Baza cloud pornește fără conturile demo; utilizatorii se înregistrează prin aplicație. Pentru un mediu separat de staging poți inițializa date fictive explicit, în afara producției.

### Heroku

1. Activează oferta din pagina GitHub Students / Heroku și verifică aprobarea, creditul disponibil și cardul.
2. Creează aplicația în regiunea potrivită, de exemplu `eu`, și alege Basic. Pentru a păstra baza Neon existentă, nu ai nevoie de un add-on PostgreSQL la Heroku. [Regiunile Heroku](https://devcenter.heroku.com/articles/regions).
3. Leagă repository-ul API și configurează variabilele din tabel cu URL-urile Neon. Dacă muți și baza la Heroku Postgres, Heroku furnizează URL-ul după atașarea acesteia. În acest caz, pentru TLS cu verificarea certificatului folosește `PGSSLMODE=verify-full` și bundle-ul CA documentat pentru stack-ul sau imaginea aleasă. [Conectare TLS la Heroku Postgres](https://devcenter.heroku.com/articles/connecting-heroku-postgres).
4. Configurează `TRUST_PROXY=1` pentru proxy-ul Heroku. Dacă topologia se schimbă, reanalizează numărul de proxy-uri; nu folosi arbitrar `true`.
5. Rulează migrarea ca release step / comandă one-off înainte de a primi trafic. `npm start` verifică existența tabelelor și refuză pornirea pe o schemă neinițializată.
6. Verifică `/ready`, înregistrarea, login-ul, publicarea și o comandă, apoi restart-ul API-ului. Sesiunea și datele trebuie să rămână.

### Render + Neon

Blueprint-ul [render.yaml](../src/din_sat_api/render.yaml) folosește Dockerfile-ul din repository-ul **din_sat_api**. Creează un Web Service Free la Frankfurt, în aceeași zonă cu Neon `eu-central-1`. Render generează `SESSION_SECRET`, furnizează portul și verifică `/api/v1/ready`. Deploy-urile următoare sunt manuale, ca să poți aplica migrațiile înainte să publici o versiune nouă. [Blueprints Render](https://render.com/docs/infrastructure-as-code)

1. Publică în GitHub o ramură din **din_sat_api** care conține codul API și `render.yaml`. Din rădăcina DinSat poți pregăti o ramură pentru deploy și inspecta fișierele selectate:

   ```bash
   git -C src/din_sat_api status --short
   git -C src/din_sat_api switch -c codex/render-api
   git -C src/din_sat_api add .env.example README.md database docs src tests render.yaml
   git -C src/din_sat_api diff --cached --stat
   git -C src/din_sat_api diff --cached --check
   ```

   După ce verifici ce intră în commit, publică ramura:

   ```bash
   git -C src/din_sat_api commit -m "Prepare DinSat API for Render"
   git -C src/din_sat_api push -u origin codex/render-api
   ```
2. Din rădăcina DinSat, verifică dacă `.env.local` indică ramura Neon destinată deploy-ului. Testează migrațiile pe o ramură de test și apoi, pentru ramura de deploy, rulează:

   ```bash
   npm run db:migrate
   npm run db:check
   ```

   Comenzile folosesc conexiunea Neon directă din `DATABASE_URL_UNPOOLED`. Păstrează URL-ul direct în mediul din care rulezi migrațiile. Render Free nu oferă comanda de pre-deploy. [Deploy și migrații pe Render](https://render.com/docs/deploys)

3. În [Render Dashboard](https://dashboard.render.com/), alege **New → Blueprint**. Conectează repository-ul GitHub **PinzaruDaniel/din_sat_api**, selectează ramura publicată și păstrează `render.yaml` ca fișier de configurare.
4. Completează `DATABASE_URL` cu URL-ul **pooled** din Neon, cel al cărui hostname conține `-pooler`. La `APP_ORIGIN` introdu originea frontend-ului, de exemplu `http://localhost:5173` pentru setup local sau `https://app.domeniul-tău.md` pentru frontendul public. Folosește doar schema și hostul cu portul, dacă e cazul, fără slash la final. Valorile private se introduc în dashboard.
5. Alege **Deploy Blueprint**. După ce serviciul apare ca **Live**, copiază URL-ul afișat de Render și verifică-l cu:

   ```bash
   curl -fsS 'https://<subdomeniul-din-render>.onrender.com/api/v1/ready'
   ```

   Răspunsul așteptat este `{"status":"ready"}`. Poți verifica și `/api/v1/products?pageSize=1` pentru a confirma că API-ul citește catalogul. Pe Free, prima cerere după o perioadă de inactivitate poate dura aproximativ un minut. [Limitele Render Free](https://render.com/docs/free)

Pentru fiecare versiune ulterioară, rulează migrarea înainte de **Manual Deploy → Deploy latest commit**. Pentru sesiuni în browser, aplică setările din secțiunea de mai jos când ai URL-ul frontend-ului.

Driverul păstrează configurația TLS a URL-ului / furnizorului. Nu există o dezactivare globală a validării certificatului. Folosește certificatul CA și parametrii recomandați de furnizor, fără să copiezi opțiuni TLS din alt serviciu. [TLS în node-postgres](https://node-postgres.com/features/ssl).

## Frontend și cookie-uri

În development, proxy-ul Vite trimite `/api` către API. Acest proxy **nu există** automat în build-ul static. În producție, recomand frontend și API pe același origin prin reverse proxy sau pe subdomenii ale aceluiași site.

Dacă alegi origin-uri diferite, `VITE_API_BASE_URL` se stabilește la **build**, `APP_ORIGIN` trebuie să fie originea exactă a frontend-ului și cererile folosesc `credentials: include`. Pentru site-uri diferite, configurează `COOKIE_SAME_SITE=none` în producție HTTPS; rămâne posibil ca browserul să blocheze cookie-urile third-party. Un domeniu comun este mai previzibil. Protecția CSRF și originea explicită rămân active.

Sesiunile sunt partajate în PostgreSQL, dar rate limiting-ul actual este încă în memoria procesului. Pentru mai multe instanțe API, adaugă și un store partajat pentru rate limiting înainte de scalare.

## Următorul pas pentru un URL public

Păstrează baza Neon și alege hostul API-ului, de exemplu **Heroku Basic** după confirmarea ofertei sau **Render** dacă sunt acceptabile pornirile la rece. Publică apoi interfața cu acces la `/api`, prin același origin sau cu setările de cookie și origine descrise mai sus.
