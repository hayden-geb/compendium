
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  writeBatch,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDv7iAlojLPMLBMQ1ZflNzk92n15H4Injs",
  authDomain: "issolas-9bbe1.firebaseapp.com",
  projectId: "issolas-9bbe1",
  storageBucket: "issolas-9bbe1.firebasestorage.app",
  messagingSenderId: "959555555353",
  appId: "1:959555555353:web:181c1eea7cc616dc029a88",
  measurementId: "G-9KFVYB46VK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================
// MAP REGIONS DATA
// ============================================
const mapRegions = [
  { 
    id: 'world-overview', 
    name: 'World Overview', 
    category: 'Issolas', 
    image: 'world_maps/world_map.png', 
    dmImage: 'world_maps/world_map_2.png', 
    roles: ['dm', 'adventurer'] 
  },
  { 
    id: 'sirens-song', 
    name: "Siren's Song", 
    category: 'Issolas', 
    image: 'sirens_song_maps/sirens_song_map.png', 
    dmImage: null,
    roles: ['dm', 'adventurer'] 
  },
  { 
    id: 'miligos', 
    name: 'Miligos', 
    category: 'Issolas', 
    image: 'miligos_maps/miligos.png', 
    dmImage: null,
    roles: ['dm'] 
  }
];

// ============================================
// LOCATIONS DATA
// ============================================
const locationsByMap = {
  'world-overview': [
    {
      id: 'world-sirens-song',
      name: "Siren's Song",
      x: 13,
      y: 20,
      type: 'location',
      roles: ['dm', 'adventurer'],
      fieldGuideRoles: ['dm'],
      description: "Siren's Song is a neutral territory island. It is home to two cities: Falkana and Artil, as well as Mount Beala - a geothermally active mountain with a permanent Winter at its summit.",
      knownNPCs: [
        { name: "Old Man Theodormus", title: null, race: null, class: null, importance: "medium" },
        { name: "Lazuli Brynn", title: null, race: null, class: null, importance: "medium" },
        { name: "Amethyst Brynn", title: null, race: null, class: null, importance: "low" },
        { name: "Yorlan Reinholt", title: null, race: null, class: null, importance: "low" },
        { name: "Vigos Ashbourne", title: null, race: null, class: null, importance: "low" },
        { name: "Cassian Dawnscry", title: null, race: null, class: null, importance: "high" },
        { name: "Lady Syva Marina", title: null, race: null, class: null, importance: "high" },
        { name: "Lord Antioch Diwalen", title: null, race: null, class: null, importance: "high" },
        { name: "Marigold Breeves", title: null, race: null, class: null, importance: "low" }
      ],
      history: "Siren's Song once harbored two ports at its East and South ends. The Eastern port was abandoned shortly after the Calamity due to dangerous inhabitants in the surrounding forests. The rapid rate of evolution on the island is experienced by all, but retains a mystifying origination. It is said that there are regions in the forests and mountains that experience growth at a higher acceleration than others.",
      population: { total: "~4000", races: "Humans, Elves, Dwarves, Halflings, Elementals", density: "Sparse, concentrated in coastal settlements" },
      climate: { type: "Common, Forest, Hills, Swamp, Grasslands, Mountain, Coastal, Underwater", temperature: "Variable but mostly warm", precipitation: "Large amount of annual rainfall", seasons: "Spring, Summer, Fall, Winter" },
      cityMap: null,
      cityMapNight: null,
      geoMap: null,
      cityLocations: []
    }
  ],
  'sirens-song': [
    {
      id: 'sirens-falkana',
      name: "Falkana",
      x: 86,
      y: 33,
      type: 'location',
      roles: ['dm', 'adventurer'],
      fieldGuideRoles: ['dm'],
      description: "A small fishing town formed along the coastline of Umestris Bay - an inlet of the Northern Sea. Falkana is the northernmost point of civilization on Siren's Song.",
      cityMap: 'sirens_song_maps/falkana.jpeg',
      cityMapNight: 'sirens_song_maps/falkana_night.png',
      geoMap: null,
      cityLocations: [
        { name: "Merchant Square", x: 50, y: 30 },
        { name: "Harbor", x: 40, y: 50 },
        { name: "Lighthouse", x: 56, y: 60 },
        { name: "Residential", x: 34, y: 78 },
        { name: "Vineyard", x: 84, y: 80 }
      ],
      knownNPCs: [
        { name: "Old Man Theodormus", title: "Cartographer (Human)", race: "Human", class: null, importance: "high" },
        { name: "Marigold Breeves", title: "Fishmonger (Human)", race: "Human", class: null, importance: "low" }
      ],
      history: "Falkana has long been a remote cultural isolate of not only Siren's Song, but Issolas as a whole. Though it has few inhabitants, many of the people who live there have known each other for generations. The town had thrived in peace for hundreds of years, but as of late, anomalous and violent events have begun to occur...",
      population: { total: "200", races: "Human, Elf", density: "Sparse" },
      climate: { type: "Coastal, Forest", temperature: "Mild year-round", precipitation: "Moderate rainfall", seasons: "Spring, Summer, Fall, Winter" }
    },
    {
      id: 'sirens-mount-beala',
      name: "Mount Beala",
      x: 20,
      y: 41,
      type: 'location',
      roles: ['dm', 'adventurer'],
      fieldGuideRoles: ['dm'],
      description: "An enormous igneous extrusion of rock with strange weather at the summit. Mount Beala is geothermally active but exhibits no geological evidence of eruption.",
      geoMap: "sirens_song_maps/mount_beala.png",
      cityMap: null,
      cityMapNight: null,
      cityLocations: [],
      knownNPCs: [],
      history: "Mount Beala dominates the southern reaches of Siren's Song as an ancient colossus, rising abruptly from the surrounding land. Geological study suggests that Beala did not form through conventional volcanism: there are no calderas, lava flows, ash layers, or vent structures. Instead, the mountain appears to be the result of a massive subterranean upwelling, in which molten rock rose slowly and solidified in place, lifting and deforming the crust without ever breaking it.",
      population: { total: "Unknown", races: "Elementals", density: "Unknown" },
      climate: { type: "Mountain", temperature: "Cold, snow-capped peak", precipitation: "Heavy snowfall at elevation", seasons: "Spring, Winter" }
    },
    {
      id: 'sirens-artil',
      name: "Artil",
      x: 27,
      y: 86,
      type: 'location',
      roles: ['dm', 'adventurer'],
      fieldGuideRoles: ['dm'],
      description: "A large port town with multiple districts centered around fishing trades. Artil is the southernmost point of civilization on Siren's Song and bears the only port on the island, located at the mouth of the Sirenic River delta.",
      cityMap: 'sirens_song_maps/artil.jpg',
      cityMapNight: 'sirens_song_maps/artil_night.jpg',
      geoMap: null,
      cityLocations: [
        { name: "Cathedral", x: 33, y: 56 },
        { name: "The Siren's Song", x: 49, y: 44 },
        { name: "Town Square", x: 49, y: 30 },
        { name: "Port District", x: 70, y: 57 },
        { name: "Academic District", x: 19, y: 55 },
        { name: "Residential District", x: 24, y: 29 },
        { name: "Shipyard", x: 50, y: 81 },
        { name: "Smithy", x: 35, y: 73 }
      ],
      knownNPCs: [
        { name: "Cassian Dawnscry", title: "Captain (Human)", race: "Human", class: null, importance: "high" },
        { name: "Lady Syva Marina", title: "High Priestess (Human, Cleric)", race: "Human", class: "Cleric", importance: "high" },
        { name: "Lord Antioch Diwalen", title: "Usurper High Priest (Human)", race: "Human", class: null, importance: "high" },
        { name: "Lazuli Brynn", title: "Innkeeper, Puzzler (Dwarf)", race: "Dwarf", class: null, importance: "medium" },
        { name: "Amethyst Brynn", title: "Innkeeper (Dwarf)", race: "Dwarf", class: null, importance: "low" },
        { name: "Yorlan Reinholt", title: "Fisherman (Elf)", race: "Elf", class: null, importance: "low" },
        { name: "Vigos Ashbourne", title: "Cook (Half-orc)", race: "Half-orc", class: null, importance: "low" }
      ],
      history: "Artil began as a seasonal fishing camp founded by coastal clans who followed the great silver shoals that gathered each year where the Sirenic River met the sea. Its natural harbor, formed by the river's branching delta, made it the safest landing on the southern coast of Siren's Song, and temporary huts soon gave way to wharves, smokehouses, and cobblestone docks.",
      population: { total: "2000", races: "Native: Humans, Elves, Dwarves, Halflings", density: "Dense port town" },
      climate: { type: "Coastal Temperate", temperature: "Mild with ocean breezes", precipitation: "Frequent light rain", seasons: "Spring, Summer, Fall, Winter" }
    }
  ],
  'miligos': [
    {
      id: 'miligos-port-milibra',
      name: "Port Milibra",
      x: 18,
      y: 50,
      type: 'location',
      roles: ['dm'],
      fieldGuideRoles: ['dm'],
      description: "Pending description.",
      cityMap: 'miligos_maps/port_milibra.jpg',
      cityMapNight: 'miligos_maps/port_milibra_night.jpg',
      geoMap: null,
      cityLocations: [],
      knownNPCs: [
        { name: "NPC Name", title: "Title/Role", race: null, class: null, importance: "high" },
        { name: "NPC Name", title: "Title/Role", race: null, class: null, importance: "medium" }
      ],
      history: "Pending historical information.",
      population: { total: "8000", races: "Native: Human, Half-orc, Half-elf, Dwarf, Gnome, Triton", density: "Extremely dense port city" },
      climate: { type: "Coastal", temperature: "Pending", precipitation: "Frequent rain", seasons: "Spring, Summer, Fall, Winter" }
    }
  ]
};

