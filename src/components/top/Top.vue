<template>
  <div :class="['top', `${type}-top`]">
    <div class="wrapper">
      <div class="logo">
        <img :src="logo" />
        <div class="divide-line"></div>
        <span class="logo-name">研发知识平台</span>
      </div>
      <div class="navs">
        <ul>
          <li class="active"><a href="">首页</a></li>
          <li><a href="#">圈子</a></li>
          <li><a href="#">我的智谷</a></li>
          <li><a href="#">上传知识</a></li>
        </ul>
      </div>
      <div class="ca-search">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{ currentTopic }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changeTopic('知识')"
              >知识</el-dropdown-item
            >
            <el-dropdown-item @click.native="changeTopic('圈子')"
              >圈子</el-dropdown-item
            >
            <el-dropdown-item @click.native="changeTopic('同事')"
              >同事</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <div class="divide-line"></div>
        <div class="search-box">
          <input
            type="text"
            placeholder="查知识/搜圈子/找同事"
            @keyup.enter="toSearch"
            v-model="keyword"
          />
          <svg class="iconsearch" aria-hidden="true" @click="toSearch">
            <use xlink:href="#iconsearch"></use>
          </svg>
        </div>
      </div>
      <div class="personal-info">
        <div class="avatar-box">
          <img
            :src="
              userInfo.profilePicture ? userInfo.profilePicture : defaultAvatar
            "
          />
        </div>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            欢迎您，{{ userInfo.userName
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="el-dropdown-items">
            <el-dropdown-item>
              <a href="#">
                <span class="suggestion">
                  <svg class="iconfont iconsearch" aria-hidden="true">
                    <use xlink:href="#iconopinion"></use>
                  </svg>
                </span>
                反馈建议
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="#">
                <span class="backstage">
                  <svg class="iconfont iconsearch" aria-hidden="true">
                    <use xlink:href="#iconadmin"></use>
                  </svg>
                </span>
                后台管理
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a @click="logOut">
                <span class="logout">
                  <svg class="iconfont iconsearch" aria-hidden="true">
                    <use xlink:href="#icondropout"></use>
                  </svg>
                </span>
                退出
              </a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserInfo } from "@/api/interface/home";

export default {
  name: "top",
  props: ["type"], // type值为通用顶部'common'或者透明顶部'transparent'
  data() {
    return {
      logo: require("../../assets/img/logo.png"),
      defaultAvatar: require("../../assets/img/default-avatar.png"),
      keyword: "",
      currentTopic: "知识",
      userInfo: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const userInfoStorage = sessionStorage.getItem("UserInfo");
      if (userInfoStorage) {
        this.userInfo = JSON.parse(userInfoStorage);
      } else {
        this.getUser();
      }
    },

    //获取用户信息并保存
    getUser() {
      getUserInfo({})
        .then((json) => {
          if (json.success) {
            const data = json.content;
            this.userInfo = data;
            sessionStorage.setItem("UserInfo", JSON.stringify(data));
          }
        })
        .catch((json) => {
          this.$message.error(json.message);
        });
    },

    // 选择主题
    changeTopic(topic) {
      this.currentTopic = topic;
    },

    // 跳转到搜索页
    toSearch() {
      window.location.href = `http://47.92.202.73/sso/login?topic=${this.currentTopic}&keyword=${this.keyword}`; // 跳转示例
    },

    // 退出
    logOut() {
      sessionStorage.removeItem("UserInfo");
      window.location.href =
        "http://47.92.202.73/sso/login?returnUrl=http://47.92.202.73/#/";
    },
  },
};
</script>
<style scoped>
@import "./top.css";
</style>
