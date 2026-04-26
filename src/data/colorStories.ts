/**
 * colorStories.ts — editorial "color story" passages per named color.
 *
 * Each entry is 2-3 paragraphs of authoritative context: pigment origin,
 * historical use, register, modern application. Surfaced on /colors/[slug]
 * to depthen thin-content pages and improve LLM-citation fit (Aleyda #2
 * Useful · #4 Extractable · #7 Credible).
 *
 * Coverage: the 12 named colors that anchor the four /learn pillar
 * articles. Other colors fall through silently.
 */

export interface ColorStory {
  /** 1-3 paragraphs of editorial context. Plain HTML allowed. */
  paragraphs: string[];
  /** Working palette + how to use it. Optional. */
  workingNote?: string;
}

export const COLOR_STORIES: Record<string, ColorStory> = {
  // ---------- The Four Reds ----------

  kurenai: {
    paragraphs: [
      "Kurenai (紅) is the deep crimson dyed from safflower petals (紅花, <em>benibana</em>) — one of the most labour-intensive colours in the entire Japanese tradition. Producing a single bolt of kurenai-dyed silk required pressing safflower petals through cold water, alkaline water, and acid in sequence; the yield was tiny. During the Heian period the colour was so expensive that laws periodically forbade commoners from wearing it.",
      "The result is a crimson that sits a fraction cooler and more purple than the Western 'crimson lake' pigment, and slightly less brown than burgundy. It signals <em>ceremony, status, and the highest grade of formal attention</em> — the colour of a court robe, a wedding kimono, or a New Year envelope. Modern brand systems can use it for the same: heritage hospitality, luxury textiles, premium publishing.",
    ],
    workingNote: "Pairs canonically with navy or indigo (the Heian formal palette). Avoid black — kurenai loses its character against black and reads as generic dark red.",
  },

  akane: {
    paragraphs: [
      "Akane (茜) is the warmer, slightly orange-leaning red dyed from madder root (<em>Rubia akane</em>) — one of the oldest organic dyes used continuously in Japan. Archaeological evidence places its use back to the Yayoi period. Where kurenai is the crimson of the court, akane is the red of <em>everyday cloth and folk textiles</em>: kimonos for daughters, theatre costumes, traditional wedding accessories.",
      "It reads as warm, settled, and connected to specifically human craft tradition rather than to formal authority. Modern usage: warmth-driven brands, craft and food packaging, anywhere the brief asks for 'rich red but not corporate red.' Madder is also one of the few traditional dyes that has been continuously cultivated commercially, so the colour has an unbroken contemporary lineage.",
    ],
    workingNote: "Classic pairing is with evergreen — the 'red and green' of Japanese textile combinations, without the holiday connotations of the Western pairing.",
  },

  shu: {
    paragraphs: [
      "Shu (朱) is the bright orange-red of cinnabar pigment — mercury sulfide ground to powder and bound in lacquer. It's a mineral, not a dye, which gives it a luminous, almost glowing quality that no purely-red pigment can match. Shu is the colour of Shinto torii gates, temple pillars, ceremonial bowls, and the lacquerware traditions of Wajima and Kyoto.",
      "Culturally it carries a completely different register from the textile reds: shu signals the <em>sacred, the threshold, and the protective</em>. The red lacquer on a temple gate is not decoration — it is a colour with apotropaic function. In contemporary design it works for hospitality, religious or wellness brands, and any project that needs to feel 'doorway' or 'entrance.'",
    ],
    workingNote: "Three-colour palette: shu, ink-black (sumi), and gold leaf — the temple-architecture combination. Reads as ceremonial without reading as tourist.",
  },

  entan: {
    paragraphs: [
      "Entan (鉛丹) is the heavier, slightly muted red made from lead tetroxide. It served historically as a ground for shu lacquer — entan would be applied first, and the more expensive shu cinnabar painted on top — but is also visible on its own in unrestored medieval temple architecture, where the shu top-coat has weathered away to reveal the entan beneath.",
      "The colour reads <em>ancient, weathered, and structural</em>. Closer to brick than to crimson, it's the red you reach for when the brief wants gravitas without ceremony — historic identity systems, old-money editorial, museum and archive design, projects where wear is part of the story.",
    ],
    workingNote: "Best paired with deep sumi black — the Tang-dynasty ink-and-wash register, like a worn parchment surface with a single warm dominant.",
  },

  // ---------- Wabi-Sabi colours ----------

  tobi: {
    paragraphs: [
      "Tobi (鳶) takes its name from the Japanese black kite, the bird whose wing colour the dye-makers were trying to match. The result is a warm ink-brown — darker than chocolate, redder than sepia, with a particular rust undertone that reads as <em>weathered</em> rather than aged. It's a workhorse warm-axis colour: traditional craft objects, lacquerware bases, leather tones in Edo-period merchant clothing.",
      "Tobi anchors the warm side of a wabi-sabi palette without pulling toward saturation. It's the colour that lets a cream anchor and a celadon mid-tone read as 'tea ceremony' rather than 'Scandinavian.' Modern usage: heritage food brands, leather and craft goods, restaurant identity for places trading on age.",
    ],
  },

  kogecha: {
    paragraphs: [
      "Kogecha (焦茶) — literally 'burnt tea' — is the deep brown of over-brewed hojicha, of cedar weathered to near-black, of coffee grounds. It's a structural warm: the colour you place at the bottom of a composition to ground it, the trim colour around a wabi-sabi interior, the binding cloth on a hand-bound book.",
      "Where tobi reads as warm-ink brown with red undertones, kogecha pulls cooler and darker — closer to a true black-brown. Both belong to the wabi-sabi register but kogecha is the more architectural choice: it reads as gravitas where tobi reads as warmth.",
    ],
  },

  sumi: {
    paragraphs: [
      "Sumi (墨) is the ink-black of pine soot or lamp soot mixed with hide glue and pressed into ink-sticks. Ground on a wet stone, it produces the calligraphy ink that has anchored Japanese visual culture for over a thousand years. Sumi is not 'black' in the Western sense — it has warmth, depth, and a slight sheen that pure pigment black lacks.",
      "In wabi-sabi composition sumi is the punctuation mark: never the field colour, always the accent. A single sumi line against a cream paper, a sumi ideogram on a tea-room wall, the sumi mon (crest) on an unbleached silk kimono. Modern brand systems use it the same way — as the signature, not the background.",
    ],
  },

  gofun: {
    paragraphs: [
      "Gofun (胡粉) is the chalk-white pigment made from crushed and aged oyster shells. It's the white of Japanese-style folding screens, the priming layer beneath nihonga paintings, the bright base coat on Hina dolls. Unlike titanium white or zinc white in Western painting, gofun has tooth — a slight matte chalk quality that reads as material rather than as default 'white.'",
      "In a wabi-sabi or japandi palette gofun is the anchor: the warm-cool neutral that everything else rests on. It pulls slightly off pure white, toward the colour of bone or unbleached paper, which is exactly what differentiates a 'Japandi white' from an IKEA-modern white.",
    ],
  },

  // ---------- Japandi-aligned cool colours ----------

  seiji: {
    paragraphs: [
      "Seiji (青磁) is the celadon green of the Chinese-influenced Korean and Japanese ceramic traditions. The name refers literally to the iron-glaze celadon ware — fired with a thin coat of iron-bearing slip that vitrifies into a pale grey-green. Centuries of tea-ceremony and incense-ceremony objects have established the colour as inseparable from <em>quiet refinement</em>.",
      "Modern usage: skincare and wellness brands, hospitality identity, ceramics, anywhere the brief asks for 'green that doesn't read as nature.' Seiji is one of the colours that makes a Japandi palette feel Japanese rather than just Scandinavian-with-green — the cool axis of a properly executed Japandi system almost always passes through this hue.",
    ],
  },

  hanada: {
    paragraphs: [
      "Hanada (縹) is the half-indigo blue — a cooler, paler blue than the deep koniro of Edo-period workwear, but warmer than pure cyan. It sits between sky-blue and a deep blue-grey. Historically it was used in court robes, summer kimonos, and shop curtains, and is one of the named colours that appears most consistently in Wada's catalogue.",
      "The Japandi palette uses hanada as a quiet cool axis: it's the colour of a winter sky in a well-designed room. Where seiji pulls toward Japanese ceramics, hanada pulls toward Scandinavian textiles — and bridges the two traditions cleanly.",
    ],
  },

  kaki: {
    paragraphs: [
      "Kaki (柿) takes its name from the Japanese persimmon fruit — and refers specifically to the colour of a ripe persimmon, between burnt orange and warm terracotta. It's a saturated warm without the aggression of pure orange. Historically: Edo-period merchant signage, autumn kimonos, traditional pottery glazes.",
      "In a Japandi palette kaki is one of the few colours that serves as a 'controlled warm accent' — the punctuation mark against a cool field. A single kaki object in a celadon-and-cream room is the visual definition of the register. Used at low coverage; used at high coverage it pulls the palette out of Japandi into a warmer tradition.",
    ],
  },

  kinari: {
    paragraphs: [
      "Kinari (生成) — literally 'unbleached' or 'made-as-is' — is the colour of natural undyed silk, raw linen, and unbleached cotton. It's not white; it's the warmest of cream tones, with the tan undertone that fibres carry before bleaching. The word itself denotes the philosophical stance of leaving material in its natural state.",
      "In Japandi colour systems kinari is the warm-anchor variant: where gofun pulls cool-white, kinari pulls warm-cream. The choice between them sets the temperature of the entire palette. A Japandi room anchored on kinari reads as <em>cosy and traditional</em>; the same room anchored on gofun reads as <em>spare and architectural</em>.",
    ],
  },

  // ---------- Additional canonical named colours (v2 expansion) ----------

  murasaki: {
    paragraphs: [
      "Murasaki (紫) is the deep purple dyed from the roots of the murasaki plant (<em>Lithospermum erythrorhizon</em>) — a colour so labour-intensive to produce that the Heian court reserved its darkest variants as <em>kinjiki</em> (forbidden colours), wearable only by the imperial family and highest court ranks. The cheaper variants were available to the rest of the aristocracy; commoners were forbidden the colour entirely.",
      "The dye-plant gave its name to the colour and to one of the most-quoted figures in Japanese literature: Murasaki Shikibu, author of <em>The Tale of Genji</em>, took her name from this very pigment. Modern usage: heritage luxury, premium publishing, brands trading on intellectual or imperial association. Reads more spiritual than party-purple.",
    ],
    workingNote: "Pairs canonically with chalk-white gofun for high-formality or with deep gold for ceremonial register. Avoid fluorescent neighbours — murasaki belongs to a slow palette.",
  },

  ai: {
    paragraphs: [
      "Ai (藍) is indigo — the deep blue dyed from the leaves of <em>Polygonum tinctorium</em> (Japanese indigo plant) through a fermented vat dye process that takes months to set up and decades to master. By the Edo period, ai was the workhorse blue of the entire country: samurai under-armour, merchant work clothes, futon covers, noren shop curtains. Whole towns built their economy around ai dyeing.",
      "The colour reads <em>everyday Japanese</em> in a way no other blue does — closer to denim than to ultramarine, closer to navy than to cobalt, with a slight green undertone and the textile-dye depth that synthetic blues never quite match. Modern usage: heritage food brands, craft-goods packaging, anywhere that wants to read as 'old Japan' without reading as 'tourist Japan.'",
    ],
    workingNote: "The textbook ai pairing is with kinari (unbleached cream) — the indigo-and-cream of Edo-period workwear. Reads instantly traditional + warm + grounded.",
  },

  asagi: {
    paragraphs: [
      "Asagi (浅葱) is the pale green-blue of young leek shoots — literally 'shallow leek' — and one of the named colours that appears most consistently across Wada's catalogue. It sits between sky-blue and pale celadon, with enough green to read as <em>fresh</em> rather than cool, and enough blue to read as <em>bright</em> rather than vegetal. Historically it was used for under-robes in summer kimonos and for low-rank samurai garments (specifically the Shinsengumi uniform haori in mid-19th century Kyoto).",
      "Modern usage: hospitality, wellness, summer-season editorial, beauty packaging — anywhere a 'fresh cool' reads better than 'cold cool.' Asagi is one of the colours that lets a Japandi or wabi-sabi palette feel <em>vital</em> instead of austere.",
    ],
  },

  ruri: {
    paragraphs: [
      "Ruri (瑠璃) is the vivid deep blue of lapis lazuli — the gemstone, not the dye. The colour is named after the stone, and the Buddhist Pure Land ('Eastern Lapis Realm') is where the pigment's cultural weight comes from. Where ai is everyday-blue, ruri is jewel-blue: saturated, slightly cool, and traditionally reserved for ceremonial textiles, religious paintings, and the most expensive lacquerware inlays.",
      "Modern usage: luxury hospitality, premium beauty, anywhere the brief asks for a blue that reads as <em>precious</em> rather than functional. Ruri pulls darker and more saturated than hanada (the half-indigo blue), brighter than kon (deep navy), and richer than asagi.",
    ],
  },

  tokiwa: {
    paragraphs: [
      "Tokiwa (常磐) — literally 'eternal rock' — is the deep evergreen of pine needles and cedar bark, named for the trees that hold their colour through winter. It's a structural green: the colour of an eternal hedge, a temple cypress, a household crest passed through generations. The word carries the connotation of <em>permanence</em> rather than <em>nature</em>.",
      "In palette work tokiwa is the canonical green axis of folk-textile combinations — most famously paired with akane (madder red) in the textbook 'red and green' of Japanese rural clothing, without the Christmas-y connotations of the Western pairing. Reads grounded, warm, and pre-modern.",
    ],
    workingNote: "Tokiwa + akane is the folk-formal pair; tokiwa + kinari is the everyday wear. Avoid pairing with seiji or asagi — those greens cancel rather than complement.",
  },

  kon: {
    paragraphs: [
      "Kon (紺) is deep navy — the darkest practical shade of indigo, the colour of dyed-and-redyed-and-redyed cotton until the fibres are nearly black. Used historically for samurai under-armour (because the blue-black colour hides bloodstains), Edo-period merchant workwear, and the deep-night skies in classical wood-block prints. Kon reads <em>weighty, grounded, and authoritative</em> in a way pure black does not.",
      "Modern usage: business identity, premium menswear, heritage brands, editorial publishing. Kon is the 'corporate navy' of the Japanese tradition — but with depth and material warmth that synthetic navies lack.",
    ],
    workingNote: "Pairs canonically with kurenai (court formal — see Heian guide) or with gofun (clean modern). Both pairings preserve kon's gravitas.",
  },

  kuro: {
    paragraphs: [
      "Kuro (黒) is black — but Japanese tradition distinguishes several blacks, and kuro is the everyday one: closer to Indian ink with a slight warmth, less absolute than printer's black. Used for kimono base colour in formal mourning (where it's worn paired with white only), for crests (mon) on white silk, and for the structural lines in calligraphy and ink-wash painting (sumi-e).",
      "Where sumi (墨, ink) is the calligraphy-specific black with sheen and depth, kuro is the broader 'black' of textile and lacquer. Modern usage: luxury packaging, premium menswear, editorial design — kuro reads warmer than Western black, especially when paired with cream rather than pure white.",
    ],
  },

  yamabuki: {
    paragraphs: [
      "Yamabuki (山吹) is the saturated golden-yellow of the Japanese kerria flower — a bright spring-blooming shrub whose colour gave its name to one of the canonical Heian seasonal palettes. The colour reads <em>sun-on-petals</em> rather than <em>citrus</em>: it has the deep gold undertone that pure yellow lacks, and the soft warmth that prevents it from reading as institutional.",
      "Yamabuki was historically associated with prosperity (the flower blooms in late spring, after winter scarcity ends) and was a popular layering colour in the kasane-no-irome tradition. Modern usage: hospitality, premium food packaging, seasonal-rotation brand systems, anywhere a 'warm spring yellow' reads better than 'corporate yellow.'",
    ],
    workingNote: "Pairs canonically with deep evergreen (the spring-blossom-against-pine combination) or with sumi black (the Edo-textile gold-on-ink pairing). Both reverse the institutional-yellow trap.",
  },
};
