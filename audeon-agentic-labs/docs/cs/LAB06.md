## 6 Autonomní smyčka a nezávislá verifikace

Spustit omezenou opravnou smyčku a prokázat její ukončení při úspěchu i neúspěchu.


### Stavový automat smyčky

Smyčka má stavy plánování, pokus, ověření, dokončení a eskalace. Každý pokus spotřebovává omezený čas a rozpočet. Další iterace dostane shrnutí selhání, nikoliv neomezenou historii logů. Úspěch vyžaduje deterministické kontroly a review diffu. Opakovaně stejná chyba, změna chráněného vstupu nebo nedostupná závislost musí ukončit automatickou práci.

Tři pokusy po osmi tazích dávají nejvýše 24 modelových tahů.


### Nezávislost verifikace

Agent může spouštět vlastní kontrolu, ale nadřazený proces ji spustí znovu. Otisky existujících testů, skriptů a konfigurace odhalí jejich změnu. Nové testy lze přidávat, stávající akceptační tvrzení zůstávají chráněná. Fingerprint je detekce po změně, ne prevence. Pro produkční automatizaci izolujte referenční testy a validátory mimo zapisovatelný prostor agenta.

Proces agenta s exit code 0 ještě neznamená GO.


### Rozpočty a podmínky zastavení

Výukový wrapper omezuje počet iterací, tahy, dolarový rozpočet a timeout procesu. Limit peněz je aplikovatelný podle poskytovatele a režimu CLI; před kurzem ho ověřte proti používanému přístupu. Počet tokenů, souběžnost a síťovou aktivitu lze dále omezit v gateway. Reálná správa procesních stromů vyžaduje kontejner nebo nadřazený runner, protože pouhý signál rodiči nemusí ukončit každý podproces.

Nejvýše tři pokusy s limitem 2 USD dávají konfigurační strop 6 USD pro agenta.


### Report a audit

Uchovejte identifikátor úlohy, výchozí commit, otisky chráněných vstupů, příkazy, návratové kódy a důvod ukončení. Logy mohou obsahovat citlivý obsah, proto je ukládejte podle firemní politiky a neposílejte automaticky mimo tým. Závěrečný report rozlišuje hotovou změnu od podmínek, které nebyly ověřeny. Návrh agenta zůstává před commitem předmětem review.

NO-GO obsahuje konkrétní další krok, například chybějící oprávnění k databázi.


### Rychlý postup pro zkušené

```sh

npm run loop -- --dry-run
npm run lab -- starter01
npm run loop
git diff
npm run verify

```


### Detailní postup

1. Prohlédněte scripts/repair-loop.mjs. Najděte počet iterací, timeout, parametry claude a externí verify. Spusťte npm run loop -- --dry-run. Tento režim nesmí volat model ani měnit projekt.

2. Před živým během proveďte přihlášení a testovací claude -p podle pravidel organizace. Ověřte podporu --max-turns a --max-budget-usd pomocí claude --help. Při nepodporovaném parametru wrapper upravte pod dohledem lektora a změnu zaznamenejte.

3. Na čisté pracovní větvi spusťte npm run lab -- starter01. Následně spusťte npm run loop. Sledujte oddělený modelový log a nadřazené ověření v artifacts.

4. Po ukončení otevřete poslední verify log a potvrďte, že pochází z wrapperu. Porovnejte diff a zkontrolujte chráněné soubory. Nepovažujte samotné slovní „hotovo“ za výsledek.

5. Pro scénář neúspěchu vytvořte novou kopii wrapperu s nedostupným příkazem agenta. Spusťte ji a očekávejte NO-GO nebo čitelnou chybu, nikoliv nekonečné opakování. Původní wrapper zachovejte.

6. Zkontrolujte rozpočet a dobu běhu. Pokud živý cloud není dostupný, proveďte dry-run, ruční opravu a samostatný verify. V reportu oddělte ověřenou strukturu wrapperu od neprovedeného modelového běhu.


### Prompt

Oprav doménové chyby bez změny existujících testů, skriptů nebo konfigurace. Nejvýše tři pokusy. Každý pokus skončí externím npm run verify. Při nejasnosti nebo nedostupné závislosti vrať NO-GO s důvodem.


### Akceptace

- Dry-run nemá vedlejší účinky.

- Nadřazený proces provádí vlastní ověření.

- Úspěch i chyba mají konečný stav a dohledatelný důvod.


### Řešení a vysvětlení

Wrapper scripts/repair-loop.mjs je čitelné referenční řešení. Nenahrazuje produkční sandbox a neskrývá jeho omezení. Referenční doménová oprava zůstává v solutions/lab01.


### Troubleshooting

- Chybí oprávnění pro headless nástroj: předem je vyřešte v interaktivním režimu v nejmenším rozsahu.

- Vypršel timeout: ověřte také ukončení podprocesů; v praxi použijte kontejnerový runner.

- Oprava změnila akceptační test: zastavte běh a proveďte ruční review.


### Rozšíření mimo čas kurzu

Přidejte detekci opakovaného stejného diffu a strukturální JSON report bez ukládání promptů.
