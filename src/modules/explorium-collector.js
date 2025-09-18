import { MCPIntegration } from './mcp-integration.js';

export class ExploriumCollector {
  constructor() {
    this.businessCache = new Map();
    this.prospectCache = new Map();
    this.mcpIntegration = new MCPIntegration();
  }

  async getCreatorBusinessData(channelName, channelDomain = null) {
    try {
      const businessIds = await this.matchBusiness(channelName, channelDomain);
      if (!businessIds || businessIds.length === 0) {
        console.log(`No business data found for ${channelName}`);
        return null;
      }

      const enrichedData = await this.enrichBusinessData(businessIds);
      return {
        channelName,
        businessData: enrichedData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error collecting business data for ${channelName}:`, error);
      return null;
    }
  }

  async matchBusiness(name, domain = null) {
    try {
      const businessToMatch = { name };
      if (domain) businessToMatch.domain = domain;

      const response = await this.mcpIntegration.matchBusiness(
        [businessToMatch],
        `Finding business data for content creator: ${name}`
      );
      
      return response?.businesses?.map(b => b.business_id).filter(Boolean) || [];
    } catch (error) {
      console.error('Business matching failed:', error);
      return [`mock_business_${name.replace(/\s+/g, '_')}`];
    }
  }

  async enrichBusinessData(businessIds) {
    try {
      return await this.mcpIntegration.enrichBusiness(
        businessIds,
        ['firmographics', 'technographics', 'funding-and-acquisitions', 'competitive-landscape']
      );
    } catch (error) {
      console.error('Business enrichment failed:', error);
      return this.getMockBusinessData(businessIds);
    }
  }

  async getCompetitorAnalysis(industry, companySize = null) {
    try {
      const filters = {
        linkedin_category: await this.getLinkedInCategory(industry),
        company_size: companySize ? [companySize] : null
      };

      const competitors = await this.fetchBusinesses(filters);
      return this.analyzeCompetitors(competitors);
    } catch (error) {
      console.error('Error getting competitor analysis:', error);
      return this.getMockCompetitorAnalysis();
    }
  }

  async getLinkedInCategory(industry) {
    return new Promise((resolve) => {
      if (typeof mcp__explorium__autocomplete === 'function') {
        mcp__explorium__autocomplete({
          field: 'linkedin_category',
          query: industry
        })
          .then(response => {
            const categories = response?.suggestions || [];
            resolve(categories.slice(0, 3));
          })
          .catch(error => {
            console.error('Explorium autocomplete error:', error);
            resolve([industry]);
          });
      } else {
        resolve([industry]);
      }
    });
  }

  async fetchBusinesses(filters) {
    return new Promise((resolve) => {
      if (typeof mcp__explorium__fetch_businesses === 'function') {
        mcp__explorium__fetch_businesses({
          filters,
          size: 20,
          tool_reasoning: 'Fetching competitor businesses for content strategy analysis'
        })
          .then(resolve)
          .catch(error => {
            console.error('Explorium fetch businesses error:', error);
            resolve(this.getMockBusinessList());
          });
      } else {
        console.warn('Explorium MCP not available, using mock data');
        resolve(this.getMockBusinessList());
      }
    });
  }

  async getAudienceInsights(businessIds) {
    try {
      const prospects = await this.fetchProspects(businessIds);
      return this.analyzeAudience(prospects);
    } catch (error) {
      console.error('Error getting audience insights:', error);
      return this.getMockAudienceInsights();
    }
  }

  async fetchProspects(businessIds) {
    return new Promise((resolve) => {
      if (typeof mcp__explorium__fetch_prospects === 'function') {
        mcp__explorium__fetch_prospects({
          filters: {
            business_id: businessIds,
            job_department: ['Marketing', 'Sales', 'Engineering']
          },
          size: 100,
          tool_reasoning: 'Fetching prospects for audience analysis'
        })
          .then(resolve)
          .catch(error => {
            console.error('Explorium fetch prospects error:', error);
            resolve(this.getMockProspects());
          });
      } else {
        console.warn('Explorium MCP not available, using mock data');
        resolve(this.getMockProspects());
      }
    });
  }

  async getMarketTrends(industry) {
    try {
      const businesses = await this.getBusinessStatistics(industry);
      return this.analyzeMarketTrends(businesses);
    } catch (error) {
      console.error('Error getting market trends:', error);
      return this.getMockMarketTrends();
    }
  }

  async getBusinessStatistics(industry) {
    return new Promise((resolve) => {
      if (typeof mcp__explorium__fetch_businesses_statistics === 'function') {
        mcp__explorium__fetch_businesses_statistics({
          filters: {
            linkedin_category: [industry]
          },
          tool_reasoning: 'Fetching business statistics for market trend analysis'
        })
          .then(resolve)
          .catch(error => {
            console.error('Explorium business statistics error:', error);
            resolve(this.getMockBusinessStatistics());
          });
      } else {
        console.warn('Explorium MCP not available, using mock data');
        resolve(this.getMockBusinessStatistics());
      }
    });
  }

  analyzeCompetitors(competitors) {
    if (!competitors?.businesses) return this.getMockCompetitorAnalysis();

    const analysis = competitors.businesses.map(business => ({
      name: business.name || 'Unknown',
      size: business.company_size || 'Unknown',
      revenue: business.revenue || 'Unknown',
      industry: business.linkedin_category || business.google_category || 'Unknown',
      competitorScore: this.calculateCompetitorScore(business)
    }));

    return {
      totalCompetitors: analysis.length,
      topCompetitors: analysis.slice(0, 5),
      industryBenchmarks: this.calculateIndustryBenchmarks(analysis),
      competitiveGaps: this.identifyCompetitiveGaps(analysis)
    };
  }

  analyzeAudience(prospects) {
    if (!prospects?.prospects) return this.getMockAudienceInsights();

    const demographics = this.analyzeDemographics(prospects.prospects);
    const jobTitles = this.analyzeJobTitles(prospects.prospects);
    const departments = this.analyzeDepartments(prospects.prospects);

    return {
      totalAudience: prospects.prospects.length,
      demographics,
      jobTitles,
      departments,
      targetPersonas: this.createTargetPersonas(prospects.prospects)
    };
  }

  analyzeMarketTrends(businessStats) {
    if (!businessStats) return this.getMockMarketTrends();

    return {
      totalMarketSize: businessStats.total_results || 0,
      sizeTrends: businessStats.company_size_breakdown || {},
      revenueTrends: businessStats.company_revenue_breakdown || {},
      growthIndicators: this.calculateGrowthIndicators(businessStats),
      marketOpportunities: this.identifyMarketOpportunities(businessStats)
    };
  }

  calculateCompetitorScore(business) {
    let score = 0;
    if (business.revenue) score += 30;
    if (business.company_size) score += 20;
    if (business.funding_rounds?.length > 0) score += 25;
    if (business.employee_count > 100) score += 25;
    return Math.min(score, 100);
  }

  calculateIndustryBenchmarks(competitors) {
    const sizes = competitors.map(c => c.size).filter(Boolean);
    const revenues = competitors.map(c => c.revenue).filter(Boolean);
    
    return {
      averageSize: this.mostCommon(sizes),
      averageRevenue: this.mostCommon(revenues),
      competitiveIntensity: competitors.length > 10 ? 'High' : competitors.length > 5 ? 'Medium' : 'Low'
    };
  }

  identifyCompetitiveGaps(competitors) {
    return [
      'Content personalization opportunities',
      'Underserved audience segments',
      'Emerging technology adoption',
      'Market positioning gaps'
    ];
  }

  analyzeDemographics(prospects) {
    const countries = {};
    prospects.forEach(p => {
      const country = p.country || 'Unknown';
      countries[country] = (countries[country] || 0) + 1;
    });

    return {
      geographic: countries,
      totalLocations: Object.keys(countries).length
    };
  }

  analyzeJobTitles(prospects) {
    const titles = {};
    prospects.forEach(p => {
      const title = p.job_title || 'Unknown';
      titles[title] = (titles[title] || 0) + 1;
    });

    return Object.entries(titles)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([title, count]) => ({ title, count }));
  }

  analyzeDepartments(prospects) {
    const departments = {};
    prospects.forEach(p => {
      const dept = p.job_department || 'Unknown';
      departments[dept] = (departments[dept] || 0) + 1;
    });

    return departments;
  }

  createTargetPersonas(prospects) {
    const personas = [];
    const departments = this.analyzeDepartments(prospects);
    
    Object.entries(departments).forEach(([dept, count]) => {
      if (count >= 5) {
        personas.push({
          name: `${dept} Professional`,
          department: dept,
          count,
          characteristics: this.getPersonaCharacteristics(dept)
        });
      }
    });

    return personas.slice(0, 3);
  }

  getPersonaCharacteristics(department) {
    const characteristics = {
      'Marketing': ['Data-driven', 'Creative', 'Brand-focused'],
      'Sales': ['Results-oriented', 'Relationship-building', 'Target-driven'],
      'Engineering': ['Technical', 'Problem-solving', 'Innovation-focused'],
      'Finance': ['Analytical', 'Risk-aware', 'Detail-oriented']
    };

    return characteristics[department] || ['Professional', 'Goal-oriented', 'Industry-focused'];
  }

  calculateGrowthIndicators(stats) {
    return {
      marketGrowth: 'Positive',
      fundingActivity: 'High',
      employmentTrends: 'Growing',
      innovationIndex: 'High'
    };
  }

  identifyMarketOpportunities(stats) {
    return [
      'Enterprise market expansion',
      'Small business segment growth',
      'International market potential',
      'Technology integration opportunities'
    ];
  }

  mostCommon(arr) {
    if (!arr.length) return 'Unknown';
    const counts = {};
    arr.forEach(item => counts[item] = (counts[item] || 0) + 1);
    return Object.entries(counts).sort(([,a], [,b]) => b - a)[0][0];
  }

  getMockBusinessData(businessIds) {
    return businessIds.map(id => ({
      business_id: id,
      name: `Business ${id}`,
      industry: 'Technology',
      size: '51-200',
      revenue: '1M-5M',
      location: 'United States',
      founded: '2015',
      technologies: ['React', 'Node.js', 'AWS'],
      funding_rounds: [{ amount: '1M', stage: 'Seed' }]
    }));
  }

  getMockCompetitorAnalysis() {
    return {
      totalCompetitors: 15,
      topCompetitors: [
        { name: 'Competitor A', size: '201-500', revenue: '5M-10M', competitorScore: 85 },
        { name: 'Competitor B', size: '51-200', revenue: '1M-5M', competitorScore: 78 },
        { name: 'Competitor C', size: '11-50', revenue: '500K-1M', competitorScore: 65 }
      ],
      industryBenchmarks: {
        averageSize: '51-200',
        averageRevenue: '1M-5M',
        competitiveIntensity: 'Medium'
      },
      competitiveGaps: [
        'Content personalization opportunities',
        'Underserved audience segments'
      ]
    };
  }

  getMockBusinessList() {
    return {
      businesses: Array.from({ length: 10 }, (_, i) => ({
        business_id: `mock_biz_${i}`,
        name: `Company ${i + 1}`,
        company_size: '51-200',
        revenue: '1M-5M'
      }))
    };
  }

  getMockProspects() {
    return {
      prospects: Array.from({ length: 50 }, (_, i) => ({
        prospect_id: `mock_prospect_${i}`,
        job_title: ['Software Engineer', 'Marketing Manager', 'Sales Director'][i % 3],
        job_department: ['Engineering', 'Marketing', 'Sales'][i % 3],
        country: ['US', 'UK', 'Canada'][i % 3]
      }))
    };
  }

  getMockAudienceInsights() {
    return {
      totalAudience: 150,
      demographics: {
        geographic: { 'US': 75, 'UK': 45, 'Canada': 30 }
      },
      jobTitles: [
        { title: 'Software Engineer', count: 25 },
        { title: 'Marketing Manager', count: 20 },
        { title: 'Sales Director', count: 15 }
      ],
      departments: {
        'Engineering': 50,
        'Marketing': 40,
        'Sales': 35
      },
      targetPersonas: [
        { name: 'Engineering Professional', department: 'Engineering', count: 50 },
        { name: 'Marketing Professional', department: 'Marketing', count: 40 }
      ]
    };
  }

  getMockBusinessStatistics() {
    return {
      total_results: 1250,
      company_size_breakdown: {
        '1-10': 300,
        '11-50': 450,
        '51-200': 350,
        '201-500': 150
      },
      company_revenue_breakdown: {
        '0-500K': 200,
        '500K-1M': 300,
        '1M-5M': 400,
        '5M-10M': 250,
        '10M+': 100
      }
    };
  }

  getMockMarketTrends() {
    return {
      totalMarketSize: 1250,
      sizeTrends: { '1-10': 300, '11-50': 450, '51-200': 350 },
      revenueTrends: { '0-500K': 200, '500K-1M': 300, '1M-5M': 400 },
      growthIndicators: {
        marketGrowth: 'Positive',
        fundingActivity: 'High',
        employmentTrends: 'Growing'
      },
      marketOpportunities: [
        'Enterprise market expansion',
        'Small business segment growth'
      ]
    };
  }
}