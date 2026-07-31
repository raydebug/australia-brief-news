import fs from "node:fs";

const news = JSON.parse(fs.readFileSync("public/news.en.json", "utf8"));
const appSource = fs.readFileSync("src/main.jsx", "utf8");

const configuredNames = new Set(
  [...appSource.matchAll(/name:\s*"([^"]+)"/g)]
    .map((match) => match[1].toLowerCase())
);

const configuredAliases = new Set(
  [...appSource.matchAll(/aliases:\s*\[([^\]]+)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((alias) => alias[1].toLowerCase()))
);

const ignored = new Set([
  "ABC News",
  "AAP News",
  "SBS News",
  "Sky News",
  "Guardian Australia",
  "The Guardian",
  "The Guardian Australia",
  "The Sydney Morning Herald",
  "The Age Brisbane Times",
  "Financial Review",
  "The Australian",
  "Australian Financial Review",
  "Yahoo News",
  "News Corp",
  "Football Australia",
  "Australia Post",
  "Origin Energy",
  "Rio Tinto",
  "New South Wales",
  "Northern Territory",
  "South Australia",
  "Western Australia",
  "North Queensland",
  "Port Hedland",
  "Wiley Park",
  "Gold Coast",
  "Arnhem Land",
  "Fitzroy River",
  "Middle East",
  "Queensland Police",
  "Victoria Police",
  "Federal Court",
  "High Court",
  "Local Court",
  "Reserve Bank",
  "Triple Zero",
  "Darwin Festival",
  "Government House",
  "Labor Party",
  "Liberal Party",
  "National Party",
  "Greens Party",
  "One Nation",
  "Federal Labor",
  "First Nations",
  "Prime Minister",
  "Opposition Leader",
  "Communications Minister",
  "World Cup",
  "Adult Crime",
  "Adult Time",
  "Archibald People",
  "Arnhem Land The Garma",
  "Cowboys Sydney Roosters",
  "El Ni",
  "If Canberra",
  "Kiama Library",
  "Northern Territory Administrator David",
  "Port Hedland Workers",
  "Queen Elizabeth",
  "Regional Victoria",
  "Rockhampton Documents",
  "Toyota Yaris",
  "Victorian Labor",
  "Virtual Mental Health Hub",
  "Wall Street",
  "Australia Brief"
].map((item) => item.toLowerCase()));

function textForCluster(cluster) {
  return [
    cluster.headline,
    cluster.voiceScript,
    ...(cluster.differences || []),
    ...(cluster.links || []).map((link) => link.source)
  ].filter(Boolean).join(" ");
}

function candidateNames(text) {
  const matches = text.match(/\b[A-Z][a-z]+(?:\s+(?:[A-Z][a-z]+|Mc[A-Z][a-z]+|O'[A-Z][a-z]+)){1,3}\b/g) || [];
  return matches
    .map((name) =>
      name
        .replace(/\s+/g, " ")
        .replace(/^(?:General|Senator|Minister|Premier|Professor|Dr|Mr|Ms|Mrs)\s+/, "")
        .trim()
    )
    .filter((name) => {
      const lower = name.toLowerCase();
      if (ignored.has(lower)) return false;
      if (lower.startsWith("the ")) return false;
      if (configuredNames.has(lower) || configuredAliases.has(lower)) return false;
      if (/\b(News|Court|Police|Government|University|Hospital|Council|Party|Festival|Budget|Commission|Department)\b/.test(name)) {
        return false;
      }
      return true;
    });
}

const found = new Map();

for (const cluster of news.clusters || []) {
  for (const name of candidateNames(textForCluster(cluster))) {
    const key = name.toLowerCase();
    const existing = found.get(key) || { name, count: 0, ids: new Set() };
    existing.count += 1;
    existing.ids.add(cluster.id);
    found.set(key, existing);
  }
}

const rows = [...found.values()]
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  .slice(0, 40);

if (!rows.length) {
  console.log("No obvious unconfigured people found.");
  process.exit(0);
}

console.log("Possible unconfigured people:");
for (const row of rows) {
  console.log(`- ${row.name} (${row.count}) :: ${[...row.ids].slice(0, 5).join(", ")}`);
}
