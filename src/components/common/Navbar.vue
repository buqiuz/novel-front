

<template>
  <header class="tech-navbar" :class="{ 'light-theme': !isDarkTheme }">
    <div class="container">
      <div class="navbar-content">
        <!-- Logo区域 -->
        <div class="logo-area">
          <router-link :to="{ name: 'home' }" class="logo">
            <span class="logo-text">阅界</span>
          </router-link>
        </div>

        <!-- 导航菜单 -->
        <nav class="main-nav">
          <ul class="nav-list">
            <li class="nav-item"><router-link :to="{ name: 'home' }">首页</router-link></li>
            <li class="nav-item"><router-link :to="{ name: 'bookclass' }">全部作品</router-link></li>
            <li class="nav-item"><router-link :to="{ name: 'bookRank' }">排行榜</router-link></li>
            <li class="nav-item"><router-link :to="{ name: 'payment' }">充值中心</router-link></li>
            <li class="nav-item"><a @click="goAuthor" href="javascript:void(0)">作家专区</a></li>
          </ul>
        </nav>

        <!-- 搜索区域 -->
        <div class="search-area">
          <div class="search-box">
            <input
                v-model="keyword"
                type="text"
                placeholder="书名、作者、关键字"
                class="search-input"
                v-on:keyup.enter="searchByK"
            />
            <button class="search-btn" @click="searchByK">
              <i class="search-icon">🔍</i>
            </button>
          </div>
        </div>

        <!-- 主题切换按钮 -->
        <div class="theme-toggle">
          <button @click="toggleTheme" class="theme-btn">
            <span v-if="isDarkTheme">☀️</span>
            <span v-else>🌙</span>
          </button>
        </div>

        <!-- 用户信息区域 -->
        <div class="user-area">
          <!-- 未登录状态 -->
          <div v-if="!token" class="auth-buttons">
            <router-link :to="{ name: 'login' }" class="btn btn-login">登录</router-link>
            <router-link :to="{ name: 'register' }" class="btn btn-register">注册</router-link>
          </div>

          <!-- 已登录状态 -->
          <div v-else class="user-info">
            <div class="user-dropdown-wrapper">
              <div class="user-trigger">
                <span class="username">{{ nickName }}</span>
                <span class="dropdown-icon">▼</span>
              </div>
              <div class="dropdown-menu">
                <router-link :to="{ name: 'userSetup' }" class="dropdown-item">个人设置</router-link>
                <router-link :to="{ name: 'userBookshelf' }" class="dropdown-item">我的书架</router-link>
                <router-link :to="{ name: 'userComment' }" class="dropdown-item">我的评论</router-link>
                <a @click="logout" href="javascript:void(0)" class="dropdown-item">退出登录</a>
              </div>
            </div>

            <div class="coin-display">
              <span class="coin-value">{{ goldCoin }}</span>
              <router-link :to="{ name: 'payment' }" class="recharge-link">充值</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { reactive, toRefs, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getToken, getNickName, getGoldCoin, setGoldCoin, removeToken, removeNickName, removeUid } from "@/utils/auth";
import { getGoldBalance } from "@/api/payment";
import { getUserinfo } from "@/api/user";
import { getAuthorStatus } from "@/api/author";

