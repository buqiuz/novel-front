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
        <!-- 炫酷轮播图部分 -->
        <div class="hero-carousel">
          <div class="carousel-container">
            <el-carousel
              :interval="4000"
              type="card"
              height="400px"
              indicator-position="outside"
              arrow="always"
              class="tech-carousel"
            >
              <el-carousel-item
                v-for="(item, index) in sliderContent"
                :key="index"
              >
                <div
                  class="carousel-content"
                  @click="bookDetail(item.bookId)"
                >
                  <div
                    class="book-cover"
                    :style="`background-image: url(${imgBaseUrl + item.picUrl})`"
                  >
                    <div class="gradient-overlay"></div>
                    <div class="book-info">
                      <h2 class="book-title">{{ item.bookName }}</h2>
                      <p class="book-author">{{ item.authorName }}</p>
                      <div class="tech-button">
                        <span>立即阅读</span>
                        <i class="el-icon-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>

        <!-- 推荐书籍与顶部榜单 -->
        <div class="featured-section">
          <div class="section-header">
            <div class="tech-line"></div>
            <h2>精选推荐</h2>
            <div class="tech-line"></div>
          </div>

          <div class="top-books-grid">
            <div
              class="top-book featured"
              v-if="topBooks1[0]"
              @click="bookDetail(topBooks1[0].bookId)"
            >
              <div
                class="book-cover"
                :style="`background-image: url(${imgBaseUrl + topBooks1[0].picUrl})`"
              >
                <div class="gradient-overlay"></div>
              </div>
              <div class="book-details">
                <h3>{{ topBooks1[0].bookName }}</h3>
                <p>{{ topBooks1[0].bookDesc }}</p>
              </div>
              <div class="tech-badge">推荐</div>
            </div>

            <div class="top-books-list">
              <div
                class="top-book-item"
                v-for="(item, index) in topBooks1.slice(1, 5)"
                :key="index"
                @click="bookDetail(item.bookId)"
              >
                <span class="rank-num">{{ index + 1 }}</span>
                <img
                  :src="`${imgBaseUrl}` + `${item.picUrl}`"
                  :alt="item.bookName"
                  class="mini-cover"
                />
                <div class="mini-details">
                  <h4>{{ item.bookName }}</h4>
                  <p>{{ item.authorName }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 本周强推 - 带炫酷效果 -->
        <div class="weekly-recommend">
          <div class="section-header">
            <div class="tech-line"></div>
            <h2>本周强推</h2>
            <div class="tech-line"></div>
          </div>

          <div class="weekly-book-list">
            <div
              class="weekly-book"
              v-for="(item, index) in weekcommend"
              :key="index"
              @click="bookDetail(item.bookId)"
            >
              <div class="glow-effect"></div>
              <div class="book-content">
                <img
                  :src="`${imgBaseUrl}` + `${item.picUrl}`"
                  :alt="item.bookName"
                  class="book-image"
                />
                <div class="book-info">
                  <h3>{{ item.bookName }}</h3>
                  <p class="author">{{ item.authorName }}</p>
                  <p class="desc" v-html="item.bookDesc.substring(0, 80) + '...'"></p>
                  <div class="tech-tag">科技阅读</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 三列榜单展示 -->
        <div class="ranking-section">
          <div class="section-header">
            <div class="tech-line"></div>
            <h2>榜单中心</h2>
            <div class="tech-line"></div>
          </div>

          <div class="rankings-grid">
            <div class="ranking-column visit-rank">
              <div class="rank-header">
                <h3>点击榜单</h3>
                <router-link
                  :to="{ name: 'bookRank' }"
                  class="view-more"
                  >查看全部</router-link
                >
              </div>
              <div class="rank-list">
                <div
                  class="rank-item"
                  v-for="(item, index) in visitBooks"
                  :key="index"
                  @click="bookDetail(item.id)"
                >
                  <span
                    class="rank-num"
                    :class="{'top-rank': index < 3}"
                    >{{ index + 1 }}</span
                  >
                  <img
                    :src="`${imgBaseUrl}` + `${item.picUrl}`"
                    :alt="item.bookName"
                    class="rank-cover"
                  />
                  <div class="rank-info">
                    <h4>{{ item.bookName }}</h4>
                    <p>{{ item.authorName }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="ranking-column newest-rank">
              <div class="rank-header">
                <h3>新书榜单</h3>
                <router-link
                  :to="{ name: 'bookRank' }"
                  class="view-more"
                  >查看全部</router-link
                >
              </div>
              <div class="rank-list">
                <div
                  class="rank-item"
                  v-for="(item, index) in newestBooks"
                  :key="index"
                  @click="bookDetail(item.id)"
                >
                  <span
                    class="rank-num"
                    :class="{'top-rank': index < 3}"
                    >{{ index + 1 }}</span
                  >
                  <img
                    :src="`${imgBaseUrl}` + `${item.picUrl}`"
                    :alt="item.bookName"
                    class="rank-cover"
                  />
                  <div class="rank-info">
                    <h4>{{ item.bookName }}</h4>
                    <p>{{ item.authorName }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="ranking-column update-rank">
              <div class="rank-header">
                <h3>更新榜单</h3>
                <router-link
                  :to="{ name: 'bookRank' }"
                  class="view-more"
                  >查看全部</router-link
                >
              </div>
              <div class="rank-list">
                <div
                  class="rank-item"
                  v-for="(item, index) in updateBooks"
                  :key="index"
                  @click="bookDetail(item.id)"
                >
                  <span
                    class="rank-num"
                    :class="{'top-rank': index < 3}"
                    >{{ index + 1 }}</span
                  >
                  <img
                    :src="`${imgBaseUrl}` + `${item.picUrl}`"
                    :alt="item.bookName"
                    class="rank-cover"
                  />
                  <div class="rank-info">
                    <h4>{{ item.bookName }}</h4>
                    <p>{{ item.lastChapterName }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 热门推荐 - 书籍卡片网格 -->
        <div class="popular-section">
          <div class="section-header">
            <div class="tech-line"></div>
            <h2>热门推荐</h2>
            <div class="tech-line"></div>
          </div>

          <div class="book-cards-grid">
            <div
              class="book-card"
              v-for="(item, index) in hotRecommend"
              :key="index"
              @click="bookDetail(item.bookId)"
            >
              <div class="card-image">
                <img :src="`${imgBaseUrl}` + `${item.picUrl}`" :alt="item.bookName" />
                <div class="hover-info">
                  <p v-html="item.bookDesc.substring(0, 100) + '...'"></p>
                  <div class="read-now">立即阅读</div>
                </div>
              </div>
              <div class="card-content">
                <h3>{{ item.bookName }}</h3>
                <p>{{ item.authorName }}</p>
                <div class="tech-tags">
                  <span class="tag">{{ item.categoryName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 精品推荐 - 交互式展示 -->
        <div class="premium-section">
          <div class="section-header">
            <div class="tech-line"></div>
            <h2>精品推荐</h2>
            <div class="tech-line"></div>
          </div>

          <div class="premium-showcase">
            <el-carousel
              :interval="5000"
              indicator-position="none"
              height="300px"
              arrow="always"
              class="premium-carousel"
            >
              <el-carousel-item
                v-for="(item, index) in goodRecommend"
                :key="index"
              >
                <div
                  class="premium-item"
                  @click="bookDetail(item.bookId)"
                >
                  <div
                    class="premium-cover"
                    :style="`background-image: url(${imgBaseUrl + item.picUrl})`"
                  ></div>
                  <div class="premium-details">
                    <h3>{{ item.bookName }}</h3>
                    <p class="author">{{ item.authorName }}</p>
                    <p class="desc" v-html="item.bookDesc"></p>
                    <div class="tech-button">
                      <span>阅读详情</span>
                      <i class="el-icon-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
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
import { reactive, toRefs, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { listHomeBooks } from "@/api/home";
import { listVisitRankBooks } from "@/api/book";
import { listNewestRankBooks } from "@/api/book";
import { listUpdateRankBooks } from "@/api/book";
import { ElMessage, ElLoading } from "element-plus";
import Navbar from "@/components/common/Navbar";

export default {
  name: "home",
  components: {
    Navbar,

  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      // 轮播图
      sliderContent: [],
      // 顶部栏
      topBooks1: [],
      //本周强推
      weekcommend: [],
      // 热门推荐
      hotRecommend: [],
      // 精品推荐
      goodRecommend: [],
      // 点击榜单
      visitBooks: [],
      // 新书榜单
      newestBooks: [],
      // 更新榜单
      updateBooks: [],
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
      isDarkTheme: localStorage.getItem('theme') === 'light' ? false : true,
    });

    onMounted(async () => {
      const loadingInstance = ElLoading.service({
        fullscreen: true,
        text: "加载中...",
        background: "rgba(0, 0, 0, 0.8)",
      });

      try {
        // 获取首页书籍数据
        const { data } = await listHomeBooks();

        // 分类处理数据
        data.forEach((book) => {
          if (book.type == 0) {
            // 轮播图
            state.sliderContent[state.sliderContent.length] = book;
          }
          if (book.type == 1) {
            // 顶部栏
            state.topBooks1[state.topBooks1.length] = book;
          }
          if (book.type == 2) {
            //本周强推
            state.weekcommend[state.weekcommend.length] = book;
          }
          if (book.type == 3) {
            //热门推荐
            state.hotRecommend[state.hotRecommend.length] = book;
          }
          if (book.type == 4) {
            //精品推荐
            state.goodRecommend[state.goodRecommend.length] = book;
          }
        });

        // 获取点击榜单数据
        const visitResult = await listVisitRankBooks();
        state.visitBooks = visitResult.data.slice(0, 10);

        // 获取新书榜单数据
        const newestResult = await listNewestRankBooks();
        state.newestBooks = newestResult.data.slice(0, 10);

        // 获取更新榜单数据
        const updateResult = await listUpdateRankBooks();
        state.updateBooks = updateResult.data.slice(0, 10);
      } catch (error) {
        ElMessage.error("数据加载失败");
        console.error(error);
      } finally {
        loadingInstance.close();
      }
    });

    const bookDetail = (bookId) => {
      router.push({ path: `/book/${bookId}` });
    };

    const changeTheme = (isDark) => {
      state.isDarkTheme = isDark;
    };

    return {
      ...toRefs(state),
      bookDetail,
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
  max-width: 1200px;
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

/* 科技风圆圈 */
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

/* 垂直线条 */
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

/* 装饰点 */
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

/* 电路图样式 */
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

/* 炫酷轮播图样式 */
.hero-carousel {
  margin-bottom: 40px;
}

.tech-carousel .el-carousel__item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.light-theme .tech-carousel .el-carousel__item {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(33, 150, 243, 0.2);
}

.carousel-content {
  height: 100%;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.carousel-content:hover {
  transform: scale(1.02);
}

.book-cover {
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: flex-end;
}

.gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  z-index: 1;
}

.light-theme .gradient-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.book-info {
  position: relative;
  z-index: 2;
  padding: 30px;
  width: 100%;
}

.book-title {
  font-size: 24px;
  margin: 0;
  margin-bottom: 8px;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.book-author {
  font-size: 16px;
  color: #ccc;
  margin-bottom: 15px;
}

.tech-button {
  display: inline-flex;
  align-items: center;
  background: rgba(33, 150, 243, 0.2);
  border: 1px solid rgba(33, 150, 243, 0.5);
  padding: 8px 16px;
  border-radius: 4px;
  color: #2196f3;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tech-button:hover {
  background: rgba(33, 150, 243, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
}

.tech-button i {
  margin-left: 8px;
}

/* 推荐书籍与顶部榜单 */
.top-books-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.top-book.featured {
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.light-theme .top-book.featured {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.top-book.featured .book-cover {
  height: 100%;
}

.top-book.featured .book-details {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  z-index: 2;
}

.top-book.featured h3 {
  font-size: 22px;
  margin: 0 0 10px 0;
  color: #fff;
}

.top-book.featured p {
  font-size: 14px;
  color: #ddd;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tech-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(128, 0, 128, 0.7);
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 2;
}

.top-books-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.top-book-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.light-theme .top-book-item {
  background: rgba(0, 0, 0, 0.03);
}

.top-book-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.light-theme .top-book-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.rank-num {
  width: 24px;
  height: 24px;
  background: #2196f3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  margin-right: 10px;
}

.mini-cover {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
}

.mini-details h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #fff;
}

.light-theme .mini-details h4 {
  color: #333;
}

.mini-details p {
  margin: 0;
  color: #aaa;
  font-size: 14px;
}

.light-theme .mini-details p {
  color: #666;
}

/* 本周强推样式 */
.weekly-book-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.weekly-book {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 180px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.light-theme .weekly-book {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.glow-effect {
  position: absolute;
  width: 150%;
  height: 200%;
  top: -50%;
  left: -25%;
  background: radial-gradient(circle, rgba(33, 150, 243, 0.15), transparent 70%);
  transform: rotate(-35deg);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.weekly-book:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.light-theme .weekly-book:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.weekly-book:hover .glow-effect {
  opacity: 1;
}

.book-content {
  display: flex;
  height: 100%;
  position: relative;
  z-index: 1;
}

.book-image {
  width: 120px;
  height: 100%;
  object-fit: cover;
}

.book-info {
  padding: 15px;
  flex-grow: 1;
}

.book-info h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #fff;
}

.light-theme .book-info h3 {
  color: #333;
}

.book-info .author {
  color: #aaa;
  font-size: 14px;
  margin-bottom: 10px;
}

.light-theme .book-info .author {
  color: #666;
}

.book-info .desc {
  color: #ddd;
  font-size: 13px;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.light-theme .book-info .desc {
  color: #555;
}

.tech-tag {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: rgba(128, 0, 128, 0.7);
  color: #fff;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 11px;
}

/* 榜单样式 */
.rankings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.ranking-column {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.light-theme .ranking-column {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.rank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.light-theme .rank-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.rank-header h3 {
  margin: 0;
  color: #fff;
  font-size: 18px;
}

.light-theme .rank-header h3 {
  color: #333;
}

.view-more {
  color: #2196f3;
  font-size: 14px;
  text-decoration: none;
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.2s ease;
  cursor: pointer;
}

.light-theme .rank-item {
  background: rgba(0, 0, 0, 0.01);
}

.rank-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.light-theme .rank-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.rank-num {
  width: 24px;
  height: 24px;
  background: #555;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  margin-right: 10px;
}

.rank-num.top-rank {
  background: linear-gradient(135deg, #ff9800, #f44336);
}

.rank-cover {
  width: 40px;
  height: 55px;
  object-fit: cover;
  border-radius: 3px;
  margin-right: 10px;
}

.rank-info h4 {
  margin: 0 0 3px 0;
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.light-theme .rank-info h4 {
  color: #333;
}

.rank-info p {
  margin: 0;
  color: #aaa;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.light-theme .rank-info p {
  color: #666;
}

/* 热门推荐 - 书籍卡片 */
.book-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.book-card {
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.light-theme .book-card {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4);
}

.light-theme .book-card:hover {
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
}

.card-image {
  height: 280px;
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.book-card:hover .card-image img {
  transform: scale(1.05);
}

.hover-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.light-theme .hover-info {
  background: rgba(0, 0, 0, 0.6);
}

.book-card:hover .hover-info {
  opacity: 1;
}

.hover-info p {
  color: #fff;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-now {
  background: #2196f3;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.read-now:hover {
  background: #0d8aee;
  transform: scale(1.05);
}

.card-content {
  padding: 15px;
}

.card-content h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.light-theme .card-content h3 {
  color: #333;
}

.card-content p {
  margin: 0 0 8px 0;
  color: #aaa;
  font-size: 14px;
}

.light-theme .card-content p {
  color: #666;
}

.tech-tags {
  margin-top: 8px;
}

.tag {
  display: inline-block;
  background: rgba(33, 150, 243, 0.2);
  color: #2196f3;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
  margin-right: 5px;
  margin-bottom: 5px;
}

/* 精品推荐样式 */
.premium-section {
  margin-bottom: 60px;
}

.premium-carousel .el-carousel__arrow {
  background: rgba(33, 150, 243, 0.7);
}

.premium-carousel .el-carousel__container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.light-theme .premium-carousel .el-carousel__container {
  border: 1px solid rgba(33, 150, 243, 0.2);
}

.premium-item {
  display: flex;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.light-theme .premium-item {
  background: rgba(0, 0, 0, 0.03);
}

.premium-cover {
  width: 40%;
  background-size: cover;
  background-position: center;
}

.premium-details {
  width: 60%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.premium-details h3 {
  font-size: 24px;
  color: #fff;
  margin: 0 0 10px 0;
}

.light-theme .premium-details h3 {
  color: #333;
}

.premium-details .author {
  color: #ccc;
  font-size: 16px;
  margin-bottom: 15px;
}

.light-theme .premium-details .author {
  color: #666;
}

.premium-details .desc {
  color: #ddd;
  font-size: 14px;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.light-theme .premium-details .desc {
  color: #555;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .side-decoration {
    width: 40px;
  }

  .tech-circle {
    width: 30px;
    height: 30px;
    left: 5px;
  }

  .right-side .tech-circle {
    right: 5px;
  }

  .tech-line-vertical {
    left: 20px;
  }

  .right-side .tech-line-vertical {
    right: 20px;
  }

  .tech-circuit {
    width: 30px;
    left: 5px;
  }

  .right-side .tech-circuit {
    right: 5px;
  }
}

@media (max-width: 1100px) {
  .side-decoration {
    display: none;
  }
}

/* 保留原有样式 */
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

/* 章节标题 */
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
}

.tech-line {
  height: 1px;
  flex: 1;
  background: linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.5), transparent);
}

.section-header h2 {
  font-size: 24px;
  margin: 0 15px;
  text-align: center;
  color: #fff;
  font-weight: 500;
}

.light-theme .section-header h2 {
  color: #333;
}

.light-theme .tech-line {
  background: linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.3), transparent);
}
</style>
