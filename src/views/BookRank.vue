<template>
  <Navbar @themeChange="changeTheme" />
  <div class="bookrank-wrapper" :class="{'light-theme': !isDarkTheme}">
    <div class="main-container">
      <div class="section-header">
        <div class="tech-line"></div>
        <h2>{{ rankName }}</h2>
        <div class="tech-line"></div>
      </div>
      <div class="rank-type-panel">
        <a href="javascript:void(0)" :class="{'on': rankType == 1}" @click="visitRank">点击榜</a>
        <a href="javascript:void(0)" :class="{'on': rankType == 2}" @click="newestRank">新书榜</a>
        <a href="javascript:void(0)" :class="{'on': rankType == 3}" @click="updateRank">更新榜</a>
      </div>
      <div class="booklist-table-wrapper">
        <table class="booklist-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>类别</th>
              <th>书名</th>
              <th>最新章节</th>
              <th>作者</th>
              <th>字数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in books" :key="index" @click="bookDetail(item.id)" class="book-row">
              <td><span class="rank-num" :class="{'top-rank': index < 3}">{{ index + 1 }}</span></td>
              <td><span class="category-tag">{{ item.categoryName }}</span></td>
              <td><span class="book-title">{{ item.bookName }}</span></td>
              <td><span class="chapter-title">{{ item.lastChapterName }}</span></td>
              <td><span class="author-name">{{ item.authorName }}</span></td>
              <td><span class="word-count">{{ wordCountFormat(item.wordCount) }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  listVisitRankBooks,
  listUpdateRankBooks,
  listNewestRankBooks,
} from "@/api/book";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
export default {
  name: "bookRank",
  components: { Navbar, Footer },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      books: [],
      rankName: "点击榜",
      rankType: 1,
    });
    const isDarkTheme = ref(localStorage.getItem('theme') === 'light' ? false : true);
    onMounted(() => {
      visitRank();
    });
    const visitRank = async () => {
      const { data } = await listVisitRankBooks();
      state.books = data;
      state.rankName = "点击榜";
      state.rankType = 1;
    };
    const newestRank = async () => {
      const { data } = await listNewestRankBooks();
      state.books = data;
      state.rankName = "新书榜";
      state.rankType = 2;
    };
    const updateRank = async () => {
      const { data } = await listUpdateRankBooks();
      state.books = data;
      state.rankName = "更新榜";
      state.rankType = 3;
    };
    const bookDetail = (bookId) => {
      router.push({ path: `/book/${bookId}` });
    };
    const changeTheme = (isDark) => {
      isDarkTheme.value = isDark;
    };
    return {
      ...toRefs(state),
      bookDetail,
      newestRank,
      visitRank,
      updateRank,
      isDarkTheme,
      changeTheme,
    };
  },
  computed: {
    wordCountFormat() {
      return (wordCount) => {
        if (!wordCount) return 0;
        if (String(wordCount).length >= 5) {
          return parseInt(wordCount / 10000) + "万";
        }
        if (String(wordCount).length >= 4) {
          return parseInt(wordCount / 1000) + "千";
        }
        return wordCount;
      };
    },
  },
};
</script>

<style scoped>
.bookrank-wrapper {
  min-height: 100vh;
  background: #0a0a0a;
  transition: all 0.3s;
}
.bookrank-wrapper.light-theme {
  background: #f5f5f5;
}
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px 0 20px;
}
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
  font-size: 22px;
  margin: 0 15px;
  text-align: center;
  color: #fff;
  font-weight: 500;
}
.bookrank-wrapper.light-theme .section-header h2 {
  color: #222;
}
.rank-type-panel {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  justify-content: center;
}
.rank-type-panel a {
  color: #b0bec5;
  text-decoration: none;
  padding: 6px 22px;
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.2s;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 400;
}
.rank-type-panel a.on, .rank-type-panel a:hover {
  background: transparent;
  color: #2196f3;
  border: none;
  font-weight: 700;
}
.booklist-table-wrapper {
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(33,150,243,0.05);
  padding: 20px;
  margin-bottom: 40px;
}
.bookrank-wrapper.light-theme .booklist-table-wrapper {
  background: rgba(0,0,0,0.03);
}
.booklist-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.booklist-table th, .booklist-table td {
  padding: 12px 8px;
  text-align: left;
  color: #b0bec5;
  font-size: 15px;
}
.booklist-table th {
  color: #2196f3;
  font-weight: 600;
  background: rgba(33,150,243,0.05);
}
.bookrank-wrapper.light-theme .booklist-table th {
  color: #1a237e;
  background: rgba(33,150,243,0.03);
}
.bookrank-wrapper.light-theme .booklist-table td {
  color: #222;
}
.book-row {
  cursor: pointer;
  transition: background 0.2s;
}
.book-row:hover {
  background: rgba(33,150,243,0.08);
}
.bookrank-wrapper.light-theme .book-row:hover {
  background: rgba(33,150,243,0.12);
}
.rank-num {
  display: inline-block;
  width: 28px;
  height: 28px;
  background: #2196f3;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 28px;
  font-weight: bold;
  font-size: 15px;
}
.rank-num.top-rank {
  background: linear-gradient(135deg, #ff9800, #f44336);
}
.category-tag {
  background: rgba(33,150,243,0.12);
  color: #2196f3;
  border-radius: 3px;
  padding: 2px 8px;
  font-size: 13px;
}
.book-title {
  font-weight: 600;
  color: #fff;
}
.bookrank-wrapper.light-theme .book-title {
  color: #1a237e;
}
.chapter-title {
  color: #2196f3;
}
.author-name {
  color: #888;
}
.word-count {
  color: #2196f3;
  font-weight: 500;
}
</style>
