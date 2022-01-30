<template>
  <keep-alive>
    <index src="http://localhost:8080/druid/login.html"></index>
  </keep-alive>
</template>

<script>
import index from '../../components/Iframe/Index'
export default {
  name: "Druid",
  components:{
    index
  }
}
</script>

<style scoped>

</style>
