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
    <section className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Hero Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl">
        <div className="grid md:grid-cols-2 items-center min-h-[400px]">
          {/* Hero Image */}
          <div className="relative h-full">
            <img
              src={heroItem.imageSrc}
              alt={heroItem.imageAlt}
              className="w-full h-full object-cover"
            />
            {/* Logo overlay */}
            <div className="absolute top-8 left-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <div className="text-black font-bold text-lg">M</div>
                </div>
                <div>
                  <div className="text-white font-bold text-xl">METAHUMAN</div>
                  <div className="text-blue-400 text-sm">for Houdini</div>
                </div>
              </div>
            </div>
            {/* Tag */}
            <div className="absolute bottom-8 left-8">
              <span className="px-3 py-1 bg-teal-500/20 text-teal-400 text-sm rounded-full border border-teal-500/30">
                {heroItem.tag}
              </span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="p-12 space-y-6">
            <div className="text-white/70 text-sm">
              {formatDate(heroItem.dateISO)}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {heroItem.title}
            </h2>
            
            <p className="text-white/80 text-lg leading-relaxed">
              {heroItem.description}
            </p>

            {heroItem.ctaLabel && (
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                {heroItem.ctaLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {gridItems.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="relative rounded-xl overflow-hidden bg-slate-900 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-video relative">
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Unreal logo overlay for Unreal items */}
                {item.title.includes('Unreal') && (
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                      <div className="text-white font-bold text-sm">U</div>
                    </div>
                  </div>
                )}
                {/* Tag */}
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 bg-black/60 text-white text-xs rounded border border-white/20">
                    {item.tag}
                  </span>
                </div>
              </div>
              
              <div className="p-4 space-y-2">
                <div className="text-white/60 text-xs">
                  {formatDate(item.dateISO)}
                </div>
                <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}