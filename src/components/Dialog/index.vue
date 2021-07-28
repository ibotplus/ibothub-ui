<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <slot />
    <div slot="footer">
      <el-button type="primary" @click="handleSave()">确定</el-button>
      <el-button @click="handleClose()">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'Dialog',
  props: {
    detailFormVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.detailFormVisible
      },
      set(val) {
        this.$emit('updateDialogVisible', val)
      }
    }
  },
  methods: {
    handleSave() {
      this.$emit('handleDialogSave')
    },
    handleClose() {
      this.$emit('updateDialogVisible', false)
    }
  }
}
</script>
