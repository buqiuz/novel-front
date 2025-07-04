<template>
  <Navbar @themeChange="changeTheme" />
  <div class="page-wrapper" :class="{'light-theme': !isDarkTheme}">
    <div class="side-decoration left-side">
      <div class="tech-circle"></div>
      <div class="tech-line-vertical"></div>
      <div class="tech-dot dot1"></div>
      <div class="tech-dot dot2"></div>
      <div class="tech-dot dot3"></div>
      <div class="tech-circuit"></div>
    </div>
    <div class="content-container">
      <div class="main-container tech-theme user-setup-main" :class="{'light-theme': !isDarkTheme}">
        <div class="user-setup-grid">
          <UserMenu />
          <div class="user-info-card-modern">
            <div class="avatar-section">
              <el-upload
                class="avatar-uploader"
                :action="baseUrl + '/front/resource/image'"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img :src="userPhoto ? imgBaseUrl + userPhoto : man" class="avatar-img" />
              </el-upload>
              <div class="avatar-tip">点击头像上传(JPG, ≤5MB)</div>
            </div>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">昵称</span>
                <span class="info-value">{{ nickName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">性别</span>
                <span class="info-value">男</span>
              </div>
            </div>
            <el-button type="danger" class="delete-btn" @click="handleDeleteUser">删除账号</el-button>
          </div>
        </div>
      </div>
    </div>
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
import "@/assets/styles/user.css";
import man from "@/assets/images/man.png";
import { reactive, toRefs, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { deleteUser, getUserinfo, updateUserInfo } from "@/api/user";
import Navbar from "@/components/common/Navbar";
import UserMenu from "@/components/user/Menu";
import { removeNickName, removeToken, removeUid } from "@/utils/auth";
export default {
  name: "userSetup",
  components: {
    Navbar,
    UserMenu,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      userPhoto: "",
      nickName: "",
      baseUrl: process.env.VUE_APP_BASE_API_URL,
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
    });
    const isDarkTheme = ref(localStorage.getItem('theme') === 'light' ? false : true);
    const changeTheme = (isDark) => {
      isDarkTheme.value = isDark;
    };
    const handleDeleteUser = async () => {
      try {
        const confirm = window.confirm("确认删除账号？删除后将无法恢复！");
        if (!confirm) return;
        const { code, msg } = await deleteUser();
        if (code === "00000") {
          ElMessage.success("账号已删除");
          removeToken();
          removeNickName();
          removeUid();
          router.replace({ name: "home" });
        } else {
          ElMessage.error(msg || "删除失败");
        }
      } catch (e) {
        ElMessage.error("请求异常");
      }
    };
    onMounted(async () => {
      const { data } = await getUserinfo();
      state.userPhoto = data.userPhoto;
      state.nickName = data.nickName;
    });
    const beforeAvatarUpload = (rawFile) => {
      if (rawFile.type !== "image/jpeg") {
        ElMessage.error("必须上传 JPG 格式的图片!");
        return false;
      } else if (rawFile.size / 1024 / 1024 > 5) {
        ElMessage.error("图片大小最多 5MB!");
        return false;
      }
      return true;
    };
    const handleAvatarSuccess = (response, uploadFile) => {
      state.userPhoto = response.data;
      updateUserInfo({ userPhoto: state.userPhoto });
    };
    return {
      ...toRefs(state),
      isDarkTheme,
      changeTheme,
      man,
      beforeAvatarUpload,
      handleAvatarSuccess,
      handleDeleteUser,
    };
  },
};
</script>

<style scoped>
.page-wrapper {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #0a0a0a;
  position: relative;
  overflow-x: hidden;
  transition: all 0.3s ease;
}
.page-wrapper.light-theme {
  background-color: #f5f5f5;
}
.content-container {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
.side-decoration {
  width: 80px;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}
.left-side { left: 0; border-right: 1px solid rgba(33, 150, 243, 0.1); }
.right-side { right: 0; border-left: 1px solid rgba(33, 150, 243, 0.1); }
.light-theme .left-side { border-right: 1px solid rgba(33, 150, 243, 0.1); }
.light-theme .right-side { border-left: 1px solid rgba(33, 150, 243, 0.1); }
.tech-circle { width: 40px; height: 40px; border: 1px solid rgba(33, 150, 243, 0.5); border-radius: 50%; position: absolute; top: 100px; left: 20px; animation: pulsate 4s infinite; }
.right-side .tech-circle { left: unset; right: 20px; }
.tech-line-vertical { width: 1px; height: 180px; background: linear-gradient(to bottom, rgba(33, 150, 243, 0.5), transparent); position: absolute; top: 150px; left: 40px; }
.right-side .tech-line-vertical { left: unset; right: 40px; background: linear-gradient(to bottom, rgba(128, 0, 128, 0.5), transparent); }
.tech-dot { width: 8px; height: 8px; border-radius: 50%; background-color: #2196f3; position: absolute; }
.right-side .tech-dot { background-color: #800080; }
.dot1 { top: 350px; left: 25px; animation: blink 2s infinite; }
.dot2 { top: 380px; left: 45px; animation: blink 3s infinite; }
.dot3 { top: 410px; left: 25px; animation: blink 2.5s infinite; }
.right-side .dot1 { left: unset; right: 25px; }
.right-side .dot2 { left: unset; right: 45px; }
.right-side .dot3 { left: unset; right: 25px; }
.tech-circuit { width: 60px; height: 200px; position: absolute; top: 450px; left: 10px; border-top: 1px solid rgba(33, 150, 243, 0.3); border-right: 1px solid rgba(33, 150, 243, 0.3); border-bottom: 1px solid rgba(33, 150, 243, 0.3); border-top-right-radius: 20px; border-bottom-right-radius: 20px; }
.right-side .tech-circuit { left: unset; right: 10px; border-right: none; border-left: 1px solid rgba(128, 0, 128, 0.3); border-top: 1px solid rgba(128, 0, 128, 0.3); border-bottom: 1px solid rgba(128, 0, 128, 0.3); border-top-right-radius: 0; border-bottom-right-radius: 0; border-top-left-radius: 20px; border-bottom-left-radius: 20px; }
@keyframes pulsate { 0% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 0.7; } }
@keyframes blink { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
.main-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 40px 20px; color: #fff; background-color: #121212; transition: all 0.3s ease; min-height: 600px; }
.main-container.light-theme { color: #333; background-color: #ffffff; }
.user-setup-grid { display: flex; gap: 40px; align-items: flex-start; }
@media (max-width: 900px) { .user-setup-grid { flex-direction: column; align-items: center; } }
.user-info-card-modern {
  flex: 1;
  max-width: 420px;
  min-width: 320px;
  background: rgba(0,0,0,0.18);
  border-radius: 16px;
  box-shadow: 0 6px 32px rgba(33,150,243,0.10), 0 1.5px 8px rgba(0,0,0,0.08);
  padding: 36px 28px 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1.5px solid rgba(33,150,243,0.10);
  transition: background 0.3s, box-shadow 0.3s;
}
.light-theme .user-info-card-modern {
  background: rgba(33,150,243,0.03);
  border: 1.5px solid rgba(33,150,243,0.08);
  box-shadow: 0 6px 32px rgba(33,150,243,0.06), 0 1.5px 8px rgba(0,0,0,0.04);
}
.avatar-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 32px; }
.avatar-uploader { cursor: pointer; }
.avatar-img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #2196f3; box-shadow: 0 2px 12px rgba(33,150,243,0.15); background: #fff; }
.avatar-tip { margin-top: 10px; font-size: 13px; color: #aaa; }
.info-list { width: 100%; margin-bottom: 32px; }
.info-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid rgba(33,150,243,0.08); font-size: 16px; }
.light-theme .info-item { border-bottom: 1px solid rgba(33,150,243,0.06); }
.info-label { color: #2196f3; font-weight: 500; }
.info-value { color: #fff; }
.light-theme .info-value { color: #333; }
.delete-btn { width: 100%; margin-top: 20px; }
@media (max-width: 900px) { .user-setup-grid { flex-direction: column; align-items: center; } .user-info-card-modern { max-width: 100%; min-width: 0; width: 100%; } }
@media (max-width: 600px) { .main-container { padding: 10px; } .user-info-card-modern { padding: 16px 4px; } }
</style>
