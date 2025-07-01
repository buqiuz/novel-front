<template>
  <Header />
  <div class="recharge-section">
    <h3>充值</h3>
    <!-- 分隔线 -->
    <hr class="divider" />
    <!-- 固定金额选择 -->
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


    <!-- 自定义金额输入 -->
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

    <!-- 提交按钮 -->
    <button type="button" class="submit-btn" @click="submitRecharge">立即支付</button>

    <!-- 分隔线 -->
    <hr class="divider">

    <!-- 充值说明 -->
    <div class="recharge-desc">
      <span class="highlight">充值说明：</span>“阅界小说网”的收费书籍阅读服务需要使用本站专用虚拟货币——<span class="highlight">书币</span>，以下是具体币值说明与兑换方式，书友们可以通过向本站的帐户充值，来享受本站所提供的一切收费书籍。充值兑换比例：<span class="highlight">人民币1元 = 100书币</span>
    </div>
  </div>
  <Footer />
</template>


<style scoped>
.recharge-section {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h3 {
  font-size: 24px; /* 字体调大 */
  color: #f80;     /* 颜色设置为 #f80 */
  margin-bottom: 10px;
}
.fixed-amounts {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 40px;
  margin-bottom: 20px;
}

.amount-btn {
  padding: 14px 18px;
  font-size: 16px;
  border: 1px solid #f80;
  color: #f80;
  background-color: transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}
/* 金额按钮添加人民币符号 */
.amount-btn::before {
  content: "￥";
  margin-right: 4px;
}
.amount-btn:hover {
  background-color: #f80;
  color: white;
  border-color: #f80;
}
.amount-btn.active {
  background-color: #f80;
  color: white;
}

.divider {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ddd;
}

.custom-amount {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px; /* 可选：增加文字和输入框之间的间距 */
}
.custom-amount label {
  font-size: 18px; /* 增大字体 */
  margin-bottom: 8px;
}

.custom-amount input {
  width: 50%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-btn {
  width: 40%;
  padding: 14px;
  background-color: #f80;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  display: block; /* 居中所需 */
  margin: 0 auto; /* 居中所需 */
}
.submit-btn:hover {
  background-color: #e65100;
}
/* 新增充值说明样式 */
.recharge-desc {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 高亮关键词：书币、金额等 */
.recharge-desc .highlight {
  color: #f80;
  font-weight: bold;
}

</style>



<script>
import { reactive, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getUserinfo } from "@/api/user";
import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";

export default {
  name: "Payment",
  components: { Footer, Header },
  setup() {
    const state = reactive({
      fixedAmounts: [10, 20, 30, 50, 100, 200, 365, 500, 1000, 2000, 3000, 5000, 8888, 10000, 100000],
      selectedAmount: null,
      customAmount: null,
      baseurl:process.env.VUE_APP_BASE_API_URL,
      userId: null,
    });

    const router = useRouter();

    // 获取用户信息
    const fetchUserInfo = async () => {
      const userInfo = await getUserinfo();
      if (userInfo && userInfo.data) {
        state.userId = userInfo.data.id;
      } else {
        alert("无法获取用户ID，请先登录");
        router.push({ name: "login" });
      }
    };

    // 选择固定金额
    const selectAmount = (amount) => {
      state.selectedAmount = amount;
      state.customAmount = null; // 清空自定义输入
    };

    // 提交充值
    const submitRecharge = () => {
      const amount = state.selectedAmount || state.customAmount;

      if (!amount || amount <= 0) {
        alert("请输入有效的金额");
        return;
      }

      // 构造表单并自动提交
      const form = document.createElement("form");
      form.method = "POST";
      // form.action = "http://127.0.0.1:20010/api/front/payment/toPay";
      form.action = state.baseurl+"/front/payment/toPay";

      const inputUserId = document.createElement("input");
      inputUserId.type = "hidden";
      inputUserId.name = "userId";
      inputUserId.value = state.userId;

      const inputMoney = document.createElement("input");
      inputMoney.type = "hidden";
      inputMoney.name = "money";
      inputMoney.value = amount;

      form.appendChild(inputUserId);
      form.appendChild(inputMoney);

      document.body.appendChild(form);
      form.submit();
    };

    onMounted(async () => {
      await fetchUserInfo();
    });

    return {
      ...toRefs(state),
      selectAmount,
      submitRecharge,
    };
  },
};
</script>

