## 5 Subagenti a orchestrace změn napříč repozitářem

V posledních 25 minutách implementační části nahraďte jednoduchou úpravu hlášky review a testováním odeslání požadavku, validace a historie podle ANGULAR_AI.md. Časový rozsah bloku se nemění.

Rozdělit práci bez konfliktů vlastnictví a integrovat nezávislé výsledky s důkazy.


### Kontext a odpovědnost subagenta

Specializovaný agent potřebuje úzké zadání, vstupy, nástroje a výstupní formát. Vlastní kontext omezuje šum, ale může vynechat zásadní společné rozhodnutí. Předejte proto API kontrakt, akceptační kritéria a verzi výchozího commitu. Čtecí reviewer nemá měnit soubory ani spouštět nástroje, které nepotřebuje. Hlavní agent odpovídá za integraci a ověření.

Výstup review obsahuje cestu, důkaz a závažnost, nikoliv jen obecný názor.


### Fan out a závislosti

Paralelně lze kontrolovat API, UI a testy. Změnu sdíleného kontraktu nejprve navrhne jediný vlastník; implementátoři na něj navážou až po schválení. Vytvořte závislostní graf a pro každou cestu určete právě jednoho zapisovatele. Více agentů samo o sobě nezkracuje kritickou cestu. Náklady zahrnují opakovaný kontext, čekání, review a řešení konfliktů.

Review může běžet paralelně nad stejným commitem. Dvě editace stejného souboru vyžadují koordinaci.


### Worktrees a integrační bod

Git worktree odděluje pracovní kopie a větve. Neodděluje síť, credentials, databázi ani operační systém. Každá větev musí mít určené vlastněné cesty a integrační základ. Při integraci zkontrolujte diff, aplikujte vybrané commity a spusťte celý verifikační postup. Samostatný zelený test v každé větvi nezaručuje správnost kombinovaného výsledku.

Worktree UI nevytvářejte ve složce původního worktree.


### Subagenti a agent teams

Subagenti vracejí výsledek koordinátorovi. Agent teams přidávají jiné možnosti spolupráce a mohou mít verzně závislý nebo experimentální režim. Základ kurzu stojí na běžných subagentech a explicitních Git větvích. Pokročilé týmy zařaďte pouze po předkurzovém ověření konkrétní verze, oprávnění a chování sdíleného adresáře.

V jednom čase může více čtenářů kontrolovat stejný commit. Zapisovatel má jasné vlastnictví.


### Rychlý postup pro zkušené

```sh

git status
git worktree add ../deliverydesk-ui -b lab05-ui
git worktree add ../deliverydesk-api -b lab05-api
claude
/agents

```


### Detailní postup

1. Uložte dosavadní schválenou práci commitem. Napište git status a git log -1 --oneline. Zapište společný výchozí commit pro všechny větve.

2. Otevřete .claude/agents a projděte tři reviewery. V Claude Code napište /agents a ověřte jejich načtení. Nástroje Read, Glob a Grep dovolují čtení bez změn.

3. Zadejte paralelní review podle promptu. Požadujte oddělené nálezy pro API, Angular a testy se stejným kontraktem. Pokud runtime provede úkoly sekvenčně, zaznamenejte skutečný průběh.

4. V terminálu vytvořte dvě worktrees příkazy z rychlého postupu. Ve VS Code zvolte File > New Window a v každém okně Open Folder pro příslušnou worktree. V každé spusťte npm ci.

5. UI větev upraví čitelnou hlášku chyby a přidá nový E2E scénář. API větev doplní nový test validační chyby. Sdílený kontrakt ani původní chráněné testy neměňte. Zapište vlastněné cesty do zadání každé větve.

6. Každý účastník prohlédne diff, spustí příslušné testy a vytvoří lokální commit. Koordinátor provede git cherry-pick s konkrétními hashi, zkontroluje sloučený diff a spustí npm run verify i příslušné E2E.

7. Sepište integrační report s výchozím commitem, převzatými commity, změněnými cestami a skutečnými výsledky. Worktrees odstraňte až po ověření a uchování potřebných commitů.


### Prompt

Deleguj read-only review současného commitu agentům api-reviewer, ui-reviewer a test-reviewer. Každý vrátí cestu, závažnost, důkaz a navržený test. Pak sjednoť duplicity a navrhni závislosti změn. Soubory neměň.


### Akceptace

- Každá změněná cesta má jednoho vlastníka.

- Revieweři pouze čtou a vracejí doložené nálezy.

- Koordinátor ověří kombinovaný výsledek.


### Řešení a vysvětlení

Referenční definice reviewerů jsou v .claude/agents. Konkrétní report se liší podle změn účastníků. Správnost se posuzuje podle doložených nálezů a integračních testů.


### Troubleshooting

- Worktree již existuje: prohlédněte git worktree list a použijte nový název.

- Konflikt cherry-pick: vyřešte ho v integrační větvi a znovu spusťte testy.

- Závislá větev chybí kontrakt: zastavte implementaci a vyjasněte společný commit.


### Rozšíření mimo čas kurzu

Porovnejte celkový čas a náklady stejného úkolu se dvěma a se čtyřmi pracovníky.
