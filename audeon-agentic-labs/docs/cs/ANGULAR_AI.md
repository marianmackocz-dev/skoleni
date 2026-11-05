# Angular AI Design Patterns v projektu DeliveryDesk

Tato část převádí všechny čtyři tematické oblasti oficiální stránky https://angular.dev/ai/design-patterns do konkrétního výukového projektu. Rozlišujeme použití agenta při vývoji a zabudování AI do aplikace. Panel je testovacím objektem pro agentní refaktoring, nikoliv dalším povinným frameworkem. Referenční backend záměrně používá deterministický simulátor a uživatelské rozhraní to výslovně oznamuje. LLM v lokálním Lab 07 je samostatná skutečná inferenční cesta.

## Rychlý postup pro zkušené

```sh
npm ci
npm run lab -- solution01
npm run verify
# Terminal A, PowerShell: $env:APP_STORE='memory'
# Terminal A, WSL: export APP_STORE=memory
npm run dev:api
# Terminal B
npm run dev:web
```

Otevřete http://127.0.0.1:4200 a panel AI pattern laboratory. Prohlédněte apps/web/src/ai-assistant.ts, apps/web/src/ai-stream.ts, apps/api/ai.ts a packages/domain/ai.ts. Samostatné testy tohoto příkladu spustíte příkazem `node --import tsx --test tests/ai-patterns.test.ts`. Před E2E ukončete oba servery pomocí Ctrl+C. Potom `npx playwright install chromium` a `npm run test:e2e -- e2e/ai-patterns.spec.ts`.

## Zařazení do dvou dnů

Zůstává osm bloků po 120 minutách a 720 minut aktivní práce účastníků. V Lab 05 nahraďte jednoduchou úpravu chybové hlášky tímto úkolem: během posledních 25 minut implementační části proveďte review odděleného odeslání, běhové validace a historie. V Lab 07 věnujte posledních 25 minut implementační části streamu a jeho chybám. Dosavadní kontrakt, běžící MCP a lokální inferenční průchod musí být připravené před tímto segmentem. Referenční panel je již součástí projektu, takže účastníci neztrácejí čas jeho ručním přepisováním. Lektor používá doplňující slidy jako referenci a promítá jen snímek relevantní pro aktuální kontrolní bod.

## Odeslání požadavku a reaktivní závislosti

Pole draft uchovává rozepsaný text. submitted se změní teprve při kliknutí na Generate review. Objekt obsahuje prompt a nové requestId. Nové ID řeší opětovné odeslání stejného textu, protože samotný stejný řetězec by nemusel vyvolat změnu signálu. params vrací undefined před prvním odesláním a po zrušení. Síť se proto nespouští při psaní ani při vytvoření komponenty.

```ts
draft = signal('Review ticket 1');
submitted = signal<Submission | undefined>(undefined);
submit() {
  const prompt = this.draft().trim();
  if (prompt) this.submitted.set({
    prompt, requestId: crypto.randomUUID()
  });
}
```

Parametry definují reaktivní spouštěče. Další hodnoty, například sessionId, lze načíst až v loaderu, pokud jejich změna sama nemá spouštět požadavek. Autorizaci však vždy ověřuje server podle ověřené identity; ID dodané z prohlížeče není autoritou. Resource obdrží abortSignal, který předáme fetch. Novější odeslání nebo zánik komponenty může předchozí požadavek zrušit. Zrušení v klientovi samo nezaručuje zastavení již běžícího modelu nebo účtování poskytovatele.

## Strukturovaná odpověď a stav pro šablonu

AiReply vyjadřuje requestId, summary, checks a režim simulátoru. parseReply provádí skutečnou kontrolu JSON. Přetypování `as AiReply` by chybná data nezastavilo. Kontrolujeme tvar, délky a shodu requestId. Pole checks má omezený počet položek; souhrn se vkládá interpolací do textu. Nevykreslujeme HTML vygenerované modelem a nepoužíváme bypassSecurityTrustHtml.

computed odvozuje počet kontrol bez samostatné synchronizační proměnné. linkedSignal přenáší posledních nejvýše dvacet dokončených odpovědí do lokální historie. Při chybě nebo opětovném vyhodnocení zachová předchozí hodnotu. Deduplikace podle requestId zabrání druhému přidání stejné odpovědi při reload. Rozpracovaný stream se do historie hotových odpovědí neukládá. Historie je pouze v paměti komponenty a po obnovení stránky zmizí; perzistence, osobní údaje a retenční politika by byly další explicitní požadavky.