// ============================================
// DUNGEONS DATA
// ============================================
const dungeonsByMap = {
  'sirens-song': [
    {
      id: 'sirens-bunker',
      name: "The Bunker",
      x: 55,
      y: 35,
      type: 'dungeon',
      roles: ['dm', 'adventurer'],
      fieldGuideRoles: ['dm'],
      description: "A large, spherical structure buried in the Falkan forest, composed impossibly of organic tissue. Within the organism lay a misted corona of white phosphorescense outlining thick, fiberous vines. The vines lace together to form a latticework script: a kind of dark, incomprehensible sermon with its branching fragments sharing an affinity with that purpose. The script, written in abyssal, was not decipherable through the skill of your party.",
      geoMap: 'sirens_song_maps/dungeons/bunker.png',
      knownNPCs: [],
      history: "From Theodormus: 'I found the bunker in a place just before the forest became waterlogged and turned to salt marsh, surrounded by a fringe of scrub grass, half-hidden by fallen moss off to the left of the trail: an oblate spheroid of some grayish stone seeming a mix of hard sediment and ground-up seashells. It measured roughly 50 feet in diameter, this circular block, and was raised from ground level by about a foot. Its surface remained clean of etchings or writings that could in any way identify its origin or purpose.'",
      climate: { type: "Forest, Swamp", temperature: "Cool and damp", precipitation: null, seasons: null },
      population: null,
      cityMap: null,
      cityMapNight: null,
      cityLocations: []
    },
    {
      id: 'sirens-volcanic-cave',
      name: "Volcanic Cave",
      x: 27,
      y: 38,
      type: 'dungeon',
      roles: ['dm', 'adventurer'],
      fieldGuideRoles: ['dm'],
      description: "Presenting as a dark opening carved into the base of a volanic outcrop, its entrance is jagged and foreboding, framed by blackened rocks that glisten with moisture. The cave seems alive in its own way. The rocks around it bear scars of ancient eruptions - lava flow frozen mid-motion, veins of obsidian gleaming like shards of glass. From below comes a faint vibration, subtle but undeniable, as if the earth itself is breathing just below the surface. The cave is treacherous, inhospitable, and largely uncharted.",
      geoMap: 'sirens_song_maps/dungeons/volcanic_cave.png',
      knownNPCs: [],
      history: "Unknown.",
      climate: { type: "Mountain", temperature: "Extremely hot and dry", precipitation: null, seasons: null },
      population: null,
      cityMap: null,
      cityMapNight: null,
      cityLocations: []
    }
  ]
};

