import { Search } from "lucide-react"
import metaHumanImage from "@assets/generated_images/MetaHuman_digital_portrait_91b78393.png"

export function FeaturedSection() {
  const navigationTabs = [
    { name: 'News', active: false },
    { name: 'Events', active: false },
    { name: 'Community', active: true },
    { name: 'Spotlights', active: false },
    { name: 'Tech Blogs', active: false },
    { name: 'Interviews', active: false },
    { name: 'Learning', active: false }
  ]

  return (
    <div className="w-full bg-black text-white">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/90">
        <div className="flex items-center space-x-1">
          {navigationTabs.map((tab) => (
            <button
              key={tab.name}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tab.active 
                  ? 'bg-white text-black' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search by tag..."
            className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative w-full">
        <div className="grid grid-cols-2">
          {/* Left side - Image */}
          <div className="relative aspect-[4/3]">
            <img
              src={metaHumanImage}
              alt="MetaHuman digital portrait"
              className="w-full h-full object-cover"
            />
            
            {/* MetaHuman Logo */}
            <div className="absolute top-8 left-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                    <path d="M30 25 L50 65 L70 25 Z" fill="black" stroke="black" strokeWidth="2"/>
                    <path d="M25 75 L50 35 L75 75 Z" fill="black" stroke="black" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-bold text-2xl tracking-wide">METAHUMAN</div>
                  <div className="text-orange-400 text-base font-medium">for Houdini</div>
                </div>
              </div>
            </div>

            {/* Community Tag */}
            <div className="absolute bottom-8 left-8">
              <span className="px-3 py-1 bg-teal-500 text-white text-sm font-medium rounded">
                Community
              </span>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex flex-col justify-center px-16 py-12 bg-black space-y-6">
            <div className="text-white/70 text-lg">
              August 26, 2025
            </div>
            
            <h1 className="text-5xl font-bold text-white leading-tight">
              MetaHuman for<br />
              Houdini Release
            </h1>
            
            <p className="text-white/80 text-xl leading-relaxed max-w-lg">
              Today we're releasing a new version of MetaHuman for Houdini that 
              enables you to bring your MetaHuman characters to life in SideFX Houdini. 
              Available for download from Fab, this release bridges the gap between 
              Unreal...
            </p>

            <button className="w-fit px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors">
              Read more
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}