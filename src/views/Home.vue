<template>
  <el-container class="container-panel">
    <el-main class="main-panel">
      <div class="body">
        <div class="header flex">
          <div class="flex">
            <h1 class="font-s24 color3">知识专栏</h1>
            <div class="flex" style="margin-left: 40px">
              <div
                :class="[
                  { active: isActive == 0 },
                  'head-item',
                  'font-s16',
                  'color3',
                ]"
                @click="ChangeTab(0)"
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
          <div class="flex">
            <div style="margin-right: 15px">
              <el-input
                size="small"
                placeholder="请输入内容"
                v-model.trim="inputText"
                class="input-with-select"
                @keyup.13.native="search"
              >
                <el-select v-model="select" slot="prepend" size="small">
                  <el-option label="知识" value="1"></el-option>
                  <el-option label="主题" value="2"></el-option>
                  <el-option label="人物" value="3"></el-option>
                </el-select>
                <svg
                  slot="suffix"
                  aria-hidden="true"
                  class="icon icon-search"
                  @click="search"
                >
                  <use xlink:href="#iconsearch" />
                </svg>
              </el-input>
            </div>
            <div class="button" @click="getNewspecial()">
              <svg slot="suffix" aria-hidden="true" class="icon">
                <use xlink:href="#iconadd" />
              </svg>
              创建专栏
            </div>
          </div>
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
      <add-special
        :visible="visible"
        @confirm="confirm"
        @cancel="cancel"
      ></add-special>
    </el-main>
  </el-container>
</template>
<script>
import { getSpecial } from "@/api/interface/home";
import AddSpecial from "@/components/dialog/addSpecial.vue";
import Speciallist from "@/components/dialog/speciallist.vue";
import Personlist from "@/components/dialog/personlist.vue";

export default {
  data() {
    return {
      isActive: 0,
      inputText: "",
      select: "1",
      options: [],
      currentPage: 1,
      total: 0,
      visible: false,
    };
  },
  watch: {
    select(value) {
      this.select = value;
    },
  },
  created() {
    this.init();
  },
  components: {
    AddSpecial,
    Speciallist,
    Personlist,
  },
  methods: {
    init() {
      getSpecial({
        current: this.currentPage,
        size: 12,
        type: this.isActive,
        search: "",
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

    //初始化获取数据
    getClear(index) {
      this.isActive = index;
      this.currentPage = 1;
      this.options = [];
      this.init();
    },

    //专题与人物切换
    ChangeTab(index) {
      this.getClear(index);
    },

    //搜索
    search() {
      if (this.inputText == "") {
        this.$message.warning("请输入搜索内容");
        return false;
      }
      if (this.select == "1") {
        this.$router.push({
          path: "/know",
          query: {
            inputText: this.inputText,
          },
        });
      } else if (this.select == "2") {
        this.$router.push({
          path: "/specialSearch",
          query: {
            inputText: this.inputText,
          },
        });
      } else {
        this.$router.push({
          path: "/personSearch",
          query: {
            inputText: this.inputText,
          },
        });
      }
    },

    //分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },

    //创建专栏
    getNewspecial() {
      this.visible = true;
    },

    //提交新建专栏审核
    confirm(index) {
      this.visible = false;
      this.getClear(index);
    },

    //关闭新建专栏弹框
    cancel() {
      this.visible = false;
    },
  },
};
</script>