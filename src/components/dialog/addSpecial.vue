<template>
  <el-dialog
    class="detail-dialog"
    :close-on-click-modal="false"
    :visible="visible"
    width="700px"
    :before-close="cancel"
  >
    <span slot="title" class="el-dialog__title">新建专栏</span>
    <div class="dialog-con1">
      <div class="dialog-radio">
        <span class="font-s14 color3" style="margin-right: 25px"
          >知识专栏：</span
        >
        <el-radio-group v-model="radio" @change="change">
          <el-radio :label="0">主题专栏</el-radio>
          <el-radio :label="1">人物专栏</el-radio>
        </el-radio-group>
      </div>
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
      <div class="dialog-item" v-show="personVisible">
        <span class="font-s14 color3">擅长领域：</span>
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
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" round :disabled="isDisable">{{
        addflag ? "确 定" : "提交审核"
      }}</el-button>
      <el-button @click="cancel" round>取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addSpecial } from "@/api/interface/home";
import { addColumn } from "@/api/interface/column";

export default {
  data() {
    return {
      title: "",
      introduce: "",
      radio: 0,
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      personVisible: false,
      imageUrl: "",
      action: "/column/file/upload",
      department: "技术部门",
      isDisable: false,
    };
  },
  watch: {
    visible(val) {},
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    addflag: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    //新建主题或者人物专栏切换
    change(value) {
      this.personVisible = !this.personVisible;
      this.getClear(value);
    },

    //初始化数据
    getClear(value) {
      this.radio = value;
      this.title = "";
      this.introduce = "";
      this.dynamicTags = [];
      this.imageUrl = "";
    },

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
      if (this.imageUrl == "") {
        this.$message.warning("请上传封面图片");
        return false;
      }
      let params = {
        columnType: this.radio,
        title: this.title,
        introduce: this.introduce,
        imgUrl: this.imageUrl,
        createUserId: "",
        createUserName: "",
        createUserDepart: "",
      };
      if (this.radio == 1) {
        params.themeName = this.dynamicTags ? this.dynamicTags.toString() : "";
      }
      this.isDisable = true;
      if (this.addflag) {
        addColumn(params)
          .then((json) => {
            this.isDisable = false;
            if (json.success) {
              this.$message.success("创建专栏成功");
              this.personVisible = false;
              this.getClear(0);
              this.$emit("confirm", this.radio);
            } else {
              this.$message.error(json.message);
            }
          })
          .catch((json) => {
            this.isDisable = false;
            this.$message.error(json.message);
          });
      } else {
        addSpecial(params)
          .then((json) => {
            this.isDisable = false;
            if (json.success) {
              this.$message.success("创建专栏成功");
              this.personVisible = false;
              this.getClear(0);
              this.$emit("confirm", this.radio);
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
      this.personVisible = false;
      this.getClear(0);
      this.$emit("cancel");
    },
  },
};
</script>