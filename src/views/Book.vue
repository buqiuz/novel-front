<template>
  <Navbar @themeChange="changeTheme" />
  <div class="page-wrapper" :class="{'light-theme': !isDarkTheme}">
    <div class="content-container">
      <div class="book-details-container" :class="{'light-theme': !isDarkTheme}">
        <div class="book-header">
          <div class="book-cover">
            <img
              :src="`${imgBaseUrl}${book.picUrl}`"
              :alt="book.bookName"
              @error="$event.target.src='default.gif'"
            />
          </div>
          <div class="book-info">
            <div class="book-title">
              <h1>{{ book.bookName }}</h1>
              <span class="author">{{ book.authorName }}</span>
            </div>
            <div class="book-stats">
              <span>类别：<em>{{ book.categoryName }}</em></span>
              <span>状态：<em>{{ book.bookStatus == 0 ? "连载中" : "已完结" }}</em></span>
              <span>总点击：<em>{{ book.visitCount }}</em></span>
              <span>总字数：<em>{{ book.wordCount }}</em></span>
            </div>
            <div class="book-description">
              <p v-html="book.bookDesc"></p>
            </div>
            <div class="action-buttons">
              <button class="read-btn" @click="bookContent(book.id, book.firstChapterId)">
                点击阅读
                <i class="el-icon-right"></i>
              </button>
              <button
                :class="['shelf-btn', { 'in-shelf': isInBookshelf }]"
                @click="toggleBookshelf()"
              >
                {{ isInBookshelf ? '已加入书架' : '加入书架' }}
              </button>
            </div>
          </div>
        </div>

        <div class="content-grid">
          <div class="main-content">
            <div class="latest-chapters">
              <div class="section-header">
                <h2>最新章节</h2>
                <span>({{ chapterAbout.chapterTotal }}章)</span>
                <button class="view-all" @click="chapterList(book.id)">
                  查看全部
                  <i class="el-icon-arrow-right"></i>
                </button>
              </div>

              <div class="chapter-preview">
                <div class="latest-chapter">
                  <a
                    v-if="chapterAbout.chapterInfo"
                    @click="bookContent(chapterAbout.chapterInfo.bookId, chapterAbout.chapterInfo.id)"
                    href="javascript:void(0)"
                  >
                    {{ chapterAbout.chapterInfo.chapterName }}
                  </a>
                  <span v-if="chapterAbout.chapterInfo">
                    更新时间：{{ chapterAbout.chapterInfo.chapterUpdateTime }}
                  </span>
                </div>
                <div class="chapter-summary" v-html="chapterAbout.contentSummary + '...'"></div>
              </div>
            </div>

            <div class="comments-section">
              <div class="section-header">
                <h2>作品评论区</h2>
                <span>({{ newestComments.commentTotal }}条)</span>
                <button class="add-comment" @click="goToAnchor('txtComment')">
                  发表评论
                  <i class="el-icon-edit"></i>
                </button>
              </div>

              <div v-if="newestComments.commentTotal == 0" class="no-comments">
                <img :src="no_comment" alt="暂无评论" />
                <span>暂无评论</span>
              </div>

              <div v-else class="comments-list">
                <div
                  v-for="(item, index) in newestComments.comments"
                  :key="index"
                  class="comment-item"
                >
                  <div class="comment-user">
                    <img
                      :src="item.commentUserPhoto ? imgBaseUrl + item.commentUserPhoto : man"
                      :alt="item.commentUser"
                    />
                  </div>
                  <div class="comment-content">
                    <div class="comment-header">
                      <span class="username">{{ item.commentUser }}</span>
                      <span class="time">{{ item.commentTime }}</span>
                    </div>
                    <div class="comment-text" v-html="item.commentContent"></div>
                    <div v-if="item.commentUserId == uid" class="comment-actions">
                      <a @click="updateUserComment(item.id, item.commentContent)">修改</a>
                      <a @click="deleteUserComment(item.id)">删除</a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="comment-form">
                <h3>发表评论</h3>
                <textarea
                  v-model="commentContent"
                  id="txtComment"
                  rows="4"
                  placeholder="我来说两句..."
                ></textarea>
                <div class="form-footer">
                  <span class="char-count">{{ commentContent.length }}/1000</span>
                  <button @click="userComment" class="submit-btn">
                    发表评论
                    <i class="el-icon-s-promotion"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="sidebar">
            <div class="author-card">
              <div class="author-header">
                <img :src="author_head" alt="作者头像" />
                <div class="author-info">
                  <span class="author-badge">签约作家</span>
                  <h3>{{ book.authorName }}</h3>
                </div>
              </div>
              <div class="author-message">
                <h4>作者有话说</h4>
                <p>亲亲们，你们的支持是我最大的动力！求点击、求推荐、求书评哦！</p>
              </div>
            </div>

            <div class="related-books">
              <h3>同类推荐</h3>
              <div class="books-list">
                <div
                  v-for="(item, index) in books"
                  :key="index"
                  class="book-item"
                  @click="bookDetail(item.id)"
                >
                  <img
                    :src="`${imgBaseUrl}${item.picUrl}`"
                    :alt="item.bookName"
                    @error="$event.target.src='default.gif'"
                  />
                  <div class="book-info">
                    <h4>{{ item.bookName }}</h4>
                    <p v-html="item.bookDesc"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="dialogUpdateCommentFormVisible"
      title="修改评论"
      custom-class="tech-dialog"
    >
      <el-form>
        <el-form-item label="评论内容">
          <el-input type="textarea" v-model="updateComment" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogUpdateCommentFormVisible = false">取消</el-button>
          <el-button type="primary" @click="goUpdateComment()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/styles/book.css";
