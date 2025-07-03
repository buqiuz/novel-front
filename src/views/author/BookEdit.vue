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
                v-if="bookId"
                :to="{ 'name': 'authorChapterList', 'query': { 'id': bookId } }"
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
                <h1>修改小说信息</h1>
                <div class="header-actions">
                  <button
                    class="tech-button back-btn"
                    @click="$router.back()"
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
                  <div class="form-group half-width">
                    <label for="workDirection">作品方向</label>
                    <div class="select-wrapper tech-select">
                      <select
                        v-model="book.workDirection"
                        id="workDirection"
                        name="workDirection"
                        class="tech-input"
                        @change="loadCategoryList()"
                      >
                        <option value="0">男频</option>
                        <option value="1">女频</option>
                      </select>
                      <span class="select-arrow">▼</span>
                    </div>
                  </div>

                  <div class="form-group half-width">
                    <label for="catId">分类</label>
                    <div class="select-wrapper tech-select">
                      <select
                        id="catId"
                        name="catId"
                        v-model="book.categoryId"
                        class="tech-input"
                        @change="categoryChange"
                      >
                        <option
                          :value="item.id"
                          v-for="(item, index) in bookCategorys"
                          :key="index"
                        >
                          {{item.name}}
                        </option>
                      </select>
                      <span class="select-arrow">▼</span>
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="bookName">小说名称</label>
                    <input
                      v-model="book.bookName"
                      type="text"
                      id="bookName"
                      name="bookName"
                      class="tech-input"
                      placeholder="请输入小说名称"
                    />
                  </div>
                </div>

                <div class="form-row cover-row">
                  <div class="form-group cover-group">
                    <label>小说封面</label>
                    <div class="cover-container">
                      <el-upload
                        class="avatar-uploader"
                        :action="baseUrl + '/front/resource/image'"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                      >
                        <div class="cover-wrapper">
                          <img
                            :src="book.picUrl ? imgBaseUrl + book.picUrl : picUpload"
                            class="book-cover"
                            alt="书籍封面"
                          />
                          <div class="cover-overlay">
                            <div class="overlay-text">点击更换封面</div>
                          </div>
                        </div>
                      </el-upload>

                      <div class="cover-actions">
                        <button
                          class="tech-button ai-btn"
                          @click.stop="showPromptDialog"
                        >
                          <span>AI生成封面</span>
                          <i class="button-icon">✨</i>
                        </button>
                      </div>
                    </div>

                    <!-- AI封面预览 -->
                    <div v-if="aiCoverUrl" class="ai-cover-preview">
                      <div class="preview-header">
                        <span>AI生成结果</span>
                        <div class="preview-actions">
                          <button class="preview-btn apply" @click="applyAiCover">
                            <i class="btn-icon">✓</i> 应用
                          </button>
                          <button class="preview-btn cancel" @click="cancelAiCover">
                            <i class="btn-icon">✕</i> 取消
                          </button>
                        </div>
                      </div>
                      <div class="preview-image">
                        <el-image :src="aiCoverUrl" fit="cover"></el-image>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="bookDesc">小说介绍</label>
                    <textarea
                      v-model="book.bookDesc"
                      name="bookDesc"
                      id="bookDesc"
                      class="tech-textarea"
                      placeholder="请输入小说介绍内容"
                      rows="6"
                    ></textarea>
                  </div>
                </div>

                <div class="form-actions">
                  <button
                    class="tech-button primary submit-btn"
                    @click="updateBook"
                    :disabled="loading"
                  >
                    <span>{{ loading ? '保存中...' : '保存修改' }}</span>
                    <i v-if="!loading" class="button-icon">✓</i>
                    <i v-else class="button-icon spinning">⟳</i>
                  </button>
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

    <!-- 提示词输入对话框 - 替换 el-dialog 为 TechDialog -->
    <TechDialog
      v-model="promptDialogVisible"
      title="AI封面生成"
      width="500px"
      :before-close="handlePromptDialogClose"
      :isDarkTheme="isDarkTheme"
    >
      <div class="prompt-dialog-content">
        <div class="prompt-header">
          <div class="tech-line-short"></div>
          <h3>输入描述，生成专业封面</h3>
        </div>

        <el-input
          v-model="coverPrompt"
          type="textarea"
          :rows="4"
          placeholder="例如：精美小说封面，仙侠风格，主角身穿白衣手持长剑，背景有山水云雾，8k高清"
          class="tech-textarea prompt-input"
        ></el-input>

        <div class="prompt-tips">
          <h4><i class="tip-icon">💡</i> 提示词建议：</h4>
          <ul class="tips-list">
            <li><span class="tip-label">风格：</span> 水墨、插画、写实、卡通、油画、中国风</li>
            <li><span class="tip-label">人物：</span> 黑衣剑客、红衣少女、古装将军、现代商业精英</li>
            <li><span class="tip-label">场景：</span> 雪山之巅、竹林深处、都市夜景、宇宙星空</li>
            <li><span class="tip-label">画质：</span> 8k高清、超精细细节、质感、逼真</li>
          </ul>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <button class="tech-button" @click="promptDialogVisible = false">
            取消
          </button>
          <button
            class="tech-button primary"
            @click="generateCover"
            :disabled="isGenerating"
          >
            <span>{{ isGenerating ? '生成中...' : '生成封面' }}</span>
            <i v-if="!isGenerating" class="button-icon">✨</i>
            <i v-else class="button-icon spinning">⟳</i>
          </button>
        </div>
      </template>
    </TechDialog>
  </div>
