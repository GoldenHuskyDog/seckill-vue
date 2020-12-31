
<template>
  <div>
    <el-container>
  <el-container style="height:100vh">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>商城</span>
      </div>
      <div>
        <el-button type="info" style="float: right" @click="showEditDialog">个人信息</el-button>
        <el-button type="info" style="float: right" @click="getOrdersList">我的订单</el-button>
        <el-button type="info" style="float: right" @click="showPasswordDialog">修改密码</el-button>
        <el-button type="info" style="float: right" @click="logout">退出</el-button>
      </div>
    </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    </el-container>
    <el-dialog
        title="个人信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
    >
      <el-form
          :model="editUserForm"
          :rules="editUserFormRules"
          ref="editUserFormRef"
          label-width="70px"
          class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="path">
          <el-input v-model="editUserForm.path"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="修改密码"
        :visible.sync="passwordDialogVisible"
        width="50%"
        @close="passwordDialogClosed"
    >
      <el-form
          :model="editPasswordForm"
          :rules="editPasswordFormRules"
          ref="editPasswordFormRef"
          label-width="70px"
          class="demo-ruleForm"
      >
        <el-form-item label="原密码">
          <el-input v-model="editPasswordForm.password"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="editPasswordForm.newpassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="editPasswordForm.newpassword1"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPassword">确 定</el-button>
      </span>
    </el-dialog>
    <!--订单列表-->
    <el-dialog title="我的订单"
               :visible.sync="orderDialogVisible"
               width="75%"
               @close="OrderDialogClosed">
      <el-table :data="orderslist" stripe border style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column
                prop="orderid"
                label="订单编号"
                width="200px">
        </el-table-column>
        <el-table-column
                prop="username"
                label="用户名"
                width="100px"
        ></el-table-column>
        <el-table-column
                prop="goodname"
                label="商品名称"
                width="100px"
        ></el-table-column>
        <el-table-column
                prop="number"
                label="商品数量"
                width="100px"
        ></el-table-column>
        <el-table-column
                prop="price"
                label="商品价格"
                width="100px"
        ></el-table-column>
        <el-table-column
                prop="time"
                label="下单时间"
                width="200px"
                :formatter="common.formatDate"
        ></el-table-column>
        <el-table-column
                prop="path"
                label="地址"
                width="200px"
        ></el-table-column>
        <el-table-column
                prop="sum"
                label="总计"
                width="100px"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>


</template>

<script>

export default {
  name: "Common",
  data() {
    // 自定义邮箱校验规则
    var checkEmail = (rule, value, cb) => {
      const regEail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    // 自定义手机号校验规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      editDialogVisible: false,
      passwordDialogVisible: false,
      orderDialogVisible: false,
      orderslist:[],
      editUserForm: {
        email:"",
        mobile: "",
        path:""
      },
      editPasswordForm: {
        password: "",
        newpassword: "",
        newpassword1: ""
      },
      editUserFormRules: {
        email: [
          {required: true, message: "请输入邮箱", trigger: "blur"},
          {validator: checkEmail, trigger: "blur"}
        ],
        mobile: [
          {required: true, message: "请输入手机", trigger: "blur"},
          {validator: checkMobile, trigger: "blur"}
        ]
      },
      editPasswordFormRules: {
        password: [
          {required: true, message: "请输入邮箱", trigger: "blur"},
        ],
        newpassword: [
          {required: true, message: "请输入新密码", trigger: "blur"},
        ]
      }
    }
  },
  methods: {
    logout() {
      const _this = this
      _this.$axios.get("/logout", {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      }).then(res => {
        _this.$store.commit("REMOVE_INFO")
        _this.$router.push("/login")

      })
    },
    async showEditDialog() {
      const { data } = await this.$axios.get(`/user`,{
        headers: {
          "Authorization": localStorage.getItem("token")
        }});
     /* console.log(data)*/
      if (data.code !== 200) {
        this.$message.error("查询用户失败！");
      }
      this.editUserForm = data.data;
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields();
    },
    editUser() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return;
        const { data } = await this.$axios.put(`/user`, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile,
          path: this.editUserForm.path
        },{
          headers: {
            "Authorization": localStorage.getItem("token")
          }});
       /* console.log(data)*/
        if (data.code !== 200) {
          this.$message.error("修改用户信息失败！");
        }
        this.$message.success("修改成功！");
        this.editDialogVisible = false;
      });
    },
    async getOrdersList() {
      const { data } = await this.$axios.get("order", {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      });
    /*  console.log(data)*/
      if (data.code !== 200) {
        return this.$message.error(data.msg);
      }
      this.orderslist = data.data;
      this.total = data.data.total;
      this.orderDialogVisible = true;
    },
    OrderDialogClosed() {

    },
    async showPasswordDialog() {
      this.passwordDialogVisible = true;
    },
    passwordDialogClosed() {
      this.$refs.editPasswordFormRef.resetFields();
    },
    editPassword() {
      this.$refs.editPasswordFormRef.validate(async valid => {
        if (!valid) return;
        const { data } = await this.$axios.put(`/password`, {
          password:this.editPasswordForm.password,
          password1:this.editPasswordForm.newpassword,
          password2:this.editPasswordForm.newpassword1
        },{
          headers: {
            "Authorization": localStorage.getItem("token")
          }});
       /* console.log(data)*/
        if (data.code !== 200) {
          this.$message.error(data.msg);
        }else {
          this.$message.success(data.msg);
        }
        this.passwordDialogVisible = false;
      });
    }

  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  img {
    width: 50px;
    height: 50px;
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
