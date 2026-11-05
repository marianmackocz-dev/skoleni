## 1 Agentní stack a oprava řízená testy

Rozlišit odpovědnost modelu a harnessu a opravit doménu bez oslabení existujících testů.


### Model a vývojové prostředí

Model navrhuje další akci. Harness sestavuje kontext, zpřístupňuje nástroje, provádí povolené operace a vrací výsledek. Samotný jazykový model nemá přímý přístup k disku, databázi ani terminálu. Při rozboru incidentu proto oddělte chybný návrh, nadměrné oprávnění nástroje a chybějící kontrolu výsledku. V DeliveryDesk model opravuje TypeScript, ale návratový kód testovacího procesu rozhoduje o úspěchu.

Návrh změny, diff a výsledek testu jsou tři samostatné důkazy.


### Ověřitelný pracovní kontrakt

Zadání obsahuje dotčené cesty, požadované chování, omezení změn a příkazy pro ověření. Před první úpravou spusťte testy a uložte výchozí chyby. Příkaz npm test ověřuje doménu a HTTP s paměťovým repozitářem. Neověřuje PostgreSQL. npm run verify přidává typovou kontrolu a produkční build Angularu. Databázi a prohlížeč ověřují samostatné integrační a E2E příkazy.

NEW smí přejít pouze do IN_PROGRESS. DONE je koncový stav.


### Regresní a charakterizační testy

Charakterizační test zaznamenává dnešní chování, které nemusí být správné. Regresní test vyjadřuje požadované pravidlo po opravě. U refaktoringu zachovejte veřejný kontrakt a přidejte hraniční hodnoty. Kontrolujte nejen počet testů nebo coverage, ale i kvalitu tvrzení: odmítnutí neplatného přechodu, negativní částku, NaN, idempotentní opakování a konflikt verze. Test, který zkopíruje algoritmus implementace, může zopakovat stejnou chybu.

Porovnejte výsledek s obchodním pravidlem, nikoliv s druhou kopií výpočtu.


### Interaktivní a dávkové použití Claude Code

Začněte interaktivně, prohlédněte plán a první diff. Režim claude -p je vhodný pro opakovatelnou úlohu s dostupnými nástroji, explicitním limitem tahů a rozpočtem. Rozpočet jednotlivého procesu nenahrazuje rozpočet celé orchestrace. Při práci bez obsluhy musí chybějící oprávnění vyvolat čitelný neúspěch. Účastníci nesmějí řešit chybějící autorizaci plošným vypnutím kontrol.

Před spuštěním zaznamenejte claude --version a claude --help.


### Rychlý postup pro zkušené

```sh

npm run lab -- starter01
npm test
claude
npm run verify
git diff -- packages/domain/workflow.ts

```


### Detailní postup

1. Ve VS Code zvolte File > Open Folder, otevřete rozbalenou složku course a potvrďte důvěru pouze pro tento zkontrolovaný výukový projekt. Zvolte Terminal > New Terminal a ověřte, že terminál je v kořeni s package.json.

2. Napište npm run lab -- starter01 a Enter. Otevřete packages/domain/workflow.ts. Dvě krátké funkce obsahují záměrné chyby. Řešení zatím neotvírejte.

3. Napište npm test. Očekávejte neúspěšné testy přechodů a peněžních částek. Do poznámek zapište alespoň jednu chybovou hlášku a očekávanou hodnotu. Zde je červený výsledek správný výchozí stav.

4. Napište claude a dokončete přihlášení ve vlastním účtu podle firemní politiky. Přečtěte žádost o důvěru a dostupná oprávnění. Vložte celý prompt níže, nikoliv pouze větu „oprav testy“.

5. Před změnou požádejte agenta o plán a seznam dotčených souborů. Povolte pouze změnu doménové funkce. Pokud navrhne změnit pravidlo nebo očekávání existujícího testu, zastavte tento návrh a vraťte ho k zadání.

6. Po opravě v novém terminálu spusťte npm run verify. Otevřete Source Control a prohlédněte diff. Ověřte, že se nezměnily existující testy, package.json ani lockfile.

7. Spusťte API a web podle úvodního návodu. V prohlížeči otevřete http://127.0.0.1:4200, klikněte Advance 1 a zkontrolujte IN_PROGRESS. Druhé kliknutí vede do DONE. Zaznamenejte skutečně provedené kontroly.


### Prompt

Oprav pouze packages/domain/workflow.ts podle CLAUDE.md. Nejdřív spusť npm test a vysvětli chyby. Zachovej testy a kontrakty. Navrhni minimální změnu, spusť npm run verify a dolož exit codes a diff.


### Akceptace

- Existující testy nejprve selžou a po opravě projdou.

- Diff mění jen povolenou doménovou implementaci.

- Agent doloží skutečné příkazy a omezení testů.


### Řešení a vysvětlení

Referenční opravu lze načíst npm run lab -- solution01. Obě platné hrany jsou explicitní. Částka odmítá neplatné hodnoty a zaokrouhluje na centy. Finanční doména s libovolnými desetinnými čísly by vyžadovala přesnější vstupní kontrakt nebo decimal knihovnu.


### Troubleshooting

- claude nebyl nalezen: ověřte oficiální instalaci před kurzem, alternativně pracujte ručně a porovnejte diff.

- API vrací 500: ověřte DATABASE_URL a migraci; bez DB lze explicitně zapnout APP_STORE=memory.

- Typová chyba Angularu po npm install: použijte uzamčený npm ci a TypeScript 6.0.3, nikoliv nejnovější TypeScript 7.


### Rozšíření mimo čas kurzu

Přidejte nový generovaný test zachování koncového stavu. Nechte jiného účastníka posoudit, zda skutečně testuje pravidlo.
