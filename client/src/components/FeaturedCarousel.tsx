type FeaturedItem = {
  id: string
  dateISO: string
  tag: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  ctaLabel?: string
  ctaHref?: string
  hasUnrealLogo?: boolean
}

interface FeaturedSectionProps {
  heroItem: FeaturedItem
  gridItems: FeaturedItem[]
}

export function FeaturedSection({ heroItem, gridItems }: FeaturedSectionProps) {
  const formatDate = (dateISO: string) => {
    const date = new Date(dateISO)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="w-full bg-black text-white">
      {/* Hero Card - Single large card matching the image exactly */}
      <div className="relative w-full h-[500px] bg-black">
        <div className="grid grid-cols-2 h-full">
          {/* Left side - Image with overlays */}
          <div className="relative">
            <img
              src={heroItem.imageSrc}
              alt={heroItem.imageAlt}
              className="w-full h-full object-cover"
            />
            
            {/* MetaHuman Logo overlay - top left */}
            <div className="absolute top-8 left-8">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                    <path d="M20 20 L50 80 L80 20 Z" fill="black"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-bold text-2xl tracking-wide">METAHUMAN</div>
                  <div className="text-blue-400 text-base">for Houdini</div>
                </div>
              </div>
            </div>

            {/* Community tag - bottom left */}
            <div className="absolute bottom-8 left-8">
              <span className="px-4 py-2 bg-teal-600/80 text-teal-100 text-sm font-medium rounded">
                Community
              </span>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex flex-col justify-center px-16 py-12 space-y-6">
            <div className="text-white/70 text-lg">
              August 20, 2025
            </div>
            
            <h1 className="text-5xl font-bold text-white leading-tight">
              MetaHuman for<br />
              Houdini Release
            </h1>
            
            <p className="text-white/80 text-xl leading-relaxed">
              Today we're releasing a new version of MetaHuman for Houdini that
              enables you to bring your MetaHuman characters to life in SideEX Houdini.
              Available for download from Fab, this release bridges the gap between
              Unreal...
            </p>

            <button className="w-fit px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-lg transition-colors">
              Read more
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid - Three equal cards */}
      <div className="grid grid-cols-3 gap-0 mt-8">
        {gridItems.map((item, index) => (
          <div key={item.id} className="relative group cursor-pointer bg-black border-r border-gray-800 last:border-r-0">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={item.imageSrc}
                alt={item.imageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Unreal logo for applicable items */}
              {item.hasUnrealLogo && (
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center border border-white/20">
                    <div className="text-white font-bold text-xl">U</div>
                  </div>
                </div>
              )}

              {/* Community tag overlay */}
              <div className="absolute bottom-6 left-6">
                <span className="px-3 py-1 bg-black/80 text-white text-sm font-medium rounded border border-white/30">
                  Community
                </span>
              </div>

              {/* Title overlay for some cards */}
              {(index === 0 || index === 2) && (
                <div className="absolute bottom-6 left-20">
                  <h3 className="text-white text-2xl font-bold tracking-wider">
                    {item.title}
                  </h3>
                </div>
              )}
            </div>
            
            {/* Date at bottom */}
            <div className="p-4 bg-black">
              <div className="text-white/60 text-sm">
                {formatDate(item.dateISO)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}