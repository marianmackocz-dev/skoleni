# Rozsah provedeného ověření

Stav k 29. 10. 2026.

- npm ci a uzamčené závislosti: PASS.
- Referenční oprava Lab 01 včetně Angular AI panelu: typová kontrola, 14 doménových, HTTP a parser testů a build Angularu PASS.
- Výchozí starter obsahuje záměrné chyby Lab 01. Jeho červené testy nejsou závadou balíčku.
- Referenční capstone: typová kontrola, 16 testů a build Angularu PASS.
- MCP: skutečné stdio připojení, discovery, platný dotaz na API a odmítnutý neplatný vstup PASS.
- Guard: chráněná cesta odmítnuta a nový generovaný test neblokován PASS.
- Opravná smyčka: syntaxe a dry-run PASS. Živý Claude běh neproveden.
- E2E: načteny čtyři scénáře včetně dvou nových pro Angular AI panel. Živý pokus s Chrome 156.0.8078.4 skončil zákazem jeho interního socketu. Stav BLOCKED, nikoliv PASS. Testy spusťte v autorizovaném lokálním prostředí či CI.
- AI panel používá označený deterministický simulátor. Prošly testy jeho HTTP kontraktu, skládání UTF-8 po jednotlivých bytech, vadného a předčasně ukončeného streamu a zrušení readeru. To nenahrazuje UI ani skutečnou inferenci.
- PostgreSQL testy: neprovedeny proti běžícímu serveru. Bez TEST_DATABASE_URL jsou správně označeny SKIPPED.
- Docker Compose, model Ollama a gateway s reálnou inferencí: živý běh neověřen.

Před výukou proveďte celý preflight na učebnovém prostředí. SKIPPED není PASS. Výchozí balíček úmyslně obsahuje vadnou doménu pro Lab 01. Obnovte referenci přes npm run lab -- solution01.

Web AudeON se při opakování podařilo přímo načíst. Logo je bajtově shodné s použitým souborem; CSS potvrzuje #3d3c3f, #b9a400 a bílou. Font webu Fedra Sans Display nahrazuje v materiálech Office kompatibilní Arial.
