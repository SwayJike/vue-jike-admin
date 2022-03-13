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
        <el-button type="primary" @click="addRole">
          <i style="margin-right: 6px" class="fa fa-plus" aria-hidden="true"></i>添加
        </el-button>
      </div>
    </div>

    <el-table
      :data="roles"
      style="width: 100%;"
      max-height="500"
      row-key="roleId"
      @selection-change="handleSelectChange"
      :row-class-name="tableRowClassName">
      <el-table-column
        type="selection"
        :selectable="handleSelectable"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="角色名">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="200">
        <template slot-scope="scope">
          <span>{{scope.row.description | ellipsis}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="dataScope"
        label="数据权限"
        width="100">
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
        width="200">
        <template slot-scope="scope">
          <el-button @click="menuMana(scope.row)" type="success">菜单列表</el-button>
          <el-button @click="updateUser(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button :disabled="scope.row.roleId == 1" @click="deleteRole(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <base-pager :total="pager.total" :list-info="get$roleList"
                :page-num="pager.pageNum" :page-size="pager.pageSize"
                @pageNum-change="pageNum => pager.pageNum = pageNum"
                @pageSize-change="pageSize => pager.pageSize = pageSize"></base-pager>

    <div>
      <el-dialog
        :visible.sync="dialog.visible"
        width="30%"
        center>
        <template slot="title">
          <span style="font-size: 26px;color: #08e7e0;letter-spacing: 2px">{{dialog.title}}</span>
        </template>

        <el-form :model="dialog.role" :rules="dialog.rules" ref="form" label-width="100px" class="demo-ruleForm">
          <el-form-item label="角色名" prop="name">
            <el-input v-model="dialog.role.name" placeholder="请输入角色名"></el-input>
          </el-form-item>
          <el-form-item label="角色级别" prop="level">
            <el-input-number v-model="dialog.role.level" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="dialog.role.description" placeholder="请输入描述信息"></el-input>
          </el-form-item>
          <el-form-item label="数据权限" prop="dataScope">
            <el-input v-model="dialog.role.dataScope" placeholder="请输入数据权限"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit('form')">提 交</el-button>
        </span>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        :visible.sync="menuDialog.visible"
        width="30%"
        center>
        <template slot="title">
          <span style="font-size: 26px;color: #08e7e0;letter-spacing: 2px">{{menuDialog.title}}</span>
        </template>
        <el-tree
          :data="menuDialog.menus"
          show-checkbox
          node-key="menuId"
          ref="tree"
          @check="currentChecked"
          :default-checked-keys="menuDialog.checkedMenuIds"
          :props="{children: 'children',label: 'title'}">
        </el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="menuSubmit">提 交</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import HttpManager from "../../api/http";

export default {
  name: "Role",
  data(){
    return {
      roles: [],
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
      /*分页器*/
      pager: {
        pageNum: 1,
        pageSize: 20,
        total: 100,
        sizes: [20, 40, 60, 80],
      },
      dialog: {
        title: '添加角色',
        visible: false,
        role: {
          name: '',
          level: 1,
          description: '-',
          dataScope: '本级'
        },
        rules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 1, max: 10, message: '角色名称不超过10个字', trigger: 'blur' }
          ],
        }
      },
      menuDialog: {
        title: '菜单管理',
        visible: false,
        menus: [],
        roleId: '',
        checkedMenuIds: []
      }
    }
  },
  methods: {
    get$roleList(){
      HttpManager.roleList(this.pager, this.query).then(res => {
        let pageInfo = res.data.data;
        this.roles = pageInfo.list;
        this.pager.total = pageInfo.total;
      });
    },
    deleteRole(row){
      /*row存在则是删除当前行,否则删除多行*/
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        if (row){
          let roleId = row.roleId;
          HttpManager.removeRole(roleId).then(() => {
            let rowIndex = row.index;
            this.roles.splice(rowIndex,1);
          })
        }else {
          if (this.selectIds && this.selectIds.length > 0){
            HttpManager.removeSelectedRole(this.selectIds).then(() => {
              this.get$roleList();
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
    onError(){
      this.upload.text = '文件上传';
      this.upload.icon = 'fa fa-cloud-upload';
      this.upload.disabled = false;
    },
    onSuccess(){
      this.upload.text = '文件上传';
      this.upload.icon = 'fa fa-cloud-upload';
      this.upload.disabled = false;
    },
    beforeUpload(){
      this.upload.text = '正在导入';
      this.upload.icon = 'el-icon-loading';
      this.upload.disabled = true;
      /*导入成功后刷新列表*/
    },
    handleSelectChange(rows){
      let size = rows.length;
      let length = this.selectIds;
      /*size > length则说明在添加数据*/
      if (size > length){
        rows.forEach(e => {
          /*重复roleId不添加*/
          if (!this.selectIds.includes(e.roleId)){
            this.selectIds.push(e.roleId);
          }
        })
      }else {
        this.selectIds = [];
        rows.forEach(e => {
          this.selectIds.push(e.roleId);
        })
      }
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
      return (row.roleId != 1);
    },
    downloadRole(){

    },
    addRole(){
      this.dialog.title = '添加角色';
      this.dialog.visible = true;
      this.dialog.role.createBy = localStorage.getItem('ms_username');
    },
    updateUser(row){
      this.dialog.title = '修改角色';
      this.dialog.visible = true;
      this.dialog.role = Object.assign({}, row);
      this.dialog.role.updateBy = localStorage.getItem('ms_username');
    },
    menuMana(row){
      HttpManager.roleMenu(row.roleId).then(res => {
        this.menuDialog.checkedMenuIds = res.data.data;
        this.menuDialog.roleId = row.roleId;
        this.menuDialog.visible = true;
        this.resetChecked();
      })
    },
    currentChecked (nodeObj, SelectedObj) {
      this.menuDialog.checkedMenuIds = SelectedObj.checkedKeys;   // 这是选中的节点的key数组
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },
    menuSubmit(){
      HttpManager.updateRoleMenu(this.menuDialog.roleId, this.menuDialog.checkedMenuIds).then(res => {
        this.menuDialog.visible = false;
      })
    },
    handleSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          HttpManager.saveOrUpdateRole(this.dialog.role).then(res => {
            let role = res.data.data;
            if (this.dialog.title.startsWith("修改")){
              this.roles.splice(this.dialog.role.index, 1, role)
            }else {
              this.roles.push(role);
            }
          })
           this.dialog.visible = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });


    },
  },
  created() {
    this.get$roleList();
    HttpManager.menuList().then(res => {
      this.menuDialog.menus = res.data.data;
    })
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 10) {
        return value.slice(0, 10) + "...";
      }
      return value;
    }

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

.aa{
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;
word-break:keep-all;
}
</style>
