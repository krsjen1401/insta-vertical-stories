insta-glassy-layout/
├── index.html              ← Giao diện chính
├── style.css               ← CSS hiệu ứng glassy + layout dọc
├── script.js               ← Script hiển thị và gọi dữ liệu từ Instagram
├── README.md               ← Mô tả repo
├── LICENSE (optional)      ← Quyền sử dụng
└── assets/                 ← Chứa ảnh/icon/phông chữ nếu có<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Instagram Vertical Stories</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      <h2>Stories</h2>
      <div class="story-list" id="storyList">
        <!-- Script sẽ tự động render -->
      </div>
    </aside>
    <main class="feed">
      <h1>Your Feed</h1>
      <div id="feedContainer">
        <!-- Nội dung feed render ở đây -->
      </div>
    </main>
  </div>
  <script src="script.js"></script>
</body>
</html>


body {
  margin: 0;
  font-family: system-ui;
  background: #111;
  color: white;
  display: flex;
  justify-content: center;
  align-items: start;
  height: 100vh;
}

.container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  margin-top: 40px;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  padding: 16px;
  border-right: 1px solid rgba(255,255,255,0.1);
  background: rgba(0, 0, 0, 0.4);
}

.feed {
  flex: 1;
  padding: 16px;
}

.story-item {
  background: rgba(255, 255, 255, 0.08);
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
}

.story-item:hover {
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
}
document.addEventListener("DOMContentLoaded", () => {
  const stories = ["Kristen", "Linh", "Mai", "An", "Hà"];
  const storyList = document.getElementById("storyList");
  const feedContainer = document.getElementById("feedContainer");

  stories.forEach((name, i) => {
    const item = document.createElement("div");
    item.className = "story-item";
    item.innerText = name + "'s Story";
    item.onclick = () => alert(`Hiển thị story của ${name}`);
    storyList.appendChild(item);
  });

  for (let i = 1; i <= 10; i++) {
    const post = document.createElement("div");
    post.className = "story-item";
    post.innerText = `Bài viết ${i}`;
    feedContainer.appendChild(post);
  }
});# insta-glassy-layout

📱 Tuỳ chỉnh lại giao diện Instagram: chuyển stories thành dạng dọc (vertical), thêm hiệu ứng glassmorphism, giữ nguyên data logic Instagram gốc, sử dụng WebView hoặc iframe.

### 🔧 Mục tiêu:
- Dùng cho iPad (Orion WebView hoặc Safari)
- Hiển thị dữ liệu stories + feed cá nhân (giả lập bằng local script)
- Dễ mở rộng để gọi API Instagram sau

### 📂 Cấu trúc:
- `index.html`: Trang chính
- `style.css`: Giao diện Glassy
- `script.js`: Dữ liệu mock-up + hiển thị
