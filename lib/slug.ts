/** Gör en URL-vänlig slug av en svensk titel. */
export function tillSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/[éè]/g, "e")
    .replace(/[æ]/g, "ae")
    .replace(/[þ]/g, "th")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "namnlos";
}
