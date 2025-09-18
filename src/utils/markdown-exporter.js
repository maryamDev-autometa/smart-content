export class MarkdownExporter {
  generateReport(analysisData) {
    const timestamp = new Date().toISOString().split('T')[0];
    const channelName = analysisData.metadata?.channelName || 'Unknown Channel';
    
    let markdown = this.generateHeader(channelName, timestamp);
    markdown += this.generateExecutiveSummary(analysisData);
    markdown += this.generateChannelHealth(analysisData.channelHealthScore);
    markdown += this.generateKeyMetrics(analysisData.youtubeData);
    markdown += this.generateContentRecommendations(analysisData.contentRecommendations);
    markdown += this.generateAudienceInsights(analysisData.audienceInsights);
    markdown += this.generateCompetitorAnalysis(analysisData.competitorAnalysis);
    markdown += this.generateUploadSchedule(analysisData.uploadSchedule);
    markdown += this.generateGrowthOpportunities(analysisData.growthOpportunities);
    markdown += this.generateContentTrends(analysisData.contentTrends);
    markdown += this.generateActionPlan(analysisData);
    markdown += this.generateAppendix(analysisData);
    
    return markdown;
  }

  generateHeader(channelName, timestamp) {
    return `# Smart Content Strategy Report

**Channel:** ${channelName}  
**Generated:** ${timestamp}  
**Report Type:** Comprehensive Content Strategy Analysis  

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Channel Health Score](#channel-health-score)
3. [Key Performance Metrics](#key-performance-metrics)
4. [Content Recommendations](#content-recommendations)
5. [Audience Insights](#audience-insights)
6. [Competitor Analysis](#competitor-analysis)
7. [Recommended Upload Schedule](#recommended-upload-schedule)
8. [Growth Opportunities](#growth-opportunities)
9. [Content Trend Analysis](#content-trend-analysis)
10. [Action Plan](#action-plan)
11. [Data Sources & Methodology](#data-sources--methodology)

---

`;
  }

  generateExecutiveSummary(analysisData) {
    const healthScore = analysisData.channelHealthScore?.overall || 0;
    const topRecommendation = analysisData.contentRecommendations?.topics?.[0];
    const primaryOpportunity = analysisData.growthOpportunities?.[0];

    return `## Executive Summary

### Overall Assessment
Your channel has a health score of **${healthScore}/100**, indicating ${this.getHealthAssessment(healthScore)} performance across key metrics including engagement, consistency, growth trajectory, market alignment, and content quality.

### Key Findings
- **Primary Strength:** ${this.getTopStrength(analysisData.channelHealthScore)}
- **Main Improvement Area:** ${this.getTopWeakness(analysisData.channelHealthScore)}
- **Top Content Opportunity:** ${topRecommendation?.topics?.[0] || 'Trending industry topics'}
- **Primary Growth Vector:** ${primaryOpportunity?.type || 'Content optimization'}

### Strategic Recommendations
1. **Immediate Actions (1-2 weeks):** ${this.getImmediateActions(analysisData)}
2. **Short-term Goals (1-3 months):** ${this.getShortTermGoals(analysisData)}
3. **Long-term Vision (6-12 months):** ${this.getLongTermVision(analysisData)}

---

`;
  }

  generateChannelHealth(healthScore) {
    if (!healthScore) return '## Channel Health Score\n\n*Data not available*\n\n---\n\n';

    return `## Channel Health Score

### Overall Score: ${healthScore.overall}/100

${this.generateHealthChart(healthScore.overall)}

### Detailed Breakdown

| Metric | Score | Assessment |
|--------|-------|------------|
| **Engagement** | ${healthScore.breakdown?.engagement || 0}/100 | ${this.getScoreAssessment(healthScore.breakdown?.engagement || 0)} |
| **Consistency** | ${healthScore.breakdown?.consistency || 0}/100 | ${this.getScoreAssessment(healthScore.breakdown?.consistency || 0)} |
| **Growth** | ${healthScore.breakdown?.growth || 0}/100 | ${this.getScoreAssessment(healthScore.breakdown?.growth || 0)} |
| **Market Alignment** | ${healthScore.breakdown?.marketAlignment || 0}/100 | ${this.getScoreAssessment(healthScore.breakdown?.marketAlignment || 0)} |
| **Content Quality** | ${healthScore.breakdown?.contentQuality || 0}/100 | ${this.getScoreAssessment(healthScore.breakdown?.contentQuality || 0)} |

### Improvement Recommendations

${healthScore.recommendations?.map(rec => `- ${rec}`).join('\n') || '- Focus on consistent content creation\n- Improve audience engagement'}

---

`;
  }

  generateKeyMetrics(youtubeData) {
    if (!youtubeData) return '## Key Performance Metrics\n\n*YouTube data not available*\n\n---\n\n';

    const stats = youtubeData.statistics || {};
    const videos = youtubeData.topVideos || [];

    return `## Key Performance Metrics

### Channel Statistics

| Metric | Value |
|--------|-------|
| **Subscribers** | ${this.formatNumber(stats.subscriberCount || 0)} |
| **Total Views** | ${this.formatNumber(stats.viewCount || 0)} |
| **Video Count** | ${this.formatNumber(stats.videoCount || 0)} |
| **Average Views per Video** | ${this.formatNumber((stats.viewCount || 0) / (stats.videoCount || 1))} |
| **Channel Created** | ${stats.publishedAt || 'Unknown'} |

### Top Performing Content

${videos.slice(0, 5).map((video, index) => `
#### ${index + 1}. ${video.title || 'Untitled Video'}
- **Views:** ${this.formatNumber(video.viewCount || 0)}
- **Likes:** ${this.formatNumber(video.likeCount || 0)}
- **Comments:** ${this.formatNumber(video.commentCount || 0)}
- **Engagement Rate:** ${this.calculateEngagementRate(video)}%
- **Published:** ${video.publishedAt || 'Unknown'}
`).join('')}

### Performance Analysis

- **Average Engagement Rate:** ${this.calculateAverageEngagement(videos)}%
- **Content Categories:** ${this.analyzeContentCategories(videos)}
- **Publishing Frequency:** ${this.analyzePublishingFrequency(videos)}

---

`;
  }

  generateContentRecommendations(contentRecs) {
    if (!contentRecs) return '## Content Recommendations\n\n*Recommendations not available*\n\n---\n\n';

    return `## Content Recommendations

### Trending Topics for Your Next Videos

${contentRecs.topics?.map(topic => `
#### ${topic.category}
${topic.topics?.map(t => `- **${t}**`).join('\n') || '- New content opportunity'}
*${topic.reason}*
`).join('') || '- Focus on trending industry topics\n- Create educational content\n- Develop series-based content'}

### Recommended Content Formats

${contentRecs.formats?.map(format => `
#### ${format.format} (Confidence: ${format.confidence}%)
${format.reason}  
**Example:** ${format.example}
`).join('') || '#### Tutorial Series\nEducational content performs well with your audience.\n**Example:** Step-by-step guides'}

### Optimization Tips

${contentRecs.optimization?.map(tip => `
#### ${tip.category} - ${tip.impact} Impact
${tip.tip}
`).join('') || '#### Titles - High Impact\nOptimize titles for better discoverability'}

### Next Actions

${contentRecs.nextActions?.map(action => `
- [ ] **${action.action}** (Priority: ${action.priority}, Timeline: ${action.timeline})
`).join('') || '- [ ] **Create content calendar** (Priority: High, Timeline: 1 week)'}

---

`;
  }

  generateAudienceInsights(audienceInsights) {
    if (!audienceInsights) return '## Audience Insights\n\n*Audience data not available*\n\n---\n\n';

    return `## Audience Insights

### Target Audience Segments

${audienceInsights.targetSegments?.map(segment => `
#### ${segment.name} (${segment.size} people)
${segment.characteristics?.map(char => `- ${char}`).join('\n') || '- Professional audience'}
`).join('') || '#### Professional Audience\n- Goal-oriented individuals\n- Seeking industry insights'}

### Content Personalization Strategy

${audienceInsights.contentPersonalization?.map(strategy => `- ${strategy}`).join('\n') || '- Create content for different skill levels\n- Use industry-specific examples'}

### Engagement Tactics

${audienceInsights.engagementTactics?.map(tactic => `- ${tactic}`).join('\n') || '- Respond to comments promptly\n- Create community polls\n- Host live Q&A sessions'}

### Growth Strategies

${audienceInsights.growthStrategies?.map(strategy => `- ${strategy}`).join('\n') || '- Cross-platform promotion\n- Collaborate with industry experts\n- Optimize for search discovery'}

---

`;
  }

  generateCompetitorAnalysis(competitorAnalysis) {
    if (!competitorAnalysis) return '## Competitor Analysis\n\n*Competitor data not available*\n\n---\n\n';

    return `## Competitor Analysis

### Top Competitors

${competitorAnalysis.topCompetitors?.map((comp, index) => `
#### ${index + 1}. ${comp.name}
- **Size:** ${comp.size}
- **Revenue:** ${comp.revenue}
- **Industry:** ${comp.industry}
- **Competitive Score:** ${comp.competitorScore}/100
`).join('') || '#### Major Industry Players\n- Established content creators in your niche\n- Regular publishing schedule\n- Strong audience engagement'}

### Industry Benchmarks

${competitorAnalysis.industryBenchmarks ? `
- **Average Company Size:** ${competitorAnalysis.industryBenchmarks.averageSize}
- **Average Revenue:** ${competitorAnalysis.industryBenchmarks.averageRevenue}
- **Competitive Intensity:** ${competitorAnalysis.industryBenchmarks.competitiveIntensity}
` : '- Competitive market with opportunities for differentiation'}

### Competitive Gaps & Opportunities

${competitorAnalysis.competitiveGaps?.map(gap => `- ${gap}`).join('\n') || '- Content personalization opportunities\n- Underserved audience segments\n- Emerging technology adoption'}

### Differentiation Strategies

${competitorAnalysis.differentiationOpportunities?.map(opp => `- ${opp}`).join('\n') || '- Unique perspective on industry topics\n- Higher production quality\n- More practical examples'}

### Collaboration Opportunities

${competitorAnalysis.collaborationOpportunities?.map(opp => `- ${opp}`).join('\n') || '- Guest appearances\n- Cross-promotion\n- Joint industry projects'}

---

`;
  }

  generateUploadSchedule(uploadSchedule) {
    if (!uploadSchedule) return '## Recommended Upload Schedule\n\n*Schedule recommendations not available*\n\n---\n\n';

    return `## Recommended Upload Schedule

### Optimal Frequency
**${uploadSchedule.frequency}** uploads based on your current capacity and audience engagement patterns.

### Best Posting Times
${uploadSchedule.optimalTimes?.map(time => `- ${time}`).join('\n') || '- Tuesday 2:00 PM\n- Thursday 10:00 AM\n- Saturday 9:00 AM'}

### Weekly Schedule

${Object.entries(uploadSchedule.weeklySchedule || {}).map(([day, time]) => `
- **${day}:** ${time}
`).join('') || '- **Tuesday:** 2:00 PM\n- **Thursday:** 10:00 AM'}

### Seasonal Adjustments

${Object.entries(uploadSchedule.seasonalAdjustments || {}).map(([period, adjustment]) => `
#### ${period}
${adjustment}
`).join('') || '#### Q1 (Jan-Mar)\nFocus on New Year productivity content\n\n#### Q2 (Apr-Jun)\nSpring growth and development topics'}

---

`;
  }

  generateGrowthOpportunities(growthOpportunities) {
    if (!growthOpportunities) return '## Growth Opportunities\n\n*Growth opportunities not available*\n\n---\n\n';

    return `## Growth Opportunities

${growthOpportunities.map((opp, index) => `
### ${index + 1}. ${opp.type}

**Description:** ${opp.description}  
**Growth Potential:** ${opp.potential}  
**Timeline:** ${opp.timeline}  

`).join('') || '### 1. Content Optimization\n\n**Description:** Optimize underperforming content\n**Growth Potential:** Medium\n**Timeline:** 1-2 months\n\n### 2. Audience Expansion\n\n**Description:** Reach new audience segments\n**Growth Potential:** High\n**Timeline:** 3-6 months'}

---

`;
  }

  generateContentTrends(contentTrends) {
    if (!contentTrends) return '## Content Trend Analysis\n\n*Content trend analysis not available*\n\n---\n\n';

    return `## 🔥 Content Trend Analysis

### Rising Content Performance

${contentTrends.risingContent && contentTrends.risingContent.length > 0 ? 
contentTrends.risingContent.map((content, index) => `
#### ${index + 1}. ${content.title}

**Status:** ${content.status.toUpperCase()} (${content.performanceScore}/100)  
**Age:** ${content.hoursOld} hours  
**Projected Peak:** ${content.projectedPeak ? `${this.formatNumber(content.projectedPeak.estimatedPeakViews)} views in ${content.projectedPeak.estimatedPeakTimeHours}h` : 'Analyzing...'}

**Why This Content is Rising:**
${content.trendReasons.map(reason => `- **${reason.factor}** (${reason.impact} Impact): ${reason.description}`).join('\n')}

**Performance Metrics:**
- View Velocity: ${Math.round(content.metrics?.viewVelocity || 0)} views/hour
- Engagement Rate: ${(content.metrics?.engagementRate || 0).toFixed(1)}%
- Comment Velocity: ${Math.round(content.metrics?.commentVelocity || 0)} comments/hour
- Share Projection: ${content.metrics?.shareProjection || 'Medium'}

**Recommended Actions:**
${content.recommendedActions ? content.recommendedActions.map(action => `- ${action}`).join('\n') : '- Monitor performance closely\n- Boost promotion efforts\n- Create similar content'}

`).join('') : '**No rising content detected** in the current analysis window (7 days). This could indicate:\n- All content is in stable/mature phase\n- Recent uploads haven\'t gained momentum yet\n- Opportunity to create more engaging content\n\n'}

### Trending Success Patterns

${contentTrends.trendingReasons ? `
#### Top Success Factors

${contentTrends.trendingReasons.topReasons.map((reason, index) => `
${index + 1}. **${reason.reason}** - Found in ${reason.frequency} rising video(s)
`).join('')}

#### Market Pattern Analysis

${contentTrends.trendingReasons.overallPattern}

${contentTrends.trendingReasons.marketInsights && contentTrends.trendingReasons.marketInsights.length > 0 ? `
#### Strategic Market Insights

${contentTrends.trendingReasons.marketInsights.map(insight => `
**${insight.insight}**  
*Recommended Action:* ${insight.action}  
*Opportunity:* ${insight.opportunity}
`).join('')}
` : ''}

${contentTrends.trendingReasons.trendingTopics && contentTrends.trendingReasons.trendingTopics.length > 0 ? `
#### Hot Content Categories

${contentTrends.trendingReasons.trendingTopics.map(topic => `- **${topic.topic}**: ${topic.frequency} rising videos`).join('\n')}
` : ''}
` : 'Analyzing trending patterns...'}

### Content Opportunities Identified

${contentTrends.contentOpportunities && contentTrends.contentOpportunities.length > 0 ? 
contentTrends.contentOpportunities.map(opp => `
#### ${opp.type} (Priority: ${opp.priority})

**Why This is an Opportunity:** ${opp.reason}

**Suggested Topics:**
${opp.suggestedTopics ? opp.suggestedTopics.map(topic => `- ${topic}`).join('\n') : '- Create content in this category\n- Research trending keywords\n- Analyze successful examples'}

**Potential Impact:** ${opp.potential}

`).join('') : 'No specific content opportunities identified - continue with current strategy.'}

### Performance Pattern Analysis

${contentTrends.performancePatterns ? `
#### Time-Based Patterns

**Best Publishing Times:**
${contentTrends.performancePatterns.timePatterns?.bestHours?.map(time => `- ${time.hour}:00 (Avg Engagement: ${time.avgEngagement.toFixed(1)}%)`).join('\n') || '- Analyze publishing times for optimization'}

**Best Publishing Days:**
${contentTrends.performancePatterns.timePatterns?.bestDays?.map(day => `- ${day.day} (Avg Engagement: ${day.avgEngagement.toFixed(1)}%)`).join('\n') || '- Analyze publishing days for optimization'}

#### Content Format Analysis

**Top Performing Keywords:**
${contentTrends.performancePatterns.contentPatterns?.topKeywords?.slice(0, 5).map(keyword => `- "${keyword.keyword}" (${keyword.avgEngagement.toFixed(1)}% avg engagement)`).join('\n') || '- Keywords analysis not available'}

**Optimal Content Length:**
${contentTrends.performancePatterns.contentPatterns?.lengthAnalysis?.map(length => `- ${length.length} videos: ${length.avgEngagement.toFixed(1)}% avg engagement`).join('\n') || '- Content length analysis not available'}
` : 'Performance pattern analysis not available'}

${contentTrends.viralPotential && contentTrends.viralPotential.length > 0 ? `
### ⚡ Viral Potential Assessment

${contentTrends.viralPotential.map(candidate => `
#### ${candidate.title}

**Viral Score:** ${candidate.viralScore}/100

**Viral Success Factors:**
${candidate.viralFactors.map(factor => `- ${factor}`).join('\n')}

**Recommendation:** ${candidate.recommendation}

`).join('')}
` : ''}

### Key Takeaways

Based on the content trend analysis:

1. **Content with Momentum:** ${contentTrends.risingContent?.length || 0} videos showing positive trends
2. **Primary Success Driver:** ${contentTrends.trendingReasons?.topReasons?.[0]?.reason || 'Analyzing patterns...'}
3. **Market Opportunity:** ${contentTrends.contentOpportunities?.[0]?.type || 'Continue current strategy'}
4. **Viral Potential:** ${contentTrends.viralPotential?.length || 0} video(s) with high viral probability

### Next Steps for Rising Content

1. **Monitor Rising Videos:** Track performance of identified rising content hourly
2. **Amplify Success:** Increase promotion for trending content immediately  
3. **Replicate Patterns:** Create new content using successful elements
4. **Capitalize on Trends:** Develop content around identified opportunities
5. **Optimize Timing:** Use performance patterns to optimize publishing schedule

---

`;
  }

  generateActionPlan(analysisData) {
    return `## Action Plan

### Week 1-2: Immediate Actions
- [ ] Optimize your top 5 video titles and descriptions
- [ ] Create content calendar for the next 4 weeks
- [ ] Set up consistent upload schedule based on recommendations
- [ ] Engage with your audience through comments and community posts

### Month 1: Short-term Improvements
- [ ] Implement recommended content formats (tutorials, quick tips)
- [ ] Create content around trending topics identified in analysis
- [ ] Analyze competitor strategies and identify differentiation opportunities
- [ ] Optimize video thumbnails for better click-through rates

### Month 2-3: Strategy Refinement
- [ ] Launch new content series based on audience insights
- [ ] Experiment with optimal posting times identified in analysis
- [ ] Collaborate with industry influencers or complementary creators
- [ ] Implement audience segmentation strategies

### Month 4-6: Scale and Optimize
- [ ] Develop monetization strategies (if not already implemented)
- [ ] Expand to additional platforms based on audience preferences
- [ ] Create premium content offerings
- [ ] Build community engagement through Discord/membership programs

### Month 6-12: Long-term Growth
- [ ] Develop comprehensive educational courses
- [ ] Establish thought leadership in your niche
- [ ] Consider speaking opportunities and industry partnerships
- [ ] Scale content production with potential team expansion

---

`;
  }

  generateAppendix(analysisData) {
    return `## Data Sources & Methodology

### Data Sources Used
${analysisData.metadata?.dataSourcesUsed ? `
- **YouTube Analytics:** ${analysisData.metadata.dataSourcesUsed.youtube ? '✓ Available' : '✗ Not Available'}
- **Explorium Business Intelligence:** ${analysisData.metadata.dataSourcesUsed.explorium ? '✓ Available' : '✗ Not Available'}
` : '- YouTube API for channel metrics and video performance\n- Explorium API for market intelligence and competitor analysis'}

### Analysis Methodology
1. **Data Collection:** Gathered channel metrics, video performance data, and market intelligence
2. **Performance Analysis:** Calculated engagement rates, growth trends, and content effectiveness
3. **Market Research:** Analyzed competitor landscape and industry trends
4. **AI-Powered Insights:** Used machine learning algorithms to identify patterns and opportunities
5. **Strategic Recommendations:** Generated actionable insights based on data analysis

### Report Limitations
- Analysis based on publicly available data and may not reflect private metrics
- Market intelligence data accuracy depends on data source coverage
- Recommendations are general guidelines and should be adapted to specific circumstances
- Trends and opportunities may change over time and should be regularly reviewed

### Next Steps
- Implement recommended strategies and monitor performance
- Regular analysis updates recommended every 3-6 months
- Track key metrics to measure improvement and strategy effectiveness
- Adjust recommendations based on performance data and market changes

---

**Report Generated by Smart Content Strategy System**  
*Powered by AI-driven insights from YouTube and Explorium APIs*

`;
  }

  // Helper methods
  getHealthAssessment(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'below average';
  }

  getTopStrength(healthScore) {
    if (!healthScore?.breakdown) return 'Content creation consistency';
    
    const breakdown = healthScore.breakdown;
    const scores = {
      'Audience engagement': breakdown.engagement || 0,
      'Content consistency': breakdown.consistency || 0,
      'Growth trajectory': breakdown.growth || 0,
      'Market alignment': breakdown.marketAlignment || 0,
      'Content quality': breakdown.contentQuality || 0
    };

    return Object.entries(scores).sort(([,a], [,b]) => b - a)[0][0];
  }

  getTopWeakness(healthScore) {
    if (!healthScore?.breakdown) return 'Audience engagement optimization';
    
    const breakdown = healthScore.breakdown;
    const scores = {
      'Audience engagement': breakdown.engagement || 0,
      'Content consistency': breakdown.consistency || 0,
      'Growth trajectory': breakdown.growth || 0,
      'Market alignment': breakdown.marketAlignment || 0,
      'Content quality': breakdown.contentQuality || 0
    };

    return Object.entries(scores).sort(([,a], [,b]) => a - b)[0][0];
  }

  getImmediateActions(analysisData) {
    const actions = analysisData.contentRecommendations?.nextActions?.filter(a => a.priority === 'High') || [];
    return actions.length > 0 ? actions[0].action : 'Optimize video titles and descriptions';
  }

  getShortTermGoals(analysisData) {
    const opportunities = analysisData.growthOpportunities?.filter(o => o.timeline.includes('month')) || [];
    return opportunities.length > 0 ? opportunities[0].description : 'Improve content consistency and engagement';
  }

  getLongTermVision(analysisData) {
    const opportunities = analysisData.growthOpportunities?.filter(o => o.timeline.includes('6') || o.timeline.includes('12')) || [];
    return opportunities.length > 0 ? opportunities[0].description : 'Establish thought leadership and expand audience reach';
  }

  generateHealthChart(score) {
    const filled = Math.floor(score / 5);
    const empty = 20 - filled;
    return `${'█'.repeat(filled)}${'░'.repeat(empty)} ${score}%`;
  }

  getScoreAssessment(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  }

  formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  calculateEngagementRate(video) {
    const views = parseInt(video.viewCount) || 0;
    const likes = parseInt(video.likeCount) || 0;
    const comments = parseInt(video.commentCount) || 0;
    
    if (views === 0) return '0.0';
    return (((likes + comments) / views) * 100).toFixed(1);
  }

  calculateAverageEngagement(videos) {
    if (!videos || videos.length === 0) return '0.0';
    
    const totalEngagement = videos.reduce((sum, video) => {
      return sum + parseFloat(this.calculateEngagementRate(video));
    }, 0);

    return (totalEngagement / videos.length).toFixed(1);
  }

  analyzeContentCategories(videos) {
    if (!videos || videos.length === 0) return 'Mixed content';
    
    const categories = {};
    videos.forEach(video => {
      const title = (video.title || '').toLowerCase();
      if (title.includes('tutorial')) categories.tutorial = (categories.tutorial || 0) + 1;
      else if (title.includes('review')) categories.review = (categories.review || 0) + 1;
      else if (title.includes('tips')) categories.tips = (categories.tips || 0) + 1;
      else categories.other = (categories.other || 0) + 1;
    });

    const topCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];
    return topCategory ? `Primarily ${topCategory[0]} content` : 'Mixed content';
  }

  analyzePublishingFrequency(videos) {
    if (!videos || videos.length < 2) return 'Irregular';
    
    const dates = videos.map(v => new Date(v.publishedAt)).sort((a, b) => b - a);
    const intervals = [];
    
    for (let i = 1; i < Math.min(dates.length, 10); i++) {
      const days = (dates[i-1] - dates[i]) / (1000 * 60 * 60 * 24);
      intervals.push(days);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    
    if (avgInterval <= 3) return 'Daily';
    if (avgInterval <= 7) return 'Weekly';
    if (avgInterval <= 14) return 'Bi-weekly';
    if (avgInterval <= 30) return 'Monthly';
    return 'Irregular';
  }
}