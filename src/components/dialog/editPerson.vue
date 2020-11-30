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
        <el-input v-model.trim="title" placeholder="请输入专栏名称" />
      </div>
      <div class="dialog-item" style="align-items: flex-start">
        <span class="font-s14 color3">专栏简介：</span>
        <el-input
          type="textarea"
          :rows="4"
          v-model.trim="introduce"
          placeholder="请输入专栏简介"
        />
      </div>
      <div class="dialog-item">
        <span class="font-s14 color3">擅长领域：</span>
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          effect="plain"
        >
          {{ tag }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showInput"
          style="margin-right: 10px"
          >添加新领域</el-button
        >
      </div>
      <div class="dialog-item" style="align-items: flex-start">
        <span class="font-s14 color3">上传封面：</span>
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :action="action"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
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
      value: "",
      introduce: "",
      id: "",
      imgUrl: "",
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      isDisable: false,
      action: "/column/file/upload",
    };
  },
  watch: {
    visible(val) {},
    options(val) {
      this.title = val.title;
      this.value = val.title;
      this.introduce = val.introduce;
      this.id = val.sysId;
      this.dynamicTags = val.themeName ? val.themeName.split(",") : [];
      this.imgUrl = val.imgUrl;
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
          themeName: "",
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
    //添加擅长领域
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    //上传封面
    handleAvatarSuccess(file) {
      if (!file.success) {
        this.$message.error("上传封面失败");
        return;
      }
      this.imgUrl = file.message;
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
      let params = {
        columnType: 1,
        sysId: this.id,
        title: this.title == this.value ? "" : this.title,
        introduce: this.introduce,
        themeName: this.dynamicTags ? this.dynamicTags.toString() : "",
        imgUrl: this.imgUrl,
      };
      this.isDisable = true;
      if (this.editflag) {
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