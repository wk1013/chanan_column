<template>
  <router-view />
</template>
<script>
import { getUserInfo } from "@/api/interface/home";

export default {
  name: "App",
  data() {
    return {
      appData: "appData",
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    //获取用户信息并保存
    getUser() {
      getUserInfo({})
        .then((json) => {
          if (json.success) {
            const data = json.content;
            sessionStorage.setItem("UserInfo", JSON.stringify(data));
          }
        })
        .catch((json) => {
          this.$message.error(json.message);
        });
    },
  },
};
</script>
