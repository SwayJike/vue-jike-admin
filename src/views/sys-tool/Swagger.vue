<template>
  <keep-alive>
    <index src="http://localhost:8080/doc.html"></index>
  </keep-alive>
</template>

<script>
import index from '../../components/Iframe/Index'
export default {
  name: "Swagger",
  components:{
    index
  }
}
</script>

<style scoped>

</style>
