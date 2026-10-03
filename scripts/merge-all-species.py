import subprocess
import re

# Enrichment mappings for the 22 previous additional species
IMAGE_AND_MARKS_22 = {
    'mountain-lion': {
        'imageUrl': 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Long heavy cylindrical tail with a distinct black tip (one-third of body length)',
            'Uniform tawny to golden-buff coat with white chin and chest',
            'Small rounded ears without tufts and amber eyes'
        ],
        'distinguishingTips': 'Much larger and longer than bobcats; distinct long rope-like tail with black tip reaching nearly to the ground.'
    },
    'bobcat': {
        'imageUrl': 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Short bobbed tail (4-6 inches) with black bands and pure white underside on tip',
            'Tufted ears (less than 1 inch tufts) with prominent white spot on back of ears',
            'Spotted reddish-brown coat with flared facial ruffs'
        ],
        'distinguishingTips': 'Tail has white on the underside of the tip (Lynx tail tip is solid black all the way around); smaller paws and shorter ear tufts than lynx.'
    },
    'mule-deer': {
        'imageUrl': 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Very large mule-like ears (approx. three-fourths the length of the head)',
            'Bifurcated (forked) branching antlers forming pairs of "Y" shapes on bucks',
            'Small white tail with a distinct jet-black tip and cream rump patch'
        ],
        'distinguishingTips': 'Unlike White-tailed Deer which have small ears and antlers branching from a single main beam, Mule Deer have massive ears and dichotomously forked antler branches.'
    },
    'pronghorn-antelope': {
        'imageUrl': 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Distinctive black curved horns with a forward-pointing prong on bucks',
            'Vibrant reddish-tan coat with bright white belly, neck stripes, and large rump patch',
            'Erectile white rump hairs that flare out like a white beacon when alarmed'
        ],
        'distinguishingTips': 'Not a true antelope; unique pronged horn architecture and contrasting white throat collars are completely unique in North America.'
    },
    'red-fox-snow': {
        'imageUrl': 'https://images.unsplash.com/photo-1474511320723-9a56873ee67b?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Very bushy tail always tipped in distinct pure white',
            'Black "socks" on the lower legs and black backs on the ears',
            'Slender snout and vibrant rust-red or dark cross/silver fur phase'
        ],
        'distinguishingTips': 'The white-tipped tail is diagnostic in all color phases (red, cross, silver); Gray Fox has a black stripe down the top of the tail ending in a black tip.'
    },
    'yellow-bellied-marmot': {
        'imageUrl': 'https://images.unsplash.com/photo-1500463959177-e0869687df26?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Chubby, heavy-bodied rodent with grizzled brownish-gray coat and yellowish belly',
            'White band across the bridge of the nose between the eyes',
            'Densely furred, moderately bushy tail'
        ],
        'distinguishingTips': 'Larger than ground squirrels; distinct yellow chest/belly and white nose band distinguish it from the lowland woodchuck.'
    },
    'black-tailed-prairie-dog': {
        'imageUrl': 'https://images.unsplash.com/photo-1569420063901-b552b7dca688?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Stout, cylindrical body with short pinkish-buff fur',
            'Distinctive black tip covering the last third of the short tail',
            'Large dark eyes positioned high on the head for 360-degree aerial surveillance'
        ],
        'distinguishingTips': 'Black tail tip distinguishes it from White-tailed Prairie Dogs found in western Colorado mountain valleys.'
    },
    'sea-otter-coastal': {
        'imageUrl': 'https://images.unsplash.com/photo-1551986500-bf86ef2049d7?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Heavy rounded head with pale cream or silver-gray facial fur on mature adults',
            'Floats on back in marine kelp beds with hind flippers sticking up',
            'Flattened tail and dense, plush waterproof fur'
        ],
        'distinguishingTips': 'Twice the size of river otters; almost exclusively marine, floats on back in kelp rafts (river otters swim belly-down with head up).'
    },
    'greater-sage-grouse': {
        'imageUrl': 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Colossal chicken-sized grouse with long, spiked, fan-like pointed tail feathers',
            'Inflatable yellow esophageal air sacs surrounded by white breast ruff on displaying males',
            'Black belly patch contrasting with white underwings'
        ],
        'distinguishingTips': 'Largest grouse in North America; displaying males on dawn sage leks with inflated chest pouches cannot be confused with any other bird.'
    },
    'gunnison-sage-grouse': {
        'imageUrl': 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Elongated, hair-like black filoplumes extending from the back of the head like a ponytail',
            'Bold white barring across the tail feathers',
            'About one-third smaller in body mass than Greater Sage-Grouse'
        ],
        'distinguishingTips': 'Restricted exclusively to southwest Colorado (Gunnison Basin); distinctive ponytail filoplumes and bold tail barring distinguish it from Greater Sage-Grouse.'
    },
    'burrowing-owl': {
        'imageUrl': 'https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Long, bare-looking stilt legs and very short stubby tail',
            'Piercing lemon-yellow eyes, bold white eyebrows, and white throat collar',
            'Sandy-brown plumage with dense white spotting and barring'
        ],
        'distinguishingTips': 'The only small owl active on ground mounds in broad daylight in open grasslands and prairie dog colonies.'
    },
    'osprey-fishing': {
        'imageUrl': 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Pure white belly and chest with dark chocolate-brown back and wings',
            'Distinctive dark eye stripe extending from the beak through the eye to the neck',
            'Long, narrow wings held with a distinct "M" crook in flight'
        ],
        'distinguishingTips': 'Distinct "M"-shaped wing profile and dark eye mask on white head distinguish it from eagles and gulls.'
    },
    'great-blue-heron-rookery': {
        'imageUrl': 'https://images.unsplash.com/photo-1520808663317-647b476a81b9?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Massive size (4 feet tall) with slate-blue body and long slender legs',
            'White face with black plume extending from behind the eye into elegant crest',
            'Heavy dagger-like yellow bill and flight with neck folded into an "S" curve'
        ],
        'distinguishingTips': 'Flies with neck folded tightly in an "S" curve (cranes fly with neck stretched straight out).'
    },
    'broad-tailed-hummingbird': {
        'imageUrl': 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Iridescent rose-magenta throat gorget on males',
            'Bright metallic green back and white chest band',
            'Diagnostic mechanical cricket-like trilling wing whistle in flight'
        ],
        'distinguishingTips': 'Male produces a high-pitched trill from modified wing feathers; larger and greener than the fiery orange-rufous hummingbird.'
    },
    'american-dipper': {
        'imageUrl': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Uniform slate-gray chunky body with a short stubby cocked tail',
            'White flashing third eyelid (nictitating membrane) visible when blinking',
            'Relentless rhythmic dipping / bobbing motion on river boulders'
        ],
        'distinguishingTips': 'The only aquatic songbird in North America; constantly bobs up and down and dives directly into foaming mountain rapids.'
    },
    'mountain-bluebird': {
        'imageUrl': 'https://images.unsplash.com/photo-1550853024-fae8cd4be47f?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Unbroken sky-blue to electric cerulean plumage on males with no orange/red',
            'Females soft gray-brown with delicate blue wash on wings and tail',
            'Frequent hovering behavior over open meadows like a small kestrel'
        ],
        'distinguishingTips': 'Lacks the rusty-orange chest of Western and Eastern Bluebirds; male is entirely brilliant cerulean blue.'
    },
    'tufted-puffin-coastal': {
        'imageUrl': 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Sweeping long golden-yellow straw plumes curving back behind white face mask',
            'Massive, laterally compressed fluorescent orange-red bill with yellow plate',
            'All-black body contrasting with pure white facial mask and bright orange webbed feet'
        ],
        'distinguishingTips': 'Golden head plumes and all-black body distinguish it from the white-bellied Horned Puffin.'
    },
    'colorado-blue-columbine': {
        'imageUrl': 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Five sky-blue to lavender outer sepals surrounding a cup of five pure white petals',
            'Five long, slender straight nectar spurs projecting backward',
            'Lush blue-green divided foliage resembling maidenhair fern leaves'
        ],
        'distinguishingTips': 'Official Colorado state flower; unique combination of lavender-blue sepals, white cup, and long backward spurs.'
    },
    'beargrass-cascades': {
        'imageUrl': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Stout central stalk (3 to 5 feet tall) topped by dense dome of tiny creamy-white flowers',
            'Huge basal tussock of wiry, grass-like evergreen leaves with rough micro-toothed edges',
            'Blooms open sequentially from the bottom to the top, forming an elongated cone'
        ],
        'distinguishingTips': 'Distinct massive white pom-pom torches rising on tall stalks from tough wiry grass mounds in subalpine ridges.'
    },
    'desert-spring-superbloom': {
        'imageUrl': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
        'identificationMarks': [
            'Vibrant golden-yellow four-petaled Mexican gold poppies glowing in morning light',
            'Interspersed with purple desert lupines, yellow brittlebush, and pink owl’s clover',
            'Densely carpets entire gravel bajadas and rocky alluvial desert fans'
        ],
        'distinguishingTips': 'Episodic superbloom phenomenon occurring after abundant winter rain; poppies open around 9:00 AM once air reaches 60°F.'
    }
}

