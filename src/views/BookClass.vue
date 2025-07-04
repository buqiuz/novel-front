<template>
  <Navbar @eventSerch="searchByK" @themeChange="changeTheme" />
  <div class="bookclass-wrapper" :class="{'light-theme': !isDarkTheme}">
    <div class="main-container">
      <div class="section-header">
        <div class="tech-line"></div>
        <h2>作品筛选</h2>
        <div class="tech-line"></div>
      </div>
      <div class="filter-panel">
        <div class="filter-group">
          <span class="filter-label">作品频道：</span>
          <a href="javascript:void(0)" :class="{'on': workDirectionOn == 0}" @click="loadCategoryList(0)">男频</a>
          <a href="javascript:void(0)" :class="{'on': workDirectionOn == 1}" @click="loadCategoryList(1)">女频</a>
        </div>
        <div class="filter-group">
          <span class="filter-label">作品分类：</span>
          <a href="javascript:void(0)" :class="{'on': categoryOn == 0}" @click="changeCategory(0)">不限</a>
          <a v-for="(item, index) in bookCategorys" :key="index" href="javascript:void(0)" :class="{'on': categoryOn == item.id}" @click="changeCategory(item.id)">{{ item.name }}</a>
        </div>
        <div class="filter-group">
          <span class="filter-label">是否完结：</span>
          <a href="javascript:void(0)" :class="{'on': bookStatusOn == null}" @click="changeBookStatus(null)">不限</a>
          <a href="javascript:void(0)" :class="{'on': bookStatusOn == 0}" @click="changeBookStatus(0)">连载中</a>
          <a href="javascript:void(0)" :class="{'on': bookStatusOn == 1}" @click="changeBookStatus(1)">已完结</a>
        </div>
        <div class="filter-group">
          <span class="filter-label">作品字数：</span>
          <a href="javascript:void(0)" :class="{'on': wordCountOn == null}" @click="changeWordCount(null, null)">不限</a>
          <a href="javascript:void(0)" :class="{'on': wordCountOn == 0}" @click="changeWordCount(0, 300000)">30万字以下</a>
          <a href="javascript:void(0)" :class="{'on': wordCountOn == 300000}" @click="changeWordCount(300000, 500000)">30-50万字</a>
          <a href="javascript:void(0)" :class="{'on': wordCountOn == 500000}" @click="changeWordCount(500000, 1000000)">50-100万字</a>
          <a href="javascript:void(0)" :class="{'on': wordCountOn == 1000000}" @click="changeWordCount(1000000, null)">100万字以上</a>
        </div>
        <div class="filter-group">
          <span class="filter-label">更新时间：</span>
          <a href="javascript:void(0)" :class="{'on': updateTimeOn == null}" @click="changeUpdateTime(null)">不限</a>
          <a href="javascript:void(0)" :class="{'on': updateTimeOn == 3}" @click="changeUpdateTime(3)">三日内</a>
          <a href="javascript:void(0)" :class="{'on': updateTimeOn == 7}" @click="changeUpdateTime(7)">七日内</a>
          <a href="javascript:void(0)" :class="{'on': updateTimeOn == 15}" @click="changeUpdateTime(15)">半月内</a>
          <a href="javascript:void(0)" :class="{'on': updateTimeOn == 30}" @click="changeUpdateTime(30)">一月内</a>
        </div>
        <div class="filter-group">
          <span class="filter-label">排序方式：</span>
          <a href="javascript:void(0)" :class="{'on': sortOn == null}" @click="changeSort(null)">不限</a>
          <a href="javascript:void(0)" :class="{'on': sortOn == 'last_chapter_update_time desc'}" @click="changeSort('last_chapter_update_time desc')">更新时间</a>
          <a href="javascript:void(0)" :class="{'on': sortOn == 'word_count desc'}" @click="changeSort('word_count desc')">总字数</a>
          <a href="javascript:void(0)" :class="{'on': sortOn == 'visit_count desc'}" @click="changeSort('visit_count desc')">点击量</a>
        </div>
      </div>
      <div class="section-header booklist-header">
        <div class="tech-line"></div>
        <h2>作品列表</h2>
        <div class="tech-line"></div>
      </div>
      <div class="booklist-table-wrapper">
        <table class="booklist-table">
          <thead>
            <tr>
              <th>序号</th>
              <th>类别</th>
              <th>书名</th>
              <th>最新章节</th>
              <th>作者</th>
              <th>字数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in books" :key="index" @click="bookDetail(item.id)" class="book-row">
              <td><span class="rank-num">{{ index + 1 }}</span></td>
              <td><span class="category-tag">{{ item.categoryName }}</span></td>
              <td><span class="book-title" v-html="item.bookName"></span></td>
              <td><span class="chapter-title">{{ item.lastChapterName }}</span></td>
              <td><span class="author-name">{{ item.authorName }}</span></td>
              <td><span class="word-count">{{ wordCountFormat(item.wordCount) }}</span></td>
            </tr>
          </tbody>
        </table>
        <el-pagination
          small
          layout="prev, pager, next"
          :background="backgroud"
          :page-size="pageSize"
          :total="total"
          class="mt-4 modern-pagination"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/styles/book.css";
