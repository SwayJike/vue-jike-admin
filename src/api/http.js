import axios from "../utils/request";
import service from "../utils/download";
import qs from 'qs';

const HttpManager = {
  /*=================== 登录登出 API ===================*/
  login: param => axios.post('/login?'+ qs.stringify(param)),
  logout: command => axios.get(command),
  /*=================== 部门管理 API ===================*/
  deptList: () => axios.get('/sysDept/deptList'),
  deptMap: () => axios.get('/sysDept/deptMap'),

  /*=================== 菜单管理 API ===================*/
  menuList: () => axios.get('/sysMenu/menuList'),

  /*=================== 角色管理 API ===================*/

  /*=================== 用户管理 API ===================*/

  userList: (pager, query) => axios.get(`/sysUser/userList/${pager.pageNum}/${pager.pageSize}?`+ qs.stringify(query)),
  saveOrUpdate: user => axios.post('/sysUser/saveOrUpdate?'+qs.stringify(user)),
  userInfo: () => axios.get('/sysUser/userInfo'),
  removeUser: userId  =>  axios.delete('/sysUser/removeUser/'+ userId),
  removeSelectedUser: ids  =>  axios.delete('/sysUser/removeSelectedUser', {
    params: { ids },
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  }),
  downloadUser: () => service.get('/sysUser/export')
}

export default HttpManager