## Pomalá služba a ovládání chyb

Resource patří přímo komponentě AiAssistant, která jej používá. Zbytek Work queue má samostatný stav. Sdílený provider by dával smysl až při sdílení dat více komponentami; globální singleton bez potřebného důvodu zvyšuje riziko úniku historie mezi relacemi. isLoading řídí indikátor. Před čtením value kontrolujeme hasValue, protože chybový resource může při čtení hodnoty vyhodit výjimku. Chybu zobrazí role alert a Retry review zavolá reload na posledním odeslaném požadavku. Změna draft sama nemění vstup retry.

V této ukázce lze nový požadavek odeslat i během čekání. Resource tím zneplatní předchozí běh. Alternativou je blokovat tlačítko až do dokončení, ale jde o jinou produktovou politiku a musí mít vlastní testy. Retry nemá být neomezená automatická smyčka. Živá inference potřebuje vlastní kvóty a serverové omezení souběžnosti. Vzhled spinneru není důkazem, že upstream stále pracuje.

## Streamování přes resource

stream vrací signál ResourceStreamItem<string>. Příchozí validní díl aktualizuje `{value: text}`, chyba aktualizuje `{error: Error}`. Loader i stream jsou dvě alternativy příslušného resource; ukázka má pro každou cestu samostatný resource. Chybu z asynchronního čtení zachytáváme, aby nevznikla neobsloužená Promise.

Server posílá NDJSON, tedy jednu JSON zprávu na řádek. Prohlížečové síťové chunky se neshodují s těmito řádky ani s hranicemi znaků UTF-8. consumeNdjson proto používá průběžný TextDecoder a buffer nedokončeného řádku. parseChunk validuje delta a volitelné done. Dokončení vyžaduje explicitní marker. Předčasný konec nebo neplatný JSON skončí chybou, ne zeleným výsledkem. Limitujeme rámec i celkový text, po zrušení uzavíráme reader a ignorujeme opožděné aktualizace.

Jakmile přijde první hodnota streamu, resource může mít hasValue, i když přenos pokračuje. Proto isLoading nelze používat jako univerzální indikátor dokončení generování. Produkční UI má mít samostatný protokolový příznak dokončení, zobrazení částečného výsledku a případně řízené dávkování aktualizací pro čtečky obrazovky. Kontrolu done zde provádí parser; panel je výukově omezený a neukazuje procento dokončení.

## Podrobný postup v editoru a prohlížeči

1. Ve VS Code zvolte File > Open Folder a vyberte course. V Terminal > New Terminal spusťte rychlý postup. Pokud jste v PowerShellu, nastavte `$env:APP_STORE='memory'`; ve WSL `export APP_STORE=memory`. Paměťový režim zde slouží jen k izolaci UI labu, nikoliv k ověření SQL.
2. V Explorer otevřete apps/web/src/ai-assistant.ts. Najděte draft, submitted a params. V prohlížeči otevřete F12 > Network a do filtru napište `/api/ai/`. Do pole Review prompt napište `Review ticket 2`. Zatím nesmí odejít žádný AI požadavek.
3. Klikněte Generate review. Uvidíte Generating review a potom Mode simulated, tři kontroly a jednu položku historie. V Network otevřete summary > Payload a ověřte prompt a requestId. V Response ověřte JSON, nikoliv HTML. Nejde o odpověď modelu.
4. Bez změny textu znovu klikněte Generate review. Odejde druhý požadavek s jiným requestId a historie má dvě položky. Nyní napište `[fail]` a klikněte Generate review. Očekávejte HTTP 503, čitelnou chybu a Retry review. Rozepsaný text změňte, ale klikněte Retry review: opakuje se stále poslední odeslaný `[fail]`. Nový text odešle až Generate review.
5. Do pole napište `Review ticket 1` a klikněte Stream review. V Network otevřete stream > Response a sledujte přírůstky NDJSON. Klikněte Cancel requests během přenosu. Starý obsah nesmí po zrušení znovu naskočit.
6. Napište `[broken]` a klikněte Stream review. Server po několika částech pošle vadný JSON. UI musí ukázat chybu a Retry stream. Otevřete ai-stream.ts a ukažte místo, které chybu detekuje. Částečný text se nesmí stát hotovým záznamem historie.
7. V terminálu spusťte samostatný Node test uvedený v rychlém postupu. Test rozděluje český UTF-8 text po jednotlivých bytech, odmítá vadné zprávy a předčasný konec a ověřuje zrušení čekajícího readeru. Tyto testy ověřují parser a HTTP, nikoliv vykreslování Angularu.
8. Ukončete ručně spuštěné API i Angular pomocí Ctrl+C. Spusťte browser testy podle rychlého postupu na počítači či CI, kde smí běžet Chromium. Pokud prostředí zakazuje jeho sockety, označte BLOCKED a přiložte důvod. Neupravujte testy na PASS a nevypínejte bezpečnostní politiku.

