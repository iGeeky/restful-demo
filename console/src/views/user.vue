<template>
  <page-template model="user" />
</template>
<script>
import PageTemplate from './page-template' // secondary package based on el-pagination

export default {
  name: 'User',
  components: { PageTemplate },
}
</script>
