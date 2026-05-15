/**
 * AstroHub Demo Seed
 * Creates the demo course "Introduction to Astronomy and Space Technology"
 * with 4 modules, 12 lessons, and a 10-question quiz.
 *
 * Run: npm run db:seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌌 Seeding AstroHub demo data...");

  // ─── Demo Author ──────────────────────────────────────────────
  // Upsert a placeholder author (bypasses Firebase auth for seeding)
  const author = await prisma.user.upsert({
    where: { email: "astro@astrohub.space" },
    update: {},
    create: {
      firebaseUid: "seed-author-uid-001",
      email: "astro@astrohub.space",
      firstName: "Dr. Astra",
      lastName: "Nova",
      role: "TEACHER",
      photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    },
  });

  console.log(`✅ Author: ${author.firstName} ${author.lastName}`);

  // ─── Course ───────────────────────────────────────────────────
  const existingCourse = await prisma.course.findFirst({
    where: { title: "Introduction to Astronomy and Space Technology" },
  });

  if (existingCourse) {
    console.log("ℹ️  Demo course already exists, skipping.");
    return;
  }

  const course = await prisma.course.create({
    data: {
      title: "Introduction to Astronomy and Space Technology",
      subtitle: "From the night sky to orbital mechanics — your first step into the cosmos",
      description:
        "This course takes you on a comprehensive journey through the universe. Beginning with foundational concepts of astronomy, you will develop a deep understanding of our solar system, stellar physics, and the cutting-edge technology humanity uses to explore space. Designed for curious minds with no prior background in science, this course applies evidence-based learning techniques — active recall, spaced repetition, and mastery checkpoints — to ensure lasting understanding.",
      imageURL:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
      category: "Astronomy",
      level: "BEGINNER",
      estimatedHours: 14,
      tags: ["astronomy", "space", "physics", "STEM", "beginner"],
      outcomes: [
        "Understand the fundamental principles of astronomy and astrophysics",
        "Describe the structure and scale of our solar system",
        "Explain stellar evolution — from nebulae to black holes",
        "Understand how rockets and satellites work",
        "Apply orbital mechanics concepts to real missions",
        "Critically evaluate news about space exploration",
      ],
      prerequisites: [
        "No prior knowledge required",
        "Basic curiosity about the universe",
        "Willingness to think in large scales",
      ],
      isPublished: true,
      authorId: author.id,
    },
  });

  console.log(`✅ Course: ${course.title}`);

  // ─── Modules ──────────────────────────────────────────────────
  const modules = await Promise.all([
    prisma.courseModule.create({
      data: { courseId: course.id, title: "Foundations of Astronomy", order: 0, description: "Build your mental model of the cosmos from the ground up." },
    }),
    prisma.courseModule.create({
      data: { courseId: course.id, title: "Our Solar System", order: 1, description: "A tour of our cosmic neighbourhood — planets, moons, and more." },
    }),
    prisma.courseModule.create({
      data: { courseId: course.id, title: "Stars and Galaxies", order: 2, description: "From stellar nurseries to the death of stars, and beyond." },
    }),
    prisma.courseModule.create({
      data: { courseId: course.id, title: "Space Technology and Exploration", order: 3, description: "The engineering that allows humanity to reach the stars." },
    }),
  ]);

  console.log(`✅ Created ${modules.length} modules`);

  // ─── Lessons ──────────────────────────────────────────────────

  const lessonData = [
    // Module 0 — Foundations
    {
      moduleIdx: 0,
      order: 0,
      title: "What is Astronomy?",
      duration: 15,
      lessonType: "TEXT" as const,
      summary: "Astronomy is the scientific study of celestial objects, space, and the universe as a whole.",
      content: `<h2>What is Astronomy?</h2>
<p>Astronomy is one of humanity's oldest sciences. Long before written language, our ancestors looked up at the night sky and tried to make sense of the lights above them. Today, astronomy is a rigorous, technology-driven discipline that touches every branch of physics, chemistry, and even biology.</p>

<div class="lesson-callout">
  <strong>Key Insight:</strong> Astronomy is not just stargazing — it is the systematic study of everything beyond Earth's atmosphere: planets, stars, galaxies, black holes, dark matter, and the origin of the universe itself.
</div>

<h3>The Two Branches of Astronomy</h3>
<ul>
  <li><strong>Observational Astronomy</strong> — collecting and analysing data from telescopes and spacecraft</li>
  <li><strong>Theoretical Astronomy</strong> — building mathematical models to explain and predict astronomical phenomena</li>
</ul>

<h3>Why Astronomy Matters</h3>
<p>Every technological tool you use today has roots in space research. GPS satellites rely on Einstein's general relativity. Wi-Fi protocols were refined using algorithms developed for radio telescope data. The CCDs in your phone camera were pioneered for the Hubble Space Telescope.</p>

<p>Beyond technology, astronomy answers the most profound questions humans have ever asked: How old is the universe? Are we alone? How did life arise? Where does everything come from?</p>

<h3>The Scale of the Universe</h3>
<p>One of the first challenges in astronomy is confronting scale. The distance from Earth to the Moon is 384,400 km — roughly 30 Earths placed side by side. The distance to the Sun is 150 million km, or 1 Astronomical Unit (AU). The nearest star, Proxima Centauri, is 4.24 light-years away — meaning light itself, travelling at 300,000 km/s, takes over 4 years to reach us.</p>

<div class="lesson-callout lesson-callout--reflect">
  <strong>Reflect:</strong> If the Milky Way galaxy were the size of a dinner plate, our entire solar system would be smaller than a single atom. How does this change how you think about Earth's significance?
</div>

<h3>Summary</h3>
<ul>
  <li>Astronomy is the scientific study of the universe beyond Earth</li>
  <li>It has two branches: observational and theoretical</li>
  <li>Space research drives real technological advancement</li>
  <li>The scale of the universe is humbling — and that is a feature, not a bug</li>
</ul>`,
    },
    {
      moduleIdx: 0,
      order: 1,
      title: "The Electromagnetic Spectrum",
      duration: 20,
      lessonType: "TEXT" as const,
      summary: "Astronomers observe the universe across all wavelengths of light, not just what the human eye can see.",
      content: `<h2>The Electromagnetic Spectrum</h2>
<p>Visible light is only a tiny slice of the information the universe is constantly broadcasting. Astronomers have learned to read every frequency — from radio waves kilometres wide to gamma rays smaller than an atom's nucleus.</p>

<h3>Why This Matters</h3>
<p>Different physical processes produce different types of radiation. A star's surface temperature determines its colour. Extremely energetic events — like neutron star collisions — produce X-rays and gamma rays. Cold molecular clouds glow in infrared and radio waves. By observing across the full spectrum, we see a far richer universe.</p>

<h3>The Spectrum in Order (low energy → high energy)</h3>
<ul>
  <li><strong>Radio waves</strong> — observe cold hydrogen, map the Milky Way</li>
  <li><strong>Microwaves</strong> — detect the Cosmic Microwave Background (echo of the Big Bang)</li>
  <li><strong>Infrared</strong> — peer through dust clouds to see star-forming regions</li>
  <li><strong>Visible light</strong> — the narrow window our eyes evolved to detect</li>
  <li><strong>Ultraviolet</strong> — reveals hot young stars and active galactic nuclei</li>
  <li><strong>X-rays</strong> — detect black hole accretion discs and supernova remnants</li>
  <li><strong>Gamma rays</strong> — the most energetic events: gamma-ray bursts, pulsars</li>
</ul>

<div class="lesson-callout">
  <strong>Key Formula:</strong> Energy = h × f, where h is Planck's constant (6.626 × 10⁻³⁴ J·s) and f is frequency. Higher frequency = higher energy = shorter wavelength.
</div>

<h3>Telescopes for Each Window</h3>
<p>Earth's atmosphere blocks most wavelengths. This is why we launch space telescopes:</p>
<ul>
  <li><strong>Hubble Space Telescope</strong> — visible, UV, near-infrared</li>
  <li><strong>James Webb Space Telescope (JWST)</strong> — mid-infrared (peers to the earliest galaxies)</li>
  <li><strong>Chandra X-ray Observatory</strong> — X-ray astronomy</li>
  <li><strong>Fermi Gamma-ray Space Telescope</strong> — gamma-ray bursts</li>
</ul>

<h3>Summary</h3>
<ul>
  <li>The electromagnetic spectrum runs from radio to gamma rays</li>
  <li>Each wavelength reveals different astrophysical processes</li>
  <li>Space telescopes are essential for observing non-visible wavelengths</li>
</ul>`,
    },
    {
      moduleIdx: 0,
      order: 2,
      title: "Cosmic Distances and Units",
      duration: 18,
      lessonType: "TEXT" as const,
      summary: "Astronomers use specialised units — AU, light-years, and parsecs — to express the enormous distances in space.",
      content: `<h2>Cosmic Distances and Units</h2>
<p>Standard units like kilometres become impractical when describing cosmic distances. Astronomers use a hierarchy of units calibrated to different scales.</p>

<h3>The Distance Ladder</h3>

<h4>1. Astronomical Unit (AU)</h4>
<p>1 AU = the average distance from Earth to the Sun ≈ 149.6 million km. Used within our solar system. Pluto orbits at ~39.5 AU.</p>

<h4>2. Light-Year (ly)</h4>
<p>The distance light travels in one year ≈ 9.46 trillion km. Used for nearby stars and stellar neighbourhoods. Proxima Centauri = 4.24 ly.</p>

<h4>3. Parsec (pc)</h4>
<p>1 parsec = 3.26 light-years. Defined by parallax measurements. Used for stellar and galactic distances. The Milky Way is ~30,000 pc (30 kpc) in diameter.</p>

<h4>4. Megaparsec (Mpc) and Gigaparsec (Gpc)</h4>
<p>Used for cosmological distances. The Andromeda Galaxy is ~0.78 Mpc away. The observable universe extends ~14,000 Mpc in all directions.</p>

<div class="lesson-callout">
  <strong>Perspective check:</strong> Voyager 1, humanity's most distant spacecraft launched in 1977, has travelled only about 0.002 light-years. The nearest star is 4.24 light-years away. At Voyager's speed, it would take 75,000 years to arrive.
</div>

<h3>How We Measure Distances</h3>
<ul>
  <li><strong>Radar ranging</strong> — bounce radio signals off nearby planets</li>
  <li><strong>Parallax</strong> — measure apparent shift of nearby stars against distant background as Earth orbits</li>
  <li><strong>Standard candles</strong> — use objects of known luminosity (Cepheid variables, Type Ia supernovae)</li>
  <li><strong>Redshift</strong> — for cosmological distances, use Hubble's Law: v = H₀ × d</li>
</ul>

<h3>Summary</h3>
<ul>
  <li>AU = Earth–Sun distance, used within our solar system</li>
  <li>Light-year = distance light travels in one year</li>
  <li>Parsec = 3.26 light-years, preferred by professional astronomers</li>
  <li>Distance measurement builds on a ladder of overlapping techniques</li>
</ul>`,
    },
    // Module 1 — Solar System
    {
      moduleIdx: 1,
      order: 0,
      title: "The Sun: Our Star",
      duration: 22,
      lessonType: "TEXT" as const,
      summary: "The Sun contains 99.86% of the solar system's mass and drives all life on Earth through nuclear fusion.",
      content: `<h2>The Sun: Our Star</h2>
<p>The Sun is a G-type main-sequence star — a yellow dwarf — at the centre of our solar system. Despite being one of billions of stars in the Milky Way, it is the single most important object for life on Earth, providing the energy that drives our climate, weather, and biosphere.</p>

<h3>Basic Properties</h3>
<ul>
  <li><strong>Mass:</strong> 1.989 × 10³⁰ kg (333,000 × Earth's mass)</li>
  <li><strong>Radius:</strong> 696,000 km (109 × Earth's radius)</li>
  <li><strong>Surface temperature:</strong> ~5,778 K (5,505°C)</li>
  <li><strong>Core temperature:</strong> ~15 million K</li>
  <li><strong>Age:</strong> ~4.6 billion years</li>
  <li><strong>Remaining lifespan:</strong> ~5 billion years</li>
</ul>

<h3>Nuclear Fusion: The Engine of the Sun</h3>
<p>The Sun produces energy through proton-proton chain fusion in its core. Four hydrogen nuclei (protons) are fused into one helium nucleus, releasing energy according to Einstein's famous equation:</p>

<div class="lesson-callout lesson-callout--formula">
  <strong>E = mc²</strong><br/>
  The mass difference between 4 protons and 1 helium nucleus is converted into ~26.7 MeV of energy per fusion event. The Sun fuses ~620 million tonnes of hydrogen per second.
</div>

<h3>Layers of the Sun</h3>
<ul>
  <li><strong>Core</strong> — fusion zone, 0–25% of solar radius</li>
  <li><strong>Radiative Zone</strong> — energy travels outward as photons (takes 100,000 years)</li>
  <li><strong>Convective Zone</strong> — hot plasma rises, cools, falls (11-minute convection cells)</li>
  <li><strong>Photosphere</strong> — visible surface, 500 km thick</li>
  <li><strong>Chromosphere</strong> — reddish layer visible during eclipses</li>
  <li><strong>Corona</strong> — the mysterious outer atmosphere (2 million K — hotter than the surface!)</li>
</ul>

<h3>Solar Activity</h3>
<p>The Sun is not a passive object. It ejects plasma at 400–800 km/s as the <strong>solar wind</strong>, which drives Earth's auroras and can disrupt satellites. <strong>Solar flares</strong> and <strong>coronal mass ejections (CMEs)</strong> can knock out power grids if large enough.</p>

<h3>Summary</h3>
<ul>
  <li>The Sun is a G-type main-sequence star, 4.6 billion years old</li>
  <li>Energy comes from hydrogen fusion: E = mc²</li>
  <li>It has distinct layers from the fusion core to the corona</li>
  <li>Solar activity affects technology and life on Earth</li>
</ul>`,
    },
    {
      moduleIdx: 1,
      order: 1,
      title: "Planets: Rocky Worlds and Gas Giants",
      duration: 25,
      lessonType: "TEXT" as const,
      summary: "Our solar system has 8 planets in two major categories: terrestrial (rocky) and Jovian (gas/ice giant).",
      content: `<h2>Planets: Rocky Worlds and Gas Giants</h2>
<p>The eight planets of our solar system fall into two very different families, shaped by their distance from the Sun and the conditions during solar system formation.</p>

<h3>Terrestrial Planets (Rocky Inner Worlds)</h3>
<p>The four inner planets have solid surfaces, high densities, and relatively thin atmospheres.</p>
<ul>
  <li><strong>Mercury</strong> — closest to the Sun, extreme temperature swings (−180°C to 430°C), no atmosphere, heavily cratered</li>
  <li><strong>Venus</strong> — similar size to Earth, runaway greenhouse effect (465°C surface), sulfuric acid clouds</li>
  <li><strong>Earth</strong> — unique: liquid water, plate tectonics, magnetic field, life</li>
  <li><strong>Mars</strong> — thin CO₂ atmosphere, largest volcano (Olympus Mons, 21 km), evidence of ancient liquid water</li>
</ul>

<h3>Gas and Ice Giants (Outer Worlds)</h3>
<p>The four outer planets formed beyond the "frost line" where ices could solidify, growing massive enough to capture hydrogen and helium envelopes.</p>
<ul>
  <li><strong>Jupiter</strong> — 318 × Earth's mass, Great Red Spot (a storm lasting 400+ years), 95 known moons including Ganymede (larger than Mercury)</li>
  <li><strong>Saturn</strong> — spectacular ring system (mostly ice and rock, only 10m thick), density less than water</li>
  <li><strong>Uranus</strong> — rotates on its side (98° axial tilt), ice giant with methane atmosphere (blue-green)</li>
  <li><strong>Neptune</strong> — strongest winds in the solar system (2,100 km/h), dynamic storm systems, Triton orbits backwards (captured KBO)</li>
</ul>

<div class="lesson-callout">
  <strong>The Frost Line:</strong> At ~2.7 AU from the Sun, temperatures drop enough for water ice and other volatiles to condense. This boundary explains why the inner planets are rocky and the outer planets are massive and gas-rich.
</div>

<h3>Moons, Rings, and Dwarf Planets</h3>
<p>Beyond the 8 planets, the solar system is rich with smaller bodies. Pluto was reclassified as a dwarf planet in 2006 when the IAU defined "planet" to require clearing the orbital neighbourhood. The asteroid belt between Mars and Jupiter, and the Kuiper Belt beyond Neptune, contain billions of smaller objects.</p>

<h3>Summary</h3>
<ul>
  <li>Terrestrial planets: Mercury, Venus, Earth, Mars — rocky, dense, solid surface</li>
  <li>Giant planets: Jupiter, Saturn (gas), Uranus, Neptune (ice) — formed beyond the frost line</li>
  <li>Jupiter's mass dominates the outer solar system dynamics</li>
  <li>Moons can be more geologically interesting than their host planets</li>
</ul>`,
    },
    {
      moduleIdx: 1,
      order: 2,
      title: "Moons, Asteroids, and Comets",
      duration: 18,
      lessonType: "TEXT" as const,
      summary: "The solar system is filled with smaller bodies — moons, asteroids, and comets — each preserving clues about our origins.",
      content: `<h2>Moons, Asteroids, and Comets</h2>
<p>While the planets dominate our attention, the solar system's smaller bodies are scientifically invaluable. They are time capsules — preserved remnants from the solar system's formation 4.6 billion years ago.</p>

<h3>Notable Moons</h3>
<ul>
  <li><strong>Europa (Jupiter)</strong> — subsurface ocean beneath ice shell, possibly habitable. Priority target for astrobiology.</li>
  <li><strong>Titan (Saturn)</strong> — thick nitrogen atmosphere, lakes of liquid methane, prebiotic chemistry</li>
  <li><strong>Enceladus (Saturn)</strong> — active geysers ejecting water vapour and organic molecules, subsurface ocean</li>
  <li><strong>Io (Jupiter)</strong> — most volcanically active body in the solar system, tidal heating from Jupiter's gravity</li>
  <li><strong>The Moon (Earth)</strong> — stabilises Earth's axial tilt, creates tides, formed from a giant impact ~4.5 Gya</li>
</ul>

<h3>Asteroids</h3>
<p>Over 1 million known asteroids orbit mostly in the Main Belt between Mars and Jupiter. They are divided by composition:</p>
<ul>
  <li><strong>C-type (carbonaceous)</strong> — most common, dark, primitive composition</li>
  <li><strong>S-type (silicaceous)</strong> — stony, moderate albedo</li>
  <li><strong>M-type (metallic)</strong> — iron-nickel, remnants of differentiated planetesimals</li>
</ul>

<h3>Comets</h3>
<p>Comets are "dirty snowballs" — mixtures of ice, dust, and organic molecules from the outer solar system. When a comet enters the inner solar system, solar radiation sublimates its ices, creating a glowing coma and ion/dust tails that always point away from the Sun.</p>

<div class="lesson-callout">
  <strong>Comets and Life:</strong> Comets and carbonaceous asteroids may have delivered water and organic molecules to early Earth, potentially seeding the conditions for life. This hypothesis is called Panspermia.
</div>

<h3>The Oort Cloud</h3>
<p>Surrounding the solar system at 2,000–100,000 AU is the Oort Cloud — a vast reservoir of ~2 trillion comets. Gravitational perturbations can kick them inward on hyperbolic trajectories toward the inner solar system.</p>

<h3>Summary</h3>
<ul>
  <li>Many moons are candidates for extraterrestrial life (Europa, Enceladus, Titan)</li>
  <li>Asteroids preserve the primitive chemistry of the early solar system</li>
  <li>Comets originate in the Kuiper Belt and Oort Cloud</li>
  <li>Impacts by these bodies have shaped planetary evolution</li>
</ul>`,
    },
    // Module 2 — Stars and Galaxies
    {
      moduleIdx: 2,
      order: 0,
      title: "The Life Cycle of Stars",
      duration: 28,
      lessonType: "TEXT" as const,
      summary: "Stars are born in nebulae, spend billions of years on the main sequence, then die in ways determined by their mass.",
      content: `<h2>The Life Cycle of Stars</h2>
<p>Stars are not eternal. They are born, they live for millions to billions of years, and they die. The mass of a star at birth determines almost everything about its life and death.</p>

<h3>Star Formation</h3>
<p>Stars form inside <strong>molecular clouds</strong> — cold, dense regions of gas and dust that can span hundreds of light-years. Gravity collapses a pocket of gas into a <strong>protostar</strong>. As it contracts, pressure and temperature rise until hydrogen fusion ignites in the core. The star is born.</p>

<h3>The Main Sequence</h3>
<p>A star spends most of its life on the <strong>main sequence</strong>, in hydrostatic equilibrium: gravity trying to collapse it, radiation pressure from fusion pushing outward. This balance can last millions (massive stars) to trillions (red dwarfs) of years.</p>

<div class="lesson-callout lesson-callout--formula">
  <strong>Mass-Luminosity Relation:</strong> L ∝ M³·⁵<br/>
  A star twice as massive as the Sun is ~11× more luminous, but lives only ~1/6 as long. The most massive stars burn brilliantly and die young.
</div>

<h3>Stellar Death by Mass</h3>

<h4>Low to Medium Mass Stars (like the Sun, up to ~8 M☉)</h4>
<ul>
  <li>Exhaust core hydrogen → expand into <strong>Red Giant</strong></li>
  <li>Helium fusion begins → Asymptotic Giant Branch</li>
  <li>Outer layers blown off → <strong>Planetary Nebula</strong> (nothing to do with planets!)</li>
  <li>Core remnant cools as a <strong>White Dwarf</strong> (Earth-sized, no fusion)</li>
</ul>

<h4>High Mass Stars (>8 M☉)</h4>
<ul>
  <li>Fuse heavier elements: C, O, Ne, Mg, Si — up to Iron</li>
  <li>Iron cannot release energy through fusion — core collapse begins</li>
  <li><strong>Core-collapse Supernova</strong> — one of the most energetic events in the universe</li>
  <li>Remnant: <strong>Neutron Star</strong> (city-sized, 2 solar masses) or <strong>Black Hole</strong> (>~3 M☉ remnant)</li>
</ul>

<h3>The Cosmic Significance of Stellar Death</h3>
<p>Supernovae are not just destructive. They synthesise and scatter heavy elements — carbon, oxygen, iron, gold — throughout the galaxy. Every atom of carbon in your body was forged inside a star that died before the Sun was born. Carl Sagan's famous phrase remains literally true: we are <em>starstuff</em>.</p>

<h3>Summary</h3>
<ul>
  <li>Stars form from gravitational collapse of molecular clouds</li>
  <li>Mass determines luminosity, lifespan, and eventual fate</li>
  <li>Low-mass stars → white dwarfs; massive stars → neutron stars or black holes</li>
  <li>Supernovae distribute heavy elements necessary for planets and life</li>
</ul>`,
    },
    {
      moduleIdx: 2,
      order: 1,
      title: "Stellar Classification and the HR Diagram",
      duration: 20,
      lessonType: "TEXT" as const,
      summary: "The Hertzsprung-Russell diagram organises stars by temperature and luminosity, revealing patterns that underpin all stellar physics.",
      content: `<h2>Stellar Classification and the HR Diagram</h2>
<p>In the early 20th century, astronomers Ejnar Hertzsprung and Henry Norris Russell independently discovered that when you plot stars by temperature vs. luminosity, they don't scatter randomly — they form distinct patterns.</p>

<h3>The HR Diagram</h3>
<p>The <strong>Hertzsprung-Russell (HR) Diagram</strong> is the most important graph in astronomy:</p>
<ul>
  <li><strong>X-axis:</strong> Surface temperature (decreasing right to left: O B A F G K M)</li>
  <li><strong>Y-axis:</strong> Luminosity (relative to the Sun)</li>
</ul>

<h3>Spectral Classes (O B A F G K M)</h3>
<p>The mnemonic "Oh Be A Fine Girl/Guy, Kiss Me" helps remember the sequence from hottest (O) to coolest (M):</p>
<ul>
  <li><strong>O</strong> — >30,000 K, blue, massive, rare, short-lived (eg: Mintaka in Orion)</li>
  <li><strong>B</strong> — 10,000–30,000 K, blue-white (eg: Rigel)</li>
  <li><strong>A</strong> — 7,500–10,000 K, white (eg: Sirius, Vega)</li>
  <li><strong>F</strong> — 6,000–7,500 K, yellow-white (eg: Procyon)</li>
  <li><strong>G</strong> — 5,200–6,000 K, yellow (eg: the Sun)</li>
  <li><strong>K</strong> — 3,700–5,200 K, orange (eg: Arcturus)</li>
  <li><strong>M</strong> — <3,700 K, red, most common, dimmest (eg: Proxima Centauri)</li>
</ul>

<h3>Key Regions of the HR Diagram</h3>
<ul>
  <li><strong>Main Sequence</strong> — a diagonal band from top-left to bottom-right; this is where most stars spend most of their lives</li>
  <li><strong>Red Giants / Supergiants</strong> — upper right: cool but enormous, very luminous</li>
  <li><strong>White Dwarfs</strong> — lower left: hot but tiny, very dim</li>
</ul>

<div class="lesson-callout">
  <strong>Luminosity Classes:</strong> The spectral class letter is extended with Roman numerals: V = main sequence, III = giant, I = supergiant, VII = white dwarf. The Sun is G2V. Betelgeuse is M2Ia.
</div>

<h3>Summary</h3>
<ul>
  <li>The HR diagram plots stellar temperature vs. luminosity</li>
  <li>Spectral classes run O (hottest) to M (coolest): O B A F G K M</li>
  <li>Most stars reside on the main sequence during hydrogen-burning phase</li>
  <li>Position on the HR diagram directly encodes a star's evolutionary state</li>
</ul>`,
    },
    {
      moduleIdx: 2,
      order: 2,
      title: "Galaxies and the Milky Way",
      duration: 25,
      lessonType: "TEXT" as const,
      summary: "Galaxies are the fundamental building blocks of the large-scale universe. Our Milky Way is a barred spiral containing 200–400 billion stars.",
      content: `<h2>Galaxies and the Milky Way</h2>
<p>A galaxy is a gravitationally bound system of stars, stellar remnants, gas, dust, and dark matter. The universe contains an estimated 2 trillion galaxies. Our home galaxy, the Milky Way, is a barred spiral galaxy approximately 100,000 light-years in diameter.</p>

<h3>Galaxy Classification</h3>
<p>Edwin Hubble devised the "Tuning Fork" classification system:</p>
<ul>
  <li><strong>Elliptical (E0–E7)</strong> — smooth, featureless, old red stars, little gas, no star formation; E0 (spherical) to E7 (elongated)</li>
  <li><strong>Spiral (Sa–Sc)</strong> — disk with spiral arms of young blue stars and gas clouds; Sa (tightly wound) to Sc (loosely wound)</li>
  <li><strong>Barred Spiral (SBa–SBc)</strong> — like spiral, but with a central bar of stars. Our Milky Way is SBbc.</li>
  <li><strong>Lenticular (S0)</strong> — disk structure but no visible spiral arms; intermediate between elliptical and spiral</li>
  <li><strong>Irregular</strong> — no defined shape, often due to gravitational interactions. The Magellanic Clouds are examples.</li>
</ul>

<h3>Structure of the Milky Way</h3>
<ul>
  <li><strong>Galactic Bulge</strong> — central dense region, contains the supermassive black hole Sagittarius A* (4 million solar masses)</li>
  <li><strong>Disk</strong> — ~100,000 ly diameter, ~1,000 ly thick; contains the spiral arms</li>
  <li><strong>Spiral Arms</strong> — Orion Arm, Perseus Arm, Sagittarius Arm; sites of active star formation</li>
  <li><strong>Stellar Halo</strong> — sphere of old stars and globular clusters surrounding the disk</li>
  <li><strong>Dark Matter Halo</strong> — extends far beyond visible matter, provides most of the galaxy's gravity</li>
</ul>

<div class="lesson-callout">
  <strong>Our location:</strong> The Sun is located about 26,000 light-years from the galactic centre, in the Orion Arm — a minor spiral arm between the Sagittarius and Perseus arms. We orbit the galactic centre at ~220 km/s, completing one orbit (a "galactic year") every ~230 million years.
</div>

<h3>The Local Group and Large-Scale Structure</h3>
<p>Galaxies cluster together. The Milky Way is part of the <strong>Local Group</strong> (~54 galaxies), dominated by the Milky Way and the Andromeda Galaxy (M31). The Local Group is part of the <strong>Virgo Supercluster</strong>, itself part of the <strong>Laniakea Supercluster</strong>. On the largest scales, matter forms a cosmic web of filaments surrounding vast voids.</p>

<h3>Summary</h3>
<ul>
  <li>Galaxies are classified as elliptical, spiral, barred spiral, lenticular, or irregular</li>
  <li>The Milky Way is a barred spiral (SBbc) with 200–400 billion stars</li>
  <li>At its centre lies Sagittarius A*, a 4-million solar mass black hole</li>
  <li>Galaxies cluster into groups, clusters, and superclusters</li>
</ul>`,
    },
    // Module 3 — Space Technology
    {
      moduleIdx: 3,
      order: 0,
      title: "Rockets and Orbital Mechanics",
      duration: 30,
      lessonType: "TEXT" as const,
      summary: "Rockets work by Newton's Third Law. Reaching orbit requires achieving orbital velocity, not just altitude.",
      content: `<h2>Rockets and Orbital Mechanics</h2>
<p>Getting to space requires more than pointing upward. Rockets are arguably the most elegant machines humans have ever built — they carry their own fuel and oxidiser, and accelerate by expelling mass. The physics governing them is elegant and exact.</p>

<h3>How Rockets Work</h3>
<p>A rocket engine burns propellant, creating high-temperature, high-pressure exhaust gases that are expelled at high velocity through a nozzle. By Newton's Third Law — every action has an equal and opposite reaction — the rocket accelerates in the opposite direction.</p>

<h3>The Tsiolkovsky Rocket Equation</h3>
<p>The fundamental equation of rocketry, derived by Konstantin Tsiolkovsky in 1903:</p>

<div class="lesson-callout lesson-callout--formula">
  <strong>Δv = v_e × ln(m₀ / m_f)</strong><br/>
  <ul>
    <li>Δv — change in velocity achievable</li>
    <li>v_e — effective exhaust velocity (specific impulse × g)</li>
    <li>m₀ — initial mass (rocket + propellant)</li>
    <li>m_f — final mass (rocket after propellant burned)</li>
    <li>ln — natural logarithm</li>
  </ul>
  The logarithmic nature of this equation is why rockets are mostly propellant by mass.
</div>

<h3>The Key Insight: Orbit is About Speed, Not Height</h3>
<p>Most people think you need to "go up" to reach orbit. In reality, what matters is horizontal velocity. At 400 km altitude (the ISS), the orbital velocity is ~7.67 km/s (27,600 km/h). At this speed, you fall around Earth just as fast as Earth's surface curves away — you are in perpetual free fall.</p>

<h3>Types of Orbits</h3>
<ul>
  <li><strong>Low Earth Orbit (LEO)</strong> — 160–2,000 km. ISS, Hubble. Fast (~90 min period). Easy to reach.</li>
  <li><strong>Medium Earth Orbit (MEO)</strong> — 2,000–35,786 km. GPS satellites.</li>
  <li><strong>Geostationary Orbit (GEO)</strong> — exactly 35,786 km. Orbital period = 24h, appears stationary. Communications and weather satellites.</li>
  <li><strong>Sun-synchronous Orbit (SSO)</strong> — polar orbit that maintains consistent Sun angle. Earth observation.</li>
  <li><strong>Lagrange Points (L1–L5)</strong> — gravitational equilibrium points in Sun-Earth and Earth-Moon systems. JWST is at L2.</li>
</ul>

<h3>Hohmann Transfer Orbit</h3>
<p>The most fuel-efficient way to transfer between two circular orbits uses an elliptical path called a Hohmann transfer. It requires two engine burns: one to enter the ellipse, one to circularise at the destination. NASA uses this for interplanetary missions.</p>

<h3>Summary</h3>
<ul>
  <li>Rockets work by Newton's Third Law — expelling mass in one direction creates thrust in the other</li>
  <li>The Tsiolkovsky equation governs all rocket performance</li>
  <li>Orbit requires horizontal velocity (~7.9 km/s at Earth's surface), not just altitude</li>
  <li>Different orbits serve different purposes: LEO, GEO, Lagrange points</li>
</ul>`,
    },
    {
      moduleIdx: 3,
      order: 1,
      title: "Satellites and Space Stations",
      duration: 22,
      lessonType: "TEXT" as const,
      summary: "Satellites have transformed daily life. Space stations are long-duration habitats that advance our understanding of humans in space.",
      content: `<h2>Satellites and Space Stations</h2>
<p>Since Sputnik-1 launched in 1957, over 12,000 satellites have been placed in orbit. They are now essential infrastructure for modern civilisation, providing communications, navigation, Earth observation, and scientific research.</p>

<h3>Types of Satellites by Function</h3>
<ul>
  <li><strong>Communications satellites</strong> — relay telephone, television, and internet signals. Most are in GEO. SpaceX Starlink (LEO megaconstellation) is revolutionising broadband access.</li>
  <li><strong>Navigation satellites</strong> — GPS (US), GLONASS (Russia), Galileo (EU), BeiDou (China). Require at least 4 satellites for 3D positioning. Essential for aviation, shipping, mapping, and your phone.</li>
  <li><strong>Earth observation satellites</strong> — monitor weather (GOES, Meteosat), deforestation, agriculture, disaster response, military surveillance.</li>
  <li><strong>Scientific satellites</strong> — Hubble, JWST, Chandra, TESS, Kepler. Observe the universe free of atmospheric distortion.</li>
  <li><strong>Technology demonstration satellites</strong> — test new systems in the real space environment.</li>
</ul>

<h3>Satellite Subsystems</h3>
<p>Every satellite, regardless of mission, requires the same basic systems:</p>
<ul>
  <li><strong>Power</strong> — solar panels + batteries for eclipse periods</li>
  <li><strong>Attitude Control</strong> — reaction wheels, magnetorquers, thrusters to point the satellite</li>
  <li><strong>Communications</strong> — antennas for uplink (commands) and downlink (data)</li>
  <li><strong>Thermal Control</strong> — manage extreme temperature swings (−150°C to +150°C)</li>
  <li><strong>On-board Computer</strong> — process commands, manage health, handle anomalies</li>
  <li><strong>Payload</strong> — the mission-specific instrument (camera, transponder, sensor)</li>
</ul>

<h3>Space Stations</h3>
<p>Space stations are continuously crewed habitats that enable long-duration microgravity research:</p>
<ul>
  <li><strong>International Space Station (ISS)</strong> — 420 tonnes, 109m wide, 408 km altitude. Continuously occupied since November 2000. 20+ nations cooperate. Planned deorbit: ~2030.</li>
  <li><strong>China's Tiangong</strong> — completed in 2022, China's permanent space station.</li>
  <li><strong>Commercial stations (upcoming)</strong> — Axiom Station, Orbital Reef, Starlab — private stations to replace ISS.</li>
</ul>

<div class="lesson-callout">
  <strong>The Overview Effect:</strong> Astronauts who see Earth from space consistently report a profound shift in perspective — seeing the planet as a fragile, borderless oasis. This psychological phenomenon, called the Overview Effect, is being studied for its implications on environmental and political decision-making.
</div>

<h3>Summary</h3>
<ul>
  <li>Satellites are essential to modern life: GPS, internet, weather, banking</li>
  <li>Every satellite has power, attitude, communications, thermal, and payload subsystems</li>
  <li>The ISS is the largest object humans have ever placed in orbit</li>
  <li>Commercial space stations will be the next generation of orbital infrastructure</li>
</ul>`,
    },
    {
      moduleIdx: 3,
      order: 2,
      title: "The Future of Space Exploration",
      duration: 20,
      lessonType: "TEXT" as const,
      summary: "Humanity's near-term future involves returning to the Moon, establishing Mars bases, and detecting signs of extraterrestrial life.",
      content: `<h2>The Future of Space Exploration</h2>
<p>We are living through a second golden age of space exploration. The combination of commercial innovation, international competition, and scientific imperative is driving an acceleration of space activity not seen since the Apollo era.</p>

<h3>Return to the Moon: Artemis Program</h3>
<p>NASA's Artemis program aims to return humans to the Moon — including the first woman and first person of colour — by the late 2020s. The goals are scientific, strategic, and technical:</p>
<ul>
  <li>Explore the lunar south pole (permanent ice deposits in permanently shadowed craters)</li>
  <li>Establish the Lunar Gateway (a small space station in lunar orbit)</li>
  <li>Test technologies and systems needed for Mars missions</li>
  <li>Build sustainable, long-duration human presence on another world</li>
</ul>

<h3>Mars: The Next Giant Leap</h3>
<p>Mars is the next destination for human exploration. Missions like NASA's Perseverance rover (currently operating) and ESA's ExoMars are searching for signs of ancient life. SpaceX's Starship system is designed to carry 100 people to Mars, with the long-term goal of a self-sustaining civilisation.</p>

<div class="lesson-callout">
  <strong>The Mars Challenge:</strong> A crewed Mars mission requires: 6–9 month transit each way, surface stay of ~18 months (waiting for favourable return window), shielding from cosmic radiation, in-situ resource utilisation (ISRU) to produce fuel and oxygen from Mars' atmosphere. Total mission: ~2.5–3 years.
</div>

<h3>The Search for Life: Astrobiology</h3>
<p>Astrobiology is the science of life in the universe. Key targets in our solar system include:</p>
<ul>
  <li><strong>Europa Clipper</strong> (2030) — fly-by mission to characterise Europa's subsurface ocean</li>
  <li><strong>Enceladus Orbilander</strong> (proposed) — land on Enceladus and sample its geysers</li>
  <li><strong>Venus atmospheric probes</strong> — possible microbial life in Venus' temperate cloud layer?</li>
</ul>

<h3>Exoplanet Detection and Characterisation</h3>
<p>JWST is now characterising exoplanet atmospheres. Detecting biosignatures — oxygen, methane, water in unusual combinations — in a distant world's spectrum could be the most significant discovery in human history.</p>

<h3>Space Economy and Commercialisation</h3>
<p>The space economy is projected to exceed $1 trillion by 2040. Key sectors include: satellite internet, space tourism, asteroid mining, in-space manufacturing, and lunar resource extraction. Companies like SpaceX, Blue Origin, Rocket Lab, and Planet Labs are transforming an industry once dominated by government agencies.</p>

<h3>Summary</h3>
<ul>
  <li>Artemis will return humans to the Moon and establish a sustained presence</li>
  <li>Mars missions are the next major human spaceflight goal, targeting the 2030s–2040s</li>
  <li>Astrobiology missions in our solar system may detect life within decades</li>
  <li>The space economy is entering a commercial boom driven by launch cost reduction</li>
</ul>`,
    },
  ];

  let lessonCount = 0;
  for (const l of lessonData) {
    await prisma.lesson.create({
      data: {
        title: l.title,
        content: l.content,
        duration: l.duration,
        lessonType: l.lessonType,
        summary: l.summary,
        order: l.order,
        courseId: course.id,
        moduleId: modules[l.moduleIdx].id,
      },
    });
    lessonCount++;
  }

  console.log(`✅ Created ${lessonCount} lessons`);

  // ─── Quiz ─────────────────────────────────────────────────────
  await prisma.quiz.create({
    data: {
      courseId: course.id,
      title: "Introduction to Astronomy — Knowledge Check",
      description: "Test your understanding of the core concepts from this course. You need 70% to pass.",
      passingScore: 70,
      questions: {
        create: [
          {
            order: 0,
            text: "What is an Astronomical Unit (AU)?",
            explanation: "1 AU is defined as the average distance from Earth to the Sun, approximately 149.6 million km. It is used as a convenient measure within our solar system.",
            points: 1,
            options: [
              { id: "a", text: "The distance from Earth to the nearest star", isCorrect: false },
              { id: "b", text: "The average distance from Earth to the Sun", isCorrect: true },
              { id: "c", text: "The diameter of the Milky Way galaxy", isCorrect: false },
              { id: "d", text: "The distance light travels in one year", isCorrect: false },
            ],
          },
          {
            order: 1,
            text: "What process powers the Sun?",
            explanation: "The Sun generates energy through nuclear fusion — specifically the proton-proton chain — in which hydrogen nuclei (protons) are fused together to form helium, releasing energy via E = mc².",
            points: 1,
            options: [
              { id: "a", text: "Nuclear fission of uranium", isCorrect: false },
              { id: "b", text: "Gravitational contraction", isCorrect: false },
              { id: "c", text: "Nuclear fusion of hydrogen into helium", isCorrect: true },
              { id: "d", text: "Chemical combustion of hydrogen gas", isCorrect: false },
            ],
          },
          {
            order: 2,
            text: "Which of the following is NOT a terrestrial (rocky) planet?",
            explanation: "Jupiter is a gas giant — the largest planet in the solar system, composed primarily of hydrogen and helium. Mercury, Venus, and Mars are all terrestrial (rocky) planets like Earth.",
            points: 1,
            options: [
              { id: "a", text: "Mercury", isCorrect: false },
              { id: "b", text: "Venus", isCorrect: false },
              { id: "c", text: "Jupiter", isCorrect: true },
              { id: "d", text: "Mars", isCorrect: false },
            ],
          },
          {
            order: 3,
            text: "What is the Tsiolkovsky rocket equation used for?",
            explanation: "The Tsiolkovsky equation (Δv = v_e × ln(m₀/m_f)) calculates the maximum change in velocity a rocket can achieve given its exhaust velocity and propellant mass fraction. It is the fundamental performance equation for all rockets.",
            points: 1,
            options: [
              { id: "a", text: "Calculating the orbital period of a satellite", isCorrect: false },
              { id: "b", text: "Determining the surface temperature of stars", isCorrect: false },
              { id: "c", text: "Calculating the maximum velocity change a rocket can achieve", isCorrect: true },
              { id: "d", text: "Measuring the distance between galaxies", isCorrect: false },
            ],
          },
          {
            order: 4,
            text: "What does the Hertzsprung-Russell (HR) diagram plot?",
            explanation: "The HR diagram plots stars by their surface temperature (x-axis, decreasing right to left) against their luminosity or absolute magnitude (y-axis). This reveals distinct patterns like the main sequence, giant branch, and white dwarf region.",
            points: 1,
            options: [
              { id: "a", text: "Star mass vs. star age", isCorrect: false },
              { id: "b", text: "Star temperature vs. star luminosity", isCorrect: true },
              { id: "c", text: "Star distance vs. star colour", isCorrect: false },
              { id: "d", text: "Star radius vs. star rotation speed", isCorrect: false },
            ],
          },
          {
            order: 5,
            text: "What is the Cosmic Microwave Background (CMB)?",
            explanation: "The CMB is thermal radiation left over from an early stage of the universe, about 380,000 years after the Big Bang, when the universe cooled enough for atoms to form and photons to travel freely. It is detected in the microwave range and is nearly uniform across the sky.",
            points: 1,
            options: [
              { id: "a", text: "Radiation emitted by the Sun in the microwave range", isCorrect: false },
              { id: "b", text: "Relic thermal radiation from the early universe (~380,000 years after the Big Bang)", isCorrect: true },
              { id: "c", text: "X-ray radiation from black hole accretion discs", isCorrect: false },
              { id: "d", text: "Radio waves from pulsars", isCorrect: false },
            ],
          },
          {
            order: 6,
            text: "Which moon is considered the highest-priority target in the search for extraterrestrial life?",
            explanation: "Europa, Jupiter's moon, has a global subsurface liquid water ocean beneath its icy crust. It possesses the three ingredients considered necessary for life: liquid water, chemical building blocks, and an energy source (tidal heating from Jupiter's gravity). NASA's Europa Clipper mission will study it in detail.",
            points: 1,
            options: [
              { id: "a", text: "Titan (Saturn)", isCorrect: false },
              { id: "b", text: "The Moon (Earth)", isCorrect: false },
              { id: "c", text: "Phobos (Mars)", isCorrect: false },
              { id: "d", text: "Europa (Jupiter)", isCorrect: true },
            ],
          },
          {
            order: 7,
            text: "What is geostationary orbit (GEO)?",
            explanation: "Geostationary orbit is a circular orbit at 35,786 km altitude above the equator. At this height, a satellite's orbital period exactly matches Earth's rotation period (24 hours), so it appears stationary relative to a point on Earth's surface. This is ideal for communications and weather satellites.",
            points: 1,
            options: [
              { id: "a", text: "An orbit at 400 km used by the ISS", isCorrect: false },
              { id: "b", text: "An orbit at 35,786 km where the satellite appears stationary over Earth", isCorrect: true },
              { id: "c", text: "A polar orbit for Earth observation", isCorrect: false },
              { id: "d", text: "The orbit of the Moon around Earth", isCorrect: false },
            ],
          },
          {
            order: 8,
            text: "What is the fate of a star like our Sun at the end of its life?",
            explanation: "Sun-like stars (0.8–8 solar masses) exhaust their hydrogen fuel, expand into a red giant, expel their outer layers as a planetary nebula, and leave behind a dense, Earth-sized remnant called a white dwarf, which gradually cools over billions of years.",
            points: 1,
            options: [
              { id: "a", text: "Supernova explosion followed by a black hole", isCorrect: false },
              { id: "b", text: "Neutron star", isCorrect: false },
              { id: "c", text: "Planetary nebula + white dwarf", isCorrect: true },
              { id: "d", text: "It continues burning hydrogen forever", isCorrect: false },
            ],
          },
          {
            order: 9,
            text: "What is the primary reason the James Webb Space Telescope (JWST) observes in infrared?",
            explanation: "JWST observes in mid-infrared primarily because: (1) the most distant objects in the universe have their light redshifted into the infrared by cosmic expansion, and (2) infrared can penetrate dust clouds that block visible light, allowing us to see star-forming regions and the centres of galaxies.",
            points: 1,
            options: [
              { id: "a", text: "Infrared is cheaper to detect than visible light", isCorrect: false },
              { id: "b", text: "To see the heat signatures of planets", isCorrect: false },
              { id: "c", text: "To see redshifted light from distant early galaxies and pierce dust clouds", isCorrect: true },
              { id: "d", text: "Visible light telescopes already cover what JWST needs", isCorrect: false },
            ],
          },
        ],
      },
    },
  });

  console.log("✅ Created quiz with 10 questions");
  console.log("\n🚀 Seed complete! The demo course is ready.");
  console.log(`   Course: "${course.title}"`);
  console.log(`   Modules: ${modules.length}`);
  console.log(`   Lessons: ${lessonCount}`);
  console.log(`   Quiz: 10 questions (70% passing score)`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
