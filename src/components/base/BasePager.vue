<template>
  <div class="pager">
    <div class="block">
      <el-pagination
        background
        :page-sizes="sizes"
        :page-size="pageSize"
        @size-change="handleSizeChange"
        @current-change="handlePageNumChange"
        layout="sizes, prev, pager, next, jumper, ->, total"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "BasePager",
  props:{
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    sizes: {
      type: Array,
      default: function () {
        return [20, 40, 60, 80];
      }
    },
    total: {
      type: Number,
      default: 0
    },
    listInfo: {
      type: Function,
      default: function (){
        console.log("start get listInfo...")
      }
    }
  },
  methods:{
    handleSizeChange(pageSize){
      this.$emit('pageSize-change', pageSize);
      this.listInfo();
    },
    handlePageNumChange(pageNum){
      this.$emit('pageNum-change', pageNum)
      this.listInfo();
    },
  }
}
</script>

<style scoped>
.pager{
  display: flex;
  justify-content: end;
  align-items: start;
  margin-top: 20px;
}
</style>
