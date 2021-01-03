import axios from 'axios'
import Element from 'element-ui'
import router from './router'
import store from './store'


axios.defaults.baseURL = "http://47.93.139.186:8081"



// 前置拦截
axios.interceptors.request.use(config => {
  return config
})

axios.interceptors.response.use(response => {
    let res = response.data;
    /*console.log(res)*/
    if (res.code === 200 || res.code === 210 || res.code === 220) {
        return response
    }else if(res.code === 400 || res.code === 401 || res.code === 402 || res.code === 403 || res.code === 404){
        router.go(-1)
        Element.Message.error(response.data.msg, {duration: 3 * 1000})
        return Promise.reject(response.data.msg)
    }else {
        Element.Message.error(response.data.msg, {duration: 3 * 1000})
        router.push("/login")
        return Promise.reject(response.data.msg)
    }
  },
  error => {
   /* console.log(error)*/
    if(error.response.data) {
      error.message = error.response.data.msg
    }

    if(error.response.status === 401) {
      store.commit("REMOVE_INFO")
      router.push("/login")
    }

    Element.Message.error(error.message, {duration: 3 * 1000})
    return Promise.reject(error)
  }
)
