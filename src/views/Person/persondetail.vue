<template>
  <div class="main">
    <top type="common" />
    <div class="container-panel">
      <div class="body">
        <div class="header flex">
          <h1
            class="font-s24 color3 blod"
            @click="$router.replace({ path: '/' })"
            style="cursor: pointer"
          >
            知识专栏
          </h1>
          <div>
            <el-input
              size="small"
              placeholder="搜索本专栏知识"
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
        <div class="detail">
          <img class="pd-img" :src="detail.imgUrl" />
          <div class="person-header">
            <div class="dh-title flex">
              <div class="flex">
                <h1>{{ detail.title }}</h1>
                <svg aria-hidden="true" slot="suffix" class="icon icon-person">
                  <use xlink:href="#iconperson" />
                </svg>
              </div>
              <div
                v-if="!detail.isSub"
                class="subscribe"
                @click="getSubscribe(true)"
              >
                <svg aria-hidden="true" slot="suffix" class="icon">
                  <use xlink:href="#iconadd" />
                </svg>
                订阅
              </div>
              <div
                class="ifsub"
                v-if="detail.isSub"
                @mouseenter="enter()"
                @mouseleave="enter()"
                @click="getSubscribe(false)"
              >
                {{ seen ? "取消订阅" : "已订阅" }}
              </div>
            </div>
            <p class="font-s14 color6 linheight" style="margin: 10px 0">
              简介：{{ detail.introduce }}
            </p>
            <p class="font-s14 color6" style="margin-bottom: 10px">
              擅长领域：{{ detail.themeName }}
            </p>
            <div>
              <span class="special-span font-s12 color9"
                >知识{{ detail.knowledgeNum }}</span
              >
              <span class="special-span font-s12 color9"
                >订阅{{ detail.subscribeNum }}</span
              >
              <span class="special-span font-s12 color9"
                >浏览{{ detail.browseNum }}</span
              >
              <span class="font-s12 color9"
                >更新{{ handleDate(detail.updateDate) }}</span
              >
            </div>
            <div
              v-show="isUser"
              class="dh-footer flex"
              style="margin-top: 15px"
            >
              <div class="dh-button" @click="getUpload(detail.title)">
                <svg aria-hidden="true" class="icon" style="margin-right: 5px">
                  <use xlink:href="#iconupload" />
                </svg>
                上传知识
              </div>
              <span @click="getEdit">编辑专栏</span>
              <span @click="getPower">权限变更</span>
              <span @click="getKnow(detail.title)">专栏文档管理</span>
              <span @click="Delete">删除</span>
            </div>
          </div>
        </div>
        <div class="know-body">
          <div class="body-title">
            <div class="flex bt-l">
              <span class="font-s16 color3">排序方式：</span>
              <div class="active flex font-s16 color3" @click="getHot()">
                <span>时间</span>
                <svg v-if="isHot" slot="suffix" aria-hidden="true" class="icon">
                  <use xlink:href="#iconup1" />
                </svg>
                <svg v-else slot="suffix" aria-hidden="true" class="icon">
                  <use xlink:href="#icondown1" />
                </svg>
              </div>
            </div>
            <div class="font-s16 color9">
              共<span>{{ total }}</span
              >条结果
            </div>
          </div>
          <knowlist :options="knowData" v-if="!loading" />
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="total"
            background
            hide-on-single-page
            style="text-align: center; margin-top: 40px"
          />
        </div>
        <edit-person
          :visible="editvisible"
          :options="editdetail"
          :editflag="true"
          @confirm="Editconfirm"
          @cancel="cancel"
        />
        <check-members
          ref="members"
          :firstLevelDeparts="firstLevelDeparts"
          :centerMembers="centerMembers"
          :props="defaultProps"
          :language="language"
          :disabled-list="disabledList"
          :max-length="300"
          :forward="forward"
          @overflow="overflow"
          @confirm="confirm"
          @getChildrenDepart="getChildrenDepart"
          @searchDepartByName="searchDepartByName"
          @getDepartMember="getDepartMember"
          @loadMoreMember="loadMoreMember"
        />
      </div>
    </div>
    <common-footer />
  </div>
