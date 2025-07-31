# Meta Analytics Dashboard

Ứng dụng dashboard hiện đại để theo dõi và phân tích dữ liệu từ các nền tảng Meta (Facebook, Instagram, Messenger, Threads) sử dụng WebView để hiển thị thông tin chi tiết.

## ✨ Tính năng

- 📊 **Dashboard tổng quan** với metrics từ tất cả nền tảng Meta
- 📱 **Facebook Analytics** - Insights, posts, engagement
- 📸 **Instagram Analytics** - Media insights, reach, profile views
- 💬 **Messenger Analytics** - Message statistics
- 🧵 **Threads Support** - Sẵn sàng cho API Threads khi ra mắt
- 🔄 **Auto-refresh** - Tự động cập nhật dữ liệu
- 📱 **Responsive Design** - Tương thích mọi thiết bị
- 🎨 **Modern UI** - Giao diện hiện đại với hiệu ứng glass morphism

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js 16+ 
- NPM hoặc Yarn
- Meta Developer Account với App đã được approve

### 1. Clone và cài đặt dependencies

```bash
git clone <repository-url>
cd meta-dashboard-app
npm install
```

### 2. Cấu hình Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các giá trị trong file `.env`:

```env
# Meta API Configuration
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token

INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_USER_ID=your_instagram_user_id

# Server Configuration
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your_jwt_secret_key
```

### 3. Chạy ứng dụng

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Truy cập dashboard tại: `http://localhost:3000`

## 🔧 Cấu hình Meta API

### 1. Tạo Facebook App

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Tạo App mới với type "Business"
3. Thêm các products: Facebook Login, Instagram Basic Display
4. Cấu hình OAuth redirect URIs

### 2. Lấy Access Token

**Facebook Page Access Token:**
1. Sử dụng Graph API Explorer
2. Chọn App và Page
3. Request permissions: `pages_read_engagement`, `pages_read_user_content`, `pages_show_list`
4. Generate Long-lived Page Access Token

**Instagram Access Token:**
1. Kết nối Instagram Business Account với Facebook Page
2. Sử dụng Page Access Token để lấy Instagram User ID
3. Request permissions: `instagram_basic`, `instagram_manage_insights`

### 3. Cấu hình Permissions

Đảm bảo App có các permissions sau:
- `pages_read_engagement`
- `pages_read_user_content` 
- `pages_show_list`
- `instagram_basic`
- `instagram_manage_insights`
- `pages_messaging`

## 📱 Sử dụng Dashboard

### 1. Cấu hình ban đầu

1. Mở dashboard lần đầu sẽ hiện modal cài đặt
2. Nhập Access Token, Facebook Page ID, Instagram User ID
3. Chọn tần suất auto-refresh (5-60 phút)
4. Lưu cài đặt

### 2. Các tab chính

- **Tổng quan**: Metrics tổng hợp từ tất cả nền tảng
- **Facebook**: Insights, posts gần đây, engagement
- **Instagram**: Media insights, reach, profile views  
- **Messenger**: Message statistics
- **Threads**: Sẵn sàng cho API Threads

### 3. Tính năng WebView

Mỗi nền tảng có WebView riêng hiển thị:
- Real-time insights data
- Interactive charts và graphs
- Detailed metrics breakdown
- Refresh button để cập nhật thủ công

## 🛠️ API Endpoints

### Dashboard Endpoints

```
GET /api/meta/dashboard/:pageId/:userId
GET /api/meta/facebook/insights/:pageId
GET /api/meta/facebook/posts/:pageId
GET /api/meta/instagram/insights/:userId
GET /api/meta/instagram/media/:userId
GET /api/meta/messenger/insights/:pageId
GET /api/meta/threads/insights/:userId
GET /api/meta/user/:id
```

### Authentication

Tất cả API endpoints yêu cầu Access Token:
- Header: `Authorization: Bearer <access_token>`
- Query param: `?access_token=<access_token>`

## 🎨 Customization

### Thay đổi theme colors

Chỉnh sửa CSS variables trong `public/dashboard.css`:

```css
:root {
  --primary-color: #1877f2;
  --instagram-color: #e4405f;
  --messenger-color: #0084ff;
  --threads-color: #000;
}
```

### Thêm metrics mới

1. Cập nhật API routes trong `routes/meta.js`
2. Thêm UI elements trong `public/dashboard.html`
3. Cập nhật JavaScript logic trong `public/dashboard.js`

## 🔒 Bảo mật

- Rate limiting: 100 requests/15 phút
- Helmet.js cho security headers
- Input validation và sanitization
- CORS configuration
- Access token encryption trong localStorage

## 📊 Performance

- Lazy loading cho platform data
- Concurrent API calls với Promise.allSettled
- Caching với localStorage
- Optimized chart rendering
- Responsive images

## 🐛 Troubleshooting

### Lỗi thường gặp

**"Access token required"**
- Kiểm tra Access Token trong cài đặt
- Đảm bảo token chưa hết hạn

**"Failed to fetch insights"**
- Kiểm tra Page ID và User ID
- Verify app permissions
- Kiểm tra rate limits

**"CORS errors"**
- Cấu hình domain trong Facebook App settings
- Kiểm tra OAuth redirect URIs

### Debug mode

Bật debug logs:
```bash
NODE_ENV=development npm run dev
```

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra [Issues](../../issues) có sẵn
2. Tạo issue mới với template phù hợp
3. Cung cấp logs và steps to reproduce

---

**Phát triển bởi**: [Your Name]  
**Version**: 1.0.0  
**Last Updated**: 2024
