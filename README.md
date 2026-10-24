# DinSat

Marketplace pentru produse locale din Moldova, care conectează cumpărătorii cu producătorii din apropiere. Fluxul planificat include publicarea produselor, căutarea în catalog, plasarea comenzilor și ridicarea programată. Asistentul AI și abonamentele pentru producători sunt extensii planificate.

## Stadiul proiectului

Proiectul conține momentan structura de directoare pentru backend și frontend, păstrată în Git prin fișiere `.gitkeep`, și documentația de organizare. Aplicațiile nu sunt încă implementate; fișierele `package.json`, dependențele și comenzile de pornire vor fi adăugate ulterior.

## Structura repository-ului

Repository-ul principal integrează două submodule Git, fiecare cu propriul istoric și propriile dependențe viitoare.

```text
din_sat/
├── .gitmodules
├── README.md
└── src/
    ├── din_sat_api/               # Submodul: backend Node.js
    │   ├── README.md
    │   ├── src/
    │   │   ├── app/
    │   │   ├── modules/
    │   │   ├── infrastructure/
    │   │   └── shared/
    │   ├── docs/
    │   └── tests/
    └── din_sat_front/             # Submodul: frontend React
        ├── README.md
        ├── public/
        ├── src/
        │   ├── app/
        │   ├── features/
        │   ├── shared/
        │   └── assets/
        ├── docs/
        └── tests/
```

| Componentă | Tehnologii și organizare | Documentație |
| --- | --- | --- |
| Backend | Node.js și JavaScript; Express propus; monolit modular inspirat de Clean Architecture | [README API](src/din_sat_api/README.md) |
| Frontend | React și JavaScript; Vite propus; funcționalități organizate după principiile Clean Architecture | [README frontend](src/din_sat_front/README.md) |
| Baza de date | Tehnologia și schema se stabilesc separat; accesul este izolat în infrastructura backend-ului | [Persistență și API](src/din_sat_api/README.md#baza-de-date-și-contractul-api) |

## Arhitectură

Fiecare modul backend și fiecare funcționalitate frontend are patru straturi:

- `domain/`: modele și reguli independente de framework.
- `application/`: cazuri de utilizare și contractele dependențelor externe.
- `infrastructure/`: implementări pentru persistență, HTTP sau furnizori externi.
- `presentation/`: controllere și rute HTTP în backend; componente, pagini și hook-uri React în frontend.

Directorul `app/` al fiecărei aplicații configurează și conectează aceste straturi. Domeniul rămâne independent, iar infrastructura implementează contractele cerute de aplicație.

Modulele backend sunt `auth`, `catalog`, `producers`, `orders`, `pickup`, `dashboard`, `ai` și `billing`. Frontend-ul are aceleași funcționalități și, suplimentar, `cart` pentru coșul temporar.

Fluxul de integrare planificat este: frontend React → API HTTP Node.js → adaptoare de persistență → baza de date aleasă. Frontend-ul comunică prin HTTP și nu importă cod din backend. Contractul API va fi păstrat în `src/din_sat_api/docs/api/`, cu prefixul propus `/api/v1`.

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

Lucrează pe o ramură în submodulul relevant, cu prefixul `codex/`. Salvează și publică mai întâi commit-urile în repository-ul copil. După verificarea integrării, actualizează referința submodulului în repository-ul principal. Un commit în părinte păstrează doar referința către versiunea copilului; modificările din interiorul submodulului trebuie salvate separat.

Fișierele `.gitkeep` pot fi eliminate pe măsură ce directoarele primesc conținut. Instrucțiunile de instalare, configurare și pornire vor fi documentate în fiecare aplicație odată cu implementarea.
