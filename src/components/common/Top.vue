<template>
  <div class="topMain">
    <div class="box_center cf">
      <router-link :to="{ name: 'home' }" class="logo fl">
        <img :src="logo" alt="阅界" />
      </router-link>
      <div class="searchBar fl">
        <div class="search cf">
          <input
              v-model="keyword"
              type="text"
              placeholder="书名、作者、关键字"
              class="s_int"
              v-on:keyup.enter="searchByK"
          />
          <label class="search_btn" id="btnSearch" @click="searchByK()">
            <i class="icon"></i>
          </label>
        </div>
      </div>

      <div class="bookShelf fr" id="headerUserInfo">

        <!-- 登录和注册链接 -->
        <span v-if="!token" class="user_link">
          <router-link :to="{ name: 'login' }" class="mr15">登录</router-link>
          <router-link :to="{ name: 'register' }" class="mr15">注册</router-link>
        </span>

        <!-- 用户信息显示 -->
        <span v-if="token" class="user_link">
          <router-link :to="{ name: 'userSetup' }" class="mr15">{{ nickName }}</router-link>
          <a @click="logout" href="javascript:void(0)">退出</a>
        </span>

        <!-- 金币余额 -->
        <span v-if="token" class="gold_coin">
          <a href="javascript:void(0)" class="mr15">书币余额：{{ goldCoin }}</a>
        </span>

      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/images/logo.png";
import { reactive, toRefs, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getToken, getNickName,getGoldCoin, setGoldCoin, removeToken, removeNickName,removeUid } from "@/utils/auth";
import { getGoldBalance } from "@/api/payment"; // 引入新的接口
import { getUserinfo } from "@/api/user";
export default {
  name: "Top",
  setup(props, context) {
    const state = reactive({
      keyword: "",
      nickName: getNickName(),
      token: getToken(),
      goldCoin: getGoldCoin(),//金币
      userId: null,
    });
    state.nickName = getNickName();
    state.token = getToken();
    const route = useRoute();
    const router = useRouter();
    state.keyword = route.query.key;
    // 获取金币余额
    const fetchGoldCoin = async () => {
      if (state.token && state.userId) {
        try {
          const res = await getGoldBalance(state.userId); // 调用接口
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
    onMounted(async () => {
      const userInfo = await getUserinfo();
      if (userInfo) {
        state.userId = userInfo.data.id;
      }
      await fetchGoldCoin(); // 页面加载时获取金币
    });
    const searchByK = () => {
      router.push({ path: "/bookclass", query: { key: state.keyword } });
      context.emit("eventSerch", state.keyword);
    };
    const logout = () => {
      removeToken();
      removeNickName();
      removeUid()
      state.nickName = "";
      state.token = "";
    };
    return {
      ...toRefs(state),
      logo,
      searchByK,
      logout,
    };
  },
};
</script>