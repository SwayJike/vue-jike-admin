import axios from "axios";
import {Message} from "element-ui";
import router from "../router";
/*创建实例*/
const instance = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout:  5000,
  headers: {
    'Content-Type': "application/json; charset=utf-8"
  }
})
/*请求拦截器*/
instance.interceptors.request.use(config =>{
  config.headers['authorization'] = localStorage.getItem('jwt');
  return config;
})
/*响应拦截器*/
instance.interceptors.response.use(response =>{
  let result = response.data;
  let code = result.code;
  if (code >= 100 && code < 400){
    if (result.message){
      Message.success(result.message);
    }
  } else {
    if(code == 403){
      router.push('/forbidden');
    }
  }


  return response;
},error => {
  let code = error.response.code;
  let message = error.response.message;
  if (code && message){
    Message.error({message})
  }else {
    Message.error({message:'未知错误!'})
  }
  return;
})

export default instance
