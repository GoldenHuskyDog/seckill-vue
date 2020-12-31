<!--
 * @Description: 商品详情页面组件
 * @Author: hai-27
 * @Date: 2020-02-16 20:20:26
 * @LastEditors: hai-27
 * @LastEditTime: 2020-03-07 21:59:26
 -->
<template>
  <div id="details">
    <!-- 主要内容 -->
    <div class="main">
      <!-- 左侧商品轮播图 -->
      <div class="block">

          <img style="height: 560px" :src="goodDetails.goodPicture"/>

      </div>
      <!-- 左侧商品轮播图END -->

      <!-- 右侧内容区 -->
      <div class="content">
        <h1 class="name">{{goodDetails.goodName}}</h1>
        <!-- <p class="intro">{{goodDetails.goodIntro}}</p> -->
        <p class="store">开始时间: <span>{{goodDetails.startTime | dateFormat}}</span></p>
        <p class="store">结束时间: <span>{{goodDetails.endTime | dateFormat}}</span></p>
        <div class="price">
          <span>{{goodDetails.seckillPrice}}元</span>
          <span
              v-show="goodDetails.goodPrice != goodDetails.seckillPrice"
              class="del"
          >{{goodDetails.goodPrice}}元</span>
        </div>
        <div class="pro-list">
          <p class="price-sum">秒杀价 : {{goodDetails.seckillPrice}}元</p>
          <p class="price-sum">倒计时 : {{testTime}}秒</p>

        </div>
        <!-- 内容区底部按钮 -->
        <div class="button">
          <!-- <el-button class="shop-cart" :disabled="dis" @click="addShoppingCart">抢购</el-button> -->
          <el-button class="shop-cart" :disabled="dis" @click="dialogVisible = true">抢购</el-button>

        </div>

      </div>
      <!-- 右侧内容区END -->
    </div>
    <!-- 主要内容END -->
    <el-dialog
        title="新建订单"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addDialogClosed"
    >
      <el-form
          :model="addOrderForm"
          :rules="addOrderFormRules"
          ref="addOrderFormRef"
          label-width="100px"
          class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="goodDetails.goodName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="goodDetails.seckillPrice" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="path">
          <el-input v-model="goodDetails.path"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="number">
          <el-input-number v-model="addOrderForm.number" :min="1" :max="10" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from "vuex";
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
      dialogVisible: false,
      addOrderForm: {
        number: 1,
        path: ''
      },
      addOrderFormRules: {
        number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          { validator: checkNumber, trigger: "blur" }
        ]
      },
      dis: true, // 控制“加入购物车按钮是否可用”
      goodID: "", // 商品id
      seckillID: "", // 商品id
      goodDetails: "", // 商品详细信息
      goodPicture: "", // 商品图片
      seckillState:0, // 秒杀状态 0 未开始，1进行中，2结束
      remainSeconds:0, // 秒杀倒计时
      testTime:0
    };
  },
  created() {
    if (this.$route.query.goodID != undefined) {
      this.goodID = this.$route.query.goodID;
    }
    if (this.$route.query.seckillID != undefined) {
      this.seckillID = this.$route.query.seckillID;
    }
    this.getDetails('')

  },
  // 通过路由获取商品id
  activated() {
   /* console.log(this.$route.query)*/
    if (this.$route.query.goodID != undefined) {
      this.goodID = this.$route.query.goodID;
    }
    if (this.$route.query.seckillID != undefined) {
      this.seckillID = this.$route.query.seckillID;
    }
    // console.log(new Date().getTime());
  },
  watch: {
    // 监听商品id的变化，请求后端获取商品数据
    seckillID: function(val) {
      this.getDetails(val);
    },
    remainSeconds: function() {
      this.countDown();
    }

  },
  methods: {
    ...mapActions(),
    // 获取商品详细信息
    getDetails(val) {
      this.$axios
          .get("/seckillDetails",{
            params: {
              "seckillID":this.seckillID,
              "goodID":this.goodID
            },
            headers: {
              "Authorization": localStorage.getItem("token")
            }
          })
          .then(res => {
            /*console.log(res.data)*/
            this.goodDetails = res.data.data;
            /*console.log(this.goodDetails.startTime)
            console.log(new Date().getTime())*/
            if (this.goodDetails.startTime > new Date().getTime()) {
              this.remainSeconds = Math.floor(this.goodDetails.startTime/1000 - new Date().getTime()/1000);
              this.testTime = this.remainSeconds;
              this.seckillState = 0;
            }else if(new Date().getTime() > this.goodDetails.endTime) {
              this.seckillState = 2;
              this.remainSeconds = 0;
              this.testTime = this.remainSeconds;
            }else{
              this.seckillState = 1;
              this.remainSeconds = 0;
              this.testTime = this.remainSeconds;
              this.dis = false;
            }
          })
          .catch(err => {
            return Promise.reject(err);
          });

    },
    countDown() {
      let _this=this;
      if (_this.testTime > 0) {
        _this.testTime = _this.testTime - 1;
        setTimeout(function() {
          _this.countDown(_this.testTime);
        },1000)
      }else if (_this.testTime <= 0) {
        this.seckillState = 1;
        this.dis = false;
      }
    },
    addDialogClosed() {
      this.$refs.addOrderFormRef.resetFields();
    },
    addOrder() {
      this.$refs.addOrderFormRef.validate(async valid => {
        if (!valid) return;
        const { data } = await this.$axios.post("/order",{
          "id": this.seckillID,
          "userid": this.$store.getters.getUser.id,
          "goodid": this.goodID,
          "number": this.addOrderForm.number,
          "time": new Date().getTime()
        },{
          headers: {
            "Authorization": localStorage.getItem("token")
          }});
        if (data.code === 210) {
          this.$message.error("抢单失败！");
        }else if(data.code === 200) {
          this.$message.success("下单成功！");
        }
        this.dialogVisible = false;
      });
    }
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
</style>
/* 头部CSS */

<style>
#details .page-header {
  height: 64px;
  margin-top: -20px;
  z-index: 4;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  -webkit-box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
}
#details .page-header .title {
  width: 1225px;
  height: 64px;
  line-height: 64px;
  font-size: 18px;
  font-weight: 400;
  color: #212121;
  margin: 0 auto;
}
#details .page-header .title p {
  float: left;
}
#details .page-header .title .list {
  height: 64px;
  float: right;
}
#details .page-header .title .list li {
  float: left;
  margin-left: 20px;
}
#details .page-header .title .list li a {
  font-size: 14px;
  color: #616161;
}
#details .page-header .title .list li a:hover {
  font-size: 14px;
  color: #ff6700;
}
/* 头部CSS END */

