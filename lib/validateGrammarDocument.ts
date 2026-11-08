import type {Block,Dokument} from "./dokument";
function allaBlock(block: Block[]): Block[] {
  return block.flatMap((del) => [
    del,
    ...(del.typ === "flikar" ? del.flikar.flatMap((flik) => allaBlock(flik.block)) : []),
  ]);
}

export function validateGrammarDocument(sokvag:string,dokument:Dokument,idn:Set<string>) {
  const fel: string[] = [];
  const varningar: string[] = [];
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
  return { fel, varningar };
}
