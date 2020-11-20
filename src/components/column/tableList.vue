<template>
  <el-table
    ref="singleTable"
    :data="tableData"
    :header-cell-style="headerStyle"
    :row-class-name="rowClassName"
    :row-style="rowStyle"
  >
    <el-table-column label="序号" align="center" width="100">
      <template slot-scope="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column prop="title" label="专栏名称" show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="createUserName"
      label="创建人"
      align="center"
      width="100"
    >
    </el-table-column>
    <el-table-column label="创建时间" align="center" width="200">
      <template slot-scope="scope">
        <span>{{ handleDate(scope.row.createDate) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="knowledgeNum"
      label="知识数"
      align="center"
      width="100"
    >
    </el-table-column>
    <el-table-column
      prop="subscribeNum"
      label="订阅人数"
      align="center"
      width="100"
    >
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button
          v-if="scope.row.isTopping == 1"
          @click="cancelTSV(scope.row, 0)"
          type="text"
          size="small"
          >取消置顶</el-button
        >
        <el-button
          v-else
          @click="handleTSV(scope.row, 0)"
          type="text"
          size="small"
          >置顶</el-button
        >
        <el-button @click="Edit(scope.row)" type="text" size="small"
          >编辑</el-button
        >
        <el-button
          @click="Delete(scope.row, scope.$index)"
          type="text"
          size="small"
          >删除</el-button
        >
        <el-button
          v-show="isActive == 1 && scope.row.isVip == 0"
          @click="handleTSV(scope.row, 1)"
          type="text"
          size="small"
          >标记大V</el-button
        >
        <el-button
          v-show="isActive == 1 && scope.row.isVip == 1"
          @click="cancelTSV(scope.row, 1)"
          type="text"
          size="small"
          >取消大V</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import {
  getTSV,
  getCancelTSV,
  getOrder,
  getColumnItem,
} from "@/api/interface/column";
import { DeleteColumn } from "@/api/interface/home";
import { showDate } from "@/utils/index.js";

export default {
  data() {
    return {
      headerStyle: {
        height: "50px",
        background: "#498be3",
        fontSize: "16px",
        color: "#ffffff",
        fontWeight: "500",
      },
      rowStyle: {
        height: "44px",
        fontFamily: "MicrosoftYaHeiUI",
        fontSize: "14px",
        color: "#323232",
        backgroundColor: "",
      },
      isDisable: false,
    };
  },
  props: {
    tableData: {
      default() {
        return [];
      },
      type: Array,
    },
    isActive: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    handleDate: showDate,

    rowClassName({ row, rowIndex }) {
      if ((rowIndex + 1) % 2 === 0) {
        return "odd-row";
      }
      return "";
    },

    //置顶,标记大V
    handleTSV(data, flag) {
      if (this.isDisable) {
        return false;
      } else {
        this.isDisable = true;
        getTSV({
          sysId: data.sysId,
          type: flag,
        })
          .then((json) => {
            this.isDisable = false;
            if (json.success) {
              this.$message.success(json.message);
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

    //取消置顶，取消大V
    cancelTSV(data, flag) {
      if (this.isDisable) {
        return false;
      } else {
        this.isDisable = true;
        getCancelTSV({
          sysId: data.sysId,
          type: flag,
        })
          .then((json) => {
            this.isDisable = false;
            if (json.success) {
              this.$message.success(json.message);
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

    //删除专栏
    Delete(data, index) {
      this.$confirm("确定将该专栏删除?", "删除专栏", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DeleteColumn({
            sysId: data.sysId,
          })
            .then((json) => {
              if (json.success) {
                this.$message.success("删除专栏成功");
                this.$emit("Delete", index);
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

    //编辑专栏
    Edit(data) {
      if (this.isDisable) {
        return false;
      } else {
        this.isDisable = true;
        getColumnItem(data.sysId)
          .then((json) => {
            this.isDisable = false;
            if (json.success) {
              this.$emit("Edit", json.content);
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
  },
};
</script>
<style>
.el-table .odd-row {
  background-color: #f5f5f5;
}
.icon6 {
  color: #367fff;
  cursor: pointer;
}
.el-button--text {
  color: #236deb;
}
</style>