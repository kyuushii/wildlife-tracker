import re

with open('src/data/colorado-data.ts', 'r', encoding='utf-8') as f:
    cd = f.read()

# 1. Update Caribou to mammal
cd = cd.replace(
    "id: 'denali-autumn-tundra-caribou',\n    name: 'Denali Tundra Autumn & Caribou Rut',\n    scientificName: 'Rangifer tarandus granti',\n    category: 'tree_foliage',",
    "id: 'denali-autumn-tundra-caribou',\n    name: 'Barren-Ground Caribou',\n    scientificName: 'Rangifer tarandus granti',\n    category: 'mammal',"
)
cd = cd.replace(
    "id: 'denali-autumn-tundra-caribou',\n    imageUrl:",
    "id: 'denali-autumn-tundra-caribou',\n    imageUrl:"
)
# Fix names
cd = cd.replace("name: 'North American Bison (Yellowstone Rut)'", "name: 'American Bison'")
cd = cd.replace("name: 'Coastal Brown Bear & Salmon Run'", "name: 'Coastal Brown Bear'")
cd = cd.replace("name: 'Gray Wolf (Yellowstone Winter Packs)'", "name: 'Gray Wolf'")
cd = cd.replace("name: 'Bald Eagle (Winter Concentrations)'", "name: 'Bald Eagle'")
cd = cd.replace("name: 'Greater Sandhill Crane Migration'", "name: 'Sandhill Crane'")

# Saguaro blossom
cd = cd.replace("name: 'Sonoran Desert Saguaro & Spring Superbloom'", "name: 'Saguaro Cactus Blossom'")
cd = re.sub(
    r"(id:\s*'sonoran-desert-saguaro-bloom',.*?imageUrl:\s*')[^']+",
    r"\g<1>https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Saguaro_Cactus_Bloom.jpg/960px-Saguaro_Cactus_Bloom.jpg",
    cd, flags=re.DOTALL
)

# Indian Paintbrush
cd = cd.replace("name: 'High Mountain Wildflower Superblooms'", "name: 'Rocky Mountain Indian Paintbrush'")
cd = cd.replace("scientificName: 'Castilleja / Lupinus / Delphinium spp.'", "scientificName: 'Castilleja miniata'")
cd = re.sub(
    r"(id:\s*'alpine-wildflower-explosion',.*?imageUrl:\s*')[^']+",
    r"\g<1>https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Castilleja_miniata_close.jpg/960px-Castilleja_miniata_close.jpg",
    cd, flags=re.DOTALL
)

# Sugar Maple
cd = cd.replace("name: 'Southern Appalachian Hardwood Autumn'", "name: 'Sugar Maple (Appalachian Fall)'")
cd = cd.replace("scientificName: 'Acer saccharum / Quercus alba'", "scientificName: 'Acer saccharum'")
cd = re.sub(
    r"(id:\s*'southern-appalachian-fall-foliage',.*?imageUrl:\s*')[^']+",
    r"\g<1>https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Acer_saccharum_%28213110565%29.jpg/960px-Acer_saccharum_%28213110565%29.jpg",
    cd, flags=re.DOTALL
)

# Fremont Cottonwood
cd = cd.replace("name: 'Zion Canyon & Virgin River Autumn Gold'", "name: 'Fremont Cottonwood'")

with open('src/data/colorado-data.ts', 'w', encoding='utf-8') as f:
    f.write(cd)

print("Updated colorado-data.ts!")

# Now update additional-species.ts
with open('src/data/additional-species.ts', 'r', encoding='utf-8') as f:
    add = f.read()

# Puma portrait
add = re.sub(
    r"(id:\s*'mountain-lion',.*?imageUrl:\s*')[^']+",
    r"\g<1>https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Puma-Portrait.jpg/960px-Puma-Portrait.jpg",
    add, flags=re.DOTALL
)

# Bobcat portrait
add = re.sub(
    r"(id:\s*'bobcat',.*?imageUrl:\s*')[^']+",
    r"\g<1>https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Bobcat_%28Lynx_rufus%29_portrait.jpg/960px-Bobcat_%28Lynx_rufus%29_portrait.jpg",
    add, flags=re.DOTALL
)

# Golden Eagle Wyoming
add = re.sub(
    r"(id:\s*'golden-eagle',.*?imageUrl:\s*')[^']+",
    r"\g<1>https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Golden_eagle_in_Wyoming_%2849391977231%29.jpg/960px-Golden_eagle_in_Wyoming_%2849391977231%29.jpg",
    add, flags=re.DOTALL
)

# Great Gray Owl gliding
add = re.sub(
    r"(id:\s*'great-gray-owl',.*?imageUrl:\s*')[^']+",
    r"\g<1>https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Great_Gray_Owl_Gliding_%2850567781496%29.jpg/960px-Great_Gray_Owl_Gliding_%2850567781496%29.jpg",
    add, flags=re.DOTALL
)

# Poppy & Beargrass names
add = add.replace("name: 'Desert Spring Wildflower Superbloom'", "name: 'California & Desert Gold Poppy'")
add = add.replace("name: 'Beargrass Superbloom'", "name: 'Subalpine Beargrass'")

with open('src/data/additional-species.ts', 'w', encoding='utf-8') as f:
    f.write(add)

print("Updated additional-species.ts!")
