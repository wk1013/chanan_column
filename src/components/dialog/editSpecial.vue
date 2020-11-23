<template>
  <el-dialog
    class="detail-dialog"
    :close-on-click-modal="false"
    :visible="visible"
    width="700px"
    :before-close="cancel"
  >
    <span slot="title" class="el-dialog__title">编辑专栏</span>
    <div class="dialog-con1">
      <div class="dialog-item">
        <span class="font-s14 color3">专栏名称：</span>
        <el-input v-model.trim="title" placeholder="请输入内容"></el-input>
      </div>
      <div class="dialog-item" style="align-items: baseline">
        <span class="font-s14 color3">专栏简介：</span>
        <el-input
          type="textarea"
          :rows="4"
          v-model.trim="introduce"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="dialog-item" style="align-items: start; margin-bottom: 0">
        <span class="font-s14 color3">上传封面：</span>
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :action="action"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" round :disabled="isDisable"
        >确 定</el-button
      >
      <el-button @click="cancel" round>取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { EditSpecialDetail } from "@/api/interface/home";
import { EditColumn } from "@/api/interface/column";

export default {
  data() {
    return {
      title: "",
      introduce: "",
      id: "",
      imageUrl: "",
      isDisable: false,
      action: "/column/file/upload",
    };
  },
  watch: {
    visible(val) {},
    options(val) {
      this.title = val.title;
      this.introduce = val.introduce;
      this.id = val.sysId;
      this.imageUrl = val.imgUrl;
    },
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    options: {
      default() {
        return {
          title: "",
          introduce: "",
          sysId: "",
          imgUrl: "",
        };
      },
      type: Object,
    },
    editflag: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    //上传封面
    handleAvatarSuccess(file) {
      if (!file.success) {
        this.$message.error("上传封面失败");
        return;
      }
      this.imageUrl = file.message;
    },
    beforeAvatarUpload(file) {
      const formatList = ["image/jpeg", "image/png", "image/jpg"];
      const isJPG = formatList.indexOf(file.type) > -1;
      const isLt2M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$message.error("上传封面只能是 JPG,PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传封面大小不能超过 4MB!");
      }
      return isLt2M && isJPG;
    },

    //提交审核
    confirm() {
      if (this.title == "") {
        this.$message.warning("请输入专栏名称");
        return false;
      }
      if (this.introduce == "") {
        this.$message.warning("请输入专栏简介");
        return false;
      }
      let params = {};
      this.isDisable = true;
      if (this.editflag) {
        params = {
          columnType: 0,
          sysId: this.id,
          title: this.title,
          introduce: this.introduce,
          imgUrl: this.imageUrl,
          updateUserId: "",
          updateUserName: "",
        };
        EditSpecialDetail(params)
          .then((json) => {
            this.isDisable = false;
            if (json.success) {
              this.$message.success("编辑专栏成功");
              this.$emit("confirm");
            } else {
              this.$message.error(json.message);
            }
          })
          .catch((json) => {
            this.isDisable = false;
            this.$message.error(json.message);
          });
      } else {
        params = {
          columnType: 0,
          sysId: this.id,
          title: this.title,
          introduce: this.introduce,
          imgUrl: this.imageUrl,
        };
        EditColumn(params)
          .then((json) => {
            this.isDisable = false;
            if (json.success) {
              this.$message.success("编辑专栏成功");
              this.$emit("confirm");
            } else {
              this.$message.error(json.message);
            }
          })
          .catch((json) => {
            this.isDisable = false;
            this.$message.error(json.message);
          });
      }
    },

    //关闭弹框
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>