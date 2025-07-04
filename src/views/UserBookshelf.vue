<template>
  <Header />
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
            <div class="user-content-title">我的书架</div>
            <div class="user-content-table">
              <div v-if="total == 0" class="no_contet no_book">您还没有收藏过书籍哦！</div>
              <div v-else class="dataTable">
                <table>
                  <thead>
                    <tr>
                      <th>最后阅读时间</th>
                      <th>书名</th>
                      <th>章节名</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(log, index) in bookshelf" :key="log.id || `empty-${index}`">
                      <td v-if="log.empty"></td>
                      <td v-else>{{ formatDate(log.updateTime) }}</td>
                      <td v-if="log.empty"></td>
                      <td v-else>
                        <router-link :to="{ name: 'book', params: { id: log.bookId } }" class="book-name-link">
                          {{ log.bookName }}
                        </router-link>
                      </td>
                      <td v-if="log.empty"></td>
                      <td v-else>
                        <router-link :to="{ name: 'book', params: { id: log.bookId + '/' + log.preContentId } }" class="chapter-name-link">
                          {{ log.preChapterName }}
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
      <Footer />
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
import { listBookshelf } from '@/api/user'
import { reactive, toRefs, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import UserMenu from "@/components/user/Menu";
export default {
  name: "userBookshelf",
  components: {
    Header,
    Footer,
    UserMenu
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      pageSize: 8,
      pageNum: 1,
      bookshelf:[],
      total: 0,
      baseUrl: process.env.VUE_APP_BASE_API_URL,
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
      isDarkTheme: localStorage.getItem('theme') === 'light' ? false : true,
    });
    const formatDate = (timeStr) => {
      return timeStr.replace('T', ' ');
    };
    const formatAmount = (amount) => {
      const num = parseFloat(amount);
      if (isNaN(num)) return amount;
      return num >= 0 ? `+${amount}` : amount;
    };
    const handlePageChange = (pageNum) => {
      state.pageNum = pageNum;
      loadBookshelf(); // 重新加载当前页数据
    };
    const loadBookshelf = async () => {
      const params={
        pageNum:state.pageNum,
        pageSize:state.pageSize
      }
      try{
        const res = await listBookshelf(params);
        console.log('获取书架信息成功', res);
        if(res.ok){
          state.total = Number(res.data.total);
          // 填充空数据
          const bookshelf = res.data.list || [];
          const remaining = state.pageSize - bookshelf.length;

          if (remaining > 0) {
            for (let i = 0; i < remaining; i++) {
              bookshelf.push({ empty: true }); // 使用 empty 标记为空行
            }
          }

          state.bookshelf = bookshelf;
        }
      }catch (err){
        console.error('获取书架信息失败', err);
      }
    };
    onMounted(async () => {
      await loadBookshelf();
      window.addEventListener('storage', () => {
        state.isDarkTheme = localStorage.getItem('theme') === 'light' ? false : true;
      });
    });

    return {
      ...toRefs(state),
      man,
      formatDate,
      formatAmount,
      handlePageChange
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
  background: rgba(0,0,0,0.3);
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.08);
}
.light-theme .user-content-card {
  background: rgba(0,0,0,0.02);
  border: 1px solid rgba(0,0,0,0.05);
}
.user-content-title {
  font-size: 22px;
  font-weight: 600;
  color: #2196f3;
  margin-bottom: 24px;
  letter-spacing: 1px;
}
.user-content-table { width: 100%; }
.dataTable { width: 100%; max-height: 400px; overflow-y: auto; border: 1px solid #eaeaea; margin: 0 auto; background: transparent; }
.dataTable table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.dataTable th, .dataTable td { height: 40px; line-height: 40px; vertical-align: middle; padding: 0 10px; font-weight: normal; text-align: center; border: 1px solid #eaeaea; }
.dataTable th { background: #f8f8f8; }
.book-name-link { color: #2196f3; text-decoration: none; font-size: 15px; font-weight: bold; }
.book-name-link:hover { color: #f80; }
.chapter-name-link:hover { color: #f80; }
.el-pagination { justify-content: center; margin-top: 18px; }
@media (max-width: 600px) { .main-container { padding: 10px; } .user-content-card { padding: 16px 4px; } }
</style>
