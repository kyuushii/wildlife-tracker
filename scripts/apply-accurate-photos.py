import urllib.request
import urllib.parse
import json
import re

species_wiki = {
    # 18 Core species
    "rocky-mountain-elk": "Elk",
    "north-american-bison-rut": "American_bison",
    "coastal-brown-bear-salmon": "Grizzly_bear",
    "gray-wolf-winter-pack": "Wolf",
    "denali-autumn-tundra-caribou": "Reindeer",
    "sonoran-desert-saguaro-bloom": "Saguaro",
    "synchronous-fireflies-smokies": "Photinus_carolinus",
    "southern-appalachian-fall-foliage": "Great_Smoky_Mountains_National_Park",
    "shiras-moose": "Moose",
    "rocky-mountain-bighorn-sheep": "Bighorn_sheep",
    "quaking-aspen-foliage": "Populus_tremuloides",
    "alpine-wildflower-explosion": "Castilleja",
    "american-pika": "American_pika",
    "bald-eagle-winter-roost": "Bald_eagle",
    "zion-autumn-cottonwoods": "Populus_fremontii",
    "sandhill-crane-migration": "Sandhill_crane",
    "white-tailed-ptarmigan": "White-tailed_ptarmigan",
    "bristlecone-pine-astro": "Pinus_aristata",

    # 35 Additional species
    "grizzly-bear-yellowstone": "Grizzly_bear",
    "american-black-bear": "American_black_bear",
    "mountain-lion": "Cougar",
    "bobcat": "Bobcat",
    "mule-deer": "Mule_deer",
    "pronghorn-antelope": "Pronghorn",
    "red-fox-snow": "Red_fox",
    "yellow-bellied-marmot": "Yellow-bellied_marmot",
    "black-tailed-prairie-dog": "Black-tailed_prairie_dog",
    "sea-otter-coastal": "Sea_otter",
    "greater-sage-grouse": "Greater_sage-grouse",
    "gunnison-sage-grouse": "Gunnison_sage-grouse",
    "burrowing-owl": "Burrowing_owl",
    "osprey-fishing": "Osprey",
    "great-blue-heron-rookery": "Great_blue_heron",
    "broad-tailed-hummingbird": "Broad-tailed_hummingbird",
    "american-dipper": "American_dipper",
    "mountain-bluebird": "Mountain_bluebird",
    "tufted-puffin-coastal": "Tufted_puffin",
    "colorado-blue-columbine": "Aquilegia_coerulea",
    "beargrass-cascades": "Xerophyllum_tenax",
    "desert-spring-superbloom": "Picacho_Peak_State_Park",
    "rocky-mountain-goat": "Mountain_goat",
    "canada-lynx": "Canada_lynx",
    "river-otter": "North_American_river_otter",
    "american-badger": "American_badger",
    "american-pine-marten": "American_marten",
    "north-american-porcupine": "North_American_porcupine",
    "great-gray-owl": "Great_gray_owl",
    "golden-eagle": "Golden_eagle",
    "peregrine-falcon": "Peregrine_falcon",
    "trumpeter-swan": "Trumpeter_swan",
    "common-loon": "Common_loon",
    "calypso-orchid": "Calypso_bulbosa",
    "avalanche-glacier-lily": "Erythronium_grandiflorum"
}

titles = list(set(species_wiki.values()))
batches = [titles[i:i+25] for i in range(0, len(titles), 25)]

image_map = {}
for batch in batches:
    joined = "|".join(batch)
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={joined}&prop=pageimages&format=json&pithumbsize=960&redirects=1"
    req = urllib.request.Request(url, headers={"User-Agent": "ColoradoPhotoSeasons/1.0 (info@coloradophoto.org)"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        pages = data.get("query", {}).get("pages", {})
        redirects = {r["to"]: r["from"] for r in data.get("query", {}).get("redirects", [])}
        for pid, pdata in pages.items():
            t = pdata.get("title")
            thumb = pdata.get("thumbnail", {}).get("source")
            if thumb:
                image_map[t] = thumb
                image_map[t.replace(" ", "_")] = thumb
                orig = redirects.get(t)
                if orig:
                    image_map[orig] = thumb
                    image_map[orig.replace(" ", "_")] = thumb

print(f"Fetched {len(image_map)} images from Wikipedia API")

# Update colorado-data.ts
with open('src/data/colorado-data.ts', 'r', encoding='utf-8') as f:
    cd_code = f.read()

for sid, wtitle in species_wiki.items():
    thumb_url = image_map.get(wtitle) or image_map.get(wtitle.replace("_", " "))
    if thumb_url:
        # Replace existing imageUrl for this subject
        pattern = rf"(id:\s*'{sid}',.*?imageUrl:\s*')[^']+"
        cd_code = re.sub(pattern, rf"\g<1>{thumb_url}", cd_code, count=1, flags=re.DOTALL)

with open('src/data/colorado-data.ts', 'w', encoding='utf-8') as f:
    f.write(cd_code)

print("Updated colorado-data.ts with accurate photos!")

# Update additional-species.ts
with open('src/data/additional-species.ts', 'r', encoding='utf-8') as f:
    add_code = f.read()

for sid, wtitle in species_wiki.items():
    thumb_url = image_map.get(wtitle) or image_map.get(wtitle.replace("_", " "))
    if thumb_url:
        pattern = rf"(id:\s*'{sid}',.*?imageUrl:\s*')[^']+"
        add_code = re.sub(pattern, rf"\g<1>{thumb_url}", add_code, count=1, flags=re.DOTALL)

with open('src/data/additional-species.ts', 'w', encoding='utf-8') as f:
    f.write(add_code)

print("Updated additional-species.ts with accurate photos!")
