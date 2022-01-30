<template>
 <div class="user_mana">
<!--   shift + f6代码重构-->
<!--   功能列表-->
   <div class="inline-list">
     <el-form :inline="true" :model="query" class="demo-form-inline">
       <el-form-item label="用户名:">
         <el-input @keydown.enter.native.prevent="get$userList" v-model="query.username" placeholder="请输入用户名"></el-input>
       </el-form-item>
       <el-form-item>
         <el-button type="primary" @click.native="get$userList">
           <i style="margin-right: 6px" class="fa fa-search"></i>查询
         </el-button>
       </el-form-item>
       <el-form-item>
          <el-button :disabled="selectIds.length < 1" type="danger" @click="deleteUser(null)">
            <i style="margin-right: 6px" class="fa fa-trash"></i>删除所选
          </el-button>
       </el-form-item>
     </el-form>
     <div>
       <el-upload
         style="display: inline-flex;margin-right: 10px"
         :show-file-list="false"
         :before-upload="beforeUpload"
         :on-success="onSuccess"
         :on-error="onError"
         :headers="upload.headers"
         :disabled="upload.disabled"
         :action="upload.action">
         <el-button type="success">
           <i :class="upload.icon" style="margin-right: 6px" aria-hidden="true"></i>
           <span> {{ upload.text }} </span>
         </el-button>
       </el-upload>
       <el-button type="success" @click="downloadUser">
         <i style="margin-right: 6px" class="fa fa-arrow-down" aria-hidden="true"></i>文件下载
       </el-button>
       <el-button type="primary" @click="addUser">
         <i style="margin-right: 6px" class="fa fa-plus" aria-hidden="true"></i>添加
       </el-button>
     </div>
   </div>
<!--   用户列表-->
   <div>
     <el-table
       :data="users"
       style="width: 100%"
       max-height="500"
       @selection-change="handleSelectChange"
       :row-class-name="tableRowClassName">
       <el-table-column
         type="selection"
         :selectable="handleSelectable"
         width="55">
       </el-table-column>
       <el-table-column
         prop="username"
         label="用户名">
       </el-table-column>
       <el-table-column
         prop="deptId"
         width="100"
         label="部门">
         <template slot-scope="scope">
           {{ deptMap[scope.row.deptId] }}
         </template>
       </el-table-column>
       <el-table-column
         prop="nickName"
         label="昵称"
         width="80">
       </el-table-column>
       <el-table-column
         prop="gender"
         label="性别"
         width="50">
       </el-table-column>
       <el-table-column
         prop="phone"
         label="手机号码"
         width="120">
       </el-table-column>
       <el-table-column
         prop="email"
         label="邮箱"
         width="180">
       </el-table-column>
       <el-table-column
         prop="enabled"
         label="是否启用"
         width="100">
         <template slot-scope="scope">
             <el-switch
               :disabled="scope.row.isAdmin"
               v-model="scope.row['enabled']"
               active-color="#13ce66"
               inactive-color="#ff4949"
               active-value="1"
               @change="handleEnabled(scope.row)"
               inactive-value="0">
             </el-switch>
         </template>
       </el-table-column>
       <el-table-column
         prop="createBy"
         label="创建者"
         width="100">
       </el-table-column>
       <el-table-column
         prop="updateBy"
         label="更新者"
         width="100">
       </el-table-column>
       <el-table-column
         prop="pwdResetTime"
         label="修改密码的时间"
         width="180">
       </el-table-column>
       <el-table-column
         prop="createTime"
         label="创建日期"
         width="180">
       </el-table-column>
       <el-table-column
         prop="updateTime"
         label="更新时间"
         width="180">
       </el-table-column>
       <el-table-column
         fixed="right"
         label="操作"
         width="160">
         <template slot-scope="scope">
           <el-button @click="updateUser(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
           <el-button :disabled="scope.row.isAdmin" @click="deleteUser(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
         </template>
       </el-table-column>
     </el-table>
   </div>
