<template>
  <div class="nothing">
    <img :src="imageUrl" />
    <span>暂无数据</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imageUrl: require("../../assets/img/nothing.png"),
    };
  },
};
</script>
<style scoped>
.nothing {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.nothing span {
  font-size: 14px;
  color: #333;
}
</style>