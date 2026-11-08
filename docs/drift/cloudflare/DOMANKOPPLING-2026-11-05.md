# Domänkoppling 2026-11-05

Användaren begärde uttryckligen att den publicerade Pages-sajten skulle kopplas till `fornsvenska.se` i det befintliga Cloudflare-kontot.

Cloudflare Pages-projektet `fornsvenska-www` har fått den egna domänen `fornsvenska.se`. DNS visar en proxad CNAME till `fornsvenska-www.pages.dev`, med automatisk TTL. Cloudflare visar Active och SSL enabled; HTTPS ger 200 och rätt sidtitel. Även `www.fornsvenska.se` har registrerats till samma projekt via Pages domänflöde.

Detta är en domänkoppling av den befintliga leveransen. Inga nya behörigheter begärdes, ingen e-postkonfiguration ändrades och inget nytt innehåll publicerades. Kontakt- och redaktionsfunktionernas tidigare konfigurationsberoenden kvarstår.

Den befintliga leveransen har fortfarande `X-Robots-Tag: noindex`, canonical på Pages-adressen samt Pages-adresser för ordboksdelarna. Dessa tidigare granskningsinställningar behöver ändras inför sökmotorlansering. Domänkopplingen i sig ersätter inte den återstående acceptansen.

HTTP-underlag finns i `DOMANKOPPLING-2026-11-05.json`.

Slutstatus: båda domänerna visar Active och SSL enabled. Båda gav HTTP 200 och rätt sidtitel. För www användes DNS-svaret från 1.1.1.1 i HTTPS-provet eftersom datorns tidigare negativa DNS-svar var cachat; certifikatkontrollen var aktiverad.