import man from "@/assets/images/man.png";
import { reactive, toRefs, onMounted, onUpdated, watch } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import {
  getBookById,
  addVisitCount,
  getLastChapterAbout,
  listRecBooks,
  listNewestComments,
} from "@/api/book";
import {addBookshelf, comment, deleteBookshelf, deleteComment, isInBookshelf, updateComment} from "@/api/user";
import { getUid } from "@/utils/auth";
import Navbar from "@/components/common/Navbar";
import author_head from "@/assets/images/author_head.png";
import no_comment from "@/assets/images/no_comment.png";
import { goToAnchor } from "@/utils";
export default {
  name: "book",
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      uid: getUid(),
      book: {},
      books: [],
      chapterAbout: {},
      commentContent: "",
      newestComments: {},
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
      dialogUpdateCommentFormVisible: false,
      commentId: "",
      updateComment: "",
      isInBookshelf: false,
      isDarkTheme: localStorage.getItem('theme') === 'light' ? false : true,
      loading: false,
      error: null,
    });
    // 定义 toggleBookshelf 方法
    const toggleBookshelf = async () => {
      if (state.isInBookshelf) {
        // 如果已经在书架中，则删除它
        await deleteBookshelf({ bookId: state.book.id});
      } else {
        // 否则添加到书架
        await addBookshelf({ bookId: state.book.id,preContentId: state.book.lastChapterId  });
      }
      // 更新 isInBookshelf 状态
      await checkIfInBookshelf(state.book.id);
    };
    // 检查书籍是否在书架中的函数
    const checkIfInBookshelf = async (bookId) => {
      const { data } = await isInBookshelf({ bookId });
      state.isInBookshelf = data;
      console.log("isInBookshelf", state.isInBookshelf);
    };


    const loadBook = async (bookId) => {
      const { data } = await getBookById(bookId);
      state.book = data;
      document
        .getElementById("bookCover")
        .setAttribute("onerror", "this.src='default.gif';this.onerror=null");
      await addBookVisit(bookId);
    };

    // 统一的数据加载函数
    const loadAllData = async (bookId) => {
      state.loading = true;
      const loadingInstance = ElLoading.service({
        fullscreen: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      try {
        // 并行加载所有数据
        const [bookData, recBooksData, chapterData, commentsData, shelfStatus] = await Promise.all([
          getBookById(bookId),
          listRecBooks({ bookId: bookId }),
          getLastChapterAbout({ bookId: bookId }),
          listNewestComments({ bookId: bookId }),
          isInBookshelf({ bookId: bookId })
        ]);

        // 更新状态
        state.book = bookData.data;
        state.books = recBooksData.data;
        state.chapterAbout = chapterData.data;
        state.newestComments = commentsData.data;
        state.isInBookshelf = shelfStatus.data;

        // 访问计数
        await addVisitCount({ bookId: bookId });

      } catch (error) {
        console.error('加载数据失败:', error);
        ElMessage.error('加载数据失败，请稍后重试');
        state.error = error;
      } finally {
        state.loading = false;
        loadingInstance.close();
      }
    };

    // 监听路由参数变化
    watch(
      () => route.params.id,
      async (newId) => {
        if (newId) {
          await loadAllData(newId);
        }
      },
      { immediate: true }
    );

    // 修改章节加载逻辑
    const loadLastChapterAbout = async (bookId) => {
      try {
        const { data } = await getLastChapterAbout({ bookId: bookId });
        state.chapterAbout = data;
      } catch (error) {
        console.error('加载章节信息失败:', error);
        ElMessage.error('加载章节信息失败');
      }
    };

    // 修改相关书籍加载逻辑
    const loadRecBooks = async (bookId) => {
      try {
        const { data } = await listRecBooks({ bookId: bookId });
        state.books = data;
      } catch (error) {
        console.error('加载推荐书籍失败:', error);
        ElMessage.error('加载推荐书籍失败');
      }
    };

    // 修改评论加载逻辑
    const loadNewestComments = async (bookId) => {
      try {
        const { data } = await listNewestComments({ bookId: bookId });
        state.newestComments = data;
      } catch (error) {
        console.error('加载评论失败:', error);
        ElMessage.error('加载评论失败');
      }
    };

    const bookContent = (bookId, chapterId) => {
      router.push({
        path: `/book/${bookId}/${chapterId}`
      }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    };

    const bookDetail = async (bookId) => {
      try {
        await router.push({
          path: `/book/${bookId}`
        });
        await loadBook(bookId);
        await loadRecBooks(bookId);
        await loadLastChapterAbout(bookId);
        await loadNewestComments(bookId);
        await checkIfInBookshelf(bookId);
      } catch (err) {
        if (err.name !== 'NavigationDuplicated') {
          console.error('Navigation error:', err);
        }
      }
    };

    const chapterList = (bookId) => {
      router.push({
        path: `/chapter_list/${bookId}`
      }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    };

    const userComment = async () => {
      if (!state.commentContent) {
        ElMessage.error("用户评论不能为空！");
        return;
      }
      if (state.commentContent.length < 10) {
        ElMessage.error("评论不能少于 10 个字符！");
        return;
      }
      if (state.commentContent.length > 512) {
        ElMessage.error("评论不能多于 512 个字符！");
        return;
      }
      await comment({
        bookId: state.book.id,
        commentContent: state.commentContent,
      });
      state.commentContent = "";
      await loadNewestComments(state.book.id);
    };

    const updateUserComment = async (id, comment) => {
      state.dialogUpdateCommentFormVisible = true;
      state.updateComment = comment;
      state.commentId = id;
    };

    const deleteUserComment = async (id) => {
      await deleteComment(id);
      await loadNewestComments(state.book.id);
    };

    const goUpdateComment = async (id) => {
      state.dialogUpdateCommentFormVisible = false;
      await updateComment(state.commentId, { content: state.updateComment });
      await loadNewestComments(state.book.id);
    };

    const changeTheme = (isDark) => {
      state.isDarkTheme = isDark;
    };

    return {
      ...toRefs(state),
      author_head,
      no_comment,
      bookContent,
      bookDetail,
      chapterList,
      goToAnchor,
      userComment,
      deleteUserComment,
      man,
      updateUserComment,
      goUpdateComment,
      toggleBookshelf,
      changeTheme,
    };
  },
  mounted() {
    $(".icon_show").click(function () {
      $(this).hide();
      $(".icon_hide").show();
      $(".intro_txt").innerHeight("auto");
    });
    $(".icon_hide").click(function () {
      $(this).hide();
      $(".icon_show").show();
      $(".intro_txt").innerHeight("");
    });

    $("#AuthorOtherNovel li").unbind("mouseover");

    $("#txtComment").on("input propertychange", function () {
      var count = $(this).val().length;
      $("#emCommentNum").html(count + "/1000");
      if (count > 1000) {
        $("#txtComment").val($("#txtComment").val().substring(0, 1000));
      }
    });
  },
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #0a0a0a;
  transition: all 0.3s ease;
}

.page-wrapper.light-theme {
  background-color: #f5f5f5;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.book-details-container {
  background: #121212;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  transition: all 0.3s ease;
}

.book-details-container.light-theme {
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* 书籍头部样式 */
.book-header {
  display: flex;
  padding: 30px;
  gap: 30px;
  background: linear-gradient(to right, rgba(33, 150, 243, 0.1), transparent);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.light-theme .book-header {
  background: linear-gradient(to right, rgba(33, 150, 243, 0.05), transparent);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.book-cover {
  flex-shrink: 0;
  width: 200px;
  height: 280px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.book-cover:hover {
  transform: translateY(-5px);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-info {
  flex: 1;
}

.book-title {
  margin-bottom: 20px;
}

.book-title h1 {
  color: #fff;
  font-size: 28px;
  margin: 0 0 10px 0;
}

.light-theme .book-title h1 {
  color: #333;
}

.book-title .author {
  color: #2196f3;
  font-size: 16px;
}

.book-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.book-stats span {
  color: #999;
  font-size: 14px;
}

.light-theme .book-stats span {
  color: #666;
}

.book-stats em {
  color: #2196f3;
  font-style: normal;
  margin-left: 5px;
}

.book-description {
  color: #ccc;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 30px;
}

.light-theme .book-description {
  color: #555;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.read-btn, .shelf-btn {
  padding: 10px 25px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.read-btn {
  background: linear-gradient(45deg, #2196f3, #00bcd4);
  color: white;
}

.read-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.4);
}

.shelf-btn {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.shelf-btn:hover {
  background: rgba(33, 150, 243, 0.2);
}

.shelf-btn.in-shelf {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border-color: rgba(76, 175, 80, 0.3);
}

/* 内容网格布局 */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  padding: 30px;
}

/* 章节部分样式 */
.latest-chapters, .comments-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.light-theme .latest-chapters,
.light-theme .comments-section {
  background: rgba(0, 0, 0, 0.02);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.light-theme .section-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.section-header h2 {
  color: #fff;
  margin: 0;
  font-size: 20px;
}

.light-theme .section-header h2 {
  color: #333;
}

.section-header span {
  color: #666;
  margin-left: 10px;
}

.view-all, .add-comment {
  margin-left: auto;
  background: none;
  border: none;
  color: #2196f3;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.chapter-preview {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 15px;
}

.light-theme .chapter-preview {
  background: rgba(0, 0, 0, 0.03);
}

.latest-chapter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.latest-chapter a {
  color: #2196f3;
  text-decoration: none;
}

.latest-chapter span {
  color: #666;
  font-size: 14px;
}

.chapter-summary {
  color: #999;
  font-size: 14px;
  line-height: 1.6;
}

.light-theme .chapter-summary {
  color: #666;
}

/* 评论区样式 */
.no-comments {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

.no-comments img {
  width: 100px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.light-theme .comment-item {
  background: rgba(0, 0, 0, 0.02);
}

.comment-user img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.username {
  color: #2196f3;
  font-weight: 500;
}

.time {
  color: #666;
  font-size: 12px;
}

.comment-text {
  color: #ccc;
  font-size: 14px;
  line-height: 1.6;
}

.light-theme .comment-text {
  color: #555;
}

.comment-actions {
  margin-top: 10px;
}

.comment-actions a {
  color: #2196f3;
  margin-right: 15px;
  font-size: 13px;
  cursor: pointer;
}

.comment-form {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.light-theme .comment-form {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.comment-form h3 {
  color: #fff;
  margin-bottom: 15px;
  font-size: 18px;
}

.light-theme .comment-form h3 {
  color: #333;
}

textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  padding: 15px;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
}

.light-theme textarea {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.char-count {
  color: #666;
  font-size: 14px;
}

.submit-btn {
  background: linear-gradient(45deg, #2196f3, #00bcd4);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
}

/* 侧边栏样式 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.author-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
}

.light-theme .author-card {
  background: rgba(0, 0, 0, 0.02);
}

.author-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.author-header img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.author-badge {
  display: inline-block;
  background: linear-gradient(45deg, #ff9800, #f44336);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 5px;
}

.author-info h3 {
  color: #fff;
  margin: 0;
}

.light-theme .author-info h3 {
  color: #333;
}

.author-message h4 {
  color: #2196f3;
  margin-bottom: 10px;
}

.author-message p {
  color: #999;
  font-size: 14px;
  line-height: 1.6;
}

.light-theme .author-message p {
  color: #666;
}

.related-books {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
}

.light-theme .related-books {
  background: rgba(0, 0, 0, 0.02);
}

.related-books h3 {
  color: #fff;
  margin-bottom: 20px;
}

.light-theme .related-books h3 {
  color: #333;
}

.books-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.book-item {
  display: flex;
  gap: 15px;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.book-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

.light-theme .book-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.book-item img {
  width: 60px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.book-item .book-info {
  flex: 1;
}

.book-item h4 {
  color: #fff;
  margin: 0 0 5px 0;
  font-size: 14px;
}

.light-theme .book-item h4 {
  color: #333;
}

.book-item p {
  color: #999;
  font-size: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.light-theme .book-item p {
  color: #666;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .book-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .book-stats {
    justify-content: center;
  }

  .action-buttons {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .content-container {
    padding: 10px;
  }

  .book-cover {
    width: 160px;
    height: 224px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .view-all, .add-comment {
    margin-left: 0;
  }
}
</style>
