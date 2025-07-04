<template>
  <Navbar @themeChange="changeTheme" />

  <div class="page-wrapper" :class="{ 'light-theme': !isDarkTheme }">
    <!-- 左侧装饰和菜单 -->
    <div class="left-sidebar">
      <div class="side-decoration">
        <div class="tech-circle"></div>
        <div class="tech-line-vertical"></div>
        <div class="tech-dot dot1"></div>
        <div class="tech-dot dot2"></div>
        <div class="tech-dot dot3"></div>
      </div>

      <!-- 左侧菜单 -->
      <div class="menu-panel left-menu">
        <div class="menu-header">
          <h3>阅读工具</h3>
        </div>
        <div class="menu-items">
          <div class="menu-item" @click="chapterList(data.chapterInfo?.bookId)" title="目录">
            <div class="menu-icon">📚</div>
            <span>目录</span>
          </div>
          <div class="menu-item" @click="bookDetail(data.chapterInfo?.bookId)" title="返回书页">
            <div class="menu-icon">📖</div>
            <span>书页</span>
          </div>
          <div class="menu-item" @click="showSettings = true" title="设置">
            <div class="menu-icon">⚙️</div>
            <span>设置</span>
          </div>
          <div class="menu-item" @click="toggleTTS" title="听书">
            <div class="menu-icon">🎧</div>
            <span>{{ isPlaying ? '暂停' : '听书' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="content-container">
        <div class="chapter-header" v-if="data.chapterInfo">
          <div class="chapter-title-section">
            <h1 class="chapter-title">{{ data.chapterInfo.chapterName }}</h1>
            <div class="chapter-meta">
              <span class="meta-item">
                <i class="meta-icon">📂</i>
                {{ data.bookInfo?.categoryName }}
              </span>
              <span class="meta-item">
                <i class="meta-icon">✍️</i>
                {{ data.bookInfo?.authorName }}
              </span>
              <span class="meta-item">
                <i class="meta-icon">📝</i>
                {{ data.chapterInfo.chapterWordCount }}字
              </span>
              <span class="meta-item">
                <i class="meta-icon">🕒</i>
                {{ data.chapterInfo.chapterUpdateTime }}
              </span>
            </div>
          </div>
        </div>

        <div class="reading-area">
          <div
            id="showReading"
            class="reading-content"
            :style="{
              fontSize: fontSize + 'px',
              fontFamily: fontFamily,
              whiteSpace: 'break-spaces'
            }"
            v-html="data.bookContent"
          ></div>
        </div>

        <div class="chapter-navigation">
          <button class="nav-btn prev-btn" @click="preChapter(data.chapterInfo?.bookId)">
            <i class="nav-icon">←</i>
            <span>上一章</span>
          </button>
          <button class="nav-btn catalog-btn" @click="chapterList(data.chapterInfo?.bookId)">
            <i class="nav-icon">📑</i>
            <span>目录</span>
          </button>
          <button class="nav-btn next-btn" @click="nextChapter(data.chapterInfo?.bookId)">
            <span>下一章</span>
            <i class="nav-icon">→</i>
          </button>
        </div>
      </div>
    </div>

    <!-- 右侧装饰和菜单 -->
    <div class="right-sidebar">
      <div class="side-decoration">
        <div class="tech-circle"></div>
        <div class="tech-line-vertical"></div>
        <div class="tech-dot dot1"></div>
        <div class="tech-dot dot2"></div>
        <div class="tech-dot dot3"></div>
      </div>

      <!-- 右侧菜单 -->
      <div class="menu-panel right-menu">
        <div class="menu-header">
          <h3>快速导航</h3>
        </div>
        <div class="menu-items">
          <div class="menu-item" @click="preChapter(data.chapterInfo?.bookId)" title="上一章">
            <div class="menu-icon">⬅️</div>
            <span>上一章</span>
          </div>
          <div class="menu-item" @click="nextChapter(data.chapterInfo?.bookId)" title="下一章">
            <div class="menu-icon">➡️</div>
            <span>下一章</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <div class="tech-modal" v-if="showSettings" @click.self="showSettings = false">
      <div class="modal-content settings-modal">
        <div class="modal-header">
          <h3>阅读设置</h3>
          <button class="close-btn" @click="showSettings = false">✕</button>
        </div>

        <div class="settings-content">
<!--          <div class="setting-group">-->
<!--            <label class="setting-label">阅读主题</label>-->
<!--            <div class="theme-options">-->
<!--              <button-->
<!--                v-for="color in ['white', 'green', 'pink', 'yellow', 'gray', 'night']"-->
<!--                :key="color"-->
<!--                :class="['theme-btn', color, themeClass === getThemeClass(color) ? 'active' : '']"-->
<!--                @click="setTheme(color)"-->
<!--              >-->
<!--                {{ getThemeName(color) }}-->
<!--              </button>-->
<!--            </div>-->
<!--          </div>-->

          <div class="setting-group">
            <label class="setting-label">字体设置</label>
            <div class="font-options">
              <button
                :class="['font-btn', fontFamily === 'microsoft yahei' ? 'active' : '']"
                @click="setFontFamily(0)"
              >
                雅黑
              </button>
              <button
                :class="['font-btn', fontFamily === 'simsun' ? 'active' : '']"
                @click="setFontFamily(1)"
              >
                宋体
              </button>
              <button
                :class="['font-btn', fontFamily === 'kaiti' ? 'active' : '']"
                @click="setFontFamily(2)"
              >
                楷书
              </button>
            </div>
          </div>

          <div class="setting-group">
            <label class="setting-label">字体大小</label>
            <div class="font-size-control">
              <button class="size-btn" @click="setFontSize(-2)">A-</button>
              <span class="current-size">{{ fontSize }}px</span>
              <button class="size-btn" @click="setFontSize(2)">A+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 音色选择弹窗 -->
    <div class="tech-modal" v-if="showVoiceSelector" @click.self="closeVoiceSelector">
      <div class="modal-content voice-modal">
        <div class="modal-header">
          <h3>选择听书音色</h3>
          <button class="close-btn" @click="closeVoiceSelector">✕</button>
        </div>

        <div class="voice-content">
          <div class="voice-grid">
            <button
              v-for="voice in voices"
              :key="voice"
              :class="['voice-btn', selectedVoice === voice ? 'active' : '']"
              @click="selectVoice(voice)"
            >
              <span class="voice-icon">🎤</span>
              <span>{{ voiceNameMap[voice] }}</span>
            </button>
          </div>

          <div class="voice-controls">
            <button class="control-btn" @click="togglePause">
              <i class="control-icon">{{ isPlaying ? '⏸️' : '▶️' }}</i>
              <span>{{ isPlaying ? '暂停' : '继续' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 解锁章节提示弹窗 -->
    <div class="tech-modal" v-if="showUnlockDialog">
      <div class="modal-content unlock-modal">
        <div class="modal-header">
          <h3>付费章节提示</h3>
        </div>
        <div class="unlock-content">
          <div class="coin-display">
            <span class="coin-icon">💰</span>
            <span class="coin-text">解锁本章：50书币</span>
          </div>
          <p>购买后立即阅读后续精彩内容!</p>
          <div class="modal-actions">
            <button class="action-btn primary" @click="handleBuyChapter()">立即购买</button>
            <button class="action-btn secondary" @click="goToChapterList(data.chapterInfo?.bookId)">取消</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 余额不足提示弹窗 -->
    <div class="tech-modal" v-if="showRechargeDialog">
      <div class="modal-content recharge-modal">
        <div class="modal-header">
          <h3>余额不足</h3>
        </div>
        <div class="recharge-content">
          <div class="recharge-info">
            <div class="warning-icon">⚠️</div>
            <p>书币不够啦~</p>
            <p>去充值可立即阅读精彩内容！</p>
          </div>
          <div class="modal-actions">
            <button class="action-btn primary" @click="goToPayPage(data.chapterInfo?.bookId)">立即充值</button>
            <button class="action-btn secondary" @click="goToChapterList(data.chapterInfo?.bookId)">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/styles/book.css";
import "@/assets/styles/read.css";
import { reactive, toRefs, onMounted, onBeforeUnmount, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import {getBookContent, getPreChapterId, getNextChapterId, unlockChapter} from "@/api/book";
import { ElMessage } from "element-plus";
import Navbar from "@/components/common/Navbar";
import { getTTSStreamUrl, getTTSStreamWithPost } from "@/api/ai";
import { getUid } from "@/utils/auth";
import { checkChapterUnlock } from "@/api/book"
import { getCurrentInstance } from 'vue';

export default {
  name: "bookContent",
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    // 主题控制
    const isDarkTheme = ref(localStorage.getItem('theme') === 'light' ? false : true);

    // 音色映射
    const voiceNameMap = {
      'CHERRY': '甜美女声',
      'SERENA': '成熟女声',
      'ETHAN': '稳重男声',
      'CHELSIE': '温柔女声'
    };

    // 主题映射
    const themeMap = {
      white: 'theme-white',
      green: 'theme-green',
      pink: 'theme-pink',
      yellow: 'theme-yellow',
      gray: 'theme-gray',
      night: 'theme-night',
    };

    const state = reactive({
      data: {},
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
    });

    const fontSize = ref(16);
    const fontFamily = ref('microsoft yahei');
    const themeClass = ref('theme-white');
    const showSettings = ref(false);

    const isPlaying = ref(false);
    const showVoiceSelector = ref(false);
    const voices = ['CHERRY', 'SERENA', 'ETHAN', 'CHELSIE'];
    const selectedVoice = ref('CHERRY');
    const isPaused = ref(false);
    const showUnlockDialog = ref(false);
    const showRechargeDialog = ref(false);

    // 主题切换方法
    const changeTheme = (isDark) => {
      isDarkTheme.value = isDark;
    };

    // 获取主题类名
    const getThemeClass = (theme) => {
      return themeMap[theme] || 'theme-white';
    };

    // 获取主题名称
    const getThemeName = (theme) => {
      const names = {
        white: '默认白',
        green: '护眼绿',
        pink: '温馨粉',
        yellow: '暖阳黄',
        gray: '简约灰',
        night: '夜间黑'
      };
      return names[theme] || '默认白';
    };

    // 设置主题
    const setTheme = (theme) => {
      themeClass.value = getThemeClass(theme);
    };

    // 新增 Web Audio 播放相关变量
    let audioContext = null;
    let audioQueue = [];
    let currentSource = null;

    function updateStatus(msg, color = 'green') {
      console.log(`[TTS Status] ${msg}`);
    }

    const decodeHtmlKeepSpace = (html) => {
      const withSpaces = html.replace(/&nbsp;/g, ' ');
      const txt = document.createElement('textarea');
      txt.innerHTML = withSpaces;
      const decoded = txt.value.replace(/<[^>]+>/g, '');

      const maxLength = 512;
      if (decoded.length > maxLength) {
        return decoded.slice(0, maxLength);
      }
      return decoded;
    };

    async function playAudioQueue() {
      if (audioQueue.length === 0 || isPaused.value) {
        isPlaying.value = false;
        return;
      }

      isPlaying.value = true;
      const buffer = audioQueue.shift();

      try {
        const audioBuffer = await audioContext.decodeAudioData(buffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();

        currentSource = source;

        source.onended = () => {
          playAudioQueue();
        };
      } catch (e) {
        updateStatus("播放音频失败: " + e.message, "red");
        playAudioQueue();
      }
    }

    const toggleTTS = () => {
      if (isPlaying.value && !isPaused.value) {
        pauseTts();
      } else {
        showVoiceSelector.value = true;
      }
    };

    let audioProcessingCancelled = false;
    const selectVoice = async (voice) => {
      audioProcessingCancelled = true;
      await new Promise(resolve => setTimeout(resolve, 500));
      audioProcessingCancelled = false;

      audioQueue = [];
      isPlaying.value = false;
      isPaused.value = false;

      if (currentSource) {
        try {
          currentSource.stop();
          currentSource.disconnect();
          currentSource = null;
        } catch (err) {
          console.error("停止音频播放失败:", err);
        }
      }

      if (audioContext) {
        try {
          await audioContext.close();
        } catch (e) {
          console.error("关闭音频上下文失败:", e);
        }
        audioContext = null;
      }

      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      selectedVoice.value = voice;
      showVoiceSelector.value = false;

      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await audioContext.resume();
      } else if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const text = decodeHtmlKeepSpace(state.data.bookContent || '');

      if (!text) {
        console.warn('文本内容为空，无法播放');
        return;
      }

      try {
        updateStatus("正在连接服务器...");
        const response = await getTTSStreamWithPost(text, voice);

        if (!response.ok) {
          throw new Error(`服务器响应错误: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          if(audioProcessingCancelled){
            console.log("音频处理被取消，停止处理事件");
            break;
          }
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop() || '';

          for (const event of events) {
            if(audioProcessingCancelled){
              console.log("音频处理被取消，停止处理事件");
              break;
            }
            const lines = event.split('\n');
            let eventName = '';
            let eventData = '';

            for (const line of lines) {
              if (line.startsWith('event:')) {
                eventName = line.slice(6).trim();
              } else if (line.startsWith('data:')) {
                eventData = line.slice(5).trim();
              }
            }

            if (eventName === 'audioChunk' && eventData) {
              try {
                const base64Data = eventData;
                const binaryString = atob(base64Data);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }

                audioQueue.push(bytes.buffer);
                console.log("音频片段已添加到队列，当前队列长度：", audioQueue.length);

                if (!isPlaying.value) {
                  console.log("开始播放音频队列...");
                  await playAudioQueue();
                }
              } catch (err) {
                updateStatus("音频解码失败：" + err.message, "red");
              }
            }
          }
        }
      } catch (error) {
        updateStatus(`连接失败: ${error.message}`, "red");
      }
    };

    const pauseTts = () => {
      isPaused.value = true;
      isPlaying.value = false;
      if (currentSource) {
        try {
          currentSource.stop();
        } catch (e) {}
        currentSource = null;
      }
      updateStatus('播放已暂停');
    };

    const resumeTts = () => {
      if (!isPaused.value) return;
      isPaused.value = false;
      if (!isPlaying.value && audioQueue.length > 0) {
        playAudioQueue();
      }
      updateStatus('播放已继续');
    };

    const togglePause = () => {
      if (isPaused.value) {
        resumeTts();
      } else {
        pauseTts();
      }
    };

    const goToChapterList = (bookId) => {
      if (bookId) {
        showUnlockDialog.value = false;
        showRechargeDialog.value = false;
        document.body.style.overflow = '';
        router.push({ path: `/chapter_list/${bookId}` });
      } else {
        ElMessage.error("无法获取书籍 ID");
      }
    };

    onMounted(() => {
      init(route.params.chapterId);
      keyDown();
    });

    onBeforeUnmount(() => {
      document.onkeydown = null;
      if (currentSource) {
        try {
          currentSource.stop();
        } catch {}
        currentSource = null;
      }
      if (audioContext) {
        audioContext.close();
      }
    });

    const handleBuyChapter = async () => {
      const userId = getUid();
      try{
        const res = await unlockChapter(userId, route.params.chapterId, 50);
        if(res.data==='1'){
          location.reload();
        } else {
          showUnlockDialog.value = false;
          showRechargeDialog.value = true;
        }
      }catch (error) {
        ElMessage.error("网络异常，请稍后再试");
        console.error(error);
      }
    };

    const goToPayPage = (bookId) => {
      const chapterId = route.params.chapterId;
      showRechargeDialog.value = false;
      document.body.style.overflow = '';
      router.push({
        name:'payment',
        query:{
          bookId,
          chapterId
        }
      });
    };

    const bookDetail = (bookId) => {
      router.push({ path: `/book/${bookId}` });
    };

    const chapterList = (bookId) => {
      router.push({ path: `/chapter_list/${bookId}` });
    };

    const preChapter = async (bookId) => {
      const { data } = await getPreChapterId(route.params.chapterId);
      if (data) {
        router.replace({ path: `/book/${bookId}/${data}` });
        init(data);
      } else {
        ElMessage.warning("已经是第一章了！");
      }
    };

    const nextChapter = async (bookId) => {
      const { data } = await getNextChapterId(route.params.chapterId);
      if (data) {
        router.replace({ path: `/book/${bookId}/${data}` });
        init(data);
      } else {
        ElMessage.warning("已经是最后一章了！");
      }
    };

    const init = async (chapterId) => {
      const { data } = await getBookContent(chapterId);
      state.data = data;
      const userId = getUid();
      if(!userId){
        ElMessage.warning("请先登录！");
        await router.replace({name: "login"});
      }
      try{
        const res = await checkChapterUnlock({userId:userId,bookId:data.chapterInfo.bookId, chapterId:chapterId});
        console.log("解锁结果：", res);
        if(res.data==='1'){
          console.log("位于书架中，自动解锁")
          await handleBuyChapter();
        }
        else if(res.data==='2'){
          console.log("不位于书架中，需要手动解锁")
          document.body.style.overflow = 'hidden'; // 禁止滚动
          showUnlockDialog.value = true;
        }
        else{
          console.log("已解锁")
        }
      } catch (error) {
        ElMessage.error("网络异常，请稍后再试");
        console.error(error);
      }
    };

    const keyDown = () => {
      document.onkeydown = (e) => {
        let e1 = e || window.event;
        if (!state.data.chapterInfo) return;
        const bookId = state.data.chapterInfo.bookId;
        if (e1.keyCode === 37) {
          preChapter(bookId);
        } else if (e1.keyCode === 39) {
          nextChapter(bookId);
        }
      };
    };

    return {
      ...toRefs(state),
      isDarkTheme,
      changeTheme,
      showUnlockDialog,
      showRechargeDialog,
      goToPayPage,
      handleBuyChapter,
      goToChapterList,
      nextChapter,
      preChapter,
      fontSize,
      fontFamily,
      themeClass,
      showSettings,
      bookDetail,
      chapterList,
      setFontSize: (delta) => {
        const newSize = fontSize.value + delta;
        if (newSize >= 12 && newSize <= 32) fontSize.value = newSize;
      },
      setFontFamily: (type) => {
        if (type === 0) fontFamily.value = 'microsoft yahei';
        else if (type === 1) fontFamily.value = 'simsun';
        else if (type === 2) fontFamily.value = 'kaiti';
      },
      setTheme,
      getThemeClass,
      getThemeName,
      isPlaying,
      showVoiceSelector,
      voices,
      selectedVoice,
      voiceNameMap,
      toggleTTS,
      selectVoice,
      closeVoiceSelector: () => (showVoiceSelector.value = false),
      togglePause,
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
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow-x: hidden;
  transition: all 0.3s ease;
}

.page-wrapper.light-theme {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
}

/* 侧边栏样式 */
.left-sidebar, .right-sidebar {
  width: 120px;
  position: fixed;
  top: 60px;
  bottom: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.left-sidebar {
  left: 0;
  border-right: 1px solid rgba(79, 172, 254, 0.1);
}

.right-sidebar {
  right: 0;
  border-left: 1px solid rgba(128, 0, 128, 0.1);
}

.light-theme .left-sidebar {
  border-right: 1px solid rgba(79, 172, 254, 0.1);
}

.light-theme .right-sidebar {
  border-left: 1px solid rgba(128, 0, 128, 0.1);
}

/* 侧边装饰 */
.side-decoration {
  position: relative;
  height: 100%;
  width: 100%;
  pointer-events: none;
}

.tech-circle {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(79, 172, 254, 0.5);
  border-radius: 50%;
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  animation: pulsate 3s infinite;
}

.right-sidebar .tech-circle {
  border-color: rgba(128, 0, 128, 0.5);
}

.tech-line-vertical {
  width: 2px;
  height: 120px;
  background: linear-gradient(to bottom, rgba(79, 172, 254, 0.5), transparent);
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
}

.right-sidebar .tech-line-vertical {
  background: linear-gradient(to bottom, rgba(128, 0, 128, 0.5), transparent);
}

.tech-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #4facfe;
  position: absolute;
}

.right-sidebar .tech-dot {
  background-color: #800080;
}

.dot1 {
  top: 250px;
  left: 30px;
  animation: blink 2s infinite;
}

.dot2 {
  top: 280px;
  left: 60px;
  animation: blink 3s infinite;
}

.dot3 {
  top: 310px;
  left: 30px;
  animation: blink 2.5s infinite;
}

/* 菜单面板 */
.menu-panel {
  position: absolute;
  bottom: 40px;
  width: 100px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(79, 172, 254, 0.3);
  backdrop-filter: blur(10px);
  left: 10px;
  pointer-events: auto;
  transition: all 0.3s ease;
}

.light-theme .menu-panel {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(79, 172, 254, 0.2);
}

.right-sidebar .menu-panel {
  right: 10px;
  left: unset;
  border-color: rgba(128, 0, 128, 0.3);
}

.light-theme .right-sidebar .menu-panel {
  border-color: rgba(128, 0, 128, 0.2);
}

.menu-header {
  padding: 12px 8px 8px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.light-theme .menu-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.menu-header h3 {
  margin: 0;
  font-size: 12px;
  color: #fff;
  font-weight: 500;
}

.light-theme .menu-header h3 {
  color: #333;
}

.menu-items {
  padding: 8px 0;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  margin: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
}

.light-theme .menu-item {
  background: rgba(0, 0, 0, 0.03);
}

.menu-item:hover {
  background: rgba(79, 172, 254, 0.2);
  transform: translateY(-2px);
}

.light-theme .menu-item:hover {
  background: rgba(79, 172, 254, 0.1);
}

.right-sidebar .menu-item:hover {
  background: rgba(128, 0, 128, 0.2);
}

.light-theme .right-sidebar .menu-item:hover {
  background: rgba(128, 0, 128, 0.1);
}

.menu-icon {
  font-size: 16px;
  margin-bottom: 2px;
}

.menu-item span {
  font-size: 10px;
  color: #fff;
  text-align: center;
}

.light-theme .menu-item span {
  color: #333;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  margin: 60px 120px 0;
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
}

.content-container {
  width: 100%;
  max-width: 950px;
  padding: 20px;
}

/* 章节标题区域 */
.chapter-header {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid rgba(79, 172, 254, 0.2);
  backdrop-filter: blur(10px);
}

.light-theme .chapter-header {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(79, 172, 254, 0.1);
}

.chapter-title {
  font-size: 28px;
  margin: 0 0 16px 0;
  color: #fff;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.light-theme .chapter-title {
  color: #333;
  text-shadow: none;
}

.chapter-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  color: #ccc;
  font-size: 14px;
}

.light-theme .meta-item {
  color: #666;
}

.meta-icon {
  margin-right: 6px;
  font-size: 16px;
}

/* 阅读区域 */
.reading-area {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 20px;
  border: 1px solid rgba(79, 172, 254, 0.2);
  backdrop-filter: blur(10px);
  min-height: 60vh;
}

.light-theme .reading-area {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(79, 172, 254, 0.1);
}

.reading-content {
  line-height: 2;
  color: #e0e0e0;
  text-align: justify;
  text-indent: 2em;
}

.light-theme .reading-content {
  color: #333;
}

/* 章节导航 */
.chapter-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
}

.nav-btn {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(79, 172, 254, 0.3);
  backdrop-filter: blur(10px);
}

.nav-btn:hover {
  background: rgba(79, 172, 254, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
}

.nav-btn .nav-icon {
  font-size: 16px;
  margin: 0 6px;
}

.prev-btn, .next-btn {
  flex: 1;
}

.catalog-btn {
  flex: 0 0 auto;
}

/* 弹窗样式 */
.tech-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: rgba(0, 0, 0, 0.9);
  border-radius: 12px;
  border: 1px solid rgba(79, 172, 254, 0.3);
  backdrop-filter: blur(20px);
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.light-theme .modal-content {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(79, 172, 254, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.light-theme .modal-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-header h3 {
  margin: 0;
  color: #fff;
  font-size: 18px;
}

.light-theme .modal-header h3 {
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.light-theme .close-btn {
  color: #333;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.light-theme .close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* 设置弹窗内容 */
.settings-content {
  padding: 24px;
}

.setting-group {
  margin-bottom: 24px;
}

.setting-label {
  display: block;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.light-theme .setting-label {
  color: #333;
}

.theme-options, .font-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.theme-btn, .font-btn {
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
}

.light-theme .theme-btn,
.light-theme .font-btn {
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
  color: #333;
}

.theme-btn:hover, .font-btn:hover {
  background: rgba(79, 172, 254, 0.2);
  border-color: rgba(79, 172, 254, 0.5);
}

.theme-btn.active, .font-btn.active {
  background: rgba(79, 172, 254, 0.3);
  border-color: #4facfe;
  color: #4facfe;
}

.font-size-control {
  display: flex;
  align-items: center;
  gap: 16px;
}

.size-btn {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.light-theme .size-btn {
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
  color: #333;
}

.size-btn:hover {
  background: rgba(79, 172, 254, 0.2);
}

.current-size {
  color: #4facfe;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

/* 音色选择弹窗 */
.voice-content {
  padding: 24px;
}

.voice-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.voice-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.light-theme .voice-btn {
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
  color: #333;
}

.voice-btn:hover {
  background: rgba(79, 172, 254, 0.2);
}

.voice-btn.active {
  background: rgba(79, 172, 254, 0.3);
  border-color: #4facfe;
}

.voice-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.voice-controls {
  display: flex;
  justify-content: center;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 1px solid rgba(79, 172, 254, 0.3);
  border-radius: 8px;
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: rgba(79, 172, 254, 0.3);
}

/* 购买相关弹窗 */
.unlock-content, .recharge-content {
  padding: 24px;
  text-align: center;
}

.unlock-info, .recharge-info {
  margin-bottom: 24px;
}

.coin-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.coin-icon {
  font-size: 20px;
}

.coin-text {
  color: #ffd700;
  font-weight: 500;
}

.unlock-content p, .recharge-content p {
  color: #ccc;
  margin: 8px 0;
}

.light-theme .unlock-content p,
.light-theme .recharge-content p {
  color: #666;
}

.warning-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: #fff;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.light-theme .action-btn.secondary {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.light-theme .action-btn.secondary:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* 动画效果 */
@keyframes pulsate {
  0% { transform: translateX(-50%) scale(1); opacity: 0.7; }
  50% { transform: translateX(-50%) scale(1.1); opacity: 1; }
  100% { transform: translateX(-50%) scale(1); opacity: 0.7; }
}

@keyframes blink {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

/* 阅读主题样式 */
.reading-area.theme-white .reading-content {
  background: #ffffff;
  color: #333333;
}

.reading-area.theme-green .reading-content {
  background: #c7edcc;
  color: #2e7d32;
}

.reading-area.theme-pink .reading-content {
  background: #fce4ec;
  color: #ad1457;
}

.reading-area.theme-yellow .reading-content {
  background: #fff8e1;
  color: #f57f17;
}

.reading-area.theme-gray .reading-content {
  background: #f5f5f5;
  color: #424242;
}

.reading-area.theme-night .reading-content {
  background: #121212;
  color: #e0e0e0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    margin: 60px 80px 0;
  }

  .left-sidebar, .right-sidebar {
    width: 80px;
  }

  .menu-panel {
    width: 70px;
    left: 5px;
  }

  .right-sidebar .menu-panel {
    right: 5px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin: 60px 20px 0;
  }

  .left-sidebar, .right-sidebar {
    display: none;
  }

  .chapter-navigation {
    flex-direction: column;
    gap: 12px;
  }

  .nav-btn {
    width: 100%;
    justify-content: center;
  }

  .content-container {
    padding: 16px;
  }

  .chapter-header {
    padding: 20px;
  }

  .reading-area {
    padding: 24px;
  }

  .chapter-title {
    font-size: 24px;
  }

  .chapter-meta {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    margin: 20px;
    max-width: calc(100vw - 40px);
  }

  .settings-content, .voice-content, .unlock-content, .recharge-content {
    padding: 16px;
  }

  .voice-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
