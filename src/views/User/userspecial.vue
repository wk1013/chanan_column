<template>
  <div class="usercolumn">
    <div class="flex" style="justify-content: space-between">
      <div class="flex">
        <div class="flex">
          <div
            :class="[
              { active: isActive == 0 },
              'head-item',
              'font-s16',
              'color3',
            ]"
            @click="ChangeTab(0)"
            style="margin-right: 30px"
          >
            主题专栏
            <span v-if="isActive == 0"></span>
          </div>
          <div
            :class="[
              { active: isActive == 1 },
              'head-item',
              'font-s16',
              'color3',
            ]"
            @click="ChangeTab(1)"
          >
            人物专栏
            <span v-if="isActive == 1"></span>
          </div>
        </div>
      </div>
      <div class="button" @click="getNewspecial()">去订阅专栏</div>
    </div>
    <speciallist :options="options" v-if="isActive == 0" @confirm="init">
    </speciallist>
    <personlist
      :options="options"
      v-if="isActive == 1"
      @confirm="init"
    ></personlist>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="12"
      layout="prev, pager, next, jumper"
      :total="total"
      hide-on-single-page
      background
      style="text-align: center"
    >
    </el-pagination>
  </div>
</template>
<script>
import { getUserSpecial } from "@/api/interface/home";
import Speciallist from "@/components/user/speciallist.vue";
import Personlist from "@/components/user/personlist.vue";

export default {
  data() {
    return {
      isActive: 0,
      options: [],
      currentPage: 1,
      total: 0,
    };
  },
  components: {
    Speciallist,
    Personlist,
  },
  created() {
    this.init();
  },
  methods: {
    //查询已订阅专栏列表
    init() {
      getUserSpecial({
        current: this.currentPage,
        size: 12,
        type: this.isActive,
      })
        .then((json) => {
          if (json.success) {
            this.total = json.content.total;
            this.options = json.content.data;
          } else {
            this.$message.error(json.message);
          }
        })
        .catch((json) => {
          this.$message.error(json.message);
        });
    },

    //主题与人物切换
    ChangeTab(index) {
      this.isActive = index;
      this.currentPage = 1;
      this.options = [];
      this.init();
    },

    //分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },

    //跳转专栏广场
    getNewspecial() {
      window.open("http://47.92.202.73/column");
    },
  },
};
</script>
<style scoped>
.usercolumn {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  width: 1600px;
  margin: 0 auto;
}
</style>