# DinSat - backlog Jira pentru echipa de patru persoane

**Actualizare implementare, 4 noiembrie 2026:** PostgreSQL este ales și conectat pentru fluxurile existente. DS-25 și DS-27 sunt în lucru, cu migrații, date demo și sesiuni durabile implementate local. Vezi [pornirea proiectului](../README.md), [verificările](testing.md) și [hosting-ul](hosting.md). Propunerile inițiale de mai jos păstrează contextul planificării.

Actualizat la 27.10.2026. Au fost create în proiectul [DinSat Team](https://din-sat.atlassian.net/issues/?jql=project%20%3D%20DS%20AND%20labels%20%3D%20dinsat-backlog) **43 de subtask-uri pentru cele 10 Stories existente** și **6 Task-uri de fundament**. Cele 9 activități pentru US11-US12 rămân propuneri locale, deoarece Stories respective nu există în proiect la momentul verificării.

## Convenții și asignare

- Fiecare titlu începe cu `FRONT -` sau `BACK -`, fără coduri numerotate inventate. Cheile DS sunt identificatorii generați automat de Jira.
- Daniel: coordonare, arhitectură și full stack; Dan: frontend; Egor: backend; Alex: full stack.
- **Alex nu este încă în Jira. Toate cele 14 activități pregătite pentru el sunt neasignate**, cu responsabilul planificat menționat în descriere și label-ul `pending-alex`.
- Activitățile pentru Daniel, Dan și Egor sunt asignate conturilor verificate în proiect.
- Funcționalitățile cu livrabile distincte pe ambele părți, precum imaginile și confirmarea AI, au task-uri FRONT și BACK separate.
- AI-ul rămâne opțional; crearea subtask-urilor nu îl mută în sprint și nu schimbă prioritatea marketplace-ului de bază.
- Nu sunt stabilite estimări sau termene. Autorul verifică implementarea, iar alt coleg face review.
- Cele 111 legături de dependență `Blocks` sunt configurate și verificate în Jira. Ele indică cerințele pentru finalizarea activităților; UI-ul poate începe cu mock-uri bazate pe contract înaintea API-ului complet.

## Stories și subtask-uri create

| Story | Jira | Subtask-uri |
| --- | --- | --- |
| US01 - Cont și autentificare | [DS-10](https://din-sat.atlassian.net/browse/DS-10) | 4 |
| US02 - Profil producător | [DS-11](https://din-sat.atlassian.net/browse/DS-11) | 4 |
| US03 - Gestionarea produselor | [DS-14](https://din-sat.atlassian.net/browse/DS-14) | 5 |
| US04 - Descoperirea produselor | [DS-15](https://din-sat.atlassian.net/browse/DS-15) | 4 |
| US05 - Coș și comandă | [DS-16](https://din-sat.atlassian.net/browse/DS-16) | 5 |
| US06 - Ridicare programată | [DS-17](https://din-sat.atlassian.net/browse/DS-17) | 4 |
| US07 - Urmărirea comenzilor | [DS-18](https://din-sat.atlassian.net/browse/DS-18) | 4 |
| US08 - Pregătire și anulare | [DS-19](https://din-sat.atlassian.net/browse/DS-19) | 4 |
| US09 - Dashboard | [DS-20](https://din-sat.atlassian.net/browse/DS-20) | 4 |
| US10 - Cumpărături asistate de AI, opțional | [DS-21](https://din-sat.atlassian.net/browse/DS-21) | 5 |

## Arhitectură și reguli comune

- Backend Node.js / JavaScript; frontend React / JavaScript. Express și Vite sunt instrumentele propuse.
- În fiecare aplicație, `src/domain/`, `src/application/`, `src/infrastructure/` și `src/presentation/` apar o singură dată. Fiecare strat conține `features/<funcționalitate>/`, iar `app` conectează dependențele.
- Reguli pure în `domain`, cazuri de utilizare și porturi în `application`, adaptoare în `infrastructure`, HTTP / React în `presentation`.
- Tehnologia și schema bazei de date se stabilesc separat. Cerințele despre tranzacții, concurență și istoric sunt obligatorii indiferent de soluția aleasă.
- Contractul canonic va fi în `src/din_sat_api/docs/api/`; rutele din acest document sunt scrise fără prefixul propus `/api/v1`.
- UI-ul poate începe cu mock-uri bazate pe contract. Integrarea se acceptă după verificarea cu API real; dependențele includ și condițiile pentru finalizarea integrării.
- `FRONT` și `BACK` indică livrabilul principal. Verificările integrate și pornirea comună sunt încadrate la `BACK`, cu repository-ul și întinderea lor precizate în descriere.

## Fundament - Task-uri sub DS-4

**Parent:** [DS-4](https://din-sat.atlassian.net/browse/DS-4) · **Tip:** Task.

### BACK - Inițializarea API-ului Node.js

**Jira:** [DS-22](https://din-sat.atlassian.net/browse/DS-22) · **Responsabil Jira:** Egor.

**Repository:** din_sat_api · **Prioritate:** High.

**De implementat:** Inițializarea dependențelor, scripturilor și configurației de dezvoltare. Configurarea serverului și a injectării dependențelor în `app`, cu middleware comun pentru erori în `presentation`.

**Acceptare / verificare:** Instalarea este reproductibilă prin lockfile; comenzile documentate de pornire și verificare funcționează. Un endpoint de health răspunde; o eroare controlată respectă formatul comun și nu expune stack trace. Configurația exemplu nu conține secrete reale.

**Dependențe:** fără.

### FRONT - Inițializarea frontend-ului React

**Jira:** [DS-23](https://din-sat.atlassian.net/browse/DS-23) · **Responsabil Jira:** Dan.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Inițializarea React, instrumentului de build, routerului, layout-ului și clientului HTTP comun. Configurarea adresei publice a API-ului.

**Acceptare / verificare:** Aplicația pornește local și build-ul reușește. Navigarea și pagina pentru rută inexistentă funcționează; o cerere către API poate afișa succes, încărcare și eroare.

**Dependențe:** fără.

### BACK - Contractul API și regulile de integrare

**Jira:** [DS-24](https://din-sat.atlassian.net/browse/DS-24) · **Responsabil Jira:** Daniel.

**Repository:** din_sat_api · **Prioritate:** High.

**De implementat:** Contractul inițial pentru autentificare, profil, produse, comenzi și ridicări, inclusiv paginare, erori, sesiune și DTO-uri. Documentarea interfețelor și regulilor Clean Architecture actuale.

**Acceptare / verificare:** Dan, Egor și Alex pot identifica request-ul, răspunsul și accesul pentru fiecare operație de bază. Contractul poate fi validat și include exemple pentru succes și eroare; nu există două copii editate independent.

**Dependențe:** fără.

### BACK - Alegerea persistenței și datele demo

**Jira:** [DS-25](https://din-sat.atlassian.net/browse/DS-25) · **Responsabil Jira:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_api · **Prioritate:** High.

**De implementat:** Propunerea soluției de date, revizuirea cu Egor și Daniel, schema minimă și adaptoarele de conectare / tranzacții. Organizarea versiunilor schemei și a datelor demo potrivit tehnologiei alese.

**Acceptare / verificare:** Decizia și relațiile sunt documentate; un mediu gol se poate inițializa reproductibil. Există conturi fictive, producători, produse și ridicări; regulile de business nu importă driverul bazei de date. Sunt documentate mecanismele de atomicitate și concurență necesare comenzilor.

**Dependențe:** [DS-22 - BACK - Inițializarea API-ului Node.js](https://din-sat.atlassian.net/browse/DS-22), [DS-24 - BACK - Contractul API și regulile de integrare](https://din-sat.atlassian.net/browse/DS-24).

### FRONT - Componente UI și convenții vizuale

**Jira:** [DS-26](https://din-sat.atlassian.net/browse/DS-26) · **Responsabil Jira:** Dan.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Butoane, câmpuri, mesaje de eroare, loading, empty state și layout adaptabil în `presentation/shared/`.

**Acceptare / verificare:** Controalele sunt reutilizabile în formulare și catalog. Se pot folosi cu tastatura, câmpurile au etichete, iar o pagină reprezentativă funcționează la 360 px și pe desktop.

**Dependențe:** [DS-23 - FRONT - Inițializarea frontend-ului React](https://din-sat.atlassian.net/browse/DS-23).

### BACK - Pornirea integrată și configurarea locală

**Jira:** [DS-27](https://din-sat.atlassian.net/browse/DS-27) · **Responsabil Jira:** Daniel.

**Repository:** din_sat · **Prioritate:** High.

**De implementat:** Pașii sau scripturile pentru pornirea celor două submodule și a persistenței alese; documentarea variabilelor de mediu și a versiunilor compatibile.

**Acceptare / verificare:** Un coleg reproduce pornirea dintr-o clonare recursivă curată. Frontend-ul comunică cu API-ul, configurația locală este documentată, iar părintele poate fixa commit-urile publicate și testate ale copiilor.

**Dependențe:** [DS-22 - BACK - Inițializarea API-ului Node.js](https://din-sat.atlassian.net/browse/DS-22), [DS-23 - FRONT - Inițializarea frontend-ului React](https://din-sat.atlassian.net/browse/DS-23), [DS-25 - BACK - Alegerea persistenței și datele demo](https://din-sat.atlassian.net/browse/DS-25).

## US01 - Cont și autentificare

**Parent:** [DS-10](https://din-sat.atlassian.net/browse/DS-10) · **Tip:** Subtask.

### BACK - API pentru înregistrare, login, logout și utilizatorul curent

**Jira:** [DS-28](https://din-sat.atlassian.net/browse/DS-28) · **Responsabil Jira:** Egor.

**Repository:** din_sat_api · **Prioritate:** Highest.

**De implementat:** Cazurile de utilizare și rutele `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me`, persistența conturilor și sesiuni revocabile în straturile `features/auth/`.

**Acceptare / verificare:** Emailul duplicat și datele invalide sunt respinse. Parolele sunt hash-uite și nu apar în răspunsuri / loguri; clientul nu poate atribui un rol privilegiat. După login, `/me` identifică utilizatorul; după logout, sesiunea nu mai este acceptată. Sunt verificate și credențialele greșite.

**Dependențe:** [DS-22 - BACK - Inițializarea API-ului Node.js](https://din-sat.atlassian.net/browse/DS-22), [DS-24 - BACK - Contractul API și regulile de integrare](https://din-sat.atlassian.net/browse/DS-24), [DS-25 - BACK - Alegerea persistenței și datele demo](https://din-sat.atlassian.net/browse/DS-25).

### FRONT - Formulare de înregistrare și autentificare

**Jira:** [DS-29](https://din-sat.atlassian.net/browse/DS-29) · **Responsabil Jira:** Dan.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Paginile și formularele din `presentation/features/auth/`, conectate la cazurile de utilizare și adaptoarele API.

**Acceptare / verificare:** Formularele au etichete, validare și mesaje pentru date greșite / email duplicat. Butonul indică încărcarea; la eroare nu apare succes fals. Înregistrarea și login-ul funcționează cu API-ul real pe mobil și desktop.

**Dependențe:** [DS-23 - FRONT - Inițializarea frontend-ului React](https://din-sat.atlassian.net/browse/DS-23), [DS-24 - BACK - Contractul API și regulile de integrare](https://din-sat.atlassian.net/browse/DS-24), [DS-26 - FRONT - Componente UI și convenții vizuale](https://din-sat.atlassian.net/browse/DS-26); integrare după [DS-28 - BACK - API pentru înregistrare, login, logout și utilizatorul curent](https://din-sat.atlassian.net/browse/DS-28).

### FRONT - Sesiune frontend și navigare în funcție de rol

**Jira:** [DS-30](https://din-sat.atlassian.net/browse/DS-30) · **Responsabil Jira:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Încărcarea sesiunii prin `/me`, logout, providerul de autentificare și redirecționarea rutelor private. Curățarea datelor locale aferente contului la logout / schimbarea contului.

**Acceptare / verificare:** Refresh-ul păstrează sesiunea validă; sesiunea expirată duce la login și elimină datele private din UI. Meniul reflectă rolul primit de la server. Protecția rutelor este completată de autorizarea API-ului, verificată separat.

**Dependențe:** [DS-23 - FRONT - Inițializarea frontend-ului React](https://din-sat.atlassian.net/browse/DS-23), [DS-24 - BACK - Contractul API și regulile de integrare](https://din-sat.atlassian.net/browse/DS-24), [DS-28 - BACK - API pentru înregistrare, login, logout și utilizatorul curent](https://din-sat.atlassian.net/browse/DS-28).

### BACK - Verificarea accesului și a fluxului complet de autentificare

**Jira:** [DS-31](https://din-sat.atlassian.net/browse/DS-31) · **Responsabil Jira:** Daniel.

**Repository:** din_sat · **Prioritate:** High.

**De implementat:** Scenariul integrat înregistrare → login → `/me` → logout, cu verificări pentru două conturi și sesiune expirată. Documentarea deciziilor de sesiune și a configurației browser / API.

**Acceptare / verificare:** Fluxul funcționează pe combinația fixată de submodule. Cererile fără sesiune și accesul nepermis sunt respinse de server; UI-ul tratează răspunsurile. Dacă sesiunea folosește cookie-uri, sunt verificate configurația lor și protecția cererilor care modifică date.

**Dependențe:** [DS-28 - BACK - API pentru înregistrare, login, logout și utilizatorul curent](https://din-sat.atlassian.net/browse/DS-28), [DS-29 - FRONT - Formulare de înregistrare și autentificare](https://din-sat.atlassian.net/browse/DS-29), [DS-30 - FRONT - Sesiune frontend și navigare în funcție de rol](https://din-sat.atlassian.net/browse/DS-30).

## US02 - Profil producător

**Parent:** [DS-11](https://din-sat.atlassian.net/browse/DS-11) · **Tip:** Subtask.

### BACK - API pentru citirea și actualizarea profilului

**Jira:** [DS-32](https://din-sat.atlassian.net/browse/DS-32) · **Responsabil Jira:** Egor.

**Repository:** din_sat_api · **Prioritate:** High.

**De implementat:** Profil public prin `/producers/:id` și citirea / modificarea profilului propriu prin `/producer/profile`, în `features/producers/`.

**Acceptare / verificare:** Numele, descrierea și localitatea sunt validate și persistate. Proprietarul este dedus din sesiune; producătorul A nu poate modifica profilul lui B. Profilul public nu expune date private.

**Dependențe:** [DS-28 - BACK - API pentru înregistrare, login, logout și utilizatorul curent](https://din-sat.atlassian.net/browse/DS-28), [DS-24 - BACK - Contractul API și regulile de integrare](https://din-sat.atlassian.net/browse/DS-24).

### FRONT - Pagina publică a producătorului

**Jira:** [DS-33](https://din-sat.atlassian.net/browse/DS-33) · **Responsabil Jira:** Dan.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Afișarea numelui, descrierii și localității, cu navigare către oferta producătorului.

**Acceptare / verificare:** Pagina afișează profilul cerut și are loading, eroare și stare pentru profil inexistent. Linkurile către produse funcționează după livrarea catalogului US04, fără să blocheze livrarea profilului de bază.

**Dependențe:** [DS-23 - FRONT - Inițializarea frontend-ului React](https://din-sat.atlassian.net/browse/DS-23), [DS-26 - FRONT - Componente UI și convenții vizuale](https://din-sat.atlassian.net/browse/DS-26), contract [DS-32 - BACK - API pentru citirea și actualizarea profilului](https://din-sat.atlassian.net/browse/DS-32); integrare după [DS-32 - BACK - API pentru citirea și actualizarea profilului](https://din-sat.atlassian.net/browse/DS-32).

### FRONT - Formular pentru editarea profilului propriu

**Jira:** [DS-34](https://din-sat.atlassian.net/browse/DS-34) · **Responsabil Jira:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Formularul de administrare a profilului, încărcarea valorilor existente și salvarea modificărilor.

**Acceptare / verificare:** Salvarea validă se vede după refresh. Datele invalide afișează erori de câmp; eroarea serverului nu pierde modificările introduse. Un cumpărător nu primește controalele de administrare.

**Dependențe:** [DS-30 - FRONT - Sesiune frontend și navigare în funcție de rol](https://din-sat.atlassian.net/browse/DS-30), [DS-32 - BACK - API pentru citirea și actualizarea profilului](https://din-sat.atlassian.net/browse/DS-32), [DS-26 - FRONT - Componente UI și convenții vizuale](https://din-sat.atlassian.net/browse/DS-26).

### BACK - Contract și verificări pentru proprietatea profilului

**Jira:** [DS-35](https://din-sat.atlassian.net/browse/DS-35) · **Responsabil Jira:** Daniel.

**Repository:** din_sat_api · **Prioritate:** High.

**De implementat:** Revizuirea DTO-urilor public / privat și verificări pentru acces fără sesiune, rol greșit și încercarea de modificare a altui proprietar.

**Acceptare / verificare:** Contractul documentează câmpurile editabile și erorile. Verificările API confirmă că proprietarul nu poate fi schimbat prin payload și că datele private nu apar în profilul public.

**Dependențe:** [DS-32 - BACK - API pentru citirea și actualizarea profilului](https://din-sat.atlassian.net/browse/DS-32).

## US03 - Gestionarea produselor

**Parent:** [DS-14](https://din-sat.atlassian.net/browse/DS-14) · **Tip:** Subtask.

### BACK - API de creare, editare și arhivare a produselor

**Jira:** [DS-36](https://din-sat.atlassian.net/browse/DS-36) · **Responsabil Jira:** Egor.

**Repository:** din_sat_api · **Prioritate:** High.

**De implementat:** Operațiile producătorului pe `/producer/products` și `/producer/products/:id`, în `features/catalog/`.

**Acceptare / verificare:** Titlul este obligatoriu, prețul pozitiv, stocul nenegativ și unitatea validă. Producătorul modifică doar produsele proprii. Arhivarea păstrează înregistrarea și legăturile necesare istoricului comenzilor.

**Dependențe:** [DS-28 - BACK - API pentru înregistrare, login, logout și utilizatorul curent](https://din-sat.atlassian.net/browse/DS-28), [DS-32 - BACK - API pentru citirea și actualizarea profilului](https://din-sat.atlassian.net/browse/DS-32), [DS-25 - BACK - Alegerea persistenței și datele demo](https://din-sat.atlassian.net/browse/DS-25).

### FRONT - Interfața de administrare a produselor

**Jira:** [DS-37](https://din-sat.atlassian.net/browse/DS-37) · **Responsabil Jira:** Dan.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Lista produselor proprii și formularele de creare / editare, cu acțiune explicită de arhivare.

**Acceptare / verificare:** Crearea, editarea și arhivarea actualizează lista. Sunt tratate erorile de câmp, încărcarea și lipsa produselor; formularul funcționează pe mobil.

**Dependențe:** [DS-30 - FRONT - Sesiune frontend și navigare în funcție de rol](https://din-sat.atlassian.net/browse/DS-30), [DS-26 - FRONT - Componente UI și convenții vizuale](https://din-sat.atlassian.net/browse/DS-26), contract [DS-36 - BACK - API de creare, editare și arhivare a produselor](https://din-sat.atlassian.net/browse/DS-36); integrare după [DS-36 - BACK - API de creare, editare și arhivare a produselor](https://din-sat.atlassian.net/browse/DS-36).

### BACK - Încărcarea și validarea imaginilor produselor

**Jira:** [DS-38](https://din-sat.atlassian.net/browse/DS-38) · **Responsabil Jira:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_api · **Prioritate:** High.

**De implementat:** Implementarea adaptorului de stocare și a endpoint-ului /producer/uploads. Serverul validează conținutul, tipul și dimensiunea fișierului și întoarce o referință utilizabilă în produs.

**Acceptare / verificare:** Imaginea validă este stocată și primește o referință accesibilă frontend-ului. Fișierele neacceptate sau prea mari sunt respinse. Upload-ul necesită autorizare; fișierele utilizatorilor nu sunt introduse în Git. Soluția de stocare este documentată separat de domeniu.

**Dependențe:** [DS-28 - BACK - API pentru înregistrare, login, logout și utilizatorul curent](https://din-sat.atlassian.net/browse/DS-28), [DS-36 - BACK - API de creare, editare și arhivare a produselor](https://din-sat.atlassian.net/browse/DS-36).

### FRONT - Selectarea și afișarea imaginilor produselor

**Jira:** [DS-39](https://din-sat.atlassian.net/browse/DS-39) · **Responsabil Jira:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Selecția imaginii în formularul produsului, apelarea endpoint-ului de upload și salvarea referinței în produs, cu previzualizare și feedback pentru utilizator.

**Acceptare / verificare:** Imaginea validă apare în formular și după salvarea produsului. Eroarea upload-ului este afișată fără succes fals și fără pierderea câmpurilor completate. Sunt tratate tipul neacceptat, dimensiunea depășită și eșecul serverului.

**Dependențe:** [DS-37 - FRONT - Interfața de administrare a produselor](https://din-sat.atlassian.net/browse/DS-37), [DS-38 - BACK - Încărcarea și validarea imaginilor produselor](https://din-sat.atlassian.net/browse/DS-38).

### BACK - Reguli de produs și păstrarea istoricului

**Jira:** [DS-40](https://din-sat.atlassian.net/browse/DS-40) · **Responsabil Jira:** Daniel.

**Repository:** din_sat_api · **Prioritate:** High.

**De implementat:** Revizuirea și testarea regulilor pure din `domain/features/catalog/`: valori monetare, cantități, unități și arhivare. Stabilirea contractului pentru copiile istorice folosite de comenzi.

**Acceptare / verificare:** Nu există calcule monetare autoritare cu float. Sunt acoperite valorile negative, unitățile necunoscute și precizia cantității. Arhivarea nu șterge datele produsului; verificarea istoricului efectiv al comenzii este completată în [DS-57 - BACK - Verificarea istoricului și a accesului între conturi](https://din-sat.atlassian.net/browse/DS-57).

**Dependențe:** contract [DS-36 - BACK - API de creare, editare și arhivare a produselor](https://din-sat.atlassian.net/browse/DS-36); integrare după [DS-36 - BACK - API de creare, editare și arhivare a produselor](https://din-sat.atlassian.net/browse/DS-36).

## US04 - Descoperirea produselor

**Parent:** [DS-15](https://din-sat.atlassian.net/browse/DS-15) · **Tip:** Subtask.

### BACK - API de catalog, filtre și paginare

**Jira:** [DS-41](https://din-sat.atlassian.net/browse/DS-41) · **Responsabil Jira:** Egor.

**Repository:** din_sat_api · **Prioritate:** High.

**De implementat:** `/products` și `/products/:id`, cu căutare, categorie, localitate, sortare permisă și paginare.

**Acceptare / verificare:** Filtrele se combină; `items`, `total`, `page` și `pageSize` sunt consecvente. Produsele arhivate nu apar public; parametrii invalizi sunt tratați conform contractului. Sunt verificate și combinații fără rezultate.

**Dependențe:** [DS-36 - BACK - API de creare, editare și arhivare a produselor](https://din-sat.atlassian.net/browse/DS-36), [DS-24 - BACK - Contractul API și regulile de integrare](https://din-sat.atlassian.net/browse/DS-24).

### FRONT - Pagina de catalog și filtrele din URL

**Jira:** [DS-42](https://din-sat.atlassian.net/browse/DS-42) · **Responsabil Jira:** Dan.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Catalogul, filtrele, resetarea și paginarea; păstrarea filtrelor partajabile în URL.

**Acceptare / verificare:** Refresh-ul păstrează selecția, resetarea revine la lista inițială și totalul corespunde API-ului. La căutări rapide, răspunsurile vechi nu înlocuiesc rezultatele filtrului curent.

**Dependențe:** [DS-26 - FRONT - Componente UI și convenții vizuale](https://din-sat.atlassian.net/browse/DS-26), contract [DS-41 - BACK - API de catalog, filtre și paginare](https://din-sat.atlassian.net/browse/DS-41); integrare după [DS-41 - BACK - API de catalog, filtre și paginare](https://din-sat.atlassian.net/browse/DS-41).

### FRONT - Detaliile produsului și navigarea către producător

**Jira:** [DS-43](https://din-sat.atlassian.net/browse/DS-43) · **Responsabil Jira:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Pagina produsului cu imagine, preț, monedă, unitate, disponibilitate și profilul producătorului.

**Acceptare / verificare:** Datele provin din API și sunt afișate cu unitatea corectă. Produsul absent sau arhivat are stare clară; legătura spre producător funcționează. Adăugarea în coș este conectată la [DS-45 - FRONT - Coș local cu un singur producător](https://din-sat.atlassian.net/browse/DS-45) după livrarea acestuia.

**Dependențe:** [DS-41 - BACK - API de catalog, filtre și paginare](https://din-sat.atlassian.net/browse/DS-41), [DS-33 - FRONT - Pagina publică a producătorului](https://din-sat.atlassian.net/browse/DS-33), [DS-26 - FRONT - Componente UI și convenții vizuale](https://din-sat.atlassian.net/browse/DS-26).

### BACK - Verificarea contractului și a combinațiilor de filtre

**Jira:** [DS-44](https://din-sat.atlassian.net/browse/DS-44) · **Responsabil Jira:** Daniel.

**Repository:** din_sat · **Prioritate:** High.

**De implementat:** Scenarii integrate pentru căutare + categorie + localitate, paginare, resetare și produse inactive.

**Acceptare / verificare:** Aceeași combinație în URL și API produce același total și aceleași articole. Sunt documentate rezultatele pentru prima / ultima pagină, listă goală și produs arhivat.

**Dependențe:** [DS-41 - BACK - API de catalog, filtre și paginare](https://din-sat.atlassian.net/browse/DS-41), [DS-42 - FRONT - Pagina de catalog și filtrele din URL](https://din-sat.atlassian.net/browse/DS-42), [DS-43 - FRONT - Detaliile produsului și navigarea către producător](https://din-sat.atlassian.net/browse/DS-43).

## US05 - Coș și comandă

**Parent:** [DS-16](https://din-sat.atlassian.net/browse/DS-16) · **Tip:** Subtask.

### FRONT - Coș local cu un singur producător

**Jira:** [DS-45](https://din-sat.atlassian.net/browse/DS-45) · **Responsabil Jira:** Dan.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Adăugare, modificare cantitate, eliminare și golire; reguli pure în `domain/features/cart/`, provider și interfață în `presentation/features/cart/`.

**Acceptare / verificare:** Coșul nu amestecă producători; schimbarea producătorului cere o alegere explicită. Cantitățile respectă unitatea; totalul este marcat orientativ. Logout-ul / schimbarea contului nu expune coșul contului anterior.

**Dependențe:** [DS-42 - FRONT - Pagina de catalog și filtrele din URL](https://din-sat.atlassian.net/browse/DS-42), [DS-43 - FRONT - Detaliile produsului și navigarea către producător](https://din-sat.atlassian.net/browse/DS-43), [DS-30 - FRONT - Sesiune frontend și navigare în funcție de rol](https://din-sat.atlassian.net/browse/DS-30).

### BACK - Crearea atomică a comenzii și rezervarea resurselor

**Jira:** [DS-47](https://din-sat.atlassian.net/browse/DS-47) · **Responsabil Jira:** Egor.

**Repository:** din_sat_api · **Prioritate:** Highest.

**De implementat:** Cazul de utilizare pentru `POST /orders`, cu recalcularea prețurilor, copie istorică a articolelor și rezervarea stocului / intervalului în aceeași operație atomică.

**Acceptare / verificare:** Buyer-ul provine din sesiune; articolele au un singur producător și aceeași monedă. Prețurile și totalul provin din backend. La stoc sau capacitate insuficientă nu rămân comandă ori rezervări parțiale. Intervalul aparține producătorului și este viitor.

**Dependențe:** [DS-28 - BACK - API pentru înregistrare, login, logout și utilizatorul curent](https://din-sat.atlassian.net/browse/DS-28), [DS-36 - BACK - API de creare, editare și arhivare a produselor](https://din-sat.atlassian.net/browse/DS-36), [DS-40 - BACK - Reguli de produs și păstrarea istoricului](https://din-sat.atlassian.net/browse/DS-40), [DS-46 - BACK - API pentru puncte, intervale și disponibilitate](https://din-sat.atlassian.net/browse/DS-46), [DS-25 - BACK - Alegerea persistenței și datele demo](https://din-sat.atlassian.net/browse/DS-25).

### BACK - Idempotență pentru reîncercarea comenzii

**Jira:** [DS-48](https://din-sat.atlassian.net/browse/DS-48) · **Responsabil Jira:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_api · **Prioritate:** Highest.

**De implementat:** Revendicarea cheii de idempotență și asocierea cu payload-ul normalizat și comanda, în aceeași tranzacție cu rezervarea.

**Acceptare / verificare:** Aceeași cheie și același payload pentru același cumpărător returnează comanda existentă. Payload diferit cu aceeași cheie produce conflict. Cererile simultane nu dublează comanda; rollback-ul nu lasă o cheie care indică o comandă inexistentă.

**Dependențe:** [DS-47 - BACK - Crearea atomică a comenzii și rezervarea resurselor](https://din-sat.atlassian.net/browse/DS-47).

### FRONT - Checkout și confirmarea comenzii

**Jira:** [DS-50](https://din-sat.atlassian.net/browse/DS-50) · **Responsabil Jira:** Daniel.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Rezumatul coșului, selecția ridicării și trimiterea comenzii, cu confirmare și ID returnat de server.

**Acceptare / verificare:** Un retry după timeout reutilizează cheia intenției inițiale; modificarea articolelor sau intervalului generează o intenție nouă. Conflictele permit corectarea coșului. Coșul este golit numai după confirmarea serverului, iar totalul final este cel returnat de API.

**Dependențe:** [DS-45 - FRONT - Coș local cu un singur producător](https://din-sat.atlassian.net/browse/DS-45), [DS-47 - BACK - Crearea atomică a comenzii și rezervarea resurselor](https://din-sat.atlassian.net/browse/DS-47), [DS-48 - BACK - Idempotență pentru reîncercarea comenzii](https://din-sat.atlassian.net/browse/DS-48), [DS-49 - FRONT - Selectarea ridicării în checkout](https://din-sat.atlassian.net/browse/DS-49).

### BACK - Verificarea concurenței și a rollback-ului la checkout

**Jira:** [DS-51](https://din-sat.atlassian.net/browse/DS-51) · **Responsabil Jira:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_api · **Prioritate:** Highest.

**De implementat:** Teste de integrare cu persistența reală pentru ultimul produs, ultimul loc, retry și eșec la mijlocul operației.

**Acceptare / verificare:** Două conexiuni / sesiuni independente fac cereri concurente: maximum o comandă rezervă ultima resursă. Se verifică separat stoc 1 și capacitate 1; eșecul nu lasă date parțiale. Două cereri simultane cu aceeași cheie creează o singură comandă. Mock-urile nu înlocuiesc testul de concurență.

**Dependențe:** [DS-47 - BACK - Crearea atomică a comenzii și rezervarea resurselor](https://din-sat.atlassian.net/browse/DS-47), [DS-48 - BACK - Idempotență pentru reîncercarea comenzii](https://din-sat.atlassian.net/browse/DS-48).

## US06 - Ridicare programată

**Parent:** [DS-17](https://din-sat.atlassian.net/browse/DS-17) · **Tip:** Subtask.

### BACK - API pentru puncte, intervale și disponibilitate

**Jira:** [DS-46](https://din-sat.atlassian.net/browse/DS-46) · **Responsabil Jira:** Egor.

**Repository:** din_sat_api · **Prioritate:** High.

**De implementat:** Administrarea punctelor / intervalelor proprii și citirea opțiunilor prin `/producers/:id/pickup-slots`, în `features/pickup/`.

**Acceptare / verificare:** Punctele aparțin producătorului autentificat; intervalele au început, sfârșit, fus orar și capacitate valide. Intervalele trecute sau pline nu sunt rezervabile. Contractul permite rezervarea atomică din US05 fără să depindă de existența comenzilor în UI.

**Dependențe:** [DS-28 - BACK - API pentru înregistrare, login, logout și utilizatorul curent](https://din-sat.atlassian.net/browse/DS-28), [DS-32 - BACK - API pentru citirea și actualizarea profilului](https://din-sat.atlassian.net/browse/DS-32), [DS-25 - BACK - Alegerea persistenței și datele demo](https://din-sat.atlassian.net/browse/DS-25).

### FRONT - Administrarea ridicărilor de către producător

**Jira:** [DS-52](https://din-sat.atlassian.net/browse/DS-52) · **Responsabil Jira:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Formulare pentru puncte și intervale, listarea disponibilității și editarea datelor permise.

**Acceptare / verificare:** Producătorul își gestionează propriile puncte și intervale. Formularele tratează datele invalide și conflictele; schimbarea capacității nu permite coborârea sub rezervările existente, conform validării serverului.

**Dependențe:** [DS-30 - FRONT - Sesiune frontend și navigare în funcție de rol](https://din-sat.atlassian.net/browse/DS-30), [DS-46 - BACK - API pentru puncte, intervale și disponibilitate](https://din-sat.atlassian.net/browse/DS-46), [DS-26 - FRONT - Componente UI și convenții vizuale](https://din-sat.atlassian.net/browse/DS-26).

### FRONT - Selectarea ridicării în checkout

**Jira:** [DS-49](https://din-sat.atlassian.net/browse/DS-49) · **Responsabil Jira:** Daniel.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Selector de punct și interval pentru producătorul coșului, pregătit pentru integrarea în checkout.

**Acceptare / verificare:** Sunt afișate doar opțiunile producătorului curent. Opțiunile pline sunt indisponibile; schimbarea producătorului elimină selecția veche. Dacă serverul raportează că intervalul s-a ocupat, lista se reîncarcă și cumpărătorul poate selecta altul.

**Dependențe:** [DS-46 - BACK - API pentru puncte, intervale și disponibilitate](https://din-sat.atlassian.net/browse/DS-46), [DS-45 - FRONT - Coș local cu un singur producător](https://din-sat.atlassian.net/browse/DS-45).

### FRONT - Afișarea consecventă a datei și fusului orar

**Jira:** [DS-53](https://din-sat.atlassian.net/browse/DS-53) · **Responsabil Jira:** Dan.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Formatarea reutilizabilă a orelor și verificarea prezentării în administrare și selector, cu fusul orar al punctului.

**Acceptare / verificare:** Ora punctului și fusul orar sunt explicite; schimbarea fusului browserului nu schimbă intervalul rezervat. Sunt verificate o dată de lângă miezul nopții și un caz cu schimbare sezonieră a orei, dacă zona aleasă o folosește.

**Dependențe:** [DS-52 - FRONT - Administrarea ridicărilor de către producător](https://din-sat.atlassian.net/browse/DS-52), [DS-49 - FRONT - Selectarea ridicării în checkout](https://din-sat.atlassian.net/browse/DS-49).

## US07 - Urmărirea comenzilor

**Parent:** [DS-18](https://din-sat.atlassian.net/browse/DS-18) · **Tip:** Subtask.

### BACK - API pentru lista și detaliile comenzilor permise

**Jira:** [DS-54](https://din-sat.atlassian.net/browse/DS-54) · **Responsabil Jira:** Egor.

**Repository:** din_sat_api · **Prioritate:** High.

**De implementat:** `/orders` și `/orders/:id`, filtrate după utilizatorul și rolul din sesiune, cu paginare și DTO-uri publice.

**Acceptare / verificare:** Cumpărătorul vede propriile comenzi, producătorul pe cele primite. Accesul prin ID la o comandă străină este refuzat. Detaliile includ articolele istorice, totalul, statusul și ridicarea.

**Dependențe:** [DS-28 - BACK - API pentru înregistrare, login, logout și utilizatorul curent](https://din-sat.atlassian.net/browse/DS-28), [DS-47 - BACK - Crearea atomică a comenzii și rezervarea resurselor](https://din-sat.atlassian.net/browse/DS-47).

### FRONT - Listele de comenzi pentru cumpărător și producător

**Jira:** [DS-55](https://din-sat.atlassian.net/browse/DS-55) · **Responsabil Jira:** Dan.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Paginile de listare, paginarea și navigarea spre detalii în `presentation/features/orders/`.

**Acceptare / verificare:** Lista corespunde contului și rolului curent. Sunt tratate încărcarea, lipsa comenzilor și eroarea API; schimbarea contului nu afișează lista anterioară.

**Dependențe:** [DS-30 - FRONT - Sesiune frontend și navigare în funcție de rol](https://din-sat.atlassian.net/browse/DS-30), contract [DS-54 - BACK - API pentru lista și detaliile comenzilor permise](https://din-sat.atlassian.net/browse/DS-54); integrare după [DS-54 - BACK - API pentru lista și detaliile comenzilor permise](https://din-sat.atlassian.net/browse/DS-54).

### FRONT - Pagina de detalii și afișarea statusului

**Jira:** [DS-56](https://din-sat.atlassian.net/browse/DS-56) · **Responsabil Jira:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Detaliile articolelor, prețurile salvate, totalul, punctul / intervalul și statusul curent, cu reîncărcare explicită după modificări.

**Acceptare / verificare:** Pagina folosește datele istorice din comandă. Comanda inexistentă sau interzisă are mesaj potrivit; data include fusul orar. După o acțiune livrată în US08, reîncărcarea afișează statusul confirmat de server.

**Dependențe:** [DS-54 - BACK - API pentru lista și detaliile comenzilor permise](https://din-sat.atlassian.net/browse/DS-54), [DS-55 - FRONT - Listele de comenzi pentru cumpărător și producător](https://din-sat.atlassian.net/browse/DS-55).

### BACK - Verificarea istoricului și a accesului între conturi

**Jira:** [DS-57](https://din-sat.atlassian.net/browse/DS-57) · **Responsabil Jira:** Daniel.

**Repository:** din_sat_api · **Prioritate:** High.

**De implementat:** Scenarii pentru prețuri / titluri schimbate după comandă, produs arhivat și accesul unui al doilea cumpărător / producător.

**Acceptare / verificare:** Modificarea sau arhivarea produsului nu schimbă articolele și totalul unei comenzi existente. Alți participanți neautorizați nu pot citi comanda; DTO-ul nu expune date interne.

**Dependențe:** [DS-54 - BACK - API pentru lista și detaliile comenzilor permise](https://din-sat.atlassian.net/browse/DS-54), [DS-36 - BACK - API de creare, editare și arhivare a produselor](https://din-sat.atlassian.net/browse/DS-36), [DS-47 - BACK - Crearea atomică a comenzii și rezervarea resurselor](https://din-sat.atlassian.net/browse/DS-47).

## US08 - Pregătire și anulare

**Parent:** [DS-19](https://din-sat.atlassian.net/browse/DS-19) · **Tip:** Subtask.

### BACK - Tranziții de status și permisiuni pe backend

**Jira:** [DS-58](https://din-sat.atlassian.net/browse/DS-58) · **Responsabil Jira:** Egor.

**Repository:** din_sat_api · **Prioritate:** Highest.

**De implementat:** Politica de tranziții și `PATCH /orders/:id/status`: Nouă → Confirmată → În pregătire → Gata de ridicare → Finalizată. Controlul concurenței pentru modificarea statusului.

**Acceptare / verificare:** Doar producătorul comenzii modifică progresul; nu se sar etape și nu se modifică o comandă terminală. O cerere concurentă nu poate suprascrie un status deja schimbat fără revalidare. Sunt testate tranzițiile valide și invalide.

**Dependențe:** [DS-47 - BACK - Crearea atomică a comenzii și rezervarea resurselor](https://din-sat.atlassian.net/browse/DS-47), [DS-54 - BACK - API pentru lista și detaliile comenzilor permise](https://din-sat.atlassian.net/browse/DS-54).

### BACK - Anularea atomică și restituirea resurselor o singură dată

**Jira:** [DS-59](https://din-sat.atlassian.net/browse/DS-59) · **Responsabil Jira:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_api · **Prioritate:** Highest.

**De implementat:** `/orders/:id/cancel`, autorizarea participantului și restabilirea stocului / capacității în aceeași operație atomică cu anularea.

**Acceptare / verificare:** Anularea este permisă din Nouă sau Confirmată, conform regulilor stabilite. Repetarea sau două anulări simultane nu dublează restituirea. Cursa dintre anulare și trecerea la În pregătire produce un rezultat valid, fără stare parțială; verificare cu persistența reală.

**Dependențe:** [DS-58 - BACK - Tranziții de status și permisiuni pe backend](https://din-sat.atlassian.net/browse/DS-58), [DS-48 - BACK - Idempotență pentru reîncercarea comenzii](https://din-sat.atlassian.net/browse/DS-48), [DS-46 - BACK - API pentru puncte, intervale și disponibilitate](https://din-sat.atlassian.net/browse/DS-46).

### FRONT - Pagina de pregătire și finalizare a ridicărilor

**Jira:** [DS-60](https://din-sat.atlassian.net/browse/DS-60) · **Responsabil Jira:** Daniel.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Vizualizarea comenzilor producătorului după interval și comenzile de confirmare, pregătire, gata de ridicare și finalizare.

**Acceptare / verificare:** Sunt oferite doar acțiunile permise pentru statusul curent. O eroare păstrează starea confirmată anterior; succesul reîncarcă datele. Un alt producător nu poate opera comenzile prin API.

**Dependențe:** [DS-54 - BACK - API pentru lista și detaliile comenzilor permise](https://din-sat.atlassian.net/browse/DS-54), [DS-58 - BACK - Tranziții de status și permisiuni pe backend](https://din-sat.atlassian.net/browse/DS-58), [DS-46 - BACK - API pentru puncte, intervale și disponibilitate](https://din-sat.atlassian.net/browse/DS-46).

### FRONT - Acțiunea de anulare și feedback-ul pentru participanți

**Jira:** [DS-61](https://din-sat.atlassian.net/browse/DS-61) · **Responsabil Jira:** Dan.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Confirmarea anulării în detaliile comenzii și afișarea rezultatului / motivului pentru care anularea nu este disponibilă.

**Acceptare / verificare:** Utilizatorul confirmă înainte de cerere; un conflict de status este afișat și comanda se reîncarcă. Interfața nu arată succes înaintea API-ului, iar click-urile repetate nu produc feedback contradictoriu.

**Dependențe:** [DS-56 - FRONT - Pagina de detalii și afișarea statusului](https://din-sat.atlassian.net/browse/DS-56), [DS-59 - BACK - Anularea atomică și restituirea resurselor o singură dată](https://din-sat.atlassian.net/browse/DS-59).

## US09 - Dashboard

**Parent:** [DS-20](https://din-sat.atlassian.net/browse/DS-20) · **Tip:** Subtask.

### BACK - Agregate backend pentru producător

**Jira:** [DS-62](https://din-sat.atlassian.net/browse/DS-62) · **Responsabil Jira:** Egor.

**Repository:** din_sat_api · **Prioritate:** High.

**De implementat:** `/producer/dashboard` cu număr de comenzi, valoare finalizată, comenzi active / anulate și produse populare, limitate la producătorul autentificat.

**Acceptare / verificare:** Totalurile sunt calculate pe server, cu interval de raportare explicit. Contul fără comenzi primește valori zero; comenzile anulate sunt separate. Monedele diferite nu sunt însumate fără o regulă documentată.

**Dependențe:** [DS-47 - BACK - Crearea atomică a comenzii și rezervarea resurselor](https://din-sat.atlassian.net/browse/DS-47), [DS-58 - BACK - Tranziții de status și permisiuni pe backend](https://din-sat.atlassian.net/browse/DS-58), [DS-59 - BACK - Anularea atomică și restituirea resurselor o singură dată](https://din-sat.atlassian.net/browse/DS-59).

### FRONT - Carduri și vizualizarea statisticilor

**Jira:** [DS-63](https://din-sat.atlassian.net/browse/DS-63) · **Responsabil Jira:** Dan.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Cardurile de statistici și lista produselor populare, cu loading, eroare și stare fără date.

**Acceptare / verificare:** Numerele și monedele corespund API-ului; zero comenzi se afișează corect. Pagina este utilizabilă pe mobil, iar statisticile sunt disponibile doar în contextul producătorului.

**Dependențe:** [DS-30 - FRONT - Sesiune frontend și navigare în funcție de rol](https://din-sat.atlassian.net/browse/DS-30), contract [DS-62 - BACK - Agregate backend pentru producător](https://din-sat.atlassian.net/browse/DS-62); integrare după [DS-62 - BACK - Agregate backend pentru producător](https://din-sat.atlassian.net/browse/DS-62).

### FRONT - Filtrarea dashboard-ului după perioadă

**Jira:** [DS-64](https://din-sat.atlassian.net/browse/DS-64) · **Responsabil Jira:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Alegerea perioadei de raportare și încărcarea agregatelor pentru intervalul selectat, fără duplicarea calculelor serverului în UI.

**Acceptare / verificare:** O perioadă invalidă este respinsă; intervalul folosit este vizibil. Schimbarea rapidă a filtrului nu lasă date de la perioada anterioară. Sunt verificate capetele intervalului și fusul orar convenit.

**Dependențe:** [DS-62 - BACK - Agregate backend pentru producător](https://din-sat.atlassian.net/browse/DS-62), [DS-63 - FRONT - Carduri și vizualizarea statisticilor](https://din-sat.atlassian.net/browse/DS-63).

### BACK - Definirea și reconcilierea indicatorilor

**Jira:** [DS-65](https://din-sat.atlassian.net/browse/DS-65) · **Responsabil Jira:** Daniel.

**Repository:** din_sat_api · **Prioritate:** High.

**De implementat:** Documentarea formulelor și scenariu cu comenzi active, finalizate și anulate, pentru două conturi de producător.

**Acceptare / verificare:** Valorile API se pot reconcilia cu datele de test; comenzile altui producător nu intră în total. Este explicit ce statusuri intră în fiecare indicator și cum sunt tratate limitele perioadei.

**Dependențe:** contract [DS-62 - BACK - Agregate backend pentru producător](https://din-sat.atlassian.net/browse/DS-62); verificare după [DS-62 - BACK - Agregate backend pentru producător](https://din-sat.atlassian.net/browse/DS-62).

## US10 - Cumpărături asistate de AI, opțional

**Parent:** [DS-21](https://din-sat.atlassian.net/browse/DS-21) · **Tip:** Subtask.

### BACK - Instrumente backend pentru catalog și ridicări

**Jira:** [DS-66](https://din-sat.atlassian.net/browse/DS-66) · **Responsabil Jira:** Egor.

**Repository:** din_sat_api · **Prioritate:** Medium.

**De implementat:** Instrumente validate pentru căutarea produselor, detalii și opțiuni de ridicare, folosind cazurile de utilizare existente prin contracte explicite.

**Acceptare / verificare:** Instrumentele întorc doar date reale, respectă accesul și limitează rezultatele. Nu acceptă SQL arbitrar, identitate sau prețuri stabilite de model. Sunt testate argumentele invalide, ID-ul absent și stocul epuizat.

**Dependențe:** [DS-41 - BACK - API de catalog, filtre și paginare](https://din-sat.atlassian.net/browse/DS-41), [DS-46 - BACK - API pentru puncte, intervale și disponibilitate](https://din-sat.atlassian.net/browse/DS-46), [DS-28 - BACK - API pentru înregistrare, login, logout și utilizatorul curent](https://din-sat.atlassian.net/browse/DS-28).

### BACK - Orchestrarea agentului și propunerile de coș

**Jira:** [DS-67](https://din-sat.atlassian.net/browse/DS-67) · **Responsabil Jira:** Daniel.

**Repository:** din_sat_api · **Prioritate:** Medium.

**De implementat:** Adaptorul furnizorului AI, `/ai/chat`, apelarea controlată a instrumentelor și propuneri temporare cu expirare. Numărul apelurilor, durata și utilizarea per cont sunt limitate.

**Acceptare / verificare:** Cheia AI rămâne pe server; descrierile produselor sunt tratate ca date. Propunerile au doar ID-uri existente și total calculat determinist. Agentul nu creează comenzi; timeout-ul furnizorului nu blochează catalogul și checkout-ul.

**Dependențe:** [DS-66 - BACK - Instrumente backend pentru catalog și ridicări](https://din-sat.atlassian.net/browse/DS-66).

### FRONT - Interfața conversației și afișarea propunerilor

**Jira:** [DS-68](https://din-sat.atlassian.net/browse/DS-68) · **Responsabil Jira:** Dan.

**Repository:** din_sat_front · **Prioritate:** Medium.

**De implementat:** Conversația, stările de încărcare / eroare și cardurile propunerii, cu acțiune explicită de confirmare.

**Acceptare / verificare:** Produsele, cantitățile și totalul sunt cele returnate de backend. Refuzul nu schimbă coșul; indisponibilitatea AI are feedback clar și utilizatorul poate continua cumpărăturile manual.

**Dependențe:** [DS-30 - FRONT - Sesiune frontend și navigare în funcție de rol](https://din-sat.atlassian.net/browse/DS-30), contract [DS-67 - BACK - Orchestrarea agentului și propunerile de coș](https://din-sat.atlassian.net/browse/DS-67); integrare după [DS-67 - BACK - Orchestrarea agentului și propunerile de coș](https://din-sat.atlassian.net/browse/DS-67).

### BACK - Confirmarea și revalidarea propunerilor AI

**Jira:** [DS-69](https://din-sat.atlassian.net/browse/DS-69) · **Responsabil Jira:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_api · **Prioritate:** Medium.

**De implementat:** Implementarea /ai/cart-proposals/:id/confirm, cu verificarea proprietarului și expirării, revalidarea produselor, stocului și prețurilor și întoarcerea articolelor canonice pentru coș.

**Acceptare / verificare:** Propunerea altui cont sau cea expirată este respinsă. Prețurile și stocul sunt revalidate, iar articolele respectă un singur producător. Confirmarea nu creează o comandă și nu ocolește checkout-ul.

**Dependențe:** [DS-67 - BACK - Orchestrarea agentului și propunerile de coș](https://din-sat.atlassian.net/browse/DS-67).

### FRONT - Adăugarea în coș a propunerii AI confirmate

**Jira:** [DS-70](https://din-sat.atlassian.net/browse/DS-70) · **Responsabil Jira:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_front · **Prioritate:** Medium.

**De implementat:** La confirmarea explicită a utilizatorului, apelarea endpoint-ului de revalidare și actualizarea coșului local exclusiv cu articolele canonice returnate de backend.

**Acceptare / verificare:** Refuzul nu schimbă coșul. Propunerea expirată sau invalidată are un mesaj clar; se respectă regula unui singur producător și se cere o alegere explicită dacă este necesară înlocuirea coșului. Actualizarea reușită nu plasează automat comanda.

**Dependențe:** [DS-68 - FRONT - Interfața conversației și afișarea propunerilor](https://din-sat.atlassian.net/browse/DS-68), [DS-69 - BACK - Confirmarea și revalidarea propunerilor AI](https://din-sat.atlassian.net/browse/DS-69), [DS-45 - FRONT - Coș local cu un singur producător](https://din-sat.atlassian.net/browse/DS-45).

## US11 - Abonament producător, propunere opțională

**Necreate în Jira.** Parent-ul și includerea în backlog trebuie stabilite dacă adăugați Story-ul.

### BACK - Planuri și limite verificate pe server

**Stare:** propunere locală · **Responsabil propus:** Egor.

**Repository:** din_sat_api · **Prioritate:** Medium.

**De implementat:** Planul curent și politicile de publicare / activare pentru produse și puncte de ridicare, în `features/billing/`, cu porturi către funcționalitățile afectate.

**Acceptare / verificare:** Pentru prototip, limitele propuse sunt Free: 10 produse active / 1 punct; Pro: 50 / 3, de confirmat cu echipa. Cererile concurente și reactivarea nu ocolesc limita. Downgrade-ul nu șterge istoricul sau produsele existente.

**Dependențe:** [DS-36 - BACK - API de creare, editare și arhivare a produselor](https://din-sat.atlassian.net/browse/DS-36), [DS-46 - BACK - API pentru puncte, intervale și disponibilitate](https://din-sat.atlassian.net/browse/DS-46), [DS-28 - BACK - API pentru înregistrare, login, logout și utilizatorul curent](https://din-sat.atlassian.net/browse/DS-28).

### FRONT - Pagina planurilor și abonamentul curent

**Stare:** propunere locală · **Responsabil propus:** Dan.

**Repository:** din_sat_front · **Prioritate:** Medium.

**De implementat:** Afișarea planului, limitelor și utilizării curente, inclusiv mesaje la atingerea limitei.

**Acceptare / verificare:** UI-ul reflectă drepturile întoarse de backend și nu acordă Pro local. Modul demo este marcat explicit; prețul nu este prezentat ca stabilit dacă nu a fost decis.

**Dependențe:** `BACK - Planuri și limite verificate pe server`, [DS-30 - FRONT - Sesiune frontend și navigare în funcție de rol](https://din-sat.atlassian.net/browse/DS-30).

### BACK - Schimbarea demonstrativă a planului în mediul de test

**Stare:** propunere locală · **Responsabil propus:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_api · **Prioritate:** Medium.

**De implementat:** Implementarea schimbării demonstrative a planului într-un mediu de test controlat, cu upgrade și downgrade, pentru verificarea politicilor de acces.

**Acceptare / verificare:** Simularea nu este expusă printr-un endpoint public care acordă Pro. Sunt verificate limita produselor, reactivarea și păstrarea datelor la downgrade, fără plăți reale.

**Dependențe:** `BACK - Planuri și limite verificate pe server`.

### FRONT - Fluxul demonstrativ de schimbare a planului

**Stare:** propunere locală · **Responsabil propus:** Neasignat; planificat pentru Alex.

**Repository:** din_sat_front · **Prioritate:** Medium.

**De implementat:** Interfața demonstrativă de upgrade și downgrade, disponibilă în mediul de test controlat, cu mesaje pentru utilizarea și limitele planului returnate de backend.

**Acceptare / verificare:** Modul demo este marcat explicit. UI-ul nu acordă local drepturi Pro; sunt afișate corect noul plan și restricțiile la publicare, fără ștergerea produselor existente.

**Dependențe:** `FRONT - Pagina planurilor și abonamentul curent`, `BACK - Schimbarea demonstrativă a planului în mediul de test`.

### BACK - Integrarea abonamentelor sandbox și webhook-urilor

**Stare:** propunere locală · **Responsabil propus:** Daniel.

**Repository:** din_sat_api · **Prioritate:** Low.

**De implementat:** Adaptorul procesatorului ales, checkout sandbox, verificarea semnăturii și procesarea durabilă a evenimentelor.

**Acceptare / verificare:** Redirect-ul din browser nu acordă singur acces Pro. Evenimentele duplicate nu dublează efectele, cele întârziate nu reactivează incorect accesul, iar semnătura invalidă este respinsă. Se verifică upgrade / anulare în sandbox și retry după eșecul persistenței.

**Dependențe:** `BACK - Planuri și limite verificate pe server`, `FRONT - Pagina planurilor și abonamentul curent`; alegerea procesatorului · **Scop:** extensie suplimentară opțională.

## US12 - Experiență coerentă și verificabilă, propunere

**Necreate în Jira.** Parent-ul și includerea în backlog trebuie stabilite dacă adăugați Story-ul.

### BACK - CI și verificarea combinației de submodule

**Stare:** propunere locală · **Responsabil propus:** Daniel.

**Repository:** din_sat + din_sat_api + din_sat_front · **Prioritate:** High.

**De implementat:** Verificările automate per repository și verificarea integrării cu SHA-uri fixate în părinte, folosind mediul de date ales.

**Acceptare / verificare:** O clonare recursivă reproduce verificarea. Lint-ul, testele relevante și build-ul trec; commit-urile copil fixate sunt publicate și accesibile echipei. Integrările opționale neincluse nu blochează verificarea de bază.

**Dependențe:** [DS-27 - BACK - Pornirea integrată și configurarea locală](https://din-sat.atlassian.net/browse/DS-27) și funcționalitățile incluse în livrare.

### FRONT - Audit UI, mobil și accesibilitate

**Stare:** propunere locală · **Responsabil propus:** Dan.

**Repository:** din_sat_front · **Prioritate:** High.

**De implementat:** Audit transversal pentru formulare, navigare cu tastatura, focus, loading, erori și stări goale; corectarea problemelor identificate.

**Acceptare / verificare:** Fluxul de bază funcționează la 360 px și desktop. Câmpurile au etichete, erorile sunt clare și API-ul indisponibil nu lasă interfața blocată. Rezultatele sunt documentate fără a înlocui verificările din fiecare Story.

**Dependențe:** paginile incluse în livrare.

### BACK - Documentație de pornire, API și persistență

**Stare:** propunere locală · **Responsabil propus:** Egor.

**Repository:** din_sat_api + din_sat · **Prioritate:** High.

**De implementat:** Actualizarea README-urilor, variabilelor exemplu, inițializării datelor, contractului API și procedurilor pentru teste.

**Acceptare / verificare:** Un coleg pornește proiectul din instrucțiuni, fără pași ascunși. Contractul corespunde implementării, datele demo sunt reproductibile și nu sunt publicate secrete. Lista echipei îi include pe Daniel, Dan, Egor și Alex.

**Dependențe:** soluția de date și contractele implementate.

### BACK - Scenariul complet, regresii și dovezi pentru prezentare

**Stare:** propunere locală · **Responsabil propus:** Neasignat; planificat pentru Alex.

**Repository:** din_sat · **Prioritate:** High.

**De implementat:** Verificare end-to-end: producătorul publică → cumpărătorul găsește produsul → comandă și alege ridicarea → producătorul pregătește / finalizează. Pregătirea datelor, capturilor și linkurilor PR / Jira pentru contribuțiile fiecărui membru.

**Acceptare / verificare:** Scenariul este reproductibil cu date fictive; sunt documentate și un conflict de stoc, o anulare și accesul refuzat între conturi. Extensiile sunt prezentate numai dacă sunt implementate. Nu se duplică testele de concurență izolate din US05 și US08.

**Dependențe:** US01-US09, `BACK - CI și verificarea combinației de submodule`, `FRONT - Audit UI, mobil și accesibilitate`, `BACK - Documentație de pornire, API și persistență`; US10 / US11 numai dacă sunt incluse.

## Ordinea de lucru

Inițializați API-ul și frontend-ul, definiți contractele și soluția de date, apoi verificați pornirea integrată. Livrați autentificarea, profilul și produsele; continuați cu catalogul și API-ul de ridicări în paralel. Coșul și selectorul de ridicare deblochează checkout-ul; crearea atomică a comenzii și idempotența se verifică înainte de finalizarea fluxului. Continuați cu istoricul comenzilor, statusurile, anularea și dashboard-ul. Extensiile AI / abonamente se abordează după stabilizarea fluxului de bază.

## Criterii de închidere a unui Story

- Criteriile de acceptare, inclusiv erorile și accesul, sunt îndeplinite.
- Subtask-urile necesare sunt încheiate și codul a fost revizuit de alt coleg.
- Testele relevante trec și interfața este verificată cu API-ul real.
- Commit-urile copil publicate sunt verificate împreună și fixate în repository-ul principal.
- Documentația și contractul afectate sunt actualizate.

## Surse și limite

- Stories, descrieri, tipuri și utilizatori asignabili verificate direct în Jira, proiectul DS, la 27.10.2026.
- [Planul inițial](/Users/pinzaru/Downloads/DinSat_Plan_Proiect_Jira.pdf): referință pentru criterii; cerințele actuale ale echipei au prioritate.
- [README principal](../README.md), [API](../src/din_sat_api/README.md), [frontend](../src/din_sat_front/README.md): arhitectura actuală.
- Celelalte activități preexistente, inclusiv prezentarea MVP, nu au fost redenumite sau reasignate.
