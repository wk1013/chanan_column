<template>
  <div class="special" v-if="options.length > 0">
    <div
      class="usercolumn-item"
      v-for="(item, index) in options"
      @click="getSpecial(item.sysId)"
    >
      <div class="special-img">
        <img :src="item.imgUrl" />
      </div>
      <div style="padding: 0 16px">
        <div class="special-l">
          <span class="font-s16 color3 text-ellipsis blod">{{
            item.title
          }}</span>
          <div
            class="ifsub"
            v-if="item.isSub"
            @click="getSubscribe(item.sysId)"
            @click.stop
          >
            取消订阅
          </div>
        </div>
        <div class="special-r">
          <div>
            <span class="special-span font-s12 color9"
              >知识{{ item.knowledgeNum }}</span
            >
            <span class="special-span font-s12 color9"
              >订阅{{ item.subscribeNum }}</span
            >
            <span class="special-span font-s12 color9"
              >浏览{{ item.browseNum }}</span
            >
          </div>
          <span class="font-s12 color9"
            >更新{{ handleDate(item.updateDate) }}</span
          >
        </div>
      </div>
      <div v-if="item.specialList.length > 0" style="padding: 16px 16px 0 16px">
        <div
          class="list-item flex"
          style="margin-bottom: 20px"
          v-for="i in item.specialList"
        >
          <span class="list-icon"></span>
          <span
            class="text-ellipsis font-s14 color3"
            style="cursor: pointer"
            @click="getSpecialItem(i.bdname, i.listId)"
            @click.stop
            >{{ i.name }}</span
          >
        </div>
      </div>
      <div v-else class="nothing_l">
        <img :src="imageUrl" />
        <span>暂无数据</span>
      </div>
    </div>
  </div>
  <nothing v-else />
</template>
<script>
import { DeleteSubscribe, getSpecialDetail } from "@/api/interface/home";
import { showDate, publiceUrl } from "@/utils/index.js";

export default {
  data() {
    return {
      isDisable: false,
      imageUrl: require("../../assets/img/nothing_l.png"),
    };
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

    //跳转单个主题专栏
    getSpecial(id) {
      getSpecialDetail({
        id: id,
      })
        .then((json) => {
          if (json.success) {
            window.open(publiceUrl + "/column/#/specialDetail?id=" + id);
          } else {
            this.$message.warning("您不在该专栏的权限范围内");
          }
        })
        .catch((json) => {
          this.$message.error(json.message);
        });
    },

    //取消订阅专栏
    getSubscribe(id) {
      if (this.isDisable) {
        return false;
      } else {
        this.isDisable = true;
        DeleteSubscribe({
          specialColumnId: id,
        })
          .then((json) => {
            this.isDisable = false;
            if (json.success) {
              this.$message.success("取消订阅成功");
              this.$emit("confirm");
            } else {
              this.$message.error(json.message);
            }
          })
          .catch((json) => {
            this.isDisable = false;
            this.$message.error(json.message);
          });
      }
    },

    //跳转主题专栏中的单个知识
    getSpecialItem(tableName, knowledgeId) {
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