</template>
<script>
import {
  getSpecialDetail,
  getSubscribe,
  DeleteSubscribe,
  SearchKnowledge,
  DeleteColumn,
} from "@/api/interface/home";
import Knowlist from "@/components/dialog/knowlist.vue";
import EditPerson from "@/components/dialog/editPerson.vue";
import CheckMembers from "@/utils/check-members.min.js";
import selectMember from "@/utils/selectMember.js";
import { showDate } from "@/utils/index.js";

export default {
  data() {
    return {
      seen: false,
      id: this.$route.query.id,
      inputText: "",
      currentPage: 1,
      total: 0,
      knowData: [],
      detail: {},
      editdetail: {},
      editvisible: false,
      isDisable: false,
      isHot: false,
      isUser: false,
      loading: true,
    };
  },
  mixins: [selectMember],
  components: {
    Knowlist,
    EditPerson,
    CheckMembers,
  },
  created() {
    this.init();
    this.getKnowledge();
  },
  methods: {
    handleDate: showDate,

    //查询专栏详情
    init() {
      getSpecialDetail({
        id: this.id,
      })
        .then((json) => {
          if (json.success) {
            this.detail = json.content;
            const createUserName = json.content.createUserName;
            const username =
              sessionStorage.getItem("UserInfo") &&
              JSON.parse(sessionStorage.getItem("UserInfo")).userName;
            if (createUserName == username) {
              this.isUser = true;
            }
          } else {
            this.$message.error(json.message);
          }
        })
        .catch((json) => {
          this.$message.error(json.message);
        });
    },

    //获取专栏知识列表
    getKnowledge() {
      SearchKnowledge({
        title: this.inputText,
        start: this.currentPage,
        length: 10,
        order: this.isHot ? "KRM_UPLOADTIME ASC" : "KRM_UPLOADTIME DESC",
        sysId: this.id,
      })
        .then((json) => {
          this.loading = false;
          if (json.success) {
            this.knowData = json.content.contentList;
            this.total = json.content.total;
          } else {
            this.$message.error(json.message);
          }
        })
        .catch((json) => {
          this.loading = false;
          this.$message.error(json.message);
        });
    },

    //已订阅的专栏鼠标移入移出时的操作
    enter(index) {
      this.seen = !this.seen;
    },

    //订阅或者取消订阅专栏
    getSubscribe(flag) {
      if (this.isDisable) {
        return false;
      } else {
        this.isDisable = true;
        if (flag) {
          getSubscribe({
            specialColumnId: this.id,
          })
            .then((json) => {
              this.isDisable = false;
              if (json.success) {
                this.$message.success("订阅成功");
                this.init();
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
            specialColumnId: this.id,
          })
            .then((json) => {
              this.isDisable = false;
              if (json.success) {
                this.$message.success("取消订阅成功");
                this.init();
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

    //搜索本专栏知识
    search() {
      this.isHot = false;
      this.currentPage = 1;
      this.getKnowledge();
    },

    //按时间排序
    getHot(flag) {
      this.isHot = !this.isHot;
      this.currentPage = 1;
      this.getKnowledge();
    },

    //分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getKnowledge();
    },

    //打开编辑弹框
    getEdit() {
      this.editdetail = this.detail;
      this.editvisible = true;
    },

    //提交编辑
    Editconfirm(params) {
      this.editvisible = false;
      this.editdetail = {};
      this.init();
    },

    //关闭编辑弹框
    cancel() {
      this.editvisible = false;
      this.editdetail = {};
    },

    //专栏文档管理
    getKnow(name) {
      const id = this.$route.query.id;
      this.$router.push({
        path: "/knowledgeList",
        query: {
          id: id,
          title: name,
        },
      });
    },

    //知识上传
    getUpload(name) {
      this.$router.push({
        path: "/knowledgeupload",
        query: {
          id: this.id,
          title: name,
          type: 1,
        },
      });
    },

    //删除专栏
    Delete() {
      this.$confirm("确定将该专栏删除?", "删除专栏", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DeleteColumn({
            sysId: this.id,
          })
            .then((json) => {
              if (json.success) {
                this.$message.success("删除专栏成功");
                this.$router.replace({ path: "/" });
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

    //获取可访问专栏的人员列表
    getPower() {
      this.addMember(this.id);
    },
  },
};
</script>