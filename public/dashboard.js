class MetaDashboard {
    constructor() {
        this.config = {
            accessToken: localStorage.getItem('meta_access_token') || '',
            pageId: localStorage.getItem('facebook_page_id') || '',
            userId: localStorage.getItem('instagram_user_id') || '',
            refreshInterval: parseInt(localStorage.getItem('refresh_interval')) || 15
        };
        
        this.charts = {};
        this.refreshTimer = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.setupTabs();
        this.initializeCharts();
        
        if (this.config.accessToken && this.config.pageId && this.config.userId) {
            this.loadDashboardData();
            this.startAutoRefresh();
        } else {
            this.showSettingsModal();
        }
    }
    
    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadDashboardData();
        });
        
        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettingsModal();
        });
        
        // Settings modal
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });
        
        document.getElementById('cancelSettings').addEventListener('click', () => {
            this.hideSettingsModal();
        });
        
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.hideSettingsModal();
        });
        
        // WebView refresh buttons
        document.querySelectorAll('.webview-refresh').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = e.currentTarget.dataset.platform;
                this.refreshPlatformData(platform);
            });
        });
        
        // Close modal when clicking outside
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.hideSettingsModal();
            }
        });
    }
    
    setupTabs() {
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.classList.remove('active'));
        document.getElementById('overview').classList.add('active');
    }
    
    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
        
        // Load platform-specific data if needed
        if (tabName !== 'overview') {
            this.loadPlatformData(tabName);
        }
    }
    
    initializeCharts() {
        // Engagement Chart
        const engagementCtx = document.getElementById('engagementChart').getContext('2d');
        this.charts.engagement = new Chart(engagementCtx, {
            type: 'line',
            data: {
                labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
                datasets: [{
                    label: 'Facebook',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: '#1877f2',
                    backgroundColor: 'rgba(24, 119, 242, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Instagram',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    borderColor: '#e4405f',
                    backgroundColor: 'rgba(228, 64, 95, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Platform Comparison Chart
        const platformCtx = document.getElementById('platformChart').getContext('2d');
        this.charts.platform = new Chart(platformCtx, {
            type: 'doughnut',
            data: {
                labels: ['Facebook', 'Instagram', 'Messenger'],
                datasets: [{
                    data: [300, 150, 100],
                    backgroundColor: ['#1877f2', '#e4405f', '#0084ff'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    async loadDashboardData() {
        if (!this.config.accessToken || !this.config.pageId || !this.config.userId) {
            this.showError('Vui lòng cấu hình Access Token, Page ID và User ID trong phần cài đặt');
            return;
        }
        
        this.showLoading(true);
        
        try {
            const response = await fetch(`/api/meta/dashboard/${this.config.pageId}/${this.config.userId}?access_token=${this.config.accessToken}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.updateDashboardMetrics(data);
            this.updateCharts(data);
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Không thể tải dữ liệu dashboard. Vui lòng kiểm tra cấu hình API.');
        } finally {
            this.showLoading(false);
        }
    }
    
    updateDashboardMetrics(data) {
        // Update Facebook metrics
        if (data.facebook?.insights?.data) {
            const fbInsights = data.facebook.insights.data;
            const fansData = fbInsights.find(item => item.name === 'page_fans');
            const impressionsData = fbInsights.find(item => item.name === 'page_impressions');
            
            if (fansData?.values?.[0]?.value) {
                document.getElementById('fb-fans').textContent = this.formatNumber(fansData.values[0].value);
            }
        }
        
        // Update Instagram metrics
        if (data.instagram?.insights?.data) {
            const igInsights = data.instagram.insights.data;
            const reachData = igInsights.find(item => item.name === 'reach');
            
            if (reachData?.values?.[0]?.value) {
                document.getElementById('ig-reach').textContent = this.formatNumber(reachData.values[0].value);
            }
        }
        
        // Update Messenger metrics
        if (data.messenger?.insights?.data) {
            const msgInsights = data.messenger.insights.data;
            const messagesData = msgInsights.find(item => item.name === 'page_messages');
            
            if (messagesData?.values?.[0]?.value) {
                document.getElementById('msg-count').textContent = this.formatNumber(messagesData.values[0].value);
            }
        }
    }
    
    async loadPlatformData(platform) {
        if (!this.config.accessToken) return;
        
        const webviewContent = document.getElementById(`${platform}-webview`);
        if (!webviewContent) return;
        
        webviewContent.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i><p>Đang tải dữ liệu...</p></div>';
        
        try {
            let endpoint = '';
            let params = `access_token=${this.config.accessToken}`;
            
            switch (platform) {
                case 'facebook':
                    endpoint = `/api/meta/facebook/insights/${this.config.pageId}`;
                    await this.loadFacebookData();
                    break;
                case 'instagram':
                    endpoint = `/api/meta/instagram/insights/${this.config.userId}`;
                    await this.loadInstagramData();
                    break;
                case 'messenger':
                    endpoint = `/api/meta/messenger/insights/${this.config.pageId}`;
                    await this.loadMessengerData();
                    break;
                case 'threads':
                    this.loadThreadsData();
                    return;
            }
            
            const response = await fetch(`${endpoint}?${params}`);
            const data = await response.json();
            
            this.renderPlatformInsights(platform, data);
            
        } catch (error) {
            console.error(`Error loading ${platform} data:`, error);
            webviewContent.innerHTML = `<div class="info-message"><i class="fas fa-exclamation-triangle"></i><p>Không thể tải dữ liệu ${platform}</p></div>`;
        }
    }
    
    async loadFacebookData() {
        try {
            const [insightsResponse, postsResponse] = await Promise.all([
                fetch(`/api/meta/facebook/insights/${this.config.pageId}?access_token=${this.config.accessToken}`),
                fetch(`/api/meta/facebook/posts/${this.config.pageId}?access_token=${this.config.accessToken}&limit=6`)
            ]);
            
            const [insights, posts] = await Promise.all([
                insightsResponse.json(),
                postsResponse.json()
            ]);
            
            this.renderPlatformInsights('facebook', insights);
            this.renderFacebookPosts(posts.data?.data || []);
            
        } catch (error) {
            console.error('Error loading Facebook data:', error);
        }
    }
    
    async loadInstagramData() {
        try {
            const [insightsResponse, mediaResponse] = await Promise.all([
                fetch(`/api/meta/instagram/insights/${this.config.userId}?access_token=${this.config.accessToken}`),
                fetch(`/api/meta/instagram/media/${this.config.userId}?access_token=${this.config.accessToken}&limit=6`)
            ]);
            
            const [insights, media] = await Promise.all([
                insightsResponse.json(),
                mediaResponse.json()
            ]);
            
            this.renderPlatformInsights('instagram', insights);
            this.renderInstagramMedia(media.data?.data || []);
            
        } catch (error) {
            console.error('Error loading Instagram data:', error);
        }
    }
    
    async loadMessengerData() {
        try {
            const response = await fetch(`/api/meta/messenger/insights/${this.config.pageId}?access_token=${this.config.accessToken}`);
            const data = await response.json();
            
            this.renderPlatformInsights('messenger', data);
            
        } catch (error) {
            console.error('Error loading Messenger data:', error);
        }
    }
    
    loadThreadsData() {
        const webviewContent = document.getElementById('threads-webview');
        webviewContent.innerHTML = `
            <div class="info-message">
                <i class="fas fa-info-circle"></i>
                <p>Threads API hiện đang trong giai đoạn phát triển. Chức năng sẽ được cập nhật khi API chính thức ra mắt.</p>
            </div>
        `;
    }
    
    renderPlatformInsights(platform, data) {
        const webviewContent = document.getElementById(`${platform}-webview`);
        
        if (!data.data || !Array.isArray(data.data)) {
            webviewContent.innerHTML = '<div class="info-message"><i class="fas fa-info-circle"></i><p>Không có dữ liệu insights</p></div>';
            return;
        }
        
        const insights = data.data;
        let html = '<div class="insights-grid">';
        
        insights.forEach(insight => {
            const value = insight.values?.[0]?.value || 0;
            const title = this.getInsightTitle(insight.name);
            
            html += `
                <div class="insight-card">
                    <h4>${title}</h4>
                    <div class="insight-value">${this.formatNumber(value)}</div>
                    <div class="insight-period">${insight.period || 'day'}</div>
                </div>
            `;
        });
        
        html += '</div>';
        webviewContent.innerHTML = html;
    }
    
    renderFacebookPosts(posts) {
        const postsContainer = document.getElementById('facebook-posts');
        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = '<p>Không có bài viết nào</p>';
            return;
        }
        
        let html = '';
        posts.forEach(post => {
            const likes = post.likes?.summary?.total_count || 0;
            const comments = post.comments?.summary?.total_count || 0;
            const message = post.message || 'Không có nội dung';
            const date = new Date(post.created_time).toLocaleDateString('vi-VN');
            
            html += `
                <div class="post-card">
                    <div class="post-content">${message.substring(0, 150)}${message.length > 150 ? '...' : ''}</div>
                    <div class="post-stats">
                        <span><i class="fas fa-heart"></i> ${likes}</span>
                        <span><i class="fas fa-comment"></i> ${comments}</span>
                    </div>
                    <div class="post-date">${date}</div>
                </div>
            `;
        });
        
        postsContainer.innerHTML = html;
    }
    
    renderInstagramMedia(media) {
        const mediaContainer = document.getElementById('instagram-media');
        if (!media || media.length === 0) {
            mediaContainer.innerHTML = '<p>Không có media nào</p>';
            return;
        }
        
        let html = '';
        media.forEach(item => {
            const likes = item.like_count || 0;
            const comments = item.comments_count || 0;
            const caption = item.caption || 'Không có caption';
            const mediaUrl = item.media_url || '';
            const date = new Date(item.timestamp).toLocaleDateString('vi-VN');
            
            html += `
                <div class="media-card">
                    ${mediaUrl ? `<img src="${mediaUrl}" alt="Instagram media" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">` : ''}
                    <div class="media-caption">${caption.substring(0, 100)}${caption.length > 100 ? '...' : ''}</div>
                    <div class="media-stats">
                        <span><i class="fas fa-heart"></i> ${likes}</span>
                        <span><i class="fas fa-comment"></i> ${comments}</span>
                    </div>
                    <div class="media-date">${date}</div>
                </div>
            `;
        });
        
        mediaContainer.innerHTML = html;
    }
    
    getInsightTitle(name) {
        const titles = {
            'page_fans': 'Người theo dõi',
            'page_impressions': 'Lượt hiển thị',
            'page_engaged_users': 'Người tương tác',
            'impressions': 'Lượt hiển thị',
            'reach': 'Lượt tiếp cận',
            'profile_views': 'Lượt xem profile',
            'page_messages': 'Tin nhắn'
        };
        return titles[name] || name;
    }
    
    updateCharts(data) {
        // Update engagement chart with real data
        if (this.charts.engagement && data) {
            // This would be populated with real time series data
            // For now, keeping the demo data
        }
        
        // Update platform comparison chart
        if (this.charts.platform && data) {
            const facebookValue = this.extractMetricValue(data.facebook, 'page_engaged_users');
            const instagramValue = this.extractMetricValue(data.instagram, 'reach');
            const messengerValue = this.extractMetricValue(data.messenger, 'page_messages');
            
            if (facebookValue || instagramValue || messengerValue) {
                this.charts.platform.data.datasets[0].data = [
                    facebookValue || 0,
                    instagramValue || 0,
                    messengerValue || 0
                ];
                this.charts.platform.update();
            }
        }
    }
    
    extractMetricValue(platformData, metricName) {
        if (!platformData?.insights?.data) return 0;
        const metric = platformData.insights.data.find(item => item.name === metricName);
        return metric?.values?.[0]?.value || 0;
    }
    
    refreshPlatformData(platform) {
        this.loadPlatformData(platform);
    }
    
    showSettingsModal() {
        document.getElementById('accessToken').value = this.config.accessToken;
        document.getElementById('pageId').value = this.config.pageId;
        document.getElementById('userId').value = this.config.userId;
        document.getElementById('refreshInterval').value = this.config.refreshInterval;
        document.getElementById('settingsModal').style.display = 'block';
    }
    
    hideSettingsModal() {
        document.getElementById('settingsModal').style.display = 'none';
    }
    
    saveSettings() {
        this.config.accessToken = document.getElementById('accessToken').value;
        this.config.pageId = document.getElementById('pageId').value;
        this.config.userId = document.getElementById('userId').value;
        this.config.refreshInterval = parseInt(document.getElementById('refreshInterval').value);
        
        // Save to localStorage
        localStorage.setItem('meta_access_token', this.config.accessToken);
        localStorage.setItem('facebook_page_id', this.config.pageId);
        localStorage.setItem('instagram_user_id', this.config.userId);
        localStorage.setItem('refresh_interval', this.config.refreshInterval.toString());
        
        this.hideSettingsModal();
        this.loadDashboardData();
        this.startAutoRefresh();
        
        this.showSuccess('Cài đặt đã được lưu thành công!');
    }
    
    loadSettings() {
        this.config.accessToken = localStorage.getItem('meta_access_token') || '';
        this.config.pageId = localStorage.getItem('facebook_page_id') || '';
        this.config.userId = localStorage.getItem('instagram_user_id') || '';
        this.config.refreshInterval = parseInt(localStorage.getItem('refresh_interval')) || 15;
    }
    
    startAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        if (this.config.refreshInterval > 0) {
            this.refreshTimer = setInterval(() => {
                this.loadDashboardData();
            }, this.config.refreshInterval * 60 * 1000);
        }
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = show ? 'block' : 'none';
    }
    
    showError(message) {
        // Simple error notification - could be enhanced with a proper notification system
        alert(`❌ Lỗi: ${message}`);
    }
    
    showSuccess(message) {
        // Simple success notification - could be enhanced with a proper notification system
        alert(`✅ ${message}`);
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Add CSS for insights grid
const additionalCSS = `
.insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.insight-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
}

.insight-card h4 {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.insight-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 0.25rem;
}

.insight-period {
    font-size: 0.8rem;
    color: #999;
}

.post-content, .media-caption {
    margin-bottom: 1rem;
    line-height: 1.5;
}

.post-stats, .media-stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
    color: #666;
}

.post-date, .media-date {
    font-size: 0.8rem;
    color: #999;
}
`;

// Add the additional CSS to the page
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MetaDashboard();
});