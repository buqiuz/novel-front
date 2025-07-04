<template>
  <Navbar @themeChange="changeTheme" />
  <div class="page-wrapper" :class="{'light-theme': !isDarkTheme}">
    <div class="side-decoration left-side">
      <div class="tech-circle"></div>
      <div class="tech-line-vertical"></div>
      <div class="tech-dot dot1"></div>
      <div class="tech-dot dot2"></div>
      <div class="tech-dot dot3"></div>
      <div class="tech-circuit"></div>
    </div>
    <div class="content-container">
      <div class="main-container tech-theme user-setup-main" :class="{'light-theme': !isDarkTheme}">
        <div class="user-setup-grid">
          <UserMenu />
          <div class="user-content-card">
            <div class="user-content-title">我的书评</div>
            <div class="user-comment-list">
              <div v-if="total === 0" class="no_contet no_comment">您还没有发表过评论！</div>
              <div v-else>
                <div v-for="(log, index) in filteredComments" :key="log.id || `empty-${index}`" class="comment-item">
                  <div class="comment-header">
                    <span class="comment-time">{{ formatDate(log.createTime) }}</span>
                    <router-link :to="{ name: 'book', params: { id: log.book_id } }" class="comment-book">《{{ log.book_name }}》</router-link>
                  </div>
                  <div class="comment-content-modern">{{ log.comment_content }}</div>
                </div>
              </div>
              <el-pagination
                v-if="total > 0"
                layout="prev, pager, next"
                :total="total"
                :page-size="pageSize"
                :current-page="pageNum"
                @current-change="handlePageChange"
                background
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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
import "@/assets/styles/user.css";
import man from "@/assets/images/man.png";
import { listComments } from '@/api/book'
import { reactive, toRefs, onMounted, computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import UserMenu from "@/components/user/Menu";
import {getUid} from "@/utils/auth";
export default {
  name: "userComment",
  components: {
    Navbar,
    UserMenu
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      pageSize: 8,
      pageNum: 1,
      userComments:[],
      total: 0,
      baseUrl: process.env.VUE_APP_BASE_API_URL,
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
    });
    const isDarkTheme = ref(localStorage.getItem('theme') === 'light' ? false : true);
    const formatDate = (timeStr) => {
      return timeStr.replace('T', ' ');
    };
    const handlePageChange = (pageNum) => {
      state.pageNum = pageNum;
      loadUserComments();
    };
    const loadUserComments = async () => {
      const params={
        userId:Number(getUid()),
        pageNum:state.pageNum,
        pageSize:state.pageSize
      }
      try{
        const res = await listComments(params);
        if(res.ok){
          state.total = Number(res.data.total);
          const comments = res.data.list || [];
          const remaining = state.pageSize - comments.length;
          if (remaining > 0) {
            for (let i = 0; i < remaining; i++) {
              comments.push({ empty: true });
            }
          }
          state.userComments = comments;
        }
      }catch (err){
        console.error('获取书评信息失败', err);
      }
    };
    const filteredComments = computed(() => state.userComments.filter(item => !item.empty));
    const changeTheme = (isDark) => {
      isDarkTheme.value = isDark;
    };
    onMounted(async () => {
      await loadUserComments();
    });
    return {
      ...toRefs(state),
      isDarkTheme,
      changeTheme,
      man,
      formatDate,
      handlePageChange,
      filteredComments
    };
  },
};
</script>

