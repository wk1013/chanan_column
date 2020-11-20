<template>
  <div class="main">
    <top-html type="common"></top-html>
    <div class="container-panel">
      <div class="body" style="padding-bottom: 30px">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }" replace
            >知识专栏</el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><span style="cursor: pointer" @click="$router.back(-1)">{{
              title
            }}</span></el-breadcrumb-item
          >
          <el-breadcrumb-item>知识上传</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="height: 80vh">
          <iframe
            ref="iframe"
            id="bdIframe"
            :src="getUrl()"
            frameborder="0"
            width="100%"
            height="100%"
          ></iframe>
        </div>
      </div>
    </div>
    <foot-html></foot-html>
  </div>
</template>
<script>
import { AddNum } from "@/api/interface/home";

export default {
  data() {
    return {
      title: this.$route.query.title,
      id: this.$route.query.id,
      type: this.$route.query.type,
    };
  },
  mounted() {
    window.addEventListener("message", this.getMessage, true);
  },
  destroyed() {
    window.removeEventListener("message", this.getMessage, true);
  },
  methods: {
    //获取外部接口信息
    getUrl() {
      let id = this.id;
      let type = this.type;
      var url =
        "http://47.92.202.73/skdm/#/knowledge/column/upload?columnId=" +
        id +
        "&columnType=" +
        type;
      return url;
    },

    //监听iframe返回值
    getMessage(e) {
      if (e.data.status === "success") {
        this.changeNodeMsg();
      } else if (e.data.status === "cancel") {
        this.$router.back(-1);
      }
    },

    //知识数+1并返回
    changeNodeMsg() {
      AddNum({
        specialColumnId: this.id,
        type: 0,
      })
        .then((json) => {
          if (json.success) {
            this.$router.back(-1);
          } else {
            this.$message.error(json.message);
          }
        })
        .catch((json) => {
          this.$message.error(json.message);
        });
    },
  },
};
</script>