/* 主要内容CSS */
#details .main {
  width: 1500px;
  height: 560px;
  padding-top: 30px;
  margin: 0 auto;
}
#details .main .block {
  float: left;
  width: 560px;
  height: 560px;
}
#details .el-carousel .el-carousel__indicator .el-carousel__button {
  background-color: rgba(163, 163, 163, 0.8);
}
#details .main .content {
  float: left;
  margin-left: 50px;
  width: 640px;
}
#details .main .content .name {
  height: 30px;
  line-height: 30px;
  font-size: 24px;
  font-weight: normal;
  color: #212121;
}
#details .main .content .intro {
  color: #b0b0b0;
  padding-top: 10px;
}
#details .main .content .store {
  color: #ff6700;
  padding-top: 10px;
}
#details .main .content .price {
  display: block;
  font-size: 18px;
  color: #ff6700;
  border-bottom: 1px solid #e0e0e0;
  padding: 25px 0 25px;
}
#details .main .content .price .del {
  font-size: 14px;
  margin-left: 10px;
  color: #b0b0b0;
  text-decoration: line-through;
}
#details .main .content .pro-list {
  background: #f9f9fa;
  padding: 30px 60px;
  margin: 50px 0 50px;
}
#details .main .content .pro-list span {
  line-height: 30px;
  color: #616161;
}
#details .main .content .pro-list .pro-price {
  float: right;
}
#details .main .content .pro-list .pro-price .pro-del {
  margin-left: 10px;
  text-decoration: line-through;
}
#details .main .content .pro-list .price-sum {
  color: #ff6700;
  font-size: 24px;
  padding-top: 20px;
}
#details .main .content .button {
  height: 55px;
  margin: 10px 0 20px 0;
}
#details .main .content .button .el-button {
  float: left;
  height: 55px;
  font-size: 16px;
  color: #fff;
  border: none;
  text-align: center;
}

#details .main .content .button .shop-cart {
  float: left;
  width: 340px;
  background-color: #ff6700;
}
#details .main .content .button .shop-cart:hover {
  background-color: #f25807;
}

#details .main .content .button .like {
  width: 260px;
  margin-left: 40px;
  background-color: #b0b0b0;
}
#details .main .content .button .like:hover {
  background-color: #757575;
}
#details .main .content .pro-policy li {
  float: left;
  margin-right: 20px;
  color: #b0b0b0;
}
/* 主要内容CSS END */
</style>
