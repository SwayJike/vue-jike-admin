<template>
  <div>
    <!--   功能列表-->
    <div class="inline-list">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="角色名:">
          <el-input @keydown.enter.native.prevent="get$roleList" v-model="query.roleName" placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="get$roleList">
            <i style="margin-right: 6px" class="fa fa-search"></i>查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="selectIds.length < 1" type="danger" @click="deleteRole(null)">
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
        <el-button type="success" @click="downloadRole">
          <i style="margin-right: 6px" class="fa fa-arrow-down" aria-hidden="true"></i>文件下载
        </el-button>
        <el-button type="primary" @click="addMenu">
          <i style="margin-right: 6px" class="fa fa-plus" aria-hidden="true"></i>添加
        </el-button>
      </div>
    </div>

    <el-table
      :data="menus"
      style="width: 100%"
      max-height="500"
      @selection-change="handleSelectChange"
      row-key="menuId"
      :tree-props="{children: 'children'}"
      :row-class-name="tableRowClassName">
      <el-table-column
        type="selection"
        :selectable="handleSelectable"
        width="55">
      </el-table-column>
      <el-table-column
        prop="title"
        width="160"
        label="菜单标题">
      </el-table-column>
      <el-table-column
        prop="name"
        width="100"
        label="组件名称">
      </el-table-column>
      <el-table-column
        prop="component"
        width="140"
        label="组件">
      </el-table-column>
      <el-table-column
        prop="icon"
        width="50"
        label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="path"
        width="150"
        label="链接地址">
      </el-table-column>
      <el-table-column
        prop="permission"
        width="100"
        label="权限">
      </el-table-column>
      <el-table-column
        prop="createBy"
        width="100"
        label="创建者">
      </el-table-column>
      <el-table-column
        prop="updateBy"
        width="100"
        label="更新者">
      </el-table-column>
      <el-table-column
        prop="createTime"
        width="180"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        width="180"
        label="更新时间">
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button @click="updateMenu(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button @click="deleteMenu(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <base-pager></base-pager>

    <!--   弹出框-->
    <div>
      <el-dialog
        :visible.sync="dialog.visible"
        width="30%"
        center>
        <template slot="title">
          <span style="font-size: 26px;color: #08e7e0;letter-spacing: 2px">{{dialog.title}}</span>
        </template>

        <el-form :model="dialog.menu" :rules="dialog.rules" ref="form" label-width="100px" class="demo-ruleForm">
          <el-form-item label="菜单标题" prop="title">
            <el-input v-model="dialog.menu.title" placeholder="请输入菜单标题"></el-input>
          </el-form-item>
          <el-form-item label="组件名称" prop="name">
            <el-input v-model="dialog.menu.name" placeholder="请输入组件名称"></el-input>
          </el-form-item>
          <el-form-item label="组件" prop="component">
            <el-input v-model="dialog.menu.component" placeholder="请输入组件"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="dialog.menu.icon" placeholder="请输入图标"></el-input>
          </el-form-item>
          <el-form-item label="链接地址" prop="path">
            <el-input v-model="dialog.menu.path" placeholder="请输入链接地址"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit('form')">提 交</el-button>
        </span>
      </el-dialog>
    </div>


  </div>
</template>

<script>
import HttpManager from "../../api/http";

export default {
  name: "Menu",
  components: {},
  data(){
    return {
      menus: [],
      query:{
        roleName: ''
      },
      selectIds: [],
      upload: {
        action: 'http://localhost:8080/sysRole/import',
        icon: 'fa fa-cloud-upload',
        text: '文件上传',
        headers: {
          authorization : window.localStorage.getItem('jwt')
        },
        disabled: false,
      },
      dialog: {
        title: '添加菜单',
        visible: false,
        menu: {
          name: '',
          level: 1,
          description: '-',
          dataScope: '本级'
        },
        rules: {
          name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            { min: 1, max: 10, message: '角色名称不超过10个字', trigger: 'blur' }
          ],
        }
      },
    }
  },
  methods: {
    get$menusList(){
      HttpManager.menuList().then(res => {
        this.menus = res.data.data;
      })
    },
    deleteRole(row){

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
    handleSelectChange(rows){
      let size = rows.length;
      let length = this.selectIds;
      /*size > length则说明在添加数据*/
      if (size > length){
        rows.forEach(e => {
          /*重复menuId不添加*/
          if (!this.selectIds.includes(e.menuId)){
            this.selectIds.push(e.menuId);
          }
        })
      }else {
        this.selectIds = [];
        rows.forEach(e => {
          this.selectIds.push(e.menuId);
        })
      }
    },
    handleSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          HttpManager.saveOrUpdateMenu(this.dialog.menu).then(res => {
            let menu = res.data.data;
            if (this.dialog.title.startsWith("修改")){
              this.roles.splice(this.dialog.menu.index, 1, menu)
            }else {
              this.roles.push(menu);
            }
          })
          this.dialog.visible = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });


    },
    tableRowClassName({row, rowIndex}) {
      row.index = rowIndex;
      if (rowIndex % 4 === 1) {
        return 'warning-row';
      } else if (rowIndex % 4 === 3) {
        return 'success-row';
      }
      return '';
    },
    handleSelectable(row, rowIndex){
      return true;
    },
    downloadRole(){

    },
    addMenu(){
      this.dialog.title = '添加菜单';
      this.dialog.visible = true;
      this.dialog.menu.create_by = localStorage.getItem('ms_username');
    },
    updateMenu(row){
      this.dialog.title = '更新菜单';
      this.dialog.visible = true;
      this.dialog.menu = Object.assign({}, row);
      this.dialog.menu.update_by = localStorage.getItem('ms_username');
    },
    deleteMenu(row){

    }
  },
  created() {
    this.get$menusList();
  }
}
</script>

<style scoped>
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
