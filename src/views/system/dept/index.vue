<template>
  <div class="app-container">
    <el-row class="zx-btn-bar">
      <el-button type="primary" @click="handleCreate">新增</el-button>
      <el-button type="primary">导出</el-button>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="部门名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
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
            v-if="scope.row.key!=='ROOT_COMPANY'"
            title="确定删除吗？"
            @onConfirm="handleRemove(scope.row)"
          >
            <el-button slot="reference" type="text" size="small">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <Dialog
      :detail-form-visible="detailFormVisible"
      @updateDialogVisible="updateDialogVisible"
      @handleDialogSave="handleDialogSave"
    >
      <el-form ref="detailForm" :model="detailForm">
        <el-form-item label="上级部门">
          <el-select
            v-model="detailForm.parentId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="fetchDeptList"
            :loading="listLoading"
          >
            <el-option
              v-for="item in deptList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input v-model="detailForm.name" />
        </el-form-item>
        <el-form-item label="部门标识">
          <el-input v-model="detailForm.key" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="detailForm.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import { queryByPage, save, remove } from '@/api/dept'
import Dialog from '@/components/Dialog'
import { queryList as queryDeptList } from '@/api/dept'

export default {
  components: { Dialog },
  data() {
    return {
      list: null,
      pageNum: 1,
      pageSize: 10,
      listLoading: true,
      detailFormVisible: false,
      detailForm: {
        name: ''
      },
      deptList: []
    }
  },
  created() {
    this.fetchData()
    this.fetchDeptList()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      queryByPage(this.pageNum, this.pageSize).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.pageNum = response.data.current
        this.pageSize = response.data.size
      })
    },
    handleCreate() {
      this.detailForm = {}
      this.detailFormVisible = true
    },
    handleDialogSave() {
      console.log(this.detailForm)
      save(this.detailForm).then(() => {
        this.updateDialogVisible(false)
        this.fetchData()
      })
    },
    updateDialogVisible(val) {
      this.detailFormVisible = val
    },
    handleEdit(row) {
      this.detailForm = row
      this.detailFormVisible = true
    },
    handleRemove(row) {
      remove(row.id).then(() => {
        this.fetchData()
      })
    },
    fetchDeptList(query) {
      if (query) {
        this.deptKeyword = query
      }
      queryDeptList(query).then((response) => {
        response.data.forEach((dept) => {
          this.deptList.push({ id: dept.id, name: dept.name })
        })
      })
    }
  }
}
</script>