// ============================================
// LORE DATA
// ============================================
const loreData = [
  {
    id: 'lore-the-calamity',
    title: "The Calamity",
    summary: "The first blood ever spilled on Issolas - and the unmaking that followed.",
    narrative: `On a night the records describe only as moonless - though I wonder if the moon was truly absent or simply refusing to witness - she moved through corridors that seemed to cooperate with her silence. Her hands carried a sharpened bedpost.

Her sister slept beyond the chamber door.

Merida. The chosen. The image of Paladia's pride. I have found no physical descriptions of Merida, which strikes me as significant. She exists in the records only as a category: perfect, beloved, unblemished by doubt. Perhaps she was never a person at all. Perhaps she was a function. A role the city required someone to perform.

Eridana looked at her sleeping sister, and what she felt was not tenderness.

The records use the word revulsion, but I suspect this, too, is imprecise. What Eridana felt, I believe, was recognition - the unbearable recognition of something that had successfully become what she could not. The stake descended. Paradise began to leak.

The first blood ever spilled on Issolas.

Consider what that means. A world with no history of violence. A world where blood had never touched soil. The ecosystem was unprepared. The earth was unprepared. The very air was unprepared.

The blood did not remain blood for long.

It spread - not outward but through, permeating the ground, the atmosphere, the fundamental structure of what Issolas was. An unmaking. The kind of contamination that doesn't poison a system so much as rewrite its operating principles.

The Six noticed.

Their response came not as light, not as fire, but as a fissure - a shriek in the world's skin, a wound that opened from nowhere and led to nowhere. Paladia shattered. Its towers sublimated into ash that moved with deliberate patterns, forming shapes that almost resembled constellations before dispersing into randomness. Or what we call randomness, lacking the organs to perceive the order.

The continent split. The world cracked open like an egg containing something that had outgrown it.

In the ruin, the gods left a single fragment - the Aetherfall.`,
    category: 'history',
    roles: ['dm', 'adventurer']
  },
  {
    id: 'lore-the-aetherfall',
    title: "The Aetherfall",
    summary: "A pillar of black glass rising from the wound, bearing words that resist understanding.",
    narrative: `A pillar of black glass, later called the Aetherfall, rising from the wound. On its surface, carved in letters that seemed to shift when observed directly, four words:

Light forgets faith forgotten

I have spent considerable time with this phrase. Its grammar resists parsing. Light forgets: light as agent, light as something capable of memory and therefore capable of its loss. Faith forgotten: forgotten by whom? By the light? By those who held it? The sentence structure suggests that light's forgetting and faith's being forgotten are the same event, or perhaps the same substance differently expressed.

The Aetherfall glowed with what survivors described as "the residue of fury." An obsidian truth. A meaning that demanded interpretation while actively resisting it.

Centuries passed.

I use that phrase loosely. Time moved differently in the aftermath, according to the fragmentary records. Some regions experienced years in what others experienced as weeks. Some places stopped experiencing time altogether and had to be avoided, their inhabitants frozen in postures of flight or prayer.

But eventually, a pattern emerged. Two realms, growing like scar tissue around a wound.

To the West: those who still trembled before the Six. They built shrines of ash and bone. Their rituals were not celebrations but apologies, extended across generations, a hereditary prostration before silence. They called themselves the Faithful, though faith seems inadequate to describe what drove them. Fear, perhaps. Or habit. Or the suspicion that stopping would be worse.

To the East: the abandoned. They peeled away the divine mask - I find this phrase in multiple sources, always with the same unsettling precision - and looked elsewhere. To lesser gods. To voices hidden in marrow and stone. To powers that the Six had forbidden, or perhaps had never known existed. They sought vengeance not only against the absent gods but against the memory of reverence itself.

Between them lay a broken archipelago.

The fog around those islands is not natural fog. This becomes clear after even brief exposure. It moves against wind patterns. It responds to observation. Sailors who ventured into it reported that the mist seemed to contain shapes - vast structures barely visible, like cathedrals glimpsed through frosted glass - that rearranged themselves when attention shifted.

The islands themselves were jagged as teeth. The reefs between them moved. Not drifted: moved. Deliberate rearrangements that seemed designed to cause exactly the shipwrecks that occurred.

At the center of this aquatic maze stood the ruin of what had once been Paladia's Highcastle. And there, unchanged after centuries of exposure to salt and wind and that terrible, thinking fog: the Aetherfall.

Black. Implacable. Radiating a silence that seemed to grow heavier the longer one remained near it.

Many went to it. The records are clear on this.

None returned whole. Most did not return at all.

Rumor holds - and here I must acknowledge that rumor is the only source remaining for certain claims - that the carvings on the Aetherfall are not singular.

That beneath "Light forgets faith forgotten" sleeps another phrase, carved in an older tongue. Older than the Six. Older than Issolas. Perhaps older than the concept of inscription itself.

Some say this hidden language could repair the sundered world. Others say it could restore the favor of the gods. Still others - and these are the accounts that unsettle me most - suggest it could unmake the Six entirely. Not kill them. Unmake them. Retroactively erase the fact of their existence.

In taverns where hearths burn too low, travelers trade fragments of stories about those who vanished into the fog. Their last words, reportedly, muttered of shapes carved deeper into the stone. A second text. A buried grammar. A meaning beneath.`,
    category: 'history',
    roles: ['dm', 'adventurer']
  }
];

