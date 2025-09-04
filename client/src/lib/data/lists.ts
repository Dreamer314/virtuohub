import { type FullList, type ListMeta, type ListFilters, type BillboardTab, type UserVote, type Platform } from '@/types/lists';
import listsData from '@/data/lists.seed.json';

class ListsAPI {
  private lists: FullList[] = [];
  private votes: UserVote[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    this.lists = listsData.lists as FullList[];
  }

  async getLists(filters: ListFilters = {}): Promise<{ lists: ListMeta[]; total: number }> {
    let filtered = [...this.lists];

    // Hide Studios content until feature is live
    filtered = filtered.filter(list => 
      !list.title.toLowerCase().includes('studio') && 
      !list.summary?.toLowerCase().includes('studio')
    );

    // Apply filters
    if (filters.type) {
      filtered = filtered.filter(list => list.type === filters.type);
    }

    if (filters.voices && filters.voices.length > 0) {
      filtered = filtered.filter(list => 
        filters.voices!.some(voice => list.voices.includes(voice))
      );
    }

    if (filters.platforms && filters.platforms.length > 0) {
      filtered = filtered.filter(list => 
        filters.platforms!.some(platform => list.platforms.includes(platform))
      );
    }

    // Apply sorting
    switch (filters.sort) {
      case 'viewed':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'rated':
        // Mock rating sort - in real implementation would use actual ratings
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }

    // Apply pagination
    const limit = filters.limit || 20;
    const page = filters.page || 1;
    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedLists = filtered.slice(start, end);

    // Convert to ListMeta (exclude items)
    const listMetas: ListMeta[] = paginatedLists.map(({ items, methodology, ...meta }) => meta);

    return {
      lists: listMetas,
      total: filtered.length
    };
  }

  async getListBySlug(slug: string): Promise<FullList | null> {
    const list = this.lists.find(l => l.slug === slug);
    return list || null;
  }

  async incrementViews(slug: string): Promise<void> {
    const list = this.lists.find(l => l.slug === slug);
    if (list) {
      list.views += 1;
    }
  }

  async submitUserVote(listId: string, itemId: string, userId: string = 'anonymous'): Promise<void> {
    const vote: UserVote = {
      listId,
      itemId,
      userId,
      createdAt: new Date().toISOString()
    };
    this.votes.push(vote);
  }

  async getBillboardData(): Promise<BillboardTab[]> {
    const { billboardData } = listsData as any;
    
    return [
      {
        id: 'top-creators',
        title: 'Top Creators',
        data: billboardData.topCreators || []
      },
      {
        id: 'most-downloaded',
        title: 'Most Downloaded Assets',
        data: billboardData.topAssets || []
      },
      {
        id: 'fastest-growing',
        title: 'Fastest Growing Studios',
        data: billboardData.fastestGrowingStudios || []
      },
      {
        id: 'top-platforms',
        title: 'Top Platforms to Earn In',
        data: billboardData.topPlatforms || []
      }
    ];
  }

  async getRelatedLists(currentListId: string, limit: number = 4): Promise<ListMeta[]> {
    const currentList = this.lists.find(l => l.id === currentListId);
    if (!currentList) return [];

    // Find lists with similar platforms or types
    const related = this.lists
      .filter(l => l.id !== currentListId)
      .filter(l => 
        l.type === currentList.type || 
        l.platforms.some(p => currentList.platforms.includes(p))
      )
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    return related.map(({ items, methodology, ...meta }) => meta);
  }
}

export const listsAPI = new ListsAPI();

// Export individual functions for easy consumption
export const getLists = (filters?: ListFilters) => listsAPI.getLists(filters);
export const getListBySlug = (slug: string) => listsAPI.getListBySlug(slug);
export const incrementViews = (slug: string) => listsAPI.incrementViews(slug);
export const submitUserVote = (listId: string, itemId: string, userId?: string) => 
  listsAPI.submitUserVote(listId, itemId, userId);
export const getBillboardData = () => listsAPI.getBillboardData();
export const getRelatedLists = (currentListId: string, limit?: number) => 
  listsAPI.getRelatedLists(currentListId, limit);

// Platform utilities
export const getPlatformColor = (platform: Platform): string => {
  const colors: Record<Platform, string> = {
    'Roblox': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'VRChat': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Second Life': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'IMVU': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'Horizon Worlds': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    'Sims': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'GTA RP': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Unity': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    'Unreal': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'InZoi': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    'Cross-Platform': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200'
  };
  return colors[platform] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};