import { MCPIntegration } from './mcp-integration.js';

export class YouTubeCollector {
  constructor() {
    this.channelCache = new Map();
    this.videoCache = new Map();
    this.mcpIntegration = new MCPIntegration();
  }

  async getChannelMetrics(channelId) {
    try {
      const stats = await this.getChannelStatistics([channelId]);
      const topVideos = await this.getChannelTopVideos(channelId, 20);
      
      return {
        channelId,
        statistics: stats[0] || null,
        topVideos: topVideos || [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error collecting channel metrics for ${channelId}:`, error);
      throw error;
    }
  }

  async getChannelStatistics(channelIds) {
    return await this.mcpIntegration.getChannelStatistics(channelIds);
  }

  async getChannelTopVideos(channelId, maxResults = 10) {
    return await this.mcpIntegration.getChannelTopVideos(channelId, maxResults);
  }

  async searchVideos(query, maxResults = 10) {
    return await this.mcpIntegration.searchVideos(query, maxResults);
  }

  async getTrendingVideos(categoryId = null, maxResults = 10) {
    return await this.mcpIntegration.getTrendingVideos(categoryId, maxResults);
  }

  async getVideoDetails(videoIds) {
    return new Promise((resolve) => {
      if (typeof mcp__youtube__getVideoDetails === 'function') {
        mcp__youtube__getVideoDetails({
          videoIds,
          descriptionDetail: 'LONG',
          includeTags: true
        })
          .then(resolve)
          .catch(error => {
            console.error('YouTube video details error:', error);
            resolve([]);
          });
      } else {
        console.warn('YouTube MCP not available, using mock data');
        resolve(this.getMockVideoDetails(videoIds));
      }
    });
  }

  async getVideoTranscripts(videoIds) {
    return new Promise((resolve) => {
      if (typeof mcp__youtube__getTranscripts === 'function') {
        mcp__youtube__getTranscripts({
          videoIds,
          format: 'key_segments'
        })
          .then(resolve)
          .catch(error => {
            console.error('YouTube transcript error:', error);
            resolve([]);
          });
      } else {
        console.warn('YouTube MCP not available, using mock data');
        resolve(this.getMockTranscripts(videoIds));
      }
    });
  }

  getMockChannelStats(channelIds) {
    return channelIds.map(id => ({
      channelId: id,
      subscriberCount: Math.floor(Math.random() * 1000000),
      viewCount: Math.floor(Math.random() * 100000000),
      videoCount: Math.floor(Math.random() * 1000),
      publishedAt: '2020-01-01T00:00:00Z'
    }));
  }

  getMockTopVideos(channelId, maxResults) {
    return Array.from({ length: maxResults }, (_, i) => ({
      videoId: `mock_video_${channelId}_${i}`,
      title: `Mock Video ${i + 1}`,
      viewCount: Math.floor(Math.random() * 1000000),
      likeCount: Math.floor(Math.random() * 10000),
      commentCount: Math.floor(Math.random() * 1000),
      publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['mock', 'video', 'content']
    }));
  }

  getMockSearchResults(query, maxResults) {
    return Array.from({ length: maxResults }, (_, i) => ({
      videoId: `search_${query}_${i}`,
      title: `${query} Video ${i + 1}`,
      channelTitle: `Channel ${i + 1}`,
      publishedAt: new Date().toISOString(),
      viewCount: Math.floor(Math.random() * 100000)
    }));
  }

  getMockTrendingVideos(maxResults) {
    return Array.from({ length: maxResults }, (_, i) => ({
      videoId: `trending_${i}`,
      title: `Trending Video ${i + 1}`,
      channelTitle: `Trending Channel ${i + 1}`,
      viewCount: Math.floor(Math.random() * 5000000),
      publishedAt: new Date().toISOString()
    }));
  }

  getMockVideoDetails(videoIds) {
    return videoIds.map(id => ({
      videoId: id,
      title: `Video ${id}`,
      description: `Description for video ${id}`,
      tags: ['tech', 'tutorial', 'programming'],
      duration: 'PT10M30S',
      viewCount: Math.floor(Math.random() * 100000),
      likeCount: Math.floor(Math.random() * 5000),
      commentCount: Math.floor(Math.random() * 500)
    }));
  }

  getMockTranscripts(videoIds) {
    return videoIds.map(id => ({
      videoId: id,
      segments: {
        intro: "Welcome to this video about...",
        outro: "Thanks for watching, don't forget to subscribe!"
      }
    }));
  }

  calculateEngagementRate(video) {
    const views = parseInt(video.viewCount) || 0;
    const likes = parseInt(video.likeCount) || 0;
    const comments = parseInt(video.commentCount) || 0;
    
    if (views === 0) return 0;
    return ((likes + comments) / views) * 100;
  }

  analyzeVideoPerformance(videos) {
    return videos.map(video => ({
      ...video,
      engagementRate: this.calculateEngagementRate(video),
      performance: this.categorizePerformance(video)
    }));
  }

  categorizePerformance(video) {
    const engagement = this.calculateEngagementRate(video);
    const views = parseInt(video.viewCount) || 0;
    
    if (engagement > 5 && views > 100000) return 'excellent';
    if (engagement > 3 && views > 50000) return 'good';
    if (engagement > 1 && views > 10000) return 'average';
    return 'below_average';
  }
}