# DinSat

Marketplace pentru produse locale din Moldova, care conectează cumpărătorii cu producătorii din apropiere. Fluxul implementat include publicarea produselor, căutarea în catalog, plasarea comenzilor și ridicarea programată. Asistentul de cumpărături se activează opțional, iar abonamentele pentru producători sunt o extensie planificată.

## Stadiul proiectului

Aplicațiile React și Node.js sunt implementate în submodulele existente. Sunt disponibile autentificarea, profilurile producătorilor, administrarea produselor cu imagini, catalogul, comenzile, punctele și intervalele de ridicare și dashboardul de statistici. Fluxurile folosesc PostgreSQL, cu migrații și sesiuni persistente. Modul demo în memorie rămâne disponibil pentru dezvoltare.

Aplicația este conectată la PostgreSQL în proiectul Neon `late-cloud-11138544`, pe ramura `production`. `neon.ts` declară integrarea, iar variabilele conexiunii sunt păstrate local, în `.env.local` ignorat de Git. API-ul și interfața sunt pornite local; nu sunt publicate pe un host public.

## Structura repository-ului

Repository-ul principal integrează două submodule Git, fiecare cu propriul istoric și propriile dependențe.

```text
din_sat/
├── .gitmodules
├── README.md
└── src/
    ├── din_sat_api/               # Submodul: backend Node.js
    │   ├── README.md
    │   ├── src/
    │   │   ├── app/
    │   │   ├── domain/features/
    │   │   ├── application/features/
    │   │   ├── infrastructure/
    │   │   │   └── features/
    │   │   ├── presentation/
    │   │   │   └── features/
    │   │   └── shared/
    │   ├── docs/
    │   └── tests/
    └── din_sat_front/             # Submodul: frontend React
        ├── README.md
        ├── public/
        ├── src/
        │   ├── app/
        │   ├── domain/features/
        │   ├── application/features/
        │   ├── infrastructure/
        │   │   └── features/
        │   ├── presentation/
        │   │   └── features/
        │   ├── shared/
        │   └── assets/
        ├── docs/
        └── tests/
```

| Componentă   | Tehnologii și organizare                                                                    | Documentație                                                    |
| ------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Backend      | Node.js și JavaScript; Express 5; monolit modular inspirat de Clean Architecture            | [README API](src/din_sat_api/README.md)                         |
| Frontend     | React și JavaScript; Vite 8; Clean Architecture cu funcționalități grupate în fiecare strat | [README frontend](src/din_sat_front/README.md)                  |
| Baza de date | PostgreSQL, driver pg, migrații SQL și sesiuni durabile; acces izolat în infrastructură     | [Persistență](src/din_sat_api/docs/architecture/persistence.md) |

## Arhitectură

În fiecare aplicație, cele patru straturi apar o singură dată, direct în `src/`. Fiecare strat conține un director `features/`, în care funcționalitățile sunt grupate după nume:

- `domain/`: modele și reguli independente de framework.
- `application/`: cazuri de utilizare și contractele dependențelor externe.
- `infrastructure/`: implementări pentru persistență, HTTP sau furnizori externi.
- `presentation/`: controllere și rute HTTP în backend; componente, pagini și hook-uri React în frontend.

De exemplu, autentificarea este împărțită între `src/domain/features/auth/`, `src/application/features/auth/`, `src/infrastructure/features/auth/` și `src/presentation/features/auth/`. Aceeași convenție se aplică tuturor funcționalităților din ambele aplicații. Fiecare director de funcționalitate va conține fișierele specifice stratului respectiv.

Directorul `app/` al fiecărei aplicații configurează și conectează aceste straturi. Domeniul rămâne independent, iar infrastructura implementează contractele cerute de aplicație.

Modulele backend sunt `auth`, `catalog`, `producers`, `orders`, `pickup`, `dashboard`, `ai` și `billing`. Frontend-ul are aceleași funcționalități și, suplimentar, `cart` pentru coșul temporar.

Fluxul de integrare este: frontend React → API HTTP Node.js → adaptoare de persistență → PostgreSQL. Frontend-ul comunică prin HTTP și nu importă cod din backend. Contractul API este păstrat în `src/din_sat_api/docs/api/openapi.yaml`, cu prefixul `/api/v1`.

## Clonare și sincronizare

Pentru a clona proiectul împreună cu submodulele:

```bash
git clone --recurse-submodules https://github.com/PinzaruDaniel/din_sat.git
cd din_sat
```

Dacă repository-ul principal este deja clonat, inițializează submodulele din rădăcina lui:

```bash
git submodule update --init --recursive
```

Pentru sincronizarea cu versiunile integrate, după salvarea modificărilor locale, rulează din rădăcină:

```bash
git pull --ff-only
git submodule update --init --recursive
git submodule status
```

Repository-ul principal fixează un commit pentru fiecare submodul. Sincronizarea preia aceste versiuni, care pot fi diferite de cele mai recente commit-uri de pe ramurile submodulelor.

## Lucrul în echipă

| Membru | Responsabilitate principală                      |
| ------ | ------------------------------------------------ |
| Daniel | Coordonare, arhitectură și dezvoltare full stack |
| Dan    | Frontend și experiența utilizatorului            |
| Egor   | Backend și persistență                           |
| Alex   | Dezvoltare full stack, frontend și backend       |

Task-urile propuse pentru fiecare User Story, cu responsabili, criterii de acceptare și dependențe, sunt în [backlog-ul Jira pentru echipa de patru persoane](docs/jira-backlog.md).

Lucrează pe o ramură în submodulul relevant, cu prefixul `codex/`. Salvează și publică mai întâi commit-urile în repository-ul copil. După verificarea integrării, actualizează referința submodulului în repository-ul principal. Un commit în părinte păstrează doar referința către versiunea copilului; modificările din interiorul submodulului trebuie salvate separat.

