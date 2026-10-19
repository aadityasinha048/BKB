'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Award,
  ShieldCheck,
  Feather,
  BookOpen,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Droplets,
  Layers,
  Sparkles,
  Sun,
  X,
  Clock,
  Eye,
  CheckCircle2
} from 'lucide-react';

// ─── AUTHENTIC BIHAR GI PRODUCT JOURNEYS DATA ──────────────────────────────
const GI_JOURNEYS = [
  {
    id: 1,
    shopId: 1,
    slug: 'mithila-makhana',
    name: 'Mithila Makhana',
    hindiName: 'मिथिला मखाना',
    category: 'Wetlands',
    giTagNo: 'GI Tag #690',
    year: '2022',
    giClass: 'Class 31 · Horticulture',
    district: 'Darbhanga & Madhubani',
    culturalZone: 'Mithilanchal Wetland Basin',
    pinCoords: { left: '50.8%', top: '42.1%' },
    imgSrc: '/images/products/prod_1.png',
    tagline: 'The Popped White Gold of Sacred Waters',
    terroirBrief: 'Perennial stagnant oxbow lakes (pokhars) with deep aquatic peat and Kamala-Balan river silt.',
    journeyStages: [
      {
        stage: '01',
        title: 'The Midnight Mud Dive',
        desc: 'At 3:00 AM, Mallah fisherfolk wade neck-deep into pitch-black wetland ponds, holding bamboo poles to rake thorny Euryale ferox seed pods buried deep in the anaerobic pond mud.'
      },
      {
        stage: '02',
        title: 'Six-Stage Sun Grading',
        desc: 'Harvested black seeds are washed through tiered cylindrical sieves, then laid across woven split-bamboo mats to sun-dry until their moisture levels reach exactly 28%.'
      },
      {
        stage: '03',
        title: 'The Sal-Wood Clay Hearth',
        desc: 'Seeds are preheated in unglazed clay pans over sal wood fires, turning their outer black shells brittle while expanding the interior kernel.'
      },
      {
        stage: '04',
        title: 'The Split-Second Hammer Strike',
        desc: 'Within 2 seconds of leaving the fire, master artisans hammer the fiery shell with a heavy wooden mallet (thapa), exploding the seed into immaculate ivory makhana.'
      }
    ],
    theStory: 'For thousands of years, every auspicious ritual in Mithila — from Vedic weddings to Kojagari Kojagiri celebrations — has begun with makhana. Cultivated entirely without chemical fertilizers, it represents a sacred communion between the fisherfolk community and the floodwaters of North Bihar.',
    distinctions: [
      'Supplies over 85% of global natural popped lotus seed production.',
      'Naturally alkaline, protein-dense, and rich in calcium, magnesium, and potassium.',
      'Protected under GI Tag 690 to safeguard hereditary Mallah pond farmers.'
    ],
    season: 'August – November Harvest',
    priceNote: 'Direct-from-pond packages from ₹480 / 500g'
  },
  {
    id: 4,
    shopId: 4,
    slug: 'shahi-litchi',
    name: 'Shahi Litchi of Muzaffarpur',
    hindiName: 'मुजफ्फरपुर की शाही लीची',
    category: 'Orchards',
    giTagNo: 'GI Tag #552',
    year: '2018',
    giClass: 'Class 31 · Fresh Fruit',
    district: 'Muzaffarpur',
    culturalZone: 'Tirhut Division',
    pinCoords: { left: '43.0%', top: '39.4%' },
    imgSrc: '/images/products/prod_4.png',
    tagline: 'The Empress of Summer Fruits',
    terroirBrief: 'Calciferous alluvial loam rich in natural calcium carbonate along the Burhi Gandak riverbanks.',
    journeyStages: [
      {
        stage: '01',
        title: 'Winter Chilling & Blossom',
        desc: 'Old orchards benefit from specific winter chill hours followed by dense Gandak morning mists, prompting synchronous golden-yellow panicle flowering in late February.'
      },
      {
        stage: '02',
        title: 'May Humidity & Sugar Peak',
        desc: 'During scorching pre-monsoon heat, riverbank moisture maintains 75% atmospheric humidity, allowing the fruit to swell while concentrating volatile rose aroma esters.'
      },
      {
        stage: '03',
        title: 'The Pre-Dawn Pluck',
        desc: 'Picking begins strictly at 4:00 AM and halts by 7:30 AM before the sun heats the canopy, ensuring essential oils and moisture remain trapped inside the translucent aril.'
      },
      {
        stage: '04',
        title: 'Air-Freight to Dignitaries',
        desc: 'Wicker-basket cushioned crates are dispatched the same morning to the Rashtrapati Bhavan, Prime Minister’s residence, and discerning connoisseurs across India.'
      }
    ],
    theStory: 'Introduced to Tirhut in the late 19th century, the litchi encountered a unique geological miracle in the Gandak alluvium. Known as the fruit of kings, Shahi Litchis are celebrated for an incomparable rose perfume and delicate small stones that cannot be reproduced in any other soil.',
    distinctions: [
      'Exceptional 80%+ pulp-to-weight ratio with whisper-thin crimson skin.',
      'Naturally high in vitamin C and polyphenols with low organic acidity.',
      'Certified under GI Tag 552 covering Muzaffarpur, Vaishali, and Samastipur.'
    ],
    season: 'May – June Dawn Harvest',
    priceNote: 'Air-shipped harvest crates from ₹380 / kg'
  },
  {
    id: 3,
    shopId: 3,
    slug: 'bhagalpuri-tussar-silk',
    name: 'Bhagalpuri Tussar Silk',
    hindiName: 'भागलपुरी तसर सिल्क',
    category: 'Handloom',
    giTagNo: 'GI Tag #188',
    year: '2012',
    giClass: 'Class 24 & 25 · Handloom Textiles',
    district: 'Bhagalpur',
    culturalZone: 'Anga Desh · The Silk City',
    pinCoords: { left: '70.3%', top: '48.4%' },
    imgSrc: '/images/products/prod_3.png',
    tagline: 'The Wild Golden Weave of Champanagar',
    terroirBrief: 'Wild silkworm habitats in the forested hills of Banka & Gangetic moisture in Champanagar.',
    journeyStages: [
      {
        stage: '01',
        title: 'The Forest Cocoon Forage',
        desc: 'Indigenous tribal foragers gather wild Antheraea mylitta cocoons from deep inside Asan and Arjun deciduous forests bordering the Santhal Parganas.'
      },
      {
        stage: '02',
        title: 'Thigh-Reeling (Ghicha & Katiya)',
        desc: 'Generations of women artisans hand-reel the filament from boiled wild cocoons onto clay bobbins, creating the signature textured slub of organic tussar.'
      },
      {
        stage: '03',
        title: 'The 200-Year Pit Loom',
        desc: 'Master Ansari weavers in Nathnagar set up century-old teak pit looms, interlacing warp and weft with rhythmic foot pedals under natural ambient courtyard light.'
      },
      {
        stage: '04',
        title: 'Natural Thermo-Regulating Finish',
        desc: 'Finished weaves retain their natural honey-gold sheen without synthetic bleaching, providing porous breathability that stays cool in summer and warm in winter.'
      }
    ],
    theStory: 'The heritage of Bhagalpur silk spans more than two centuries, mentioned in ancient Buddhist texts as the golden fabric of Anga Desh. Today, over 25,000 traditional weaving households preserve the rhythm of wooden shuttles, creating royal textiles that have dressed maharajas and international runways.',
    distinctions: [
      '100% natural wild silk with distinctive coarse slub texture and golden luster.',
      'Exceptional tensile strength and natural acoustic porous breathability.',
      'GI certification safeguards hereditary handloom weavers against factory mills.'
    ],
    season: 'Continuous Generational Weaving',
    priceNote: 'Authentic pit-loom sarees from ₹3,800'
  },
  {
    id: 2,
    shopId: 2,
    slug: 'madhubani-painting',
    name: 'Madhubani (Mithila) Paintings',
    hindiName: 'मिथिला / मधुबनी चित्रकला',
    category: 'Art',
    giTagNo: 'GI Tag #145',
    year: '2007',
    giClass: 'Class 16 · Folk Art & Handicraft',
    district: 'Madhubani',
    culturalZone: 'Mithila Heartland · Jitwarpur & Ranti',
    pinCoords: { left: '52.7%', top: '32.3%' },
    imgSrc: '/images/products/prod_2.png',
    tagline: 'The 2,500-Year Living Visual Scripture',
    terroirBrief: 'Traditional clay walls washed with cow dung and unbleached handmade cotton rag paper.',
    journeyStages: [
      {
        stage: '01',
        title: 'Pigment Foraging in the Wild',
        desc: 'Artisans gather natural plant pigments: mustard lamp soot for carbon black, turmeric and bilva leaves for yellow, palash flowers for orange, and wild indigo for blue.'
      },
      {
        stage: '02',
        title: 'Bamboo Twig & Nib Craft',
        desc: 'No synthetic brushes are used. Crushed bamboo sticks (kachi), matchsticks, and pointed feathers are used to draw freehand double-line borders.'
      },
      {
        stage: '03',
        title: 'The Horror Vacui Geometry',
        desc: 'Every inch of space is consecrated with sacred motifs — fish for fertility, lotus for cosmic consciousness, peacocks for beauty, and celestial sun and moon symbols.'
      },
      {
        stage: '04',
        title: 'The Matriarchal Blessing',
        desc: 'Passed down orally from mothers to daughters across millennia, each piece carries the intimate prayers of women wishing prosperity upon their households.'
      }
    ],
    theStory: 'Legend recounts that King Janaka commissioned artists across Mithila to decorate the royal city for the wedding of his daughter Sita to Lord Rama. For centuries, this sacred visual language lived exclusively on mud prayer walls (Kohbar) until modern paper was introduced in the 1960s, turning village women into world-renowned master artists.',
    distinctions: [
      'Five ancient styles: Bharni, Katchni, Tantrik, Godna, and ceremonial Kohbar.',
      'Painted with 100% natural plant and mineral pigments with zero synthetic acrylics.',
      'The earliest registered GI tag from Bihar (2007), legally protecting indigenous folk art.'
    ],
    season: 'Year-Round Artisan Studios',
    priceNote: 'Original signed works from ₹1,200'
  },
  {
    id: 5,
    shopId: 5,
    slug: 'silao-khaja',
    name: 'Silao Khaja Delicacy',
    hindiName: 'सिलाव का ऐतिहासिक खाजा',
    category: 'Confectionery',
    giTagNo: 'GI Tag #553',
    year: '2018',
    giClass: 'Class 30 · Heritage Confectionery',
    district: 'Nalanda · Silao',
    culturalZone: 'Magadha Empire · Rajgir Corridor',
    pinCoords: { left: '44.9%', top: '62.7%' },
    imgSrc: '/images/products/prod_5.png',
    tagline: 'The 52-Layer Sweet Blessed by the Buddha',
    terroirBrief: 'Alkaline mineral groundwater filtered through the ancient basalt rocks of the Rajgir Hills.',
    journeyStages: [
      {
        stage: '01',
        title: 'The Mineral Aquifer Water',
        desc: 'The dough of wheat flour is kneaded exclusively with groundwater from heritage stone aquifers in Silao, whose precise alkaline composition prevents dough brittleness.'
      },
      {
        stage: '02',
        title: 'The 52 Gossamer Folds',
        desc: 'Halwais roll the dough wafer-thin, layer it with melted pure cow ghee, and fold it precisely 52 times to create dozens of micro-strata without compression.'
      },
      {
        stage: '03',
        title: 'Slow Ghee Immersion',
        desc: 'The folded pastries are immersed into moderate-heat pure ghee in broad iron kadhais, blossoming into crisp multi-layered golden fans.'
      },
      {
        stage: '04',
        title: 'The Light Sugar Glaze',
        desc: 'Immediately removed from the oil, the khaja is dipped for seconds into a warm, lightly boiled sugar syrup that crystallizes into a whisper-thin golden coat.'
      }
    ],
    theStory: 'Historical accounts record that Gautama Buddha, walking along the royal pilgrim route from Rajgir to Nalanda in the 6th century BCE, tasted this delicate sweet in Silao and sanctified its craftsmanship. It remains a staple offering in Buddhist and Jain pilgrimages across Magadha.',
    distinctions: [
      'Distinctive 52 whisper-thin crispy layers that shatter effortlessly on the palate.',
      'Retains absolute crispness for up to 35 days without preservatives or additives.',
      'GI Tag protects the multi-century confectionery legacy of traditional Silao halwais.'
    ],
    season: 'Freshly Handcrafted Daily in Silao',
    priceNote: 'Artisanal gift boxes from ₹250 / 500g'
  },
  {
    id: 6,
    shopId: 6,
    slug: 'katarni-rice',
    name: 'Katarni Aromatic Rice',
    hindiName: 'कतरनी सुगंधित धान व चूड़ा',
    category: 'Grains',
    giTagNo: 'GI Tag #554',
    year: '2018',
    giClass: 'Class 31 · Heirloom Aromatic Grain',
    district: 'Bhojpur & Rohtas',
    culturalZone: 'Sone & Ganga River Basin',
    pinCoords: { left: '29.3%', top: '48.4%' },
    imgSrc: '/images/products/prod_6.png',
    tagline: 'The Sacred Fragrance of Ancient Bhojpur',
    terroirBrief: 'Lime-rich clay alluvium fed by subterranean hill streams flowing into the Sone basin.',
    journeyStages: [
      {
        stage: '01',
        title: 'Lime-Rich Silt Sowing',
        desc: 'Heirloom seeds preserved through village seed banks are transplanted in soils with high calcium carbonate, which triggers synthesis of the fragrance compound 2-acetyl-1-pyrroline.'
      },
      {
        stage: '02',
        title: 'Field Aroma at Heading',
        desc: 'Unlike ordinary rice whose scent is trapped in the grain, Katarni fields perfume entire rural neighborhoods as early as the flowering stage in late October.'
      },
      {
        stage: '03',
        title: 'Traditional Wood-Fire Parboiling',
        desc: 'Paddy selected for beaten rice (Chura) is soaked in earthen vats and roasted with river sand over wood fires before passing through stone flatteners.'
      },
      {
        stage: '04',
        title: 'Makar Sankranti Banquet',
        desc: 'Prided as Bihar’s supreme festival feast, Katarni Chura is paired with thick buffalo curd (dahi), date-palm jaggery (gur), and Tilkut in January celebrations.'
      }
    ],
    theStory: 'Katarni is biologically tied to its terroir: agricultural scientists have confirmed that if Katarni is transplanted outside South Bihar, its fragrance vanishes within two crop cycles. It is the aromatic soul of ancestral feasts across the Gangetic basin.',
    distinctions: [
      'Slender, easily digestible grain with a remarkably low glycemic response.',
      'Flattens into paper-thin, crisp snow-white beaten rice (Chura).',
      'Protected under GI Tag 554 to preserve the indigenous non-hybrid gene pool.'
    ],
    season: 'November – January Winter Paddy',
    priceNote: 'Farm-milled aromatic grain at ₹160 / kg'
  },
  {
    id: 13,
    shopId: null,
    slug: 'marcha-rice',
    name: 'Marcha Dhan of West Champaran',
    hindiName: 'पश्चिमी चंपारण का मर्चा धान',
    category: 'Grains',
    giTagNo: 'GI Tag #704',
    year: '2023',
    giClass: 'Class 31 · Heirloom Mountain Grain',
    district: 'West Champaran',
    culturalZone: 'Terai Sub-Himalayan Foothills',
    pinCoords: { left: '29.3%', top: '19.7%' },
    imgSrc: '/images/products/marcha_rice.jpg',
    tagline: 'The Peppercorn Grain of the Terai Foothills',
    terroirBrief: 'Pristine mountain forest runoff containing virgin humus from the Someshwar Range.',
    journeyStages: [
      {
        stage: '01',
        title: 'Sub-Himalayan Runoff Waters',
        desc: 'Grown in the valleys of Mainatand and Gaunaha, where icy hill streams wash down nutrient-rich leaf mould from the Valmiki Tiger Reserve forests.'
      },
      {
        stage: '02',
        title: 'Peppercorn Morphogenesis',
        desc: 'The unique landrace produces short, rounded grains whose dark husks closely resemble black pepper corns (mircha), setting it apart from all Indian grains.'
      },
      {
        stage: '03',
        title: 'Roasted Sweetcorn Aroma',
        desc: 'When cooked, Marcha rice emits an extraordinary buttery popcorn scent that lingers in the home for hours without any artificial flavor additives.'
      },
      {
        stage: '04',
        title: 'The Satyagraha Legacy',
        desc: 'During Mahatma Gandhi’s historic 1917 Champaran Satyagraha, local peasants sustained the independence movement on bowls of Marcha Chura.'
      }
    ],
    theStory: 'Conserved for centuries by the indigenous Tharu tribal community, Marcha Dhan represents one of the rarest agricultural landraces on the Indian subcontinent. It was granted GI status in 2023 to preserve Champaran’s tribal seed sovereignty.',
    distinctions: [
      'Distinctive round black-pepper shaped grain with intense natural aroma.',
      'Fluffs to twice its raw volume with exceptional tenderness.',
      'Certified under GI Tag 704 as Bihar’s newest agricultural crown jewel.'
    ],
    season: 'December – February Foothill Harvest',
    priceNote: 'Heirloom harvest from Champaran organic co-ops'
  },
  {
    id: 7,
    shopId: 7,
    slug: 'jardalu-mango',
    name: 'Bhagalpuri Zardalu Mango',
    hindiName: 'भागलपुरी जरदालु आम',
    category: 'Orchards',
    giTagNo: 'GI Tag #551',
    year: '2018',
    giClass: 'Class 31 · Fresh Horticulture',
    district: 'Bhagalpur',
    culturalZone: 'Anga Desh · Sultanganj Riverbanks',
    pinCoords: { left: '71.5%', top: '53.0%' },
    imgSrc: '/images/products/prod_7.png',
    tagline: 'The Nawab’s Saffron Royal Mango',
    terroirBrief: 'Ganga riverbed silt and dry scorching westerly summer winds (Loo).',
    journeyStages: [
      {
        stage: '01',
        title: 'The Nawab’s Historic Graft',
        desc: 'Planted in Sultanganj during the 19th century by Maharaja Rahmat Khan Bahadur, the cultivar adapted uniquely to the sandy alluvial soil along the Ganga.'
      },
      {
        stage: '02',
        title: 'Summer Heat & Sugar Synthesis',
        desc: 'Hot westerly winds concentrate sugars within the curved beak of the mango, while subterranean moisture from the Ganga keeps the pulp silk-soft.'
      },
      {
        stage: '03',
        title: 'Hand-Selection of Crown Crates',
        desc: 'Every year, the Bihar Department of Agriculture hand-selects prime crates of golden Zardalu mangoes for the President and Prime Minister of India.'
      },
      {
        stage: '04',
        title: 'Zero-Fiber Gourmet Tasting',
        desc: 'Characterized by its curved beak and smooth golden peel, Zardalu has completely fiber-free pulp that melts instantly on the tongue.'
      }
    ],
    theStory: 'A single historic mother tree planted over a century ago in Sultanganj continues to yield fruit. Celebrated as the pride of Bhagalpur, Zardalu is sent annually across embassies as a diplomatic ambassador of Bihar’s agricultural mastery.',
    distinctions: [
      'Vivid saffron-gold skin with an unmistakable curved beak tip.',
      'Silky, non-fibrous pulp with intense floral aroma that fills an entire room.',
      'Awarded GI Tag 551 protecting authentic Sultanganj orchard keepers.'
    ],
    season: 'Late May – Mid June Summer Flush',
    priceNote: 'Select orchard harvest from ₹420 / kg'
  },
  {
    id: 14,
    shopId: null,
    slug: 'sujini-embroidery',
    name: 'Sujini Narrative Embroidery',
    hindiName: 'सुजिनी हस्तशिल्प और कथ्य कढ़ाई',
    category: 'Handloom',
    giTagNo: 'GI Tag #74',
    year: '2006',
    giClass: 'Class 26 · Textile Needlecraft',
    district: 'Muzaffarpur & Sitamarhi',
    culturalZone: 'Tirhut Rural Heartlands · Bhusra',
    pinCoords: { left: '44.5%', top: '44.5%' },
    imgSrc: '/images/products/sujini_embroidery.jpg',
    tagline: 'The Narrative Needle of Women’s Resilience',
    terroirBrief: 'Vintage cotton and handspun tussar silk stitched with unravelled border threads.',
    journeyStages: [
      {
        stage: '01',
        title: 'The Maternal Birth Quilt',
        desc: 'Originating from "Su" (graceful) and "Jani" (birth), grandmothers traditionally layered worn soft cotton saris to stitch protective amulets for newborns.'
      },
      {
        stage: '02',
        title: 'Fine Chain-Stitch Contouring',
        desc: 'Using fine needles and threads salvaged from old borders, women sew undulating linear textures that capture village folk life and rural landscapes.'
      },
      {
        stage: '03',
        title: 'Chronicles of Female Empowerment',
        desc: 'In Bhusra village, artisans revolutionized the craft in the 1980s by stitching poignant social narratives: women’s struggles, child marriage, and environmental battles.'
      },
      {
        stage: '04',
        title: 'Museum-Acclaimed Tapestries',
        desc: 'Today, Sujini quilts are recognized in global design academies and contemporary textile museums as profound feminist narrative art.'
      }
    ],
    theStory: 'What began as an intimate domestic ritual behind village doorways has grown into an internationally respected craft of social voice. Stitched over several months, every Sujini quilt is an unrepeatable human autobiography in thread.',
    distinctions: [
      'Layered recycled cotton and tussar silk stitched with dense chain stitch.',
      'Each piece is an original narrative chronicle created without commercial stencils.',
      'One of India’s earliest registered Geographical Indications (2006).'
    ],
    season: 'Year-Round Women’s Cooperatives',
    priceNote: 'Direct museum tapestries from artisan guilds'
  },
  {
    id: 12,
    shopId: 12,
    slug: 'sikki-grass-craft',
    name: 'Sikki Grass Golden Crafts',
    hindiName: 'मिथिला का सिक्की ग्रास क्राफ्ट',
    category: 'Art',
    giTagNo: 'GI Tag #76',
    year: '2007',
    giClass: 'Class 20 · Natural Fiber Craft',
    district: 'Sitamarhi & Madhubani',
    culturalZone: 'Mithilanchal Riverbanks',
    pinCoords: { left: '43.9%', top: '27.8%' },
    imgSrc: '/images/products/prod_12.png',
    tagline: 'The Naturally Shimmering Reed of the Wetlands',
    terroirBrief: 'Wild monsoon marsh reeds harvested along the Kamla and Bagmati sandbars.',
    journeyStages: [
      {
        stage: '01',
        title: 'Monsoon Sandbar Forage',
        desc: 'Sikki grass (Chrysopogon zizanioides) shoots up exclusively during the monsoon along the wet sandbars of North Bihar’s rivers and is cut by hand.'
      },
      {
        stage: '02',
        title: 'Drying to Natural Gold',
        desc: 'The harvested stems are sun-bleached on open riverbanks until the grass naturally cures into a brilliant, shimmering metallic golden color.'
      },
      {
        stage: '03',
        title: 'Splitting with the Takua',
        desc: 'Artisans use a traditional needle tool called the Takua to split each hollow golden reed lengthwise without breaking its longitudinal fibers.'
      },
      {
        stage: '04',
        title: 'Coiling Family Heirlooms',
        desc: 'The reeds are coiled over sturdy munj grass cores to weave iconic dowry boxes (pautis), storage hampers, and ritual toys that last for generations.'
      }
    ],
    theStory: 'Known colloquially as the "Golden Grass of Bihar", Sikki carries deep emotional resonance in Mithila. Traditionally, a mother wove Sikki boxes for her daughter’s wedding, sealing family heirlooms within water-resistant golden reeds as a symbol of eternal maternal blessing.',
    distinctions: [
      'Completely natural metallic golden luster that never requires artificial paint.',
      'Durable, flexible, and naturally insect-resistant for decades.',
      'Certified under GI Tag 76 preserving sustainable wetland fiber mastery.'
    ],
    season: 'Post-Monsoon Sun Cured (October – April)',
    priceNote: 'Artisan hand-woven sets from ₹450'
  },
  {
    id: 10,
    shopId: 10,
    slug: 'tikuli-art',
    name: 'Tikuli Art of Bihar',
    hindiName: 'पटना की प्राचीन टिकुली कला',
    category: 'Art',
    giTagNo: 'GI Heritage Inscription',
    year: 'Heritage Register',
    giClass: 'Class 20 & 28 · Imperial Miniature Lacquer',
    district: 'Patna',
    culturalZone: 'Magadha · Ancient Pataliputra',
    pinCoords: { left: '39.1%', top: '52.9%' },
    imgSrc: '/images/products/prod_10.png',
    tagline: 'The 800-Year Imperial Bindi & Lacquer Craft',
    terroirBrief: 'Polished hardwood substrate layered with natural hard lacquer and gold foil.',
    journeyStages: [
      {
        stage: '01',
        title: 'Courtly Pataliputra Origins',
        desc: 'Flourishing 800 years ago in imperial Pataliputra, Tikuli was the royal craft of manufacturing jewel-like glass bindis for queens and court noblewomen.'
      },
      {
        stage: '02',
        title: 'Multi-Coat Lacquer Priming',
        desc: 'Wooden plaques are treated with four coats of natural enamel lacquer and polished with river sand and smooth river pebbles to create a porcelain-smooth ground.'
      },
      {
        stage: '03',
        title: 'Micro-Needle Line Drawing',
        desc: 'Master artisans draw royal processions, court dancers, and Madhubani epics using micro-fine needles and fine squirrel-hair brushes.'
      },
      {
        stage: '04',
        title: 'Pure Gold Leaf Ornamentation',
        desc: 'Intricate details are accented with delicate sheets of genuine gold foil, sealed with clear natural varnish that endures for centuries without tarnishing.'
      }
    ],
    theStory: 'Once produced in hundreds of households in Patna City, Tikuli was revived in the 20th century by state awardees who adapted the bindi technique onto decorative wall panels, immortalizing the courtly aesthetics of ancient Bihar.',
    distinctions: [
      'Intricate enamel and gold leaf handwork on hand-polished lacquer substrate.',
      'Centuries of royal lineage rooted in the Mauryan and Mughal heritage of Patna.',
      'Preserved by master state awardees as Bihar’s hallmark imperial souvenir.'
    ],
    season: 'Year-Round Studio Production',
    priceNote: 'Framed lacquer pieces from ₹680'
  }
];

