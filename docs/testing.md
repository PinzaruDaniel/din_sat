# Verificarea integrării PostgreSQL

Data: **4 noiembrie 2026**. Implementare locală, fără commit / push sau deployment cloud în această etapă.

## Rezultate

| Verificare                                                      | Rezultat                                   |
| --------------------------------------------------------------- | ------------------------------------------ |
| API: teste HTTP, configurație și PostgreSQL, cu `.env` încărcat | 23 teste trecute, fără skip                |
| PostgreSQL separat: repository-uri, concurență și sesiuni       | 8 teste trecute, incluse și în totalul API |
| Frontend: teste unitare / componente / client HTTP              | 19 teste trecute                           |
| Playwright cu API PostgreSQL și date existente                  | 3 scenarii trecute                         |
| Lint / format API și frontend, build frontend, diff check       | Trecute                                    |
| `db:migrate`, seed repetat, `db:check`                          | Verificate pe PostgreSQL 18 local          |

Testele DB folosesc două conexiuni reale și scheme aleatoare din `dinsat_test`. Sunt verificate ultimul produs, ultimul loc de ridicare, idempotența concurentă, rollback-ul după rezervare, anularea repetată / concurentă, emailul unic, izolarea între conturi, istoricul și persistența sesiunii după recrearea runtime-ului. Logout-ul rămâne revocat după încă un restart. Seed-ul este verificat și după avansarea datei, fără modificarea comenzilor istorice.

Scenariile browser verifică cumpărător → checkout → anulare, producător → produs → ridicare → cumpărător → comandă → finalizare și interfața la 360 px. Testele selectează comanda după ID-ul răspunsului API, deci nu presupun că baza e goală. Au creat înregistrări fictive în baza locală a aplicației; nu au resetat istoricul.

## Catalog, profil și produse

Verificare din **8 noiembrie 2026** pe API, PostgreSQL local și Chromium. Combinația `q=grădină&category=legume&locality=Ialoveni` a afișat aceleași articole și același total în interfață și în API. Cu `pageSize=1`, prima pagină permite avansarea, ultima dezactivează butonul „Înainte”, iar reîncărcarea păstrează pagina și filtrele din URL. O căutare fără potriviri afișează o listă goală și resetarea revine la catalog.

Scenariul de producător a verificat la 360 px editarea profilului, mesajele de validare, previzualizarea unei imagini încărcate, publicarea, editarea și arhivarea produsului. După arhivare, pagina publică afișează „Produs indisponibil”. API-ul exclude produsul din rezultate și din total, iar detaliile comenzii păstrează articolul cu titlul și prețul de la plasare. Un test PostgreSQL cu reconectare verifică profilul, fișierul încărcat și produsul arhivat.

## Reproducere

```bash
# Din rădăcina repository-ului principal
node scripts/local-postgres.mjs start
npm --prefix src/din_sat_api run db:migrate
npm --prefix src/din_sat_api run db:seed
npm --prefix src/din_sat_api run db:check
npm --prefix src/din_sat_api run lint
npm --prefix src/din_sat_api test
npm --prefix src/din_sat_api run test:postgres
npm --prefix src/din_sat_front run lint
npm --prefix src/din_sat_front test
npm --prefix src/din_sat_front run build
```

Testele API standard nu încarcă `.env` și sar verificările PostgreSQL dacă `TEST_DATABASE_URL` nu este exportat. Comanda `test:postgres` încarcă `.env` și trebuie rulată separat; pentru totalul complet din tabel s-a folosit `node --env-file=.env --test tests/**/*.test.js` din API.

Cu API-ul și Vite pornite, rulează `npm --prefix src/din_sat_front run test:e2e`. Într-un sandbox, listener-ele HTTP și conexiunile PostgreSQL pot necesita permisiune de execuție în afara sandbox-ului; acest lucru nu schimbă testele.

## Limitele verificării

- Docker nu este disponibil pe această mașină: imaginea API și Compose sunt pregătite, dar build-ul / pornirea lor nu au fost executate.
- Hosting-ul, TLS-ul și proxy-ul unui furnizor cloud nu au fost testate pe un cont real. Instrucțiunile sunt în [ghidul de hosting](hosting.md).
- Sesiunile sunt durabile; rate limiting-ul rămâne local procesului până la implementarea unui store partajat.
- Cantitățile rămân întregi și moneda MDL, potrivit contractului implementat. Nu s-au adăugat AI, billing sau endpoint-uri CRUD care lipsesc din versiunea actuală.
