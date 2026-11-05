## 7 On premise inference a lokální agent

Posledních 25 minut implementační části věnujte streamování, zrušení a chybám z ANGULAR_AI.md. Nejprve musí fungovat základní lokální inferenční průchod. Simulátor UI a skutečný model jsou oddělené cesty a v reportu se nesmějí zaměnit.

Propojit vlastní Node.js agent s lokální inferencí a MCP a doložit datové toky.


### Dvě provozní cesty

Cloudová část používá Claude Code a oprávněný přístup k modelům Claude. Lokální část používá vlastní Node.js klient, Ollama a stejné čtecí MCP nástroje. Protokolová kompatibilita gateway neznamená podporu libovolného modelu v Claude Code. Bez přenosu dat ven musí uvnitř perimetru zůstat model, nástroje, repozitář, logy, paměť i síťové závislosti.

Vlastní lokální agent nepotřebuje přihlášení ke Claude.


### Inference a gateway

Ollama slouží pro jednoduchý učebnový provoz. Gateway v Node.js předává pouze zvolenou operaci a model, kontroluje klíč a loguje metadata bez promptů. Je určena na loopback a nenahrazuje produkční API management. Pro sdílené GPU zvažte vLLM, fronty, kvóty, řízení souběžnosti a observabilitu. Nasazení musí ověřit konkrétní model, kvantizaci, kontext a podporu tool calling.

Model a image před kurzem stáhněte a zaznamenejte digest.


### Tool calling v lokální smyčce

Agent předá modelu popisy povolených MCP nástrojů. Návrh volání validuje SDK a runner odmítá neznámá jména. Výsledek se vrací jako zpráva role tool. Smyčka má limit tahů, počet volání v tahu, velikost výsledku a timeout inference. Úspěšná textová odpověď bez skutečného načtení dat nesplňuje zadání, pokud otázka vyžaduje aktuální stav tiketu.

Neznámý nástroj vede k TOOL_NOT_ALLOWED, nikoliv k odhadu shellového příkazu.


### Příprava provozu a měření

Měřte latenci do prvního výsledku, celkovou dobu úlohy, chyby nástrojů a úspěšnost akceptačních scénářů. Výkon závisí na hardwaru a modelu, proto nevydávejte požadavky učebny za produkční sizing. Pro odpojenou síť připravte balíčky, image, váhy, licence, certifikáty a interní DNS. Otestujte restart a výpadek inference. Logy a paměť potřebují pravidla uchování a odstranění.

Stejnou otázku vyhodnoťte proti ručně ověřenému stavu API.


### Rychlý postup pro zkušené

```sh

docker compose --profile ai up -d --build
docker compose exec ollama ollama pull qwen3:8b
npm run agent:local -- "Read ticket 1 and explain its next legal state"

```


### Detailní postup

1. Ověřte předkurzový download modelu a jeho licenci. Pro tento lab počítejte orientačně s 32 GB RAM a dostatkem místa pro image a model; sdílený lektorský endpoint může nahradit slabý notebook. Kapacitu ověřte skutečným během.

2. V .env nastavte GATEWAY_KEY alespoň na 16 znaků a LLM_MODEL=qwen3:8b. Stejné hodnoty nastavte export nebo $env také v terminálu, ze kterého poběží Node agent. Klíč neposílejte do chatu.

3. Spusťte docker compose --profile ai up -d --build. Zkontrolujte docker compose ps a logy gateway. Stáhněte model pomocí docker compose exec ollama ollama pull qwen3:8b. To proveďte před začátkem časovaného labu, pokud je síť pomalá.

4. Nechte běžet API na hostiteli. V novém terminálu spusťte npm run agent:local -- "Read ticket 1 and explain its next legal state". Agent spustí MCP jako lokální podproces a inferenci volá přes gateway na portu 4000.

5. Otevřete local/agent.ts. Najděte seznam povolených jmen, pět tahů, maximálně čtyři volání v tahu a timeout. Porovnejte odpověď s GET /api/tickets/1 v prohlížeči.

6. V terminálu nastavte nesprávný GATEWAY_KEY a opakujte. Očekávejte 401. Poté obnovte správný klíč, zastavte Ollama a ověřte čitelnou chybu nebo timeout bez nekonečné smyčky.

7. Nakreslete datové toky mezi Angular, API, PostgreSQL, Node agentem, MCP, gateway a Ollama. Označte předkurzové downloady a runtime komunikaci. Uveďte, co by se změnilo při sdíleném endpointu s TLS.


### Prompt

Načti tiket 1 prostřednictvím nástroje. Uveď skutečný stav a následující legální přechod. Při nedostupnosti dat řekni, kterou kontrolu nebylo možné provést.


### Akceptace

- Lokální model volá povolený MCP nástroj a odpověď odpovídá API.

- Nesprávný klíč a výpadek inference končí kontrolovanou chybou.

- Report popisuje skutečné runtime datové toky.


### Řešení a vysvětlení

Úplné řešení je v local/agent.ts, local/gateway.ts, mcp a compose.yaml. Příklad běží bez cloudového modelu, ale první instalace vyžaduje připravené závislosti a váhy.


### Troubleshooting

- Model nevolá tools: ověřte podporu vybraného modelu a API, nikoliv jen textovou odpověď.

- Výpadek kvůli paměti: zvolte menší ověřený model nebo sdílenou inferenci.

- Gateway v kontejneru neodpovídá: ověřte GATEWAY_BIND, port a shodu klíče v hostitelském terminálu.


### Rozšíření mimo čas kurzu

Nahraďte inferenci ověřeným vLLM endpointem a porovnejte úspěšnost úloh, ne jen tokeny za sekundu.
