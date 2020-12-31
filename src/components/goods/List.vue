<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleCurrentChange(1);getGoodsList;"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodslist" stripe border style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column
            prop="name"
            label="商品名称"
            width="300px">
        </el-table-column>
        <el-table-column
          prop="price"
          label="商品价格"
          width="300px"
        ></el-table-column>
        <el-table-column
          prop="number"
          label="商品数量"
          width="300px"
        ></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-delete"
              @click="removeById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 添加商品对话框 -->
    <el-dialog
        title="添加商品"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addDialogClosed"
    >
      <el-form
          :model="addGoodForm"
          :rules="addGoodFormRules"
          ref="addGoodFormRef"
          label-width="100px"
          class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="addGoodForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="addGoodForm.price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="number">
          <el-input v-model="addGoodForm.number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGood">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改商品对话框 -->
    <el-dialog
        title="修改商品信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
    >
      <el-form
          :model="editGoodForm"
          :rules="editGoodFormRules"
          ref="editGoodFormRef"
          label-width="100px"
          class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="editGoodForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="editGoodForm.price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="number">
          <el-input v-model="editGoodForm.number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGood">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
export default {
  data() {
    var checkNumber = (rule, value, cb) => {
      const regEail = /^[1-9]\d*$/;
      if (regEail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的正整数"));
    };
    return {
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 5
        },
        goodslist: [],
        total: 0,
        dialogVisible: false,
        editDialogVisible: false,
      addGoodForm: {
        name: "",
        price: 0,
        number: 0
      },
      addGoodFormRules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { validator: checkNumber, trigger: "blur" }
        ],
        number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          { validator: checkNumber, trigger: "blur" }
        ]
      },
      editGoodForm: {},
      editGoodFormRules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { validator: checkNumber, trigger: "blur" }
        ],
        number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          { validator: checkNumber, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async getGoodsList() {
      const { data } = await this.$axios.get("goods", {
        headers: {
          "Authorization": localStorage.getItem("token")
        },
        params: this.queryInfo
      });
      /*console.log(data)*/
      if (data.code !== 200) {
        return this.$message.error(data.msg);
      }
      this.goodslist = data.data;
      this.total = data.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    addDialogClosed() {
      this.$refs.addGoodFormRef.resetFields();
    },
    addGood() {
      this.$refs.addGoodFormRef.validate(async valid => {
        if (!valid) return;
        const { data } = await this.$axios.post("/goods", this.addGoodForm,{
          headers: {
            "Authorization": localStorage.getItem("token")
          }});
        if (data.code !== 200) {
          this.$message.error("添加商品失败！");
        }
        this.$message.success("添加商品成功！");
        this.dialogVisible = false;
        this.getGoodsList();
      });
    },
    async showEditDialog(id) {
      const { data } = await this.$axios.get(`goods/${id}`,{
        headers: {
          "Authorization": localStorage.getItem("token")
        }});
      /*console.log(data)*/
      if (data.code !== 200) {
        this.$message.error("查询商品失败！");
      }
      this.editGoodForm = data.data;
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editGoodFormRef.resetFields();
    },
    editGood() {
      /*console.log(this.editGoodForm)*/
      this.$refs.editGoodFormRef.validate(async valid => {
        if (!valid) return;
        const { data } = await this.$axios.put(`goods/${this.editGoodForm.id}`, {
          name: this.editGoodForm.name,
          price: this.editGoodForm.price,
          number: this.editGoodForm.number
        },{
          headers: {
            "Authorization": localStorage.getItem("token")
          }});
        /*console.log(data)*/
        if (data.code !== 200) {
          this.$message.error("修改商品信息失败！");
        }
        this.$message.success("修改成功！");
        this.editDialogVisible = false;
        this.getGoodsList();
      });
    },
    removeById(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data } = await this.$axios.delete(`goods/${id}`,{
            headers: {
              "Authorization": localStorage.getItem("token")
            }});
          if (data.code !== 200) {
            return this.$message.error(data.msg);
          }
          this.getGoodsList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
  },
  created() {
    this.getGoodsList();
  }
};
</script>

<style lang="less" scoped></style>
