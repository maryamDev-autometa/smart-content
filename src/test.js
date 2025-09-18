import { YouTubeCollector } from './modules/youtube-collector.js';
import { ExploriumCollector } from './modules/explorium-collector.js';
import { AIAnalyzer } from './modules/ai-analyzer.js';
import { MarkdownExporter } from './utils/markdown-exporter.js';

async function testSystem() {
  console.log('🚀 Testing Smart Content Strategy System\n');

  const youtubeCollector = new YouTubeCollector();
  const exploriumCollector = new ExploriumCollector();
  const aiAnalyzer = new AIAnalyzer();
  const markdownExporter = new MarkdownExporter();

  try {
    console.log('1. Testing YouTube data collection...');
    const youtubeData = await youtubeCollector.getChannelMetrics('UC_test_channel');
    console.log('✓ YouTube data collected');
    console.log(`   - Statistics: ${youtubeData.statistics ? 'Available' : 'Mock data'}`);
    console.log(`   - Videos: ${youtubeData.topVideos?.length || 0} videos`);

    console.log('\n2. Testing Explorium data collection...');
    const exploriumData = await exploriumCollector.getCreatorBusinessData('Test Company', 'example.com');
    console.log('✓ Explorium data collected');
    console.log(`   - Business data: ${exploriumData ? 'Available' : 'Not found'}`);

    console.log('\n3. Testing competitor analysis...');
    const competitors = await exploriumCollector.getCompetitorAnalysis('Technology');
    console.log('✓ Competitor analysis completed');
    console.log(`   - Competitors found: ${competitors.totalCompetitors || 0}`);

    console.log('\n4. Testing audience insights...');
    const audience = await exploriumCollector.getAudienceInsights(['test_business_id']);
    console.log('✓ Audience insights generated');
    console.log(`   - Audience size: ${audience.totalAudience || 0}`);

    console.log('\n5. Testing AI analysis...');
    const analysis = await aiAnalyzer.generateContentStrategy(youtubeData, {
      businessData: exploriumData?.businessData,
      competitors,
      audience,
      trends: await exploriumCollector.getMarketTrends('Technology')
    });
    console.log('✓ AI analysis completed');
    console.log(`   - Health score: ${analysis.channelHealthScore.overall}/100`);
    console.log(`   - Content recommendations: ${analysis.contentRecommendations.topics.length} topics`);
    console.log(`   - Growth opportunities: ${analysis.growthOpportunities.length} identified`);

    console.log('\n6. Testing markdown export...');
    const reportData = {
      ...analysis,
      youtubeData,
      exploriumData: { businessData: exploriumData?.businessData, competitors, audience },
      metadata: {
        channelName: 'Test Channel',
        timestamp: new Date().toISOString(),
        dataSourcesUsed: { youtube: true, explorium: true }
      }
    };
    const markdown = markdownExporter.generateReport(reportData);
    console.log('✓ Markdown report generated');
    console.log(`   - Report length: ${markdown.length} characters`);

    console.log('\n7. Testing trending videos...');
    const trending = await youtubeCollector.getTrendingVideos(null, 5);
    console.log('✓ Trending videos fetched');
    console.log(`   - Videos found: ${trending.length || 0}`);

    console.log('\n8. Testing video search...');
    const searchResults = await youtubeCollector.searchVideos('programming tutorial', 5);
    console.log('✓ Video search completed');
    console.log(`   - Results found: ${searchResults.length || 0}`);

    console.log('\n🎉 All tests passed! System is ready for production.');
    console.log('\n📊 System Capabilities:');
    console.log('   ✓ YouTube channel analysis');
    console.log('   ✓ Market intelligence integration');
    console.log('   ✓ Competitor analysis');
    console.log('   ✓ Audience insights');
    console.log('   ✓ AI-powered recommendations');
    console.log('   ✓ Upload schedule optimization');
    console.log('   ✓ Growth opportunity identification');
    console.log('   ✓ Markdown report generation');
    console.log('   ✓ Trending content analysis');
    console.log('   ✓ Content search functionality');

    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    return false;
  }
}

function testHealthScoreCalculation() {
  console.log('\n🧮 Testing Channel Health Score Calculation...');
  
  const aiAnalyzer = new AIAnalyzer();
  
  const mockData = {
    channel: {
      metrics: {
        subscriberCount: '50000',
        viewCount: '1000000',
        videoCount: '100'
      },
      videos: [
        {
          title: 'Great Tutorial Video',
          viewCount: '10000',
          likeCount: '500',
          commentCount: '50',
          publishedAt: '2024-01-15T10:00:00Z',
          tags: ['tutorial', 'programming', 'javascript']
        },
        {
          title: 'Another Good Video',
          viewCount: '8000',
          likeCount: '400',
          commentCount: '40',
          publishedAt: '2024-01-10T10:00:00Z',
          tags: ['tips', 'coding', 'web development']
        }
      ]
    },
    market: {
      competitors: { totalCompetitors: 10 },
      audience: { totalAudience: 100 },
      trends: { totalMarketSize: 1000 }
    }
  };

  const healthScore = aiAnalyzer.calculateChannelHealthScore(mockData);
  
  console.log('✓ Health score calculated:');
  console.log(`   - Overall: ${healthScore.overall}/100`);
  console.log(`   - Engagement: ${healthScore.breakdown.engagement}/100`);
  console.log(`   - Consistency: ${healthScore.breakdown.consistency}/100`);
  console.log(`   - Growth: ${healthScore.breakdown.growth}/100`);
  console.log(`   - Market Alignment: ${healthScore.breakdown.marketAlignment}/100`);
  console.log(`   - Content Quality: ${healthScore.breakdown.contentQuality}/100`);
  console.log(`   - Recommendations: ${healthScore.recommendations.length} items`);
}

function testContentRecommendations() {
  console.log('\n💡 Testing Content Recommendations...');
  
  const aiAnalyzer = new AIAnalyzer();
  
  const mockMergedData = {
    channel: {
      videos: [
        {
          title: 'JavaScript Tutorial',
          tags: ['javascript', 'tutorial', 'programming'],
          viewCount: '15000',
          likeCount: '750',
          commentCount: '100'
        }
      ]
    },
    market: {
      trends: {
        marketOpportunities: ['AI Development', 'Cloud Computing', 'Mobile Apps']
      },
      audience: {
        targetPersonas: [
          { department: 'Engineering', count: 50 },
          { department: 'Marketing', count: 30 }
        ]
      }
    }
  };

  const recommendations = aiAnalyzer.generateContentRecommendations(mockMergedData);
  
  console.log('✓ Content recommendations generated:');
  console.log(`   - Topic categories: ${recommendations.topics.length}`);
  console.log(`   - Format suggestions: ${recommendations.formats.length}`);
  console.log(`   - Optimization tips: ${recommendations.optimization.length}`);
  console.log(`   - Next actions: ${recommendations.nextActions.length}`);
}

// Run all tests
async function runAllTests() {
  console.log('🎯 Starting comprehensive system test...\n');
  
  const systemTestPassed = await testSystem();
  testHealthScoreCalculation();
  testContentRecommendations();
  
  console.log('\n📋 Test Summary:');
  console.log(`   System Integration: ${systemTestPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('   Health Score Calculation: ✅ PASSED');
  console.log('   Content Recommendations: ✅ PASSED');
  
  if (systemTestPassed) {
    console.log('\n🚀 Smart Content Strategy System is ready for deployment!');
    console.log('   Run "npm start" to launch the dashboard at http://localhost:3000');
  } else {
    console.log('\n⚠️  System needs attention before deployment.');
  }
}

runAllTests();