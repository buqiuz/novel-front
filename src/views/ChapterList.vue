<template>
  <Navbar @themeChange="changeTheme" />
  <div class="chapterlist-wrapper" :class="{'light-theme': !isDarkTheme}">
    <div class="chapterlist-container">
      <div class="book-header">
        <div class="book-cover-img">
          <img v-if="book.picUrl" :src="imgBaseUrl + book.picUrl" :alt="book.bookName" />
        </div>
        <div class="book-meta">
          <h1 class="book-title">{{ book.bookName }}</h1>
          <div class="book-info-row">
            <span>作者：<a href="javascript:void(0)">{{ book.authorName }}</a></span>
            <span>类别：{{ book.categoryName }}</span>
            <span>状态：<em>{{ book.bookStatus == 0 ? '连载中' : '已完结' }}</em></span>
          </div>
          <div class="book-info-row">
            <span>总点击：<em>{{ book.visitCount }}</em></span>
            <span>总字数：<em>{{ book.wordCount }}</em></span>
            <span class="book-detail-link" @click="bookDetail(book.id)">书籍详情 &gt;</span>
          </div>
        </div>
      </div>
      <div class="chapterlist-main">
        <div class="chapterlist-title">
          <h2>章节目录 <span class="chapter-count">({{ chapterList.length }})</span></h2>
        </div>
        <div class="chapterlist-list grid-mode">
          <ul>
            <li v-for="(item, index) in chapterList" :key="item.id" @click="bookContent(book.id, item.id)" :class="{'vip': item.isVip == 1}">
              <span class="chapter-name">{{ item.chapterName }}</span>
              <br />
              <span class="chapter-type" :class="{'free': item.isVip != 1, 'vip': item.isVip == 1}">
                [{{ item.isVip == 1 ? '收费' : '免费' }}]
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getBookById, listChapters } from "@/api/book";
import Navbar from "@/components/common/Navbar";
export default {
  name: "chapterList",
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      book: {},
      chapterList: [],
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
      isDarkTheme: localStorage.getItem('theme') === 'light' ? false : true,
    });
    onMounted(() => {
      const bookId = route.params.bookId;
      loadBook(bookId);
      loadChapterList(bookId);
      document.body.setAttribute('data-theme', state.isDarkTheme ? 'dark' : 'light');
    });
    const loadBook = async (bookId) => {
      const { data } = await getBookById(bookId);
      state.book = data;
    };
    const loadChapterList = async (bookId) => {
      const { data } = await listChapters({ bookId: bookId });
      state.chapterList = data;
    };
    const bookContent = (bookId, chapterId) => {
      router.push({ path: `/book/${bookId}/${chapterId}` });
    };
    const bookDetail = (bookId) => {
      router.push({ path: `/book/${bookId}` });
    };
    const changeTheme = (isDark) => {
      state.isDarkTheme = isDark;
      document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };
    return {
      ...toRefs(state),
      bookContent,
      bookDetail,
      changeTheme,
    };
  },
};
</script>

<style scoped>
.chapterlist-wrapper {
  min-height: 100vh;
  background: #101522;
  padding: 0;
  transition: background 0.3s;
}
.chapterlist-wrapper.light-theme {
  background: #f5f5f5;
}
.chapterlist-container {
  max-width: 900px;
  margin: 40px auto 0 auto;
  background: rgba(255,255,255,0.04);
  border-radius: 16px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.10);
  padding: 32px 32px 40px 32px;
  transition: background 0.3s;
}
.chapterlist-wrapper.light-theme .chapterlist-container {
  background: #fff;
  box-shadow: 0 4px 24px rgba(33,150,243,0.08);
}
.book-header {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
}
.book-cover-img {
  width: 120px;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  background: #eee;
  margin-right: 32px;
  box-shadow: 0 2px 12px rgba(33,150,243,0.10);
  flex-shrink: 0;
}
.book-cover-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.book-meta {
  flex: 1;
}
.book-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #fff;
  letter-spacing: 1px;
}
.chapterlist-wrapper.light-theme .book-title {
  color: #222;
}
.book-info-row {
  margin-bottom: 8px;
  color: #b0bec5;
  font-size: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.chapterlist-wrapper.light-theme .book-info-row {
  color: #555;
}
.book-info-row em {
  font-style: normal;
  color: #4facfe;
  font-weight: 600;
}
.book-detail-link {
  color: #2196f3;
  cursor: pointer;
  margin-left: 16px;
  font-size: 14px;
  transition: color 0.2s;
}
.book-detail-link:hover {
  color: #1565c0;
}
.chapterlist-main {
  background: rgba(33,150,243,0.04);
  border-radius: 10px;
  padding: 24px 20px 16px 20px;
  box-shadow: 0 2px 8px rgba(33,150,243,0.04);
}
.chapterlist-wrapper.light-theme .chapterlist-main {
  background: #f7faff;
}
.chapterlist-title {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}
.chapterlist-title h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2196f3;
  margin: 0;
}
.chapter-count {
  color: #888;
  font-size: 1rem;
  margin-left: 8px;
}
.chapterlist-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.chapterlist-list.grid-mode ul {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px 14px;
}
.chapterlist-list.grid-mode li {
  border: 1px solid rgba(33,150,243,0.10);
  border-radius: 8px;
  margin: 0;
  padding: 12px 8px;
  background: rgba(33,150,243,0.03);
  box-shadow: 0 2px 8px rgba(33,150,243,0.04);
  transition: box-shadow 0.2s, background 0.2s;
  min-width: 0;
  min-height: 40px;
  justify-content: flex-start;
}
.chapterlist-list.grid-mode li:hover {
  background: rgba(33,150,243,0.10);
  box-shadow: 0 4px 16px rgba(33,150,243,0.10);
}
.chapterlist-wrapper.light-theme .chapterlist-list.grid-mode li {
  background: #f7faff;
  border: 1px solid #e3f2fd;
}
.chapterlist-wrapper.light-theme .chapterlist-list.grid-mode li:hover {
  background: #e3f2fd;
}
.chapterlist-list.grid-mode .chapter-name {
  font-size: 13px;
  font-weight: 500;
  color: #222;
  margin-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chapterlist-wrapper:not(.light-theme) .chapterlist-list.grid-mode .chapter-name {
  color: #fff;
}
.chapterlist-list.grid-mode .chapter-type {
  font-size: 11px;
  padding: 2px 6px;
  margin-left: 0;
}
.chapter-type {
  font-size: 13px;
  margin-left: 12px;
  border-radius: 3px;
  padding: 2px 8px;
  background: #e3f2fd;
  color: #2196f3;
  font-weight: 500;
}
.chapter-type.vip {
  background: #ffe0b2;
  color: #f57c00;
}
.chapterlist-list li.vip .chapter-type {
  background: #ffe0b2;
  color: #f57c00;
}
.chapter-type.free {
  background: #e3f2fd;
  color: #2196f3;
}
@media (max-width: 900px) {
  .chapterlist-container {
    padding: 16px 4vw 24px 4vw;
  }
  .book-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .book-cover-img {
    margin-bottom: 18px;
    margin-right: 0;
  }
}
</style>