<!--    分页-->
   <base-pager :total="pager.total" :list-info="get$userList"
               :page-num="pager.pageNum" :page-size="pager.pageSize"
               @pageNum-change="pageNum => pager.pageNum = pageNum"
               @pageSize-change="pageSize => pager.pageSize = pageSize"></base-pager>

<!--   弹出框-->
   <div>
     <el-dialog
       :visible.sync="centerDialogVisible"
       width="30%"
       center>
       <template slot="title">
         <span style="font-size: 26px;color: #08e7e0;letter-spacing: 2px">{{title}}</span>
       </template>
       <el-form ref="form" :model="dialogUser" :rules="rules" label-width="80px">
         <el-form-item label="用户名" prop="username">
           <el-input v-model="dialogUser.username"></el-input>
         </el-form-item>
         <el-form-item label="昵称" prop="nickName">
           <el-input v-model="dialogUser.nickName"></el-input>
         </el-form-item>
         <el-form-item label="部门名称">
           <el-cascader
             clearable
             ref="cascaderHandle"
             v-model="value"
             :options="options"
             :props="props"
             :show-all-levels="false"
             @change="handleChange('cascaderHandle')">
           </el-cascader>
           <span style="color: #f3b105;margin-left: 8px">(非必选)</span>
         </el-form-item>
         <el-form-item label="性别" prop="gender">
           <el-select v-model="dialogUser.gender" placeholder="请选择性别">
             <el-option label="男" value="男"></el-option>
             <el-option label="女" value="女"></el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="手机号码" prop="phone">
           <el-input v-model="dialogUser.phone"></el-input>
         </el-form-item>
         <el-form-item label="邮箱" prop="email">
           <el-input v-model="dialogUser.email"></el-input>
         </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('form')">提 交</el-button>
      </span>
     </el-dialog>
   </div>

<!--   测试数据显示-->
   <div>
     {{  }}
   </div>

 </div>

</template>