// ============================================
// PANTHEON DATA
// ============================================
const pantheonData = {
  theSix: [
    { name: "Paladine", title: "God of rulers and guardians", description: "Paladine the Platinum Dragon, is the draconic god of good dragons, the north wind and wisdom from the Draconic pantheon. Paladine is the embodiment of all that is good and great. He is the glorious and resplendent lord of good dragons who watches over and encourages his faithful, and serves as a bright and shining paragon of good in opposition to his bitter and twisted sister, Tiamat, the Chromatic Dragon.", domains: "Knowledge, Life", symbol: "Silver triangle", image: 'pantheon_icons/silver_triangle.png' },
    { name: "Milil", title: "God of poetry and song", description: "Milil is the god of poetry, eloquence, and song. He is a god of creativity and inspiration, of the entire song more than just the lyrics or the music. He represents the finished thought, the result of the process that takes an idea from conception to realization. He is the ideal to which all performers aspire: poised and confident, winningly charismatic, and a source of inspiration for those who listen to him.", domains: "Knowledge", symbol: "Crystal ball containing many kinds of eyes", image: 'pantheon_icons/orb_of_eyes.png' },
    { name: "Savras", title: "God of divination and fate", description: "Savras is the god of divination and fate, an aloof and inscrutable power who embodies the act of seeing beyond the present moment. To his faithful, Savras is not a god of answers freely given, but of truths revealed through discipline, sacrifice, and insight. He is revered by seers, oracles, astrologers, and those who seek to understand the hidden patterns that govern past, present, and future.", domains: "Light", symbol: "Five-stringed harp made of leaves", image: 'pantheon_icons/leaf_harp.png' },
    { name: "Lliira", title: "Goddess of joy", description: "Lliira is the goddess of joy, celebration, freedom, and unrestrained emotion. She embodies the simple and profound truth that life is meant to be lived to the fullest, with passion and disregard for needless restraint. Where sorrow long lingers or tyranny smothers, Lliira's influence rises through laughter, dance, music, and acts of spontaneous kindness. The faith of Lliira teaches that joy is not frivolous, but sacred. Her dogma urges followers to celebrate life in all its forms and to remind others that happiness is a virtue worth defending.", domains: "Life", symbol: "Triangle of three-pointed stars", image: 'pantheon_icons/star_triangle.png' },
    { name: "Eldath", title: "Goddess of peace", description: "Eldath is the goddess of peace, calm waters, and quiet places; she is gentle and contemplative, yet stands in opposition to violence. She represents serenity born of restraint and strength found in stillness. To her followers, peace is not weakness, but a deliberate and sacred choice. Eldath's priests and druids are healers. They inhabit hidden groves, springs, and pools where all may rest without fear, and where no weapon may be drawn in anger.", domains: "Life, Nature", symbol: "Waterfall plunging into still pool", image: 'pantheon_icons/waterfall.png' },
    { name: "Sune", title: "Goddess of love and beauty", description: "Sune is the goddess of love, beauty, passion, and desire in all their forms. She celebrates all permutations of beauty observes the pursuit of pleasure as a sacred expression of life itself. To Sune and her faithful, love is a transformative force that inspires the innate faculties of the spirit, and all that is born of true passion is worthy of reverence.", domains: "Life, Light", symbol: "Face of a beautiful, red-haired woman", image: 'pantheon_icons/redheaded_woman.png' }
  ],
  lesserGods: [
    { name: "Umberlee", title: "Goddess of the sea", description: "Umberlee is the cruel and capricious goddess of the sea. She is feared rather than loved, placated through offerings by sailor's hoping to earn the sea's favor. Umberlee teaches that the sea may not be tamed, and leverages its power as a force of dominance.", domains: "Tempest", symbol: "Wave curling left and right", image: 'pantheon_icons/twin_waves.png' },
    { name: "Silvanus", title: "God of nature", description: "Silvanus is the primordial god of wild nature. He is the embodiment of the forest, its beasts, and the very cycles of life itself. He stands a stalwart guardian of the natural order, indifferent and often hostile to those who seek to tip life's balanced scales", domains: "Nature", symbol: "Oak leaf", image: 'pantheon_icons/oak_leaf.png' },
    { name: "Talos", title: "God of storms", description: "Talos is the god of storms, embodying raw, senseless devastation. He believes destruction is the truest expression of power and his clergy oft revel in the chaos he brings. He is a horrible calamity.", domains: "Tempest", symbol: "Three lightning bolts radiating from a single point", image: 'pantheon_icons/lightning_triad.png' },
    { name: "Mask", title: "God of thieves", description: "Mask is the god of shadows, deception, and theft, patron to thieves and spies. Mask excites the cunning and imaginative, pulling at the most insidious sides of mortal nature. He believes law exists only as an obstacle to the cunning, a challenge to be exploited for gain and expression of artistry.", domains: "Trickery", symbol: "Black mask", image: 'pantheon_icons/black_mask.png' },
    { name: "Bhaal", title: "God of murder", description: "Bhaal is the god of murder; death given form. He revels in the act of killing - the planning, the execution. He upholds the doctrine that murder is the ultimate expression of control. To take a life is to elevate the self, and to please Bhaal.", domains: "Death", symbol: "Skull surrounded by a ring of blood droplets", image: 'pantheon_icons/blood_skull.png' },
    { name: "Azuth", title: "God of wizards", description: "Azuth, the High One, is the god of wizards, arcana, and the disciplines of magic. He represents mastery earned through study and rigorous practice. Through discipline he managed to usurp Savras and claim dominion over the magical arts. Those who follow his path are arbiters of magical conduct, possessing both mastery in ability and restraint.", domains: "Knowledge", symbol: "Left hand pointing upward, outlined in fire", image: 'pantheon_icons/flame_hand.png' },
    { name: "Tymora", title: "Goddess of good fortune", description: "Tymora is the rush you feel when flipping a coin. She is the surge of generosity you feel when everything is going your way. She is a fortune that favors the bold and optimistic. 'Chance', to her, is merely an opportunity to seize an otherwise fleeting moment.", domains: "Trickery", symbol: "Face-up coin", image: 'pantheon_icons/face_up_coin.png' },
    { name: "Kelemvor", title: "God of the dead", description: "Kelemvor is the solemn judge of the dead. He combs the seas of the damned, sternly parsing fear and corruption from his domain. Death is the natural continuation of a life deserving and to deny this continuity is to welcome a punishing damnation.", domains: "Death", symbol: "Upright skeletal arm holding balanced scales", image: 'pantheon_icons/scales.png' },
    { name: "Gond", title: "God of craft", description: "Gond is the god of craft, artisanship, and the arts of creation. He is the embodiment of the craftsman, the artisan. Above all is progress and process; stagnation is sin. He invites the curious mind to celebrate innovation, experimentation, and the relentless pursuit of improvement.", domains: "Knowledge", symbol: "Toothed cog with four spokes", image: 'pantheon_icons/cog.png' },
    { name: "Cyric", title: "God of lies", description: "Cyric delights in discord, madness, and strife. He is the suffering caused by broken trust and his influence spreads as quickly as a growing paranoia. His followers are dangerous and unpredictable, enforcing a dogma of chaos through falsehood.", domains: "Trickery", symbol: "White, jawless skull on black or purple sunburst", image: 'pantheon_icons/jawless_skull.png' },
    { name: "Malar", title: "God of the hunt", description: "Malar is an apex predator. He is simple, savage, and ever-hungry. Outside of the constraints of civilization, survival becomes a question of one's instinct and dominance. To seek to answer this most primitive question is to seek the guiding hand of Malar.", domains: "Nature", symbol: "Clawed paw", image: 'pantheon_icons/paw.png' },
    { name: "Shar", title: "Goddess of darkness and loss", description: "Shar is a goddess of deep complexity. She permeates the cavities of the mind, filling them with despair, loss, darkness, and the coaxing comforts of oblivion. She will offer solice through the erasure of what troubles you, lulling away your fears and memories.", domains: "Death, Trickery", symbol: "Black disk encircled with a border", image: 'pantheon_icons/black_disk.png' }
  ]
};