export default {
  name: "ModernNavbar",
  emits: ['themeChange'],
  setup(props, context) {
    const state = reactive({
      keyword: "",
      nickName: getNickName(),
      token: getToken(),
      goldCoin: getGoldCoin(),
      userId: null,
      isDarkTheme: localStorage.getItem('theme') === 'light' ? false : true,
    });

    const route = useRoute();
    const router = useRouter();
    state.keyword = route.query.key;

    // 获取金币余额
    const fetchGoldCoin = async () => {
      if (state.token && state.userId) {
        try {
          const res = await getGoldBalance(state.userId);
          const serverGoldCoin = res.data;
          if(serverGoldCoin !== state.goldCoin){
            state.goldCoin = serverGoldCoin;
            setGoldCoin(serverGoldCoin);
          }
        } catch (error) {
          console.error("获取金币失败", error);
          state.goldCoin = 0;
        }
      }
    };

    // 主题切换
    const toggleTheme = () => {
      state.isDarkTheme = !state.isDarkTheme;
      localStorage.setItem('theme', state.isDarkTheme ? 'dark' : 'light');
      document.body.setAttribute('data-theme', state.isDarkTheme ? 'dark' : 'light');
      context.emit('themeChange', state.isDarkTheme);
    };

    // 作家专区跳转
    const goAuthor = async () => {
      if (!getToken()) {
        router.replace({
          name: "login",
        });
        return;
      }

      const {data} = await getAuthorStatus();
      if(data === null){
        router.replace({
          name: "authorRegister",
        });
        return;
      }

      // 直接在当前窗口导航，不再使用新窗口
      router.push({
        name: "authorBookList"
      });
    };

    onMounted(() => {
      // 页面加载时设置主题
      document.body.setAttribute('data-theme', state.isDarkTheme ? 'dark' : 'light');
      context.emit('themeChange', state.isDarkTheme);

      if(state.token){
        getUserinfo().then(userInfo => {
          if (userInfo) {
            state.userId = userInfo.data.id;
            fetchGoldCoin();
          }
        });
      }
    });

    const searchByK = () => {
      router.replace({ path: "/bookclass", query: { key: state.keyword } });
      context.emit("eventSerch", state.keyword);
    };

    const logout = () => {
      removeToken();
      removeNickName();
      removeUid();
      state.nickName = "";
      state.token = "";
    };

    return {
      ...toRefs(state),
      searchByK,
      logout,
      goAuthor,
      toggleTheme,
    };
  },
};
</script>

