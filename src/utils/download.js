import axios from "axios";
import fileDownload from "js-file-download";

const service = axios.create({
  baseURL: 'http://localhost:8080/',
  responseType: 'arraybuffer',
  headers: {
    'Content-Type': 'application/json;application/octet-stream'
  }
})

service.interceptors.request.use(config =>{
  config.headers['authorization'] = window.localStorage.getItem("jwt");
  return config;
},error => {
  console.log(error);
})

service.interceptors.response.use(resp =>{
  const headers = resp.headers;
  let reg = RegExp(/application\/json/);
  if (headers['content-type'].match(reg)){
    resp.data = unitToString(resp.data);
  } else {
    let fileName = headers['content-disposition'].split(';')[1].split('filename=')[1];
    let contentType = headers['content-type'];
    fileName = decodeURIComponent(fileName);
    fileDownload(resp.data,fileName,contentType);
  }
  return resp;
},error => {
  console.log(error);
})

function unitToString(unitArray){
  let encodeString = String.fromCharCode.apply(null,new Uint8Array(unitArray));
  let decodedString = decodeURIComponent(escape(encodeString));
  return JSON.parse(decodedString);
}

export default service;


