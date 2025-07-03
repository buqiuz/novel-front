<template>
  <Navbar @themeChange="changeTheme" />
  <div class="payment-wrapper" :class="{'light-theme': !isDarkTheme}">
    <div class="navbar-gap"></div>
    <div class="main-container">
      <div class="section-header">
        <div class="tech-line"></div>
        <h2>充值中心</h2>
        <div class="tech-line"></div>
      </div>
      <div class="recharge-section">
        <div class="amount-select">
          <div class="amount-label">选择充值金额</div>
          <div class="fixed-amounts">
            <button
              v-for="amount in fixedAmounts"
              :key="amount"
              type="button"
              :class="['amount-btn', { active: selectedAmount === amount }]"
              @click="selectAmount(amount)"
            >
              {{ amount }}
            </button>
          </div>
        </div>
        <div class="custom-amount">
          <label>自定义金额：</label>
          <input
            type="number"
            v-model.number="customAmount"
            placeholder="请输入金额（单位：￥）"
            min="0.01"
            step="0.01"
          />
        </div>
        <button type="button" class="submit-btn" @click="submitRecharge">立即支付</button>
        <div class="recharge-desc">
          <span class="highlight">充值说明：</span>“阅界小说网”的收费书籍阅读服务需要使用本站专用虚拟货币——<span class="highlight">书币</span>，以下是具体币值说明与兑换方式，书友们可以通过向本站的帐户充值，来享受本站所提供的一切收费书籍。充值兑换比例：<span class="highlight">人民币1元 = 100书币</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { reactive, toRefs, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getUserinfo } from "@/api/user";
import Navbar from "@/components/common/Navbar.vue";

export default {
  name: "Payment",
  components: { Navbar },
  setup() {
    const state = reactive({
      fixedAmounts: [10, 20, 30, 50, 100, 200, 365, 500, 1000, 2000, 3000, 5000, 8888, 10000, 100000],
      selectedAmount: null,
      customAmount: null,
      baseurl: process.env.VUE_APP_BASE_API_URL,
      userId: null,
    });
    const isDarkTheme = ref(localStorage.getItem('theme') === 'light' ? false : true);
    const route = useRoute();
    const router = useRouter();
    const fetchUserInfo = async () => {
      const userInfo = await getUserinfo();
      if (userInfo && userInfo.data) {
        state.userId = userInfo.data.id;
      } else {
        alert("无法获取用户ID，请先登录");
        router.replace({ name: "login" });
      }
    };
    const selectAmount = (amount) => {
      state.selectedAmount = amount;
      state.customAmount = null;
    };
    const submitRecharge = () => {
      const amount = state.selectedAmount || state.customAmount;
      if (!amount || amount <= 0) {
        alert("请输入有效的金额");
        return;
      }
      const paymentContext = {
        bookId: route.query.bookId || null,
        chapterId: route.query.chapterId || null
      };
      const form = document.createElement("form");
      form.method = "POST";
      form.action = state.baseurl+"/front/payment/toPay";
      const inputUserId = document.createElement("input");
      inputUserId.type = "hidden";
      inputUserId.name = "userId";
      inputUserId.value = state.userId;
      const inputMoney = document.createElement("input");
      inputMoney.type = "hidden";
      inputMoney.name = "money";
      inputMoney.value = amount;
      let inputs = [inputUserId, inputMoney];
      const inputBookId = document.createElement("input");
      inputBookId.type = "hidden";
      inputBookId.name = "bookId";
      inputBookId.value = paymentContext.bookId === null ? "0" : paymentContext.bookId;
      const inputChapterId = document.createElement("input");
      inputChapterId.type = "hidden";
      inputChapterId.name = "chapterId";
      inputChapterId.value = paymentContext.chapterId===null ? "0" : paymentContext.chapterId;
      inputs.push(inputBookId, inputChapterId);
      inputs.forEach((input) => form.appendChild(input));
      document.body.appendChild(form);
      form.submit();
    };
    const changeTheme = (isDark) => {
      isDarkTheme.value = isDark;
    };
    onMounted(async () => {
      await fetchUserInfo();
    });
    return {
      ...toRefs(state),
      selectAmount,
      submitRecharge,
      isDarkTheme,
      changeTheme,
    };
  },
};
</script>

<style scoped>
.payment-wrapper {
  min-height: 100vh;
  background: #0a0a0a;
  transition: all 0.3s;
}
.payment-wrapper.light-theme {
  background: #f5f5f5;
}
.main-container {
  max-width: 1200px;
  margin: 40px auto 0 auto;
  padding: 30px 20px 0 20px;
}
.navbar-gap {
  height: 32px;
}
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
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
.payment-wrapper.light-theme .section-header h2 {
  color: #222;
}
.recharge-section {
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(33,150,243,0.08);
  padding: 32px 28px 28px 28px;
  margin-bottom: 40px;
}
.payment-wrapper.light-theme .recharge-section {
  background: rgba(0,0,0,0.03);
}
.amount-select {
  margin-bottom: 24px;
}
.amount-label {
  font-size: 16px;
  color: #2196f3;
  font-weight: 600;
  margin-bottom: 12px;
}
.fixed-amounts {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
  margin-bottom: 18px;
}
.amount-btn {
  padding: 14px 0;
  font-size: 16px;
  border: 1px solid #2196f3;
  color: #2196f3;
  background-color: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  letter-spacing: 1px;
}
.amount-btn::before {
  content: "￥";
  margin-right: 4px;
}
.amount-btn:hover,
.amount-btn.active {
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
  border-color: #2196f3;
}
.custom-amount {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.custom-amount label {
  font-size: 16px;
  color: #2196f3;
  font-weight: 500;
}
.custom-amount input {
  width: 60%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: transparent;
  color: #fff;
  transition: border 0.2s;
}
.payment-wrapper.light-theme .custom-amount input {
  color: #222;
  background: #fff;
}
.custom-amount input:focus {
  border: 1.5px solid #2196f3;
}
.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  box-shadow: 0 2px 8px rgba(33,150,243,0.08);
  transition: all 0.2s;
}
.submit-btn:hover {
  background: linear-gradient(45deg, #2196f3 0%, #4facfe 100%);
}
.recharge-desc {
  margin-top: 18px;
  font-size: 15px;
  color: #888;
  line-height: 1.7;
  background: rgba(33,150,243,0.03);
  border-radius: 6px;
  padding: 12px 16px;
}
.payment-wrapper.light-theme .recharge-desc {
  background: rgba(33,150,243,0.01);
  color: #555;
}
.recharge-desc .highlight {
  color: #2196f3;
  font-weight: bold;
}
</style>
