import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { KALLOR } from "../data/kallor";
import { GRAMMATIK_DOKUMENT } from "../data/dokument";
import { GRAMMATIK } from "../data/grammatik";
import {
  KALLPLAN_REGLER,
  kallorForArtikel,
  produktionsprioritet,
} from "../data/grammatikplan";
import type { Block, Dokument } from "../lib/dokument";
import type { Node } from "../lib/typer";

const projektrot = process.cwd();
const kallrot = path.join(projektrot, "Källor");
const fel: string[] = [];
const varningar: string[] = [];

const norm = (varde: string) => varde.normalize("NFC").replaceAll(path.sep, "/");

function allaFiler(katalog: string): string[] {
  return readdirSync(katalog, { withFileTypes: true }).flatMap((post) => {
    const absolut = path.join(katalog, post.name);
    if (post.name === ".DS_Store") return [];
    return post.isDirectory() ? allaFiler(absolut) : [path.relative(projektrot, absolut)];
  });
}

const registrerade = KALLOR.flatMap((kalla) =>
  kalla.filer.map((fil) => ({ kalla, fil, nyckel: norm(fil.sokvag) }))
);
const verkliga = allaFiler(kallrot).map((sokvag) => ({ sokvag, nyckel: norm(sokvag) }));
const registreradeNycklar = new Set(registrerade.map((post) => post.nyckel));
const verkligaNycklar = new Set(verkliga.map((post) => post.nyckel));

for (const fil of verkliga) {
  if (!registreradeNycklar.has(fil.nyckel)) fel.push(`Oregistrerad källfil: ${fil.sokvag}`);
}
for (const post of registrerade) {
  if (!verkligaNycklar.has(post.nyckel)) fel.push(`Registrerad fil saknas: ${post.fil.sokvag}`);
}

const sokvagsantal = new Map<string, number>();
for (const post of registrerade) {
  sokvagsantal.set(post.nyckel, (sokvagsantal.get(post.nyckel) ?? 0) + 1);
}
for (const [sokvag, antal] of sokvagsantal) {
  if (antal !== 1) fel.push(`Källfilen är registrerad ${antal} gånger: ${sokvag}`);
}

const idn = new Set<string>();
for (const kalla of KALLOR) {
  if (idn.has(kalla.id)) fel.push(`Dubblerat käll-ID: ${kalla.id}`);
  idn.add(kalla.id);
  if (!/^[A-Z0-9-]+$/.test(kalla.id)) fel.push(`Ogiltigt käll-ID: ${kalla.id}`);
  if (!kalla.bibliografi.trim()) fel.push(`Bibliografisk post saknas: ${kalla.id}`);
  if (!kalla.amnen.length) fel.push(`Ämnesklassning saknas: ${kalla.id}`);
  if (!kalla.perioder.length) fel.push(`Periodklassning saknas: ${kalla.id}`);
  if (!kalla.filer.some((fil) => fil.relation === "huvudfil" || fil.relation === "utdrag")) {
    fel.push(`Huvudfil eller utdrag saknas: ${kalla.id}`);
  }
}

const hashgrupper = new Map<string, typeof registrerade>();
for (const post of registrerade) {
  const verklig = verkliga.find((fil) => fil.nyckel === post.nyckel);
  if (!verklig) continue;
  const hash = createHash("sha256")
    .update(readFileSync(path.join(projektrot, verklig.sokvag)))
    .digest("hex");
  const grupp = hashgrupper.get(hash) ?? [];
  grupp.push(post);
  hashgrupper.set(hash, grupp);
}
for (const [hash, grupp] of hashgrupper) {
  if (grupp.length < 2) continue;
  if (!grupp.some((post) => post.fil.relation === "exakt-dubblett")) {
    fel.push(`Odeklarerad exakt dubblett (${hash.slice(0, 12)}): ${grupp.map((p) => p.fil.sokvag).join(", ")}`);
  }
}

function allaBlock(block: Block[]): Block[] {
  return block.flatMap((del) => [
    del,
    ...(del.typ === "flikar" ? del.flikar.flatMap((flik) => allaBlock(flik.block)) : []),
  ]);
}

