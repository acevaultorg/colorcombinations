import type { Palette } from "@/types/palette";
import { wadaPalettes } from "./wada-palettes";

/**
 * The archive has two collections that share the same schema:
 *
 *   1. `curatedPalettes` — 30 editorial deep-dives, hand-written, each tied
 *      to a traditional Japanese shikisai name with full historical context,
 *      usage notes, and era tag. These are the "museum plates" featured on
 *      the homepage.
 *
 *   2. `wadaPalettes` — ALL 348 combinations from Sanzo Wada's 1933
 *      "A Dictionary of Color Combinations" (six-volume work), imported from
 *      the community-reconstructed mattdesl/dictionary-of-colour-combinations
 *      dataset and regenerated via `npm run generate:wada`. This is the
 *      complete historical catalog — what the site's name promises.
 *
 * Total: 378 palettes. The homepage, browse, and export surfaces show both.
 * `featured` is still reserved for the 8 editorial picks from the curated set.
 *
 * See DECISIONS.md 2026-04-08 (original "inspired-by" positioning) and
 * DECISIONS.md 2026-04-10 (full Wada catalog import decision).
 */
export const curatedPalettes: Palette[] = [
  {
    slug: "kurenai-kon",
    title: "Crimson & Navy",
    titleJa: "紅と紺",
    summary:
      "Deep safflower crimson against navy — the courtly contrast of Heian-era robes and formal Edo textiles.",
    description:
      "A study in warmth against depth. Kurenai, the crimson drawn from safflower petals, was a luxury dye reserved for the robes of high-ranking courtiers. Set against kon — the darkest grade of indigo — the pair became a signature of formal attire from the Heian court through to Edo merchant households.",
    era: "heian",
    moods: ["refined", "solemn", "bold"],
    dominantHue: "red",
    colors: [
      { hex: "#9A2A2A", nameJa: "紅", nameRomaji: "Kurenai", meaning: "Safflower crimson" },
      { hex: "#1B2A4E", nameJa: "紺", nameRomaji: "Kon", meaning: "Deep indigo navy" },
      { hex: "#F4EEE0", nameJa: "胡粉", nameRomaji: "Gofun", meaning: "Chalk white" },
    ],
    featured: true,
    order: 1,
    usage: [
      "Editorial headers where gravitas is needed",
      "Branding that balances warmth with authority",
      "Print posters — the contrast holds up at any size",
    ],
    tags: ["heritage", "classic", "editorial", "formal"],
  },
  {
    slug: "sakura-wakatake",
    title: "Cherry Blossom & Young Bamboo",
    titleJa: "桜と若竹",
    summary:
      "The softest pink of cherry blossoms set beside young bamboo green — spring, captured.",
    description:
      "Sakura-iro and wakatake-iro are two of the most quoted colors in Japanese seasonal poetry. Together they mark the exact moment of spring: blossoms falling, bamboo shoots rising. The contrast is quiet, balanced, never shouting.",
    era: "heian",
    moods: ["serene", "refined", "playful"],
    dominantHue: "pink",
    colors: [
      { hex: "#F9D5E0", nameJa: "桜", nameRomaji: "Sakura", meaning: "Cherry blossom pink" },
      { hex: "#A3C293", nameJa: "若竹", nameRomaji: "Wakatake", meaning: "Young bamboo green" },
      { hex: "#F8F4E9", nameJa: "生成", nameRomaji: "Kinari", meaning: "Unbleached natural" },
      { hex: "#4C5D3F", nameJa: "松葉", nameRomaji: "Matsuba", meaning: "Pine needle dark" },
    ],
    featured: true,
    order: 2,
    usage: [
      "Spring campaigns, seasonal retail",
      "Wellness and beauty brands that want calm without beige",
      "Wedding stationery rooted in nature",
    ],
    tags: ["seasonal", "spring", "gentle", "nature"],
  },
  {
    slug: "asagi-shu",
    title: "Pale Blue & Vermillion",
    titleJa: "浅葱と朱",
    summary:
      "The faded blue of Shinsengumi jackets against shrine-gate vermillion — restrained power.",
    description:
      "Asagi, a pale teal-blue, was the color of the Shinsengumi's haori in late-Edo Kyoto. Shu, vermillion, is the color of torii gates and temple pillars. Together they carry the tension of duty and devotion.",
    era: "edo",
    moods: ["bold", "solemn", "refined"],
    dominantHue: "blue",
    colors: [
      { hex: "#6B9BB0", nameJa: "浅葱", nameRomaji: "Asagi", meaning: "Pale blue-green" },
      { hex: "#D8453A", nameJa: "朱", nameRomaji: "Shu", meaning: "Shrine vermillion" },
      { hex: "#F4EEE0", nameJa: "胡粉", nameRomaji: "Gofun", meaning: "Chalk white" },
      { hex: "#2B2B2B", nameJa: "墨", nameRomaji: "Sumi", meaning: "Ink black" },
    ],
    featured: true,
    order: 3,
    usage: [
      "Posters with a signal vs. ground dynamic",
      "Games or films with a historical setting",
      "Masculine editorial work",
    ],
    tags: ["historical", "contrast", "edo", "bold"],
  },
  {
    slug: "kariyasu-rikyu",
    title: "Grass Yellow & Rikyū Grey",
    titleJa: "刈安と利休鼠",
    summary:
      "Wild grass yellow tempered by the muted grey favored by the tea master Sen no Rikyū.",
    description:
      "Kariyasu is a soft, earthy yellow extracted from wild mountain grass. Rikyū-nezumi — a cool olive-tinted grey — is named for the 16th-century tea master whose wabi-sabi sensibility changed Japanese aesthetics forever. This pairing embodies wabi restraint: warmth present but never loud.",
    era: "muromachi",
    moods: ["serene", "earthy", "austere", "refined"],
    dominantHue: "yellow",
    colors: [
      { hex: "#DCCB7A", nameJa: "刈安", nameRomaji: "Kariyasu", meaning: "Grass yellow" },
      { hex: "#878A74", nameJa: "利休鼠", nameRomaji: "Rikyū-nezumi", meaning: "Rikyū grey" },
      { hex: "#F3EBDA", nameJa: "練色", nameRomaji: "Neri-iro", meaning: "Silk white" },
    ],
    featured: true,
    order: 4,
    usage: [
      "Tea brands, ceramics, artisan food packaging",
      "Minimalist editorial with a warm undertone",
      "Interior design mood boards",
    ],
    tags: ["wabi", "tea", "earthy", "restrained"],
  },
  {
    slug: "gunjo-gofun",
    title: "Ultramarine & Chalk White",
    titleJa: "群青と胡粉",
    summary:
      "The deep ultramarine of Buddhist mineral pigment against temple chalk white.",
    description:
      "Gunjō is ground lapis lazuli — the blue of Buddhist statuary hair and illuminated sutras. Gofun, a chalk white made from ground oyster shell, is the traditional gesso of Japanese painting. Together they are the base and sky of classical temple art.",
    era: "kamakura",
    moods: ["solemn", "serene", "austere"],
    dominantHue: "blue",
    colors: [
      { hex: "#264A6B", nameJa: "群青", nameRomaji: "Gunjō", meaning: "Ultramarine blue" },
      { hex: "#F4EEE0", nameJa: "胡粉", nameRomaji: "Gofun", meaning: "Oyster-shell white" },
      { hex: "#C5AC6B", nameJa: "黄金", nameRomaji: "Kogane", meaning: "Gold leaf" },
    ],
    order: 5,
    usage: [
      "Fine art and museum branding",
      "Book covers for classic literature",
      "Luxury packaging that earns restraint",
    ],
    tags: ["sacred", "minimal", "classical"],
  },
  {
    slug: "kaki-kogecha",
    title: "Persimmon & Burnt Brown",
    titleJa: "柿と焦茶",
    summary: "Autumn persimmon against scorched cedar — harvest colors from the countryside.",
    description:
      "Kaki-iro is the flushed orange of ripe persimmons drying under eaves. Kogecha is the near-black brown of scorched cedar planks. Together they recall the mountain villages of late autumn.",
    era: "edo",
    moods: ["earthy", "warm", "austere"],
    dominantHue: "orange",
    colors: [
      { hex: "#D66B37", nameJa: "柿", nameRomaji: "Kaki", meaning: "Persimmon" },
      { hex: "#4B2E20", nameJa: "焦茶", nameRomaji: "Kogecha", meaning: "Burnt brown" },
      { hex: "#E8D8B7", nameJa: "砧", nameRomaji: "Kinuta", meaning: "Fulled silk" },
    ],
    featured: true,
    order: 6,
    usage: [
      "Food and beverage packaging with craft positioning",
      "Seasonal campaigns for autumn",
      "Rustic interior design",
    ],
    tags: ["autumn", "rustic", "harvest"],
  },
  {
    slug: "murasaki-gin",
    title: "Royal Purple & Silver",
    titleJa: "紫と銀",
    summary: "Imperial purple set against lunar silver — Heian courtly luxury at its quietest.",
    description:
      "Murasaki, the purple of The Tale of Genji, was the highest-ranked color in the Heian court — so precious that wearing it was regulated by imperial edict. Paired with gin (silver), the combination is lunar, nocturnal, aristocratic.",
    era: "heian",
    moods: ["refined", "solemn", "cool"],
    dominantHue: "purple",
    colors: [
      { hex: "#7A4E8F", nameJa: "紫", nameRomaji: "Murasaki", meaning: "Royal purple" },
      { hex: "#BCBCBE", nameJa: "銀", nameRomaji: "Gin", meaning: "Silver grey" },
      { hex: "#2B2B2B", nameJa: "墨", nameRomaji: "Sumi", meaning: "Ink black" },
      { hex: "#F4EEE0", nameJa: "胡粉", nameRomaji: "Gofun", meaning: "Chalk white" },
    ],
    order: 7,
    usage: [
      "Luxury brand expression without gold cliché",
      "Publishing for literary fiction",
      "Event branding with nocturnal tone",
    ],
    tags: ["luxury", "literary", "nocturnal"],
  },
  {
    slug: "moegi-sumi",
    title: "Spring Green & Ink",
    titleJa: "萌黄と墨",
    summary: "Young shoot green against sumi ink — the two extremes of the Japanese calligrapher's world.",
    description:
      "Moegi is the yellow-green of new shoots pushing through earth in early spring. Sumi is the black of stick ink ground on a slate inkstone. Together they frame the scroll of the monk-calligrapher: life against discipline.",
    era: "kamakura",
    moods: ["austere", "refined", "serene"],
    dominantHue: "green",
    colors: [
      { hex: "#A7C957", nameJa: "萌黄", nameRomaji: "Moegi", meaning: "Spring shoot green" },
      { hex: "#1C1C1C", nameJa: "墨", nameRomaji: "Sumi", meaning: "Ink black" },
      { hex: "#F8F4E9", nameJa: "生成", nameRomaji: "Kinari", meaning: "Natural paper" },
    ],
    order: 8,
    usage: [
      "Editorial design with high contrast",
      "Stationery and writing supplies",
      "Zen-inspired wellness brands",
    ],
    tags: ["zen", "calligraphic", "minimal"],
  },
  {
    slug: "daidai-kon",
    title: "Bitter Orange & Navy",
    titleJa: "橙と紺",
    summary: "The sharp orange of the daidai citrus set off by deep indigo navy.",
    description:
      "Daidai — the bitter orange used in New Year decoration — signals renewal and prosperity. Against kon, the deepest grade of indigo, it carries a merchant-class energy: confidence, generosity, success earned.",
    era: "edo",
    moods: ["bold", "warm", "playful"],
    dominantHue: "orange",
    colors: [
      { hex: "#F28C28", nameJa: "橙", nameRomaji: "Daidai", meaning: "Bitter orange" },
      { hex: "#1B2A4E", nameJa: "紺", nameRomaji: "Kon", meaning: "Deep indigo navy" },
      { hex: "#F4EEE0", nameJa: "胡粉", nameRomaji: "Gofun", meaning: "Chalk white" },
    ],
    featured: true,
    order: 9,
    usage: [
      "Sports branding with warmth",
      "Confident startup identities",
      "Food brands with bold flavor",
    ],
    tags: ["merchant", "confident", "prosperous"],
  },
  {
    slug: "seiji-kinari",
    title: "Celadon & Unbleached",
    titleJa: "青磁と生成",
    summary: "Celadon pottery green beside the unbleached warmth of raw silk.",
    description:
      "Seiji is the blue-green glaze of Longquan and Arita celadons — a color prized across East Asia for a thousand years. Kinari is the natural color of undyed hemp and silk. Together they compose the simplest, quietest tea-ceremony still life.",
    era: "muromachi",
    moods: ["serene", "earthy", "refined"],
    dominantHue: "green",
    colors: [
      { hex: "#8DB6A5", nameJa: "青磁", nameRomaji: "Seiji", meaning: "Celadon green" },
      { hex: "#F3EBDA", nameJa: "生成", nameRomaji: "Kinari", meaning: "Unbleached" },
      { hex: "#6E7B6A", nameJa: "松葉", nameRomaji: "Matsuba", meaning: "Pine green" },
    ],
    order: 10,
    usage: [
      "Ceramics and craft e-commerce",
      "Spa and wellness branding",
      "Quiet editorial layouts",
    ],
    tags: ["ceramic", "tea", "calm"],
  },
  {
    slug: "akane-tokiwa",
    title: "Madder Red & Evergreen",
    titleJa: "茜と常磐",
    summary: "The rooted red of madder-dyed cotton set against enduring pine green.",
    description:
      "Akane is a red extracted from the madder root — an ancient, slow-growing dye. Tokiwa is the deep, constant green of pine needles that never brown. The pairing speaks of longevity, faithful duty, and the old agricultural calendar.",
    era: "edo",
    moods: ["earthy", "bold", "solemn"],
    dominantHue: "red",
    colors: [
      { hex: "#B23B3B", nameJa: "茜", nameRomaji: "Akane", meaning: "Madder red" },
      { hex: "#344E3D", nameJa: "常磐", nameRomaji: "Tokiwa", meaning: "Evergreen" },
      { hex: "#EAE1CC", nameJa: "砂色", nameRomaji: "Suna-iro", meaning: "Sand" },
      { hex: "#2B2B2B", nameJa: "墨", nameRomaji: "Sumi", meaning: "Ink black" },
    ],
    order: 11,
    usage: [
      "Heritage food and craft branding",
      "Folk-art publications",
      "Agricultural cooperatives",
    ],
    tags: ["heritage", "agricultural", "enduring"],
  },
  {
    slug: "ruri-gofun",
    title: "Lapis & Chalk",
    titleJa: "瑠璃と胡粉",
    summary: "Lapis lazuli blue against oyster-shell white — the color of Buddhist scripture.",
    description:
      "Ruri is lapis lazuli, considered one of the seven treasures of Buddhism. It is the blue of sutra frontispieces and deity robes. Against gofun, the matte white of temple painting, it reads as devotional, timeless, and unmistakably sacred.",
    era: "heian",
    moods: ["solemn", "serene", "refined"],
    dominantHue: "blue",
    colors: [
      { hex: "#1E4B8A", nameJa: "瑠璃", nameRomaji: "Ruri", meaning: "Lapis lazuli" },
      { hex: "#F4EEE0", nameJa: "胡粉", nameRomaji: "Gofun", meaning: "Oyster-shell white" },
      { hex: "#D4AF37", nameJa: "黄金", nameRomaji: "Kogane", meaning: "Gold" },
    ],
    order: 12,
    usage: [
      "Sacred music, liturgical publishing",
      "Luxury stationery",
      "Museum catalogues",
    ],
    tags: ["sacred", "timeless", "gilded"],
  },
  {
    slug: "nadeshiko-mizu",
    title: "Pink Dianthus & Water",
    titleJa: "撫子と水色",
    summary: "The soft pink of wild dianthus beside the translucent blue of mountain water.",
    description:
      "Nadeshiko — the fringed pink flower — was the standard metaphor for Japanese feminine ideals in classical poetry. Mizu-iro, water color, is the blue of a cold spring seen through ferns. The pair is lyrical, seasonal, and tender.",
    era: "heian",
    moods: ["serene", "playful", "refined"],
    dominantHue: "pink",
    colors: [
      { hex: "#EBA6B4", nameJa: "撫子", nameRomaji: "Nadeshiko", meaning: "Dianthus pink" },
      { hex: "#B4D6E5", nameJa: "水色", nameRomaji: "Mizu-iro", meaning: "Water blue" },
      { hex: "#F8F4E9", nameJa: "生成", nameRomaji: "Kinari", meaning: "Natural white" },
    ],
    order: 13,
    usage: [
      "Cosmetics and skincare",
      "Children's book covers",
      "Soft editorial with a cool twist",
    ],
    tags: ["gentle", "lyrical", "floral"],
  },
  {
    slug: "matcha-kinari",
    title: "Matcha & Raw Silk",
    titleJa: "抹茶と生成",
    summary: "Whisked matcha green against the color of raw silk — the still life of a tea bowl.",
    description:
      "Matcha-iro is the slightly yellow-tinted bright green of freshly whisked powdered tea. Kinari is the pale cream of undyed silk or paper. Together they ARE the tea ceremony, distilled to two colors.",
    era: "muromachi",
    moods: ["serene", "earthy", "austere"],
    dominantHue: "green",
    colors: [
      { hex: "#A7B86B", nameJa: "抹茶", nameRomaji: "Matcha", meaning: "Matcha green" },
      { hex: "#F3EBDA", nameJa: "生成", nameRomaji: "Kinari", meaning: "Unbleached" },
      { hex: "#6C5A3C", nameJa: "茶", nameRomaji: "Cha", meaning: "Tea brown" },
    ],
    order: 14,
    usage: [
      "Tea brands, matcha cafés",
      "Japanese-inspired restaurants",
      "Wellness and meditation",
    ],
    tags: ["tea", "wabi", "quiet"],
  },
  {
    slug: "entan-sumi",
    title: "Red Lead & Ink",
    titleJa: "鉛丹と墨",
    summary: "The dense orange-red of lead oxide pigment struck against ink black.",
    description:
      "Entan — red lead — was the pigment of temple pillars and warning marks. Paired with sumi ink, it is the color of shrine gates at night: ceremonial, sharp, a little dangerous.",
    era: "kamakura",
    moods: ["bold", "solemn"],
    dominantHue: "red",
    colors: [
      { hex: "#C8411D", nameJa: "鉛丹", nameRomaji: "Entan", meaning: "Red lead orange" },
      { hex: "#1C1C1C", nameJa: "墨", nameRomaji: "Sumi", meaning: "Ink black" },
      { hex: "#D4AF37", nameJa: "黄金", nameRomaji: "Kogane", meaning: "Gold" },
    ],
    order: 15,
    usage: [
      "Film posters with historical themes",
      "Editorial for drama and stage",
      "Branding that needs danger without looking cheap",
    ],
    tags: ["shrine", "sharp", "dramatic"],
  },
  {
    slug: "yamabuki-kuri",
    title: "Kerria Gold & Chestnut",
    titleJa: "山吹と栗",
    summary: "The bright gold of the kerria flower against the warm brown of roasted chestnut.",
    description:
      "Yamabuki is the saturated, almost metallic gold of the kerria rose in full bloom. Kuri-iro is the rich brown of roasted chestnuts — a favorite of Edo merchants. Together they are autumn abundance.",
    era: "edo",
    moods: ["warm", "earthy", "playful"],
    dominantHue: "yellow",
    colors: [
      { hex: "#F5B71C", nameJa: "山吹", nameRomaji: "Yamabuki", meaning: "Kerria gold" },
      { hex: "#6B3E26", nameJa: "栗", nameRomaji: "Kuri", meaning: "Chestnut brown" },
      { hex: "#F8F4E9", nameJa: "生成", nameRomaji: "Kinari", meaning: "Natural white" },
    ],
    order: 16,
    usage: [
      "Autumn and harvest campaigns",
      "Bakery and confectionery branding",
      "Warm, approachable editorial",
    ],
    tags: ["autumn", "warm", "approachable"],
  },
  {
    slug: "fuji-ai",
    title: "Wisteria & Indigo",
    titleJa: "藤と藍",
    summary: "The soft lavender of wisteria blossoms against deep indigo.",
    description:
      "Fuji-iro — wisteria purple — is a light, cool lavender drawn from the pendulous flowers of the fuji vine. Ai, true indigo, grounds it with depth. The pair is a signature of early summer gardens.",
    era: "heian",
    moods: ["serene", "refined", "cool"],
    dominantHue: "purple",
    colors: [
      { hex: "#B5A6C9", nameJa: "藤", nameRomaji: "Fuji", meaning: "Wisteria purple" },
      { hex: "#1C3D5A", nameJa: "藍", nameRomaji: "Ai", meaning: "True indigo" },
      { hex: "#F4EEE0", nameJa: "胡粉", nameRomaji: "Gofun", meaning: "Chalk white" },
    ],
    featured: true,
    order: 17,
    usage: [
      "Floral and botanical branding",
      "Feminine editorial with restraint",
      "Stationery and wedding design",
    ],
    tags: ["floral", "gentle", "seasonal"],
  },
  {
    slug: "tobi-kogane",
    title: "Kite Brown & Gold",
    titleJa: "鳶と黄金",
    summary: "The warm brown of a kite's wing lit by afternoon gold.",
    description:
      "Tobi-iro — kite brown — is the color of the common Japanese black kite's feathers: warm, dusty, rural. Paired with kogane gold leaf, it is the brown of an old lacquer box with gilt edges, a signature of Edo craftsmanship.",
    era: "edo",
    moods: ["warm", "earthy", "refined"],
    dominantHue: "brown",
    colors: [
      { hex: "#8A5A3B", nameJa: "鳶", nameRomaji: "Tobi", meaning: "Kite brown" },
      { hex: "#D4AF37", nameJa: "黄金", nameRomaji: "Kogane", meaning: "Gold leaf" },
      { hex: "#2B2B2B", nameJa: "墨", nameRomaji: "Sumi", meaning: "Ink black" },
    ],
    order: 18,
    usage: [
      "Heritage craft, lacquerware, leather",
      "Premium spirits and whiskey",
      "Editorial for classic fiction",
    ],
    tags: ["craft", "premium", "heritage"],
  },
  {
    slug: "ao-shiro",
    title: "Ao & White",
    titleJa: "青と白",
    summary: "The classical Japanese 'ao' — an ambiguous blue-green — against pure white.",
    description:
      "In classical Japanese, ao covered a range from blue to green — what a modern eye would call teal. This palette pairs that ancestral ao with shiro, a bright white, for a look that reads as cleanly contemporary while staying rooted.",
    era: "heian",
    moods: ["serene", "cool", "refined"],
    dominantHue: "blue",
    colors: [
      { hex: "#3A7D7B", nameJa: "青", nameRomaji: "Ao", meaning: "Blue-green (classical)" },
      { hex: "#FFFFFF", nameJa: "白", nameRomaji: "Shiro", meaning: "White" },
      { hex: "#1C1C1C", nameJa: "墨", nameRomaji: "Sumi", meaning: "Ink black" },
    ],
    order: 19,
    usage: [
      "Modern minimal branding",
      "Editorial with generous whitespace",
      "Tech with a soft edge",
    ],
    tags: ["minimal", "modern", "clean"],
  },
  {
    slug: "kikyo-sumi",
    title: "Bellflower & Ink",
    titleJa: "桔梗と墨",
    summary: "The deep violet of the bellflower set against ink — formal, discreet.",
    description:
      "Kikyō-iro is the cool, deep purple of the Chinese bellflower — a traditional emblem of faith and honesty. With sumi ink, it becomes the color scheme of samurai formal wear in late Muromachi period.",
    era: "muromachi",
    moods: ["solemn", "refined", "cool"],
    dominantHue: "purple",
    colors: [
      { hex: "#5B4B8A", nameJa: "桔梗", nameRomaji: "Kikyō", meaning: "Bellflower purple" },
      { hex: "#1C1C1C", nameJa: "墨", nameRomaji: "Sumi", meaning: "Ink black" },
      { hex: "#BCBCBE", nameJa: "銀", nameRomaji: "Gin", meaning: "Silver" },
    ],
    order: 20,
    usage: [
      "Legal, consulting, professional services",
      "Editorial for serious long-form",
      "Product packaging for dark cosmetics",
    ],
    tags: ["formal", "professional", "discreet"],
  },
  {
    slug: "usubeni-cha",
    title: "Light Pink & Tea",
    titleJa: "薄紅と茶",
    summary: "A whisper of pink against tea brown — the tone of an Edo-period lacquer sweet box.",
    description:
      "Usubeni is a light, slightly washed-out crimson — the pink of cherry petals after two days on the branch. Cha-iro is the brown of roasted tea leaves. Together they are the color scheme of wagashi: delicate, warm, appetite-inviting.",
    era: "edo",
    moods: ["warm", "playful", "refined"],
    dominantHue: "pink",
    colors: [
      { hex: "#E8A4A4", nameJa: "薄紅", nameRomaji: "Usubeni", meaning: "Light red" },
      { hex: "#6C4F3B", nameJa: "茶", nameRomaji: "Cha", meaning: "Tea brown" },
      { hex: "#F3EBDA", nameJa: "生成", nameRomaji: "Kinari", meaning: "Natural white" },
    ],
    order: 21,
    usage: [
      "Confectionery and dessert packaging",
      "Feminine lifestyle brands",
      "Cafe and tea room identities",
    ],
    tags: ["wagashi", "appetizing", "warm"],
  },
  {
    slug: "kogecha-kinari",
    title: "Scorched Brown & Unbleached",
    titleJa: "焦茶と生成",
    summary: "The dark brown of scorched wood against unbleached hemp — quiet materials.",
    description:
      "Kogecha is the near-black brown of cedar scorched for weatherproofing (yakisugi). Kinari is the pale warm cream of undyed hemp. Together they compose the traditional Japanese farmhouse: dark timber posts, pale paper walls.",
    era: "muromachi",
    moods: ["earthy", "austere", "refined"],
    dominantHue: "brown",
    colors: [
      { hex: "#3E2A1E", nameJa: "焦茶", nameRomaji: "Kogecha", meaning: "Scorched brown" },
      { hex: "#F3EBDA", nameJa: "生成", nameRomaji: "Kinari", meaning: "Unbleached cream" },
      { hex: "#8A6A47", nameJa: "柿渋", nameRomaji: "Kakishibu", meaning: "Persimmon-tanned" },
    ],
    order: 22,
    usage: [
      "Architecture and interior design",
      "Natural materials brands",
      "Restaurants with rustic positioning",
    ],
    tags: ["architectural", "natural", "rustic"],
  },
  {
    slug: "sora-shu",
    title: "Sky Blue & Vermillion",
    titleJa: "空と朱",
    summary: "Clear sky blue against shrine-gate vermillion — a New Year morning.",
    description:
      "Sora-iro is the clear, bright blue of a winter sky over the Kanto plain. Shu is the sacred vermillion of torii gates at Shinto shrines. Together they compose the exact visual of a New Year's shrine visit — expectation, prayer, cold air.",
    era: "edo",
    moods: ["bold", "cool", "playful"],
    dominantHue: "blue",
    colors: [
      { hex: "#7AB2D3", nameJa: "空", nameRomaji: "Sora", meaning: "Sky blue" },
      { hex: "#D8453A", nameJa: "朱", nameRomaji: "Shu", meaning: "Shrine vermillion" },
      { hex: "#F4EEE0", nameJa: "胡粉", nameRomaji: "Gofun", meaning: "Chalk white" },
    ],
    order: 23,
    usage: [
      "Travel and tourism brands",
      "Festival and event branding",
      "Children and family products",
    ],
    tags: ["festival", "travel", "bright"],
  },
  {
    slug: "hanada-gin",
    title: "Indigo Blue & Silver",
    titleJa: "縹と銀",
    summary: "Mid-grade indigo with the quiet sheen of silver — an understated Edo merchant robe.",
    description:
      "Hanada is a mid-tone indigo — not as dark as kon, not as pale as asagi. Paired with gin silver, it has the quiet assurance of old money: confident enough to avoid flash.",
    era: "edo",
    moods: ["refined", "cool", "solemn"],
    dominantHue: "blue",
    colors: [
      { hex: "#3C6E8F", nameJa: "縹", nameRomaji: "Hanada", meaning: "Indigo blue" },
      { hex: "#BCBCBE", nameJa: "銀", nameRomaji: "Gin", meaning: "Silver" },
      { hex: "#F8F4E9", nameJa: "生成", nameRomaji: "Kinari", meaning: "Natural white" },
    ],
    order: 24,
    usage: [
      "Finance and professional services",
      "Premium menswear",
      "Publishing for nonfiction",
    ],
    tags: ["professional", "understated", "masculine"],
  },
  {
    slug: "kon-kinari",
    title: "Deep Indigo & Cream",
    titleJa: "紺と生成",
    summary: "The darkest indigo against unbleached cream — the color of a Meiji schoolboy's uniform.",
    description:
      "Kon is the deepest grade of indigo — used for samurai undergarments, farmers' field clothes, and eventually Meiji-era school uniforms. Against the cream of unbleached cotton, it reads as straightforward, honest, and quietly formal.",
    era: "meiji",
    moods: ["refined", "cool", "austere"],
    dominantHue: "blue",
    colors: [
      { hex: "#142747", nameJa: "紺", nameRomaji: "Kon", meaning: "Deep indigo" },
      { hex: "#F3EBDA", nameJa: "生成", nameRomaji: "Kinari", meaning: "Unbleached cream" },
      { hex: "#2B2B2B", nameJa: "墨", nameRomaji: "Sumi", meaning: "Ink black" },
    ],
    order: 25,
    usage: [
      "School and academic branding",
      "Editorial for serious journalism",
      "Minimalist fashion",
    ],
    tags: ["academic", "uniform", "honest"],
  },
  {
    slug: "shu-kuro-kin",
    title: "Vermillion, Black, Gold",
    titleJa: "朱・黒・金",
    summary: "The ceremonial triad of temple lacquerware — vermillion, lacquer black, gold leaf.",
    description:
      "This is the imperial and Buddhist ceremonial combination, found on lacquer boxes, shrine architecture, and festival floats. Shu for protection, kuro for ground, kin for transcendence. Use sparingly; it carries a lot of weight.",
    era: "kamakura",
    moods: ["bold", "solemn"],
    dominantHue: "red",
    colors: [
      { hex: "#C8352B", nameJa: "朱", nameRomaji: "Shu", meaning: "Vermillion" },
      { hex: "#141414", nameJa: "黒", nameRomaji: "Kuro", meaning: "Lacquer black" },
      { hex: "#D4AF37", nameJa: "金", nameRomaji: "Kin", meaning: "Gold" },
    ],
    order: 26,
    usage: [
      "Luxury spirits and packaging",
      "Ceremonial and award branding",
      "High-contrast editorial",
    ],
    tags: ["ceremonial", "luxury", "dramatic"],
  },
  {
    slug: "ominaeshi-asagi",
    title: "Valerian Yellow & Pale Blue",
    titleJa: "女郎花と浅葱",
    summary: "The yellow of autumn valerian against late-summer sky.",
    description:
      "Ominaeshi — one of the seven autumn plants — has tiny pale-yellow flowers that cluster in late summer fields. Paired with asagi, the pale blue-green of lingering summer sky, it reads as the exact turning of a season.",
    era: "heian",
    moods: ["serene", "cool", "playful"],
    dominantHue: "yellow",
    colors: [
      { hex: "#DCCB6E", nameJa: "女郎花", nameRomaji: "Ominaeshi", meaning: "Valerian yellow" },
      { hex: "#88B9C4", nameJa: "浅葱", nameRomaji: "Asagi", meaning: "Pale blue-green" },
      { hex: "#F8F4E9", nameJa: "生成", nameRomaji: "Kinari", meaning: "Natural" },
    ],
    order: 27,
    usage: [
      "Late-summer campaigns",
      "Botanical publishing",
      "Soft editorial with seasonal tone",
    ],
    tags: ["autumn", "seasonal", "soft"],
  },
  {
    slug: "enji-matsuba",
    title: "Crimson Lake & Pine",
    titleJa: "臙脂と松葉",
    summary: "The deep lake crimson of cochineal against pine needle green — winter evergreen.",
    description:
      "Enji is a deep, slightly cool crimson — a lake dye traditionally made from cochineal insects. Matsuba is the dark green of pine needles. Together they are the auspicious color scheme of New Year decorations: pine branches tied with red cord.",
    era: "edo",
    moods: ["bold", "solemn", "warm"],
    dominantHue: "red",
    colors: [
      { hex: "#9E2B3D", nameJa: "臙脂", nameRomaji: "Enji", meaning: "Crimson lake" },
      { hex: "#3B5133", nameJa: "松葉", nameRomaji: "Matsuba", meaning: "Pine needle" },
      { hex: "#F8F4E9", nameJa: "生成", nameRomaji: "Kinari", meaning: "Natural" },
      { hex: "#D4AF37", nameJa: "黄金", nameRomaji: "Kogane", meaning: "Gold" },
    ],
    order: 28,
    usage: [
      "Winter campaigns, holiday branding",
      "Wine and spirits",
      "Heritage editorial",
    ],
    tags: ["winter", "holiday", "auspicious"],
  },
  {
    slug: "edo-murasaki-nezumi",
    title: "Edo Purple & Mouse Grey",
    titleJa: "江戸紫と鼠",
    summary: "The cool Edo purple worn by kabuki actors against mouse grey — theatrical understatement.",
    description:
      "Edo-murasaki is a cooler, bluer version of royal purple — made with ash mordants rather than iron, and associated with the famous kabuki role Sukeroku. Nezumi, mouse grey, was the understated Edo 'iki' aesthetic — cool, unshowy, refined. This is the color scheme of old Tokyo cool.",
    era: "edo",
    moods: ["refined", "cool", "bold"],
    dominantHue: "purple",
    colors: [
      { hex: "#5E4A8C", nameJa: "江戸紫", nameRomaji: "Edo-murasaki", meaning: "Edo purple" },
      { hex: "#8A8A8A", nameJa: "鼠", nameRomaji: "Nezumi", meaning: "Mouse grey" },
      { hex: "#1C1C1C", nameJa: "墨", nameRomaji: "Sumi", meaning: "Ink black" },
      { hex: "#F8F4E9", nameJa: "生成", nameRomaji: "Kinari", meaning: "Natural" },
    ],
    featured: true,
    order: 29,
    usage: [
      "Urban editorial, magazines",
      "Streetwear with heritage references",
      "Product design for precision tools",
    ],
    tags: ["kabuki", "iki", "urban"],
  },
  {
    slug: "ukon-ai",
    title: "Turmeric & Indigo",
    titleJa: "鬱金と藍",
    summary: "Warm turmeric yellow against true indigo — the everyday textile of Japanese farm life.",
    description:
      "Ukon is the yellow extracted from turmeric root — used to dye baby clothes and protective wrappings. Ai is the workhorse blue of every farming village. Together they are the most common and most honest textile pair in Japanese rural history.",
    era: "edo",
    moods: ["earthy", "warm", "playful"],
    dominantHue: "yellow",
    colors: [
      { hex: "#E0B740", nameJa: "鬱金", nameRomaji: "Ukon", meaning: "Turmeric yellow" },
      { hex: "#1C3D5A", nameJa: "藍", nameRomaji: "Ai", meaning: "True indigo" },
      { hex: "#F3EBDA", nameJa: "生成", nameRomaji: "Kinari", meaning: "Unbleached" },
    ],
    order: 30,
    usage: [
      "Folk craft, textile e-commerce",
      "Food with rural positioning",
      "Approachable editorial",
    ],
    tags: ["folk", "textile", "warm"],
  },
];