const CATEGORY_TABS = [
  { id: 'All', label: 'All 11 Bihar GI Treasures' },
  { id: 'Wetlands', label: 'Wetland Pokhars' },
  { id: 'Orchards', label: 'Alluvial Orchards' },
  { id: 'Handloom', label: 'Handloom & Silk' },
  { id: 'Grains', label: 'Heirloom Grains' },
  { id: 'Art', label: 'Folk & Court Art' },
  { id: 'Confectionery', label: 'Heritage Confectionery' }
];

export default function GIProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(GI_JOURNEYS[0]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [dossierModal, setDossierModal] = useState(null);

  const displayedProduct = hoveredProduct || selectedProduct;

  const filteredList = GI_JOURNEYS.filter(item => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  return (
    <div style={{ background: '#FAF8F5', color: '#1C1814', minHeight: '100vh', fontFamily: "var(--font-outfit), 'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @media (max-width: 980px) {
          .gi-hero-two-col { grid-template-columns: 1fr !important; gap: 36px !important; }
          .gi-map-layout-grid { grid-template-columns: 1fr !important; }
          .gi-journey-card-grid { grid-template-columns: 1fr !important; }
          .gi-stages-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .gi-stages-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ─── PROLOGUE: EDITORIAL ARCHIVAL HERO ─────────────────────────────── */}
      <section
        style={{
          borderBottom: '1px solid #E5DED4',
          background: 'linear-gradient(180deg, #F4EFE9 0%, #FAF8F5 100%)',
          padding: '80px 24px 70px',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Official Charter Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid #D5CABE',
              background: '#FFFFFF',
              borderRadius: 4,
              padding: '6px 14px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#8F671E',
              marginBottom: 24
            }}
          >
            <ShieldCheck size={14} color="#8F671E" strokeWidth={1.75} />
            <span>Geographical Indications Registry of India · Bihar State Dossier</span>
          </div>

          <div className="gi-hero-two-col" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 56, alignItems: 'center' }}>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-devanagari), 'Noto Sans Devanagari', sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#9C4124',
                  letterSpacing: '0.04em',
                  marginBottom: 8
                }}
              >
                बिहार की जीवित भौगोलिक धरोहर · सदियों की विरासत का सफर
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-playfair), 'DM Serif Display', Georgia, serif",
                  fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
                  lineHeight: 1.12,
                  fontWeight: 400,
                  color: '#1C1814',
                  letterSpacing: '-0.02em',
                  margin: '0 0 20px 0'
                }}
              >
                The Soil, The River, <br />
                <span style={{ fontStyle: 'italic', color: '#1E3A2B' }}>and The Living Masters</span>
              </h1>
              <p
                style={{
                  fontSize: 16.5,
                  lineHeight: 1.8,
                  color: '#4A4138',
                  maxWidth: 620,
                  margin: '0 0 32px 0'
                }}
              >
                Between the Himalayan snowmelt channels of the Gandak and the perennial
                alluvial silt of the sacred Ganges lies an ecological sanctuary found nowhere
                else on Earth. Every certified GI treasure from Bihar is a testament to
                unbroken oral lineage — where water, mud, handlooms, and hearth fire have
                shaped humanity’s finest flavors and crafts across millennia.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                <a
                  href="#bihar-map-section"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#1E3A2B',
                    color: '#FAF8F5',
                    padding: '13px 26px',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(30,58,43,0.18)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#152A1F'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1E3A2B'; }}
                >
                  <Compass size={15} />
                  <span>Explore the Bihar District Map</span>
                </a>

                <a
                  href="#heritage-chronicles-list"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#FFFFFF',
                    color: '#2E2620',
                    border: '1px solid #D5CABE',
                    padding: '13px 24px',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#9C4124'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#D5CABE'; }}
                >
                  <BookOpen size={15} />
                  <span>Read 11 Artisan Journeys</span>
                </a>
              </div>
            </div>

            {/* Archival Terroir Indices */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { code: 'GI / ACT', value: '11', label: 'Certified Inscriptions', note: 'Under Parliamentary GI Act 1999' },
                { code: 'GLOBAL SHARE', value: '85%+', label: 'Popped Lotus Harvest', note: 'Wild wetland pokhars of Mithila' },
                { code: 'TIME LINEAGE', value: '2,500 Yrs', label: 'Continuous Oral Tradition', note: 'Preserved by hereditary guilds' },
                { code: 'SOVEREIGNTY', value: '95%', label: 'Direct Producer Value', note: 'Zero intermediary exploitation' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2DACF',
                    borderRadius: 10,
                    padding: '22px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ fontSize: 9.5, fontWeight: 800, color: '#8F671E', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                    {item.code}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-playfair), 'DM Serif Display', Georgia, serif",
                      fontSize: 30,
                      color: '#1C1814',
                      fontWeight: 400,
                      lineHeight: 1.1,
                      marginBottom: 4
                    }}
                  >
                    {item.value}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#2E2620', marginBottom: 4 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#766B60', lineHeight: 1.4 }}>
                    {item.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACT I: THE LIVING CARTOGRAPHY (AUTHENTIC BIHAR MAP) ───────────── */}
      <section id="bihar-map-section" style={{ padding: '80px 24px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 40px' }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#1E3A2B',
              marginBottom: 10
            }}
          >
            Act I · The Living Cartography
          </div>
          <h2
            style={{
              fontFamily: "var(--font-playfair), 'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
              color: '#1C1814',
              fontWeight: 400,
              margin: '0 0 14px 0'
            }}
          >
            The Geography of Heritage
          </h2>
          <p style={{ fontSize: 15.5, color: '#5C5248', lineHeight: 1.75, margin: 0 }}>
            Hover or select any district hotspot on the official cartographic map of Bihar below.
            Trace how each product’s life journey is bound to its river basin, soil profile, and generational keepers.
          </p>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
            {CATEGORY_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                style={{
                  background: activeCategory === tab.id ? '#1E3A2B' : '#FFFFFF',
                  color: activeCategory === tab.id ? '#FAF8F5' : '#4A4138',
                  border: `1px solid ${activeCategory === tab.id ? '#1E3A2B' : '#D5CABE'}`,
                  padding: '8px 16px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* The Two-Column Map & Spotlight Canvas */}
        <div className="gi-map-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(0, 1fr)', gap: 32, alignItems: 'stretch' }}>
          
          {/* LEFT: THE REAL PHYSICAL CARTOGRAPHIC MAP OF BIHAR */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #D5CABE',
              borderRadius: 14,
              padding: '24px 20px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Cartographic Header Strip */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 14,
                borderBottom: '1px solid #ECE4DA',
                marginBottom: 16
              }}
            >
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: '#8F671E', textTransform: 'uppercase' }}>
                  STATE ATLAS SURVEY
                </span>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1C1814', marginTop: 2 }}>
                  Territorial Distribution of Certified GI Lineages
                </div>
              </div>

              <div style={{ fontSize: 11, color: '#766B60', border: '1px solid #E2DACF', padding: '4px 10px', borderRadius: 4, background: '#FAF8F5' }}>
                Active: <strong>{displayedProduct.district}</strong>
              </div>
            </div>

            {/* MAP CANVAS CONTAINER OVERLAYING USER'S REAL BIHAR DISTRICT MAP */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1024 / 558', borderRadius: 8, overflow: 'hidden', border: '1px solid #D5CABE' }}>
              <img
                src="/images/bihar_district_map.jpg"
                alt="Authentic Bihar District Map showing GI Origins"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#FFFFFF' }}
              />

              {/* INTERACTIVE DISTRICT HOTSPOT PINS */}
              {GI_JOURNEYS.map((item) => {
                const isMatch = activeCategory === 'All' || item.category === activeCategory;
                const isSelected = displayedProduct.id === item.id;

                if (!isMatch) return null;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedProduct(item);
                      const el = document.getElementById(`journey-${item.slug}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    onMouseEnter={() => setHoveredProduct(item)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    style={{
                      position: 'absolute',
                      left: item.pinCoords.left,
                      top: item.pinCoords.top,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: isSelected ? 20 : 10,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Concentric Pulse Ring when Active */}
                    {isSelected && (
                      <span
                        style={{
                          position: 'absolute',
                          inset: -10,
                          borderRadius: '50%',
                          border: '2px solid #9C4124',
                          animation: 'ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite',
                          pointerEvents: 'none'
                        }}
                      />
                    )}

                    {/* The Physical Pin Head */}
                    <div
                      style={{
                        width: isSelected ? 22 : 16,
                        height: isSelected ? 22 : 16,
                        borderRadius: '50%',
                        background: isSelected ? '#9C4124' : '#1E3A2B',
                        border: '2px solid #FFFFFF',
                        boxShadow: isSelected ? '0 4px 12px rgba(156,65,36,0.6)' : '0 2px 6px rgba(0,0,0,0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div
                        style={{
                          width: isSelected ? 8 : 5,
                          height: isSelected ? 8 : 5,
                          borderRadius: '50%',
                          background: '#FFFFFF'
                        }}
                      />
                    </div>

                    {/* District Mini-Pill beneath Pin */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: 4,
                        whiteSpace: 'nowrap',
                        background: isSelected ? '#1C1814' : 'rgba(255,255,255,0.92)',
                        color: isSelected ? '#FAF8F5' : '#1C1814',
                        border: isSelected ? '1px solid #1C1814' : '1px solid #D5CABE',
                        fontSize: isSelected ? 10 : 9,
                        fontWeight: isSelected ? 800 : 700,
                        padding: '2px 6px',
                        borderRadius: 3,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        pointerEvents: 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {item.district.split('&')[0].trim()}
                    </div>
                  </div>
                );
              })}

              {/* Floating Quick Preview on Hover */}
              {hoveredProduct && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    background: 'rgba(28,24,20,0.95)',
                    color: '#FAF8F5',
                    borderRadius: 8,
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    maxWidth: 320,
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    pointerEvents: 'none',
                    zIndex: 30
                  }}
                >
                  <img
                    src={hoveredProduct.imgSrc}
                    alt={hoveredProduct.name}
                    style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: '#C4973B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {hoveredProduct.giTagNo} · {hoveredProduct.district}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginTop: 1 }}>
                      {hoveredProduct.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#C9BEB2', marginTop: 2, lineHeight: 1.3 }}>
                      {hoveredProduct.tagline}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick District Navigation Bar below the Map */}
            <div
              style={{
                marginTop: 18,
                paddingTop: 14,
                borderTop: '1px solid #ECE4DA',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                overflowX: 'auto',
                scrollbarWidth: 'none'
              }}
            >
              <span style={{ fontSize: 11, color: '#766B60', fontWeight: 700, whiteSpace: 'nowrap' }}>Jump to district:</span>
              {GI_JOURNEYS.map(j => (
                <button
                  key={j.id}
                  onClick={() => {
                    setSelectedProduct(j);
                    const el = document.getElementById(`journey-${j.slug}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  style={{
                    background: selectedProduct.id === j.id ? '#1E3A2B' : '#FAF8F5',
                    color: selectedProduct.id === j.id ? '#FAF8F5' : '#4A4138',
                    border: `1px solid ${selectedProduct.id === j.id ? '#1E3A2B' : '#E2DACF'}`,
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s'
                  }}
                >
                  {j.district.split('&')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: LIVE TERROIR DOSSIER & JOURNEY SPOTLIGHT */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #D5CABE',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Spotlight Photography Header */}
            <div style={{ position: 'relative', height: 230, overflow: 'hidden', background: '#F2EDE5' }}>
              <img
                src={displayedProduct.imgSrc}
                alt={displayedProduct.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(28,24,20,0.85) 0%, transparent 60%)'
                }}
              />

              <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 6 }}>
                <span
                  style={{
                    background: '#1E3A2B',
                    color: '#FAF8F5',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '4px 8px',
                    borderRadius: 3,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}
                >
                  {displayedProduct.giTagNo}
                </span>
                <span
                  style={{
                    background: '#FFFFFF',
                    color: '#1C1814',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: 3
                  }}
                >
                  Registered {displayedProduct.year}
                </span>
              </div>

              <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
                <div style={{ color: '#E4BE5B', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {displayedProduct.district} · {displayedProduct.culturalZone}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'DM Serif Display', Georgia, serif",
                    fontSize: 24,
                    color: '#FFFFFF',
                    fontWeight: 400,
                    margin: '3px 0 0 0'
                  }}
                >
                  {displayedProduct.name}
                </h3>
              </div>
            </div>

            {/* Spotlight Body */}
            <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-devanagari), 'Noto Sans Devanagari', sans-serif",
                    fontSize: 14,
                    color: '#8F671E',
                    fontWeight: 600,
                    marginBottom: 10
                  }}
                >
                  {displayedProduct.hindiName} · {displayedProduct.giClass}
                </div>

                <div
                  style={{
                    background: '#FAF8F5',
                    border: '1px solid #E5DED4',
                    borderRadius: 8,
                    padding: '12px 14px',
                    marginBottom: 16
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#1E3A2B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    Terroir & Microclimate Secret
                  </div>
                  <div style={{ fontSize: 13, color: '#3A332C', lineHeight: 1.6 }}>
                    {displayedProduct.terroirBrief}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: '#9C4124', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    The Journey in Four Stages
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {displayedProduct.journeyStages.slice(0, 2).map(s => (
                      <div key={s.stage} style={{ fontSize: 12.5, color: '#4A4138', lineHeight: 1.5 }}>
                        <strong style={{ color: '#1C1814' }}>{s.stage}. {s.title}:</strong> {s.desc.slice(0, 95)}...
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ paddingTop: 16, borderTop: '1px solid #ECE4DA', display: 'flex', gap: 10 }}>
                {displayedProduct.shopId ? (
                  <Link href={`/shop/${displayedProduct.shopId}`} style={{ flex: 1, textDecoration: 'none' }}>
                    <button
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        background: '#1E3A2B',
                        color: '#FAF8F5',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#152A1F'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#1E3A2B'; }}
                    >
                      <ShoppingBag size={14} />
                      <span>Shop Certified Harvest</span>
                    </button>
                  </Link>
                ) : (
                  <Link href="/shop" style={{ flex: 1, textDecoration: 'none' }}>
                    <button
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        background: '#1E3A2B',
                        color: '#FAF8F5',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                    >
                      <ShoppingBag size={14} />
                      <span>Browse Artisan Stores</span>
                    </button>
                  </Link>
                )}

                <button
                  onClick={() => setDossierModal(displayedProduct)}
                  style={{
                    padding: '11px 16px',
                    background: '#FFFFFF',
                    color: '#2E2620',
                    border: '1px solid #D5CABE',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <BookOpen size={14} />
                  <span>Full Saga</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACT II: THE HERITAGE JOURNEYS (EDITORIAL STORYTELLING) ───────── */}
      <section
        id="heritage-chronicles-list"
        style={{
          padding: '90px 24px',
          background: '#FFFFFF',
          borderTop: '1px solid #E5DED4',
          borderBottom: '1px solid #E5DED4'
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 56 }}>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#8F671E',
                  marginBottom: 10
                }}
              >
                Act II · The Living Chronicles
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'DM Serif Display', Georgia, serif",
                  fontSize: 'clamp(2.3rem, 4.2vw, 3.4rem)',
                  color: '#1C1814',
                  fontWeight: 400,
                  margin: 0
                }}
              >
                The Journey of Bihar’s 11 Treasures
              </h2>
              <p style={{ fontSize: 16, color: '#5C5248', maxWidth: 660, marginTop: 12, lineHeight: 1.7 }}>
                Follow how raw nature, ancient science, and relentless human patience turn
                indigenous seeds, cocoons, and clay into India's most celebrated treasures.
              </p>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#FAF8F5',
                border: '1px solid #E2DACF',
                padding: '9px 16px',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                color: '#3A332C'
              }}
            >
              <Feather size={14} color="#8F671E" />
              <span>Documenting {filteredList.length} hereditary storylines</span>
            </div>
          </div>

          {/* EDITORIAL STORYTELLING CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
            {filteredList.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <article
                  key={item.id}
                  id={`journey-${item.slug}`}
                  className="gi-journey-card-grid"
                  style={{
                    background: '#FAF8F5',
                    borderRadius: 16,
                    border: '1.5px solid #E5DED4',
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: isEven ? '440px 1fr' : '1fr 440px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    transition: 'all 0.25s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#C4973B';
                    e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#E5DED4';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                  }}
                >
                  {/* Photo Column */}
                  <div
                    style={{
                      order: isEven ? 1 : 2,
                      position: 'relative',
                      minHeight: 440,
                      background: '#EDE5DA',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={item.imgSrc}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(28,24,20,0.75) 0%, transparent 45%)'
                      }}
                    />

                    {/* Registry Stamp */}
                    <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span
                        style={{
                          background: '#1E3A2B',
                          color: '#FAF8F5',
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '4px 9px',
                          borderRadius: 3,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase'
                        }}
                      >
                        {item.giTagNo}
                      </span>
                      <span
                        style={{
                          background: '#FFFFFF',
                          color: '#1C1814',
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 3,
                          width: 'fit-content'
                        }}
                      >
                        Certified {item.year}
                      </span>
                    </div>

                    <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, color: '#FAF8F5' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E4BE5B' }}>
                        {item.culturalZone}
                      </div>
                      <div style={{ fontSize: 12, color: '#FFFFFF', marginTop: 2 }}>
                        Origin: {item.district}, Bihar
                      </div>
                    </div>
                  </div>

                  {/* Storytelling Dossier Column */}
                  <div
                    style={{
                      order: isEven ? 2 : 1,
                      padding: '44px 44px 38px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      {/* Sub-header and Hindi name */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span
                          style={{
                            fontFamily: "var(--font-devanagari), 'Noto Sans Devanagari', sans-serif",
                            fontSize: 16,
                            fontWeight: 600,
                            color: '#8F671E'
                          }}
                        >
                          {item.hindiName}
                        </span>
                        <span style={{ fontSize: 11, color: '#766B60', fontWeight: 600 }}>{item.giClass}</span>
                      </div>

                      <h3
                        style={{
                          fontFamily: "var(--font-playfair), 'DM Serif Display', Georgia, serif",
                          fontSize: 'clamp(1.9rem, 2.8vw, 2.4rem)',
                          color: '#1C1814',
                          fontWeight: 400,
                          lineHeight: 1.18,
                          margin: '0 0 8px 0'
                        }}
                      >
                        {item.name}
                      </h3>

                      <div style={{ fontSize: 14, color: '#9C4124', fontStyle: 'italic', marginBottom: 18, fontWeight: 500 }}>
                        "{item.tagline}"
                      </div>

                      {/* Terroir Bar */}
                      <div
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #E2DACF',
                          borderRadius: 8,
                          padding: '12px 16px',
                          fontSize: 12.5,
                          color: '#4A4138',
                          lineHeight: 1.6,
                          marginBottom: 24
                        }}
                      >
                        <strong style={{ color: '#1E3A2B' }}>The Terroir Miracle:</strong> {item.terroirBrief}
                      </div>

                      {/* 4 STAGES OF THE JOURNEY */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1E3A2B', marginBottom: 12 }}>
                          The 4-Stage Ancestral Journey
                        </div>
                        <div className="gi-stages-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          {item.journeyStages.map(s => (
                            <div
                              key={s.stage}
                              style={{
                                background: '#FFFFFF',
                                border: '1px solid #ECE4DA',
                                borderRadius: 8,
                                padding: '12px 14px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                <span style={{ fontSize: 10, fontWeight: 800, color: '#8F671E', background: '#FAF8F5', padding: '2px 5px', borderRadius: 3 }}>
                                  {s.stage}
                                </span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: '#1C1814' }}>
                                  {s.title}
                                </span>
                              </div>
                              <p style={{ fontSize: 11.5, color: '#5C5248', lineHeight: 1.55, margin: 0 }}>
                                {s.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cultural Folklore */}
                      <p style={{ fontSize: 13.5, color: '#4A4138', lineHeight: 1.75, margin: '0 0 20px 0' }}>
                        {item.theStory}
                      </p>
                    </div>

                    {/* Card Footer Actions */}
                    <div
                      style={{
                        paddingTop: 18,
                        borderTop: '1px solid #E2DACF',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 12
                      }}
                    >
                      <div style={{ fontSize: 12, color: '#766B60' }}>
                        <strong>Harvest Rhythm:</strong> {item.season}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button
                          onClick={() => setDossierModal(item)}
                          style={{
                            padding: '10px 18px',
                            background: '#FFFFFF',
                            border: '1px solid #D5CABE',
                            borderRadius: 6,
                            fontSize: 12.5,
                            fontWeight: 700,
                            color: '#2E2620',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <BookOpen size={14} />
                          <span>Full Archive Dossier</span>
                        </button>

                        {item.shopId ? (
                          <Link href={`/shop/${item.shopId}`} style={{ textDecoration: 'none' }}>
                            <button
                              style={{
                                padding: '10px 20px',
                                background: '#1E3A2B',
                                color: '#FAF8F5',
                                border: 'none',
                                borderRadius: 6,
                                fontSize: 12.5,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#152A1F'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#1E3A2B'; }}
                            >
                              <ShoppingBag size={14} />
                              <span>Acquire Authentic GI</span>
                              <ChevronRight size={14} />
                            </button>
                          </Link>
                        ) : (
                          <Link href="/shop" style={{ textDecoration: 'none' }}>
                            <button
                              style={{
                                padding: '10px 20px',
                                background: '#1E3A2B',
                                color: '#FAF8F5',
                                border: 'none',
                                borderRadius: 6,
                                fontSize: 12.5,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                              }}
                            >
                              <ShoppingBag size={14} />
                              <span>Browse Collection</span>
                              <ChevronRight size={14} />
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── ACT III: THE LEGAL CHARTER (GI ACT 1999) ─────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#F4EFE9' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#8F671E',
                marginBottom: 8
              }}
            >
              Act III · The Legal Covenant
            </div>
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'DM Serif Display', Georgia, serif",
                fontSize: 'clamp(2rem, 3.4vw, 2.8rem)',
                color: '#1C1814',
                fontWeight: 400,
                margin: 0
              }}
            >
              Why the GI Tag Matters to Bihar’s Families
            </h2>
            <p style={{ fontSize: 15, color: '#5C5248', maxWidth: 640, margin: '12px auto 0', lineHeight: 1.7 }}>
              Under the Geographical Indications of Goods Act, 1999, certified origin is
              not a marketing label — it is an intellectual property sovereign treaty that
              safeguards ancestral labor from commercial counterfeits.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="gi-hero-two-col">
            {[
              {
                icon: ShieldCheck,
                title: 'Territorial Exclusivity by Law',
                desc: 'Only produce harvested or hand-woven within the authenticated geographic coordinates of Bihar can legally carry the GI designation. Counterfeiting carries criminal liabilities under Indian law.'
              },
              {
                icon: Droplets,
                title: 'Irreplaceable Microclimates',
                desc: 'The unique Gangetic flood alluvium, the limestone aquifers of Rajgir, and the frost-free pre-dawn humidities of Tirhut cannot be artificially synthesized in industrial greenhouses.'
              },
              {
                icon: Award,
                title: 'Generational Livelihood Dignity',
                desc: 'By buying certified GI goods through Bihar Ka Bazaar, 95% of retail revenue flows directly back to the Mallah pond divers, Tanti handloom weavers, and women artists.'
              }
            ].map((col, cIdx) => {
              const Icon = col.icon;
              return (
                <div
                  key={cIdx}
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #E2DACF',
                    borderRadius: 12,
                    padding: '30px 26px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 6,
                      background: '#FAF8F5',
                      border: '1px solid #E2DACF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 18
                    }}
                  >
                    <Icon size={20} color="#1E3A2B" strokeWidth={1.75} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair), 'DM Serif Display', Georgia, serif",
                      fontSize: 19,
                      color: '#1C1814',
                      fontWeight: 400,
                      margin: '0 0 10px 0'
                    }}
                  >
                    {col.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: '#5C5248', lineHeight: 1.7, margin: 0 }}>
                    {col.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FULL HERITAGE SAGA MODAL ───────────────────────────────────────── */}
      {dossierModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(28,24,20,0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
          onClick={() => setDossierModal(null)}
        >
          <div
            style={{
              background: '#FAF8F5',
              borderRadius: 16,
              maxWidth: 720,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1.5px solid #C4973B',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
              <img
                src={dossierModal.imgSrc}
                alt={dossierModal.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(28,24,20,0.9) 0%, transparent 60%)'
                }}
              />
              <button
                onClick={() => setDossierModal(null)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>

              <div style={{ position: 'absolute', bottom: 18, left: 24, right: 24 }}>
                <span
                  style={{
                    background: '#1E3A2B',
                    color: '#FAF8F5',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '4px 8px',
                    borderRadius: 3,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}
                >
                  {dossierModal.giTagNo} · Certified {dossierModal.year}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'DM Serif Display', Georgia, serif",
                    fontSize: 28,
                    color: '#FFFFFF',
                    fontWeight: 400,
                    margin: '6px 0 2px 0'
                  }}
                >
                  {dossierModal.name}
                </h3>
                <div style={{ color: '#E4BE5B', fontSize: 13, fontWeight: 600 }}>
                  {dossierModal.hindiName} · {dossierModal.district}, Bihar
                </div>
              </div>
            </div>

            <div style={{ padding: '28px 30px' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: '#1E3A2B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                  Terroir Definition & Geomorphology
                </div>
                <p style={{ fontSize: 14, color: '#3A332C', lineHeight: 1.75, margin: 0 }}>
                  {dossierModal.terroirBrief}
                </p>
              </div>

              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: '#8F671E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                  The Human & Cultural Chronicle
                </div>
                <p style={{ fontSize: 14, color: '#4A4138', lineHeight: 1.75, margin: 0 }}>
                  {dossierModal.theStory}
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E2DACF', borderRadius: 8, padding: '16px 18px', marginBottom: 24 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#1C1814', marginBottom: 8 }}>
                  Registry Dossier Distinctive Factors
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {dossierModal.distinctions.map((fact, fIdx) => (
                    <div key={fIdx} style={{ fontSize: 12.5, color: '#4A4138', lineHeight: 1.5, display: 'flex', gap: 8 }}>
                      <span style={{ color: '#1E3A2B', fontWeight: 800 }}>•</span>
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  onClick={() => setDossierModal(null)}
                  style={{
                    padding: '10px 20px',
                    background: '#FFFFFF',
                    border: '1px solid #D5CABE',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#2E2620',
                    cursor: 'pointer'
                  }}
                >
                  Close Dossier
                </button>
                {dossierModal.shopId && (
                  <Link href={`/shop/${dossierModal.shopId}`} style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        padding: '10px 22px',
                        background: '#1E3A2B',
                        color: '#FAF8F5',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <ShoppingBag size={14} />
                      <span>Shop Certified GI</span>
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── EPILOGUE CTA ──────────────────────────────────────────────────── */}
      <section
        style={{
          background: '#1E3A2B',
          color: '#FAF8F5',
          padding: '64px 24px',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E4BE5B', marginBottom: 12 }}>
            Sovereign Craft & Agricultural Wealth
          </div>
          <h2
            style={{
              fontFamily: "var(--font-playfair), 'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 400,
              margin: '0 0 14px 0'
            }}
          >
            Direct From The Keepers of Bihar’s Soil
          </h2>
          <p style={{ fontSize: 15.5, color: '#C8DDD0', lineHeight: 1.75, margin: '0 0 28px 0' }}>
            Every parcel is dispatched with an origin certificate from registered farmer cooperatives
            and master handloom guilds. No synthetic factory shortcuts. No middlemen margins.
          </p>
          <Link href="/shop" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: '#FAF8F5',
                color: '#1E3A2B',
                padding: '14px 32px',
                borderRadius: 6,
                fontSize: 13.5,
                fontWeight: 800,
                letterSpacing: '0.04em',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FAF8F5'; e.currentTarget.style.transform = 'none'; }}
            >
              <ShoppingBag size={16} />
              <span>Explore All Certified Bihar Treasures</span>
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}