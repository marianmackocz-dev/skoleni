## 8 Integrační projekt a týmová adopce

Provést změnu napříč databází API UI a MCP s generovanými testy a doloženým předáním.


### Zadání závěrečného projektu

Přidejte prioritu tiketu LOW, NORMAL nebo HIGH. Výchozí hodnota je NORMAL. Prioritu přeneste databází, typy, API i Angular zobrazením a filtrem. MCP list přidá nepovinný filtr priority, přičemž staré volání bez filtru musí dál fungovat. Migrace zachová existující data. Generované testy musí pokrýt výchozí hodnotu, neplatný vstup, filtr a zpětnou kompatibilitu.

Každý akceptační bod musí mít vlastní spustitelný důkaz.


### Plán a vlastnictví

V prvních minutách určete vlastníka schématu a sdíleného kontraktu. Po jeho uzavření mohou paralelně pokračovat UI a backend. Reviewer testů navrhne scénáře před implementací. Koordinátor udržuje seznam závislostí a integrační commit. Při nedostatku času omezte rozšíření, ale nepřeskočte migraci ani původní regresní testy.

SQL a kontrakt předcházejí integraci UI a MCP.


### Akceptace a předání

Předání obsahuje změny, migrační postup, příkazy a výsledky testů, zbývající omezení a návratový postup. Změnu prezentujte v prohlížeči a přes MCP. Ukažte i neplatný vstup. Databázovou změnu nelze vydávat za ověřenou pouze na základě paměťového repozitáře. Chybějící důkaz označte a rozhodnutí GO podmiňte jeho doplněním.

Prezentace výsledku má dvě minuty a ukazuje konkrétní chování.


### Zavedení do týmu

Po kurzu vyberte omezenou sadu repozitářů a typů úloh. Sledujte dobu dodání, regresní chyby, kvalitu review a náklady. Určete vlastníka instrukcí, Skills a MCP serverů. Verze modelů a nástrojů měňte přes malou evaluační sadu. Samotný počet agentů ani počet vygenerovaných řádků není měřítkem produktivity.

První pilot má vymezený rozsah, vlastníka a termín vyhodnocení.


### Rychlý postup pro zkušené

```sh

git switch -c lab08-priority
npm run verify
npm run test:db
npm run mcp:smoke
npm run test:e2e

```


### Detailní postup

1. Vytvořte větev lab08-priority a dokument artifacts/capstone-plan.md. Rozepište šest akceptačních kritérií a přiřaďte vlastníky: databáze a kontrakt, API a MCP, Angular a E2E, nezávislé review.

2. Navrhněte migraci 002_priority.sql s NOT NULL default NORMAL a CHECK seznamem. Projděte existující data a navrhněte opakovatelný způsob aplikace a rollbacku. Původní migraci nepřepisujte.

3. Doplňte sdílený Ticket typ, mapování PostgreSQL a paměťový repozitář. API GET list přijme nepovinný validovaný filtr. Zachovejte tvar dosavadních polí a všechny původní testy.

4. V Angularu přidejte zobrazení priority a select filtr s přístupným label. Ověřte prázdný výsledek, chybu načtení a zachování dosavadního přechodu stavu.

5. Rozšiřte MCP ticket_list o nepovinnou enum prioritu. Starý vstup {} musí dál vrátit původní seznam. Nechte agenta vytvořit nové testy v nových souborech, poté jejich tvrzení posuďte ručně.

6. Integrujte schválené commity. Spusťte verify, databázové testy, MCP smoke a E2E. Všude rozlište PASS, FAIL a SKIPPED. Předveďte HIGH filtr v prohlížeči a stejné čtení přes MCP.

7. Sepište artifacts/handover.md s migračním postupem, důkazy a neověřenými podmínkami. Proveďte dvouminutové předání a vzájemné hodnocení podle rubriky.


### Prompt

Implementuj prioritu LOW NORMAL HIGH napříč DeliveryDesk podle capstone zadání. Nejdřív navrhni kontrakt, migraci a testovací scénáře. Změny rozděl podle vlastněných cest. Zachovej stará volání. Před předáním dolož skutečné kontroly a omezení.


### Akceptace

- Priorita funguje konzistentně v DB API UI a MCP.

- Existující data a volání zůstávají použitelná.

- Každé kritérium má ověřitelný test nebo demonstraci.


### Řešení a vysvětlení

Úplná referenční implementace je v solutions/lab08/files. Načte se node solutions/lab08/apply.mjs a vrací se pomocí --restore. Před aplikací vytvoří zálohu dotčených souborů. Poté spusťte db:migrate a celý verifikační postup. Rollback kódu neodstraní databázový sloupec; databázi vraťte odděleně podle popsaného postupu.


### Troubleshooting

- Změna je hotová jen v paměťovém repozitáři: doplňte SQL a integrační důkaz.

- Filtr mění stav, ale UI nepřepočítá výsledek: zkontrolujte signály a computed.

- MCP odmítá {}: nové pole musí být optional.


### Rozšíření mimo čas kurzu

Přidejte zpětně kompatibilní zápis priority s kontrolou role a idempotencí.
