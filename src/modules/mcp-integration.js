/**
 * MCP Integration Layer
 * This module handles integration with Model Context Protocol (MCP) tools
 * for real-time data access from YouTube and Explorium APIs
 */

export class MCPIntegration {
  constructor() {
    this.isInMCPEnvironment = this.detectMCPEnvironment();
    console.log(`MCP Environment: ${this.isInMCPEnvironment ? 'Available' : 'Not Available'}`);
  }

  detectMCPEnvironment() {
    // Check if we're running in a Claude Code environment with MCP tools
    return typeof global !== 'undefined' && 
           typeof global.mcp__youtube__getChannelStatistics === 'function';
  }

  async callYouTubeMCP(toolName, params) {
    if (!this.isInMCPEnvironment) {
      throw new Error('MCP environment not available');
    }

    try {
      switch (toolName) {
        case 'getChannelStatistics':
          return await global.mcp__youtube__getChannelStatistics(params);
        
        case 'getChannelTopVideos':
          return await global.mcp__youtube__getChannelTopVideos(params);
        
        case 'searchVideos':
          return await global.mcp__youtube__searchVideos(params);
        
        case 'getTrendingVideos':
          return await global.mcp__youtube__getTrendingVideos(params);
        
        case 'getVideoDetails':
          return await global.mcp__youtube__getVideoDetails(params);
        
        case 'getTranscripts':
          return await global.mcp__youtube__getTranscripts(params);
        
        case 'getVideoComments':
          return await global.mcp__youtube__getVideoComments(params);
        
        case 'getVideoCategories':
          return await global.mcp__youtube__getVideoCategories(params);
        
        default:
          throw new Error(`Unknown YouTube MCP tool: ${toolName}`);
      }
    } catch (error) {
      console.error(`YouTube MCP call failed for ${toolName}:`, error);
      throw error;
    }
  }

  async callExploriumMCP(toolName, params) {
    if (!this.isInMCPEnvironment) {
      throw new Error('MCP environment not available');
    }

    try {
      switch (toolName) {
        case 'matchBusiness':
          return await global.mcp__explorium__match_business(params);
        
        case 'fetchBusinesses':
          return await global.mcp__explorium__fetch_businesses(params);
        
        case 'enrichBusiness':
          return await global.mcp__explorium__enrich_business(params);
        
        case 'fetchBusinessesStatistics':
          return await global.mcp__explorium__fetch_businesses_statistics(params);
        
        case 'fetchBusinessesEvents':
          return await global.mcp__explorium__fetch_businesses_events(params);
        
        case 'matchProspects':
          return await global.mcp__explorium__match_prospects(params);
        
        case 'fetchProspects':
          return await global.mcp__explorium__fetch_prospects(params);
        
        case 'enrichProspects':
          return await global.mcp__explorium__enrich_prospects(params);
        
        case 'fetchProspectsStatistics':
          return await global.mcp__explorium__fetch_prospects_statistics(params);
        
        case 'fetchProspectsEvents':
          return await global.mcp__explorium__fetch_prospects_events(params);
        
        case 'autocomplete':
          return await global.mcp__explorium__autocomplete(params);
        
        case 'webSearch':
          return await global.mcp__explorium__web_search(params);
        
        default:
          throw new Error(`Unknown Explorium MCP tool: ${toolName}`);
      }
    } catch (error) {
      console.error(`Explorium MCP call failed for ${toolName}:`, error);
      throw error;
    }
  }

  // Real-time YouTube data methods
  async getChannelStatistics(channelIds) {
    if (this.isInMCPEnvironment) {
      console.log('🔴 LIVE: Fetching real YouTube channel statistics...');
      return await this.callYouTubeMCP('getChannelStatistics', { channelIds });
    } else {
      console.log('🟡 DEMO: Using mock YouTube data (MCP not available)');
      return this.getMockChannelStats(channelIds);
    }
  }

  async getChannelTopVideos(channelId, maxResults = 10) {
    if (this.isInMCPEnvironment) {
      console.log('🔴 LIVE: Fetching real YouTube top videos...');
      return await this.callYouTubeMCP('getChannelTopVideos', {
        channelId,
        maxResults,
        descriptionDetail: 'SNIPPET',
        includeTags: true
      });
    } else {
      console.log('🟡 DEMO: Using mock video data (MCP not available)');
      return this.getMockTopVideos(channelId, maxResults);
    }
  }

  async searchVideos(query, maxResults = 10) {
    if (this.isInMCPEnvironment) {
      console.log('🔴 LIVE: Searching real YouTube videos...');
      return await this.callYouTubeMCP('searchVideos', {
        query,
        maxResults,
        order: 'relevance',
        recency: 'pastMonth'
      });
    } else {
      console.log('🟡 DEMO: Using mock search results (MCP not available)');
      return this.getMockSearchResults(query, maxResults);
    }
  }

