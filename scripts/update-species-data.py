import re

# Enrichment dictionary for the 18 core subjects in colorado-data.ts
CORE_IDENTIFICATIONS = {
    'rocky-mountain-elk': {
        'imageUrl': 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Large pale buff-yellow rump patch surrounding a short tail',
            'Dark brown shaggy mane on neck and chest contrasted with tan body',
            'Sweeping backward antler beams with 5 to 6 ivory-tipped points'
        ],
        'distinguishingTips': 'Significantly larger than Mule Deer with a distinct pale buff rump; branching round antler beams distinguish bulls from flat palmate moose paddles.'
    },
    'north-american-bison-rut': {
        'imageUrl': 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'High shoulder hump and massive lowered triangular head',
            'Short upward-curving black horns on both bulls and cows',
            'Dense dark brown chin beard and shaggy pantaloons on front legs'
        ],
        'distinguishingTips': 'Unmistakable colossal silhouette; largest native land mammal in North America with dense woolly fleece.'
    },
    'coastal-brown-bear-salmon': {
        'imageUrl': 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Prominent muscular shoulder hump used for digging and heavy pawing',
            'Dished concave facial profile with small rounded ears',
            'Long ivory front claws (2 to 4 inches) visible when pawing salmon'
        ],
        'distinguishingTips': 'Distinguished from Black Bears by the prominent shoulder hump, dished facial profile, and much longer, less curved front digging claws.'
    },
    'gray-wolf-winter-pack': {
        'imageUrl': 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Broad muzzle with triangular face and rounded, shorter ears than a coyote',
            'Massive paws (4-5 inches wide) with deep chest and long legs',
            'Straight bushy tail carried horizontally or trailing, never curled'
        ],
        'distinguishingTips': 'More than twice the weight of a coyote; broader muzzle, rounded ears, and carries tail straight behind when moving.'
    },
    'denali-autumn-tundra-caribou': {
        'imageUrl': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Semi-palmate asymmetric antlers present on both bulls and cows',
            'Prominent forward-projecting brow tine shovel over the muzzle',
            'Bright white neck mane and broad, saucer-like hooves for snow travel'
        ],
        'distinguishingTips': 'Only deer species where both sexes grow antlers; white neck mane and forward brow shovel are diagnostic.'
    },
    'sonoran-desert-saguaro-bloom': {
        'imageUrl': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Creamy-white waxen petals (3 inches wide) with dense yellow stamens',
            'Clusters exclusively crowned around the apex of stems and upward arms',
            'Heavy melon-like fragrance opening after nightfall'
        ],
        'distinguishingTips': 'Blooms crown only the extreme upper tips of giant saguaro cactus arms, opening at night and closing by mid-afternoon.'
    },
    'synchronous-fireflies-smokies': {
        'imageUrl': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Synchronized yellow-green pulse bursts (5-8 flashes in unison)',
            'Abrupt 6-9 second total blackout intervals between pulses',
            'Small brown elongated beetle with reddish-orange head shield'
        ],
        'distinguishingTips': 'The only firefly species in North America that synchronizes flashing across thousands of individuals simultaneously.'
    },
    'southern-appalachian-fall-foliage': {
        'imageUrl': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Rich patchwork mosaic of scarlet red oak, golden sugar maple, and yellow birch',
            'Soft misty blue atmospheric mountain haze ("Blue Ridge")',
            'Deep green evergreen rhododendron understory below blazing canopy'
        ],
        'distinguishingTips': 'Unlike western single-species aspen belts, the Appalachians offer over 100 deciduous tree species displaying varied synchronized tones.'
    },
    'shiras-moose': {
        'imageUrl': 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Massive bulbous pendulous muzzle with a prominent throat dewlap bell',
            'Enormous flattened palmate antlers spanning up to 5 feet on mature bulls',
            'Very long stilt-like grayish-white lower legs with high humped shoulders'
        ],
        'distinguishingTips': 'Dark chocolate-brown to black coat, palmate flat antlers, and hanging throat bell distinguish it completely from elk.'
    },
    'rocky-mountain-bighorn-sheep': {
        'imageUrl': 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Massive brown spiraling curled horns on rams (full 360-degree curl in mature rams)',
            'Large white rump patch surrounding a short dark brown tail',
            'Grayish-brown coat that blends flawlessly into granite cliffs'
        ],
        'distinguishingTips': 'Curled brown horns distinguish rams from Mountain Goats, which have jet-black dagger horns and all-white shaggy coats.'
    },
    'quaking-aspen-foliage': {
        'imageUrl': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Flattened leaf petioles that flutter and quake in the slightest mountain breeze',
            'Smooth chalky-white or pale greenish bark with dark eye-shaped branch scars',
            'Canopy turns pure radiant cadmium yellow to fiery orange in autumn'
        ],
        'distinguishingTips': 'White trunk without peeling layers (unlike paper birch); leaves are rounded with small teeth and flattened stems.'
    },
    'alpine-wildflower-explosion': {
        'imageUrl': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Multi-colored dense carpet: scarlet Indian paintbrush, blue larkspur, yellow sneezeweed',
            'Dwarf growth habit to withstand high winds and heavy snow loads',
            'Intense ultraviolet-boosted pigmentation glowing under mountain skies'
        ],
        'distinguishingTips': 'Grows in dense dwarf cushion mats and scree corridors strictly above 10,000 ft elevation.'
    },
    'american-pika': {
        'imageUrl': 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Small egg-shaped body with no visible tail and rounded furry ears',
            'Carries mouthfuls of dried grasses and alpine flowers (haypiles)',
            'High-pitched sharp nasal "eeep!" vocalization echoing from talus'
        ],
        'distinguishingTips': 'Much smaller than a marmot; lacks any tail, has round mouse-like ears, and is related to rabbits, not rodents.'
    },
    'bald-eagle-winter-roost': {
        'imageUrl': 'https://images.unsplash.com/photo-1516331138075-f3adc1e149cd?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Pure snowy-white head and tail contrasting with dark chocolate-brown body',
            'Massive heavy hooked yellow bill and piercing yellow eyes',
            'Broad 6-to-7 foot wingspan held flat like a plank in soaring flight'
        ],
        'distinguishingTips': 'Adult white head and tail is unmistakable; immatures have mottled brown-and-white plumage and lack the golden nape of a Golden Eagle.'
    },
    'zion-autumn-cottonwoods': {
        'imageUrl': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Luminous golden-amber heart-shaped leaves glowing against 2,000-ft red canyon walls',
            'Deeply furrowed gray bark winding along riparian river channels',
            'Reflections rippling in the Virgin River with sandstone backdrop'
        ],
        'distinguishingTips': 'Riparian tree restricted to riverbeds and canyon washes; turns gold in late October to mid-November, well after high-country aspens.'
    },
    'sandhill-crane-migration': {
        'imageUrl': 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Tall slate-gray body with bustling red skin crown patch on forehead',
            'Flies with long neck extended straight and legs trailing directly behind',
            'Unmistakable rolling bugle/rattle call echoing across mountain valleys'
        ],
        'distinguishingTips': 'Flies with neck held straight out, unlike Herons which fold their necks into an "S" curve.'
    },
    'white-tailed-ptarmigan': {
        'imageUrl': 'https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Pure snowy white winter plumage blending invisibly into snowfields',
            'Mottled gray-brown and white in summer matching lichen-covered granite',
            'Feathered legs and toes that function as natural alpine snowshoes'
        ],
        'distinguishingTips': 'The only bird in North America that resides year-round on alpine tundra above treeline.'
    },
    'bristlecone-pine-astro': {
        'imageUrl': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Twisted, gnarled, wind-sculpted trunks with amber and burgundy polished deadwood',
            'Short stiff needles grouped in bundles of five resembling bottlebrushes',
            'Purple-brown female cones tipped with sharp prickles or bristles'
        ],
        'distinguishingTips': 'Found only at extreme windswept timberline ridges (11,000+ ft); distinct bottlebrush needle clusters.'
    }
}

file_path = 'src/data/colorado-data.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

for sub_id, data in CORE_IDENTIFICATIONS.items():
    marks_js = '[\n      ' + ',\n      '.join(f"'{m}'" for m in data['identificationMarks']) + '\n    ]'
    replacement = (
        f"id: '{sub_id}',\n"
        f"    imageUrl: '{data['imageUrl']}',\n"
        f"    identificationMarks: {marks_js},\n"
        f"    distinguishingTips: '{data['distinguishingTips']}',"
    )
    pattern = f"id: '{sub_id}',"
    content = content.replace(pattern, replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Updated {len(CORE_IDENTIFICATIONS)} core subjects in {file_path}")
