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
                v-if="chapter.bookId"
                :to="{ 'name': 'authorChapterList', 'query': { 'id': chapter.bookId } }"
                class="nav-item"
              >
                <i class="nav-icon">📝</i>
                <span>章节管理</span>
              </router-link>
            </nav>
          </div>

          <!-- 主要内容区域 -->
          <div class="main-content">
            <!-- 页面标题 -->
            <div class="page-header">
              <div class="header-content">
                <h1>修改章节</h1>
                <div class="header-actions">
                  <button
                    class="tech-button back-btn"
                    @click="goBack"
                  >
                    <i class="button-icon">←</i>
                    <span>返回列表</span>
                  </button>
                </div>
              </div>
              <div class="tech-line-full"></div>
            </div>

            <!-- 编辑表单区域 -->
            <div class="edit-form-container">
              <div class="form-content">
                <div class="form-row">
                  <div class="form-group">
                    <label for="chapterName">章节名称</label>
                    <input
                      v-model="chapter.chapterName"
                      type="text"
                      id="chapterName"
                      name="chapterName"
                      class="tech-input"
                      placeholder="请输入章节名称"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="chapterContent">章节内容</label>
                    <textarea
                      v-model="chapter.chapterContent"
                      name="chapterContent"
                      id="chapterContent"
                      class="tech-textarea"
                      placeholder="请输入章节内容..."
                      rows="20"
                    ></textarea>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group radio-group">
                    <label>章节定价</label>
                    <div class="pricing-options">
                      <label class="pricing-option">
                        <input
                          v-model="chapter.isVip"
                          type="radio"
                          name="isVip"
                          :value="0"
                          class="hidden-radio"
                        />
                        <span class="custom-radio" :class="{'checked': chapter.isVip == 0}"></span>
                        <span class="radio-label">免费</span>
                      </label>

                      <label class="pricing-option">
                        <input
                          v-model="chapter.isVip"
                          type="radio"
                          name="isVip"
                          :value="1"
                          class="hidden-radio"
                        />
                        <span class="custom-radio" :class="{'checked': chapter.isVip == 1}"></span>
                        <span class="radio-label">收费</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="form-actions">
                  <button
                    class="tech-button primary submit-btn"
                    @click="updateBookChapter"
                    :disabled="loading"
                  >
                    <span>{{ loading ? '保存中...' : '保存修改' }}</span>
                    <i v-if="!loading" class="button-icon">✓</i>
                    <i v-else class="button-icon spinning">⟳</i>
                  </button>
                </div>

                <div class="content-stats">
                  <div class="stat-item">
                    <span class="stat-label">当前字数:</span>
                    <span class="stat-value">{{ chapter.chapterContent ? chapter.chapterContent.length : 0 }} 字</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">最低字数:</span>
                    <span class="stat-value">50 字</span>
                  </div>
                </div>
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
import { ElMessage } from "element-plus";
import { updateChapter, getChapter } from "@/api/author";
import Navbar from "@/components/common/Navbar.vue";

export default {
  name: "authorChapterUpdate",
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      chapterId: route.query.id,
      chapter: { chapterName: "", chapterContent: "", isVip: 0, bookId: null },
      loading: false,
      isDarkTheme: localStorage.getItem('theme') === 'light' ? false : true,
    });

    onMounted(() => {
      load();
    });

    // 主题切换
    const changeTheme = (isDark) => {
      state.isDarkTheme = isDark;
    };

    // 返回章节列表
    const goBack = () => {
      // 始终尝试从 route.query 获取 bookId，确保能返回章节列表
      const bookId = state.chapter.bookId || route.query.bookId;

      if (bookId) {
        router.push({
          name: 'authorChapterList',
          query: { id: bookId }
        });
      } else {
        // 如果通过多种方式都无法获取 bookId，则尝试通过浏览器历史返回
        router.back();
      }
    };

    const load = async () => {
      try {
        state.loading = true;
        const { data } = await getChapter(state.chapterId);
        state.chapter = data;
      } catch (error) {
        console.error("获取章节内容出错:", error);
        ElMessage.error("获取章节内容失败");
      } finally {
        state.loading = false;
      }
    };

    const updateBookChapter = async () => {
      if (!state.chapter.chapterName) {
        ElMessage.error("章节名不能为空！");
        return;
      }
      if (!state.chapter.chapterContent) {
        ElMessage.error("章节内容不能为空！");
        return;
      }

      if (state.chapter.chapterContent.length < 50) {
        ElMessage.error("章节内容太少！");
        return;
      }

      try {
        state.loading = true;
        await updateChapter(state.chapterId, state.chapter);
        ElMessage.success("更新成功！");
        // 更新成功后返回章节列表
        goBack();
      } catch (error) {
        console.error("更新章节失败:", error);
        ElMessage.error("更新章节失败: " + (error.message || "未知错误"));
      } finally {
        state.loading = false;
      }
    };

    return {
      ...toRefs(state),
      updateBookChapter,
      changeTheme,
      goBack
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

/* 侧边装饰 */
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

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinning {
  animation: spin 1.5s linear infinite;
  display: inline-block;
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

.tech-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tech-button:not(:disabled):hover {
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

.tech-button.primary:not(:disabled):hover {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  box-shadow: 0 8px 20px rgba(33, 150, 243, 0.4);
}

.button-icon {
  margin-left: 8px;
  font-style: normal;
}

/* 表单容器 */
.edit-form-container {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.light-theme .edit-form-container {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.form-content {
  padding: 30px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  color: #ccc;
  font-weight: 500;
  font-size: 14px;
}

.light-theme .form-group label {
  color: #666;
}

/* 输入框样式 */
.tech-input,
.tech-textarea {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s ease;
  font-family: inherit;
  resize: vertical;
}

.light-theme .tech-input,
.light-theme .tech-textarea {
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
}

.tech-input:focus,
.tech-textarea:focus {
  border-color: rgba(33, 150, 243, 0.5);
  outline: none;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.tech-textarea {
  min-height: 400px;
  line-height: 1.5;
}

/* 单选按钮样式 */
.radio-group {
  margin-top: 10px;
}

.pricing-options {
  display: flex;
  gap: 30px;
  margin-top: 10px;
}

.pricing-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.hidden-radio {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.custom-radio {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  margin-right: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.light-theme .custom-radio {
  background: rgba(0, 0, 0, 0.03);
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.custom-radio.checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2196f3;
  animation: pulse-radio 0.3s ease;
}

@keyframes pulse-radio {
  0% { transform: translate(-50%, -50%) scale(0); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

.pricing-option:hover .custom-radio {
  border-color: rgba(33, 150, 243, 0.5);
}

.radio-label {
  color: #ccc;
  font-size: 16px;
}

.light-theme .radio-label {
  color: #666;
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.submit-btn {
  padding: 15px 40px;
  font-size: 16px;
}

/* 内容统计 */
.content-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 20px;
  background: rgba(33, 150, 243, 0.05);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(33, 150, 243, 0.1);
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-label {
  color: #ccc;
  margin-right: 8px;
}

.light-theme .stat-label {
  color: #666;
}

.stat-value {
  color: #2196f3;
  font-weight: 600;
  font-size: 16px;
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
  .form-row {
    flex-direction: column;
    gap: 15px;
  }

  .header-content {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .header-actions {
    align-self: flex-end;
  }

  .content-stats {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
}
</style>
