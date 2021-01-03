<template>
  <div>
    <el-container>
      <el-main>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password"></el-input>
          </el-form-item>

          <el-form-item  prop="verifycode">
            <el-input v-model="ruleForm.verifycode" placeholder="请输入验证码" class="identifyinput" style="float: left"></el-input>
          </el-form-item>

          <el-form-item>
            <div class="identifybox">
              <div @click="refreshCode">
                <s-identify :identifyCode="identifyCode"></s-identify>
              </div>
              <el-button @click="refreshCode" type='text' class="textbtn">看不清，换一张</el-button>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          </el-form-item>
        </el-form>

      </el-main>
    </el-container>

  </div>
</template>

<script>
  import SIdentify from '../components/identify/identify'
export default {
  name: "Login",
  data() {
    // 验证码自定义验证规则
    const validateVerifycode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value !== this.identifyCode) {
       /* console.log('validateVerifycode:', value)*/
        callback(new Error('验证码不正确!'))
      } else {
        callback()
      }
    }
    return {
      fontstyle: {},
      ruleForm: {
        username: '',
        password: '',
        verifycode: ''
      },
      checked: false,
      identifyCodes: '1234567890',
      identifyCode: '',
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请选择密码', trigger: 'change'}
        ],
        verifycode: [
          { required: true, trigger: 'blur', validator: validateVerifycode }
        ]
      }
    };
  },
  components: {
    SIdentify
  },
  mounted() {
    // 验证码初始化
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  computed: {
  },
  props: [],
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this
          this.$axios.post('/login', this.ruleForm).then(res => {
          const jwt = res.headers['authorization']
          const userInfo = res.data.data
          _this.$store.commit("SET_TOKEN", jwt)
          _this.$store.commit("SET_USERINFO", userInfo)

            // 根据用户角色决定跳转页面
           if(userInfo.rolename === "user"){//普通用户
              _this.$router.push('/seckill')//前台商品界面
            }else{                        //后台管理员
              _this.$router.push('/home')//后台商品管理界面
            }
          })
        } else {
          return false;
        }
      });
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 切换验证码
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    // 生成四位随机验证码
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
                this.randomNum(0, this.identifyCodes.length)
                ]
      }
     /* console.log(this.identifyCode)*/
    }
  }
}
</script>

<style scoped>
.identifybox{
  display: flex;
  justify-content: space-between;
  margin-top:7px;
}
.iconstyle{
  color:#409EFF;
}
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  /*background-color: #E9EEF3;*/
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.mlogo {
  height: 60%;
  margin-top: 10px;
}

.demo-ruleForm {
  max-width: 500px;
  margin: 0 auto;
}

</style>
