<template>
  <el-dialog
    class="detail-dialog"
    :close-on-click-modal="false"
    :visible="true"
    width="900px"
    :before-close="cancel"
  >
    <span slot="title" class="el-dialog__title">创建专栏申请</span>
    <div class="dialog-audit">
      <div class="audit-body">
        <div class="audit-item">
          <span class="audit-span">专栏类型：</span>
          <span>{{ options.columnType == 0 ? "主题专栏" : "人物专栏" }}</span>
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
          <span class="audit-span">专栏封面：</span>
          <img :src="options.imgUrl" class="avatar" />
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
                <p style="color: #333; line-height: 24px; padding-right: 10px">
                  {{ item.text }}
                </p>
              </div>
              <div v-else class="over">结束审批流程</div>
            </el-timeline-item>
          </el-scrollbar>
        </el-timeline>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { getMyInitiative, getMyHandled } from "@/api/interface/user";

export default {
  data() {
    return {
      id: this.$route.query.sysId,
      type: this.$route.query.auditType,
      isDisable: false,
      options: {},
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
          title: "四审",
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
    //获取待办详情
    init() {
      if (this.type == 0) {
        //我的发起
        getMyInitiative({
          sysId: this.id,
        })
          .then((json) => {
            if (json.success) {
              this.options = json.content;
            } else {
              this.$message.error(json.message);
            }
          })
          .catch((json) => {
            this.$message.error(json.message);
          });
      } else {
        //我的已处理
        getMyHandled({
          sysId: this.id,
        })
          .then((json) => {
            if (json.success) {
              this.options = json.content;
            } else {
              this.$message.error(json.message);
            }
          })
          .catch((json) => {
            this.$message.error(json.message);
          });
      }
    },

    //关闭弹框
    cancel() {
      var info = { status: "cancel" };
      window.parent.postMessage(info, "*");
    },
  },
};
</script>
<style scoped>
@import "./audit.css";
</style>