<!-- <template>-->
<!--  <div class="mainNav" id="mainNav">-->
<!--    <div class="box_center cf">-->
<!--      <ul class="nav" id="navModule">-->
<!--        <li><router-link :to="{ name: 'home' }" replace>首页</router-link></li>-->
<!--        <li>-->
<!--          <router-link :to="{ name: 'bookclass' }" replace> 全部作品 </router-link>-->
<!--        </li>-->
<!--        <li><router-link :to="{ name: 'bookRank' }" replace>排行榜</router-link></li>-->
<!--        <li><router-link :to="{ name: 'payment' }" replace>充值</router-link></li>-->
<!--&lt;!&ndash;        <li class=""><a href="/pay/index.html">充值</a></li>&ndash;&gt;-->
<!--        <li><a @click="goAuthor" href="javascript:void(0)">作家专区</a></li>-->
<!--      </ul>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { reactive, toRefs, onMounted } from "vue";-->
<!--import { useRouter, useRoute } from "vue-router";-->
<!--import { getToken} from "@/utils/auth";-->
<!--import {getAuthorStatus} from "@/api/author"-->
<!--export default {-->
<!--  name: "Navbar",-->
<!--  setup() {-->
<!--    const route = useRoute();-->
<!--    const router = useRouter();-->
<!--    const goAuthor = async () => {-->
<!--      if (!getToken()) {-->
<!--        router.replace({-->
<!--          name: "login",-->
<!--        });-->
<!--        return;-->
<!--      }-->

<!--      const {data} = await getAuthorStatus();-->
<!--      if(data === null){-->
<!--          router.replace({-->
<!--          name: "authorRegister",-->
<!--        });-->
<!--        return;-->
<!--      }-->

<!--      let routeUrl = router.resolve({-->
<!--        name: "authorBookList",-->
<!--      });-->
<!--      window.open(routeUrl.href, "_blank");-->
<!--    };-->
<!--    return {-->
<!--      goAuthor,-->
<!--    };-->
<!--  },-->
<!--};-->
<!--</script>-->

<template>
  <header class="tech-navbar">
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
                <router-link :to="{ name: 'userRecord' }" class="dropdown-item">我的书架</router-link>
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
import { reactive, toRefs, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getToken, getNickName, getGoldCoin, setGoldCoin, removeToken, removeNickName, removeUid } from "@/utils/auth";
import { getGoldBalance } from "@/api/payment";
import { getUserinfo } from "@/api/user";
import { getAuthorStatus } from "@/api/author";

export default {
  name: "ModernNavbar",
  setup(props, context) {
    const state = reactive({
      keyword: "",
      nickName: getNickName(),
      token: getToken(),
      goldCoin: getGoldCoin(),
      userId: null,
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

      let routeUrl = router.resolve({
        name: "authorBookList",
      });
      window.open(routeUrl.href, "_blank");
    };

    onMounted(async () => {
      if(state.token){
        const userInfo = await getUserinfo();
        if (userInfo) {
          state.userId = userInfo.data.id;
        }
        await fetchGoldCoin(); // 页面加载时获取金币
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
    };
  },
};
</script>

<style scoped>
.tech-navbar {
  background: linear-gradient(90deg, #0a0d23 0%, #1a237e 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  height: 60px;
  padding: 0;
  border-bottom: 1px solid rgba(100, 158, 255, 0.3);
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

.nav-item a:hover {
  color: #ffffff;
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

.search-box:focus-within {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 15px rgba(79, 172, 254, 0.3);
  border: 1px solid rgba(79, 172, 254, 0.5);
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

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
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

.search-btn:hover {
  color: white;
  background-color: rgba(79, 172, 254, 0.2);
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

.btn-login:hover {
  color: white;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
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

.user-trigger:hover {
  background: rgba(255, 255, 255, 0.15);
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

.dropdown-icon {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 150px;
  background: #1a237e;
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

.dropdown-item:hover {
  background: rgba(79, 172, 254, 0.2);
  color: white;
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
