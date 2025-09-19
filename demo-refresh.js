#!/usr/bin/env node

/**
 * Demo Script - Data Refresh System
 * Demonstrates the data refresh capabilities with real MCP data
 */

import { DataRefreshService } from './scripts/refresh-data.js';
import { scheduledRefresh } from './src/modules/scheduled-refresh.js';

async function demonstrateRefreshSystem() {
    console.log('🚀 Data Refresh System Demo');
    console.log('=' .repeat(50));

    try {
        // 1. Test Manual Refresh
        console.log('\n📍 Step 1: Manual Data Refresh Demo');
        console.log('-'.repeat(30));
        
        const refreshService = new DataRefreshService();
        console.log('🔄 Triggering manual refresh for AI LABS channel...');
        
        const results = await refreshService.refreshAllData('@AILABS-393');
        
        console.log('✅ Manual refresh completed!');
        console.log(`📊 Channel: ${results.youtube?.channelStats?.title || 'AI LABS'}`);
        console.log(`👥 Subscribers: ${results.youtube?.channelStats?.subscriberCount || 'N/A'}`);
        console.log(`🎥 Videos: ${results.youtube?.videos?.length || 0} analyzed`);
        
        // 2. Test Scheduled Refresh Setup
        console.log('\n📍 Step 2: Scheduled Refresh Setup Demo');
        console.log('-'.repeat(30));
        
        console.log('⏰ Setting up test schedule (every 2 hours)...');
        const jobId = scheduledRefresh.scheduleRefresh(
            '0 */2 * * *', // Every 2 hours
            '@AILABS-393',
            {
                onSuccess: (results) => {
                    console.log(`✅ [SCHEDULED] Refresh completed at ${new Date().toISOString()}`);
                },
                onError: (error) => {
                    console.log(`❌ [SCHEDULED] Refresh failed: ${error.message}`);
                }
            }
        );
        
        console.log(`✅ Scheduled job created: ${jobId}`);
        console.log('📅 Schedule: Every 2 hours');
        
        // Wait a moment to show it's running
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 3. Check Status
        console.log('\n📍 Step 3: Refresh Status Demo');
        console.log('-'.repeat(30));
        
        const status = scheduledRefresh.getRefreshStatistics();
        const activeJobs = scheduledRefresh.getActiveJobs();
        
        console.log(`📈 Total refreshes: ${status.totalRefreshes}`);
        console.log(`✅ Success rate: ${status.successRate.toFixed(1)}%`);
        console.log(`⚡ Active jobs: ${status.activeJobs}`);
        console.log(`🕐 Last refresh: ${status.lastRefresh || 'Just now'}`);
        
        if (activeJobs.length > 0) {
            console.log('\n🔄 Active scheduled jobs:');
            activeJobs.forEach(job => {
                console.log(`  - ${job.channelHandle}: ${job.scheduleDescription}`);
            });
        }
        
        // 4. Quick Refresh Test
        console.log('\n📍 Step 4: Quick Refresh Demo');
        console.log('-'.repeat(30));
        
        console.log('⚡ Triggering quick refresh...');
        const quickResults = await scheduledRefresh.triggerManualRefresh('@AILABS-393');
        
        console.log('✅ Quick refresh completed!');
        console.log('📊 Summary available in refresh history');
        
        // 5. Cleanup Demo Job
        console.log('\n📍 Step 5: Cleanup Demo');
        console.log('-'.repeat(30));
        
        console.log(`🛑 Cancelling demo scheduled job: ${jobId}`);
        const cancelled = scheduledRefresh.cancelRefresh(jobId);
        
        if (cancelled) {
            console.log('✅ Demo job cancelled successfully');
        } else {
            console.log('⚠️  Demo job was already cancelled');
        }
        
        // Final Status
        console.log('\n📍 Final System Status');
        console.log('-'.repeat(30));
        
        const finalStats = scheduledRefresh.getRefreshStatistics();
        const history = scheduledRefresh.getRefreshHistory(3);
        
        console.log(`📈 Total refreshes completed: ${finalStats.totalRefreshes}`);
        console.log(`⏱️  Average duration: ${finalStats.averageDuration}ms`);
        console.log(`🎯 Success rate: ${finalStats.successRate.toFixed(1)}%`);
        
        if (history.length > 0) {
            console.log('\n📜 Recent refresh history:');
            history.forEach((entry, index) => {
                const status = entry.status === 'SUCCESS' ? '✅' : '❌';
                const time = new Date(entry.timestamp).toLocaleTimeString();
                console.log(`  ${index + 1}. ${status} ${entry.channelHandle} at ${time}`);
            });
        }
        
        console.log('\n🎉 Data Refresh System Demo Completed Successfully!');
        console.log('\n💡 Available Commands:');
        console.log('  npm run refresh - Refresh AI LABS data');
        console.log('  npm run refresh:google - Refresh Google Developers data');
        console.log('  node demo-refresh.js - Run this demo again');
        
    } catch (error) {
        console.error('\n❌ Demo failed:', error.message);
        console.log('\n🔍 This might happen if:');
        console.log('  - MCP tools are not properly connected');
        console.log('  - Network connectivity issues');
        console.log('  - Channel handle resolution fails');
        console.log('\n💡 Try running: npm run refresh:ailabs');
    }
}

// Run the demo
demonstrateRefreshSystem();