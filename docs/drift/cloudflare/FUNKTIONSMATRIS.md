# Funktionsmatris från CF00

Datum: 2026-10-30. Alla observationer gäller lokal filkälla. En öppnad vy är inte ett fullständigt interaktionsprov. Kolumnen återstående prov följs upp i CF03–CF12.

| Resa | Baslinjeobservation | Återstående prov | Etapp |
|---|---|---|---|
| Startsida | Renderad; referensbild `startsida.png` | Animation, reduced motion, mobil | CF07/12 |
| Sök/filter/artikel/återgång | Sökning via fält efter `kirkia` gav 2 träffar; klick öppnade full artikel med källtext, moderna glosor, proveniens och återgångslänk. Bilder `ordbok.png`, `artikel.png` | Båda datasetfilter, artikeltextsökning, alla alias, pagination, bakåt/framåt och återgångsklick | CF08/12 |
| Text till orduppslag | Västgötalagens textmapp renderad, `texter.png` | Öppna dokument, klicka ord, morfologi och fotnoter | CF08/12 |
| Grammatik och källhänvisning | Arkiv renderat, `grammatik.png`; källvalidator godkänd | Dokumentnavigation och källänkar i webbläsare | CF07/12 |
| Bokläsare | Bokvy med läsbar sida, kapitel, sidpilar, zoom och PDF-länk renderad; `boklasare.png` | Bläddring, zoom, kapitelbyte, PDF-tillgång och mobil | CF07/10/12 |
| Runkarta/filter/detalj | Katalog med 20 pilotinskrifter och Karlevistenens detalj renderade; `runor.png`, `rundetalj.png` | Karttiles, filterkombinationer, tangentbord och listreserv | CF07/10/12 |
| Ordlista/anteckningar/export | Kodkälla och lagringsnyckel identifierade; sparakontroll finns i artikel | Spara/ladda om/anteckna/exportera/importera; underdomäner och blockerad lagring | CF04/12 |
| Redigera/spara/ladda om | Admin visar saknad Supabase-konfiguration, `admin.png` | Kräver testkonto, aktuell adminroll, RLS och beständig lagring | CF05/09/12 |
| Kontakt | Befintlig Resend-route identifierad; inget meddelande skickat | Mockad leverans, validering, kvotfel och testmiljö | CF10/12 |
| Gamla länkar/SEO/API | Befintliga routes inventerade; produktionsbygge lyckas | HTTP/404, full artikel-HTML, redirectriskfall, canonical, CORS/OPTIONS | CF03/10/12 |

Molnberoende hinder: inga verifierade Cloudflare-/Supabase-/Resend-/CI-konton i CF00. Produktionsdatabasen och produktionsprestanda är inte mätta. Inga produktionsdomäner ändrade.
