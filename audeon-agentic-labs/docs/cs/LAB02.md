## 2 Kontext Skills a automatická paměť

Navrhnout verzovaný kontext a vlastní postup, otestovat jeho účinek a vymezit životnost paměti.


### Rozdělení znalostí podle účelu

CLAUDE.md uchovává týmová pravidla a stručné orientační informace. Path scoped rules doplňují instrukce pro Angular nebo databázi při práci v dané oblasti. Skill popisuje opakovatelný pracovní postup s jasným výsledkem. MCP přidává datové zdroje a akce. Hook reaguje na událost. Každá instrukce musí mít vlastníka a důvod existence. Neudržujte několik rozporných kopií stejného pravidla.

Obchodní přechody jsou pravidlem projektu, release-check je postup.


### Načítání a testování Skills

Název a description musí vyjádřit, kdy postup použít. Tělo obsahuje vstupy, kroky, ověření a omezení. Dlouhé reference patří do vedlejších souborů. Pro release-check používáme ruční vyvolání a disable-model-invocation. Ověřte postup na úspěšné změně i na záměrně rozbitém projektu. Zpráva GO při neúspěšném buildu je chyba skillu, i když zní přesvědčivě.

Stejný vstup musí vyvolat stejný verifikační postup, i když slovní vysvětlení kolísá.


### Paměť a autorita

Automatická paměť pomáhá přenášet užitečné poznatky mezi relacemi. Její obsah může zestárnout nebo vzniknout chybnou generalizací. Týmové závazné pravidlo proto po kontrole převeďte do verzovaného souboru. Neukládejte tajemství, osobní údaje ani neověřené domněnky. Otestujte, jak nová relace pracuje s poznatkem, a jak se chová po jeho odstranění.

„Testy vyžadují běžící API“ je ověřitelný poznatek. Heslo databáze do paměti nepatří.


### Evaluační sada pro kontext

Sestavte několik krátkých úloh: správný výběr postupu, odmítnutí změny chráněného souboru, pravdivý report přeskočeného testu a vyhledání Angular pravidla. U každé předem popište očekávanou akci a zakázanou akci. Uchovávejte verzi instrukcí, výsledek a skutečné náklady. Samotná existence souboru SKILL.md nedokazuje, že ho agent použil správně.

Nejprve definujte hodnoticí kritéria, pak měňte instrukce.


### Rychlý postup pro zkušené

```sh

claude
/context
/memory
/release-check

```


### Detailní postup

1. V Exploreru otevřete CLAUDE.md a označte fakta, příkazy a procesní instrukce. Zbytečně dlouhý postup přesuňte do skillu, který můžete samostatně ověřit.

2. Otevřete .claude/rules/angular.md. Prohlédněte paths a přesný glob. Požádejte agenta o analýzu apps/web/src/main.ts a pomocí /context ověřte načtený kontext.

3. Otevřete .claude/skills/release-check/SKILL.md. Prohlédněte frontmatter a doplňte konkrétní formát reportu: soubor, příkaz, exit code, neověřené chování. Uložte Ctrl+S.

4. V Claude Code napište /release-check. Pokud se příkaz nezobrazuje, spusťte novou relaci z kořene projektu a zkontrolujte přesný název souboru. Porovnejte report se skutečným terminálem.

5. Napište /memory a prohlédněte dostupné soubory a stav automatické paměti. Požádejte o zapamatování neškodného poznatku: MCP smoke potřebuje běžící API. Ověřte skutečné uložení, nikoliv pouze slovní příslib.

6. Ukončete relaci, spusťte claude znovu a zeptejte se na předpoklad MCP smoke. Odstraňte pokusný poznatek přes /memory a zopakujte pokus. Zapište rozdíl mezi pamětí a týmovým pravidlem.

7. Na pracovní větvi spusťte npm run lab -- starter01, vyvolejte /release-check a požadujte NO-GO. Potom obnovte npm run lab -- solution01. Uložte oba výsledky jako evaluační případ.


### Prompt

Proveď /release-check. U každé kontroly rozliš PASS, FAIL a SKIPPED. Žádný přeskočený test nevydávej za úspěšný. Neprováděj commit ani deployment.


### Akceptace

- Skill rozlišuje úspěch, chybu a přeskočenou kontrolu.

- Nová relace prokáže účinek i odstranění poznatku.

- Pravidlo pro tým je verzované a má vlastníka.


### Řešení a vysvětlení

Referenční soubory jsou v CLAUDE.md, .claude/rules a .claude/skills. Hodnotí se skutečný výsledek na dvou stavech projektu, nikoliv délka instrukcí.


### Troubleshooting

- Skill se nespouští: ověřte kořen projektu, SKILL.md a description.

- Paměť je vypnutá správcem: cvičení proveďte pomocí projektového souboru a omezení zaznamenejte.

- Paměť se nenaplnila: zkontrolujte /memory a explicitně požádejte o uložení neškodného faktu.


### Rozšíření mimo čas kurzu

Zaveďte metriku falešných GO reportů a porovnejte dvě verze description na stejných úlohách.