// ============================================
// FIELD GUIDE DATA (Flora & Fauna)
// ============================================
const fieldGuideData = [
  // Siren's Song Flora
  { locationId: 'world-sirens-song', type: 'flora', name: "Mandrake Root", description: "This tan root has serrated edges all along its body that often cause injury to Herbalists that do not properly know how to handle it. When stripped of its outer skin, the soft tender center can be eaten with relative ease and is often used by doctors to reduce pain from poison or disease.", rarity: "Common", habitat: "Most Terrain", image: "flora/mandrake_root.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Quicksilver Lichen", description: "This silver and grey silky moss can be found growing amongst almost any substance as it seems to ignore environmental standards. Assassins have been able to use this lichen to quickly administer their toxins into the target's system without any drawbacks. However, this takes some preparation and is often forgotten by common folk.", rarity: "Common", habitat: "Most Terrain", image: "flora/quicksilver_lichen.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Wild Sageroot", description: "The most common ingredient found among doctors and healer's equipment would be these light pink roots. They measure about 3 to 5 inches in length and have a smooth, fuzzy texture to them. They are used every day by skilled Alchemists and healers to create concoctions of extraordinary healing power.", rarity: "Common", habitat: "Most Terrain", image: "flora/wild_sageroot.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Bloodgrass", description: "The most boring, common plant life found in the wild is this dark brown grass. It has absolutely no remarkable qualities, other than being relatively harmless, and its use as basic sustenance when properly prepared. Herbalists do not find this grass very unique, but still tend to collect it as it occupies almost no space in their packs.", rarity: "Common", habitat: "Most Terrain", image: "flora/bloodgrass.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Wyrmtongue Petals", description: "The assassins, and many Drows, favorite natural ingredient. These jagged red petals can be found growing on Wyrmtongue flowers in almost every terrain. It's almost as if the world itself is trying to test humanity by letting these flowers grow everywhere. These petals are used as a base for toxins that can offer extremely powerful damage. For this reason, Wyrmtongue is highly illegal, and in many cases punishes owners of this flower with death.", rarity: "Common", habitat: "Most Terrain", image: "flora/wyrmtongue_petals.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Milkweed Seeds", description: "These small, white translucent seeds can be found when opening up a Milkweed Flower. They are often eaten by children due to their friendly look, but can cause negative digestive effects this way. When crushed up and diluted with other liquid these seeds offer very powerful healing effects.", rarity: "Common", habitat: "Most Terrain", image: "flora/milkweed_seeds.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Hydrathistle", description: "Named for its appearance, this three-pronged blue and black flower is often found in dark and dank environments. When used alone, the thistle has no real beneficial effects. However, skilled alchemists have been able to use highly powerful and natural water to concoct potions that allow them to breathe in water.", rarity: "Uncommon", habitat: "Coastal, Underwater, Swamp", image: "flora/hydrathistle.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Amanita Cap", description: "This large mushroom is often found growing in clusters near bodies of water, or around other damp terrain. It has a bold blue stem accompanied by a large red cap, which makes this fungi extremely easy to identify. Professional herbalists often cut the head from the root, as the mushroom has the rare ability to re-grow its cap within a few short weeks.", rarity: "Common", habitat: "Coastal", image: "flora/amanita_cap.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Hyancinth Nectar", description: "This blue and white thick liquid can be extracted from the Hyancinth's near somewhat wet areas. This nectar is of high demand and is often used by highly trained guards to counter poisons that evil people attempt to use on them. While it does not cure the mean of poisons, it severely limits its effects.", rarity: "Common", habitat: "Coastal, Grasslands", image: "flora/hyancinth_nectar.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Chromus Slime", description: "This thin slime substance is often observed to flow within water current as if it had a mind of its own. Often times, scientists mistake this slime with mercury, as it has the same consistency and look. When attempting to alter the slime, it reverberates and alters the other plant life it touches instead.", rarity: "Rare", habitat: "Coastal, Underdark", image: "flora/chromus_slime.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Lavender Sprig", description: "These long stemmed purple-petal flowers can often be found swaying in the wind in huge patches. They are very common amongst green environments and have a distinct sweet smell. However, they taste extremely bitter when eaten.", rarity: "Common", habitat: "Coastal, Grasslands, Hills", image: "flora/lavender_sprig.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Blue Toadshade", description: "Another common mushroom is this dark blue cap with a yellow striped stem. When disturbed, this mushroom lets off a puff of blue powder. Usually this causes no permanent harm to the surrounding creatures, but it can stain their skin and equipment for a short while. The powder is commonly used to color various inks and dyes. Herbalists usually search for the fungi around small watering holes, where aquatic life often thrives.", rarity: "Rare", habitat: "Coastal, Forest, Swamp", image: "flora/blue_toadshade.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Wrackwort Bulbs", description: "These huge white bulbs can be found on small yellow mushrooms often found in swamps or wet caverns. The mushroom releases a puff of powder from these bulbs when threatened and it tends to confuse and hinder a person. When harvested successfully, these bulbs can be ground into a paste and imbibed within magical water to diminish the size of a being.", rarity: "Rare", habitat: "Coastal, Swamp", image: "flora/wrackwort_bulbs.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Cosmos Glond", description: "This uncommon four-leafed plant is notorious for being somewhat difficult to find. This is mostly due to the plant growing about 5 feet underneath the ground, and only peeking out during its final maturity. However, it has an uncanny look of the stars in a night sky amongst its leaves.", rarity: "Rare", habitat: "Coastal, Desert", image: "flora/cosmos_glond.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Harrada Leaf", description: "This huge yellow leaf can often be found near tree tops in lush environments. It is often cultivated and harvested by gangs or the Thieves Guilds to be sold as a street drug. The potent nature of this addictive substance will cause a brief euphoric state coupled with an increase in a specific attribute; followed by a long recovery period in which the user is extremely weakened in that attribute.", rarity: "Common", habitat: "Forest, Grasslands, Hills", image: "flora/harrada_leaf.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Nightshade Berries", description: "These light blue berries can be found in small clumped packs among small bushes in lush environments. They can be safely ingested and are often eaten by wild animals for their sweet, but tangy flavor. A skilled Herbalist can enhance the berries natural ability to affect a persons body.", rarity: "Uncommon", habitat: "Forest, Hills", image: "flora/nightshade_berries.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Emetic Wax", description: "This thick, white wax is often found seeping out of trees near lush and wet areas. It is commonly used in candle making, as the wax melts and re-hardens rather quickly, yet is strong enough to form delicate shapes. Herbalists use it to control how their tonics enter the body, performing miraculous feats.", rarity: "Common", habitat: "Forest, Swamp", image: "flora/emetic_wax.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Verdant Nettle", description: "With its dark green and yellow speckled mesh, this plant can be easily spotted. It normally grows in forests and can catch a person's feet when traveling if they do not have proper footing. Alchemists like to use this plant to create tonics that enhance one's strength and reflexes.", rarity: "Uncommon", habitat: "Forest", image: "flora/verdant_nettle.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Arrow Root", description: "This unusually elongated plant can stand up to four feet tall, and is very easy to spot due to its distinctive white and brown speckled pattern. The Arrow Root thrives in desert and drought environments, as the plant needs very little water to survive. When diced and boiled in water the plant creates a frothy silver liquid, which is ideal for sharpening and polishing weapons and armor without the use of magic or other means.", rarity: "Uncommon", habitat: "Desert, Forest, Grasslands", image: "flora/arrow_root.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Ironwood Heart", description: "This gnarled white seed is commonly found in the nooks of Ironwood Trees. These large seeds pulse with a slow repetitive beat when gripped tightly, often referred to as \"Nature's Heartbeat\". It is said that when cooked or properly prepared by a Herbalist these seeds can increase a beings physical size greatly.", rarity: "Uncommon", habitat: "Arctic, Forest, Hills", image: "flora/ironwood_heart.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Wisp Stalks", description: "This incredibly rare fungi has become something of a fable amongst herbalists. It is reported to have a large bulbous cap growing atop a thin stem, and to normally form in small clusters deep within damp cave environments and forests. The organism is usually a translucent blue, and is rumored to render creatures invisible once consumed.", rarity: "Very Rare", habitat: "Forest, Underdark", image: "flora/wisp_stalks.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Drakus Flower", description: "This bright red and pale green flower can be found in both temperate and warm environments. It's a natural favorite amongst entertainers, due to the petal's ability to ignite with a moderate application of friction. This ignition does not cause harm, but instead creates theatrical sparks with the ability to light fires and create warmth.", rarity: "Common", habitat: "Desert, Grasslands, Mountain", image: "flora/drakus_flower.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Scillia Beans", description: "These light brown beans can occasionally be found hanging from Scillia Bushes in dry atmosphere environments. They are often used to enhance flavors in stew and other meals, but have a much stranger effect. At full potency, some of these beans can offer the user the ability to climb steep cliffs and rock faces with ease.", rarity: "Common", habitat: "Desert, Grasslands", image: "flora/scillia_beans.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Cactus Juice", description: "This usually clear liquid can be found within most cacti around the world. It's reasonably difficult to extract, as many cacti are dangerous to work with. Brewers love to use this juice in many recipes, as one of its effects is to delay alcohol intoxication, allowing people to purchase and consume more before it hits them.", rarity: "Common", habitat: "Desert, Grasslands", image: "flora/cactus_juice.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Tail Leaf", description: "This very fuzzy, dark green leaf looks like a circle with three thick strands hanging from it. When held, the leaf itself feels as though it is vibrating. It is known that a skilled Herbalist can use these leaves in concoctions to create powerful magical effects to enhance one's speed.", rarity: "Very Rare", habitat: "Grasslands, Hills", image: "flora/tail_leaf.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Devil's Bloodleaf", description: "Only a few recorded instances of this red and yellow flower exist. This large and bold red leaf can be going back in history to the dawn of humankind. It was once a popular decoration around homes and gardens, but has become one of the rarest plants in the world. It is said to give immense vitality and health to one who can properly prepare the plant.", rarity: "Very Rare", habitat: "Hills, Swamp, Underdark", image: "flora/devils_bloodleaf.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Gengko Brush", description: "This low, fan-leafed shrub with ash-green fronds veined in sickly yellow grows in rocky hillsides and the lightless caverns of the Underdark, where it clings to stone with wiry roots. Gengko Brush is prized by alchemists and scouts alike for the resin coating its leaves, which releases a bitter vapor when crushed that sharpens focus and briefly heightens awareness in darkness. The effect fades quickly, but overuse leaves a lingering numbness in the hands and a metallic taste on the tongue.", rarity: "Uncommon", habitat: "Hills, Underdark", image: "flora/gengko_brush.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Rock Vine", description: "This extremely hardened dark green vine can be found growing in the ground near very old minerals, often seeming to feed off the minerals themselves. At first glance this vine seems completely useless to mortals, but arcane studies have shown this vine to harden a person's skin significantly if combined with a powerful catalyst.", rarity: "Rare", habitat: "Hills, Mountain", image: "flora/rock_vine.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Basilisk's Breath", description: "Often referred to as Grey Restraints amongst the nobles of the world, this dark grey vine is only rarely found atop the highest peaks of mountainous regions. It is fabled that this vine is a gift from the gods, as a way to test humanity. Often sold for outrageous sums of gold, Basilisk's Breath can attract unwanted attention to those trying to sell it for profit.", rarity: "Very Rare", habitat: "Mountain", image: "flora/basilisks_breath.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Frozen Seedlings", description: "These small, pea sized pods can be found amongst resilient flowers in very cold environments. Named for their almost frozen appearance, they can be plucked with relative ease and are often used in cold alcoholic drinks. Some assassins have found ways to crush these into a paste and hamper one's movements.", rarity: "Rare", habitat: "Arctic, Mountain", image: "flora/frozen_seedlings.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Arctic Creeper", description: "This noxious weed usually grows in extremely cold environments, or at higher elevations where snow tends to accumulate. The leaves of the plant characterized by a pleasant sweet minty flavor, whereas the root is bitter and acidic. The weed is one of an assassin's favorite plants, due to the root's ability to freeze a creature's bloodstream, which leads to a slow and agonizing death. The Arctic Creeper is toxic to many unwary travelers, as it is quite easy to consume the root's toxins while enjoying the sweet flavorsome leaves.", rarity: "Common", habitat: "Arctic, Mountain", image: "flora/arctic_creeper.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Dried Ephedra", description: "A bush often found in dry environments, it is thorny and hard to harvest without scratching your skin. It has a distinct dark purple hue when viewed at a distance, but up close it looks black. Herbalists love to use this plant when making healing tonics as it has the odd ability to enhance Wild Sageroot.", rarity: "Uncommon", habitat: "Desert, Mountain", image: "flora/dried_ephedra.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Luminous Cap Dust", description: "This powder can be shook from the glowing yellow mushrooms often found in extremely dark environments and it keeps an ember-like glow for about a week after extracted. Many Herbalists keep the glowing mushrooms themselves in dark cellars in order to harvest this dust every chance they can.", rarity: "Rare", habitat: "Mountain, Underdark", image: "flora/luminous_cap_dust.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Primordial Balm", description: "This thick substance has been observed changing its coloring, almost at will. The balm is unusually warm to the touch, and can seem to retain heat for weeks on end. Herbalists often find this substance growing on rocks in humid environments. The exact rarity of the substance is unknown, as its constantly changing appearance makes it difficult to identify.", rarity: "Rare", habitat: "Mountain, Swamp, Underdark", image: "flora/primordial_balm.png" },
  { locationId: 'world-sirens-song', type: 'flora', name: "Spineflower Berries", description: "Harvested and crushed to enhance toxins made by scoundrels. However, this effect only applies when introduced directly to the bloodstream. When ingested normally these berries provide little sustenance, but do not harm the person.", rarity: "Uncommon", habitat: "Desert, Swamp", image: "flora/spineflower_berries.png" },
  
  // Siren's Song Fauna placeholder lol
  { locationId: 'world-sirens-song', type: 'fauna', name: "Your Mom", description: "Big ol' thang", rarity: "Common", habitat: "My crib", image: null }
];

