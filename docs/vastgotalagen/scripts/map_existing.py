import os
import sys
import json
import re

ROOT = "/Users/oscarpagerup/Desktop/Git Repo/fornsvenska"
sys.path.insert(0, os.path.join(ROOT, "scripts"))
import build_textdokument

TACKNING_PATH = os.path.join(ROOT, "docs/vastgotalagen/tackning.json")
with open(TACKNING_PATH, "r", encoding="utf-8") as tf:
    tackning = json.load(tf)

# Load existing 3 documents
existing_slugs = [
    "lagar/aldre-vastgotalagen/kristnu-balker-i",
    "lagar/aldre-vastgotalagen/kristnu-balker-ii",
    "lagar/aldre-vastgotalagen/arfda-balker"
]

existing_docs = {s: build_textdokument.DATA[s] for s in existing_slugs}

print("Loaded 3 existing documents:")
all_existing_meningar = []
for slug, doc in existing_docs.items():
    doc_title = doc.get("titel", "")
    sections = doc.get("sektioner", [])
    m_count = sum(len(s.get("meningar", [])) for s in sections)
    print(f"  {slug}: {doc_title} ({len(sections)} sektioner, {m_count} meningar)")
    
    for s_idx, sec in enumerate(sections):
        sec_title = sec.get("rubrik", "")
        sec_hanv = sec.get("hanvisning", "")
        for m_idx, m in enumerate(sec.get("meningar", [])):
            all_existing_meningar.append({
                "doc_slug": slug,
                "doc_title": doc_title,
                "sec_idx": s_idx + 1,
                "sec_title": sec_title,
                "sec_hanvisning": sec_hanv,
                "m_idx": m_idx + 1,
                "fsv": m.get("fsv", "").strip(),
                "tolkning": m.get("tolkning", "").strip(),
                "kommentar": m.get("kommentar", "").strip() if m.get("kommentar") else None,
            })

print(f"Total existing Mening-poster: {len(all_existing_meningar)}")

# Load all segments from tackning.json
segments_by_id = {s["id"]: s for s in tackning["segment"]}
segments_by_balk = {}
for s in tackning["segment"]:
    segments_by_balk.setdefault(s["balkId"], []).append(s)

# Read raw page texts
raw_pages = {}
for p in range(1, 26):
    p_path = os.path.join(ROOT, f"docs/vastgotalagen/kalltext-ra/sida-{p:02d}.txt")
    with open(p_path, "r", encoding="utf-8") as pf:
        raw_pages[p] = pf.read()

# Helper to normalize for fuzzy matching
def norm_match(s):
    s = s.lower()
    s = re.sub(r"[.,:;?!{}\[\]\n\r]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

# Match each existing mening
matches = []
for em in all_existing_meningar:
    fsv = em["fsv"]
    fsv_norm = norm_match(fsv)
    first_words = fsv_norm.split()[:4]
    last_words = fsv_norm.split()[-4:]
    
    # Search in which segment this appears
    candidate_segs = []
    
    # Determine target balk
    target_balk = "B01" if "kristnu" in em["doc_slug"] else "B07"
    for seg in segments_by_balk.get(target_balk, []):
        # check raw text of the pages where this segment lives
        p_num = seg["pdfSidor"][0]
        p_raw = raw_pages[p_num]
        if len(seg["pdfSidor"]) > 1:
            p_raw += " " + raw_pages[seg["pdfSidor"][1]]
        
        p_raw_norm = norm_match(p_raw)
        
        # Check match
        if " ".join(first_words) in p_raw_norm or " ".join(last_words) in p_raw_norm:
            candidate_segs.append(seg)
    
    matches.append({
        "mening": em,
        "candidates": candidate_segs
    })

print(f"Matched {len(matches)} existing sentences against segments.")

# Now perform deep textual diff for each of the 32 sentences
avvikelser = []
matris = []

for idx, m in enumerate(matches):
    em = m["mening"]
    fsv = em["fsv"]
    cands = m["candidates"]
    
    doc_id = em["doc_slug"].split("/")[-1]
    ref_id = f"{doc_id}-s{em['sec_idx']}-m{em['m_idx']}"
    
    if not cands:
        avvikelser.append({
            "id": f"AVV-{len(avvikelser)+1:03d}",
            "typ": "kallstalle_saknas",
            "prioritet": "hog",
            "lokalisering": ref_id,
            "beskrivning": f"Kunde inte entydigt matcha i källan: '{fsv[:50]}...'",
            "befintlig_fsv": fsv,
            "kallstalle": None
        })
        continue
    
    seg = cands[0]
    seg_id = seg["id"]
    pt_num = seg["huvudpunkt"]
    pdf_pages = seg["pdfSidor"]
    
    # Check if exact substring in raw page text
    p_raw = raw_pages[pdf_pages[0]]
    if len(pdf_pages) > 1:
        p_raw += " " + raw_pages[pdf_pages[1]]
    
    # Look for exact or modified presence
    exact_present = fsv in p_raw
    fsv_n = norm_match(fsv)
    norm_present = fsv_n in norm_match(p_raw)
    
    diff_notes = []
    if not exact_present:
        if norm_present:
            diff_notes.append("Interpunktion, radbrytning eller skiljetecken skiljer sig från källan.")
        else:
            diff_notes.append("Ordföljd eller böjningsformer avviker från källan.")
            
    # Check segment coverage
    matris.append({
        "ref_id": ref_id,
        "doc_slug": em["doc_slug"],
        "sec": em["sec_idx"],
        "m": em["m_idx"],
        "hanvisning": em["sec_hanvisning"],
        "seg_id": seg_id,
        "balk": seg["balkId"],
        "punkt": pt_num,
        "pdf_sidor": pdf_pages,
        "exakt_i_kallan": exact_present,
        "norm_i_kallan": norm_present,
        "diff_notes": diff_notes,
        "fsv": fsv,
        "tolkning": em["tolkning"],
        "kommentar": em["kommentar"]
    })
    
    if diff_notes:
        avvikelser.append({
            "id": f"AVV-{len(avvikelser)+1:03d}",
            "typ": "textavvikelse",
            "prioritet": "medel",
            "lokalisering": f"{ref_id} -> {seg_id} (punkt {pt_num}, s. {pdf_pages})",
            "beskrivning": "; ".join(diff_notes),
            "befintlig_fsv": fsv,
            "kallstalle": seg_id
        })

print(f"Generated matrix with {len(matris)} rows and {len(avvikelser)} deviations.")

# Save mapping report and avvikelser.md
with open(os.path.join(ROOT, "docs/vastgotalagen/avvikelselista.json"), "w", encoding="utf-8") as af:
    json.dump({"matris": matris, "avvikelser": avvikelser}, af, ensure_ascii=False, indent=2)

# Update tackning.json with dokumentkopplingar
for row in matris:
    s_id = row["seg_id"]
    if s_id in segments_by_id:
        target_seg = segments_by_id[s_id]
        target_seg.setdefault("dokumentkopplingar", [])
        koop = f"{row['doc_slug']}#s{row['sec']}-m{row['m']}"
        if koop not in target_seg["dokumentkopplingar"]:
            target_seg["dokumentkopplingar"].append(koop)

with open(TACKNING_PATH, "w", encoding="utf-8") as tf:
    json.dump(tackning, tf, ensure_ascii=False, indent=2)

print("Updated tackning.json with document links.")
