<template>
  <el-container class="container-panel">
    <el-main class="main-panel">
      <div class="body">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }" replace
            >知识专栏</el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><span style="cursor: pointer" @click="$router.back(-1)">{{
              title
            }}</span></el-breadcrumb-item
          >
          <el-breadcrumb-item>知识管理</el-breadcrumb-item>
        </el-breadcrumb>
        <iframe
          ref="iframe"
          id="bdIframe"
          :src="getUrl()"
          frameborder="0"
          scrolling="no"
        ></iframe>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      title: this.$route.query.title,
      id: this.$route.query.id,
      type: this.$route.query.type,
    };
  },
  mounted() {
    /**
     * iframe-宽高自适应显示
     */
    const oIframe = document.getElementById("bdIframe");
    const deviceWidth = document.documentElement.clientWidth;
    const deviceHeight = document.documentElement.clientHeight;
    oIframe.style.width = Number(deviceWidth) - 220 + "px"; //数字是页面布局宽度差值
    oIframe.style.height = Number(deviceHeight) - 120 + "px"; //数字是页面布局高度差
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
  },
};
</script>