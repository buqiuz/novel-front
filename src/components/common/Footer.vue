 <template>
  <div class="footer">
    <div class="box_center cf">
      <div class="copyright">
        <ul>
          
          <li>
            Copyright (C) xxyopen.com All rights
            reserved&nbsp;&nbsp;阅界版权所有
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { getToken } from "@/utils/auth";
export default {
  name: "Footer",
  setup() {
    const router = useRouter();
    const goFeedBack = () => {
      if(!getToken()){
        router.replace({name: 'login'});
      }else{
      router.replace({name: 'feadback'});
      }
    };
    return {
      goFeedBack
    }
  },
  
};
</script>