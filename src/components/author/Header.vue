<template>
  <div class="header">
    <div class="mainNav" id="mainNav">
      <div class="box_center cf" style="height: 44px; line-height: 48px; color: #fff; font-size: 16px; display: flex; align-items: center;">

        <!-- 返回首页图标 -->
        <a href="/" style="color: #fff; text-decoration: none; display: flex; align-items: center;">
          <img src="@/assets/images/home.png" alt="Home" style="width: 24px; height: 24px; margin-right: 10px;" />
        </a>

        <!-- 标题居中 -->
        <div style="flex: 1; text-align: center;">
          阅界作家管理
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthorHeader"
};
</script>

<style scoped>
/* 可选：添加一些样式来美化图标和布局 */
.box_center {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
