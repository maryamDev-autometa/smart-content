# Smart Content Strategy System

A comprehensive AI-powered content strategy platform that integrates YouTube analytics with market intelligence to provide data-backed content recommendations for creators.

## 🚀 Features

### Core Capabilities
- **YouTube Channel Analysis**: Deep dive into channel metrics, video performance, and audience engagement
- **Market Intelligence Integration**: Business data, competitor analysis, and industry trends via Explorium API
- **AI-Powered Recommendations**: Machine learning algorithms generate actionable content strategies
- **Channel Health Score**: Comprehensive 5-metric scoring system (Engagement, Consistency, Growth, Market Fit, Quality)
- **Interactive Dashboard**: Beautiful web interface with real-time analytics and visualizations

### Key Features
- **📊 Channel Health Score**: 5-metric scoring system with detailed breakdowns
- **🎯 Content Recommendations**: AI-generated topics based on trending data and audience insights
- **👥 Audience Analysis**: Target persona identification and engagement strategies
- **🏆 Competitor Intelligence**: Market positioning and competitive gap analysis
- **📅 Upload Schedule Optimization**: Data-driven posting recommendations
- **📈 Growth Opportunities**: Monetization and expansion strategies
- **📄 Markdown Reports**: Comprehensive strategy reports for easy sharing

## 🛠 Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **APIs**: YouTube Data API (via YouTube MCP), Explorium Business Intelligence API
- **AI Analysis**: Custom algorithms for content strategy generation
- **Export**: Markdown report generation

## 📦 Installation

```bash
# Clone or navigate to the project directory
cd smart-content-strategy-system

# Install dependencies
npm install

# Start the development server
npm run dev

# Or start the production server
npm start
```

## 🖥 Usage

### Web Dashboard
1. Open your browser to `http://localhost:3000`
2. Enter your YouTube Channel ID or Business Name
3. Optionally add your website domain for enhanced business intelligence
4. Click "Analyze Channel" to generate your content strategy
5. Export your strategy report as a Markdown file

### API Endpoints

#### Analyze Channel
```bash
POST /api/analyze
Content-Type: application/json

{
  "channelId": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
  "channelName": "Google for Developers",
  "channelDomain": "developers.google.com"
}
```

#### Export Report
```bash
POST /api/export
Content-Type: application/json

{
  // Analysis data object
}
```

#### Get Trending Videos
```bash
GET /api/trending?category=22&maxResults=10
```

#### Search Videos
```bash
GET /api/search?query=programming%20tutorial&maxResults=10
```

#### Health Check
```bash
GET /api/health
```

## 📊 Dashboard Features

### Channel Health Score
- **Overall Score**: Composite 0-100 score across all metrics
- **Engagement**: Likes, comments, and interaction rates
- **Consistency**: Upload frequency and schedule adherence
- **Growth**: Subscriber and view growth trends
- **Market Alignment**: Business intelligence and competitor positioning
- **Content Quality**: Title optimization, tags, and production value

### Content Recommendations
- **Trending Topics**: AI-identified content opportunities
- **Content Formats**: Recommended video styles and structures
- **Optimization Tips**: Title, thumbnail, and description improvements
- **Next Actions**: Prioritized tasks with timelines

### Competitor Analysis
- **Top Competitors**: Industry leaders and their metrics
- **Market Benchmarks**: Industry averages and positioning
- **Competitive Gaps**: Opportunities for differentiation
- **Collaboration Ideas**: Partnership and cross-promotion opportunities

### Upload Schedule
- **Optimal Frequency**: Data-driven posting recommendations
- **Best Times**: Peak audience engagement windows
- **Weekly Schedule**: Specific day and time recommendations
- **Seasonal Adjustments**: Content calendar optimization

## 🔧 Configuration

### Environment Variables
```bash
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development         # Environment mode
```

### MCP Integration
The system is designed to work with:
- **YouTube MCP**: For real YouTube data access
- **Explorium MCP**: For business intelligence and market data

When MCPs are not available, the system automatically falls back to mock data for demonstration purposes.

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all system tests
node src/test.js

# Test individual components
npm test
```

Test coverage includes:
- YouTube data collection
- Explorium business intelligence
- AI analysis algorithms
- Health score calculation
- Content recommendation generation
- Markdown export functionality

## 📁 Project Structure

```
src/
├── modules/
│   ├── youtube-collector.js     # YouTube API integration
│   ├── explorium-collector.js   # Explorium API integration
│   └── ai-analyzer.js          # AI analysis engine
├── ui/
│   └── dashboard.html          # Web dashboard interface
├── utils/
│   └── markdown-exporter.js    # Report generation
├── index.js                    # Main application server
└── test.js                    # Test suite
```

## 🎯 Use Cases

### Content Creators
- **Channel Optimization**: Improve engagement and growth metrics
- **Content Planning**: Data-driven topic and format selection
- **Audience Development**: Target persona identification and strategy
- **Competitive Analysis**: Market positioning and differentiation

### Marketing Teams
- **Brand Content Strategy**: Align content with business objectives
- **Audience Research**: Deep insights into target demographics
- **Campaign Planning**: Optimize content calendar and posting schedule
- **Performance Tracking**: Monitor and improve content effectiveness

### Agencies
- **Client Reporting**: Comprehensive strategy reports and recommendations
- **Multi-Channel Analysis**: Compare and optimize multiple clients
- **Market Research**: Industry trends and competitive intelligence
- **Strategy Development**: Data-backed content and growth strategies

## 🔮 Future Enhancements

- **Multi-Platform Support**: Instagram, TikTok, LinkedIn integration
- **Real-Time Analytics**: Live performance monitoring and alerts
- **Team Collaboration**: Multi-user access and workflow management
- **Advanced AI**: GPT integration for content ideation and optimization
- **Custom Branding**: White-label options for agencies and enterprises

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📞 Support

For support, feature requests, or bug reports:
- Create an issue in the GitHub repository
- Check the documentation and FAQ
- Review the test suite for usage examples

---

**Smart Content Strategy System** - Empowering creators with data-backed insights for YouTube success.# smart-content-