<style scoped>
.tech-navbar {
  background: #000000;
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  height: 60px;
  padding: 0;
  border-bottom: 1px solid rgba(100, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.tech-navbar.light-theme {
  background: linear-gradient(90deg, #ffffff 0%, #f5f5f5 100%);
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

/* Logo 区域 */
.logo-area {
  padding-right: 15px;
}

.logo {
  text-decoration: none;
  display: block;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  color: transparent;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  background-clip: text;
  -webkit-background-clip: text;
  letter-spacing: 2px;
  position: relative;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 10px rgba(79, 172, 254, 0.5);
  animation: pulse 2s infinite alternate;
}

.logo-text::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00f2fe, transparent);
  animation: scan 2s infinite;
}

/* 导航菜单 */
.main-nav {
  flex: 1;
  margin: 0 20px;
}

.nav-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
}

.nav-item {
  height: 100%;
}

.nav-item a {
  color: #b0bec5;
  text-decoration: none;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 15px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  position: relative;
  letter-spacing: 0.5px;
}

.light-theme .nav-item a {
  color: #555;
}

.nav-item a:hover {
  color: #ffffff;
}

.light-theme .nav-item a:hover {
  color: #000;
}

.nav-item a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-item a:hover::after,
.nav-item a.router-link-active::after {
  width: 70%;
}

.nav-item a.router-link-active {
  color: white;
}

.light-theme .nav-item a.router-link-active {
  color: #1a237e;
}

/* 搜索区域 */
.search-area {
  margin-right: 20px;
  width: 280px;
}

.search-box {
  display: flex;
  height: 36px;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.light-theme .search-box {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.search-box:focus-within {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 15px rgba(79, 172, 254, 0.3);
  border: 1px solid rgba(79, 172, 254, 0.5);
}

.light-theme .search-box:focus-within {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 15px rgba(79, 172, 254, 0.2);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  padding: 0 15px;
  font-size: 14px;
  outline: none;
}

.light-theme .search-input {
  color: #333;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.light-theme .search-input::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.search-btn {
  width: 36px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.light-theme .search-btn {
  color: rgba(0, 0, 0, 0.5);
}

.search-btn:hover {
  color: white;
  background-color: rgba(79, 172, 254, 0.2);
}

.light-theme .search-btn:hover {
  color: #000;
  background-color: rgba(79, 172, 254, 0.1);
}

/* 主题切换按钮 */
.theme-toggle {
  margin-right: 15px;
}

.theme-btn {
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  outline: none;
}

.light-theme .theme-btn {
  color: #333;
  background-color: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.theme-btn:hover {
  transform: rotate(30deg);
  background-color: rgba(255, 255, 255, 0.2);
}

.light-theme .theme-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* 用户区域 */
.user-area {
  display: flex;
  align-items: center;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 15px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-login {
  background: transparent;
  color: #b0bec5;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.light-theme .btn-login {
  color: #666;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.btn-login:hover {
  color: white;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
}

.light-theme .btn-login:hover {
  color: #333;
  border-color: rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.05);
}

.btn-register {
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  box-shadow: 0 2px 6px rgba(79, 172, 254, 0.4);
}

.btn-register:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(79, 172, 254, 0.5);
}

.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown-wrapper {
  position: relative;
  margin-right: 15px;
}

.user-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.1);
}

.light-theme .user-trigger {
  background: rgba(0, 0, 0, 0.05);
}

.user-trigger:hover {
  background: rgba(255, 255, 255, 0.15);
}

.light-theme .user-trigger:hover {
  background: rgba(0, 0, 0, 0.1);
}

.username {
  color: white;
  font-weight: 500;
  margin-right: 5px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.light-theme .username {
  color: #333;
}

.dropdown-icon {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
}

.light-theme .dropdown-icon {
  color: rgba(0, 0, 0, 0.5);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 150px;
  background: #000000;
  border-radius: 4px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  margin-top: 5px;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s;
  z-index: 10;
  border: 1px solid rgba(100, 158, 255, 0.2);
}

.light-theme .dropdown-menu {
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.user-dropdown-wrapper:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 10px 15px;
  color: #b0bec5;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 14px;
}

.light-theme .dropdown-item {
  color: #666;
}

.dropdown-item:hover {
  background: rgba(79, 172, 254, 0.2);
  color: white;
}

.light-theme .dropdown-item:hover {
  background: rgba(79, 172, 254, 0.1);
  color: #333;
}

.coin-display {
  display: flex;
  align-items: center;
  background: rgba(255, 215, 0, 0.15);
  padding: 5px 10px;
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  position: relative;
}

.light-theme .coin-display {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.coin-display::before {
  content: '💰';
  margin-right: 5px;
  font-size: 14px;
}

.coin-value {
  color: #ffd700;
  font-weight: 600;
  margin-right: 5px;
}

.recharge-link {
  font-size: 12px;
  color: #4facfe;
  text-decoration: none;
  padding: 2px 6px;
  border-radius: 3px;
  transition: all 0.2s;
  background: rgba(79, 172, 254, 0.1);
}

.recharge-link:hover {
  background: rgba(79, 172, 254, 0.2);
  color: #00f2fe;
}

/* 动画效果 */
@keyframes pulse {
  0% {
    text-shadow: 0 0 5px rgba(79, 172, 254, 0.5);
  }
  100% {
    text-shadow: 0 0 15px rgba(79, 172, 254, 0.8);
  }
}

@keyframes scan {
  0% {
    left: 0;
    width: 0;
  }
  50% {
    left: 0;
    width: 100%;
  }
  100% {
    left: 100%;
    width: 0;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .search-area {
    width: 200px;
  }

  .nav-item a {
    padding: 0 10px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .tech-navbar {
    height: auto;
  }

  .navbar-content {
    flex-wrap: wrap;
    padding: 10px 0;
  }

  .logo-area, .search-area, .user-area {
    margin: 5px 0;
  }

  .main-nav {
    order: 3;
    width: 100%;
    margin: 10px 0 0;
  }

  .nav-list {
    justify-content: space-between;
  }
}
</style>
