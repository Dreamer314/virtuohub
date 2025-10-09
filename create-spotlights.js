// Script to create sample spotlight posts
// Run with: node create-spotlights.js <your-auth-token>

const spotlights = [
  {
    subtype: "spotlight",
    title: "Maya Chen - Avatar Fashion Designer Extraordinaire",
    summary: "Creating cutting-edge virtual fashion that's redefining digital identity across platforms",
    body: `Maya Chen has become one of the most influential avatar fashion designers in the virtual world space, with her creations worn by over 500,000 avatars across VRChat, Second Life, and Meta Horizon Worlds.

**Background:**
Starting as a traditional fashion designer, Maya transitioned to virtual worlds in 2020 and quickly made waves with her unique blend of haute couture and digital innovation. Her signature style combines futuristic aesthetics with cultural heritage elements, creating pieces that are both visually stunning and deeply meaningful.

**Notable Achievements:**
• Created the "Neon Dynasty" collection - 200K+ downloads
• Collaborated with major VR events including Virtual Fashion Week
• Featured in Vogue's "Digital Fashion Pioneers" article
• Built a thriving Discord community of 50K+ fashion enthusiasts

**Design Philosophy:**
"In virtual worlds, we're not limited by physics or manufacturing. I create pieces that tell stories, pieces that couldn't exist in the physical world but feel more real than anything you could wear on the street."`,
    tags: ["fashion", "avatar design", "vrchat", "virtual fashion", "metaverse"],
    platforms: ["VRChat", "Second Life", "Meta Horizon Worlds"],
    images: ["https://images.unsplash.com/photo-1558769132-cb1aea1c8347?w=800"]
  },
  {
    subtype: "spotlight",
    title: "Neon Realms Studio - Pushing the Boundaries of Virtual Architecture",
    summary: "An indie studio creating impossible architecture and mind-bending spaces in VR",
    body: `Neon Realms Studio has carved out a unique niche in the virtual world ecosystem by creating environments that challenge our perception of space and reality.

**Studio Overview:**
Founded by a collective of architects and game designers, Neon Realms specializes in creating "impossible architecture" - structures that defy physics and traditional spatial logic. Their worlds have become destinations for virtual tourists seeking mind-expanding experiences.

**Flagship Projects:**
• **Escher's Dream** - A gravity-defying maze world (1.2M visits)
• **The Infinite Gallery** - Ever-changing art exhibition space (800K visits)
• **Quantum Gardens** - Non-Euclidean botanical environment (650K visits)

**Technical Innovation:**
The studio pioneered the use of procedural generation combined with hand-crafted design elements, allowing their worlds to evolve and surprise even repeat visitors. They've open-sourced several Unity tools that have become industry standards.

**Impact:**
"We're not just building pretty spaces," says lead designer Alex Morrison. "We're exploring what human consciousness can experience when freed from physical constraints. Every world is an experiment in perception."`,
    tags: ["architecture", "vr worlds", "unity", "game design", "innovation"],
    platforms: ["VRChat", "Unity"],
    images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800"]
  },
  {
    subtype: "spotlight",
    title: "DJ Synthwave - From Bedroom Producer to Virtual Megastar",
    summary: "Building a music empire one virtual concert at a time",
    body: `DJ Synthwave has transformed the virtual concert scene, hosting events that regularly draw 10,000+ simultaneous attendees across multiple platforms.

**The Journey:**
Starting with small DJ sets in VRChat club worlds in 2021, Synthwave built a loyal following through consistent weekly performances and innovative use of visual effects synchronized to the music. What began as a hobby has evolved into a full-time career with sponsorships, merchandise, and a record deal.

**Performance Stats:**
• 200+ virtual concerts performed
• 10M+ total attendance across all shows
• Average 8,000 concurrent viewers per major event
• Featured artist at Virtual Coachella 2024

**Technical Setup:**
Synthwave pioneered the "immersive audio-visual experience" by creating custom Unity shaders that react to music in real-time. Fans don't just listen - they're surrounded by reactive environments that pulse, flow, and transform with every beat.

**Community Impact:**
"The beautiful thing about virtual concerts is accessibility," Synthwave explains. "Someone in Tokyo, Lagos, and New York can all be in the front row at the same time. We're building a truly global music community."`,
    tags: ["music", "dj", "virtual concerts", "entertainment", "community"],
    platforms: ["VRChat", "Meta Horizon Worlds"],
    images: ["https://images.unsplash.com/photo-1571266028243-d220c11fa714?w=800"]
  },
  {
    subtype: "spotlight",
    title: "CodeCraft Academy - Teaching the Next Generation of Virtual World Builders",
    summary: "Free education platform that has trained over 50,000 creators in Unity, Blender, and VR development",
    body: `CodeCraft Academy has revolutionized virtual world education by making professional-grade training accessible to everyone, regardless of background or budget.

**Mission & Impact:**
Founded by veteran game developers and educators, CodeCraft offers completely free courses in Unity development, 3D modeling with Blender, VRChat world creation, and Roblox game design. Over 50,000 students have completed their programs, with many going on to launch successful careers in the metaverse.

**Program Highlights:**
• **30-Day Unity Mastery** - From zero to first VRChat world
• **Blender for Virtual Worlds** - Character and environment creation
• **Roblox Game Design Bootcamp** - Build and monetize your first game
• **Advanced Shader Programming** - Create stunning visual effects

**Student Success Stories:**
- 15 students have launched worlds with 100K+ visits
- 8 students hired by major VR studios
- Community has created over 2,000 published worlds

**Community Approach:**
"We believe everyone deserves access to world-class education," explains founder Sarah Martinez. "The metaverse is being built right now, and we want to ensure diverse voices are part of that creation process."`,
    tags: ["education", "unity", "blender", "game development", "community"],
    platforms: ["Unity", "VRChat", "Roblox"],
    images: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"]
  },
  {
    subtype: "spotlight",
    title: "Phoenix Rising - How This Creator Rebuilt After Losing Everything",
    summary: "An inspiring story of resilience, creativity, and community support in the virtual world space",
    body: `When veteran creator Marcus "Phoenix" Williams lost his entire portfolio to a hard drive failure, the virtual world community rallied to help him rebuild - and the result was even better than before.

**The Crisis:**
After 5 years of world building, Marcus experienced every creator's nightmare: a catastrophic data loss that wiped out over 200 projects. With no backups and facing financial hardship, his career seemed over.

**The Community Response:**
Within 48 hours of sharing his story, the virtual world community launched a crowdfunding campaign, fellow creators offered pro-bono work, and volunteers organized to help recreate his most popular worlds from screenshots and memory.

**The Comeback:**
What emerged was "Phoenix Worlds" - a collaborative collection that exceeded the original in every way:
• **Ember City 2.0** - Rebuilt with community input (500K visits in first month)
• **Hope's Haven** - A memorial world honoring lost work (300K visits)
• **Creator's Refuge** - A social space for backup education (250K visits)

**Legacy:**
Marcus now runs free weekly workshops on data protection and backup strategies, ensuring no creator faces the same loss. His story became a rallying point for better tools and practices across the industry.

"I lost my work, but I found my purpose," Marcus reflects. "Now I'm dedicated to helping others protect theirs."`,
    tags: ["inspiration", "community", "resilience", "creator support", "world building"],
    platforms: ["VRChat", "Unity", "Second Life"],
    images: ["https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800"]
  }
];

console.log('Spotlight posts to create:');
console.log(JSON.stringify(spotlights, null, 2));
console.log('\nTo create these posts, use the CreatePostModal in the UI while logged in.');
console.log('Or make authenticated POST requests to /api/posts with Bearer token.');
