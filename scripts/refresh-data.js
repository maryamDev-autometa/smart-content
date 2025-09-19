#!/usr/bin/env node

/**
 * Data Refresh Script - Smart Content Strategy System
 * Fetches fresh real-time data from YouTube MCP and Explorium MCP
 * Usage: node scripts/refresh-data.js [channel-handle]
 */

import { RealMCPIntegration } from '../src/modules/real-mcp-integration.js';
import { YouTubeCollectorRealTime } from '../src/modules/youtube-collector-realtime.js';
import { ExploriumCollectorReal } from '../src/modules/explorium-collector-real.js';
import { ContentTrendAnalyzer } from '../src/modules/content-trend-analyzer.js';

class DataRefreshService {
    constructor() {
        this.realMCP = new RealMCPIntegration();
        this.youtubeCollector = new YouTubeCollectorRealTime();
        this.exploriumCollector = new ExploriumCollectorReal();
        this.trendAnalyzer = new ContentTrendAnalyzer();
    }

    async refreshAllData(channelHandle = '@AILABS-393') {
        console.log('🔄 Starting Data Refresh Process...');
        console.log(`📺 Target Channel: ${channelHandle}`);
        console.log('⏰ Timestamp:', new Date().toISOString());
        console.log('=' .repeat(50));

        try {
            // Step 1: Check MCP Availability
            console.log('\n🔍 Step 1: Checking MCP Availability...');
            if (!this.realMCP.mcpAvailable) {
                throw new Error('❌ MCP tools not available - cannot fetch real data');
            }
            console.log('✅ MCP tools are available and ready');

            // Step 2: Get Channel ID from handle
            console.log('\n🔍 Step 2: Resolving Channel Handle...');
            const channelId = await this.resolveChannelHandle(channelHandle);
            console.log(`✅ Channel ID resolved: ${channelId}`);

            // Step 3: Fetch Fresh YouTube Data
            console.log('\n📺 Step 3: Fetching Fresh YouTube Data...');
            const youtubeData = await this.fetchFreshYouTubeData(channelId);
            
            // Step 4: Fetch Fresh Explorium Data
            console.log('\n🏢 Step 4: Fetching Fresh Explorium Data...');
            const exploriumData = await this.fetchFreshExploriumData(channelHandle);

            // Step 5: Analyze Content Trends
            console.log('\n📈 Step 5: Analyzing Content Trends...');
            const trendAnalysis = await this.analyzeFreshTrends(youtubeData.videos);

            // Step 6: Generate Summary Report
            console.log('\n📊 Step 6: Generating Refresh Summary...');
            const summary = this.generateRefreshSummary(youtubeData, exploriumData, trendAnalysis);

            console.log('\n🎉 Data refresh completed successfully!');
            return {
                timestamp: new Date().toISOString(),
                channelHandle,
                channelId,
                youtube: youtubeData,
                explorium: exploriumData,
                trends: trendAnalysis,
                summary
            };

        } catch (error) {
            console.error('❌ Data refresh failed:', error.message);
            throw error;
        }
    }

    async resolveChannelHandle(handle) {
        try {
            // Remove @ symbol and convert to channel ID
            const cleanHandle = handle.replace('@', '');
            
            // Known channel ID mappings for common handles
            const knownChannels = {
                'AILABS-393': 'UCelfWQr9sXVMTvBzviPGlFw',
                'AI-LABS': 'UCelfWQr9sXVMTvBzviPGlFw',
                'AILABS': 'UCelfWQr9sXVMTvBzviPGlFw',
                'GoogleDevelopers': 'UC_x5XG1OV2P6uZZ5FSM9Ttw'
            };

            if (knownChannels[cleanHandle]) {
                console.log(`🎯 Using known mapping: ${cleanHandle} -> ${knownChannels[cleanHandle]}`);
                return knownChannels[cleanHandle];
            }

            // For unknown channels, try to search
            console.log(`🔍 Searching for channel: ${cleanHandle}`);
            const searchResult = await this.realMCP.searchVideos(`channel:${cleanHandle}`, 1);
            
            if (searchResult.videos && searchResult.videos.length > 0) {
                return searchResult.videos[0].channelId;
            }
            
            throw new Error(`Channel not found: ${handle}`);
        } catch (error) {
            console.error(`Failed to resolve channel handle ${handle}:`, error.message);
            throw error;
        }
    }

