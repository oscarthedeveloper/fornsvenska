import os
import unicodedata
import json
import re
import pypdf

ROOT = "/Users/oscarpagerup/Desktop/Git Repo/fornsvenska"
KALLOR_ENTRY = [e for e in os.listdir(ROOT) if unicodedata.normalize("NFC", e) == "Källor"][0]
KALLOR_PATH = os.path.join(ROOT, KALLOR_ENTRY)

VG_ENTRY = [e for e in os.listdir(KALLOR_PATH) if "Västgötalagen" in unicodedata.normalize("NFC", e)][0]
VG_PATH = os.path.join(KALLOR_PATH, VG_ENTRY)

OUTPUT_DIR = os.path.join(ROOT, "docs/vastgotalagen")
RAW_DIR = os.path.join(OUTPUT_DIR, "kalltext-ra")
os.makedirs(RAW_DIR, exist_ok=True)

reader = pypdf.PdfReader(vg_path := VG_PATH)
num_pages = len(reader.pages)

print(f"Reading {vg_path} ({num_pages} pages)...")

# Balkkarta enligt TRANSKRIPTIONSPLAN.md avsnitt 3
BALK_MAPPING = [
    {"id": "B01", "num": "1", "kallrubrik": "Kirkiu Bolkær", "startPage": 1, "endPage": 3},
    {"id": "B02", "num": "2", "kallrubrik": "Af mandrapi.", "startPage": 3, "endPage": 5},
    {"id": "B03", "num": "3", "kallrubrik": "?ætta ær af særæ malum bolkar.", "startPage": 6, "endPage": 6},
    {"id": "B04", "num": "4", "kallrubrik": "af vaþæ sarum.", "startPage": 6, "endPage": 7},
    {"id": "B05", "num": "5", "kallrubrik": "þættæ ær bardaghæ.", "startPage": 7, "endPage": 8},
    {"id": "B06", "num": "6", "kallrubrik": "Orbotæ mal.", "startPage": 8, "endPage": 8},
    {"id": "B07", "num": "7", "kallrubrik": "?ætta ær ærfþær bolkær.", "startPage": 8, "endPage": 11},
    {"id": "B08", "num": "8", "kallrubrik": "Giptar bolker", "startPage": 11, "endPage": 13},
    {"id": "B09", "num": "9", "kallrubrik": "þættæ ær rætlosæ bolkær.", "startPage": 13, "endPage": 15},
    {"id": "B10", "num": "10", "kallrubrik": "Iordþær bolkær", "startPage": 15, "endPage": 18},
    {"id": "B11", "num": "11", "kallrubrik": "Huru mylnu skal gæræ", "startPage": 18, "endPage": 18},
    {"id": "B12", "num": "12", "kallrubrik": "?ætta ær. þiuuæ bollkær", "startPage": 18, "endPage": 22},
    {"id": "B13a", "num": "13", "kallrubrik": "?atta ær fornæmix sakir.", "startPage": 22, "endPage": 22},
    {"id": "B13b", "num": "13", "kallrubrik": "Fornamix bolkær.", "startPage": 23, "endPage": 24},
    {"id": "B14", "num": "14", "kallrubrik": "?attæ ær lecara rætar.", "startPage": 24, "endPage": 24},
    {"id": "B15", "num": "15", "kallrubrik": "?ættæ ær conongs bolkær", "startPage": 24, "endPage": 24},
    {"id": "B16", "num": "16", "kallrubrik": "Horo þing lot skal skiptæ.", "startPage": 24, "endPage": 25},
]

pages_raw = {}
sidkarta = []

for idx, page in enumerate(reader.pages):
    p_num = idx + 1
    raw_text = page.extract_text()
    pages_raw[p_num] = raw_text
    
    # Save raw text
    raw_file = os.path.join(RAW_DIR, f"sida-{p_num:02d}.txt")
    with open(raw_file, "w", encoding="utf-8") as rf:
        rf.write(raw_text)
    
    # Basic page stats
    lines = raw_text.split("\n")
    headers = [l.strip() for l in lines if l.strip().startswith("#")]
    sidkarta.append({
        "sida": p_num,
        "radantal": len(lines),
        "teckenantal": len(raw_text),
        "rubriker": headers,
        "fil": f"kalltext-ra/sida-{p_num:02d}.txt"
    })

print(f"Extracted all {num_pages} pages to {RAW_DIR}")

# Build inventory of points and segments
# A segment is formed by:
# 1. Section Header (# X ...)
# 2. Intro line if present (e.g. "1. Her byriarz laghbok væsgöta")
# 3. Main numbered items (1., 2., 3., ...)
# 4. Any sub-paragraphs (§. 1., §. 2.)

segments = []
current_balk = BALK_MAPPING[0]
current_balk_idx = 0

# Parse each balk according to pages and headers
# We parse the full concatenated text with page boundary markers
full_text_with_pages = []
for p_num in range(1, num_pages + 1):
    raw = pages_raw[p_num]
    # Strip page footer e.g. "Page 1"
    raw_clean = re.sub(r"\n\s*Page\s+\d+\s*$", "", raw, flags=re.MULTILINE)
    full_text_with_pages.append((p_num, raw_clean))

# Match all headers and main items across the text
all_tokens = []
for p_num, p_text in full_text_with_pages:
    lines = p_text.split("\n")
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        all_tokens.append((p_num, stripped))

# Group into sections and numbered items
sections_inventory = []
cur_sec = None
cur_item = None