## Zadání pro vývojového agenta

Proveď read-only review AI panelu v apps/web/src/ai-assistant.ts a parseru ai-stream.ts. Namapuj všechny čtyři oblasti oficiální Angular AI design-patterns na konkrétní soubory. Navrhni jeden nový test stale response a jeden test historie při reload. Zachovej chráněné testy a jejich očekávání. Případný nový test přidej do nového souboru. Nevkládej do prohlížeče klíče, další AI SDK ani fiktivní výsledky inference. Report odlišuje parser, HTTP, build a skutečný browser run.

## Kritéria a lektorský průchod

Účastník doloží nulové požadavky během psaní, nové ID při opakovaném odeslání a správný vstup retry. Vysvětlí rozdíl mezi typem a validátorem a mezi první hodnotou streamu a jeho dokončením. Prokáže zachování historie při chybě a zrušení starého přenosu. Nezávislý reviewer posoudí tvrzení testů, nikoliv jen jejich počet. Review má přesnou cestu, řádek nebo symbol, důkaz a dopad. První pětiminutová demonstrace ukáže normální průchod; druhá pouze `[broken]` a rozbor parseru. Zbytek vyhrazeného segmentu patří účastníkům.

## SSR hydratace a rozšíření s reálným SDK

Oficiální stránka zmiňuje SSR, hydrataci a odložené načtení AI obsahu. DeliveryDesk je záměrně SPA a SSR zde není implementované ani otestované. V SSR variantě musí zůstat uživatelsky specifická inference mimo veřejnou cache a nesmí se opakovaně spouštět na serveru a po hydrataci. Před první akcí zobrazte placeholder. Pro skutečnou SSR aplikaci následujte aktuální příručky SSR a incremental hydration; samotné přidání `@defer` do SPA hydrataci nevytvoří. Ověřte HTML bez JavaScriptu, přesně jeden požadavek po hydrataci a absenci cizího uživatelského obsahu v cache.

Stránka předvádí Genkit runFlow a streamFlow s poskytovatelem Gemini. Vlastní resource loader může obdobně volat jiné SDK; pro obyčejné HTTP čtení je možná varianta httpResource. Náš POST simulátor s explicitním zrušením používá fetch. Živé SDK musí běžet za Node backendem, validovat strukturovaný výstup a předávat zrušení upstreamu. Serverové streamování musí převést providerové události na zvolený klientský protokol, řešit backpressure a uzavření spojení. Výuková gateway pro lokálního agenta přijímá pouze stream:false, takže k ní nelze bez úprav připojit tento NDJSON stream. Záměna simulátoru za LLM vyžaduje samostatný integrační test, limity a licenční kontrolu zvoleného modelu.

## Zdroje a pokrytí

- Úplná stránka Angular AI Design Patterns: https://angular.dev/ai/design-patterns
- Resource, params, abortSignal a stream: https://angular.dev/guide/signals/resource
- linkedSignal a previous: https://angular.dev/guide/signals/linked-signal
- Typ streamované hodnoty: https://angular.dev/api/core/ResourceStreamItem
- SSR a incremental hydration: https://angular.dev/guide/incremental-hydration

Všechny čtyři části odkazované stránky jsou pokryté. Příklad Genkit je vysvětlený jako varianta adaptéru, nikoliv vydávaný za nainstalovanou závislost. Běhové ověření a jeho omezení uvádí VERIFICATION.md.
