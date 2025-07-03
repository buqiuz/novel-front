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
            <div class="chapter-add-container">
              <!-- 页面标题 -->
              <div class="page-header">
                <div class="header-content">
                  <h1>发布新章节</h1>
                  <div class="header-actions">
                    <router-link
                      :to="{ name: 'authorChapterList', query: { id: bookId } }"
                      class="tech-button secondary"
                    >
                      <span>返回章节列表</span>
                      <i class="button-icon">←</i>
                    </router-link>
                  </div>
                </div>
                <div class="tech-line-full"></div>
              </div>

              <!-- 章节表单 -->
              <div class="chapter-form-card">
                <form @submit.prevent="saveChapter">
                  <!-- 章节名称输入 -->
                  <div class="form-section">
                    <div class="form-group">
                      <label class="form-label">
                        <i class="label-icon">📝</i>
                        章节名称
                      </label>
                      <input
                        v-model="chapter.chapterName"
                        type="text"
                        class="form-input"
                        placeholder="请输入章节名称..."
                        required
                      />
                    </div>
                  </div>

                  <!-- 章节内容输入 -->
                  <div class="form-section">
                    <div class="form-group">
                      <label class="form-label">
                        <i class="label-icon">✍️</i>
                        章节内容
                      </label>

                      <!-- AI工具栏 -->
                      <div class="ai-toolbar">
                        <div class="ai-toolbar-header">
                          <span class="ai-title">AI写作助手</span>
                          <div class="ai-status" :class="{ 'generating': generating }">
                            <span v-if="generating" class="status-text">AI生成中...</span>
                            <span v-else class="status-text">{{ hasSelection ? '已选择文本' : '请选择文本' }}</span>
                          </div>
                        </div>
                        <div class="ai-buttons">
                          <el-button
                            v-for="btn in aiButtons"
                            :key="btn.action"
                            :type="btn.type"
                            :disabled="!hasSelection || generating"
                            @click="openDialog(btn.action)"
                            size="small"
                            class="ai-btn"
                          >
                            {{ btn.label }}
                            <el-icon v-if="generating" class="is-loading">
                              <Loading />
                            </el-icon>
                          </el-button>
                        </div>
                      </div>

                      <!-- 参数输入对话框 -->
                      <el-dialog
                        v-model="dialogVisible"
                        :title="dialogTitle"
                        width="30%"
                        class="ai-dialog"
                      >
                        <div
                          v-if="
                            currentAction === 'expand' ||
                            currentAction === 'condense'
                          "
                        >
                          <el-input
                            v-model.number="ratio"
                            type="number"
                            :placeholder="`请输入${
                              currentAction === 'expand' ? '扩写' : '缩写'
                            }比例（1-200%）`"
                            min="1"
                            max="200"
                          >
                            <template #append>%</template>
                          </el-input>
                        </div>

                        <div v-if="currentAction === 'continue'">
                          <el-input
                            v-model.number="length"
                            type="number"
                            placeholder="请输入续写长度（50-1000字）"
                            min="50"
                            max="1000"
                          >
                            <template #append>字</template>
                          </el-input>
                        </div>

                        <template #footer>
                          <el-button @click="dialogVisible = false">取消</el-button>
                          <el-button type="primary" @click="confirmParams">确定</el-button>
                        </template>
                      </el-dialog>

                      <!-- 文本编辑器 -->
                      <div class="editor-container">
                        <textarea
                          ref="editor"
                          v-model="chapter.chapterContent"
                          class="chapter-editor"
                          placeholder="开始您的创作之旅..."
                          rows="20"
                          @mouseup="checkSelection"
                          @keyup="checkSelection"
                        ></textarea>
                        <div class="editor-stats">
                          <span class="word-count">字数：{{ chapter.chapterContent.length }}</span>
                          <span class="selection-info" v-if="hasSelection">已选择：{{ selectedText.length }}字</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 收费设置 -->
                  <div class="form-section">
                    <div class="form-group">
                      <label class="form-label">
                        <i class="label-icon">💰</i>
                        章节类型
                      </label>
                      <div class="radio-group">
                        <label class="radio-item">
                          <input
                            v-model="chapter.isVip"
                            type="radio"
                            name="isVip"
                            value="0"
                            class="radio-input"
                          />
                          <span class="radio-custom"></span>
                          <span class="radio-label">免费章节</span>
                        </label>
                        <label class="radio-item">
                          <input
                            v-model="chapter.isVip"
                            type="radio"
                            name="isVip"
                            value="1"
                            class="radio-input"
                          />
                          <span class="radio-custom"></span>
                          <span class="radio-label">付费章节</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- 提交按钮 -->
                  <div class="form-actions">
                    <button type="submit" class="tech-button primary large">
                      <span>发布章节</span>
                      <i class="button-icon">🚀</i>
                    </button>
                  </div>
                </form>
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
import { reactive, toRefs, computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage} from "element-plus";
import { publishChapter, aiGenerate } from "@/api/author";
import Navbar from "@/components/common/Navbar.vue";

export default {
  name: "authorChapterAdd",
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const editor = ref(null);

    const state = reactive({
      bookId: route.query.id,
      chapter: { chapterName: "", chapterContent: "", isVip: 0 },
      hasSelection: false,
      generating: false,
      selectedText: "",
      isDarkTheme: localStorage.getItem('theme') === 'light' ? false : true,
      aiButtons: [
        { label: "AI扩写", action: "expand", type: "primary" },
        { label: "AI缩写", action: "condense", type: "success" },
        { label: "AI续写", action: "continue", type: "warning" },
        { label: "AI润色", action: "polish", type: "danger" },
      ],
      dialogVisible: false,
      currentAction: '',
      ratio: 30,    // 默认扩写/缩写比例
      length: 200,  // 默认续写长度
    });

    // 主题切换
    const changeTheme = (isDark) => {
      state.isDarkTheme = isDark;
    };

    const dialogTitle = computed(() => {
      const map = {
        expand: '扩写设置',
        condense: '缩写设置',
        continue: '续写设置',
        polish: '润色设置'
      }
      return map[state.currentAction]
    })

    const openDialog = (action) => {
      state.currentAction = action
      // 润色不需要参数
      if (action === 'polish') {
        handleAI(action)
      } else {
        state.dialogVisible = true
      }
    }

    const validateParams = () => {
      if (state.currentAction === 'expand') {
        if (!state.ratio || state.ratio < 110 || state.ratio > 200) {
          ElMessage.error('请输入110-200%之间的比例')
          return false
        }
      }
      if (state.currentAction === 'condense') {
        if (!state.ratio || state.ratio < 1 || state.ratio > 99) {
          ElMessage.error('请输入1-99%之间的比例')
          return false
        }
      }
      if (state.currentAction === 'continue') {
        if (!state.length || state.length < 50 || state.length > 1000) {
          ElMessage.error('请输入50-1000字之间的长度')
          return false
        }
      }
      return true
    }

    const confirmParams = async () => {
      if (!validateParams()) return
      
      state.dialogVisible = false
      await handleAI(state.currentAction)
    }

    const checkSelection = () => {
      const textarea = editor.value;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        state.hasSelection = start !== end;
        if (state.hasSelection) {
          state.selectedText = textarea.value.substring(start, end);
        }
      }
    };

    const typewriterEffect = (text) => {
      return new Promise((resolve) => {
        let index = 0;
        const typing = setInterval(() => {
          if (index < text.length) {
            state.chapter.chapterContent += text.charAt(index);
            index++;
            // 自动滚动到底部
            if (editor.value) {
              editor.value.scrollTop = editor.value.scrollHeight;
            }
          } else {
            clearInterval(typing);
            resolve();
          }
        }, 20);
      });
    };

    const handleAI = async (action) => {    
      try {
        state.generating = true
        
        const params = {
          text: state.selectedText
        }

        // 添加参数
        if (action === 'expand' || action === 'condense') {
          params.ratio = state.ratio
        }
        if (action === 'continue') {
          params.length = state.length
        }

        const response = await aiGenerate(action, params)

        // 在原有内容后追加生成内容，并实现打字效果
        const newContent = `\n\n【AI生成内容】${response.data}`;
        state.hasSelection = false;
        state.selectedText = '';
        await typewriterEffect(newContent);
      } catch (error) {
        ElMessage.error("AI生成失败：" + error.message);
      } finally {
        state.generating = false;
      }
    };

    const saveChapter = async () => {
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
        await publishChapter(state.bookId, state.chapter);
        ElMessage.success("章节发布成功！");
        router.replace({ name: "authorChapterList", query: { id: state.bookId } });
      } catch (error) {
        ElMessage.error("发布失败：" + error.message);
      }
    };

    return {
      ...toRefs(state),
      editor,
      checkSelection,
      handleAI,
      saveChapter,
      dialogTitle,
      openDialog,
      confirmParams,
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

.chapter-add-container {
  width: 100%;
  animation: fadeIn 0.5s ease-out;
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

.tech-button.primary {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  border-color: #2196f3;
}

.tech-button.primary:hover {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  box-shadow: 0 8px 20px rgba(33, 150, 243, 0.4);
}

.tech-button.secondary {
  background: rgba(128, 0, 128, 0.1);
  border-color: rgba(128, 0, 128, 0.3);
  color: #800080;
}

.tech-button.secondary:hover {
  background: rgba(128, 0, 128, 0.2);
  border-color: rgba(128, 0, 128, 0.5);
  box-shadow: 0 8px 20px rgba(128, 0, 128, 0.3);
}

.tech-button.large {
  padding: 15px 30px;
  font-size: 16px;
}

.button-icon {
  margin-left: 8px;
  font-style: normal;
}

/* 表单卡片 */
.chapter-form-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  backdrop-filter: blur(10px);
  position: relative;
}

.light-theme .chapter-form-card {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.chapter-form-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(128, 0, 128, 0.1));
  border-radius: 18px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.chapter-form-card:hover::before {
  opacity: 1;
}

/* 表单区域 */
.form-section {
  margin-bottom: 30px;
}

.form-group {
  position: relative;
}

.form-label {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}

.light-theme .form-label {
  color: #333;
}

.label-icon {
  margin-right: 8px;
  font-size: 18px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
}

.light-theme .form-input {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
}

.form-input:focus {
  border-color: rgba(33, 150, 243, 0.5);
  box-shadow: 0 0 15px rgba(33, 150, 243, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.light-theme .form-input:focus {
  background: rgba(0, 0, 0, 0.03);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.light-theme .form-input::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

/* AI工具栏 */
.ai-toolbar {
  margin-bottom: 15px;
  padding: 15px;
  background: rgba(33, 150, 243, 0.05);
  border: 1px solid rgba(33, 150, 243, 0.1);
  border-radius: 8px;
}

.light-theme .ai-toolbar {
  background: rgba(33, 150, 243, 0.02);
  border: 1px solid rgba(33, 150, 243, 0.1);
}

.ai-toolbar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.ai-title {
  font-size: 14px;
  font-weight: 500;
  color: #2196f3;
}

.ai-status {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #ccc;
}

.light-theme .ai-status {
  color: #666;
}

.ai-status.generating {
  color: #f80;
}

.ai-status.generating::before {
  content: '⚡';
  margin-right: 5px;
  animation: spin 1s linear infinite;
}

.ai-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.ai-btn {
  border-radius: 6px;
  font-size: 12px;
  padding: 6px 12px;
}

/* 编辑器容器 */
.editor-container {
  position: relative;
}

.chapter-editor {
  width: 100%;
  min-height: 400px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: all 0.3s ease;
}

.light-theme .chapter-editor {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
}

.chapter-editor:focus {
  border-color: rgba(33, 150, 243, 0.5);
  box-shadow: 0 0 15px rgba(33, 150, 243, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.light-theme .chapter-editor:focus {
  background: rgba(0, 0, 0, 0.03);
}

.chapter-editor::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.light-theme .chapter-editor::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.editor-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #ccc;
}

.light-theme .editor-stats {
  color: #666;
}

.word-count {
  color: #2196f3;
}

.selection-info {
  color: #f80;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: 20px;
}

.radio-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.light-theme .radio-item {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.radio-item:hover {
  background: rgba(33, 150, 243, 0.1);
  border-color: rgba(33, 150, 243, 0.3);
}

.radio-input {
  display: none;
}

.radio-custom {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.light-theme .radio-custom {
  border-color: rgba(0, 0, 0, 0.3);
}

.radio-input:checked + .radio-custom {
  border-color: #2196f3;
  background: rgba(33, 150, 243, 0.1);
}

.radio-input:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: #2196f3;
  border-radius: 50%;
}

.radio-label {
  font-size: 14px;
  color: #fff;
}

.light-theme .radio-label {
  color: #333;
}

/* 表单操作区 */
.form-actions {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.light-theme .form-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

/* AI对话框样式 */
:deep(.ai-dialog) {
  --el-dialog-bg-color: rgba(18, 18, 18, 0.95);
  --el-dialog-border-color: rgba(255, 255, 255, 0.1);
  --el-text-color-primary: #fff;
}

.light-theme :deep(.ai-dialog) {
  --el-dialog-bg-color: rgba(255, 255, 255, 0.95);
  --el-dialog-border-color: rgba(0, 0, 0, 0.1);
  --el-text-color-primary: #333;
}

/* 动画效果 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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
  .header-content {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .ai-buttons {
    flex-direction: column;
  }

  .radio-group {
    flex-direction: column;
    gap: 10px;
  }

  .chapter-editor {
    min-height: 300px;
  }
}
</style>