    async fetchFreshYouTubeData(channelId) {
        try {
            console.log(`🔴 LIVE: Fetching fresh channel statistics for ${channelId}...`);
            
            // Get channel statistics
            const channelStats = await this.realMCP.getChannelStatistics([channelId]);
            console.log('✅ Channel statistics retrieved');

            // Get top videos from the channel
            console.log(`🔴 LIVE: Fetching top videos from channel...`);
            const topVideos = await this.realMCP.getChannelTopVideos(channelId, 10);
            console.log('✅ Top videos retrieved');

            // Get video details for trend analysis
            if (topVideos.videos && topVideos.videos.length > 0) {
                const videoIds = topVideos.videos.map(v => v.videoId);
                console.log(`🔴 LIVE: Fetching detailed video data for ${videoIds.length} videos...`);
                const videoDetails = await this.realMCP.getVideoDetails(videoIds);
                console.log('✅ Video details retrieved');

                return {
                    channelStats: channelStats.channels[0],
                    videos: videoDetails.videos,
                    topVideos: topVideos.videos,
                    refreshedAt: new Date().toISOString()
                };
            }

            return {
                channelStats: channelStats.channels[0],
                videos: [],
                topVideos: [],
                refreshedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('Failed to fetch fresh YouTube data:', error.message);
            throw new Error(`YouTube data refresh failed: ${error.message}`);
        }
    }

    async fetchFreshExploriumData(channelHandle) {
        try {
            const creatorName = channelHandle.replace('@', '').replace('-', ' ');
            console.log(`🔴 LIVE: Fetching fresh business data for: ${creatorName}`);

            // Try to get business data for the creator
            const businessData = await this.exploriumCollector.getCreatorBusinessData(creatorName);
            console.log('✅ Explorium business data retrieved');

            // Get industry trends and competitor analysis
            console.log(`🔴 LIVE: Analyzing industry trends...`);
            const industryTrends = await this.exploriumCollector.getIndustryTrends(['Technology', 'Marketing']);
            console.log('✅ Industry trends retrieved');

            return {
                businessProfile: businessData,
                industryTrends,
                refreshedAt: new Date().toISOString()
            };

        } catch (error) {
            console.warn('⚠️  Explorium data partially available:', error.message);
            
            // Return minimal data structure if Explorium fails
            return {
                businessProfile: null,
                industryTrends: null,
                refreshedAt: new Date().toISOString(),
                note: 'Explorium data not available - focusing on YouTube analytics'
            };
        }
    }

    async analyzeFreshTrends(videos) {
        try {
            console.log(`🔴 LIVE: Analyzing content trends for ${videos.length} videos...`);
            
            if (!videos || videos.length === 0) {
                console.log('⚠️  No videos available for trend analysis');
                return { trends: [], analysis: 'No video data available' };
            }

            const trendAnalysis = await this.trendAnalyzer.analyzeContentTrends(videos, 168); // 7 days
            console.log('✅ Content trend analysis completed');

            return trendAnalysis;

        } catch (error) {
            console.error('Failed to analyze trends:', error.message);
            return { trends: [], analysis: `Trend analysis failed: ${error.message}` };
        }
    }

    generateRefreshSummary(youtubeData, exploriumData, trendAnalysis) {
        const summary = {
            refreshTimestamp: new Date().toISOString(),
            dataQuality: {
                youtube: youtubeData ? 'SUCCESS' : 'FAILED',
                explorium: exploriumData && exploriumData.businessProfile ? 'SUCCESS' : 'LIMITED',
                trends: trendAnalysis && trendAnalysis.risingContent ? 'SUCCESS' : 'LIMITED'
            },
            keyMetrics: {}
        };

        // YouTube metrics
        if (youtubeData && youtubeData.channelStats) {
            const stats = youtubeData.channelStats;
            summary.keyMetrics.youtube = {
                subscriberCount: parseInt(stats.subscriberCount) || 0,
                videoCount: parseInt(stats.videoCount) || 0,
                viewCount: parseInt(stats.viewCount) || 0,
                videosAnalyzed: youtubeData.videos ? youtubeData.videos.length : 0
            };
        }

        // Trend metrics
        if (trendAnalysis && trendAnalysis.risingContent) {
            summary.keyMetrics.trends = {
                risingContentCount: trendAnalysis.risingContent.length,
                viralPotentialCount: trendAnalysis.viralPotential ? trendAnalysis.viralPotential.length : 0,
                opportunitiesFound: trendAnalysis.contentOpportunities ? trendAnalysis.contentOpportunities.length : 0
            };
        }

        return summary;
    }

    displayResults(results) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 DATA REFRESH RESULTS SUMMARY');
        console.log('='.repeat(60));
        
        // Channel Information
        if (results.youtube && results.youtube.channelStats) {
            const stats = results.youtube.channelStats;
            console.log(`\n📺 CHANNEL: ${stats.title || 'Unknown'}`);
            console.log(`👥 Subscribers: ${parseInt(stats.subscriberCount || 0).toLocaleString()}`);
            console.log(`🎥 Total Videos: ${parseInt(stats.videoCount || 0).toLocaleString()}`);
            console.log(`👀 Total Views: ${parseInt(stats.viewCount || 0).toLocaleString()}`);
        }

        // Data Quality Status
        console.log('\n🔍 DATA QUALITY STATUS:');
        const quality = results.summary.dataQuality;
        console.log(`  YouTube: ${quality.youtube === 'SUCCESS' ? '✅' : '❌'} ${quality.youtube}`);
        console.log(`  Explorium: ${quality.explorium === 'SUCCESS' ? '✅' : '⚠️'} ${quality.explorium}`);
        console.log(`  Trends: ${quality.trends === 'SUCCESS' ? '✅' : '⚠️'} ${quality.trends}`);

        // Trend Analysis
        if (results.trends && results.trends.risingContent && results.trends.risingContent.length > 0) {
            console.log('\n📈 TOP RISING CONTENT:');
            results.trends.risingContent.slice(0, 3).forEach((content, index) => {
                console.log(`  ${index + 1}. ${content.title}`);
                console.log(`     📊 Performance Score: ${content.performanceScore}/100`);
                console.log(`     🚀 Growth Rate: ${content.growthRate}%`);
            });
        }

        console.log(`\n⏰ Last Refreshed: ${results.timestamp}`);
        console.log('='.repeat(60));
    }
}

// CLI Execution
async function main() {
    const channelHandle = process.argv[2] || '@AILABS-393';
    
    console.log('🚀 Smart Content Strategy System - Data Refresh');
    console.log(`🎯 Target: ${channelHandle}`);
    
    try {
        const refreshService = new DataRefreshService();
        const results = await refreshService.refreshAllData(channelHandle);
        
        // Display results
        refreshService.displayResults(results);
        
        // Save results to file
        const fs = await import('fs');
        const outputFile = `./data-refresh-${Date.now()}.json`;
        fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
        console.log(`💾 Full results saved to: ${outputFile}`);
        
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ REFRESH FAILED:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('  1. Ensure YouTube MCP and Explorium MCP are properly connected');
        console.log('  2. Check your internet connection');
        console.log('  3. Verify the channel handle is correct');
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { DataRefreshService };