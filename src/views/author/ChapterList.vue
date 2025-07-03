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
              <router-link
                :to="{ 'name': 'authorChapterList', 'query': { 'id': bookId } }"
                class="nav-item"
                active-class="active"
              >
                <i class="nav-icon">📝</i>
                <span>章节管理</span>
              </router-link>
            </nav>
          </div>

          <!-- 主要内容区域 -->
          <div class="main-content">
            <!-- 空状态 -->
            <div class="empty-state" v-if="total == 0">
              <div class="empty-illustration">
                <div class="empty-icon">📝</div>
                <h3>还没有章节</h3>
                <p>开始创作您的第一个章节吧！</p>
                <router-link :to="{ name: 'authorChapterAdd', query: { id: bookId } }" class="tech-button primary">
                  <span>添加章节</span>
                  <i class="button-icon">→</i>
                </router-link>
              </div>
            </div>

            <!-- 章节列表 -->
            <div class="chapter-management" v-if="total > 0">
              <!-- 页面标题 -->
              <div class="page-header">
                <div class="header-content">
                  <h1>章节列表</h1>
                  <div class="header-actions">
                    <router-link :to="{ name: 'authorChapterAdd', query: { id: bookId } }" class="tech-button primary">
                      <span>新建章节</span>
                      <i class="button-icon">+</i>
                    </router-link>
                  </div>
                </div>
                <div class="tech-line-full"></div>
              </div>

              <!-- 章节表格 -->
              <div class="tech-table-container">
                <table class="tech-table">
                  <thead>
                    <tr>
                      <th class="name-column">章节名</th>
                      <th>更新时间</th>
                      <th>是否收费</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in chapters" :key="index" class="tech-table-row">
                      <td class="name-column">{{ item.chapterName }}</td>
                      <td>
                        <div class="update-time">
                          <span class="time">{{ item.chapterUpdateTime }}</span>
                          <span class="update-label">更新</span>
                        </div>
                      </td>
                      <td>
                        <span class="price-tag" :class="{'vip': item.isVip == 1}">
                          {{ item.isVip == 1 ? "收费" : "免费" }}
                        </span>
                      </td>
                      <td>
                        <div class="action-buttons">
                          <router-link
                            class="action-btn edit-btn"
                            :to="{
                              name: 'authorChapterUpdate',
                              query: { id: item.id },
                            }">
                            <i class="btn-icon">✏️</i>
                            <span>修改</span>
                          </router-link>
                          <button
                            class="action-btn delete-btn"
                            @click="confirmDelete(item.id, item.chapterName)">
                            <i class="btn-icon">🗑️</i>
                            <span>删除</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
import { listChapters, deleteChapter } from "@/api/author";
import Navbar from "@/components/common/Navbar.vue";
import { ElMessageBox, ElMessage } from 'element-plus';

export default {
  name: "authorChapterList",
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      bookId: route.query.id,
      chapters: [],
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
    const confirmDelete = (chapterId, chapterName) => {
      ElMessageBox.confirm(
        `确定要删除章节《${chapterName}》吗？删除后无法恢复！`,
        '删除确认',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          deleteBookChapter(chapterId);
        })
        .catch(() => {
          // 用户取消删除，不做操作
        });
    };

    const load = async () => {
      const { data } = await listChapters(state.bookId, state.searchCondition);
      state.chapters = data.list;
      state.searchCondition.pageNum = data.pageNum;
      state.searchCondition.pageSize = data.pageSize;
      state.total = Number(data.total);
    };

    const handleCurrentChange = (pageNum) => {
      state.searchCondition.pageNum = pageNum;
      load();
    };

    const deleteBookChapter = async (id) => {
      try {
        await deleteChapter(id);
        ElMessage({
          type: 'success',
          message: '删除成功',
        });
        load();
      } catch (error) {
        ElMessage({
          type: 'error',
          message: '删除失败：' + error.message,
        });
      }
    };

    return {
      ...toRefs(state),
      handleCurrentChange,
      load,
      deleteBookChapter,
      confirmDelete,
      changeTheme,
    };
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

/* 表格容器 */
.tech-table-container {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.light-theme .tech-table-container {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

/* 表格样式 */
.tech-table {
  width: 100%;
  border-collapse: collapse;
}

.tech-table th {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
  font-weight: 500;
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.light-theme .tech-table th {
  background: rgba(33, 150, 243, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.tech-table td {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  vertical-align: middle;
}

.light-theme .tech-table td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

.name-column {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tech-table-row {
  transition: background-color 0.3s ease;
}

.tech-table-row:hover {
  background: rgba(33, 150, 243, 0.05);
}

.light-theme .tech-table-row:hover {
  background: rgba(33, 150, 243, 0.03);
}

/* 更新时间样式 */
.update-time {
  display: flex;
  flex-direction: column;
}

.time {
  color: #ccc;
  margin-bottom: 4px;
}

.light-theme .time {
  color: #666;
}

.update-label {
  font-size: 12px;
  color: #999;
}

.light-theme .update-label {
  color: #999;
}

/* 价格标签 */
.price-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.2);
  font-size: 12px;
  font-weight: 500;
}

.price-tag.vip {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
  border: 1px solid rgba(255, 152, 0, 0.2);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  .tech-table-container {
    border-radius: 8px;
  }

  .tech-table, .tech-table thead, .tech-table tbody, .tech-table th, .tech-table td, .tech-table tr {
    display: block;
  }

  .tech-table thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  .tech-table td {
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    position: relative;
    padding-left: 50%;
  }

  .light-theme .tech-table td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  }

  .tech-table td:before {
    position: absolute;
    top: 50%;
    left: 16px;
    width: 45%;
    padding-right: 10px;
    transform: translateY(-50%);
    white-space: nowrap;
    font-weight: 500;
    color: #2196f3;
  }

  .tech-table td:nth-of-type(1):before { content: "章节名"; }
  .tech-table td:nth-of-type(2):before { content: "更新时间"; }
  .tech-table td:nth-of-type(3):before { content: "是否收费"; }
  .tech-table td:nth-of-type(4):before { content: "操作"; }

  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .action-btn {
    justify-content: center;
  }
}
</style>