  async getTrendingVideos(categoryId = null, maxResults = 10) {
    if (this.isInMCPEnvironment) {
      console.log('🔴 LIVE: Fetching real trending videos...');
      const params = { maxResults };
      if (categoryId) params.categoryId = categoryId;
      return await this.callYouTubeMCP('getTrendingVideos', params);
    } else {
      console.log('🟡 DEMO: Using mock trending data (MCP not available)');
      return this.getMockTrendingVideos(maxResults);
    }
  }

  // Real-time Explorium data methods
  async matchBusiness(businessesToMatch, reasoning) {
    if (this.isInMCPEnvironment) {
      console.log('🔴 LIVE: Matching real business data...');
      return await this.callExploriumMCP('matchBusiness', {
        businesses_to_match: businessesToMatch,
        tool_reasoning: reasoning
      });
    } else {
      console.log('🟡 DEMO: Using mock business data (MCP not available)');
      return { businesses: businessesToMatch.map(b => ({ 
        business_id: `mock_${b.name?.replace(/\s+/g, '_')}`, 
        ...b 
      })) };
    }
  }

  async enrichBusiness(businessIds, enrichments) {
    if (this.isInMCPEnvironment) {
      console.log('🔴 LIVE: Enriching real business data...');
      return await this.callExploriumMCP('enrichBusiness', {
        business_ids: businessIds,
        enrichments
      });
    } else {
      console.log('🟡 DEMO: Using mock enrichment data (MCP not available)');
      return this.getMockBusinessEnrichment(businessIds);
    }
  }

  async fetchBusinesses(filters, size = 20) {
    if (this.isInMCPEnvironment) {
      console.log('🔴 LIVE: Fetching real business data...');
      return await this.callExploriumMCP('fetchBusinesses', {
        filters,
        size,
        tool_reasoning: 'Fetching businesses for content strategy analysis'
      });
    } else {
      console.log('🟡 DEMO: Using mock business list (MCP not available)');
      return this.getMockBusinessList(size);
    }
  }

  async fetchProspects(filters, size = 100) {
    if (this.isInMCPEnvironment) {
      console.log('🔴 LIVE: Fetching real prospect data...');
      return await this.callExploriumMCP('fetchProspects', {
        filters,
        size,
        tool_reasoning: 'Fetching prospects for audience analysis'
      });
    } else {
      console.log('🟡 DEMO: Using mock prospect data (MCP not available)');
      return this.getMockProspects(size);
    }
  }

  async getBusinessStatistics(filters) {
    if (this.isInMCPEnvironment) {
      console.log('🔴 LIVE: Fetching real business statistics...');
      return await this.callExploriumMCP('fetchBusinessesStatistics', {
        filters,
        tool_reasoning: 'Fetching statistics for market trend analysis'
      });
    } else {
      console.log('🟡 DEMO: Using mock statistics (MCP not available)');
      return this.getMockBusinessStatistics();
    }
  }

  async autocomplete(field, query) {
    if (this.isInMCPEnvironment) {
      console.log('🔴 LIVE: Getting real autocomplete suggestions...');
      return await this.callExploriumMCP('autocomplete', { field, query });
    } else {
      console.log('🟡 DEMO: Using mock autocomplete (MCP not available)');
      return { suggestions: [query, `${query} related`, `${query} alternative`] };
    }
  }

  // Mock data methods (fallbacks)
  getMockChannelStats(channelIds) {
    return channelIds.map(id => {
      // Special case for AI LABS channel to provide realistic data
      if (id === 'UCelfWQr9sXVMTvBzviPGlFw') {
        return {
          channelId: id,
          title: 'AI LABS',
          subscriberCount: 91400, // Real AI LABS subscriber count
          viewCount: 3784996, // Real AI LABS view count  
          videoCount: 140, // Real AI LABS video count
          createdAt: '2024-09-01T10:56:04.033068Z'
        };
      }
      
      // Default mock data for other channels
      return {
        channelId: id,
        subscriberCount: Math.floor(Math.random() * 1000000) + 10000,
        viewCount: Math.floor(Math.random() * 100000000) + 1000000,
        videoCount: Math.floor(Math.random() * 1000) + 50,
        publishedAt: '2020-01-01T00:00:00Z'
      };
    });
  }

