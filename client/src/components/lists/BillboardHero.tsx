import React, { useState } from 'react';
import { type BillboardTab } from '@/types/lists';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlatformPill } from '@/components/pills/PlatformPill';
import { VoiceBadge } from '@/components/common/VoiceBadge';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { HelpCircle, TrendingUp, Clock } from 'lucide-react';

interface BillboardHeroProps {
  tabs: BillboardTab[];
  onMethodologyClick?: () => void;
  onSuggestUpdate?: () => void;
}

export const BillboardHero: React.FC<BillboardHeroProps> = ({ 
  tabs, 
  onMethodologyClick,
  onSuggestUpdate 
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const formatMetricValue = (value: number, label?: string): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <div className="relative mb-8">
      {/* Hero Background */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,100,255,0.1),transparent_50%)]" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-primary mr-3" />
                <h1 className="text-4xl font-bold text-foreground tracking-tight">
                  VirtuoHub Charts
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real-time rankings of the most influential creators, assets, and studios in the virtual economy
              </p>
              
              {/* Meta Info */}
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: 2 hours ago</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onMethodologyClick}
                  className="flex items-center gap-1 hover:text-primary"
                  data-testid="methodology-button"
                >
                  <HelpCircle className="w-4 h-4" />
                  Methodology
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onSuggestUpdate}
                  className="hover:text-primary"
                  data-testid="suggest-update-button"
                >
                  Suggest Update
                </Button>
              </div>
            </div>

            {/* Billboard Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="text-sm font-medium"
                    data-testid={`billboard-tab-${tab.id}`}
                  >
                    {tab.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <div className="bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 bg-muted/20 border-b border-border/30 text-sm font-medium text-muted-foreground">
                      <div className="col-span-1">#</div>
                      <div className="col-span-6 lg:col-span-5">Name</div>
                      <div className="col-span-3 lg:col-span-2">Platform</div>
                      <div className="col-span-2 lg:col-span-2">Metric</div>
                      <div className="hidden lg:block lg:col-span-2">Badges</div>
                    </div>
                    
                    {/* Rankings */}
                    <div className="divide-y divide-border/20">
                      {tab.data.slice(0, 10).map((item, index) => (
                        <div 
                          key={item.id} 
                          className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/10 transition-colors group"
                          data-testid={`billboard-item-${item.id}`}
                        >
                          {/* Rank */}
                          <div className="col-span-1 flex items-center">
                            <span className={`text-lg font-bold ${
                              index === 0 ? 'text-amber-500' :
                              index === 1 ? 'text-gray-400' :
                              index === 2 ? 'text-amber-600' :
                              'text-muted-foreground'
                            }`}>
                              {item.rank || index + 1}
                            </span>
                          </div>
                          
                          {/* Name & Avatar */}
                          <div className="col-span-6 lg:col-span-5 flex items-center gap-3">
                            {item.imageUrl && (
                              <OptimizedImage 
                                src={item.imageUrl} 
                                alt={item.title}
                                width="32px"
                                height="32px"
                                aspectRatio="square"
                                loading="lazy"
                                className="w-8 h-8 rounded-full object-cover border border-border/50"
                                data-testid={`billboard-avatar-${item.id}`}
                              />
                            )}
                            <div className="min-w-0">
                              <div className="font-medium text-foreground truncate">
                                {item.title}
                              </div>
                              {item.summary && (
                                <div className="text-sm text-muted-foreground truncate">
                                  {item.summary}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Platforms */}
                          <div className="col-span-3 lg:col-span-2 flex flex-wrap gap-1">
                            {item.platforms.slice(0, 2).map((platform) => (
                              <PlatformPill key={platform} platform={platform} size="sm" />
                            ))}
                            {item.platforms.length > 2 && (
                              <Badge variant="outline" className="text-xs px-2 py-1">
                                +{item.platforms.length - 2}
                              </Badge>
                            )}
                          </div>
                          
                          {/* Metric */}
                          <div className="col-span-2 lg:col-span-2 flex items-center">
                            <div className="text-right">
                              <div className="font-semibold text-foreground">
                                {formatMetricValue(item.metricValue || 0, item.metricLabel)}
                              </div>
                              {item.metricLabel && (
                                <div className="text-xs text-muted-foreground">
                                  {item.metricLabel}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Badges - Hidden on mobile */}
                          <div className="hidden lg:flex lg:col-span-2 items-center gap-1">
                            {Math.random() > 0.6 && <VoiceBadge voice="VHub Picks" size="sm" />}
                            {Math.random() > 0.7 && <VoiceBadge voice="User Choice" size="sm" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};