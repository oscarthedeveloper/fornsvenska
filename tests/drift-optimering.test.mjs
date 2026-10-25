import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROT = process.cwd();

test("D01: RootLayout är helt statisk och anropar inte cookies()", () => {
  const content = fs.readFileSync(path.join(ROT, "app/layout.tsx"), "utf-8");
  assert.equal(
    content.includes('from "next/headers"'),
    false,
    "RootLayout får inte importera next/headers (cookies)"
  );
  assert.equal(
    content.includes("hamtaSession()"),
    false,
    "RootLayout får inte anropa hamtaSession()"
  );
  assert.ok(
    content.includes("<AdminProvider>"),
    "RootLayout måste använda klientbaserad AdminProvider"
  );
});

test("D02: Startsidan (app/page.tsx) är befriad från force-dynamic och har ISR", () => {
  const content = fs.readFileSync(path.join(ROT, "app/page.tsx"), "utf-8");
  assert.equal(
    content.includes('dynamic = "force-dynamic"'),
    false,
    "Startsidan får inte ha force-dynamic"
  );
  assert.ok(
    content.includes("revalidate = 86400"),
    "Startsidan ska ha revalidate = 86400"
  );
});

test("D03: Texter (app/texter/[[...slug]]/page.tsx) har generateStaticParams och ISR", () => {
  const content = fs.readFileSync(path.join(ROT, "app/texter/[[...slug]]/page.tsx"), "utf-8");
  assert.equal(
    content.includes('dynamic = "force-dynamic"'),
    false,
    "Texter får inte ha force-dynamic"
  );
  assert.ok(
    content.includes("generateStaticParams"),
    "Texter ska exportera generateStaticParams"
  );
  assert.ok(
    content.includes("revalidate = 604800"),
    "Texter ska ha revalidate = 604800 (7 dagar)"
  );
  assert.ok(
    content.includes("dynamicParams = true"),
    "Texter ska tillåta dynamiska parametrar för nya noder"
  );
});

test("D04: Grammatik (app/grammatik/[[...slug]]/page.tsx) har generateStaticParams och ISR", () => {
  const content = fs.readFileSync(path.join(ROT, "app/grammatik/[[...slug]]/page.tsx"), "utf-8");
  assert.equal(
    content.includes('dynamic = "force-dynamic"'),
    false,
    "Grammatik får inte ha force-dynamic"
  );
  assert.ok(
    content.includes("generateStaticParams"),
    "Grammatik ska exportera generateStaticParams"
  );
  assert.ok(
    content.includes("revalidate = 604800"),
    "Grammatik ska ha revalidate = 604800 (7 dagar)"
  );
  assert.ok(
    content.includes("dynamicParams = true"),
    "Grammatik ska tillåta dynamiska parametrar för nya noder"
  );
});

test("D05: Resurser (app/resurser/page.tsx) är befriad från force-dynamic och har ISR", () => {
  const content = fs.readFileSync(path.join(ROT, "app/resurser/page.tsx"), "utf-8");
  assert.equal(
    content.includes('dynamic = "force-dynamic"'),
    false,
    "Resurser får inte ha force-dynamic"
  );
  assert.ok(
    content.includes("revalidate = 86400"),
    "Resurser ska ha revalidate = 86400"
  );
});

test("D06: Ordboksuppslag (app/api/ordbok/uppslag/route.ts) har korrekta Cache-Control headers", () => {
  const content = fs.readFileSync(path.join(ROT, "app/api/ordbok/uppslag/route.ts"), "utf-8");
  assert.ok(
    content.includes("s-maxage=86400"),
    "Ordboksuppslag ska ha s-maxage för lyckade anrop"
  );
  assert.ok(
    content.includes("no-store"),
    "Ordboksuppslag ska ha no-store för fel eller tomma anrop"
  );
});

test("D07: OrdbokUppslagPanel har klientsidig minnescache och AbortController", () => {
  const content = fs.readFileSync(path.join(ROT, "components/text/OrdbokUppslagPanel.tsx"), "utf-8");
  assert.ok(
    content.includes("KLIENT_UPPSLAG_CACHE"),
    "OrdbokUppslagPanel ska använda minnescache för uppslag"
  );
  assert.ok(
    content.includes("AbortController"),
    "OrdbokUppslagPanel ska avbryta pågående uppslag vid snabba ordbyten"
  );
});

test("D08: Middleware (middleware.ts) har auth-kakevakt och exkluderar statiska tillgångar", () => {
  const content = fs.readFileSync(path.join(ROT, "middleware.ts"), "utf-8");
  assert.ok(
    content.includes("harAuthKaka"),
    "Middleware ska kontrollera auth-kakor innan Supabase anropas"
  );
  assert.ok(
    content.includes("pdf|txt|xml|json"),
    "Middleware ska exkludera pdf, txt, xml och json från matchern"
  );
});

test("D09: Server Actions (lib/actions.ts) har målstyrd invalidation utan global rotinvalidation", () => {
  const content = fs.readFileSync(path.join(ROT, "lib/actions.ts"), "utf-8");
  assert.equal(
    content.includes('revalidatePath("/", "layout")'),
    false,
    "Global revalidatePath('/', 'layout') får inte finnas i actions.ts"
  );
  assert.ok(
    content.includes("uppdateraRot"),
    "Actions ska använda målstyrd uppdateraRot"
  );
});
