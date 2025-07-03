<template>
  <Navbar @themeChange="changeTheme" />
  <div class="page-wrapper" :class="{'light-theme': !isDarkTheme}">
    <!-- 左侧装饰元素 -->
    <div class="side-decoration left-side">
      <div class="tech-circle"></div>
      <div class="tech-line-vertical"></div>
      <div class="tech-dot dot1"></div>
      <div class="tech-dot dot2"></div>
      <div class="tech-dot dot3"></div>
      <div class="tech-circuit"></div>
    </div>

    <div class="content-container">
      <div class="main-container tech-theme" :class="{'light-theme': !isDarkTheme}">
        <!-- 侧边导航 -->
        <div class="layout-container">
          <div class="sidebar">
            <div class="sidebar-header">
              <h3>作者管理</h3>
              <div class="tech-line-short"></div>
            </div>
            <nav class="sidebar-nav">
              <router-link
                class="nav-item"
                active-class="active"
                :to="{'name':'authorBookList'}"
              >
                <i class="nav-icon">📚</i>
                <span>小说管理</span>
              </router-link>
            </nav>
          </div>

          <!-- 主要内容区域 -->
          <div class="main-content">
            <!-- 空状态 -->
            <div class="empty-state" v-if="total == 0">
              <div class="empty-illustration">
                <div class="empty-icon">📝</div>
                <h3>还没有作品</h3>
                <p>开始创作您的第一部小说吧！</p>
                <router-link :to="{ name: 'authorBookAdd' }" class="tech-button primary">
                  <span>创建作品</span>
                  <i class="button-icon">→</i>
                </router-link>
              </div>
            </div>

            <!-- 书籍列表 -->
            <div class="book-management" v-if="total > 0">
              <!-- 页面标题 -->
              <div class="page-header">
                <div class="header-content">
                  <h1>小说列表</h1>
                  <div class="header-actions">
                    <router-link :to="{ name: 'authorBookAdd' }" class="tech-button primary">
                      <span>发布小说</span>
                      <i class="button-icon">+</i>
                    </router-link>
                  </div>
                </div>
                <div class="tech-line-full"></div>
              </div>

              <!-- 书籍网格 -->
              <div class="books-grid">
                <div
                  class="book-card"
                  v-for="(item, index) in books"
                  :key="index"
                >
                  <!-- 书籍封面 -->
                  <div class="book-cover-wrapper">
                    <img
                      :src="`${imgBaseUrl}${item.picUrl}`"
                      :alt="item.bookName"
                      class="book-cover"
                    />
                    <div class="cover-overlay">
                      <div class="book-stats">
                        <div class="stat-item">
                          <span class="stat-label">点击量</span>
                          <span class="stat-value">{{ item.visitCount }}</span>
                        </div>
                        <div class="stat-item">
                          <span class="stat-label">字数</span>
                          <span class="stat-value">{{ wordCountFormat(item.wordCount) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 书籍信息 -->
                  <div class="book-info">
                    <h3 class="book-title">{{ item.bookName }}</h3>
                    <div class="book-meta">
                      <span class="category">{{ item.categoryName }}</span>
                      <span class="update-time">{{ item.updateTime }} 更新</span>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="action-buttons">
                      <router-link
                        class="action-btn write-btn"
                        :to="{'name':'authorChapterList','query':{'id':item.id}}"
                      >
                        <i class="btn-icon">✍️</i>
                        <span>写作</span>
                      </router-link>
                      <router-link
                        class="action-btn edit-btn"
                        :to="{'name':'authorBookEdit','query':{'id':item.id}}"
                      >
                        <i class="btn-icon">✏️</i>
                        <span>修改</span>
                      </router-link>
                      <button
                        class="action-btn delete-btn"
                        @click="confirmDelete(item.id, item.bookName)"
                      >
                        <i class="btn-icon">🗑️</i>
                        <span>删除</span>
                      </button>
                    </div>
                  </div>

                  <!-- 悬浮效果 -->
                  <div class="card-glow"></div>
                </div>
              </div>

              <!-- 分页器 -->
              <div class="pagination-wrapper">
                <el-pagination
                  small
                  layout="prev, pager, next"
                  :background="true"
                  :page-size="pageSize"
                  :total="total"
                  class="tech-pagination"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧装饰元素 -->
    <div class="side-decoration right-side">
      <div class="tech-circle"></div>
      <div class="tech-line-vertical"></div>
      <div class="tech-dot dot1"></div>
      <div class="tech-dot dot2"></div>
      <div class="tech-dot dot3"></div>
      <div class="tech-circuit"></div>
    </div>
  </div>
</template>

<script>
import "@/assets/styles/book.css";
import { reactive, toRefs, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Navbar from "@/components/common/Navbar.vue";
import { listBooks, deleteBook } from "@/api/author";
import { ElMessageBox, ElMessage } from 'element-plus';

export default {
  name: "authorBookList",
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      books: [],
      searchCondition: {},
      backgroud: true,
      total: 0,
      pageSize: 10,
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
      isDarkTheme: localStorage.getItem('theme') === 'light' ? false : true,
    });

    onMounted(() => {
      load();
    });

    // 主题切换
    const changeTheme = (isDark) => {
      state.isDarkTheme = isDark;
    };

    // 删除确认方法
    const confirmDelete = (bookId, bookName) => {
      ElMessageBox.confirm(
        `确定要删除《${bookName}》吗？删除后无法恢复！`,
        '删除确认',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          deleteBook(bookId).then(() => {
            ElMessage({
              type: 'success',
              message: '删除成功',
            });
            load();
          }).catch(error => {
            ElMessage({
              type: 'error',
              message: '删除失败：' + error.message,
            });
          });
        })
        .catch(() => {
          // 用户取消删除，不做操作
        });
    };

    const load = async () => {
      const { data } = await listBooks(state.searchCondition);
      state.books = data.list;
      state.searchCondition.pageNum = data.pageNum;
      state.searchCondition.pageSize = data.pageSize;
      state.total = Number(data.total);
    };

    const handleCurrentChange = (pageNum) => {
      state.searchCondition.pageNum = pageNum;
      load();
    };

    return {
      ...toRefs(state),
      handleCurrentChange,
      load,
      confirmDelete,
      changeTheme,
    };
  },
  computed: {
    wordCountFormat() {
      return (wordCount) => {
        if (wordCount >= 10000) {
          return Math.floor(wordCount / 10000) + "万";
        }
        if (wordCount >= 1000) {
          return Math.floor(wordCount / 1000) + "千";
        }
        return wordCount;
      };
    },
  },
};
</script>

