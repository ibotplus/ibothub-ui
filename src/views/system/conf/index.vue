<template>
  <div class="app-container">
    系统设置面板
  </div>
</template>

<script>

export default {

  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = false
    }
  }
}
</script>
