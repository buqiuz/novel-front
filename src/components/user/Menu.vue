 <template>
  <div class="my_l">
    <ul class="log_list">
      <li>
        <router-link :class="`${routeName == 'userSetup' ? 'link_8 on' : 'link_8'}`" :to="{ name: 'userSetup' }"
          >账号设置</router-link
        >
      </li>
      <li>
        <router-link :class="`${routeName == 'userComment' ? 'link_6 on' : 'link_6'}`" :to="{ name: 'userComment' }"
          >我的评论</router-link
        >
      </li>
      <li>
        <router-link :class="`${routeName == 'userBookshelf' ? 'link_4 on' : 'link_4'}`" :to="{ name: 'userBookshelf' }"
        >我的书架</router-link
        >
      </li>
      <li>
        <router-link :class="`${routeName == 'userHistory' ? 'link_5 on' : 'link_5'}`" :to="{ name: 'userHistory' }"
        >阅读历史</router-link
        >
      </li>
      <li>
        <router-link :class="`${routeName == 'userRecord' ? 'link_2 on' : 'link_2'}`" :to="{ name: 'userRecord' }"
        >流水查询</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
export default {
  name: "UserMenu",
  setup() {
    const route = useRoute();
    const routeName = route.name;
    return {routeName}
  }
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.updateTable .style a {
  color: #999;
}
.updateTable .author a {
  color: #999;
  cursor: text;
}
.bind,
.updateTable .style a:hover {
  color: #f65167;
}
.userBox {
  /*width: 998px; border: 1px solid #eaeaea;*/
  margin: 0 auto 50px;
  background: #fff;
  border-radius: 6px;
}
.channelViewhistory .userBox {
  margin: 0 auto;
}
.user_l {
  width: 350px;
  float: left;
  padding: 100px 124px;
}
.user_l h3 {
  font-size: 23px;
  font-weight: normal;
  line-height: 1;
  text-align: center;
}
.user_l #LabErr {
  color: #ff4040;
  display: block;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
}
.user_l .log_list {
  width: 350px;
}
.user_l .s_input {
  margin-bottom: 25px;
  font-size: 14px;
}
.s_input {
  width: 348px;
  height: 38px;
  line-height: 38px\9;
  vertical-align: middle;
  border: 1px solid #ddd;
  border-radius: 2px;
}
.icon_name,
.icon_key,
.icon_code {
  width: 312px;
  padding-left: 36px;
}
.icon_key {
  background-position: 13px -51px;
}
.icon_code {
  background-position: 13px -117px;
  width: 200px;
  float: left;
}
.code_pic {
  height: 38px;
  float: right;
}
.btn_phone {
  height: 40px;
  width: 100px;
  float: right;
  cursor: pointer;
  padding: 0;
  text-align: center;
  border-radius: 2px;
  background: #dfdfdf;
}
.log_code {
  *padding-bottom: 25px;
}
.user_l .btn_red {
  width: 100%;
  font-size: 19px;
  padding: 12px;
}
.autologin {
  color: #999;
  line-height: 1;
  margin-bottom: 18px;
}
.autologin em {
  vertical-align: 2px;
  margin-left: 4px;
}
.user_r {
  width: 259px;
  margin: 80px 0;
  padding: 20px 70px;
  border-left: 1px dotted #e3e3e3;
  float: right;
  text-align: center;
}
.user_r .tit {
  font-size: 16px;
  line-height: 1;
  padding: 6px 0 25px;
}
.user_r .btn_ora {
  padding: 10px 34px;
}
.fast_login {
  padding: 60px 0 0;
}
.fast_list {
  text-align: center;
  padding: 0.5rem;
}
.fast_list li {
  display: inline-block;
  *display: inline;
  zoom: 1;
}
.fast_list li .img {
  width: 48px;
  height: 48px;
  margin: 20px 0 5px;
}
.fast_list li a:hover {
  opacity: 0.8;
  filter: alpha(opacity=80);
  -moz-opacity: 0.8;
}
.fast_list li span {
  display: block;
}
.fast_list .login_qq {
  margin: 0 42px;
}
.fast_list .login_wb a {
  color: #f55c5b;
}
.fast_list .login_qq a {
  color: #51b7ff;
}
.fast_list .login_wx a {
  color: #66d65e;
}
.fast_tit {
  position: relative;
  overflow: hidden;
}
.fast_tit .lines {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  line-height: 1;
  background: #eaeaea;
}
.fast_tit .title {
  background: #fff;
  font-size: 16px;
  padding: 3px 14px;
  position: relative;
  display: inline-block;
  z-index: 999;
}
/*userinfo*/
.my_l {
  width: 198px;
  float: left;
  font-size: 13px;
  padding-top: 20px;
}
.my_l li a {
  display: block;
  height: 42px;
  line-height: 42px;
  padding-left: 62px;
  border-left: 4px solid #fff;
  margin-bottom: 5px;
  color: #666;
}
.my_l li .on {
  background-color: #fafafa;
  border-left: 2px solid #f80;
  color: #000;
  border-radius: 0 2px 2px 0;
}
.my_l .link_1 {
  background-position: 32px -188px;
}
.my_l .link_2 {
  background-position: 32px -230px;
}
.my_l .link_3 {
  background-position: 32px -272px;
}
.my_l .link_4 {
  background-position: 32px -314px;
}
.my_l .link_5 {
  background-position: 32px -356px;
}
.my_l .link_6 {
  background-position: 32px -397px;
}
.my_l .link_7 {
  background-position: 32px -440px;
}
.my_l .link_8 {
  background-position: 32px -481px;
}
.my_r {
  width: 739px;
  padding: 0 30px 30px;
  float: right;
  border-left: 1px solid #efefef;
  min-height: 470px;
}
.my_info {
  padding: 30px 0 5px;
}
.user_big_head {
  /*width:110px; height:110px; padding:4px; border:1px solid #eaeaea;*/
  margin-right: 30px;
  float: left;
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.my_r .my_name {
  font-size: 18px;
  line-height: 1;
  padding: 5px 0 12px 0;
}
.my_r .s_input {
  width: 318px;
  padding: 0 10px;
}
.my_list li {
  line-height: 28px;
}
.my_list li i,
.my_list li em.red {
  margin-right: 6px;
}
.my_list .binded {
  color: #999;
  margin-left: 6px;
}
.my_list .btn_link {
  margin-left: 12px;
}
.mytab_list li {
  line-height: 30px;
  padding: 10px 0;
  font-size: 14px;
}
.mytab_list li .tit {
  width: 70px;
  color: #aaa;
  text-align: right;
  display: inline-block;
  margin-right: 18px;
}
.mytab_list .user_img {
  width: 48px;
  height: 48px;
  vertical-align: middle;
  border-radius: 50%;
}
.my_bookshelf .title {
  padding: 20px 0 15px;
  line-height: 30px;
}
.my_bookshelf h4 {
  font-size: 14px;
  color: #666;
}
.my_bookshelf h2 {
  font-size: 18px;
  font-weight: normal;
}
.updateTable {
  width: 739px;
  color: #999;
}
.updateTable table {
  width: 100%;
  margin-bottom: 14px;
}
.updateTable th,
.updateTable td {
  height: 40px;
  line-height: 40px;
  vertical-align: middle;
  padding-left: 6px;
  font-weight: normal;
  text-align: left;
}
.updateTable th {
  background: #f9f9f9;
  color: #333;
  border-top: 1px solid #eee;
}
.updateTable td {
  height: 40px;
  line-height: 40px;
}
.updateTable .style {
  width: 80px;
  padding-left: 10px;
}
.updateTable .name {
  width: 178px;
  padding-right: 10px;
}
.updateTable .name a,
.updateTable .chapter a {
  max-width: 168px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.updateTable .chapter {
  padding-right: 5px;
}
.updateTable .chapter a {
  max-width: 220px;
  float: left;
}
.updateTable .author {
  width: 72px;
  text-align: left;
}
.updateTable .goread {
  width: 80px;
  text-align: center;
}
.updateTable .time {
  width: 86px;
}
.updateTable .word {
  width: 64px;
  padding-right: 10px;
  text-align: right;
}
.updateTable .rank {
  width: 30px;
  padding-right: 10px;
  text-align: center;
}
.updateTable .name a,
.updateTable .chapter a,
.updateTable .author a {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  overflow: hidden;
}
.updateTable tr:nth-child(2n) td {
  background: #fafafa;
}
.dataTable {
  width: 739px;
}
.dataTable table {
  width: 100%;
  margin-bottom: 14px;
  border-collapse: collapse;
}
.dataTable th,
.dataTable td {
  height: 40px;
  line-height: 40px;
  vertical-align: middle;
  padding: 0 10px;
  font-weight: normal;
  text-align: center;
  border: 1px solid #eaeaea;
}
.dataTable th {
  background: #f8f8f8;
}
.nodate {
  border-top: 1px solid #eaeaea;
  padding: 60px 0;
}
.viewhistoryBox {
  /*padding: 0 30px 30px; */
  padding: 0 20px 10px;
}
.viewhistoryBox .updateTable {
  width: 100%;
}
/*.btn_gray, .btn_red, .btn_ora { font-size:14px; padding:8px 28px }*/
.book_tit {
  height: 48px;
  line-height: 48px;
  margin: 0 14px;
  border-bottom: 1px solid #eaeaea;
  overflow: hidden;
}
.book_tit .fl {
  font-size: 14px;
  color: #999;
}
.book_tit .fl h3 {
  font-size: 18px;
  color: #333;
  font-weight: normal;
  margin-right: 5px;
  display: inline;
}
.book_tit .fr {
  font-size: 14px;
}

.commentBar,
.feedback_list {
  border-top: 1px solid #eee;
  margin-bottom: 15px;
}
/*.comment_list { padding: 16px 0; border-bottom: 1px solid #eee }
.comment_list .user_head { width:54px; height:54px; border-radius:50%; float: left; margin-right: 14px }
.comment_list .li_1 { overflow: hidden }
.comment_list .user_name { color: #ed4259 }
.comment_list .li_2 { padding:3px 0; color:#999 }
.comment_list .li_3, .comment_list .li_4 { margin-left:68px }
.comment_list .reply { padding-left: 12px }
.comment_list .num { color: #ed4259; margin: 0 3px }
.comment_list .li_4 { line-height:34px; padding-top:8px; margin-top:15px; border-top:1px solid #eaeaea }
.comment_list .li_4 .more { background:#f7f7f7; border-radius:2px; color:#ed4259; text-align:center }*/
.no_contet {
  padding: 190px 0 40px;
  text-align: center;
  color: #999;
  border-top: 1px solid #eee;
}

.comment_list {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}
.comment_list:last-child {
  border: none;
}
.comment_list .user_heads {
  /*width: 54px; height: 54px; float: left;*/
  position: relative;
  margin-right: 20px;
}
.comment_list .user_head {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f6f6f6;
}
.comment_list .user_heads span {
  display: block;
  margin: 0;
  position: absolute;
  left: 12px;
  bottom: 0;
}
.comment_list ul {
  /*width: 640px;*/
  width: 660px;
}
.comment_list .li_0 {
  font-family: "宋体";
}
.comment_list .li_0 strong {
  font-size: 14px;
  color: #f00;
}
.comment_list .li_1 {
  overflow: hidden;
}
.comment_list .user_name {
  color: #ed4259;
}
.comment_list .li_2 {
  padding: 6px 0;
}
.comment_list .li_3 {
  color: #999;
}
.comment_list .reply {
  padding-left: 12px;
}
.comment_list .num {
  color: #ed4259;
  margin: 0 3px;
}
.comment_list .li_4 {
  line-height: 34px;
  padding-top: 8px;
  margin-top: 15px;
  border-top: 1px solid #eaeaea;
}
.pl_bar li {
  display: block;
}
.pl_bar .name {
  color: #666;
  padding-top: 2px;
  font-size: 14px;
}
.pl_bar .dec {
  font-size: 14px;
  line-height: 1.8;
  padding: 12px 0;
}
.pl_bar .other {
  line-height: 24px;
  color: #999;
  font-size: 13px;
}
.pl_bar .other a {
  display: inline-block;
  color: #999;
}
.pl_bar .reply {
  padding-left: 22px;
}
/*.no_comment { padding: 70px 14px 115px; color: #CCCCCC; text-align: center; font-size: 14px; }*/
.reply_bar {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 10px;
  line-height: 1.8;
}
</style>