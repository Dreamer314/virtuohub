import React from 'react';
import { useParams, Link } from 'wouter';
import { ArrowLeft, ExternalLink, Award, Users, Calendar } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Footer } from '@/components/layout/footer';
import { EngagementSection } from '@/components/engagement-section';

const SpotlightDetailPage: React.FC = () => {
  const { id } = useParams();

  // Predefined spotlight data
  const spotlights = {
    'emma-thompson-vr-artist': {
      name: 'Emma Thompson',
      role: 'VR Environment Artist & World Builder',
      location: 'San Francisco, CA',
      heroImage: 'from-yellow-400 via-orange-500 to-red-500',
      heroIcon: '👤',
      stats: '2M+ world visits • 15K followers • 3 years experience',
      tags: ['VRChat', 'Unity', 'Blender', 'Environment Design'],
      bio: {
        short: 'Emma is a pioneering VR environment artist known for creating atmospheric virtual worlds that have garnered over 2 million visits across VRChat.',
        long: 'Emma Thompson has established herself as one of the most innovative environment artists in the VR space. Her work seamlessly blends photorealistic environments with interactive storytelling elements, creating immersive experiences that transport users to entirely new realities. Specializing in cyberpunk and fantasy themes, Emma uses cutting-edge lighting techniques and particle systems to craft worlds that feel alive and engaging. Her portfolio includes some of VRChat\'s most visited destinations, each designed with meticulous attention to both visual impact and social interaction.'
      },
      experience: [
        {
          title: 'Senior VR Environment Artist',
          company: 'Immersive Studios',
          period: '2022 - Present',
          description: 'Lead artist for premium VR experiences, managing a team of 5 designers.'
        },
        {
          title: 'Freelance World Creator', 
          company: 'VRChat Community',
          period: '2021 - 2022',
          description: 'Created 12 public worlds with over 2M combined visits.'
        },
        {
          title: '3D Artist',
          company: 'GameDev Inc',
          period: '2020 - 2021', 
          description: 'Traditional game environment art before transitioning to VR.'
        }
      ],
      portfolio: [
        {
          title: 'Neon Dreams',
          type: 'Cyberpunk City World',
          visits: '500K+',
          description: 'A sprawling cyberpunk metropolis with interactive neon signs, flying vehicles, and multi-level exploration.',
          features: ['Dynamic weather', 'Interactive NPCs', 'Custom shaders', 'Photo spots']
        },
        {
          title: 'Mystic Forest Temple', 
          type: 'Fantasy Environment',
          visits: '800K+',
          description: 'An enchanted forest sanctuary with ancient ruins, magical particle effects, and hidden secrets.',
          features: ['Particle systems', 'Environmental storytelling', 'Hidden areas', 'Ambient audio']
        },
        {
          title: 'Underground Club Scene',
          type: 'Social Hub',
          visits: '400K+',
          description: 'An underground venue designed for events and social gatherings with dynamic lighting systems.',
          features: ['Event hosting', 'Custom lighting', 'Performance optimization', 'DJ booth']
        }
      ],
      achievements: [
        'VRChat Creator of the Year 2023',
        'Unity Showcase Featured Artist',
        'Speaker at VR Developer Conference 2024',
        'Mentor in VRChat Creator Program'
      ],
      socialLinks: [
        { platform: 'VRChat', handle: '@EmmaThompsonVR' },
        { platform: 'Twitter', handle: '@VR_Emma_Art' },
        { platform: 'Discord', handle: 'Emma#1337' }
      ],
      likes: 324,
      comments: [
        {
          id: '1',
          author: 'Alex Rivera',
          content: 'Emma\'s Neon Dreams world is absolutely stunning! The lighting work is incredible.',
          timestamp: '1 hour ago',
          likes: 15
        },
        {
          id: '2',
          author: 'Sam Chen', 
          content: 'Been following her work for years. True pioneer in VR environment design!',
          timestamp: '3 hours ago',
          likes: 22
        },
        {
          id: '3',
          author: 'CreativeDev_Maya',
          content: 'The Mystic Forest Temple inspired me to start learning Unity. Thank you for the inspiration!',
          timestamp: '5 hours ago',
          likes: 18
        }
      ]
    },
    'pixelcraft-studios': {
      name: 'PixelCraft Studios',
      role: 'Independent Game Studio',
      location: 'Remote Team',
      heroImage: 'from-blue-500 to-purple-600',
      heroIcon: '🏢',
      stats: '10M+ total plays • 25+ games • 4 years in business',
      tags: ['Roblox', 'Game Design', 'Studio Management', 'Independent'],
      bio: {
        short: 'Independent game studio creating immersive Roblox experiences with over 10M total plays.',
        long: 'PixelCraft Studios is a pioneering independent game development studio that has carved out a significant niche in the Roblox ecosystem. Founded four years ago by a team of passionate developers, the studio has consistently delivered high-quality, engaging experiences that have collectively garnered over 10 million plays. Their approach combines innovative gameplay mechanics with stunning visual design, creating worlds that captivate players and build lasting communities. The studio is known for their meticulous attention to detail, player-centric design philosophy, and commitment to pushing the boundaries of what\'s possible within the Roblox platform.'
      },
      experience: [
        {
          title: 'Independent Game Studio',
          company: 'PixelCraft Studios',
          period: '2020 - Present',
          description: 'Founded and operating successful game development studio specializing in Roblox experiences.'
        },
        {
          title: 'Senior Game Developer',
          company: 'Various Projects',
          period: '2018 - 2020',
          description: 'Freelance game development across multiple platforms before founding PixelCraft.'
        }
      ],
      portfolio: [
        {
          title: 'Neon Racing Championship',
          type: 'Racing Game',
          visits: '4.2M+',
          description: 'High-speed racing game with customizable vehicles, multiple tracks, and competitive tournaments.',
          features: ['Vehicle customization', 'Tournament system', 'Leaderboards', 'Daily challenges']
        },
        {
          title: 'Mystery Mansion Detective',
          type: 'Adventure/Puzzle',
          visits: '3.8M+',
          description: 'Interactive mystery adventure where players solve crimes and uncover secrets in a haunted mansion.',
          features: ['Story-driven gameplay', 'Puzzle mechanics', 'Multiplayer cooperation', 'Branching narratives']
        },
        {
          title: 'Sky Castle Builders',
          type: 'Building/Creative',
          visits: '2M+',
          description: 'Creative building game allowing players to construct floating castles with unique physics mechanics.',
          features: ['Advanced building system', 'Physics simulation', 'Social building', 'Gallery sharing']
        }
      ],
      achievements: [
        'Roblox Developer Conference Speaker 2023',
        'Featured on Roblox Front Page 12 times',
        'DevAward Winner - Best Multiplayer Experience 2022',
        'Community Choice Award - Most Innovative Game 2021'
      ],
      socialLinks: [
        { platform: 'Roblox', handle: '@PixelCraftStudios' },
        { platform: 'Twitter', handle: '@PixelCraft_Dev' },
        { platform: 'Discord', handle: 'PixelCraft Community Server' }
      ],
      likes: 178,
      comments: [
        {
          id: '1',
          author: 'GameDev_Enthusiast',
          content: 'PixelCraft\'s attention to detail is incredible. Their games always feel polished and fun to play!',
          timestamp: '2 hours ago',
          likes: 12
        },
        {
          id: '2',
          author: 'RobloxPlayer_2024',
          content: 'Neon Racing Championship is my favorite game on the platform. The tournament system is amazing!',
          timestamp: '4 hours ago',
          likes: 8
        }
      ]
    },
    'virtualforge-ai-tool': {
      name: 'VirtualForge',
      role: 'AI-Powered World Generation Tool',
      location: 'San Francisco, CA',
      heroImage: 'from-green-500 to-teal-600',
      heroIcon: '🛠️',
      stats: '50K+ worlds created • 15K+ active users • 2 years in market',
      tags: ['AI Tools', 'Unity', 'World Generation', 'Automation'],
      bio: {
        short: 'AI-powered world generation tool helping creators build immersive environments 10x faster.',
        long: 'VirtualForge represents a revolutionary leap in world creation technology, leveraging advanced AI algorithms to dramatically accelerate the development of immersive virtual environments. Developed by a team of industry veterans and AI specialists, VirtualForge has transformed how creators approach world building by automating complex tasks while preserving creative control. The tool integrates seamlessly with Unity and other popular development platforms, offering intelligent terrain generation, automated lighting setups, and procedural asset placement that would traditionally take weeks to accomplish manually. Since launching two years ago, VirtualForge has empowered over 15,000 creators to bring their visions to life, resulting in more than 50,000 unique worlds across various platforms.'
      },
      experience: [
        {
          title: 'AI World Generation Platform',
          company: 'VirtualForge Technologies',
          period: '2022 - Present',
          description: 'Leading AI-powered tool for accelerated virtual world creation and development.'
        },
        {
          title: 'Research & Development',
          company: 'VirtualForge Labs',
          period: '2020 - 2022',
          description: 'Two years of intensive R&D developing breakthrough AI algorithms for world generation.'
        }
      ],
      portfolio: [
        {
          title: 'Terrain Generation AI',
          type: 'Core Feature',
          visits: 'Used in 30K+ worlds',
          description: 'Advanced terrain generation using machine learning to create realistic landscapes and environments.',
          features: ['Heightmap generation', 'Biome blending', 'Erosion simulation', 'Custom parameters']
        },
        {
          title: 'Smart Lighting System',
          type: 'Automation Tool',
          visits: 'Used in 25K+ worlds',
          description: 'AI-driven lighting setup that automatically optimizes illumination for any environment type.',
          features: ['Automatic light placement', 'Dynamic shadows', 'Mood presets', 'Performance optimization']
        },
        {
          title: 'Asset Placement Engine',
          type: 'AI Assistant',
          visits: 'Used in 20K+ worlds',
          description: 'Intelligent system that places environmental assets naturally and realistically throughout worlds.',
          features: ['Procedural placement', 'Density control', 'Style matching', 'Collision avoidance']
        }
      ],
      achievements: [
        'Unity Asset Store - Editor\'s Choice 2023',
        'AI Innovation Award - GDC 2023',
        'Best Developer Tool - VR Awards 2022',
        '5-Star Rating with 2,000+ Reviews'
      ],
      socialLinks: [
        { platform: 'Website', handle: 'virtualforge.ai' },
        { platform: 'Twitter', handle: '@VirtualForgeAI' },
        { platform: 'Discord', handle: 'VirtualForge Community' }
      ],
      likes: 203,
      comments: [
        {
          id: '1',
          author: 'UnityDeveloper_Pro',
          content: 'VirtualForge has saved me hundreds of hours of work. The AI terrain generation is mind-blowing!',
          timestamp: '1 hour ago',
          likes: 15
        },
        {
          id: '2',
          author: 'WorldBuilder_Sarah',
          content: 'As someone who struggled with lighting, the smart lighting system is a game-changer. Perfect results every time.',
          timestamp: '3 hours ago',
          likes: 11
        }
      ]
    }
  };

  const spotlight = spotlights[id as keyof typeof spotlights];

  if (!spotlight) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Spotlight not found</h1>
          <Link href="/spotlights" className="text-yellow-500 hover:underline">
            ← Back to Spotlights
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header onCreatePost={() => {}} />
      
      <div className="community-grid">
        <div className="grid-left hidden xl:block bg-background/95 backdrop-blur-sm border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <LeftSidebar currentTab="all" onTabChange={() => {}} />
          </div>
        </div>
        
        <div className="grid-right hidden lg:block bg-background/95 backdrop-blur-sm border-l border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <RightSidebar />
          </div>
        </div>

        <div className="grid-main relative z-0">
          <div className="py-8 relative z-10 px-4 lg:px-8">
            <div className="w-full">
              <div className="max-w-4xl mx-auto">
                
                {/* Back Navigation */}
                <Link href="/spotlights" className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors mb-8 group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Spotlights
                </Link>

                {/* Profile Header */}
                <article className="glass-card rounded-xl overflow-hidden border border-yellow-500/30 mb-8">
                  <div className={`w-full h-80 bg-gradient-to-br ${spotlight.heroImage} relative flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="relative z-10 text-center px-8">
                      <span className="text-6xl mb-4 block">{spotlight.heroIcon}</span>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-500/30 text-yellow-200 border border-yellow-400/30 rounded-full mb-4">Creator Spotlight</span>
                      <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                        {spotlight.name}
                      </h1>
                      <p className="text-yellow-200 text-xl mb-2">{spotlight.role}</p>
                      <p className="text-white/80 text-lg">{spotlight.stats}</p>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    {/* Basic Info */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>Based in {spotlight.location}</span>
                      </div>
                      
                      <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                        {spotlight.bio.long}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {spotlight.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                        <Award className="w-6 h-6 text-yellow-500" />
                        Experience
                      </h3>
                      <div className="space-y-6">
                        {spotlight.experience.map((exp, index) => (
                          <div key={index} className="border-l-2 border-yellow-500/30 pl-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
                              <h4 className="text-lg font-semibold text-foreground">{exp.title}</h4>
                              <span className="text-sm text-muted-foreground">{exp.period}</span>
                            </div>
                            <p className="text-yellow-400 mb-2">{exp.company}</p>
                            <p className="text-muted-foreground">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Portfolio */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold text-foreground mb-6">Portfolio Highlights</h3>
                      <div className="grid gap-6">
                        {spotlight.portfolio.map((item, index) => (
                          <div key={index} className="glass-card rounded-lg p-6 border border-sidebar-border">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                              <div>
                                <h4 className="text-xl font-semibold text-foreground mb-1">{item.title}</h4>
                                <p className="text-yellow-400 mb-2">{item.type}</p>
                                <p className="text-muted-foreground mb-4">{item.description}</p>
                              </div>
                              <div className="text-right lg:ml-4">
                                <div className="text-2xl font-bold text-yellow-500">{item.visits}</div>
                                <div className="text-sm text-muted-foreground">visits</div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {item.features.map((feature, idx) => (
                                <span key={idx} className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded text-xs">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold text-foreground mb-6">Achievements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {spotlight.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                            <Award className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                            <span className="text-muted-foreground">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold text-foreground mb-6">Connect</h3>
                      <div className="flex flex-wrap gap-4">
                        {spotlight.socialLinks.map((link, index) => (
                          <div key={index} className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg border border-sidebar-border">
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{link.platform}:</span>
                            <span className="text-sm text-foreground font-medium">{link.handle}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Engagement Section */}
                    <EngagementSection 
                      contentId={`spotlight-${id}`}
                      contentType="spotlight"
                      initialLikes={spotlight.likes}
                      initialComments={spotlight.comments}
                    />
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SpotlightDetailPage;