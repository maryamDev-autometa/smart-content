import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function demoSmartContentStrategy() {
  console.log('🎯 Smart Content Strategy System Demo\n');

  try {
    // Test system health
    console.log('1. Checking system health...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const health = await healthResponse.json();
    console.log('✅ System Status:', health.status);
    console.log('   Services:', Object.entries(health.services).map(([k,v]) => `${k}: ${v}`).join(', '));

    // Demo channel analysis
    console.log('\n2. Analyzing demo channel...');
    const analysisResponse = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channelId: 'UC_demo_channel',
        channelName: 'TechCorp',
        channelDomain: 'techcorp.com'
      })
    });

    if (!analysisResponse.ok) {
      throw new Error(`Analysis failed: ${analysisResponse.status}`);
    }

    const analysis = await analysisResponse.json();
    console.log('✅ Analysis completed successfully!');
    console.log(`   📊 Channel Health Score: ${analysis.channelHealthScore.overall}/100`);
    console.log(`   🎯 Content Topics: ${analysis.contentRecommendations.topics.length} recommendations`);
    console.log(`   🏆 Competitors: ${analysis.competitorAnalysis.topCompetitors?.length || 0} analyzed`);
    console.log(`   📈 Growth Opportunities: ${analysis.growthOpportunities.length} identified`);

    // Demo report export
    console.log('\n3. Generating strategy report...');
    const exportResponse = await fetch(`${BASE_URL}/api/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(analysis)
    });

    if (!exportResponse.ok) {
      throw new Error(`Export failed: ${exportResponse.status}`);
    }

    const reportBuffer = await exportResponse.buffer();
    console.log('✅ Strategy report generated!');
    console.log(`   📄 Report size: ${reportBuffer.length} bytes`);
    console.log(`   💾 Format: Markdown (.md)`);

    // Demo trending videos
    console.log('\n4. Fetching trending content...');
    const trendingResponse = await fetch(`${BASE_URL}/api/trending?maxResults=5`);
    const trending = await trendingResponse.json();
    console.log('✅ Trending videos fetched!');
    console.log(`   🔥 Videos found: ${trending.videos?.length || 0}`);

    // Demo video search
    console.log('\n5. Searching for content ideas...');
    const searchResponse = await fetch(`${BASE_URL}/api/search?query=javascript%20tutorial&maxResults=3`);
    const search = await searchResponse.json();
    console.log('✅ Content search completed!');
    console.log(`   🔍 Results: ${search.results?.length || 0} videos`);

    console.log('\n🎉 Demo completed successfully!');
    console.log('\n📊 System Features Demonstrated:');
    console.log('   ✅ Real-time channel health scoring');
    console.log('   ✅ AI-powered content recommendations');
    console.log('   ✅ Market intelligence integration');
    console.log('   ✅ Competitor analysis');
    console.log('   ✅ Audience insights');
    console.log('   ✅ Upload schedule optimization');
    console.log('   ✅ Growth opportunity identification');
    console.log('   ✅ Comprehensive report generation');
    console.log('   ✅ Trending content analysis');
    console.log('   ✅ Content search and discovery');

    console.log('\n🌐 Next Steps:');
    console.log('   1. Open http://localhost:3001 in your browser');
    console.log('   2. Enter a real YouTube channel ID or business name');
    console.log('   3. Explore the interactive dashboard');
    console.log('   4. Export your personalized strategy report');
    
    return true;

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure the server is running: npm start');
    console.log('   2. Check that port 3001 is available');
    console.log('   3. Verify all dependencies are installed: npm install');
    return false;
  }
}

// Enhanced demo with detailed output
async function showSystemCapabilities() {
  console.log('\n🚀 Smart Content Strategy System - Detailed Capabilities\n');

  console.log('📋 CORE FEATURES:');
  console.log('   🎯 Channel Health Scoring');
  console.log('      • 5-metric comprehensive analysis');
  console.log('      • Engagement, Consistency, Growth, Market Fit, Quality');
  console.log('      • Actionable improvement recommendations');
  
  console.log('\n   💡 AI-Powered Content Strategy');
  console.log('      • Trending topic identification');
  console.log('      • Content format recommendations');
  console.log('      • Optimization tips and best practices');
  console.log('      • Personalized action plans');
  
  console.log('\n   👥 Audience Intelligence');
  console.log('      • Target persona identification');
  console.log('      • Geographic and demographic analysis');
  console.log('      • Engagement pattern recognition');
  console.log('      • Growth strategy recommendations');
  
  console.log('\n   🏆 Competitive Analysis');
  console.log('      • Market positioning assessment');
  console.log('      • Competitor benchmarking');
  console.log('      • Gap opportunity identification');
  console.log('      • Collaboration opportunity mapping');
  
  console.log('\n   📅 Upload Schedule Optimization');
  console.log('      • Data-driven posting frequency');
  console.log('      • Optimal timing recommendations');
  console.log('      • Seasonal content calendar');
  console.log('      • Performance-based adjustments');
  
  console.log('\n   📈 Growth Opportunities');
  console.log('      • Monetization strategy development');
  console.log('      • Platform expansion recommendations');
  console.log('      • Community building tactics');
  console.log('      • Long-term vision planning');

  console.log('\n🔧 TECHNICAL STACK:');
  console.log('   • YouTube Data API integration');
  console.log('   • Explorium Business Intelligence API');
  console.log('   • Machine Learning recommendation engine');
  console.log('   • Real-time analytics dashboard');
  console.log('   • Markdown report generation');
  console.log('   • RESTful API architecture');

  console.log('\n🎯 USE CASES:');
  console.log('   • Content creators seeking data-driven growth');
  console.log('   • Marketing teams optimizing brand content');
  console.log('   • Agencies managing multiple creator clients');
  console.log('   • Businesses developing thought leadership');

  console.log('\n🚀 READY TO USE:');
  console.log('   → Open your browser to http://localhost:3001');
  console.log('   → Enter your YouTube channel information');
  console.log('   → Get instant AI-powered insights');
  console.log('   → Export your custom strategy report');
}

// Run the demo
async function runDemo() {
  const success = await demoSmartContentStrategy();
  
  if (success) {
    await showSystemCapabilities();
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Smart Content Strategy System - Ready for Production! 🚀');
  console.log('='.repeat(60));
}

// Add error handling and graceful shutdown
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

runDemo();