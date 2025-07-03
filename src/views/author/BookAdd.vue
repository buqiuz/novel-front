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
        <div class="layout-container">
          <!-- 侧边导航 -->
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
            <div class="book-add-container">
              <!-- 页面标题 -->
              <div class="page-header">
                <div class="header-content">
                  <h1>发布小说</h1>
                  <div class="header-actions">
                    <router-link :to="{ name: 'authorBookList' }" class="tech-button secondary">
                      <span>返回列表</span>
                      <i class="button-icon">←</i>
                    </router-link>
                  </div>
                </div>
                <div class="tech-line-full"></div>
              </div>

              <!-- 表单区域 -->
              <div class="form-container">
                <div class="form-card">
                  <form @submit.prevent="saveBook">
                    <div class="form-grid">
                      <!-- 作品方向 -->
                      <div class="form-group">
                        <label class="form-label">
                          <i class="label-icon">🎯</i>
                          作品方向
                        </label>
                        <select
                          v-model="book.workDirection"
                          class="form-select"
                          @change="loadCategoryList()"
                        >
                          <option value="0">男频</option>
                          <option value="1">女频</option>
                        </select>
                      </div>

                      <!-- 分类 -->
                      <div class="form-group">
                        <label class="form-label">
                          <i class="label-icon">📂</i>
                          分类
                        </label>
                        <select
                          v-model="book.categoryId"
                          class="form-select"
                          @change="categoryChange"
                        >
                          <option
                            :value="item.id"
                            v-for="(item,index) in bookCategorys"
                            :key="index"
                          >
                            {{item.name}}
                          </option>
                        </select>
                      </div>

                      <!-- 小说名 -->
                      <div class="form-group full-width">
                        <label class="form-label">
                          <i class="label-icon">📖</i>
                          小说名
                        </label>
                        <input
                          v-model="book.bookName"
                          type="text"
                          class="form-input"
                          placeholder="请输入小说名称"
                        />
                      </div>

                      <!-- 小说封面 -->
                      <div class="form-group full-width">
                        <label class="form-label">
                          <i class="label-icon">🎨</i>
                          小说封面
                        </label>
                        <div class="cover-upload-area">
                          <el-upload
                            class="cover-uploader"
                            :action="baseUrl + '/front/resource/image'"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                          >
                            <div class="upload-wrapper">
                              <img
                                :src="book.picUrl ? imgBaseUrl + book.picUrl : picUpload"
                                class="cover-image"
                                :alt="book.bookName || '封面预览'"
                              />
                              <div class="upload-overlay">
                                <i class="upload-icon">📤</i>
                                <span>点击上传封面</span>
                              </div>
                            </div>
                          </el-upload>

                          <div class="ai-cover-section">
                            <button
                              type="button"
                              class="tech-button ai-btn"
                              @click="showPromptDialog"
                            >
                              <i class="button-icon">🤖</i>
                              <span>AI生成封面</span>
                            </button>

                            <div v-if="aiCoverUrl" class="ai-cover-preview">
                              <div class="preview-wrapper">
                                <img :src="aiCoverUrl" class="preview-image" />
                                <div class="preview-actions">
                                  <button
                                    type="button"
                                    class="tech-button success"
                                    @click="applyAiCover"
                                  >
                                    <i class="button-icon">✓</i>
                                    使用此封面
                                  </button>
                                  <button
                                    type="button"
                                    class="tech-button danger"
                                    @click="cancelAiCover"
                                  >
                                    <i class="button-icon">✗</i>
                                    取消
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- 小说介绍 -->
                      <div class="form-group full-width">
                        <label class="form-label">
                          <i class="label-icon">📝</i>
                          小说介绍
                        </label>
                        <textarea
                          v-model="book.bookDesc"
                          class="form-textarea"
                          rows="6"
                          placeholder="请输入小说介绍..."
                        ></textarea>
                      </div>

                      <!-- 提交按钮 -->
                      <div class="form-group full-width">
                        <div class="submit-actions">
                          <button
                            type="submit"
                            class="tech-button primary large"
                            :disabled="isSubmitting"
                          >
                            <i class="button-icon" v-if="!isSubmitting">🚀</i>
                            <i class="button-icon loading" v-else>⏳</i>
                            <span>{{ isSubmitting ? '发布中...' : '发布小说' }}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
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

  <!-- AI提示词输入对话框 -->
  <el-dialog
    v-model="promptDialogVisible"
    title="AI封面生成"
    width="40%"
    :before-close="handlePromptDialogClose"
    class="ai-dialog"
    :class="{'light-theme': !isDarkTheme}"
  >
    <div class="dialog-content">
      <div class="prompt-section">
        <h4>描述您想要的封面风格</h4>
        <el-input
          v-model="coverPrompt"
          type="textarea"
          :rows="5"
          placeholder="例如：精美小说封面，仙侠风格，主角身穿白衣手持长剑，背景有山水云雾，8k高清"
          class="prompt-input"
        ></el-input>
      </div>

      <div class="prompt-tips">
        <h5>💡 提示词建议：</h5>
        <ul>
          <li>📎 描述封面风格（如：水墨、插画、写实、卡通等）</li>
          <li>👤 描述主角特征（如：黑衣剑客、红衣少女等）</li>
          <li>🏞️ 描述场景（如：雪山之巅、竹林深处、都市夜景等）</li>
          <li>🎯 指定画质（如：8k高清、超精细细节等）</li>
        </ul>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <button
          class="tech-button secondary"
          @click="promptDialogVisible = false"
        >
          取消
        </button>
        <button
          class="tech-button primary"
          @click="generateCover"
          :disabled="isGenerating"
        >
          <i class="button-icon" v-if="!isGenerating">🎨</i>
          <i class="button-icon loading" v-else>⏳</i>
          <span>{{ isGenerating ? '生成中...' : '生成封面' }}</span>
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import "@/assets/styles/book.css";
import { reactive, toRefs, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { publishBook } from "@/api/author";
import { listCategorys } from "@/api/book";
import {pngToJpg, textToImage} from "@/api/ai";
import Navbar from "@/components/common/Navbar.vue";
import picUpload from "@/assets/images/pic_upload.png";

export default {
  name: "authorBookAdd",
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      book: {'workDirection' : 0,'isVip':0},
      bookCategorys: [],
      baseUrl: process.env.VUE_APP_BASE_API_URL,
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
      isGenerating: false,
      isSubmitting: false,
      aiCoverUrl: null,
      promptDialogVisible: false,
      coverPrompt: '',
      isDarkTheme: localStorage.getItem('theme') === 'light' ? false : true,
    });

    onMounted(() => {
      loadCategoryList()
    })

    // 主题切换
    const changeTheme = (isDark) => {
      state.isDarkTheme = isDark;
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
      state.aiCoverUrl = null;
      ElMessage.success("封面上传成功");
    };

    const loadCategoryList = async () => {
      const { data } = await listCategorys({ workDirection: state.book.workDirection });
      state.book.categoryId = data[0].id
      state.book.categoryName = data[0].name
      state.bookCategorys = data;
    };

    const categoryChange = async (event) => {
      console.log("categoryChange======",event.target.value)
     state.bookCategorys.forEach((category)=>{
        if(category.id == event.target.value){
          state.book.categoryName = category.name
          return
        }
      });
    }

    const showPromptDialog = () => {
      state.coverPrompt = `小说封面，标题：${state.book.bookName || ''}，类型：${state.book.categoryName || ''}，${
        state.book.workDirection == 0 ? '男频' : '女频'
      }，风格：精美插画，高清，8k`;
      
      state.promptDialogVisible = true;
    };

    const generateCover = async () => {
      if (!state.coverPrompt) {
        ElMessage.error("请输入生成封面的描述提示");
        return;
      }
      
      try {
        state.isGenerating = true;
        const text=state.coverPrompt;
        const response = await textToImage( {text:text }, { timeout: 60000 } );
        console.log("完整响应:", response);
        if (response.data) {
          state.aiCoverUrl = response.data;
          state.promptDialogVisible = false;
          ElMessage.success("封面生成成功");
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

    const applyAiCover = async () => {
      if (state.aiCoverUrl) {
        try {
          const url = state.aiCoverUrl;
          const response = await pngToJpg({url: url});
          state.book.picUrl = response.data;
          console.log("最终url" + response.data);
          state.aiCoverUrl = null;
          ElMessage.success("封面已应用");
        } catch (error) {
          ElMessage.error("封面应用失败");
        }
      }
    };

    const cancelAiCover = () => {
      state.aiCoverUrl = null;
    };

    const handlePromptDialogClose = (done) => {
      if (state.isGenerating) {
        ElMessage.warning("封面正在生成中，请稍候...");
        return;
      }
      done();
    };

    const saveBook = async () => {
      console.log("sate=========",state.book)
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
        state.isSubmitting = true;
        await publishBook(state.book);
        ElMessage.success("小说发布成功！");
        router.replace({'name':'authorBookList'});
      } catch (error) {
        ElMessage.error("发布失败：" + (error.message || "未知错误"));
      } finally {
        state.isSubmitting = false;
      }
    }

    return {
      ...toRefs(state),
      picUpload,
      beforeAvatarUpload,
      handleAvatarSuccess,
      loadCategoryList,
      categoryChange,
      saveBook,
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

/* 侧边装饰 - 与BookList页面保持一致 */
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

@keyframes loading {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  font-size: 14px;
}

.tech-button:hover {
  background: rgba(33, 150, 243, 0.2);
  border-color: rgba(33, 150, 243, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(33, 150, 243, 0.3);
}

.tech-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.tech-button.primary {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  border-color: #2196f3;
}

.tech-button.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  box-shadow: 0 8px 20px rgba(33, 150, 243, 0.4);
}

.tech-button.secondary {
  background: rgba(108, 117, 125, 0.1);
  border-color: rgba(108, 117, 125, 0.3);
  color: #6c757d;
}

.tech-button.secondary:hover {
  background: rgba(108, 117, 125, 0.2);
  border-color: rgba(108, 117, 125, 0.5);
  color: #495057;
}

.tech-button.success {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border-color: #28a745;
}

.tech-button.success:hover {
  background: linear-gradient(135deg, #20c997, #17a2b8);
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.4);
}

.tech-button.danger {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border-color: #dc3545;
}

.tech-button.danger:hover {
  background: linear-gradient(135deg, #c82333, #a71e2a);
  box-shadow: 0 8px 20px rgba(220, 53, 69, 0.4);
}

.tech-button.ai-btn {
  background: linear-gradient(135deg, #9c27b0, #673ab7);
  color: white;
  border-color: #9c27b0;
}

.tech-button.ai-btn:hover {
  background: linear-gradient(135deg, #8e24aa, #5e35b1);
  box-shadow: 0 8px 20px rgba(156, 39, 176, 0.4);
}

.tech-button.large {
  padding: 16px 32px;
  font-size: 16px;
}

.button-icon {
  margin-right: 8px;
  font-style: normal;
}

.button-icon.loading {
  animation: loading 1s linear infinite;
}

/* 表单容器 */
.form-container {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.light-theme .form-container {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.form-card {
  max-width: 800px;
  margin: 0 auto;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #fff;
  font-weight: 500;
  font-size: 14px;
}

.light-theme .form-label {
  color: #333;
}

.label-icon {
  margin-right: 8px;
  font-size: 16px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
}

.light-theme .form-input,
.light-theme .form-select,
.light-theme .form-textarea {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: rgba(33, 150, 243, 0.5);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  background: rgba(255, 255, 255, 0.1);
}

.light-theme .form-input:focus,
.light-theme .form-select:focus,
.light-theme .form-textarea:focus {
  background: rgba(255, 255, 255, 0.9);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.light-theme .form-input::placeholder,
.light-theme .form-textarea::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

/* 封面上传区域 */
.cover-upload-area {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.cover-uploader {
  flex-shrink: 0;
}

.upload-wrapper {
  position: relative;
  width: 180px;
  height: 240px;
  border: 2px dashed rgba(33, 150, 243, 0.3);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-wrapper:hover {
  border-color: rgba(33, 150, 243, 0.6);
  box-shadow: 0 0 20px rgba(33, 150, 243, 0.2);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-wrapper:hover .upload-overlay {
  opacity: 1;
}

.upload-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.ai-cover-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.ai-cover-preview {
  border: 1px solid rgba(33, 150, 243, 0.3);
  border-radius: 12px;
  padding: 15px;
  background: rgba(33, 150, 243, 0.05);
}

.preview-wrapper {
  display: flex;
  gap: 15px;
  align-items: center;
}

.preview-image {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 提交按钮区域 */
.submit-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* AI对话框样式 */
.ai-dialog {
  --el-dialog-bg-color: rgba(18, 18, 18, 0.95);
  --el-dialog-title-font-size: 18px;
}

.ai-dialog.light-theme {
  --el-dialog-bg-color: rgba(255, 255, 255, 0.95);
}

.dialog-content {
  color: #fff;
}

.light-theme .dialog-content {
  color: #333;
}

.prompt-section h4 {
  margin: 0 0 15px 0;
  color: #2196f3;
  font-size: 16px;
}

.prompt-input {
  --el-input-bg-color: rgba(255, 255, 255, 0.05);
  --el-input-border-color: rgba(255, 255, 255, 0.2);
  --el-input-text-color: #fff;
}

.light-theme .prompt-input {
  --el-input-bg-color: rgba(0, 0, 0, 0.02);
  --el-input-border-color: rgba(0, 0, 0, 0.1);
  --el-input-text-color: #333;
}

.prompt-tips {
  margin-top: 20px;
  padding: 15px;
  background: rgba(33, 150, 243, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(33, 150, 243, 0.2);
}

.prompt-tips h5 {
  margin: 0 0 10px 0;
  color: #2196f3;
  font-size: 14px;
}

.prompt-tips ul {
  margin: 0;
  padding-left: 20px;
}

.prompt-tips li {
  margin-bottom: 5px;
  color: #ccc;
  font-size: 13px;
}

.light-theme .prompt-tips li {
  color: #666;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: span 1;
  }

  .header-content {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .cover-upload-area {
    flex-direction: column;
    align-items: center;
  }

  .preview-wrapper {
    flex-direction: column;
    text-align: center;
  }

  .preview-actions {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
