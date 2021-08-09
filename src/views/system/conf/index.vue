<template>
  <div class="app-container">
    <el-button type="primary" @click.stop="handleSave">保存</el-button>
    <el-form ref="form" label-width="150px">
      <el-form-item v-for="(item, index) in list" :key="index" :label="item.name">
        <el-input v-if="item.type!==9" v-model="item.value" />
        <el-upload
          v-if="item.type===9"
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
        >
          <img v-if="item.imageUrl" :src="item.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { queryList, save } from '@/api/conf'

export default {

  data() {
    return {
      list: [],
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      queryList({ name: '' }).then(res => {
        console.log(res.data)
        this.list = res.data
      })
      this.listLoading = false
    },
    handleSave() {
      console.log(this.list)
      save(this.list).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
<style lang="css" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 14px;
    color: #8c939d;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
  }
  .avatar {
    width: 32px;
    height: 32px;
    display: block;
  }
</style>
