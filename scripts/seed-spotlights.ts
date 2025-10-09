import { supabaseAdmin } from "../server/supabaseClient";

const spotlights = [
  {
    title: "Maya Chen - Avatar Fashion Designer Extraordinaire",
    summary: "Creating cutting-edge virtual fashion that's redefining digital identity across platforms",
    body: `Maya Chen has become one of the most influential avatar fashion designers in the virtual world space, with her creations worn by over 500,000 avatars across VRChat, Second Life, and Meta Horizon Worlds.

**Background:**
Starting as a traditional fashion designer, Maya transitioned to virtual worlds in 2020 and quickly made waves with her unique blend of haute couture and digital innovation. Her signature style combines futuristic aesthetics with cultural heritage elements.

**Notable Achievements:**
• Created the "Neon Dynasty" collection - 200K+ downloads
• Collaborated with major VR events including Virtual Fashion Week
• Featured in Vogue's "Digital Fashion Pioneers" article
• Built a thriving Discord community of 50K+ fashion enthusiasts`,
    tags: ["fashion", "avatar design", "vrchat"],
    platforms: ["VRChat", "Second Life", "Meta Horizon Worlds"],
    images: ["https://images.unsplash.com/photo-1558769132-cb1aea1c8347?w=800"]
  },
  {
    title: "DJ Synthwave - From Bedroom Producer to Virtual Megastar",
    summary: "Building a music empire one virtual concert at a time",
    body: `DJ Synthwave has transformed the virtual concert scene, hosting events that regularly draw 10,000+ simultaneous attendees across multiple platforms.

**The Journey:**
Starting with small DJ sets in VRChat club worlds in 2021, Synthwave built a loyal following through consistent weekly performances and innovative use of visual effects synchronized to the music.

**Performance Stats:**
• 200+ virtual concerts performed
• 10M+ total attendance across all shows
• Featured artist at Virtual Coachella 2024`,
    tags: ["music", "dj", "virtual concerts"],
    platforms: ["VRChat", "Meta Horizon Worlds"],
    images: ["https://images.unsplash.com/photo-1571266028243-d220c11fa714?w=800"]
  },
  {
    title: "Neon Realms Studio - Pushing the Boundaries of Virtual Architecture",
    summary: "An indie studio creating impossible architecture and mind-bending spaces in VR",
    body: `Neon Realms Studio has carved out a unique niche by creating environments that challenge our perception of space and reality.

**Flagship Projects:**
• **Escher's Dream** - A gravity-defying maze world (1.2M visits)
• **The Infinite Gallery** - Ever-changing art exhibition space (800K visits)
• **Quantum Gardens** - Non-Euclidean botanical environment (650K visits)`,
    tags: ["architecture", "vr worlds", "unity"],
    platforms: ["VRChat", "Unity"],
    images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800"]
  },
  {
    title: "CodeCraft Academy - Teaching Virtual World Builders",
    summary: "Free education platform that has trained over 50,000 creators",
    body: `CodeCraft Academy has revolutionized virtual world education by making professional-grade training accessible to everyone.

**Program Highlights:**
• 30-Day Unity Mastery - From zero to first VRChat world
• Blender for Virtual Worlds - Character and environment creation
• Roblox Game Design Bootcamp - Build and monetize your first game`,
    tags: ["education", "unity", "blender"],
    platforms: ["Unity", "VRChat", "Roblox"],
    images: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"]
  },
  {
    title: "Phoenix Rising - Rebuilt After Losing Everything",
    summary: "An inspiring story of resilience and community support",
    body: `When veteran creator Marcus "Phoenix" Williams lost his entire portfolio to a hard drive failure, the virtual world community rallied to help him rebuild.

**The Comeback:**
• **Ember City 2.0** - Rebuilt with community input (500K visits)
• **Hope's Haven** - A memorial world (300K visits)
• **Creator's Refuge** - A social space for backup education (250K visits)`,
    tags: ["inspiration", "community", "resilience"],
    platforms: ["VRChat", "Unity", "Second Life"],
    images: ["https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800"]
  }
];

async function seedSpotlights() {
  console.log('🌟 Creating spotlight posts...\n');

  // Get the first user to use as author
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .limit(1)
    .single();

  if (!profile) {
    console.error('❌ No profiles found in database');
    return;
  }

  const authorId = profile.id;
  console.log(`Using author ID: ${authorId}\n`);

  // Check existing posts table schema
  const { data: existingPost } = await supabaseAdmin
    .from('posts')
    .select('*')
    .limit(1)
    .single();
  
  if (existingPost) {
    console.log('Existing post columns:', Object.keys(existingPost));
  }

  for (const spotlight of spotlights) {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert({
        author_id: authorId,
        subtype: 'spotlight',
        title: spotlight.title,
        body: spotlight.body,
        content: spotlight.body,
        category: spotlight.tags[0] || 'general',
        platform_tags: spotlight.platforms,
        image_urls: spotlight.images,
        is_public: true
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ Failed to create: ${spotlight.title}`);
      console.error(error);
    } else {
      console.log(`✅ Created: ${spotlight.title}`);
    }
  }

  console.log('\n🎉 Done! Visit /spotlights to see them.');
}

seedSpotlights().catch(console.error);
