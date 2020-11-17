<template>
  <div class="special">
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
          <span class="font-s16 color3 text-ellipsis">{{ item.title }}</span>
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
            >更新{{ showDate(item.updateDate) }}</span
          >
        </div>
      </div>
      <div style="padding: 16px 16px 0 16px">
        <div
          class="list-item flex"
          style="margin-bottom: 20px"
          v-for="i in item.specialList"
        >
          <span class="list-icon"></span>
          <span
            class="text-ellipsis font-s14 color3"
            style="cursor: pointer"
            @click="getSpecialItem(i.listId)"
            @click.stop
            >{{ i.name }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DeleteSubscribe, getSpecialDetail } from "@/api/interface/home";

export default {
  data() {
    return {
      isDisable: false,
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
    //时间截取
    showDate(date) {
      return date.slice(0, 10);
    },

    //跳转单个专题专栏
    getSpecial(id) {
      getSpecialDetail({
        id: id,
      })
        .then((json) => {
          if (json.success) {
            window.open(
              "http://47.92.202.73/column?tk_param=f52739360bb94aa88d30270cbc25d362#/specialDetail?id=" +
                id
            );
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

    //跳转专题专栏中的单个知识
    getSpecialItem(id) {
      console.log("跳转知识页面");
    },
  },
};
</script>