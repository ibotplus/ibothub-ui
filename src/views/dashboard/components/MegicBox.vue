<template>
  <div>
    {{ userName }}
    <el-button type="primary" @click="add()">显示时间</el-button>
  </div>
</template>

<script>
export default {
  name: 'MegicBox',
  props: {
    userName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  methods: {
    add: function() {
      this.$emit('triggerShowClock')
    }
  }
}
</script>
