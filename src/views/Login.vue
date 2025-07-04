<template>
  <Navbar @themeChange="changeTheme" />
  <div class="login-wrapper" :class="{'light-theme': !isDarkTheme}">
    <!-- 左侧装饰元素 -->
    <div class="side-decoration left-side">
      <div class="tech-circle"></div>
      <div class="tech-line-vertical"></div>
      <div class="tech-dot dot1"></div>
      <div class="tech-dot dot2"></div>
      <div class="tech-dot dot3"></div>
      <div class="tech-circuit"></div>
    </div>
    <div class="main-container">
      <div class="login-card glass-effect">
        <div class="login-left">
          <h2 class="login-title gradient-text">登录阅界</h2>
          <div class="login-form">
            <div class="form-group">
              <input v-model="username" type="text" placeholder="手机号码" class="input modern-input" />
            </div>
            <div class="form-group">
              <input v-model="password" type="password" placeholder="密码" class="input modern-input" />
            </div>
            <div class="form-group">
              <button class="login-btn gradient-btn" @click="loginUser">登录</button>
            </div>
          </div>
        </div>
        <div class="login-right">
          <div class="register-tip">还没有账号？</div>
          <router-link :to="{name: 'register'}" class="register-btn">立即注册</router-link>
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
import { reactive, toRefs, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { login } from "@/api/user";
import { setToken, setNickName, setUid } from "@/utils/auth";
import Navbar from "@/components/common/Navbar.vue";
export default {
  name: "Login",
  components: { Navbar },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      username: "",
      password: ""
    });
    const isDarkTheme = ref(localStorage.getItem('theme') === 'light' ? false : true);
    const changeTheme = (isDark) => {
      isDarkTheme.value = isDark;
    };
    const loginUser = async () => {
      if (!state.username) {
        ElMessage.error("用户名不能为空！");
        return;
      }
      if (!/^1[3|4|5|6|7|8|9][0-9]{9}/.test(state.username)) {
        ElMessage.error("手机号格式不正确！");
        return;
      }
      if (!state.password) {
        ElMessage.error("密码不能为空！");
        return;
      }
      const { data } = await login(state);
      setToken(data.token);
      setUid(data.uid);
      setNickName(data.nickName);
      router.replace({ path: "/home" });
    };
    return {
      ...toRefs(state),
      loginUser,
      isDarkTheme,
      changeTheme
    };
  },
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background: linear-gradient(120deg, #181c24 0%, #23272f 100%);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}
.login-wrapper.light-theme {
  background: linear-gradient(120deg, #f5f7fa 0%, #e9f0fa 100%);
}
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
  border-right: 1px solid rgba(33, 150, 243, 0.08);
}
.right-side {
  right: 0;
  border-left: 1px solid rgba(128, 0, 128, 0.08);
}
.tech-circle {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(33, 150, 243, 0.3);
  border-radius: 50%;
  position: absolute;
  top: 100px;
  left: 20px;
  animation: pulsate 4s infinite;
}
.right-side .tech-circle {
  left: unset;
  right: 20px;
  border-color: rgba(128, 0, 128, 0.3);
}
.tech-line-vertical {
  width: 1px;
  height: 120px;
  background: linear-gradient(to bottom, rgba(33, 150, 243, 0.2), transparent);
  position: absolute;
  top: 150px;
  left: 38px;
}
.right-side .tech-line-vertical {
  left: unset;
  right: 38px;
  background: linear-gradient(to bottom, rgba(128, 0, 128, 0.2), transparent);
}
.tech-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #2196f3;
  position: absolute;
}
.right-side .tech-dot {
  background-color: #800080;
}
.dot1 {
  top: 260px;
  left: 25px;
  animation: blink 2s infinite;
}
.dot2 {
  top: 290px;
  left: 45px;
  animation: blink 3s infinite;
}
.dot3 {
  top: 320px;
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
.tech-circuit {
  width: 50px;
  height: 120px;
  position: absolute;
  top: 370px;
  left: 10px;
  border-top: 1px solid rgba(33, 150, 243, 0.13);
  border-right: 1px solid rgba(33, 150, 243, 0.13);
  border-bottom: 1px solid rgba(33, 150, 243, 0.13);
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
}
.right-side .tech-circuit {
  left: unset;
  right: 10px;
  border-right: none;
  border-left: 1px solid rgba(128, 0, 128, 0.13);
  border-top: 1px solid rgba(128, 0, 128, 0.13);
  border-bottom: 1px solid rgba(128, 0, 128, 0.13);
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
}
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
.main-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 100px 0 0 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 2;
}
.login-card {
  display: flex;
  background: rgba(255,255,255,0.22);
  border-radius: 28px;
  box-shadow: 0 12px 48px 0 rgba(33,150,243,0.13), 0 2px 12px 0 rgba(33,150,243,0.08);
  width: 820px;
  min-height: 480px;
  overflow: hidden;
  backdrop-filter: blur(22px) saturate(140%);
  border: 2px solid rgba(33,150,243,0.14);
  position: relative;
  transition: box-shadow 0.3s, background 0.3s;
}
.login-wrapper.light-theme .login-card {
  background: rgba(255,255,255,0.95);
  border: 2px solid rgba(33,150,243,0.09);
}
.glass-effect {
  box-shadow: 0 8px 32px 0 rgba(33,150,243,0.13), 0 1.5px 8px 0 rgba(33,150,243,0.06);
  backdrop-filter: blur(16px) saturate(120%);
}
.login-left {
  flex: 2;
  padding: 56px 36px 56px 56px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: transparent;
}
.login-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 32px;
  letter-spacing: 2px;
  text-align: left;
  color: #1a237e;
}
.gradient-text {
  background: linear-gradient(90deg, #1976d2 0%, #64b5f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.login-form {
  width: 100%;
}
.form-group {
  margin-bottom: 24px;
}
.input.modern-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  border: 2px solid #b3c6e0;
  border-radius: 10px;
  background: rgba(255,255,255,0.22);
  color: #222;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(33,150,243,0.06);
}
.login-wrapper:not(.light-theme) .input.modern-input {
  color: #fff;
  background: rgba(255,255,255,0.13);
}
.input.modern-input:focus {
  border: 2.5px solid #1976d2;
  box-shadow: 0 4px 16px rgba(33,150,243,0.13);
}
.login-btn, .gradient-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, #1976d2 0%, #64b5f6 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 2px;
  box-shadow: 0 4px 20px rgba(33,150,243,0.13);
  transition: all 0.2s;
  text-shadow: 0 1px 2px rgba(33,150,243,0.08);
}
.login-btn:hover, .gradient-btn:hover {
  background: linear-gradient(90deg, #1565c0 0%, #42a5f5 100%);
  box-shadow: 0 8px 32px rgba(33,150,243,0.18);
}
.login-right {
  flex: 1.2;
  background: linear-gradient(135deg, #23273a 0%, #181c24 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 38px;
  position: relative;
}
.login-wrapper.light-theme .login-right {
  background: linear-gradient(135deg, #e3f0fd 0%, #f5fafd 100%);
}
.register-tip {
  color: #90caf9;
  font-size: 18px;
  margin-bottom: 36px;
  font-weight: 600;
  letter-spacing: 1px;
  text-shadow: 0 1px 4px rgba(33,150,243,0.10);
}
.login-wrapper.light-theme .register-tip {
  color: #1976d2;
}
.register-btn {
  display: inline-block;
  padding: 14px 38px;
  background: #23273a;
  color: #90caf9;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 2px 12px rgba(33,150,243,0.10);
  border: 1.5px solid #3949ab;
}
.login-wrapper.light-theme .register-btn {
  background: #fff;
  color: #1976d2;
  border: none;
}
.register-btn:hover {
  background: #3949ab;
  color: #fff;
  box-shadow: 0 4px 16px rgba(33,150,243,0.18);
}
.login-wrapper.light-theme .register-btn:hover {
  background: #e3f2fd;
  color: #1565c0;
  box-shadow: 0 4px 16px rgba(33,150,243,0.18);
}
@media (max-width: 900px) {
  .main-container {
    padding: 30px 0 0 0;
  }
  .login-card {
    flex-direction: column;
    width: 98vw;
    min-width: unset;
  }
  .login-left, .login-right {
    padding: 32px 16px;
  }
  .side-decoration {
    display: none;
  }
}
</style>