<script>
import HttpManager from "../../api/http";
import BasePager from "../../components/base/BasePager";
export default {
  name: "User",
  components: {BasePager},
  data(){
    return {
      /*当前操作员用户名*/
      current_userName: '',
      /*用户列表*/
      users: [],
      /*弹出框表单校验规则*/
      rules:{
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '手机号码为11位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
      },
      /*弹出框是否可见*/
      centerDialogVisible: false,
      /*弹出框标题*/
      title: '',
      /*弹出框绑定用户*/
      dialogUser: {
        userId:  '',
        deptId: '',
        username: '',
        nickName: '',
        gender: '',
        phone: '',
        email: '',
        enabled: '',
        createBy: '',
        updateBy: '',
        createTime: '',
        updateTime: '',
      },
      /*级联选择器(el-cascader)相关属性开始*/
      value:'',
      //TODO: 部门id信息待做
      values: [
        [7,2,17],[7,5],[8,6],[8,15],[7],[8],[7,2]
      ],
      options: [],
      props: {
        label: 'name',
        value: 'deptId',
        checkStrictly: true,
      },
      /*级联选择器相关属性结束*/
      /*deptId为key, deptName 为value*/
      deptMap: {},
      /*分页器*/
      pager: {
        pageNum: 1,
        pageSize: 20,
        total: 100,
        sizes: [20, 40, 60, 80],
      },
      /*查询器*/
      query: {
        username: ''
      },
      /*选中的用户Id列表*/
      selectIds: [],
      upload: {
        action: 'http://localhost:8080/sysUser/import',
        icon: 'fa fa-cloud-upload',
        text: '文件上传',
        headers: {
          authorization : window.localStorage.getItem('jwt')
        },
        disabled: false,
      }
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      row.index = rowIndex;
      if (rowIndex % 4 === 1) {
        return 'warning-row';
      } else if (rowIndex % 4 === 3) {
        return 'success-row';
      }
      return '';
    },
    updateUser(row){
      this.centerDialogVisible = true;
      this.title = '修改用户信息';
      this.dialogUser = Object.assign({}, row);
      this.dialogUser.updateBy = this.current_userName;
      let deptId = this.dialogUser.deptId;
      this.value = this.values.find(e => {
        return e[e.length - 1] == deptId;
      })
    },
    addUser(){
      this.centerDialogVisible = true;
      this.title = '添加用户信息';
      this.dialogUser = this.initUser();
      this.value = [];
      this.dialogUser.createBy = this.current_userName;
    },
    deleteUser(row){
      /*row存在则是删除当前行,否则删除多行*/
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        if (row){
          let userId = row.userId;
          HttpManager.removeUser(userId).then(() => {
            let rowIndex = row.index;
            this.users.splice(rowIndex,1);
          })
        }else {
          if (this.selectIds && this.selectIds.length > 0){
            HttpManager.removeSelectedUser(this.selectIds).then(() => {
              this.get$userList();
            });
          }
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleChange(forName){
      let depId = this.value.toString().split(',').pop();
      this.dialogUser.deptId = depId;
      /*监听值发生变化就关闭它*/
      this.$refs[forName].dropDownVisible = false;
    },
    getTreeData(data){
      // 循环遍历json数据
      for(let i=0;i<data.length;i++){
        if(data[i].children.length<1){
          // children若为空数组，则将children设为undefined
          data[i].children=undefined;
        }else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    initUser(){
      return  {
        userId:  '',
        depId: '',
        username: '',
        nickName: '',
        gender: '',
        phone: '',
        email: '',
        enabled: '1',
        createBy: '',
        updateBy: '',
        createTime: '',
        updateTime: '',
      }
    },
    handleSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          HttpManager.saveOrUpdateUser(this.dialogUser).then(res => {
            let user = res.data.data;
            if (this.title.startsWith("修改")){
              this.users.splice(this.dialogUser.index, 1, user)
            }else {
              this.users.push(user);
            }
          })
          // this.centerDialogVisible = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });


    },
    handleEnabled(row){
      let userId = row.userId;
      let enabled = row.enabled.toString();
      HttpManager.saveOrUpdateUser({userId,enabled});
    },
    handleSelectChange(rows){
      let size = rows.length;
      let length = this.selectIds;
      /*size > length则说明在添加数据*/
      if (size > length){
        rows.forEach(e => {
          /*重复userId不添加*/
          if (!this.selectIds.includes(e.userId)){
            this.selectIds.push(e.userId);
          }
        })
      }else {
        this.selectIds = [];
        rows.forEach(e => {
          this.selectIds.push(e.userId);
        })
      }
    },
    handleSelectable(row, rowIndex){
      return !row.isAdmin;
    },
    get$userList(){
      HttpManager.userList(this.pager, this.query).then(res => {
        let pageInfo = res.data.data;
        this.users = pageInfo.list;
        this.pager.total = pageInfo.total;
      })
    },
    downloadUser(){
      HttpManager.downloadUser();
    },
    onError(){
      this.upload.text = '文件上传';
      this.upload.icon = 'fa fa-cloud-upload';
      this.upload.disabled = false;
    },
    onSuccess(){
      this.upload.text = '文件上传';
      this.upload.icon = 'fa fa-cloud-upload';
      this.upload.disabled = false;
      // this.getStudentList();
    },
    beforeUpload(){
      this.upload.text = '正在导入';
      this.upload.icon = 'el-icon-loading';
      this.upload.disabled = true;
    },
  },
  created() {
    this.current_userName = localStorage.getItem('ms_username');
    this.get$userList();
    HttpManager.deptList().then(res => {
      this.options = this.getTreeData(res.data.data);
    })
    HttpManager.deptMap().then(res => {
      this.deptMap = res.data.data;
    })
  }
}
</script>

<style>
.el-table .warning-row {
  background: #FDF5E6;
}

.el-table .success-row {
  background: #F0F9EB;
}
.inline-list{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
