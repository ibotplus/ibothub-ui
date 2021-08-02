<template>
  <div class="app-container">

    <el-row class="zx-btn-bar">
      <el-button type="primary" @click="handleCreate()">新增</el-button>
      <el-button type="primary">导出</el-button>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      default-expand-all
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-tag v-for="(user, index) in props.row.userList" :key="index">
              {{ user.usernameCN }}
            </el-tag>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="标识" width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
      >
        <template #default="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm
            title="确定删除吗？"
            @onConfirm="handleRemove(scope.row)"
          >
            <el-button slot="reference" type="text" size="small">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <Pageable :total="total" :fetch-data-method="'fetchData'" @fetchData="fetchData" />

    <el-dialog :visible.sync="detailFormVisible" :close-on-click-modal="false">
      <el-form ref="detailForm" :model="detailForm">
        <el-form-item label="角色名称">
          <el-input v-model="detailForm.name" />
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input v-model="detailForm.key" />
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary" @click="handleSave()">确定</el-button>
          <el-button @click="handleClose()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { queryByPage, save, remove } from '@/api/role'
import Pageable from '@/components/Pageable'
import { removeArrayElement } from '@/utils/index'

export default {
  components: { Pageable },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      detailFormVisible: false,
      detailForm: {}

    }
  },
  created() {
    this.fetchData(this.pageNum, this.pageSize)
  },
  methods: {
    fetchData(pageNum, pageSize) {
      this.listLoading = true
      queryByPage(pageNum, pageSize).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.pageNum = response.data.current
        this.pageSize = response.data.size
        this.listLoading = false
      })
    },
    handleCreate() {
      this.detailForm = {}
      this.detailFormVisible = true
    },
    handleEdit(row) {
      this.detailForm = row
      this.detailFormVisible = true
    },
    handleClose() {
      this.detailFormVisible = false
    },
    handleSave() {
      save(this.detailForm).then(() => {
        this.handleClose()
        this.fetchData(this.pageNum, this.pageSize)
      })
    },
    handleRemove(row) {
      remove(row.id).then(() => {
        removeArrayElement(this.list, row.id)
      })
    }
  }
}
</script>
<style lang="css" scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .demo-table-expand .el-tag {
    margin-left: 10px;
  }

</style>
