<template>
  <el-container class="container-panel">
    <el-main class="main-panel">
      <div class="body">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }" replace
            >知识专栏</el-breadcrumb-item
          >
          <el-breadcrumb-item>主题检索结果</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="search">
          <el-input
            placeholder="请输入内容"
            v-model.trim="inputText"
            class="input-with-search"
            @keyup.13.native="search"
          >
            <el-select
              v-model="select"
              disabled
              slot="prepend"
              placeholder="请选择"
            >
              <el-option label="主题" value="1"></el-option>
            </el-select>
            <el-button slot="append" type="primary" @click="search"
              >检索</el-button
            >
          </el-input>
        </div>
        <speciallist :options="options" :inputKey="inputText" @confirm="init">
        </speciallist>
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
    </el-main>
  </el-container>
</template>
<script>
import { getSpecial } from "@/api/interface/home";
import Speciallist from "@/components/dialog/speciallist.vue";

export default {
  data() {
    return {
      inputText: this.$route.query.inputText,
      options: [],
      currentPage: 1,
      total: 0,
      select: "1",
    };
  },
  created() {
    this.init();
  },
  components: {
    Speciallist,
  },
  methods: {
    //查询专栏列表
    init() {
      getSpecial({
        current: this.currentPage,
        size: 12,
        type: 0,
        search: this.inputText,
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

    //搜索
    search() {
      const query = JSON.parse(JSON.stringify(this.$route.query));
      query.inputText = this.inputText;
      this.$router.replace({ path: this.$route.path, query });
      this.options = [];
      this.currentPage = 1;
      this.init();
    },

    //分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
  },
};
</script>