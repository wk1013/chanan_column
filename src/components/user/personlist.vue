<template>
  <div class="special">
    <div
      class="usercolumn-item"
      v-for="(item, index) in options"
      @click="getPerson(item.sysId)"
    >
      <div class="person-t">
        <div class="person-img">
          <img :src="item.imgUrl" />
          <svg
            slot="suffix"
            aria-hidden="true"
            class="icon iconV"
            v-show="item.IsVip == 1"
          >
            <use xlink:href="#iconvipdiamond-f" />
          </svg>
        </div>
        <h1 class="font-s18 color3" style="margin: 12px 0; cursor: pointer">
          {{ item.title }}
        </h1>
        <div class="person-span">
          <span class="font-s16 color3" style="margin-right: 30px">{{
            item.CreateUserDepart
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
      </div>
      <div style="padding: 20px 30px 30px 30px">
        <span class="font-s14 color3">擅长领域：{{ item.themeName }}</span>
        <p class="font-s14 color6" style="margin: 16px 0">
          简介：{{ item.Introduce }}
        </p>
        <div class="person-r">
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
    </div>
  </div>
</template>
<script>
import { DeleteSubscribe, getSpecialDetail } from "@/api/interface/home";
import { showDate } from "@/utils/index.js";

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
    handleDate: showDate,

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

    //跳转单个人物专栏
    getPerson(id) {
      getSpecialDetail({
        id: id,
      })
        .then((json) => {
          if (json.success) {
            window.open("http://47.92.202.73/column/#/personDetail?id=" + id);
          } else {
            this.$message.warning("您不在该专栏的权限范围内");
          }
        })
        .catch((json) => {
          this.$message.error(json.message);
        });
    },
  },
};
</script>