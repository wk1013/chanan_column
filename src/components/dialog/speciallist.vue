<template>
  <div class="special" v-if="options.length > 0">
    <div
      class="special-item"
      v-for="(item, index) in options"
      @click="getSpecial(item.sysId)"
    >
      <span v-show="item.IsTopping == 1" class="istop">置顶</span>
      <div class="special-img">
        <img :src="item.imgUrl" />
      </div>
      <div style="padding: 0 16px">
        <div class="special-l">
          <span
            class="font-s16 color3 text-ellipsis blod"
            v-html="handleTitle(inputKey, item.title)"
          />
          <div
            v-if="!item.isSub"
            class="subscribe"
            @click="getSubscribe(true, item.sysId)"
            @click.stop
          >
            <svg aria-hidden="true" slot="suffix" class="icon">
              <use xlink:href="#iconadd" />
            </svg>
            订阅
          </div>
          <div
            class="ifsub"
            v-if="item.isSub"
            @mouseenter="enter(index)"
            @mouseleave="leave()"
            @click="getSubscribe(false, item.sysId)"
            @click.stop
          >
            {{ seen && index == current ? "取消订阅" : "已订阅" }}
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
          <span class="list-icon" />
          <span
            class="text-ellipsis font-s14 color3"
            style="cursor: pointer"
            @click="getSpecialItem(i.listId)"
            @click.stop
            >{{ i.name }}</span
          >
        </div>
      </div>
      <div v-else class="font-s14 color3" style="padding: 16px">
        暂无相关专栏知识
      </div>
    </div>
  </div>
  <nothing v-else />
</template>
<script>
import {
  getSubscribe,
  DeleteSubscribe,
  getSpecialDetail,
} from "@/api/interface/home";
import { showDate, showData } from "@/utils/index.js";

export default {
  data() {
    return {
      seen: false,
      current: 0,
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
    inputKey: {
      type: String,
      default: "",
    },
  },
  watch: {
    inputKey(val) {
      this.inputKey = val;
    },
  },
  methods: {
    handleTitle: showData,

    handleDate: showDate,

    //已订阅的专栏鼠标移入移出时的操作
    enter(index) {
      this.seen = true;
      this.current = index;
    },
    leave() {
      this.seen = false;
      this.current = null;
    },

    //跳转单个主题专栏
    getSpecial(id) {
      getSpecialDetail({
        id: id,
      })
        .then((json) => {
          if (json.success) {
            this.$router.push({
              path: "/specialDetail",
              query: {
                id: id,
              },
            });
          } else {
            this.$message.warning("您不在该专栏的权限范围内");
          }
        })
        .catch((json) => {
          this.$message.error(json.message);
        });
    },

    //订阅或者取消订阅专栏
    getSubscribe(flag, id) {
      if (this.isDisable) {
        return false;
      } else {
        this.isDisable = true;
        if (flag) {
          getSubscribe({
            specialColumnId: id,
          })
            .then((json) => {
              this.isDisable = false;
              if (json.success) {
                this.$message.success("订阅成功");
                this.$emit("confirm");
              } else {
                this.$message.error(json.message);
              }
            })
            .catch((json) => {
              this.isDisable = false;
              this.$message.error(json.message);
            });
        } else {
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
      }
    },

    //跳转主题专栏中的单个知识
    getSpecialItem(id) {
      console.log("跳转知识页面");
    },
  },
};
</script>