</template>

<script>
import "@/assets/styles/book.css";
import { reactive, toRefs, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { getBookById, listCategorys } from "@/api/book";
import { pngToJpg, textToImage } from "@/api/ai";
import Navbar from "@/components/common/Navbar.vue";
import TechDialog from "@/components/common/TechDialog.vue";
import picUpload from "@/assets/images/pic_upload.png";
import { editBook } from "@/api/author";

export default {
  name: "authorBookEdit",
  components: {
    Navbar,
    TechDialog,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      book: {workDirection: 0, isVip: 0},
      bookId: route.query.id,
      bookCategorys: [],
      baseUrl: process.env.VUE_APP_BASE_API_URL,
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
      isGenerating: false,
      aiCoverUrl: null,
      promptDialogVisible: false,
      coverPrompt: '',
      loading: false,
      isDarkTheme: localStorage.getItem('theme') === 'light' ? false : true,
    });

    // 主题切换
    const changeTheme = (isDark) => {
      state.isDarkTheme = isDark;
    };

    // 加载书籍详情
    const loadBookDetail = async () => {
      if (!state.bookId) {
        ElMessage.error("无效的书籍ID");
        router.replace({ name: "authorBookList" });
        return;
      }

      try {
        state.loading = true;
        const response = await getBookById(state.bookId);

        if (response.code === "00000") {
          state.book = {
            id: Number(response.data.id),
            categoryId: Number(response.data.categoryId),
            workDirection: Number(response.data.workDirection || 0),
            bookStatus: Number(response.data.bookStatus || 0),
            isVip: Number(response.data.isVip || 0),
            categoryName: response.data.categoryName,
            picUrl: response.data.picUrl,
            bookName: response.data.bookName,
            bookDesc: response.data.bookDesc,
          };

          // 加载分类列表
          await loadCategoryList();
        } else {
          ElMessage.error(response.msg || "获取书籍详情失败");
          router.replace({ name: "authorBookList" });
        }
      } catch (error) {
        console.error("获取书籍详情出错:", error);
        ElMessage.error("获取书籍详情出错");
        router.replace({ name: "authorBookList" });
      } finally {
        state.loading = false;
      }
    };

    const beforeAvatarUpload = (rawFile) => {
      if (rawFile.type !== "image/jpeg") {
        ElMessage.error("必须上传 JPG 格式的图片!");
        return false;
      } else if (rawFile.size / 1024 / 1024 > 5) {
        ElMessage.error("图片大小最多 5MB!");
        return false;
      }
      return true;
    };

    const handleAvatarSuccess = (response, uploadFile) => {
      state.book.picUrl = response.data;
      state.aiCoverUrl = null; // 清除AI生成的封面预览
    };

    const loadCategoryList = async () => {
      try {
        const { data } = await listCategorys({ workDirection: state.book.workDirection });
        state.bookCategorys = data;

        // 如果当前分类不在列表中，使用第一个分类
        if (!state.book.categoryId || !state.bookCategorys.some(c => c.id === state.book.categoryId)) {
          state.book.categoryId = Number(data[0]?.id);
          state.book.categoryName = data[0]?.name;
        }
      } catch (error) {
        console.error("加载分类列表出错:", error);
        ElMessage.error("加载分类列表失败");
      }
    };

    const categoryChange = (event) => {
      const selectedCategory = state.bookCategorys.find(item => item.id == event.target.value);
      if (selectedCategory) {
        state.book.categoryName = selectedCategory.name;
      }
    };

    // 显示提示词输入对话框
    const showPromptDialog = () => {
      // 自动生成默认提示词
      state.coverPrompt = `小说封面，标题：${state.book.bookName || ''}，类型：${state.book.categoryName || ''}，${
          state.book.workDirection == 0 ? '男频' : '女频'
      }，风格：精美插画，高清，8k`;

      state.promptDialogVisible = true;
    };

    // 生成AI封面
    const generateCover = async () => {
      if (!state.coverPrompt) {
        ElMessage.error("请输入生成封面的描述提示");
        return;
      }

      try {
        state.isGenerating = true;
        const text = state.coverPrompt;
        const response = await textToImage({text: text}, {timeout: 60000});
        if (response.data) {
          state.aiCoverUrl = response.data;
          state.promptDialogVisible = false;
        } else {
          ElMessage.error("封面生成失败，请稍后再试");
        }
      } catch (error) {
        console.error("生成封面出错:", error);
        ElMessage.error("封面生成出错: " + (error.message || "未知错误"));
      } finally {
        state.isGenerating = false;
      }
    };

    // 应用AI生成的封面
    const applyAiCover = async () => {
      if (state.aiCoverUrl) {
        const url = state.aiCoverUrl;
        const response = await pngToJpg({url: url});
        state.book.picUrl = response.data;
        state.aiCoverUrl = null;
        ElMessage.success("封面已应用");
      }
    };

    // 取消AI生成的封面
    const cancelAiCover = () => {
      state.aiCoverUrl = null;
    };

    // 关闭提示词对话框
    const handlePromptDialogClose = (done) => {
      if (state.isGenerating) {
        ElMessage.warning("封面正在生成中，请稍候...");
        return;
      }
      done();
    };

    // 更新书籍信息
    const updateBook = async () => {
      if (!state.book.bookName) {
        ElMessage.error("书名不能为空！");
        return;
      }

      if (!state.book.picUrl) {
        ElMessage.error("封面不能为空！");
        return;
      }

      if (!state.book.bookDesc) {
        ElMessage.error("简介不能为空！");
        return;
      }

      try {
        state.loading = true;

        // 构造符合后端 DTO 结构的对象
        const payload = {
          id: Number(state.bookId),
          bookName: state.book.bookName,
          categoryId: state.book.categoryId,
          categoryName: state.book.categoryName,
          picUrl: state.book.picUrl,
          bookDesc: state.book.bookDesc,
          bookStatus: state.book.bookStatus,
          isVip: state.book.isVip,
          workDirection: state.book.workDirection
        };

        const response = await editBook(state.bookId, payload);
        if (response.code === "00000") {
          ElMessage.success("书籍信息更新成功");
          router.replace({ name: "authorBookList" });
        } else {
          ElMessage.error(response.msg || "书籍信息更新失败");
        }
      } catch (error) {
        console.error("更新书籍信息出错:", error);
        ElMessage.error("更新书籍信息出错");
      } finally {
        state.loading = false;
      }
    };

    // 初始化加载书籍详情
    onMounted(() => {
      loadBookDetail();
    });

    return {
      ...toRefs(state),
      picUpload,
      beforeAvatarUpload,
      handleAvatarSuccess,
      loadCategoryList,
      categoryChange,
      updateBook,
      showPromptDialog,
      generateCover,
      applyAiCover,
      cancelAiCover,
      handlePromptDialogClose,
      changeTheme
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

/* 侧边装饰元素 */
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

.half-width {
  flex: 0 0 calc(50% - 10px);
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

/* 下拉框样式 */
.select-wrapper {
  position: relative;
}

.tech-select .tech-input {
  width: 100%;
  appearance: none;
}

.select-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  font-size: 12px;
}

.light-theme .select-arrow {
  color: rgba(0, 0, 0, 0.5);
}

/* 封面相关样式 */
.cover-row {
  margin-bottom: 30px;
}

.cover-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.cover-wrapper {
  width: 150px;
  height: 200px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.light-theme .cover-wrapper {
  border: 2px dashed rgba(0, 0, 0, 0.1);
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-wrapper:hover .cover-overlay {
  opacity: 1;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overlay-text {
  color: white;
  font-size: 14px;
  text-align: center;
  padding: 10px;
}

.cover-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 30px;
}

.ai-btn {
  background: linear-gradient(135deg, #FF4081, #D500F9);
  color: white;
  border-color: #FF4081;
}

.ai-btn:hover {
  background: linear-gradient(135deg, #D500F9, #AA00FF);
  box-shadow: 0 8px 20px rgba(213, 0, 249, 0.3);
}

/* AI封面预览 */
.ai-cover-preview {
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(33, 150, 243, 0.2);
}

.light-theme .ai-cover-preview {
  background: rgba(0, 0, 0, 0.02);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  color: #2196f3;
  font-weight: 500;
}

.preview-actions {
  display: flex;
  gap: 10px;
}

.preview-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: none;
  transition: all 0.3s ease;
}

.preview-btn.apply {
  background: rgba(76, 175, 76, 0.2);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 76, 0.3);
}

.preview-btn.apply:hover {
  background: rgba(76, 175, 76, 0.3);
}

.preview-btn.cancel {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.preview-btn.cancel:hover {
  background: rgba(244, 67, 54, 0.3);
}

.btn-icon {
  margin-right: 6px;
}

.preview-image {
  display: flex;
  justify-content: center;
}

.preview-image .el-image {
  width: 200px;
  height: 280px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.submit-btn {
  padding: 15px 40px;
  font-size: 16px;
}

/* 提示词对话框 */
.tech-dialog {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  background-color: #1a1a1a;
}

.tech-dialog.light-theme {
  background-color: #ffffff;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.prompt-dialog-content {
  padding: 0 20px;
}

.prompt-header {
  margin-bottom: 20px;
}

.prompt-header h3 {
  color: #fff;
  font-size: 18px;
  margin: 10px 0;
}

.light-theme .prompt-header h3 {
  color: #333;
}

.prompt-input {
  margin-bottom: 20px;
}

.prompt-tips {
  padding: 15px;
  background: rgba(33, 150, 243, 0.05);
  border: 1px solid rgba(33, 150, 243, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
}

.prompt-tips h4 {
  color: #2196f3;
  margin: 0 0 10px 0;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.tip-icon {
  margin-right: 8px;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  margin-bottom: 8px;
  color: #ccc;
  font-size: 14px;
}

.light-theme .tips-list li {
  color: #666;
}

.tip-label {
  color: #2196f3;
  font-weight: 500;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 20px;
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

  .half-width {
    flex: 1;
  }

  .cover-container {
    flex-direction: column;
    align-items: center;
  }

  .cover-wrapper {
    width: 200px;
    height: 280px;
  }

  .cover-actions {
    flex-direction: row;
    padding-top: 10px;
    justify-content: center;
    width: 100%;
  }
}
</style>
