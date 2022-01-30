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
      style="width: 100%"
      max-height="750"
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
    </el-table>

    <base-pager></base-pager>

  </div>
</template>

<script>
export default {
  name: "Dept",
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
      }
    }
  },
  methods: {
    get$roleList(){

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
    addRole(){

    }
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
