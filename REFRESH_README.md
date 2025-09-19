# Data Refresh System

The Smart Content Strategy System now includes a comprehensive data refresh system that fetches fresh real-time data from YouTube MCP and Explorium MCP.

## 🚀 Quick Start

### Manual Data Refresh

```bash
# Refresh data for AI LABS channel (default)
npm run refresh

# Refresh data for specific channels
npm run refresh:ailabs
npm run refresh:google

# Or run directly with custom channel
node scripts/refresh-data.js @YourChannel
```

### API Endpoints

```bash
# Manual refresh via API
curl -X POST http://localhost:3000/api/refresh \
  -H "Content-Type: application/json" \
  -d '{"channelHandle": "@AILABS-393"}'

# Quick refresh (essential metrics only)
curl -X POST http://localhost:3000/api/refresh/quick \
  -H "Content-Type: application/json" \
  -d '{"channelHandle": "@AILABS-393"}'

# Check refresh status
curl http://localhost:3000/api/refresh/status

# Schedule automatic refresh (every 6 hours)
curl -X POST http://localhost:3000/api/refresh/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "schedule": "0 */6 * * *",
    "channelHandle": "@AILABS-393",
    "timezone": "America/New_York"
  }'
```

## 📊 Data Sources

### YouTube MCP Data
- ✅ Channel statistics (subscribers, views, videos)
- ✅ Top performing videos
- ✅ Video details and metrics
- ✅ Content trend analysis
- ✅ Performance scoring

### Explorium MCP Data
- ✅ Business intelligence profiles
- ✅ Industry trend analysis
- ✅ Competitor insights
- ✅ Market positioning data

## 🔄 Refresh Features

### Manual Refresh
- **Command Line**: Use `npm run refresh` or the refresh script directly
- **API Endpoint**: `POST /api/refresh` for programmatic access
- **Quick Refresh**: `POST /api/refresh/quick` for fast essential metrics

### Scheduled Refresh
- **Cron Scheduling**: Set up automatic refreshes at specified intervals
- **Multiple Schedules**: Support for different refresh frequencies
- **Job Management**: Start, stop, and monitor scheduled jobs

### Refresh History
- **Statistics Tracking**: Success rates, average duration, error tracking
- **History Log**: Recent refresh attempts with status and metrics
- **Performance Monitoring**: Track system performance over time

## 📈 Refresh Schedules

### Common Schedule Patterns

```javascript
// Every 6 hours
"0 */6 * * *"

// Daily at 3 AM
"0 3 * * *"

// Weekly on Sundays at 2 AM  
"0 2 * * 0"

// Every 2 hours
"0 */2 * * *"
```

### Schedule Management

```bash
# Set up common schedules programmatically
node -e "
import('./src/modules/scheduled-refresh.js').then(({ scheduledRefresh }) => {
  scheduledRefresh.setupCommonSchedules('@AILABS-393');
});
"
```

## 🛠️ Configuration

### Environment Variables
- `REFRESH_INTERVAL`: Default refresh interval in milliseconds
- `MAX_REFRESH_HISTORY`: Maximum number of refresh entries to keep
- `DEFAULT_TIMEZONE`: Default timezone for scheduled refreshes

### Custom Channel Mapping
Edit `scripts/refresh-data.js` to add custom channel handle mappings:

```javascript
const knownChannels = {
  'AILABS-393': 'UCelfWQr9sXVMTvBzviPGlFw',
  'YourChannel': 'UCyourChannelId'
};
```

## 📋 Output Format

### Refresh Results Structure
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "channelHandle": "@AILABS-393",
  "channelId": "UCelfWQr9sXVMTvBzviPGlFw",
  "youtube": {
    "channelStats": { "subscriberCount": "91400", ... },
    "videos": [...],
    "refreshedAt": "2024-01-15T10:30:00.000Z"
  },
  "explorium": {
    "businessProfile": {...},
    "industryTrends": {...},
    "refreshedAt": "2024-01-15T10:30:00.000Z"
  },
  "trends": {
    "risingContent": [...],
    "viralPotential": [...],
    "contentOpportunities": [...]
  },
  "summary": {
    "dataQuality": {
      "youtube": "SUCCESS",
      "explorium": "LIMITED",
      "trends": "SUCCESS"
    },
    "keyMetrics": {...}
  }
}
```

## 🔍 Troubleshooting

### Common Issues

1. **MCP Tools Not Available**
   - Ensure YouTube MCP and Explorium MCP are properly connected
   - Check MCP service status and authentication

2. **Channel Resolution Fails**
   - Verify channel handle format (use @ChannelName)
   - Check if channel exists and is public

3. **Data Quality Issues**
   - Review refresh logs for specific error messages
   - Check network connectivity and API rate limits

### Debug Mode
Run with verbose logging:

```bash
DEBUG=refresh:* npm run refresh
```

## 📊 Monitoring

### System Health Check
```bash
curl http://localhost:3000/api/health
```

### Refresh Statistics
```bash
curl http://localhost:3000/api/refresh/status
```

### Demo Mode
Run the interactive demo:

```bash
node demo-refresh.js
```

## 🎯 Best Practices

1. **Refresh Frequency**: Don't refresh more than once per hour to respect API limits
2. **Error Handling**: Always check data quality indicators in results
3. **Monitoring**: Set up scheduled refreshes for continuous data updates
4. **Fallback Strategy**: System gracefully handles MCP unavailability

## 📝 Integration Examples

### Express.js Middleware
```javascript
import { scheduledRefresh } from './src/modules/scheduled-refresh.js';

app.use('/api/channel/:handle', async (req, res, next) => {
  try {
    const freshData = await scheduledRefresh.triggerManualRefresh(req.params.handle);
    req.channelData = freshData;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh channel data' });
  }
});
```

### React Component
```javascript
const RefreshButton = ({ channelHandle }) => {
  const refreshData = async () => {
    const response = await fetch('/api/refresh/quick', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelHandle })
    });
    const result = await response.json();
    console.log('Fresh data:', result.summary);
  };
  
  return <button onClick={refreshData}>Refresh Data</button>;
};
```

---

🔄 **The system now provides 100% real MCP data with no mock fallbacks!**