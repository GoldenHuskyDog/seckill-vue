<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
                  placeholder="请输入内容"
                  clearable
                  v-model="queryInfo.query"
                  @clear="getOrdersList"
          >
            <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="handleCurrentChange(1);getOrdersList;"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderslist" stripe border style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column
                prop="orderid"
                label="订单编号"
                width="200px">
        </el-table-column>
        <el-table-column
                prop="userid"
                label="用户ID"
                width="150px"
        ></el-table-column>
        <el-table-column
                prop="goodid"
                label="商品ID"
                width="150px"
        ></el-table-column>
        <el-table-column
                prop="number"
                label="商品数量"
                width="150px"
        ></el-table-column>
        <el-table-column
                prop="price"
                label="商品价格"
                width="150px"
        ></el-table-column>
        <el-table-column
                prop="time"
                label="下单时间"
                width="200px"
                :formatter="common.formatDate"
        ></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
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

  </div>
</template>

<script>
  export default {
    data() {
      return {
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 5
        },
        orderslist: [],
        total: 0
      }
    },
    methods: {
      async getOrdersList() {
        const { data } = await this.$axios.get("orders", {
          headers: {
            "Authorization": localStorage.getItem("token")
          },
          params: this.queryInfo
        });
        /*console.log(data)*/
        if (data.code !== 200) {
          return this.$message.error(data.msg);
        }
        this.orderslist = data.data;
        this.total = data.data.total;
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getOrdersList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getOrdersList();
      },
      removeById(id) {
        this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
                .then(async () => {
                  const { data } = await this.$axios.delete(`orders/${id}`,{
                    headers: {
                      "Authorization": localStorage.getItem("token")
                    }});
                  if (data.code !== 200) {
                    return this.$message.error(data.msg);
                  }
                  this.getOrdersList();
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
      this.getOrdersList();
    }
  };
</script>

<style lang="less" scoped></style>
