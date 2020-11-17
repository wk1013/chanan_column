<template>
  <el-container class="container-panel">
    <el-main class="main-panel">
      <div class="body">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">知识专栏</el-breadcrumb-item>
          <el-breadcrumb-item>知识检索结果</el-breadcrumb-item>
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
              <el-option label="知识" value="1"></el-option>
            </el-select>
            <el-button slot="append" type="primary" @click="search"
              >检索</el-button
            >
          </el-input>
        </div>
        <div class="know-select">
          <div class="select-item" style="padding-top: 30px">
            <span class="select-title">主题专栏：</span>
            <div class="select-body">
              <div
                :class="[{ active: isSpecial == index }, 'select-i']"
                @click="SpecialSearch(index, item.id)"
                v-for="(item, index) in specials"
              >
                {{ item.title
                }}<span v-show="index != 0">({{ item.number }})</span>
              </div>
            </div>
            <div
              class="select-icon"
              v-if="!isSpecialOpen"
              @click="SpecialOpen(true)"
              v-show="specialAlls.length > 7"
            >
              <span style="margin-right: 5px">展开</span>
              <svg slot="suffix" aria-hidden="true" class="icon">
                <use xlink:href="#iconzhankaixiajiantou-" />
              </svg>
            </div>
            <div
              class="select-icon"
              v-else
              @click="SpecialOpen(false)"
              v-show="specialAlls.length > 7"
            >
              <span style="margin-right: 5px">收起</span>
              <svg slot="suffix" aria-hidden="true" class="icon">
                <use xlink:href="#iconshouqi" />
              </svg>
            </div>
          </div>
          <div
            class="select-item"
            style="border-top: 1px solid #ddd; padding: 20px 0 10px 0"
          >
            <span class="select-title">人物专栏：</span>
            <div class="select-body">
              <div
                :class="[{ active: isPerson == index }, 'select-i']"
                @click="PersonSearch(index, item.id)"
                v-for="(item, index) in persons"
              >
                {{ item.title
                }}<span v-show="index != 0">({{ item.number }})</span>
              </div>
            </div>
            <div
              class="select-icon"
              v-if="!isPersonOpen"
              @click="PersonOpen(true)"
              v-show="personAlls.length > 7"
            >
              <span style="margin-right: 5px">展开</span>
              <svg slot="suffix" aria-hidden="true" class="icon">
                <use xlink:href="#iconzhankaixiajiantou-" />
              </svg>
            </div>
            <div
              class="select-icon"
              v-else
              @click="PersonOpen(false)"
              v-show="personAlls.length > 7"
            >
              <span style="margin-right: 5px">收起</span>
              <svg slot="suffix" aria-hidden="true" class="icon">
                <use xlink:href="#iconshouqi" />
              </svg>
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
          <knowlist :options="knowData"></knowlist>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="total"
            background
            hide-on-single-page
            style="text-align: center; margin-top: 30px"
          >
          </el-pagination>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { SearchKnowledge } from "@/api/interface/home";
import Knowlist from "@/components/dialog/knowlist.vue";

export default {
  data() {
    return {
      inputText: this.$route.query.inputText,
      select: "1",
      currentPage: 1,
      total: 0,
      isSpecial: 0,
      isSpecialOpen: false,
      specials: [],
      specialAlls: [
        {
          title: "不限",
          number: "",
          id: "",
        },
      ],
      isPerson: 0,
      isPersonOpen: false,
      persons: [],
      personAlls: [
        {
          title: "不限",
          number: "",
          id: "",
        },
      ],
      knowData: [],
      isHot: true,
      sysid: "",
    };
  },
  created() {
    this.init();
  },
  components: {
    Knowlist,
  },
  methods: {
    init() {
      SearchKnowledge({
        title: this.inputText,
        start: 1,
        length: 10,
        order: "KRM_UPLOADTIME ASC",
        sysId: "",
      })
        .then((json) => {
          if (json.success) {
            this.knowData = json.content.contentList;
            this.total = json.content.total;
            const data = json.content.groupList;
            if (data.length > 0) {
              data.map((item) => {
                if (item.type == 0) {
                  this.specialAlls.push({
                    title: item.name,
                    number: item.count,
                    id: item.sysId,
                  });
                } else {
                  this.personAlls.push({
                    title: item.name,
                    number: item.count,
                    id: item.sysId,
                  });
                }
              });
            }
            this.specials = this.specialAlls.slice(0, 7);
            this.persons = this.personAlls.slice(0, 9);
          } else {
            this.$message.error(json.message);
          }
        })
        .catch((json) => {
          this.$message.error(json.message);
        });
    },

    //单栏查询
    getKnowledge() {
      SearchKnowledge({
        title: this.inputText,
        start: this.currentPage,
        length: 10,
        order: this.isHot ? "KRM_UPLOADTIME ASC" : "KRM_UPLOADTIME DESC",
        sysId: this.sysid,
      })
        .then((json) => {
          if (json.success) {
            this.knowData = json.content.contentList;
            this.total = json.content.total;
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
      if (this.inputText == "") {
        this.$message.warning("请输入搜索内容");
        return false;
      }
      const query = JSON.parse(JSON.stringify(this.$route.query));
      query.inputText = this.inputText;
      this.$router.replace({ path: this.$route.path, query });
      this.isSpecial = 0;
      this.isSpecialOpen = false;
      this.isPerson = 0;
      this.isPersonOpen = false;
      this.currentPage = 1;
      this.specialAlls = [
        {
          title: "不限",
          number: "",
          id: "",
        },
      ];
      this.personAlls = [
        {
          title: "不限",
          number: "",
          id: "",
        },
      ];
      this.init();
    },

    //分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getKnowledge();
    },

    //专题查询
    SpecialSearch(index, id) {
      if (this.isSpecial == index) {
        return false;
      }
      this.isPerson = 0;
      this.isSpecial = index;
      this.getColumn(id);
    },

    //展开及收起专题专栏
    SpecialOpen(index) {
      this.isSpecialOpen = index;
      if (index) {
        this.specials = this.specialAlls;
      } else {
        this.specials = this.specialAlls.slice(0, 7);
      }
    },

    //人物查询
    PersonSearch(index, id) {
      if (this.isPerson == index) {
        return false;
      }
      this.isPerson = index;
      this.isSpecial = 0;
      this.getColumn(id);
    },

    //展开及收起人物专栏
    PersonOpen(index) {
      this.isPersonOpen = index;
      if (index) {
        this.persons = this.personAlls;
      } else {
        this.persons = this.personAlls.slice(0, 9);
      }
    },

    //单个专栏查询
    getColumn(id) {
      this.isHot = true;
      this.currentPage = 1;
      this.sysid = id;
      this.getKnowledge();
    },

    //按时间或者热度排序
    getHot() {
      this.isHot = !this.isHot;
      this.currentPage = 1;
      this.getKnowledge();
    },
  },
};
</script>