# 1. Get the 22 previous species from git
git_code = subprocess.check_output(['git', 'show', 'HEAD:src/data/additional-species.ts']).decode('utf-8')

# Read our latest new 13 species from current additional-species.ts
with open('src/data/additional-species.ts', 'r', encoding='utf-8') as f:
    latest_code = f.read()

# Enrich the 22 species in git_code
enriched_git_code = git_code
for sub_id, data in IMAGE_AND_MARKS_22.items():
    marks_js = '[\n      ' + ',\n      '.join(f"'{m}'" for m in data['identificationMarks']) + '\n    ]'
    replacement = (
        f"id: '{sub_id}',\n"
        f"    imageUrl: '{data['imageUrl']}',\n"
        f"    identificationMarks: {marks_js},\n"
        f"    distinguishingTips: '{data['distinguishingTips']}',"
    )
    pattern = f"id: '{sub_id}',"
    enriched_git_code = enriched_git_code.replace(pattern, replacement)

# Extract new subjects from latest_code that weren't in git_code
new_ids = [
    'rocky-mountain-goat', 'canada-lynx', 'river-otter', 'american-badger',
    'american-pine-marten', 'north-american-porcupine', 'great-gray-owl',
    'golden-eagle', 'peregrine-falcon', 'trumpeter-swan', 'common-loon',
    'calypso-orchid', 'avalanche-glacier-lily'
]

# Extract each new subject block from latest_code
new_blocks = []
for nid in new_ids:
    pattern = rf"(\s*\{{\s*id:\s*'{nid}'.*?iconName:.*?\n\s*\}},?)"
    m = re.search(pattern, latest_code, re.DOTALL)
    if m:
        new_blocks.append(m.group(1).rstrip(',\n'))

# Insert new blocks before the closing '];' of enriched_git_code
idx = enriched_git_code.rfind('];')
if idx != -1:
    combined_code = enriched_git_code[:idx] + ',\n  ' + ',\n  '.join(new_blocks) + '\n];\n'
else:
    combined_code = enriched_git_code

with open('src/data/additional-species.ts', 'w', encoding='utf-8') as f:
    f.write(combined_code)

print("Combined all species into additional-species.ts!")
