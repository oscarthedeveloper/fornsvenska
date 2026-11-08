# Artikelnavigation – rättning 2026-11-05

Ordboksartiklarna använde en separat handskriven header i `render-article.ts`. Den skilde sig från huvudsajten i logotyp, placering, länkordning, färger och typsnitt och saknade Kontakt-länken. Artikelmallen satte dessutom egna globala färger och Georgia på hela sidan, utan Next-layoutens variabler för de självhostade typsnitten.

Navigationsinnehållet delas nu genom `components/NavigationContent.tsx`. Huvudsajten använder samma komponent med Next Link och sin befintliga ordlisteknapp; artikelbyggaren renderar komponenten till statisk HTML med riktiga länkar till https://fornsvenska.se. Ordbok markeras som aktiv sida. Logotypen kommer från samma Mark-komponent. Inget JavaScript krävs för navigationen.

Artikelbyggaren bevarar layoutens fontklasser och använder de befintliga självhostade typsnitten. Artikeltexten behåller serif, medan navigationen får sajtens monospace. Den gamla globala palettöverskrivningen har tagits bort. Navigationen får en kolofonremsa och ram enligt undersidornas utformning. På smala skärmar staplas navigationen så att länkarna ryms. CSS-URL:en får en innehållshash i query-parametern för att kringgå tidigare års-cache av style.css.

Samtliga 41 744 artiklar i sju grupper har byggts om. Gruppernas filantal är oförändrade och den största ligger på 13 819 filer, under gränsen 16 000. De befintliga Pages-adresserna för artikelvärdarna och deras noindex-inställning bevaras; huvudnavigation och återgångslänk går till den egna domänen.

Verifiering: produktionsbygge och TypeScript godkända; 19 befintliga tester för artikelrendering, ordboksdistribution och acceptans godkända. Visuell lokal granskning genomförd vid normal bredd och 390 px. Publika HTTP-kontroller och slutlig referensbild dokumenteras efter slutförda uppladdningar.

Slutresultat: samtliga sju grupper publicerade och kontrollerade via HTTPS. Gemensam navbar, logotyp, Kontakt-länk till fornsvenska.se, fontklasser och CSS med innehållsversion verifierades på varje värd. Artikelvärdarnas befintliga ordlistebrygga på Pages-adressen bevarades i leveranskopiorna för att undvika byte av lagringsplats. Den exakta rapporterade artikeln soederwall--a-e.3 öppnades efter publicering och kontrollerades visuellt. Referensbild: referensbilder/2026-11-05-artikel-navigation.png.
