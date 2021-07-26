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
    >
      <el-table-column v-if="false" align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="200">
        <template slot-scope="scope">
          {{ scope.row.usernameCN }}
        </template>
      </el-table-column>
      <el-table-column label="账号" width="200" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工号" width="200" align="left">
        <template slot-scope="scope">
          {{ scope.row.jobNumber }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="110" align="left">
        <template slot-scope="scope">
          {{ scope.row.sex==1?'男':'女' }}
        </template>
      </el-table-column>
      <el-table-column label="生日" width="200" align="left">
        <template slot-scope="scope">
          {{ scope.row.birthday }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="220" align="left">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="电话" width="160" align="left">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="身份证" width="*" align="left">
        <template slot-scope="scope">
          {{ scope.row.idCard }}
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

    <Pageable :total="total" @fetchData="fetchData" />

    <el-dialog :visible.sync="detailFormVisible" :close-on-click-modal="false">
      <el-form ref="detailForm" :model="detailForm" size="mini">
        <el-form-item label="用户账号">
          <el-input v-model="detailForm.username" />
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="detailForm.usernameCN" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="detailForm.password" />
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="detailForm.jobNumber" />
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="detailForm.idCard" />
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="detailForm.sex" />
        </el-form-item>
        <el-form-item label="生日">
          <el-input v-model="detailForm.birthday" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="detailForm.email" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="detailForm.phone" />
        </el-form-item>
        <el-form-item label="所属角色">
          <el-select
            v-model="detailForm.roleList"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="fetchRoleList"
            :loading="listLoading"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="detailForm.remark" type="textarea" />
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
import { queryByPage, save, remove } from '@/api/user'
import { queryList } from '@/api/role'
import Pageable from '@/components/Pageable'
import { removeArrayElement } from '@/utils/index'

export default {
  components: { Pageable },
  data() {
    return {
      total: 0,
      pageNum: 1,
      pageSize: 10,
      list: null,
      listLoading: true,
      detailFormVisible: false,
      detailForm: {},
      roleList: []
    }
  },
  watch() {
    {
      return false
    }
  },
  created() {
    this.fetchData(this.pageNum, this.pageSize)
    this.fetchRoleList()
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
    },
    fetchRoleList(query) {
      queryList(query).then((response) => {
        this.roleList = response.data
      })
    }
  }
}
</script>
