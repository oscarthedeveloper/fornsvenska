import test from "node:test";
import assert from "node:assert/strict";
import { valideraTexter } from "../scripts/validate-texter.ts";
import { TEXTER_DOKUMENT } from "../data/textdokument.ts";

test("T06: textvalidatorn godkänner aktuell giltig korpus", () => {
  const res = valideraTexter();
  assert.equal(res.fel.length, 0, `Förväntade 0 fel, fick: ${res.fel.join("; ")}`);
  assert.equal(res.statistik.antalDokumentITrad, res.statistik.antalDokumentIStore);
  assert.ok(res.statistik.antalDokumentITrad >= 14);
  assert.ok(res.statistik.antalSegmentId >= 1);
});

test("T06 negativt test: upptäcker dokument som saknas i store", () => {
  const dummyTrad = [
    { slug: "lagar", title: "Lagar", kind: "folder", children: [
      { slug: "aldre-vastgotalagen", title: "AVG", kind: "folder", children: [
        { slug: "icke-existerande-balk", title: "Spökbalk", kind: "doc" }
      ]}
    ]}
  ];

  const res = valideraTexter({
    overrideTrad: dummyTrad,
    ignoreraGeneratorSynk: true,
  });

  assert.ok(res.fel.some((f) => f.includes("icke-existerande-balk")), "Borde ha flaggat saknat dokument");
});

test("T06 negativt test: upptäcker dubbel primärkoppling (dubblerat segment-ID)", () => {
  const dummyDokument = {
    "lagar/aldre-vastgotalagen/kristnu-balker-i": {
      titel: "Test",
      sektioner: [
        {
          rubrik: "S1",
          meningar: [
            { fsv: "Ord ett", tolkning: "Tolkning ett", segmentId: "avg-b01-punkt01-seg001" },
            { fsv: "Ord två", tolkning: "Tolkning två", segmentId: "avg-b01-punkt01-seg001" }
          ]
        }
      ],
      fotnoter: []
    }
  };

  const dummyTrad = [
    { slug: "lagar", title: "Lagar", kind: "folder", children: [
      { slug: "aldre-vastgotalagen", title: "AVG", kind: "folder", children: [
        { slug: "kristnu-balker-i", title: "Del 1", kind: "doc" }
      ]}
    ]}
  ];

  const res = valideraTexter({
    overrideDokument: dummyDokument,
    overrideTrad: dummyTrad,
    ignoreraGeneratorSynk: true,
  });

  assert.ok(res.fel.some((f) => f.includes("Dubbel primärkoppling") && f.includes("avg-b01-punkt01-seg001")),
    "Borde ha flaggat dubblerat segment-ID");
});

test("T06 negativt test: upptäcker ogiltig källa (oregistrerat kallaId)", () => {
  const dummyDokument = {
    "lagar/aldre-vastgotalagen/kristnu-balker-i": {
      titel: "Test",
      kallaId: "PÅHITTAD-KÄLLA-999",
      sektioner: [
        {
          rubrik: "S1",
          meningar: [
            { fsv: "Ord ett", tolkning: "Tolkning ett" }
          ]
        }
      ],
      fotnoter: []
    }
  };

  const dummyTrad = [
    { slug: "lagar", title: "Lagar", kind: "folder", children: [
      { slug: "aldre-vastgotalagen", title: "AVG", kind: "folder", children: [
        { slug: "kristnu-balker-i", title: "Del 1", kind: "doc" }
      ]}
    ]}
  ];

  const res = valideraTexter({
    overrideDokument: dummyDokument,
    overrideTrad: dummyTrad,
    ignoreraGeneratorSynk: true,
  });

  assert.ok(res.fel.some((f) => f.includes("Ogiltig källa") && f.includes("PÅHITTAD-KÄLLA-999")),
    "Borde ha flaggat ogiltigt kallaId");
});

test("T06 negativt test: upptäcker otillåtna platshållare (TODO/FIXME)", () => {
  const dummyDokument = {
    "lagar/aldre-vastgotalagen/kristnu-balker-i": {
      titel: "Test",
      sektioner: [
        {
          rubrik: "S1",
          meningar: [
            { fsv: "TODO: hämta text från manuskript", tolkning: "Tolkning" }
          ]
        }
      ],
      fotnoter: []
    }
  };

  const dummyTrad = [
    { slug: "lagar", title: "Lagar", kind: "folder", children: [
      { slug: "aldre-vastgotalagen", title: "AVG", kind: "folder", children: [
        { slug: "kristnu-balker-i", title: "Del 1", kind: "doc" }
      ]}
    ]}
  ];

  const res = valideraTexter({
    overrideDokument: dummyDokument,
    overrideTrad: dummyTrad,
    ignoreraGeneratorSynk: true,
  });

  assert.ok(res.fel.some((f) => f.includes("Förbjuden platshållare")),
    "Borde ha flaggat TODO-platshållare");
});

test("T06 negativt test: upptäcker osynkad generator vid avvikelse", () => {
  // Simulera att storen har en ändrad titel som inte matchar källfilen på disk
  const mismatchDokument = {
    ...TEXTER_DOKUMENT,
    "lagar/aldre-vastgotalagen/kristnu-balker-i": {
      ...TEXTER_DOKUMENT["lagar/aldre-vastgotalagen/kristnu-balker-i"],
      titel: "Ändrad i hemlighet utan att köra build",
    }
  };

  const res = valideraTexter({
    overrideDokument: mismatchDokument,
    ignoreraGeneratorSynk: false,
  });

  assert.ok(res.fel.some((f) => f.includes("Osynkad generator") && f.includes("kristnu-balker-i")),
    "Borde ha flaggat osynkad generator");
});