// ============================================
// SITE CONFIG
// ============================================
const siteConfig = {
  siteName: "Issolas Compendium",
  defaultMapId: "sirens-song",
  maintenanceMode: false,
  allowedRoles: ["dm", "adventurer"]
};

// ============================================
// MIGRATION FUNCTIONS
// ============================================

async function migrateMaps() {
  console.log('\nMigrating Maps...');
  const batch = writeBatch(db);
  
  mapRegions.forEach((map, index) => {
    const docRef = doc(db, 'maps', map.id);
    batch.set(docRef, {
      ...map,
      order: index,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log(`${map.name}`);
  });
  
  await batch.commit();
  console.log(`Wahoo! Migrated ${mapRegions.length} maps`);
}

async function migrateLocations() {
  console.log('\nMigrating Locations...');
  let count = 0;
  
  for (const [mapId, locations] of Object.entries(locationsByMap)) {
    const batch = writeBatch(db);
    
    locations.forEach((location, index) => {
      const docRef = doc(db, 'locations', location.id);
      batch.set(docRef, {
        ...location,
        mapId,
        order: index,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`${location.name} (${mapId})`);
      count++;
    });
    
    await batch.commit();
  }
  
  console.log(`Migrated ${count} locations`);
}

async function migrateDungeons() {
  console.log('\nMigrating Dungeons...');
  let count = 0;
  
  for (const [mapId, dungeons] of Object.entries(dungeonsByMap)) {
    if (dungeons.length === 0) continue;
    
    const batch = writeBatch(db);
    
    dungeons.forEach((dungeon, index) => {
      const docRef = doc(db, 'locations', dungeon.id);
      batch.set(docRef, {
        ...dungeon,
        mapId,
        order: 100 + index, // Put dungeons after locations
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`  ✓ ${dungeon.name} (${mapId})`);
      count++;
    });
    
    await batch.commit();
  }
  
  console.log(`Wahoo! Migrated ${count} dungeons`);
}

async function migrateLore() {
  console.log('\nMigrating Lore...');
  const batch = writeBatch(db);
  
  loreData.forEach((lore, index) => {
    const docRef = doc(db, 'lore', lore.id);
    batch.set(docRef, {
      ...lore,
      order: index,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log(`  ✓ ${lore.title}`);
  });
  
  await batch.commit();
  console.log(`Wahoo! Migrated ${loreData.length} lore entries`);
}

async function migratePantheon() {
  console.log('\nMigrating Pantheon...');
  let count = 0;
  
  // The Six
  const batch1 = writeBatch(db);
  pantheonData.theSix.forEach((deity, index) => {
    const id = `deity-${deity.name.toLowerCase().replace(/\s+/g, '-')}`;
    const docRef = doc(db, 'pantheon', id);
    batch1.set(docRef, {
      ...deity,
      tier: 'theSix',
      roles: ['dm', 'adventurer'],
      order: index,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log(`${deity.name} (The Six)`);
    count++;
  });
  await batch1.commit();
  
  // Lesser Gods
  const batch2 = writeBatch(db);
  pantheonData.lesserGods.forEach((deity, index) => {
    const id = `deity-${deity.name.toLowerCase().replace(/\s+/g, '-')}`;
    const docRef = doc(db, 'pantheon', id);
    batch2.set(docRef, {
      ...deity,
      tier: 'lesserGods',
      roles: ['dm', 'adventurer'],
      order: 100 + index,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log(`${deity.name} (Lesser Gods)`);
    count++;
  });
  await batch2.commit();
  
  console.log(`Wahoo! Migrated ${count} deities`);
}

async function migrateFieldGuide() {
  console.log('\nMigrating Field Guide...');
  
  // Split into batches of 500 (Firestore limit)
  const batchSize = 400;
  let count = 0;
  
  for (let i = 0; i < fieldGuideData.length; i += batchSize) {
    const batch = writeBatch(db);
    const chunk = fieldGuideData.slice(i, i + batchSize);
    
    chunk.forEach((entry, index) => {
      const id = `${entry.type}-${entry.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
      const docRef = doc(db, 'fieldGuides', id);
      batch.set(docRef, {
        ...entry,
        roles: ['dm'], // by default
        order: i + index,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`${entry.name} (${entry.type})`);
      count++;
    });
    
    await batch.commit();
  }
  
  console.log(`Wahoo! Migrated ${count} field guide entries`);
}

async function migrateSiteConfig() {
  console.log('\nMigrating Site Config...');
  
  await setDoc(doc(db, 'siteConfig', 'settings'), {
    ...siteConfig,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  
  // Theme config 
  await setDoc(doc(db, 'siteConfig', 'theme'), {
    primaryColor: '#d4af37',
    secondaryColor: '#8b7355',
    backgroundColor: '#f5ecd7',
    textColor: '#2d1810',
    accentColor: '#4a2c1a',
    fontHeading: 'Cinzel',
    fontBody: 'Crimson Text',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  
  console.log('Wahoo! Site config migrated');
}

// ============================================
// MAIN MIGRATION RUNNER
// ============================================

async function runMigration() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   ISSOLAS COMPENDIUM - FIREBASE MIGRATION  ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('\nStarting migration to Firebase...\n');
  
  try {
    await migrateMaps();
    await migrateLocations();
    await migrateDungeons();
    await migrateLore();
    await migratePantheon();
    await migrateFieldGuide();
    await migrateSiteConfig();
    
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║           MIGRATION COMPLETE!             ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('\nData is now in Firebase Firestore.');
    
  } catch (error) {
    console.error('\nShucks! Migration failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

runMigration();