for p_num, line in all_tokens:
    if line.startswith("#"):
        # Header found
        if cur_sec:
            sections_inventory.append(cur_sec)
        
        # Match which balk this is
        m = re.match(r"^#\s*(\d+)\s*(.*)$", line)
        h_num = m.group(1) if m else "?"
        h_title = m.group(2).strip() if m else line
        
        cur_sec = {
            "header_line": line,
            "header_num": h_num,
            "header_title": h_title,
            "page_start": p_num,
            "items": []
        }
        cur_item = None
        continue
    
    # Check if this line starts a numbered point: "1. ", "2. ", etc.
    pt_match = re.match(r"^(\d+)\.\s*(.*)$", line)
    if pt_match:
        pt_num = pt_match.group(1)
        pt_rest = pt_match.group(2).strip()
        
        if cur_sec is None:
            # Preamble on page 1 before # 1
            cur_sec = {
                "header_line": "# 0 Förord",
                "header_num": "0",
                "header_title": "Förord och utgivarupplysning",
                "page_start": p_num,
                "items": []
            }
        
        cur_item = {
            "point_num": pt_num,
            "page_start": p_num,
            "pages": [p_num],
            "lines": [line],
            "raw_text": line
        }
        cur_sec["items"].append(cur_item)
    else:
        # Continuation of current item, or intro text
        if cur_item:
            cur_item["lines"].append(line)
            cur_item["raw_text"] += " " + line
            if p_num not in cur_item["pages"]:
                cur_item["pages"].append(p_num)
        elif cur_sec:
            if not cur_sec["items"]:
                # Intro text under header before point 1
                cur_item = {
                    "point_num": "intro",
                    "page_start": p_num,
                    "pages": [p_num],
                    "lines": [line],
                    "raw_text": line
                }
                cur_sec["items"].append(cur_item)
            else:
                cur_sec["items"][-1]["lines"].append(line)
                cur_sec["items"][-1]["raw_text"] += " " + line
                if p_num not in cur_sec["items"][-1]["pages"]:
                    cur_sec["items"][-1]["pages"].append(p_num)

if cur_sec:
    sections_inventory.append(cur_sec)

print(f"Total sections discovered: {len(sections_inventory)}")
total_pts = sum(len(s["items"]) for s in sections_inventory)
print(f"Total numbered points discovered: {total_pts}")

# Build formal tackning.json
tackning = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "kallaId": "AVG-MASKIN",
    "kallfil": "Källor/Västgötalagen i maskintext.pdf",
    "sha256": "b1065ce2871bf49afa9f3bb046f0a1d053632bd48bffb110f13204cdf48f4f5b",
    "sidantal": 25,
    "datum": "2026-10-22",
    "sidkarta": sidkarta,
    "balkar": [],
    "totalaSektioner": len(sections_inventory),
    "totalaPunkter": total_pts,
    "segment": []
}

seg_idx = 1
for s_idx, sec in enumerate(sections_inventory):
    # Find matching BALK_MAPPING
    balk_meta = None
    if s_idx < len(BALK_MAPPING):
        balk_meta = BALK_MAPPING[s_idx]
    
    balk_id = balk_meta["id"] if balk_meta else f"B{s_idx:02d}"
    
    balk_entry = {
        "balkId": balk_id,
        "kallrubrik": sec["header_title"],
        "kallnummer": sec["header_num"],
        "sidaStart": sec["page_start"],
        "antalPunkter": len(sec["items"]),
        "punkter": []
    }
    
    for item in sec["items"]:
        pt_num = item["point_num"]
        words = item["raw_text"].split()
        start_anchor = " ".join(words[:6]) if len(words) >= 6 else item["raw_text"]
        end_anchor = " ".join(words[-6:]) if len(words) >= 6 else item["raw_text"]
        
        # Check for gap markers e.g. {oc arf...}
        gaps_found = re.findall(r"\{[^}]*\}", item["raw_text"])
        has_question_marks = "?" in item["raw_text"]
        
        # Subpoints §. 1. etc.
        subpoints = re.findall(r"§\.\s*\d+[^.]*\.", item["raw_text"])
        
        seg_id = f"avg-{balk_id.lower()}-pt{pt_num.lower()}-seg{seg_idx:03d}"
        
        segment_entry = {
            "id": seg_id,
            "balkId": balk_id,
            "kallaId": "AVG-MASKIN",
            "pdfSidor": item["pages"],
            "kallrubrik": sec["header_title"],
            "huvudpunkt": pt_num,
            "underpunkter": subpoints if subpoints else [],
            "startankare": start_anchor,
            "slutankare": end_anchor,
            "ordantalFsv": len(words),
            "harKalluckor": len(gaps_found) > 0,
            "kalluckor": gaps_found,
            "harFragetecken": has_question_marks,
            "status": "extraherad",
            "kallkontroll": None,
            "tolkningskontroll": None,
            "avvikelser": []
        }
        
        tackning["segment"].append(segment_entry)
        balk_entry["punkter"].append(pt_num)
        seg_idx += 1
        
    tackning["balkar"].append(balk_entry)

tackning_file = os.path.join(OUTPUT_DIR, "tackning.json")
with open(tackning_file, "w", encoding="utf-8") as tf:
    json.dump(tackning, tf, ensure_ascii=False, indent=2)

print(f"Generated {tackning_file} with {len(tackning['segment'])} segments across {len(tackning['balkar'])} sections.")
