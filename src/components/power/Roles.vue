<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <el-table :data="rolelist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="rolename" label="角色名称"></el-table-column>
        <el-table-column prop="roledesc" label="角色描述"></el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      roleId:''
    };
  },
  methods: {
    async getRoleList() {
      const { data } = await this.$axios.get("roles");
      if (data.code !== 200) {
        return this.$message.error(data.msg);
      }
      this.rolelist = data.data;
    }
  },
  created() {
    this.getRoleList();
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bd-top {
  border-top: 1px solid #eee;
}

.bd-bottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