// ---------- merged archive ----------

/**
 * The full public archive — 30 curated editorial picks followed by all 348
 * Wada historical plates. This is what every page on the site iterates.
 */
export const palettes: Palette[] = [...curatedPalettes, ...wadaPalettes];

// ---------- helpers ----------

export const featuredPalettes = (): Palette[] =>
  palettes.filter((p) => p.featured).sort(byOrder);

export const allPalettes = (): Palette[] => [...palettes].sort(byOrder);

/** Only the 30 editorial picks — used for "Editorial" sections. */
export const editorialPalettes = (): Palette[] => [...curatedPalettes].sort(byOrder);

/** Only the 348 historical Wada plates. */
export const wadaCatalog = (): Palette[] => [...wadaPalettes].sort(byOrder);

export const paletteBySlug = (slug: string): Palette | undefined =>
  palettes.find((p) => p.slug === slug);

export const palettesByEra = (era: Palette["era"]): Palette[] =>
  palettes.filter((p) => p.era === era).sort(byOrder);

export const palettesByHue = (hue: Palette["dominantHue"]): Palette[] =>
  palettes.filter((p) => p.dominantHue === hue).sort(byOrder);

export const palettesByMood = (mood: string): Palette[] =>
  palettes.filter((p) => p.moods.includes(mood as Palette["moods"][number])).sort(byOrder);

export const relatedPalettes = (current: Palette, limit = 3): Palette[] => {
  // Score other palettes by shared era + moods + dominantHue.
  const scored = palettes
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      let score = 0;
      if (p.era === current.era) score += 2;
      if (p.dominantHue === current.dominantHue) score += 2;
      score += p.moods.filter((m) => current.moods.includes(m)).length;
      return { palette: p, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.palette);
};

const byOrder = (a: Palette, b: Palette): number =>
  (a.order ?? 999) - (b.order ?? 999);
