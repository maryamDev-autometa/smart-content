# 🔴 Real-Time MCP Integration Setup

## Current Status
- **Demo Mode**: ✅ Active (using realistic mock data)
- **Live MCP Mode**: ⚠️ Requires Claude Code environment with MCP tools

## How to Enable Real YouTube & Explorium Data

### Option 1: Run in Claude Code with MCP Tools
When this system runs in a Claude Code environment with YouTube MCP and Explorium MCP tools available, it will automatically detect and use real-time data.

**Indicators of Live Mode:**
- Console shows: `🔴 LIVE: Fetching real YouTube channel statistics...`
- Console shows: `🔴 LIVE: Fetching real business data...`
- No "mock data" warnings

### Option 2: Manual MCP Integration
To integrate with real MCP tools in your environment:

1. **Install MCP Tools**:
   ```bash
   # Install YouTube MCP
   npm install @anthropic/mcp-youtube
   
   # Install Explorium MCP  
   npm install @anthropic/mcp-explorium
   ```

2. **Configure MCP Environment**:
   ```javascript
   // In src/modules/mcp-integration.js
   // Update detectMCPEnvironment() to check for your MCP setup
   detectMCPEnvironment() {
     return typeof global.mcp__youtube__getChannelStatistics === 'function';
   }
   ```

3. **Set Environment Variables**:
   ```bash
   export YOUTUBE_API_KEY="your_youtube_api_key"
   export EXPLORIUM_API_KEY="your_explorium_api_key"
   ```

### Option 3: Direct API Integration
For direct API integration without MCP:

1. **Update src/modules/mcp-integration.js**:
   ```javascript
   // Replace MCP calls with direct API calls
   async callYouTubeMCP(toolName, params) {
     const response = await fetch(`https://youtube.googleapis.com/youtube/v3/${endpoint}`, {
       headers: { 'Authorization': `Bearer ${process.env.YOUTUBE_API_KEY}` }
     });
     return await response.json();
   }
   ```

## Testing Real Data

### Test Real YouTube Data:
```bash
# Test with a real YouTube channel
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
    "channelName": "Google for Developers"
  }'
```

### Test Real Business Data:
```bash
# Test with a real company
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "channelName": "Google",
    "channelDomain": "google.com"
  }'
```

## Current Demo vs Live Comparison

| Feature | Demo Mode | Live Mode |
|---------|-----------|-----------|
| **YouTube Data** | Realistic mock data | Real channel statistics |
| **Video Analytics** | Generated metrics | Actual view/engagement data |
| **Trending Videos** | Curated examples | Current trending content |
| **Business Intelligence** | Industry templates | Real company data |
| **Competitor Analysis** | Sample competitors | Actual market data |
| **Audience Insights** | Demographic models | Real prospect data |

## Benefits of Live Mode

### Real YouTube Analytics:
- ✅ Actual subscriber counts and growth rates
- ✅ Real video performance metrics
- ✅ Current trending topics and hashtags
- ✅ Accurate engagement patterns
- ✅ Real-time content search results

### Real Business Intelligence:
- ✅ Verified company information
- ✅ Actual competitor data and funding
- ✅ Real employee and prospect data
- ✅ Current market trends and statistics
- ✅ Authentic industry benchmarks

### Enhanced AI Recommendations:
- ✅ Data-driven content suggestions
- ✅ Accurate audience targeting
- ✅ Real competitive positioning
- ✅ Precise market opportunities
- ✅ Authentic growth strategies

## Demo Mode Features

**Current demo mode provides:**
- ✅ Realistic data patterns and structures
- ✅ Accurate algorithm testing
- ✅ Complete system functionality
- ✅ Representative analytics and insights
- ✅ Professional report generation

**Demo data includes:**
- Channel statistics (10K-1M subscribers)
- Video performance (1K-500K views)
- Engagement rates (0.5-5%)
- Business data (tech companies, 11-500 employees)
- Market intelligence (industry trends, competitors)

## Switching to Live Mode

When real MCP tools become available, the system will automatically:

1. **Detect MCP Environment**: Check for available tools
2. **Switch Data Sources**: Use real APIs instead of mock data
3. **Maintain Compatibility**: Same interface, real data
4. **Log Status**: Clear indicators of live vs demo mode
5. **Graceful Fallback**: Return to demo if APIs fail

## Verification

To verify if you're using real data:

1. **Check Console Logs**:
   ```
   🔴 LIVE: Fetching real YouTube data...
   vs
   🟡 DEMO: Using mock data (MCP not available)
   ```

2. **Test Known Channel**:
   - Enter a channel you know the exact subscriber count for
   - Verify the returned data matches reality

3. **Check API Responses**:
   - Real data will have actual video IDs
   - Mock data uses predictable patterns like `mock_video_0`

## Support

For MCP integration support:
- Check Claude Code MCP documentation
- Verify API key configuration
- Test individual MCP tools before integration
- Review console logs for specific error messages