import { reactive, toRefs, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { searchBooks, listCategorys } from "@/api/book";
import { addDay, dateFormat } from "@/utils";
import Navbar from "@/components/common/Navbar";
export default {
  name: "bookclass",
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      bookCategorys: [],
      books: [],
      searchCondition: {},
      backgroud: true,
      total: 0,
      pageSize: 10,
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
      workDirectionOn: 0,
      categoryOn: 0,
      bookStatusOn: null,
      wordCountOn: null,
      updateTimeOn: null,
      sortOn:null
    });
    onMounted(() => {
      const key = route.query.key;
      state.searchCondition.keyword = key;
      state.searchCondition.pageSize = 20;
      loadCategoryList(0);
    });

    const search = async () => {
      const { data } = await searchBooks(state.searchCondition);
      state.books = data.list;
      state.searchCondition.pageNum = data.pageNum;
      state.searchCondition.pageSize = data.pageSize;
      state.total = Number(data.total);
    };

    const searchByK = (key) => {
      state.searchCondition = { keyword: key };
      search();
    };
    const bookDetail = (bookId) => {
      router.push({ path: `/book/${bookId}` });
    };

    const handleCurrentChange = (pageNum) => {
      state.searchCondition.pageNum = pageNum;
      search();
    };

    const loadCategoryList = async (workDirection) => {
      const { data } = await listCategorys({ workDirection: workDirection });
      state.bookCategorys = data;
      state.workDirectionOn = workDirection;
      state.searchCondition.workDirection = workDirection;
      state.categoryOn = 0;
      state.searchCondition.categoryId = null;
      search();
    };

    const changeCategory = async (categoryId) => {
      state.categoryOn = categoryId;
      if (categoryId > 0) {
        state.searchCondition.categoryId = categoryId;
      } else {
        state.searchCondition.categoryId = null;
      }
      search();
    };

    const changeBookStatus = async (bookStatus) => {
      state.bookStatusOn = bookStatus;
      state.searchCondition.bookStatus = bookStatus;
      search();
    };

    const changeWordCount = async (wordCountMin, wordCountMax) => {
      state.wordCountOn = wordCountMin;
      state.searchCondition.wordCountMin = wordCountMin;
      state.searchCondition.wordCountMax = wordCountMax;

      search();
    };

    const changeUpdateTime = async (days) => {
      state.updateTimeOn = days;
      if (days) {
        state.searchCondition.updateTimeMin = dateFormat(
          "YYYY-mm-dd",
          addDay(-days)
        );
      } else {
        state.searchCondition.updateTimeMin = null;
      }
      search();
    };

    const changeSort = async (sort) => {
      state.sortOn = sort;
      state.searchCondition.sort = sort;
      search();
    };

    const isDarkTheme = ref(localStorage.getItem('theme') === 'light' ? false : true);
    const changeTheme = (isDark) => {
      isDarkTheme.value = isDark;
    };

    return {
      ...toRefs(state),
      bookDetail,
      searchByK,
      search,
      handleCurrentChange,
      loadCategoryList,
      changeCategory,
      changeBookStatus,
      changeWordCount,
      changeUpdateTime,
      changeSort,
      isDarkTheme,
      changeTheme,
    };
  },
  computed: {
    wordCountFormat(wordCount) {
      return (wordCount) => {
        if (wordCount.length >= 5) {
          return parseInt(wordCount / 10000) + "万";
        }
        if (wordCount.length >= 4) {
          return parseInt(wordCount / 1000) + "千";
        }
        return wordCount;
      };
    },
  },
};
</script>

<style scoped>
.bookclass-wrapper {
  min-height: 100vh;
  background: #0a0a0a;
  transition: all 0.3s;
}
.bookclass-wrapper.light-theme {
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
.bookclass-wrapper.light-theme .section-header h2 {
  color: #222;
}
.filter-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 30px;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  padding: 18px 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(33,150,243,0.05);
}
.bookclass-wrapper.light-theme .filter-panel {
  background: rgba(0,0,0,0.03);
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-label {
  color: #2196f3;
  font-weight: 500;
  margin-right: 5px;
}
.filter-group a {
  color: #b0bec5;
  text-decoration: none;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 400;
}
.bookclass-wrapper.light-theme .filter-group a {
  color: #444;
}
.filter-group a.on, .filter-group a:hover {
  background: transparent;
  color: #2196f3;
  border: none;
  font-weight: 700;
}
.bookclass-wrapper.light-theme .filter-group a.on, .bookclass-wrapper.light-theme .filter-group a:hover {
  color: #2196f3;
}
.booklist-header {
  margin-top: 40px;
}
.booklist-table-wrapper {
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(33,150,243,0.05);
  padding: 20px;
  margin-bottom: 40px;
}
.bookclass-wrapper.light-theme .booklist-table-wrapper {
  background: rgba(0,0,0,0.03);
}

/* 分页器样式美化，主色调蓝色 */
::v-deep .el-pagination.is-background .el-pager li {
  background: transparent;
  color: #2196f3;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s;
}
::v-deep .el-pagination.is-background .el-pager li.active {
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
  font-weight: 700;
}
::v-deep .el-pagination.is-background .el-pager li:hover {
  color: #2196f3;
  background: rgba(33,150,243,0.08);
}
::v-deep .el-pagination.is-background .el-pager li.disabled {
  color: #b0bec5;
  background: transparent;
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
.bookclass-wrapper.light-theme .booklist-table th {
  color: #1a237e;
  background: rgba(33,150,243,0.03);
}
.bookclass-wrapper.light-theme .booklist-table td {
  color: #222;
}
.book-row {
  cursor: pointer;
  transition: background 0.2s;
}
.book-row:hover {
  background: rgba(33,150,243,0.08);
}
.bookclass-wrapper.light-theme .book-row:hover {
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
.bookclass-wrapper.light-theme .book-title {
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
.modern-pagination {
  display: flex;
  justify-content: center;
}
</style>
