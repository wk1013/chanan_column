<template>
  <div class="main">
    <top type="common" />
    <div class="container-panel">
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
        <div class="know-list">
          <div class="flex kl-title">
            <h1>已发布知识</h1>
            <div style="padding-bottom: 14px">
              <el-input
                size="small"
                placeholder="请输入内容"
                v-model.trim="inputText"
                class="input-with-detail"
                @keyup.13.native="search"
              >
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
          </div>
          <div style="padding-top: 20px; padding-bottom: 35px">
            <el-table
              :data="tableData"
              style="width: 100%"
              header-cell-class-name="know-table"
            >
              <el-table-column label="序号" width="100" align="center">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column label="篇名" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span
                    class="font-s14 color3 kt-title"
                    style="cursor: pointer"
                    @click="getKnowDetail(scope.row.bdname, scope.row.guid)"
                    v-html="showData(scope.row.title)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="上传人" width="200" align="center">
                <template slot-scope="scope">
                  <span class="font-s14 color3">{{
                    scope.row.uploadName
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交时间" width="200" align="center">
                <template slot-scope="scope">
                  <span class="font-s14 color3">{{
                    handleDate(scope.row.createTime)
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <span
                    class="delete"
                    title="删除"
                    @click.stop="delTask(scope.row)"
                    style="cursor: pointer"
                    ><svg slot="suffix" aria-hidden="true" class="icon color6">
                      <use xlink:href="#icondelete"></use></svg
                  ></span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="total"
            background
            hide-on-single-page
            style="text-align: center"
          />
        </div>
      </div>
    </div>
    <common-footer />
  </div>
</template>
<script>
import { SearchKnowledge, DeleteKnow, DeleteNum } from "@/api/interface/home";
import { showDate, publiceUrl, showData } from "@/utils/index.js";

export default {
  data() {
    return {
      inputText: "",
      currentPage: 1,
      total: 0,
      title: this.$route.query.title,
      id: this.$route.query.id,
      tableData: [],
    };
  },
  created() {
    this.init();
  },
  components: {
    Top: window.TopCommonFooter.Top,
    CommonFooter: window.TopCommonFooter.CommonFooter,
  },
  methods: {
    handleDate: showDate,

    //检索词标红
    showData(text) {
      return text
        .replace(/###/g, '<span style="color:red">')
        .replace(/\$\$\$/g, "</span>");
    },

    //查询专栏知识
    init() {
      SearchKnowledge({
        title: this.inputText,
        start: this.currentPage,
        length: 10,
        order: "KRM_UPLOADTIME DESC",
        sysId: this.id,
      })
        .then((json) => {
          if (json.success) {
            this.tableData = json.content.contentList;
            this.total = json.content.total;
          } else {
            this.$message.error(json.message);
          }
        })
        .catch((json) => {
          this.$message.error(json.message);
        });
    },

    //搜索专栏知识
    search() {
      this.currentPage = 1;
      this.init();
    },

    //删除知识
    delTask(data) {
      this.$confirm("确定将该知识删除?", "删除知识", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DeleteKnow({
            knowledgeId: data.guid,
          })
            .then((json) => {
              if (json.success) {
                this.$message.success("删除知识成功");
                this.init();
                DeleteNum({
                  specialColumnId: this.id,
                  type: 0,
                })
                  .then((json) => {
                    if (!json.success) {
                      this.$message.error(json.message);
                    }
                  })
                  .catch((json) => {
                    this.$message.error(json.message);
                  });
              } else {
                this.$message.error(json.message);
              }
            })
            .catch((json) => {
              this.$message.error(json.message);
            });
        })
        .catch(() => {});
    },

    //分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },

    //跳转知识页面
    getKnowDetail(tableName, knowledgeId) {
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