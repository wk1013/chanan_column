<template>
  <el-dialog
    class="detail-dialog"
    :close-on-click-modal="false"
    :visible="true"
    width="900px"
    :before-close="cancel"
  >
    <span slot="title" class="el-dialog__title">专栏审核</span>
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
        <h1><i />审批流程</h1>
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
                  <i class="box-left" />
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
      activities: [],
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
              if (json.content) {
                let data = [];
                data.push({
                  title: "开始",
                  active: true,
                  date: json.content.startTime,
                  text: `发起人：${json.content.sponsor}`,
                });
                data.push({
                  title: "一审",
                  active: json.content.auditStatus == 0 ? false : true,
                  date:
                    json.content.auditStatus == 0 ? "" : json.content.endTime,
                  text:
                    json.content.auditStatus == 0
                      ? "待审：管理员"
                      : `已审：${json.content.reviewer} 审批意见：${json.content.opinions}`,
                });
                if (
                  json.content.auditStatus == 1 ||
                  json.content.auditStatus == 2
                ) {
                  data.push({
                    over: true,
                    active: true,
                  });
                }
                this.activities = data;
              }
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
              if (json.content) {
                let data = [];
                data.push({
                  title: "开始",
                  active: true,
                  date: json.content.startTime,
                  text: `发起人：${json.content.sponsor}`,
                });
                data.push({
                  title: "一审",
                  active: json.content.auditStatus == 0 ? false : true,
                  date:
                    json.content.auditStatus == 0 ? "" : json.content.endTime,
                  text:
                    json.content.auditStatus == 0
                      ? "待审：管理员"
                      : `已审：${json.content.reviewer} 审批意见：${json.content.opinions}`,
                });
                if (
                  json.content.auditStatus == 1 ||
                  json.content.auditStatus == 2
                ) {
                  data.push({
                    over: true,
                    active: true,
                  });
                }
                this.activities = data;
              }
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