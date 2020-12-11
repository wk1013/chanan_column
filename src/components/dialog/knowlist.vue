<template>
  <div class="body-b" v-if="options.length > 0">
    <div class="body-item" v-for="(item, index) in options">
      <h1
        @click="getKnow(item.bdname, item.guid)"
        v-html="showData(item.title)"
      />
      <div class="bi-title">
        <span class="font-s12 color9 text-ellipsis" style="width: 35%"
          >作者：{{ item.author }}</span
        >
        <span class="font-s12 color9">来源：{{ item.from }}</span>
        <span class="font-s12 color9"
          >发布时间：{{ handleDate(item.createTime) }}</span
        >
      </div>
    </div>
  </div>
  <nothing v-else />
</template>
<script>
import { showDate, publiceUrl } from "@/utils/index.js";

export default {
  data() {
    return {};
  },
  props: {
    options: {
      default() {
        return [];
      },
      type: Array,
    },
  },
  methods: {
    handleDate: showDate,

    //检索词标红
    showData(text) {
      return text
        .replace(/###/g, '<span style="color:red">')
        .replace(/\$\$\$/g, "</span>");
    },

    //跳转知识详情
    getKnow(tableName, knowledgeId) {
      window.open(
        publiceUrl +
          "/krd/home/index#/knowledgeDetail?dbCode=COLUMN" +
          "&tableName=" +
          tableName +
          "&knowledgeId=" +
          knowledgeId
      );
    },
  },
};
</script>