  getMockTopVideos(channelId, maxResults) {
    // AI LABS style video titles based on real content patterns
    const aiLabsTitles = [
      "3 Ways to Build ACTUALLY Beautiful Websites Using Cursor AI",
      "This n8n MCP is INSANE... Let AI Create your Entire Automation", 
      "The BMAD Method: The Ultimate AI Coding System",
      "Claude Engineer is INSANE... Upgrade Your Claude Code Workflow",
      "Shadcn Isn't Just a Library Anymore… Here's How to 10x Your UI",
      "Why EVERYONE is Switching to Cursor AI (And You Should Too)",
      "I Built an AI Agent That Codes Better Than Me",
      "The SECRET to 10x Faster Web Development with AI",
      "This AI Tool Will REPLACE Your Entire Development Stack",
      "How I Use AI to Build Production Apps in Minutes",
      "The Future of Coding is HERE (And It's Terrifying)",
      "AI vs Human Developers: The Results Will SHOCK You",
      "Building the Perfect AI Development Workflow",
      "This Changes EVERYTHING About Web Development",
      "Why Traditional Coding is DEAD (AI Proof)",
      "The ONE AI Tool Every Developer NEEDS",
      "How AI Agents Will Replace Programmers",
      "Building Apps Without Code Using AI",
      "The AI Revolution in Software Development",
      "Next.js + AI: The PERFECT Combination"
    ];

    return Array.from({ length: maxResults }, (_, i) => ({
      videoId: `${channelId}_video_${i}`,
      title: aiLabsTitles[i % aiLabsTitles.length],
      viewCount: Math.floor(Math.random() * 400000) + 50000, // More realistic for AI LABS range
      likeCount: Math.floor(Math.random() * 15000) + 1000,
      commentCount: Math.floor(Math.random() * 800) + 50,
      publishedAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(), // Last 6 months
      tags: ['ai', 'coding', 'cursor', 'development', 'automation', 'tutorial', 'programming', 'web development']
    }));
  }

  getMockSearchResults(query, maxResults) {
    return Array.from({ length: maxResults }, (_, i) => ({
      videoId: `search_${query.replace(/\s+/g, '_')}_${i}`,
      title: `${query} - Professional Guide ${i + 1}`,
      channelTitle: `Expert Channel ${i + 1}`,
      publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      viewCount: Math.floor(Math.random() * 100000) + 5000
    }));
  }

  getMockTrendingVideos(maxResults) {
    const trendingTopics = [
      'AI and Machine Learning',
      'Remote Work Productivity',
      'JavaScript Development',
      'Digital Marketing',
      'Cloud Computing',
      'Data Science',
      'Cybersecurity',
      'Mobile App Development'
    ];

    return Array.from({ length: maxResults }, (_, i) => ({
      videoId: `trending_${i}`,
      title: `${trendingTopics[i % trendingTopics.length]} - Latest Trends`,
      channelTitle: `Trending Channel ${i + 1}`,
      viewCount: Math.floor(Math.random() * 2000000) + 100000,
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }

  getMockBusinessEnrichment(businessIds) {
    return businessIds.map(id => ({
      business_id: id,
      name: `Company ${id.split('_').pop()}`,
      industry: 'Technology',
      size: ['11-50', '51-200', '201-500'][Math.floor(Math.random() * 3)],
      revenue: ['1M-5M', '5M-10M', '10M-25M'][Math.floor(Math.random() * 3)],
      location: 'United States',
      founded: Math.floor(Math.random() * 20) + 2005,
      technologies: ['React', 'Node.js', 'Python', 'AWS', 'Docker'],
      funding_rounds: [{ amount: '2M', stage: 'Series A', date: '2023' }]
    }));
  }

  getMockBusinessList(size) {
    return {
      businesses: Array.from({ length: Math.min(size, 20) }, (_, i) => ({
        business_id: `business_${i}`,
        name: `Tech Company ${i + 1}`,
        company_size: ['11-50', '51-200', '201-500'][i % 3],
        revenue: ['1M-5M', '5M-10M', '10M-25M'][i % 3],
        industry: 'Technology'
      })),
      total_results: size
    };
  }

  getMockProspects(size) {
    const departments = ['Engineering', 'Marketing', 'Sales', 'Operations'];
    const titles = [
      'Software Engineer', 'Marketing Manager', 'Sales Director', 'Operations Lead',
      'Senior Developer', 'Product Manager', 'Account Executive', 'Data Analyst'
    ];

    return {
      prospects: Array.from({ length: Math.min(size, 50) }, (_, i) => ({
        prospect_id: `prospect_${i}`,
        job_title: titles[i % titles.length],
        job_department: departments[i % departments.length],
        country: ['US', 'UK', 'Canada', 'Germany'][i % 4],
        company_name: `Company ${Math.floor(i / 5) + 1}`
      })),
      total_results: size
    };
  }

  getMockBusinessStatistics() {
    return {
      total_results: 2500,
      company_size_breakdown: {
        '1-10': 800,
        '11-50': 900,
        '51-200': 500,
        '201-500': 200,
        '501+': 100
      },
      company_revenue_breakdown: {
        '0-500K': 400,
        '500K-1M': 600,
        '1M-5M': 800,
        '5M-10M': 400,
        '10M+': 300
      }
    };
  }
}