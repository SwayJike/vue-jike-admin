<template>
  <div>
    <!--   功能列表-->
    <div class="inline-list">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="角色名:">
          <el-input @keydown.enter.native.prevent="get$menusList" v-model="query.roleName" placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="get$menusList">
            <i style="margin-right: 6px" class="fa fa-search"></i>查询
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

          <el-form-item label="父级菜单" prop="pid">
            <el-select v-model="dialog.menu.pid" placeholder="请选择父级菜单(可不选)">
              <el-option
                v-for="item in menuOptions"
                :key="item.menuId"
                :label="item.title"
                :value="item.menuId">
              </el-option>
            </el-select>
          </el-form-item>
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
            <e-icon-picker size="mini" v-model="dialog.menu.icon" placeholder="请选择图标"/>
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

<!--    <div>{{}}</div>-->

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
      menuOptions: [],
      query:{
        title: ''
      },
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
          title: '',
          name: '',
          component: '',
          icon: '',
          path: '',
          iFrame: false,
          cache: false,
          hidden: false,
        },
        /*分页器*/
        pager: {
          pageNum: 1,
          pageSize: 20,
          total: 100,
          sizes: [20, 40, 60, 80],
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
    //TODO: 搜索功能待做
    get$menusList(){
      HttpManager.menuList(this.pager, this.query).then(res => {
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
            this.get$menusList();
            /*let menu = res.data.data;
            if (this.dialog.title.startsWith("修改")){
              this.findAndUpdateChild(this.menus, menu)
              //this.menus.splice(this.dialog.menu.index, 1, menu)
            }else {
              this.menus.push(menu);
            }*/
          })
          this.dialog.visible = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    findAndDelete(menus, menu){
      menus.forEach((e, i) => {
        if (e.children && e.children.length > 0){
          this.findAndDelete(e.children, menu);
        }else {
          if (e.menuId == menu.menuId){
            menus.splice(i, 1);
          }
        }
      })
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
    initMenu(){
      return {
        title: '',
        name: '',
        component: '',
        icon: '',
        path: '',
        iFrame: false,
        cache: false,
        hidden: false,
      }
    },
    addMenu(){
      this.dialog.title = '添加菜单';
      this.dialog.visible = true;
      this.dialog.menu = this.initMenu();
      this.dialog.menu.createBy = localStorage.getItem('ms_username');
    },
    updateMenu(row){
      this.dialog.title = '修改菜单';
      this.dialog.visible = true;
      this.dialog.menu = Object.assign({}, row);
      this.dialog.menu.children = [];
      this.dialog.menu.cache = null;
      this.dialog.menu.hidden = null;
      this.dialog.menu.iFrame = null;
      this.dialog.menu.updateBy = localStorage.getItem('ms_username');
    },
    deleteMenu(row){
      /*row存在则是删除当前行,否则删除多行*/
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        HttpManager.removeMenu(row.menuId).then(() => {
          this.get$menusList();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  created() {
    this.get$menusList();
    HttpManager.menus().then(res => {
      this.menuOptions = res.data.data;
    })
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
