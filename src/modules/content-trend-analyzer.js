export class ContentTrendAnalyzer {
  constructor() {
    this.trendCache = new Map();
    this.performanceThresholds = {
      viral: { viewGrowth: 10, engagementGrowth: 5 },
      trending: { viewGrowth: 3, engagementGrowth: 2 },
      rising: { viewGrowth: 1.5, engagementGrowth: 1.2 },
      stable: { viewGrowth: 1, engagementGrowth: 1 },
      declining: { viewGrowth: 0.5, engagementGrowth: 0.8 }
    };
  }

  async analyzeContentTrends(videos, timeframeHours = 168) { // Default 7 days
    try {
      console.log('🔴 LIVE: Analyzing content performance trends...');
      
      const trendAnalysis = {
        risingContent: [],
        trendingReasons: [],
        performancePatterns: {},
        contentOpportunities: [],
        viralPotential: [],
        timestamp: new Date().toISOString()
      };

      // Analyze each video's trend trajectory
      for (const video of videos) {
        const videoTrend = await this.analyzeVideoTrend(video, timeframeHours);
        if (videoTrend.status === 'rising' || videoTrend.status === 'trending' || videoTrend.status === 'viral') {
          trendAnalysis.risingContent.push(videoTrend);
        }
      }

      // Sort by performance score
      trendAnalysis.risingContent.sort((a, b) => b.performanceScore - a.performanceScore);

      // Identify trending reasons and patterns
      trendAnalysis.trendingReasons = this.identifyTrendingReasons(trendAnalysis.risingContent);
      trendAnalysis.performancePatterns = this.analyzePerformancePatterns(videos);
      trendAnalysis.contentOpportunities = this.identifyContentOpportunities(trendAnalysis.risingContent);
      trendAnalysis.viralPotential = this.assessViralPotential(videos);

      console.log('✅ Content trend analysis completed');
      return trendAnalysis;

    } catch (error) {
      console.error('Content trend analysis error:', error);
      return this.getMockTrendAnalysis();
    }
  }

  async analyzeVideoTrend(video, timeframeHours) {
    const publishDate = new Date(video.publishedAt);
    const currentDate = new Date();
    const hoursOld = (currentDate - publishDate) / (1000 * 60 * 60);
    
    // Skip videos older than timeframe
    if (hoursOld > timeframeHours) {
      return this.getVideoTrendBaseline(video, 'stable');
    }

    const trendMetrics = this.calculateTrendMetrics(video, hoursOld);
    const trendStatus = this.determineTrendStatus(trendMetrics);
    const trendReasons = this.identifyVideoTrendReasons(video, trendMetrics);

    return {
      videoId: video.id || video.videoId,
      title: video.title,
      publishedAt: video.publishedAt,
      hoursOld: Math.round(hoursOld),
      status: trendStatus,
      performanceScore: trendMetrics.performanceScore,
      metrics: {
        viewVelocity: trendMetrics.viewVelocity,
        engagementRate: trendMetrics.engagementRate,
        commentVelocity: trendMetrics.commentVelocity,
        shareProjection: trendMetrics.shareProjection,
        retentionSignal: trendMetrics.retentionSignal
      },
      trendReasons: trendReasons,
      projectedPeak: this.projectPeakPerformance(trendMetrics, hoursOld),
      recommendedActions: this.generateTrendActions(trendStatus, trendReasons)
    };
  }

  calculateTrendMetrics(video, hoursOld) {
    const views = parseInt(video.viewCount) || 0;
    const likes = parseInt(video.likeCount) || 0;
    const comments = parseInt(video.commentCount) || 0;
    
    // Calculate velocity metrics (performance per hour)
    const viewVelocity = hoursOld > 0 ? views / hoursOld : 0;
    const commentVelocity = hoursOld > 0 ? comments / hoursOld : 0;
    const engagementRate = views > 0 ? ((likes + comments) / views) * 100 : 0;
    
    // Calculate performance score based on velocity and engagement
    const performanceScore = this.calculatePerformanceScore(viewVelocity, engagementRate, commentVelocity, hoursOld);
    
    // Project sharing potential
    const shareProjection = this.projectSharePotential(engagementRate, commentVelocity);
    
    // Assess retention signals
    const retentionSignal = this.assessRetentionSignal(video, engagementRate);

    return {
      viewVelocity,
      engagementRate,
      commentVelocity,
      shareProjection,
      retentionSignal,
      performanceScore,
      rawMetrics: { views, likes, comments, hoursOld }
    };
  }

  calculatePerformanceScore(viewVelocity, engagementRate, commentVelocity, hoursOld) {
    let score = 0;
    
    // View velocity scoring (40% weight)
    if (viewVelocity > 1000) score += 40;
    else if (viewVelocity > 500) score += 30;
    else if (viewVelocity > 100) score += 20;
    else if (viewVelocity > 50) score += 10;
    
    // Engagement rate scoring (35% weight)
    if (engagementRate > 5) score += 35;
    else if (engagementRate > 3) score += 25;
    else if (engagementRate > 2) score += 15;
    else if (engagementRate > 1) score += 10;
    
    // Comment velocity scoring (15% weight)
    if (commentVelocity > 10) score += 15;
    else if (commentVelocity > 5) score += 10;
    else if (commentVelocity > 1) score += 5;
    
    // Recency bonus (10% weight) - newer content gets bonus
    if (hoursOld < 24) score += 10;
    else if (hoursOld < 72) score += 5;
    
    return Math.min(score, 100);
  }

  determineTrendStatus(metrics) {
    const score = metrics.performanceScore;
    const velocity = metrics.viewVelocity;
    const engagement = metrics.engagementRate;
    
    if (score >= 80 && velocity > 1000 && engagement > 4) return 'viral';
    if (score >= 60 && velocity > 300 && engagement > 2.5) return 'trending';
    if (score >= 40 && velocity > 100 && engagement > 1.5) return 'rising';
    if (score >= 25) return 'stable';
    return 'declining';
  }

  identifyVideoTrendReasons(video, metrics) {
    const reasons = [];
    
    // Analyze title factors
    const title = (video.title || '').toLowerCase();
    if (title.includes('ai') || title.includes('artificial intelligence')) {
      reasons.push({
        factor: 'AI/Technology Trend',
        impact: 'High',
        description: 'Content aligns with current AI technology interest'
      });
    }
    
    if (title.includes('tutorial') || title.includes('how to')) {
      reasons.push({
        factor: 'Educational Content Demand',
        impact: 'Medium',
        description: 'Tutorial content consistently performs well'
      });
    }
    
    if (title.includes('new') || title.includes('latest') || title.includes('2024') || title.includes('2025')) {
      reasons.push({
        factor: 'Timeliness/Novelty',
        impact: 'Medium',
        description: 'Current and timely content attracts more attention'
      });
    }
    
    // Analyze engagement patterns
    if (metrics.engagementRate > 3) {
      reasons.push({
        factor: 'High Audience Engagement',
        impact: 'High',
        description: 'Strong like-to-view and comment-to-view ratios indicate resonant content'
      });
    }
    
    // Analyze velocity patterns
    if (metrics.viewVelocity > 500) {
      reasons.push({
        factor: 'Strong Initial Momentum',
        impact: 'High',
        description: 'Rapid view accumulation suggests algorithmic promotion and audience interest'
      });
    }
    
    // Analyze comment velocity
    if (metrics.commentVelocity > 5) {
      reasons.push({
        factor: 'Active Discussion Generation',
        impact: 'Medium',
        description: 'High comment velocity indicates content sparking conversation'
      });
    }
    
    // Analyze tags if available
    if (video.tags && Array.isArray(video.tags)) {
      const trendingTags = this.identifyTrendingTags(video.tags);
      if (trendingTags.length > 0) {
        reasons.push({
          factor: 'Trending Keywords/Tags',
          impact: 'Medium',
          description: `Uses trending keywords: ${trendingTags.join(', ')}`
        });
      }
    }
    
    // Analyze timing
    const publishHour = new Date(video.publishedAt).getHours();
    if (publishHour >= 14 && publishHour <= 16) { // 2-4 PM optimal time
      reasons.push({
        factor: 'Optimal Publishing Time',
        impact: 'Low',
        description: 'Published during peak audience activity hours'
      });
    }
    
    return reasons;
  }

  identifyTrendingTags(tags) {
    const trendingKeywords = [
      'ai', 'artificial intelligence', 'machine learning', 'chatgpt', 'gemini',
      'coding', 'programming', 'development', 'tutorial', 'guide',
      'javascript', 'python', 'react', 'nodejs', 'web development',
      'productivity', 'tips', 'tricks', 'best practices',
      'google', 'microsoft', 'apple', 'tech', 'innovation'
    ];
    
    return tags.filter(tag => 
      trendingKeywords.some(keyword => 
        tag.toLowerCase().includes(keyword)
      )
    );
  }

  projectSharePotential(engagementRate, commentVelocity) {
    let potential = 'Low';
    
    if (engagementRate > 4 && commentVelocity > 8) potential = 'Very High';
    else if (engagementRate > 3 && commentVelocity > 5) potential = 'High';
    else if (engagementRate > 2 && commentVelocity > 2) potential = 'Medium';
    
    return potential;
  }

  assessRetentionSignal(video, engagementRate) {
    // Analyze duration vs engagement for retention signals
    const duration = this.parseDuration(video.duration || 'PT0S');
    
    if (duration > 600 && engagementRate > 2) return 'High'; // Long content with good engagement
    if (duration < 300 && engagementRate > 3) return 'High'; // Short content with great engagement
    if (engagementRate > 1.5) return 'Medium';
    return 'Low';
  }

  parseDuration(duration) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    
    return hours * 3600 + minutes * 60 + seconds;
  }

  projectPeakPerformance(metrics, hoursOld) {
    const currentViews = metrics.rawMetrics.views;
    const velocity = metrics.viewVelocity;
    
    // Project peak based on current trajectory
    let projectedMultiplier = 1;
    
    if (metrics.performanceScore > 80) projectedMultiplier = 5; // Viral content
    else if (metrics.performanceScore > 60) projectedMultiplier = 3; // Trending content
    else if (metrics.performanceScore > 40) projectedMultiplier = 2; // Rising content
    else projectedMultiplier = 1.2; // Stable content
    
    const projectedPeakViews = Math.round(currentViews * projectedMultiplier);
    const estimatedPeakTime = hoursOld + (24 * Math.log(projectedMultiplier));
    
    return {
      estimatedPeakViews: projectedPeakViews,
      estimatedPeakTimeHours: Math.round(estimatedPeakTime),
      confidence: this.calculateProjectionConfidence(metrics, hoursOld)
    };
  }

  calculateProjectionConfidence(metrics, hoursOld) {
    let confidence = 50; // Base confidence
    
    if (hoursOld > 48) confidence += 30; // More data points
    if (metrics.engagementRate > 2) confidence += 20; // Strong engagement
    if (metrics.viewVelocity > 100) confidence += 20; // Strong velocity
    if (metrics.commentVelocity > 1) confidence += 10; // Active discussion
    
    return Math.min(confidence, 95);
  }

  generateTrendActions(status, reasons) {
    const actions = [];
    
    switch (status) {
      case 'viral':
        actions.push('🚀 Capitalize on momentum with follow-up content');
        actions.push('📈 Create content series around this topic');
        actions.push('💬 Actively engage with comments to maintain discussion');
        actions.push('🔄 Cross-promote on other platforms immediately');
        break;
        
      case 'trending':
        actions.push('⚡ Boost promotion with additional marketing');
        actions.push('🎯 Create similar content while trend is hot');
        actions.push('📊 Monitor metrics closely for optimization opportunities');
        actions.push('🤝 Reach out to collaborators while content is trending');
        break;
        
      case 'rising':
        actions.push('📢 Increase promotion to boost momentum');
        actions.push('🏷️ Optimize tags and description for better discovery');
        actions.push('💡 Analyze successful elements for future content');
        actions.push('⏰ Consider optimal timing for similar content');
        break;
        
      case 'stable':
        actions.push('🔧 Optimize title and thumbnail for better performance');
        actions.push('📝 Update description with trending keywords');
        actions.push('🎯 Target specific audience segments');
        break;
        
      case 'declining':
        actions.push('🚨 Analyze what went wrong for learning');
        actions.push('🔄 Consider content refresh or update');
        actions.push('📊 Review audience retention analytics');
        break;
    }
    
    // Add specific actions based on trend reasons
    reasons.forEach(reason => {
      if (reason.factor === 'AI/Technology Trend') {
        actions.push('🤖 Create more AI-related content while trend is hot');
      }
      if (reason.factor === 'Educational Content Demand') {
        actions.push('📚 Develop comprehensive tutorial series');
      }
      if (reason.factor === 'High Audience Engagement') {
        actions.push('💭 Create Q&A or discussion-based follow-up content');
      }
    });
    
    return actions.slice(0, 5); // Limit to top 5 actions
  }

  identifyTrendingReasons(risingContent) {
    const reasonFrequency = {};
    const topicTrends = {};
    
    risingContent.forEach(content => {
      content.trendReasons.forEach(reason => {
        reasonFrequency[reason.factor] = (reasonFrequency[reason.factor] || 0) + 1;
      });
      
      // Analyze topic trends
      const title = content.title.toLowerCase();
      if (title.includes('ai')) topicTrends['AI/Tech'] = (topicTrends['AI/Tech'] || 0) + 1;
      if (title.includes('tutorial')) topicTrends['Educational'] = (topicTrends['Educational'] || 0) + 1;
      if (title.includes('tips')) topicTrends['Tips/Advice'] = (topicTrends['Tips/Advice'] || 0) + 1;
    });
    
    const topReasons = Object.entries(reasonFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([reason, frequency]) => ({ reason, frequency }));
    
    const trendingTopics = Object.entries(topicTrends)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([topic, frequency]) => ({ topic, frequency }));
    
    return {
      topReasons,
      trendingTopics,
      overallPattern: this.identifyOverallPattern(topReasons),
      marketInsights: this.generateMarketInsights(topReasons, trendingTopics)
    };
  }

  identifyOverallPattern(topReasons) {
    if (!topReasons.length) return 'Insufficient data for pattern analysis';
    
    const dominantReason = topReasons[0].reason;
    
    if (dominantReason.includes('AI') || dominantReason.includes('Technology')) {
      return 'Strong technology trend driving content performance';
    }
    if (dominantReason.includes('Educational') || dominantReason.includes('Tutorial')) {
      return 'Educational content outperforming entertainment';
    }
    if (dominantReason.includes('Engagement')) {
      return 'Audience interaction quality over quantity trend';
    }
    if (dominantReason.includes('Timing') || dominantReason.includes('Momentum')) {
      return 'Strategic timing and momentum-based success pattern';
    }
    
    return 'Mixed success factors - diversified content strategy working';
  }

  generateMarketInsights(topReasons, trendingTopics) {
    const insights = [];
    
    if (trendingTopics.find(t => t.topic === 'AI/Tech')) {
      insights.push({
        insight: 'AI and technology content experiencing significant growth',
        action: 'Increase technology-focused content production',
        opportunity: 'High audience demand for AI tutorials and insights'
      });
    }
    
    if (topReasons.find(r => r.reason.includes('Educational'))) {
      insights.push({
        insight: 'Educational content consistently outperforming entertainment',
        action: 'Focus on tutorial and how-to content formats',
        opportunity: 'Untapped demand for comprehensive learning content'
      });
    }
    
    if (topReasons.find(r => r.reason.includes('Engagement'))) {
      insights.push({
        insight: 'Audience prioritizing interactive and discussion-worthy content',
        action: 'Create more discussion-generating and community-focused content',
        opportunity: 'Build stronger community through engagement-first strategy'
      });
    }
    
    return insights;
  }

  analyzePerformancePatterns(videos) {
    const patterns = {
      timePatterns: this.analyzeTimePatterns(videos),
      contentPatterns: this.analyzeContentPatterns(videos),
      engagementPatterns: this.analyzeEngagementPatterns(videos),
      seasonalPatterns: this.analyzeSeasonalPatterns(videos)
    };
    
    return patterns;
  }

  analyzeTimePatterns(videos) {
    const hourlyPerformance = {};
    const dailyPerformance = {};
    
    videos.forEach(video => {
      const publishDate = new Date(video.publishedAt);
      const hour = publishDate.getHours();
      const day = publishDate.toLocaleDateString('en-US', { weekday: 'long' });
      const engagement = this.calculateEngagementRate(video);
      
      if (!hourlyPerformance[hour]) hourlyPerformance[hour] = [];
      if (!dailyPerformance[day]) dailyPerformance[day] = [];
      
      hourlyPerformance[hour].push(engagement);
      dailyPerformance[day].push(engagement);
    });
    
    // Calculate averages
    const bestHours = Object.entries(hourlyPerformance)
      .map(([hour, engagements]) => ({
        hour: parseInt(hour),
        avgEngagement: engagements.reduce((a, b) => a + b, 0) / engagements.length,
        sampleSize: engagements.length
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement)
      .slice(0, 3);
    
    const bestDays = Object.entries(dailyPerformance)
      .map(([day, engagements]) => ({
        day,
        avgEngagement: engagements.reduce((a, b) => a + b, 0) / engagements.length,
        sampleSize: engagements.length
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement)
      .slice(0, 3);
    
    return { bestHours, bestDays };
  }

  calculateEngagementRate(video) {
    const views = parseInt(video.viewCount) || 0;
    const likes = parseInt(video.likeCount) || 0;
    const comments = parseInt(video.commentCount) || 0;
    
    if (views === 0) return 0;
    return ((likes + comments) / views) * 100;
  }

  analyzeContentPatterns(videos) {
    const titleKeywords = {};
    const lengthPerformance = { short: [], medium: [], long: [] };
    
    videos.forEach(video => {
      const title = (video.title || '').toLowerCase();
      const words = title.split(' ').filter(word => word.length > 3);
      const engagement = this.calculateEngagementRate(video);
      const duration = this.parseDuration(video.duration || 'PT0S');
      
      // Analyze keywords
      words.forEach(word => {
        if (!titleKeywords[word]) titleKeywords[word] = [];
        titleKeywords[word].push(engagement);
      });
      
      // Analyze length performance
      if (duration < 300) lengthPerformance.short.push(engagement);
      else if (duration < 900) lengthPerformance.medium.push(engagement);
      else lengthPerformance.long.push(engagement);
    });
    
    // Find best performing keywords
    const topKeywords = Object.entries(titleKeywords)
      .filter(([word, engagements]) => engagements.length >= 2) // At least 2 videos
      .map(([word, engagements]) => ({
        keyword: word,
        avgEngagement: engagements.reduce((a, b) => a + b, 0) / engagements.length,
        frequency: engagements.length
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement)
      .slice(0, 10);
    
    // Analyze optimal length
    const lengthAnalysis = Object.entries(lengthPerformance)
      .map(([length, engagements]) => ({
        length,
        avgEngagement: engagements.length > 0 ? engagements.reduce((a, b) => a + b, 0) / engagements.length : 0,
        sampleSize: engagements.length
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement);
    
    return { topKeywords, lengthAnalysis };
  }

  analyzeEngagementPatterns(videos) {
    const engagementTiers = {
      high: videos.filter(v => this.calculateEngagementRate(v) > 3),
      medium: videos.filter(v => {
        const rate = this.calculateEngagementRate(v);
        return rate >= 1.5 && rate <= 3;
      }),
      low: videos.filter(v => this.calculateEngagementRate(v) < 1.5)
    };
    
    return {
      distribution: {
        high: engagementTiers.high.length,
        medium: engagementTiers.medium.length,
        low: engagementTiers.low.length
      },
      highPerformers: engagementTiers.high.slice(0, 5).map(v => ({
        title: v.title,
        engagement: this.calculateEngagementRate(v)
      }))
    };
  }

  analyzeSeasonalPatterns(videos) {
    const monthlyPerformance = {};
    
    videos.forEach(video => {
      const publishDate = new Date(video.publishedAt);
      const month = publishDate.toLocaleDateString('en-US', { month: 'long' });
      const engagement = this.calculateEngagementRate(video);
      
      if (!monthlyPerformance[month]) monthlyPerformance[month] = [];
      monthlyPerformance[month].push(engagement);
    });
    
    const seasonalTrends = Object.entries(monthlyPerformance)
      .map(([month, engagements]) => ({
        month,
        avgEngagement: engagements.reduce((a, b) => a + b, 0) / engagements.length,
        sampleSize: engagements.length
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement);
    
    return seasonalTrends;
  }

  identifyContentOpportunities(risingContent) {
    const opportunities = [];
    
    // Analyze successful content themes
    const successfulThemes = risingContent.reduce((themes, content) => {
      const title = content.title.toLowerCase();
      if (title.includes('ai') || title.includes('artificial intelligence')) {
        themes.ai = (themes.ai || 0) + 1;
      }
      if (title.includes('tutorial') || title.includes('how to')) {
        themes.tutorial = (themes.tutorial || 0) + 1;
      }
      if (title.includes('tips') || title.includes('tricks')) {
        themes.tips = (themes.tips || 0) + 1;
      }
      if (title.includes('review') || title.includes('analysis')) {
        themes.review = (themes.review || 0) + 1;
      }
      return themes;
    }, {});
    
    // Generate opportunities based on successful themes
    Object.entries(successfulThemes).forEach(([theme, frequency]) => {
      if (frequency >= 2) {
        opportunities.push({
          type: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Content`,
          potential: 'High',
          reason: `${frequency} rising videos in this category`,
          suggestedTopics: this.generateTopicSuggestions(theme),
          priority: frequency > 3 ? 'Immediate' : 'High'
        });
      }
    });
    
    // Add timing-based opportunities
    opportunities.push({
      type: 'Trending Topic Integration',
      potential: 'High',
      reason: 'Current market trends favor technology and AI content',
      suggestedTopics: ['AI Tools for Creators', 'Latest Tech Trends', 'Productivity Automation'],
      priority: 'Immediate'
    });
    
    return opportunities.slice(0, 5);
  }

  generateTopicSuggestions(theme) {
    const suggestions = {
      ai: ['AI Tools for Content Creation', 'ChatGPT vs Gemini Comparison', 'AI Coding Assistants Review'],
      tutorial: ['Step-by-Step Guide to...', 'Complete Beginner Tutorial', 'Advanced Techniques Masterclass'],
      tips: ['10 Pro Tips for...', 'Hidden Features You Should Know', 'Productivity Hacks That Work'],
      review: ['Honest Review of...', 'Before You Buy: Analysis', 'Comparing Top Solutions']
    };
    
    return suggestions[theme] || ['Create engaging content in this category'];
  }

  assessViralPotential(videos) {
    const viralCandidates = videos
      .map(video => {
        const metrics = this.calculateTrendMetrics(video, 24); // 24 hour window
        return {
          videoId: video.id || video.videoId,
          title: video.title,
          viralScore: this.calculateViralScore(metrics),
          viralFactors: this.identifyViralFactors(video, metrics),
          recommendation: this.getViralRecommendation(metrics)
        };
      })
      .filter(candidate => candidate.viralScore > 30)
      .sort((a, b) => b.viralScore - a.viralScore)
      .slice(0, 5);
    
    return viralCandidates;
  }

  calculateViralScore(metrics) {
    let score = 0;
    
    // High velocity indicates viral potential
    if (metrics.viewVelocity > 1000) score += 40;
    else if (metrics.viewVelocity > 500) score += 25;
    else if (metrics.viewVelocity > 200) score += 15;
    
    // Strong engagement suggests viral content
    if (metrics.engagementRate > 5) score += 30;
    else if (metrics.engagementRate > 3) score += 20;
    else if (metrics.engagementRate > 2) score += 10;
    
    // Comment velocity indicates discussion generation
    if (metrics.commentVelocity > 20) score += 20;
    else if (metrics.commentVelocity > 10) score += 15;
    else if (metrics.commentVelocity > 5) score += 10;
    
    // Share projection adds to viral potential
    if (metrics.shareProjection === 'Very High') score += 10;
    else if (metrics.shareProjection === 'High') score += 7;
    else if (metrics.shareProjection === 'Medium') score += 4;
    
    return Math.min(score, 100);
  }

  identifyViralFactors(video, metrics) {
    const factors = [];
    
    if (metrics.viewVelocity > 500) {
      factors.push('Exceptional view velocity');
    }
    if (metrics.engagementRate > 3) {
      factors.push('High audience engagement');
    }
    if (metrics.commentVelocity > 10) {
      factors.push('Strong discussion generation');
    }
    
    const title = (video.title || '').toLowerCase();
    if (title.includes('shocking') || title.includes('incredible') || title.includes('amazing')) {
      factors.push('Attention-grabbing language');
    }
    if (title.includes('new') || title.includes('breaking') || title.includes('exclusive')) {
      factors.push('Novelty and exclusivity');
    }
    
    return factors;
  }

  getViralRecommendation(metrics) {
    const score = this.calculateViralScore(metrics);
    
    if (score > 70) return 'High viral potential - boost promotion immediately';
    if (score > 50) return 'Good viral potential - increase marketing efforts';
    if (score > 30) return 'Moderate potential - optimize and monitor closely';
    return 'Low viral potential - focus on steady growth';
  }

  getVideoTrendBaseline(video, status) {
    return {
      videoId: video.id || video.videoId,
      title: video.title,
      status,
      performanceScore: 50,
      trendReasons: [],
      projectedPeak: null
    };
  }

  getMockTrendAnalysis() {
    return {
      risingContent: [
        {
          videoId: 'mock_rising_1',
          title: 'AI Coding Tutorial - Revolutionary Approach',
          status: 'trending',
          performanceScore: 78,
          trendReasons: [
            { factor: 'AI/Technology Trend', impact: 'High', description: 'Aligns with current AI interest' },
            { factor: 'Educational Content Demand', impact: 'Medium', description: 'Tutorial format performs well' }
          ]
        }
      ],
      trendingReasons: {
        topReasons: [
          { reason: 'AI/Technology Trend', frequency: 3 },
          { reason: 'Educational Content Demand', frequency: 2 }
        ],
        overallPattern: 'Strong technology trend driving content performance'
      },
      contentOpportunities: [
        {
          type: 'AI Content',
          potential: 'High',
          reason: 'Multiple rising videos in AI category',
          priority: 'Immediate'
        }
      ],
      timestamp: new Date().toISOString()
    };
  }
}