<style scoped>
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
.content-container {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
.side-decoration {
  width: 80px;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}
.left-side { left: 0; border-right: 1px solid rgba(33, 150, 243, 0.1); }
.right-side { right: 0; border-left: 1px solid rgba(33, 150, 243, 0.1); }
.light-theme .left-side { border-right: 1px solid rgba(33, 150, 243, 0.1); }
.light-theme .right-side { border-left: 1px solid rgba(33, 150, 243, 0.1); }
.tech-circle { width: 40px; height: 40px; border: 1px solid rgba(33, 150, 243, 0.5); border-radius: 50%; position: absolute; top: 100px; left: 20px; animation: pulsate 4s infinite; }
.right-side .tech-circle { left: unset; right: 20px; }
.tech-line-vertical { width: 1px; height: 180px; background: linear-gradient(to bottom, rgba(33, 150, 243, 0.5), transparent); position: absolute; top: 150px; left: 40px; }
.right-side .tech-line-vertical { left: unset; right: 40px; background: linear-gradient(to bottom, rgba(128, 0, 128, 0.5), transparent); }
.tech-dot { width: 8px; height: 8px; border-radius: 50%; background-color: #2196f3; position: absolute; }
.right-side .tech-dot { background-color: #800080; }
.dot1 { top: 350px; left: 25px; animation: blink 2s infinite; }
.dot2 { top: 380px; left: 45px; animation: blink 3s infinite; }
.dot3 { top: 410px; left: 25px; animation: blink 2.5s infinite; }
.right-side .dot1 { left: unset; right: 25px; }
.right-side .dot2 { left: unset; right: 45px; }
.right-side .dot3 { left: unset; right: 25px; }
.tech-circuit { width: 60px; height: 200px; position: absolute; top: 450px; left: 10px; border-top: 1px solid rgba(33, 150, 243, 0.3); border-right: 1px solid rgba(33, 150, 243, 0.3); border-bottom: 1px solid rgba(33, 150, 243, 0.3); border-top-right-radius: 20px; border-bottom-right-radius: 20px; }
.right-side .tech-circuit { left: unset; right: 10px; border-right: none; border-left: 1px solid rgba(128, 0, 128, 0.3); border-top: 1px solid rgba(128, 0, 128, 0.3); border-bottom: 1px solid rgba(128, 0, 128, 0.3); border-top-right-radius: 0; border-bottom-right-radius: 0; border-top-left-radius: 20px; border-bottom-left-radius: 20px; }
@keyframes pulsate { 0% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 0.7; } }
@keyframes blink { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
.main-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 40px 20px; color: #fff; background-color: #121212; transition: all 0.3s ease; min-height: 600px; }
.main-container.light-theme { color: #333; background-color: #ffffff; }
.user-setup-grid { display: flex; gap: 40px; align-items: flex-start; }
@media (max-width: 900px) { .user-setup-grid { flex-direction: column; align-items: center; } }
.user-content-card {
  flex: 1;
  max-width: 700px;
  background: rgba(0,0,0,0.18);
  border-radius: 16px;
  box-shadow: 0 6px 32px rgba(33,150,243,0.10), 0 1.5px 8px rgba(0,0,0,0.08);
  padding: 36px 28px 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1.5px solid rgba(33,150,243,0.10);
  transition: background 0.3s, box-shadow 0.3s;
}
.light-theme .user-content-card {
  background: rgba(33,150,243,0.03);
  border: 1.5px solid rgba(33,150,243,0.08);
  box-shadow: 0 6px 32px rgba(33,150,243,0.06), 0 1.5px 8px rgba(0,0,0,0.04);
}
.user-content-title {
  font-size: 22px;
  font-weight: 600;
  color: #2196f3;
  margin-bottom: 24px;
  letter-spacing: 1px;
}
.user-comment-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-height: 120px;
}
.comment-item {
  background: rgba(33,150,243,0.06);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(33,150,243,0.06);
  padding: 18px 20px 14px 20px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
  border: 1px solid rgba(33,150,243,0.08);
}
.light-theme .comment-item {
  background: rgba(33,150,243,0.02);
  border: 1px solid rgba(33,150,243,0.05);
}
.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.comment-time {
  color: #999;
  font-size: 13px;
}
.comment-book {
  color: #2196f3;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
}
.comment-book:hover {
  color: #f80;
}
.comment-content-modern {
  color: #222;
  font-size: 16px;
  line-height: 1.7;
  word-break: break-all;
  padding-left: 2px;
}
.page-wrapper:not(.light-theme) .comment-content-modern {
  color: #fff;
}
.el-pagination { justify-content: center; margin-top: 18px; }
@media (max-width: 600px) { .main-container { padding: 10px; } .user-content-card { padding: 16px 4px; } }
</style>