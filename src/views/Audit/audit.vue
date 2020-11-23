<template>
  <el-dialog
    class="detail-dialog"
    :close-on-click-modal="false"
    :visible="visible"
    width="900px"
    :before-close="cancel"
  >
    <span slot="title" class="el-dialog__title">创建专栏申请</span>
    <div class="dialog-audit">
      <div class="audit-body">
        <div class="audit-item">
          <span class="audit-span">专栏类型：</span>
          <span>{{ options.type }}</span>
        </div>
        <div class="audit-item">
          <span class="audit-span">专栏名称：</span>
          <span>{{ options.title }}</span>
        </div>
        <div class="audit-item">
          <span class="audit-span">专栏简介：</span>
          <p>{{ options.introduce }}</p>
        </div>
        <div class="audit-item">
          <span class="audit-span">上传封面：</span>
          <img :src="options.imgUrl" class="avatar" />
        </div>
        <div class="audit-item">
          <span class="audit-span">审批：</span>
          <el-radio-group v-model="radio">
            <el-radio :label="0">通过</el-radio>
            <el-radio :label="1">驳回</el-radio>
          </el-radio-group>
        </div>
        <div class="audit-item">
          <span class="audit-span">查看文档：</span>
          <div class="audit-file">
            <svg class="icon icon-s" aria-hidden="true">
              <use :xlink:href="fileIconL(options.file)" />
            </svg>
            <span>{{ options.file }}</span>
          </div>
        </div>
        <div class="audit-item">
          <span class="audit-span">审批意见：</span>
          <el-input
            type="textarea"
            :rows="4"
            v-model.trim="opinion"
            placeholder="请输入审批意见"
          ></el-input>
        </div>
      </div>
      <div class="audit-list">
        <h1><i></i>审批流程</h1>
        <el-timeline>
          <el-scrollbar>
            <el-timeline-item
              v-for="(item, index) in activities"
              :key="index"
              :color="item.active ? '#367fff' : '#E4E7ED'"
              hide-timestamp
            >
              <div v-if="!item.over" class="timeline-item">
                <div :class="{ active: item.active }">
                  {{ item.title }}
                  <i class="box-left"></i>
                </div>
                <p style="color: #666; line-height: 20px">{{ item.date }}</p>
                <p style="color: #333; line-height: 24px">{{ item.text }}</p>
              </div>
              <div v-else class="over">结束审批流程</div>
            </el-timeline-item>
          </el-scrollbar>
        </el-timeline>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" round :disabled="isDisable"
        >确 定
      </el-button>
      <el-button @click="cancel" round>取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { formatList } from "@/utils/index";

export default {
  data() {
    return {
      visible: true,
      isDisable: false,
      radio: 0,
      opinion: "",
      options: {
        title: "发动机类圈子自动变速器档位",
        introduce:
          "对于汽车而言，NVH问题是处处存在的，根据问题产生的来源又可分为发动机NVH、车身NVH和底盘NVH三大部分，进一步还可细分为空气动力NVH、空调系统NVH、道路行驶NVH、制动系统NVH等。",
        sysId: "",
        imgUrl: "",
        file: "电子文档.doc",
        type: "发动机类圈子",
      },
      activities: [
        {
          title: "开始",
          active: true,
          date: "2020-12-06 12:30",
          text: "发起人：刘旭",
        },
        {
          title: "一审",
          active: true,
          date: "2020-12-06 12:30",
          text: "已审：刘旭 审批意见：同意，你做的很好",
        },
        {
          title: "二审",
          active: false,
          date: "2020-12-06 12:30",
          text: "待审：李志勇",
        },
        {
          title: "三审",
          active: false,
          date: "2020-12-06 12:30",
          text: "待审：李志勇",
        },
        {
          over: true,
          active: true,
        },
      ],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {},

    fileIconL(file) {
      const fileFormat = file.substr(file.lastIndexOf(".") + 1);
      for (let key in formatList) {
        for (let index in formatList[key]) {
          if (formatList[key][index] === fileFormat) {
            return `#icon${key}-s`;
          }
        }
      }
    },

    //确定提交
    confirm() {},

    //关闭弹框
    cancel() {},
  },
};
</script>
<style scoped>
@import "./audit.css";
</style>