/**
 * Scheduled Data Refresh Service
 * Automatically refreshes data at specified intervals
 */

import cron from 'node-cron';
import { DataRefreshService } from '../../scripts/refresh-data.js';

export class ScheduledRefreshService {
    constructor() {
        this.refreshService = new DataRefreshService();
        this.activeJobs = new Map();
        this.refreshHistory = [];
        this.maxHistorySize = 50;
    }

    /**
     * Schedule automatic data refresh
     * @param {string} schedule - Cron schedule (e.g., '0 *\/6 * * *' for every 6 hours)
     * @param {string} channelHandle - Channel to refresh
     * @param {Object} options - Additional options
     */
    scheduleRefresh(schedule = '0 */6 * * *', channelHandle = '@AILABS-393', options = {}) {
        const jobId = `refresh-${channelHandle}-${Date.now()}`;
        
        console.log(`📅 Scheduling refresh for ${channelHandle}`);
        console.log(`⏰ Schedule: ${schedule} (${this.describeCronSchedule(schedule)})`);

        const task = cron.schedule(schedule, async () => {
            try {
                console.log(`\n🔄 [SCHEDULED] Starting refresh for ${channelHandle}...`);
                const startTime = Date.now();
                
                const results = await this.refreshService.refreshAllData(channelHandle);
                
                const duration = Date.now() - startTime;
                console.log(`✅ [SCHEDULED] Refresh completed in ${duration}ms`);
                
                // Store in history
                this.addToHistory({
                    timestamp: new Date().toISOString(),
                    channelHandle,
                    duration,
                    status: 'SUCCESS',
                    dataQuality: results.summary.dataQuality,
                    keyMetrics: results.summary.keyMetrics
                });

                // Optional callback
                if (options.onSuccess) {
                    options.onSuccess(results);
                }

            } catch (error) {
                console.error(`❌ [SCHEDULED] Refresh failed for ${channelHandle}:`, error.message);
                
                this.addToHistory({
                    timestamp: new Date().toISOString(),
                    channelHandle,
                    duration: null,
                    status: 'FAILED',
                    error: error.message
                });

                // Optional error callback
                if (options.onError) {
                    options.onError(error);
                }
            }
        }, {
            scheduled: false,
            timezone: options.timezone || 'America/New_York'
        });

        // Store job reference
        this.activeJobs.set(jobId, {
            task,
            schedule,
            channelHandle,
            createdAt: new Date().toISOString(),
            options
        });

        // Start the job
        task.start();
        console.log(`✅ Scheduled job created: ${jobId}`);
        
        return jobId;
    }

    /**
     * Cancel a scheduled refresh job
     */
    cancelRefresh(jobId) {
        const job = this.activeJobs.get(jobId);
        if (job) {
            job.task.stop();
            job.task.destroy();
            this.activeJobs.delete(jobId);
            console.log(`🛑 Cancelled scheduled refresh: ${jobId}`);
            return true;
        }
        return false;
    }

    /**
     * Get status of all active jobs
     */
    getActiveJobs() {
        const jobs = [];
        for (const [jobId, job] of this.activeJobs) {
            jobs.push({
                jobId,
                channelHandle: job.channelHandle,
                schedule: job.schedule,
                scheduleDescription: this.describeCronSchedule(job.schedule),
                createdAt: job.createdAt,
                isRunning: job.task.running
            });
        }
        return jobs;
    }

    /**
     * Get refresh history
     */
    getRefreshHistory(limit = 10) {
        return this.refreshHistory
            .slice(-limit)
            .reverse(); // Most recent first
    }

