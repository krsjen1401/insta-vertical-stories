const express = require('express');
const axios = require('axios');
const router = express.Router();

// Meta Graph API base URL
const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0';

// Middleware to validate access token
const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.query.access_token;
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  req.accessToken = token;
  next();
};

// Facebook Page Insights
router.get('/facebook/insights/:pageId', validateToken, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { metric = 'page_fans,page_impressions,page_engaged_users', period = 'day' } = req.query;
    
    const response = await axios.get(`${GRAPH_API_BASE}/${pageId}/insights`, {
      params: {
        metric,
        period,
        access_token: req.accessToken
      }
    });
    
    res.json({
      platform: 'facebook',
      pageId,
      data: response.data
    });
  } catch (error) {
    console.error('Facebook API Error:', error.response?.data);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch Facebook insights',
      details: error.response?.data?.error?.message
    });
  }
});

// Facebook Posts
router.get('/facebook/posts/:pageId', validateToken, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { limit = 10, fields = 'id,message,created_time,likes.summary(true),comments.summary(true),shares' } = req.query;
    
    const response = await axios.get(`${GRAPH_API_BASE}/${pageId}/posts`, {
      params: {
        fields,
        limit,
        access_token: req.accessToken
      }
    });
    
    res.json({
      platform: 'facebook',
      pageId,
      data: response.data
    });
  } catch (error) {
    console.error('Facebook Posts API Error:', error.response?.data);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch Facebook posts',
      details: error.response?.data?.error?.message
    });
  }
});

// Instagram Business Account Insights
router.get('/instagram/insights/:userId', validateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { metric = 'impressions,reach,profile_views', period = 'day' } = req.query;
    
    const response = await axios.get(`${GRAPH_API_BASE}/${userId}/insights`, {
      params: {
        metric,
        period,
        access_token: req.accessToken
      }
    });
    
    res.json({
      platform: 'instagram',
      userId,
      data: response.data
    });
  } catch (error) {
    console.error('Instagram API Error:', error.response?.data);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch Instagram insights',
      details: error.response?.data?.error?.message
    });
  }
});

// Instagram Media
router.get('/instagram/media/:userId', validateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, fields = 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count' } = req.query;
    
    const response = await axios.get(`${GRAPH_API_BASE}/${userId}/media`, {
      params: {
        fields,
        limit,
        access_token: req.accessToken
      }
    });
    
    res.json({
      platform: 'instagram',
      userId,
      data: response.data
    });
  } catch (error) {
    console.error('Instagram Media API Error:', error.response?.data);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch Instagram media',
      details: error.response?.data?.error?.message
    });
  }
});

// Messenger Insights (Page level)
router.get('/messenger/insights/:pageId', validateToken, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { metric = 'page_messages,page_messages_blocked_conversations_unique', period = 'day' } = req.query;
    
    const response = await axios.get(`${GRAPH_API_BASE}/${pageId}/insights`, {
      params: {
        metric,
        period,
        access_token: req.accessToken
      }
    });
    
    res.json({
      platform: 'messenger',
      pageId,
      data: response.data
    });
  } catch (error) {
    console.error('Messenger API Error:', error.response?.data);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch Messenger insights',
      details: error.response?.data?.error?.message
    });
  }
});

// Threads (Instagram Threads API - Limited availability)
router.get('/threads/insights/:userId', validateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Note: Threads API is still limited. This is a placeholder for when it becomes available
    const response = await axios.get(`${GRAPH_API_BASE}/${userId}/threads`, {
      params: {
        fields: 'id,text,timestamp,reply_count,like_count',
        access_token: req.accessToken
      }
    });
    
    res.json({
      platform: 'threads',
      userId,
      data: response.data
    });
  } catch (error) {
    console.error('Threads API Error:', error.response?.data);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch Threads data',
      details: error.response?.data?.error?.message || 'Threads API may not be available yet'
    });
  }
});

// Get user/page information
router.get('/user/:id', validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { fields = 'id,name,picture,category,fan_count' } = req.query;
    
    const response = await axios.get(`${GRAPH_API_BASE}/${id}`, {
      params: {
        fields,
        access_token: req.accessToken
      }
    });
    
    res.json({
      data: response.data
    });
  } catch (error) {
    console.error('User API Error:', error.response?.data);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch user/page information',
      details: error.response?.data?.error?.message
    });
  }
});

// Combined dashboard data
router.get('/dashboard/:pageId/:userId', validateToken, async (req, res) => {
  try {
    const { pageId, userId } = req.params;
    
    // Fetch data from multiple platforms concurrently
    const [facebookInsights, instagramInsights, messengerInsights, facebookPosts, instagramMedia] = await Promise.allSettled([
      axios.get(`${GRAPH_API_BASE}/${pageId}/insights`, {
        params: {
          metric: 'page_fans,page_impressions,page_engaged_users',
          period: 'day',
          access_token: req.accessToken
        }
      }),
      axios.get(`${GRAPH_API_BASE}/${userId}/insights`, {
        params: {
          metric: 'impressions,reach,profile_views',
          period: 'day',
          access_token: req.accessToken
        }
      }),
      axios.get(`${GRAPH_API_BASE}/${pageId}/insights`, {
        params: {
          metric: 'page_messages',
          period: 'day',
          access_token: req.accessToken
        }
      }),
      axios.get(`${GRAPH_API_BASE}/${pageId}/posts`, {
        params: {
          fields: 'id,message,created_time,likes.summary(true),comments.summary(true)',
          limit: 5,
          access_token: req.accessToken
        }
      }),
      axios.get(`${GRAPH_API_BASE}/${userId}/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,like_count,comments_count',
          limit: 5,
          access_token: req.accessToken
        }
      })
    ]);
    
    const dashboardData = {
      facebook: {
        insights: facebookInsights.status === 'fulfilled' ? facebookInsights.value.data : null,
        posts: facebookPosts.status === 'fulfilled' ? facebookPosts.value.data : null
      },
      instagram: {
        insights: instagramInsights.status === 'fulfilled' ? instagramInsights.value.data : null,
        media: instagramMedia.status === 'fulfilled' ? instagramMedia.value.data : null
      },
      messenger: {
        insights: messengerInsights.status === 'fulfilled' ? messengerInsights.value.data : null
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API Error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard data',
      details: error.message
    });
  }
});

module.exports = router;