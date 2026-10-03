import re

EXACT_OVERRIDE_URLS = {
    'gray-wolf-winter-pack': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Canis_lupus_occidentalis.jpg/960px-Canis_lupus_occidentalis.jpg',
    'denali-autumn-tundra-caribou': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Caribou._Denali_National_Park%2C_Alaska_%2851094337350%29.jpg/960px-Caribou._Denali_National_Park%2C_Alaska_%2851094337350%29.jpg',
    'coastal-brown-bear-salmon': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/A053%2C_Katmai_National_Park%2C_Brooks_Falls%2C_Alaska%2C_USA%2C_bear_and_salmon%2C_2002.jpg',
    'quaking-aspen-foliage': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Quaking_aspens_in_autumn_on_Tenderfoot_Mountain%2C_Colorado%2C_US.jpg/960px-Quaking_aspens_in_autumn_on_Tenderfoot_Mountain%2C_Colorado%2C_US.jpg',
    'alpine-wildflower-explosion': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Yankee_Boy_Basin_2006-07-18_%28198530954%29.jpg/960px-Yankee_Boy_Basin_2006-07-18_%28198530954%29.jpg',
    'bristlecone-pine-astro': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Pinus_aristata_1.jpg/960px-Pinus_aristata_1.jpg',
    'desert-spring-superbloom': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Kaldari_Eschscholzia_californica_01.jpg/960px-Kaldari_Eschscholzia_californica_01.jpg',
    'southern-appalachian-fall-foliage': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Another_view_of_the_Cades_Cove_area_IMG_5004.JPG/960px-Another_view_of_the_Cades_Cove_area_IMG_5004.JPG',
}

# Update colorado-data.ts
with open('src/data/colorado-data.ts', 'r', encoding='utf-8') as f:
    cd = f.read()

for sid, url in EXACT_OVERRIDE_URLS.items():
    pattern = rf"(id:\s*'{sid}',.*?imageUrl:\s*')[^']+"
    cd = re.sub(pattern, rf"\g<1>{url}", cd, count=1, flags=re.DOTALL)

with open('src/data/colorado-data.ts', 'w', encoding='utf-8') as f:
    f.write(cd)

# Update additional-species.ts
with open('src/data/additional-species.ts', 'r', encoding='utf-8') as f:
    add = f.read()

for sid, url in EXACT_OVERRIDE_URLS.items():
    pattern = rf"(id:\s*'{sid}',.*?imageUrl:\s*')[^']+"
    add = re.sub(pattern, rf"\g<1>{url}", add, count=1, flags=re.DOTALL)

with open('src/data/additional-species.ts', 'w', encoding='utf-8') as f:
    f.write(add)

print("Exact overrides applied successfully!")
