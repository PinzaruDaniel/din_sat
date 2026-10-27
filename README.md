# DinSat

Marketplace pentru produse locale din Moldova, care conectează cumpărătorii cu producătorii din apropiere. Fluxul implementat include publicarea produselor, căutarea în catalog, plasarea comenzilor și ridicarea programată. Asistentul AI și abonamentele pentru producători sunt extensii planificate.

## Stadiul proiectului

Aplicațiile React și Node.js sunt implementate în submodulele existente. Sunt disponibile autentificarea, catalogul, publicarea produselor, ridicările și fluxul comenzilor. Modul demo folosește adaptoare în memorie; baza de date externă rămâne separată și se conectează prin porturile documentate. Datele și sesiunile demo se pierd la repornire.

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

| Componentă | Tehnologii și organizare | Documentație |
| --- | --- | --- |
| Backend | Node.js și JavaScript; Express 5; monolit modular inspirat de Clean Architecture | [README API](src/din_sat_api/README.md) |
| Frontend | React și JavaScript; Vite 8; Clean Architecture cu funcționalități grupate în fiecare strat | [README frontend](src/din_sat_front/README.md) |
| Baza de date | Tehnologia și schema se stabilesc separat; accesul este izolat în infrastructura backend-ului | [Persistență și API](src/din_sat_api/README.md#baza-de-date-și-contractul-api) |

## Arhitectură

În fiecare aplicație, cele patru straturi apar o singură dată, direct în `src/`. Fiecare strat conține un director `features/`, în care funcționalitățile sunt grupate după nume:

- `domain/`: modele și reguli independente de framework.
- `application/`: cazuri de utilizare și contractele dependențelor externe.
- `infrastructure/`: implementări pentru persistență, HTTP sau furnizori externi.
- `presentation/`: controllere și rute HTTP în backend; componente, pagini și hook-uri React în frontend.

De exemplu, autentificarea este împărțită între `src/domain/features/auth/`, `src/application/features/auth/`, `src/infrastructure/features/auth/` și `src/presentation/features/auth/`. Aceeași convenție se aplică tuturor funcționalităților din ambele aplicații. Fiecare director de funcționalitate va conține fișierele specifice stratului respectiv.

Directorul `app/` al fiecărei aplicații configurează și conectează aceste straturi. Domeniul rămâne independent, iar infrastructura implementează contractele cerute de aplicație.

Modulele backend sunt `auth`, `catalog`, `producers`, `orders`, `pickup`, `dashboard`, `ai` și `billing`. Frontend-ul are aceleași funcționalități și, suplimentar, `cart` pentru coșul temporar.

Fluxul de integrare este: frontend React → API HTTP Node.js → adaptoare de persistență → baza de date aleasă. Frontend-ul comunică prin HTTP și nu importă cod din backend. Contractul API este păstrat în `src/din_sat_api/docs/api/openapi.yaml`, cu prefixul `/api/v1`.

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

| Membru | Responsabilitate principală |
| --- | --- |
| Daniel | Coordonare, arhitectură și dezvoltare full stack |
| Dan | Frontend și experiența utilizatorului |
| Egor | Backend și persistență |
| Alex | Dezvoltare full stack, frontend și backend |

Task-urile propuse pentru fiecare User Story, cu responsabili, criterii de acceptare și dependențe, sunt în [backlog-ul Jira pentru echipa de patru persoane](docs/jira-backlog.md).

Lucrează pe o ramură în submodulul relevant, cu prefixul `codex/`. Salvează și publică mai întâi commit-urile în repository-ul copil. După verificarea integrării, actualizează referința submodulului în repository-ul principal. Un commit în părinte păstrează doar referința către versiunea copilului; modificările din interiorul submodulului trebuie salvate separat.

Fișierele `.gitkeep` pot fi eliminate pe măsură ce directoarele primesc conținut. Instrucțiunile de instalare, configurare și pornire sunt documentate în fiecare aplicație.


## Pornire și verificare locală

Folosește Node.js 24+. Instalează dependențele separat în fiecare submodul. Din rădăcină:

```bash
npm --prefix src/din_sat_api ci
npm --prefix src/din_sat_front ci
```

În două terminale:

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
npm --prefix src/din_sat_front run lint
npm --prefix src/din_sat_front test
npm --prefix src/din_sat_front run build
```

Cu ambele servere pornite, rulează testele Playwright din frontend. Detalii în [README frontend](src/din_sat_front/README.md), [README API](src/din_sat_api/README.md), [contractul HTTP](src/din_sat_api/docs/api/openapi.yaml) și [porturile pentru baza de date externă](src/din_sat_api/docs/architecture/persistence.md).