function kontrolleraDokument(sokvag: string, dokument: Dokument) {
  const prefix = `${sokvag} (${dokument.utkast ? "utkast" : "publicerad"})`;
  const notnummer = new Set<number>();
  const brister: string[] = [];

  for (const not of dokument.fotnoter) {
    if (notnummer.has(not.id)) brister.push(`dubblerat hänvisningsnummer ${not.id}`);
    notnummer.add(not.id);
    if (!not.kallaId || !idn.has(not.kallaId)) brister.push(`hänvisning ${not.id} har okänt eller tomt käll-ID`);
    if (!not.lokalisering?.trim()) brister.push(`hänvisning ${not.id} saknar exakt lokalisering`);
    if (!not.stod) brister.push(`hänvisning ${not.id} saknar stödtyp`);
  }

  const anvanda = new Set<number>([
    ...(dokument.ingressKallor ?? []),
    ...(dokument.citat?.kallor ?? []),
  ]);
  const kravblock = allaBlock(dokument.block).filter((del) => del.typ !== "rubrik" && del.typ !== "flikar");
  kravblock.forEach((del, index) => {
    if (!del.kallor?.length) brister.push(`innehållsblock ${index + 1} (${del.typ}) saknar källa`);
    del.kallor?.forEach((id) => anvanda.add(id));
  });
  if (dokument.ingress?.trim() && !dokument.ingressKallor?.length) brister.push("ingressen saknar källa");
  if (dokument.citat?.text.trim() && !dokument.citat.kallor?.length) brister.push("det inledande citatet saknar strukturerad källa");

  for (const id of anvanda) {
    if (!notnummer.has(id)) brister.push(`innehållet hänvisar till okänt nummer ${id}`);
  }
  for (const id of notnummer) {
    if (!anvanda.has(id)) varningar.push(`${prefix}: hänvisning ${id} finns i listan men används inte`);
  }

  const mal = dokument.utkast ? varningar : fel;
  brister.forEach((brist) => mal.push(`${prefix}: ${brist}`));
}

for (const [sokvag, dokument] of Object.entries(GRAMMATIK_DOKUMENT)) {
  kontrolleraDokument(sokvag, dokument);
}

interface Tradpost {
  sokvag: string;
  nod: Node;
}

function plattaTrad(noder: Node[], foralder: string[] = []): Tradpost[] {
  const syskonsluggar = new Set<string>();
  const resultat: Tradpost[] = [];

  for (const nod of noder) {
    const sokvag = [...foralder, nod.slug].join("/");
    if (syskonsluggar.has(nod.slug)) fel.push(`Dubblerad slug bland syskon: ${sokvag}`);
    syskonsluggar.add(nod.slug);
    if (!/^[a-z0-9-]+$/.test(nod.slug)) fel.push(`Ogiltig slug: ${sokvag}`);
    if (nod.kind === "folder" && !nod.children?.length) fel.push(`Tom grammatikmapp: ${sokvag}`);
    if (nod.kind === "doc" && nod.children?.length) fel.push(`Dokument har barn: ${sokvag}`);
    resultat.push({ sokvag, nod });
    if (nod.children?.length) resultat.push(...plattaTrad(nod.children, [...foralder, nod.slug]));
  }
  return resultat;
}

const tradposter = plattaTrad(GRAMMATIK);
const dokumentposter = tradposter.filter((post) => post.nod.kind === "doc");
const tradsokvagar = new Set(tradposter.map((post) => post.sokvag));

for (const regel of KALLPLAN_REGLER) {
  if (!tradsokvagar.has(regel.prefix)) fel.push(`Källplanens prefix finns inte i grammatikträdet: ${regel.prefix}`);
  for (const kallaId of regel.kallor) {
    if (!idn.has(kallaId)) fel.push(`Källplanen ${regel.prefix} använder okänt käll-ID: ${kallaId}`);
  }
}

for (const post of dokumentposter) {
  if (!kallorForArtikel(post.sokvag).length) fel.push(`Planerad artikel saknar källplan: ${post.sokvag}`);
}

for (const sokvag of Object.keys(GRAMMATIK_DOKUMENT)) {
  const post = tradposter.find((kandidat) => kandidat.sokvag === sokvag);
  if (!post) fel.push(`Skrivet grammatikdokument saknas i trädet: ${sokvag}`);
  else if (post.nod.kind !== "doc") fel.push(`Skrivet grammatikdokument pekar på en mapp: ${sokvag}`);
}

const prioriteter = dokumentposter.reduce<Record<number, number>>((summa, post) => {
  const prioritet = produktionsprioritet(post.sokvag);
  summa[prioritet] = (summa[prioritet] ?? 0) + 1;
  return summa;
}, {});

console.log(`Källregister: ${KALLOR.length} verk, ${registrerade.length} filer.`);
console.log(`Kontrollerade grammatikdokument: ${Object.keys(GRAMMATIK_DOKUMENT).length}.`);
console.log(
  `Grammatikarkitektur: ${dokumentposter.length} artiklar, ${tradposter.length - dokumentposter.length} mappar. ` +
    `Prioritet 1–4: ${[1, 2, 3, 4].map((p) => prioriteter[p] ?? 0).join("/")}.`
);
if (varningar.length) {
  console.warn(`\nVarningar (${varningar.length}):`);
  varningar.forEach((varning) => console.warn(`- ${varning}`));
}
if (fel.length) {
  console.error(`\nFel (${fel.length}):`);
  fel.forEach((meddelande) => console.error(`- ${meddelande}`));
  process.exitCode = 1;
} else {
  console.log("\nKällvalideringen godkänd: inga blockerande fel.");
}

