<template>
  <div class="column">
    <span class="buttontwo" @click="getNewspecial()">
      <svg slot="suffix" aria-hidden="true" class="icon">
        <use xlink:href="#iconadd" />
      </svg>
      创建专栏
    </span>
    <div class="column-button flex">
      <div class="flex">
        <div
          :class="[{ active: isActive == 0 }, 'cb-item']"
          @click="ChangeTab(0)"
        >
          主题专栏
        </div>
        <div
          :class="[{ active: isActive == 1 }, 'cb-item']"
          style="margin-left: 10px"
          @click="ChangeTab(1)"
        >
          人物专栏
        </div>
      </div>
      <div class="flex">
        <span class="font-s14 color3">筛选：</span>
        <el-select
          v-model="value"
          class="select-column"
          placeholder="请选择"
          size="small"
          @change="onChange"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="serachText"
          placeholder="搜索专栏"
          @keyup.13.native="search"
          size="small"
          class="input-with-column"
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
    <table-list
      :tableData="tableData"
      :isActive="isActive"
      @Edit="Edit"
      @confirm="init"
      @Delete="getDelete"
    ></table-list>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="12"
      layout="prev, pager, next, jumper"
      :total="total"
      hide-on-single-page
      background
      style="text-align: center; margin-top: 30px"
    >
    </el-pagination>
    <add-special
      :visible="visible"
      @confirm="confirm"
      @cancel="cancel"
    ></add-special>
    <edit-sdetail
      :visible="editSvisible"
      :options="detail"
      :editflag="false"
      @confirm="Editconfirm"
      @cancel="Editcancel"
    >
    </edit-sdetail>
    <edit-person
      :visible="editPvisible"
      :options="detail"
      :editflag="false"
      @confirm="Editconfirm"
      @cancel="Editcancel"
    >
    </edit-person>
  </div>
</template>
<script>
import { getColumn } from "@/api/interface/column";
import TableList from "@/components/column/tableList.vue";
import AddSpecial from "@/components/dialog/addSpecial.vue";
import EditSdetail from "@/components/dialog/editSpecial.vue";
import EditPerson from "@/components/dialog/editPerson.vue";

export default {
  data() {
    return {
      isActive: 0,
      currentPage: 1,
      total: 0,
      visible: false,
      editSvisible: false,
      editPvisible: false,
      tableData: [],
      detail: {},
      options: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "置顶",
        },
      ],
      value: 0,
      serachText: "",
    };
  },
  components: {
    AddSpecial,
    EditSdetail,
    EditPerson,
    TableList,
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getColumn({
        current: this.currentPage,
        size: 10,
        type: this.isActive,
        condition: this.value,
        title: this.serachText,
      })
        .then((json) => {
          if (json.success) {
            this.total = json.content.total;
            this.tableData = json.content.records;
          } else {
            this.$message.error(json.message);
          }
        })
        .catch((json) => {
          this.$message.error(json.message);
        });
    },

    //初始化数据
    getClear(index) {
      this.isActive = index;
      this.serachText = "";
      this.value = 0;
      this.currentPage = 1;
      this.tableData = [];
      this.init();
    },

    //打开创建专栏弹框
    getNewspecial() {
      this.visible = true;
    },

    //提交新建专栏审核
    confirm(index) {
      this.visible = false;
      this.getClear(index);
    },

    //关闭新建专栏弹框
    cancel() {
      this.visible = false;
    },

    //专题与人物切换
    ChangeTab(index) {
      this.getClear(index);
    },

    //分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },

    //编辑专栏
    Edit(data) {
      this.detail = data;
      if (this.isActive == 0) {
        this.editSvisible = true;
      } else {
        this.editPvisible = true;
      }
    },

    //提交编辑
    Editconfirm(params) {
      if (this.isActive == 0) {
        this.editSvisible = false;
      } else {
        this.editPvisible = false;
      }
      this.init();
    },

    //关闭编辑专栏弹框
    Editcancel() {
      if (this.isActive == 0) {
        this.editSvisible = false;
      } else {
        this.editPvisible = false;
      }
    },

    //删除数据后操作
    getDelete(index) {
      let flag = false;
      if (index === 0 && this.tableData.length === 1) {
        flag = true;
      }
      if (flag === true && this.currentPage != 1) {
        this.currentPage = this.currentPage - 1;
      }
      this.init();
    },

    //筛选
    onChange(index) {
      this.value = index;
      this.currentPage = 1;
      this.init();
    },

    //搜索
    search() {
      this.currentPage = 1;
      this.init();
    },
  },
};
</script>