<template>
      <div id="myList" class="myList">
        <ul style="list-style:none;">
          <li v-for="item in list" :key="item.goodId">
            <router-link :to="{ path: '/seckillDetails', query: {seckillID:item.seckillId,goodID:item.goodId} }">
              <img :src="`${publicPath}`+item.img" style="width: 160px;height: 160px">
              <h2>{{item.goodName}}</h2>
              <h3></h3>
              <p>
                <span>{{item.seckillPrice}}元</span>
                <span
                    v-show="item.goodPrice != item.goodSellingPrice"
                    class="del"
                >{{item.goodPrice}}元</span>
              </p>
            </router-link>
          </li>
        </ul>
      </div>
</template>
<script>

export default {
  data() {
    return {
      publicPath: process.env.BASE_URL,
      img:"",
      list:"",
      timeID: [],
      good: "", // 商品列表
      total: 0, // 商品总量

      activeName: "-1", // 分类列表当前选中的id
    };
  },
  created() {
    // 获取秒杀时间列表
    this.getData();

  },
  /*
  activated() {

    if (this.$route.query.timeID != undefined) {
      this.timeID = this.$route.query.timeID;
      this.activeName = "" + this.timeID;
      return;
    }
  },
  watch: {

    // 监听点击了哪个分类标签，通过修改分类id，响应相应的商品
    activeName: function(val) {

      if (Number(val) > 0) {
        this.timeID = [Number(val)];
      }

      this.$router.push({
        path: "/seckill",
        query: { timeID: this.timeID }
      });
    },

    // 监听分类id，响应相应的商品
    timeID: function() {
      this.getData();
      this.search = "";
    },

  },*/
  methods: {


    async getData() {
        const { data } = await this.$axios.get("/seckill", {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        });
        /*console.log("-------------------")
        console.log(data)*/
        this.list = data.data;
      },


  }
};
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

.goods {
  background-color: #f5f5f5;
}
/* 面包屑CSS */
.el-tabs--card .el-tabs__header {
  border-bottom: none;
}
.goods .breadcrumb {
  height: 50px;
  background-color: white;
}
.goods .breadcrumb .el-breadcrumb {
  width: 1225px;
  line-height: 30px;
  font-size: 16px;
  margin: 0 auto;
}
/* 面包屑CSS END */

/* 分类标签CSS */
.goods .nav {
  background-color: white;
}
.goods .nav .good-nav {
  width: 1225px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
}
.nav .good-nav .title {
  width: 50px;
  font-size: 16px;
  font-weight: 700;
  float: left;
}
/* 分类标签CSS END */

/* 主要内容区CSS */
.goods .main {
  margin: 0 auto;
  max-width: 1225px;
}
.goods .main .list {
  min-height: 650px;
  padding-top: 14.5px;
  margin-left: -13.7px;
  overflow: auto;
}
.goods .main .pagination {
  height: 50px;
  text-align: center;
}
.goods .main .none-good {
  color: #333;
  margin-left: 13.7px;
}

.myList ul li {
  z-index: 1;
  float: left;
  width: 234px;
  height: 280px;
  padding: 10px 0;
  margin: 0 0 14.5px 13.7px;
  background-color: white;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  position: relative;
}
.myList ul li:hover {
  z-index: 2;
  -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  -webkit-transform: translate3d(0, -2px, 0);
  transform: translate3d(0, -2px, 0);
}
.myList ul li img {
  width: 160px;
  display: block;
  margin: 0 auto;
}
.myList ul li h2 {
  margin: 25px 10px 0;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.myList ul li h3 {
  margin: 5px 10px;
  height: 18px;
  font-size: 12px;
  font-weight: 400;
  color: #b0b0b0;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.myList ul li p {
  margin: 10px 10px 10px;
  text-align: center;
  color: #ff6700;
}
.myList ul li p .del {
  margin-left: 0.5em;
  color: #b0b0b0;
  text-decoration: line-through;
}
.myList #more {
  text-align: center;
  line-height: 280px;
}
.myList #more a {
  font-size: 18px;
  color: #333;
}
.myList #more a:hover {
  color: #ff6700;
}
.myList ul li .delete {
  position: absolute;
  top: 10px;
  right: 10px;
  display: none;
}
.myList ul li:hover .delete {
  display: block
}
.myList ul li .delete:hover {
  color: #ff6700;
}
/* 主要内容区CSS END */
</style>