Fișierele `.gitkeep` pot fi eliminate pe măsură ce directoarele primesc conținut. Instrucțiunile de instalare, configurare și pornire sunt documentate în fiecare aplicație.

## Pornire cu baza Neon

Folosește Node.js 24+. Din rădăcină, instalează dependențele proiectului și ale ambelor submodule:

```bash
npm ci
npm --prefix src/din_sat_api ci
npm --prefix src/din_sat_front ci
```

În checkout-ul legat la Neon, `neon deploy` sincronizează serviciile din `neon.ts` și actualizează fișierul de mediu local. Pe altă mașină, autentifică Neon CLI și leagă același proiect/ramură înainte de sincronizare. Configurează și un `SESSION_SECRET` persistent de cel puțin 32 de caractere în fișierul `.env` al API-ului sau în mediul procesului.

```bash
npm run db:migrate
npm run db:check
npm run build
npm start
```

Deschide `http://localhost:5173`; API-ul ascultă implicit pe portul `3001`, iar serverul frontend transmite `/api` către acesta. Pentru dezvoltare cu reload, folosește `npm run dev` din rădăcină.

[Verificarea integrării Neon](docs/neon-verification.md) conține comenzile și rezultatele pentru build, pornire, fluxurile API și browser și persistența sesiunii după repornire.

Comenzile din rădăcină citesc `src/din_sat_api/.env`, apoi `.env`, apoi `.env.local`; variabilele exportate au prioritate. API-ul folosește conexiunea pooled `DATABASE_URL`, iar comenzile DB aleg `MIGRATION_DATABASE_URL`, `DATABASE_URL_UNPOOLED` sau `DATABASE_URL`, în această ordine. Migrarea cere conexiunea directă pentru Neon. Credentialele bazei sunt citite de API, nu incluse în build-ul browserului. Nu comite fișierele de mediu care conțin secrete.

## Alternativă: PostgreSQL local

Cu PostgreSQL 18 instalat local, inițializează și pornește baza din rădăcină:

```bash
node scripts/local-postgres.mjs start
npm --prefix src/din_sat_api run db:migrate
npm --prefix src/din_sat_api run db:seed
npm --prefix src/din_sat_api run db:check
```

Scriptul folosește portul local `55432`, creează bazele `dinsat` și `dinsat_test` și generează configurația API dacă `.env` nu există. Datele și parola locală sunt în `.local/`, ignorat de Git; configurația existentă nu este suprascrisă. Pentru altă instalare PostgreSQL, setează `PG_BIN` la directorul cu `pg_ctl` și `initdb`. Oprire / stare: `node scripts/local-postgres.mjs stop` / `status`.

Alternativ, cu Docker Compose, configurează parola din `.env.example` în `.env` la rădăcină și rulează `docker compose up -d postgres`. Adaptează apoi `src/din_sat_api/.env` după exemplul din API. Folosește o singură variantă de PostgreSQL pe portul `55432`.

Seed-ul adaugă doar date fictive de development și nu resetează înregistrările existente. Este refuzat în producție. Testele DB folosesc baza separată `dinsat_test`.

Pentru a selecta această alternativă chiar dacă rădăcina are un fișier Neon `.env.local`, folosește comenzile submodulelor. Acestea citesc configurația proprie, fără fișierele de mediu din rădăcină; nu exporta URL-urile Neon în terminalul folosit pentru varianta locală. În două terminale:

```bash
npm --prefix src/din_sat_api run dev
```

```bash
npm --prefix src/din_sat_front run dev
```

Deschide `http://localhost:5173`. Cont demo cumpărător: `buyer@dinsat.demo`, parola `DinSatDemo2026!`. Poți crea cont de producător, publica un produs și un interval de ridicare, apoi comanda dintr-un cont de cumpărător. Comenzile pot fi confirmate, pregătite și finalizate de producătorul lor. Plata demo este la ridicare.

```bash
npm --prefix src/din_sat_api run lint
npm --prefix src/din_sat_api test
npm --prefix src/din_sat_api run test:postgres
npm --prefix src/din_sat_front run lint
npm --prefix src/din_sat_front test
npm --prefix src/din_sat_front run build
```

Cu ambele servere pornite, rulează testele Playwright din frontend. Detalii în [README frontend](src/din_sat_front/README.md), [README API](src/din_sat_api/README.md), [contractul HTTP](src/din_sat_api/docs/api/openapi.yaml) și [porturile pentru baza de date externă](src/din_sat_api/docs/architecture/persistence.md).

## Asistentul de cumpărături

Asistentul este disponibil în `/assistant` pentru cumpărătorii autentificați. Configurează `NEON_AI_GATEWAY_BASE_URL` (originea HTTPS a gatewayului), `NEON_AI_GATEWAY_TOKEN` și `AI_MODEL` în mediul API-ului. Alege un model activ în gateway care acceptă function calling și răspunsuri JSON în Chat Completions, de exemplu `gpt-5-mini`. Cheia rămâne pe server. [Documentația Neon AI Gateway](https://neon.com/docs/ai-gateway/chat-completions)

Propunerile expiră după zece minute și sunt păstrate în procesul API care le-a emis. Cumpărătorul confirmă explicit înainte de actualizarea coșului, iar checkout-ul rămâne o acțiune separată. Catalogul și checkout-ul sunt disponibile și când gatewayul nu este configurat.

## Hosting

PostgreSQL rulează în Neon. [Ghidul de hosting](docs/hosting.md) descrie configurația existentă și opțiunile pentru publicarea ulterioară a API-ului și interfeței. API-ul include configurație de producție, sesiuni PostgreSQL, închidere controlată și endpoint-ul de readiness `/api/v1/ready`.