<style scoped>
/* 页面整体包装 */
.page-wrapper {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #0a0a0a;
  position: relative;
  overflow-x: hidden;
  transition: all 0.3s ease;
}

.page-wrapper.light-theme {
  background-color: #f5f5f5;
}

/* 内容容器 */
.content-container {
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* 侧边装饰 - 与Home页面保持一致 */
.side-decoration {
  width: 80px;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.left-side {
  left: 0;
  border-right: 1px solid rgba(33, 150, 243, 0.1);
}

.right-side {
  right: 0;
  border-left: 1px solid rgba(33, 150, 243, 0.1);
}

.light-theme .left-side {
  border-right: 1px solid rgba(33, 150, 243, 0.1);
}

.light-theme .right-side {
  border-left: 1px solid rgba(33, 150, 243, 0.1);
}

/* 科技风装饰元素 */
.tech-circle {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(33, 150, 243, 0.5);
  border-radius: 50%;
  position: absolute;
  top: 100px;
  left: 20px;
  animation: pulsate 4s infinite;
}

.right-side .tech-circle {
  left: unset;
  right: 20px;
}

.tech-line-vertical {
  width: 1px;
  height: 180px;
  background: linear-gradient(to bottom, rgba(33, 150, 243, 0.5), transparent);
  position: absolute;
  top: 150px;
  left: 40px;
}

.right-side .tech-line-vertical {
  left: unset;
  right: 40px;
  background: linear-gradient(to bottom, rgba(128, 0, 128, 0.5), transparent);
}

.tech-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #2196f3;
  position: absolute;
}

.right-side .tech-dot {
  background-color: #800080;
}

.dot1 {
  top: 350px;
  left: 25px;
  animation: blink 2s infinite;
}

.dot2 {
  top: 380px;
  left: 45px;
  animation: blink 3s infinite;
}

.dot3 {
  top: 410px;
  left: 25px;
  animation: blink 2.5s infinite;
}

.right-side .dot1 {
  left: unset;
  right: 25px;
}

.right-side .dot2 {
  left: unset;
  right: 45px;
}

.right-side .dot3 {
  left: unset;
  right: 25px;
}

.tech-circuit {
  width: 60px;
  height: 200px;
  position: absolute;
  top: 450px;
  left: 10px;
  border-top: 1px solid rgba(33, 150, 243, 0.3);
  border-right: 1px solid rgba(33, 150, 243, 0.3);
  border-bottom: 1px solid rgba(33, 150, 243, 0.3);
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

.right-side .tech-circuit {
  left: unset;
  right: 10px;
  border-right: none;
  border-left: 1px solid rgba(128, 0, 128, 0.3);
  border-top: 1px solid rgba(128, 0, 128, 0.3);
  border-bottom: 1px solid rgba(128, 0, 128, 0.3);
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

/* 动画效果 */
@keyframes pulsate {
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
}

@keyframes blink {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

/* 主容器 */
.main-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #fff;
  background-color: #121212;
  transition: all 0.3s ease;
}

.main-container.light-theme {
  color: #333;
  background-color: #ffffff;
}

/* 布局容器 */
.layout-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 30px;
  min-height: 80vh;
}

/* 侧边栏 */
.sidebar {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.light-theme .sidebar {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.sidebar-header h3 {
  margin: 0 0 10px 0;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.light-theme .sidebar-header h3 {
  color: #333;
}

.tech-line-short {
  height: 2px;
  background: linear-gradient(90deg, rgba(33, 150, 243, 0.8), transparent);
  margin-bottom: 20px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  color: #ccc;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.light-theme .nav-item {
  color: #666;
}

.nav-item:hover {
  background: rgba(33, 150, 243, 0.1);
  border-color: rgba(33, 150, 243, 0.3);
  color: #2196f3;
}

.nav-item.active {
  background: rgba(33, 150, 243, 0.2);
  border-color: rgba(33, 150, 243, 0.5);
  color: #2196f3;
}

.nav-icon {
  margin-right: 10px;
  font-size: 16px;
}

/* 主内容区 */
.main-content {
  min-height: 100%;
}

/* 空状态 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.empty-illustration {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.light-theme .empty-illustration {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.empty-illustration h3 {
  margin: 0 0 10px 0;
  color: #fff;
  font-size: 24px;
}

.light-theme .empty-illustration h3 {
  color: #333;
}

.empty-illustration p {
  margin: 0 0 30px 0;
  color: #ccc;
  font-size: 16px;
}

.light-theme .empty-illustration p {
  color: #666;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* 页面标题 */
.page-header {
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.header-content h1 {
  margin: 0;
  font-size: 28px;
  color: #fff;
  font-weight: 600;
}

.light-theme .header-content h1 {
  color: #333;
}

.tech-line-full {
  height: 2px;
  background: linear-gradient(90deg, rgba(33, 150, 243, 0.8), rgba(128, 0, 128, 0.8), transparent);
}

/* 科技按钮 */
.tech-button {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background: rgba(33, 150, 243, 0.1);
  border: 1px solid rgba(33, 150, 243, 0.3);
  border-radius: 8px;
  color: #2196f3;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  outline: none;
}

.tech-button:hover {
  background: rgba(33, 150, 243, 0.2);
  border-color: rgba(33, 150, 243, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(33, 150, 243, 0.3);
}

.tech-button.primary {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  border-color: #2196f3;
}

.tech-button.primary:hover {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  box-shadow: 0 8px 20px rgba(33, 150, 243, 0.4);
}

.button-icon {
  margin-left: 8px;
  font-style: normal;
}

/* 书籍网格 */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

/* 书籍卡片 */
.book-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  backdrop-filter: blur(10px);
}

.light-theme .book-card {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(33, 150, 243, 0.3);
}

.light-theme .book-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.book-card:hover .card-glow {
  opacity: 1;
}

.card-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, rgba(33, 150, 243, 0.3), rgba(128, 0, 128, 0.3));
  border-radius: 18px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

/* 书籍封面 */
.book-cover-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .book-cover {
  transform: scale(1.05);
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  align-items: flex-end;
  padding: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover .cover-overlay {
  opacity: 1;
}

.book-stats {
  display: flex;
  gap: 20px;
  width: 100%;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  color: #ccc;
  font-size: 12px;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

/* 书籍信息 */
.book-info {
  padding: 20px;
}

.book-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #fff;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.light-theme .book-title {
  color: #333;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 14px;
}

.category {
  color: #2196f3;
  background: rgba(33, 150, 243, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.update-time {
  color: #ccc;
}

.light-theme .update-time {
  color: #666;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 15px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  text-decoration: none;
  font-size: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.light-theme .action-btn {
  border-color: rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.02);
  color: #333;
}

.btn-icon {
  margin-right: 4px;
  font-size: 14px;
}

.write-btn:hover {
  background: rgba(76, 175, 76, 0.2);
  border-color: rgba(76, 175, 76, 0.5);
  color: #4caf50;
}

.edit-btn:hover {
  background: rgba(255, 152, 0, 0.2);
  border-color: rgba(255, 152, 0, 0.5);
  color: #ff9800;
}

.delete-btn:hover {
  background: rgba(244, 67, 54, 0.2);
  border-color: rgba(244, 67, 54, 0.5);
  color: #f44336;
}

/* 分页器 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.tech-pagination {
  --el-pagination-bg-color: rgba(255, 255, 255, 0.05);
  --el-pagination-text-color: #fff;
  --el-pagination-border-radius: 8px;
}

.light-theme .tech-pagination {
  --el-pagination-bg-color: rgba(0, 0, 0, 0.02);
  --el-pagination-text-color: #333;
}

/* 响应式设计 */
@media (max-width: 1100px) {
  .side-decoration {
    display: none;
  }

  .layout-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .sidebar {
    position: static;
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .action-btn {
    justify-content: center;
  }
}
</style>