    /**
     * Manual refresh trigger
     */
    async triggerManualRefresh(channelHandle = '@AILABS-393') {
        console.log(`🔄 [MANUAL] Triggering manual refresh for ${channelHandle}...`);
        
        try {
            const startTime = Date.now();
            const results = await this.refreshService.refreshAllData(channelHandle);
            const duration = Date.now() - startTime;
            
            this.addToHistory({
                timestamp: new Date().toISOString(),
                channelHandle,
                duration,
                status: 'SUCCESS',
                type: 'MANUAL',
                dataQuality: results.summary.dataQuality,
                keyMetrics: results.summary.keyMetrics
            });

            console.log(`✅ [MANUAL] Manual refresh completed in ${duration}ms`);
            return results;

        } catch (error) {
            this.addToHistory({
                timestamp: new Date().toISOString(),
                channelHandle,
                duration: null,
                status: 'FAILED',
                type: 'MANUAL',
                error: error.message
            });

            console.error(`❌ [MANUAL] Manual refresh failed:`, error.message);
            throw error;
        }
    }

    /**
     * Set up common refresh schedules
     */
    setupCommonSchedules(channelHandle = '@AILABS-393') {
        const schedules = {
            // Every 6 hours
            frequent: this.scheduleRefresh('0 */6 * * *', channelHandle, {
                onSuccess: (results) => console.log(`📊 Frequent refresh completed for ${channelHandle}`)
            }),
            
            // Daily at 3 AM
            daily: this.scheduleRefresh('0 3 * * *', channelHandle, {
                onSuccess: (results) => console.log(`📅 Daily refresh completed for ${channelHandle}`)
            }),

            // Weekly on Sundays at 2 AM
            weekly: this.scheduleRefresh('0 2 * * 0', channelHandle, {
                onSuccess: (results) => console.log(`📆 Weekly refresh completed for ${channelHandle}`)
            })
        };

        console.log('✅ Common refresh schedules set up:');
        console.log('  - Frequent: Every 6 hours');
        console.log('  - Daily: Every day at 3 AM');
        console.log('  - Weekly: Every Sunday at 2 AM');

        return schedules;
    }

    /**
     * Add entry to refresh history
     */
    addToHistory(entry) {
        this.refreshHistory.push(entry);
        
        // Keep history within limit
        if (this.refreshHistory.length > this.maxHistorySize) {
            this.refreshHistory = this.refreshHistory.slice(-this.maxHistorySize);
        }
    }

    /**
     * Describe cron schedule in human terms
     */
    describeCronSchedule(schedule) {
        const descriptions = {
            '0 */6 * * *': 'Every 6 hours',
            '0 */4 * * *': 'Every 4 hours',
            '0 */2 * * *': 'Every 2 hours',
            '0 * * * *': 'Every hour',
            '0 3 * * *': 'Daily at 3:00 AM',
            '0 6 * * *': 'Daily at 6:00 AM',
            '0 12 * * *': 'Daily at 12:00 PM',
            '0 2 * * 0': 'Weekly on Sunday at 2:00 AM',
            '0 2 * * 1': 'Weekly on Monday at 2:00 AM',
            '0 0 1 * *': 'Monthly on the 1st at midnight'
        };

        return descriptions[schedule] || 'Custom schedule';
    }

    /**
     * Stop all scheduled jobs
     */
    stopAllJobs() {
        let stopped = 0;
        for (const [jobId] of this.activeJobs) {
            if (this.cancelRefresh(jobId)) {
                stopped++;
            }
        }
        console.log(`🛑 Stopped ${stopped} scheduled refresh jobs`);
        return stopped;
    }

    /**
     * Get refresh statistics
     */
    getRefreshStatistics() {
        const history = this.refreshHistory;
        const successful = history.filter(h => h.status === 'SUCCESS');
        const failed = history.filter(h => h.status === 'FAILED');
        
        const avgDuration = successful.length > 0 
            ? successful.reduce((sum, h) => sum + (h.duration || 0), 0) / successful.length 
            : 0;

        return {
            totalRefreshes: history.length,
            successful: successful.length,
            failed: failed.length,
            successRate: history.length > 0 ? (successful.length / history.length) * 100 : 0,
            averageDuration: Math.round(avgDuration),
            lastRefresh: history.length > 0 ? history[history.length - 1].timestamp : null,
            activeJobs: this.activeJobs.size
        };
    }
}

// Export singleton instance
export const scheduledRefresh = new ScheduledRefreshService();