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
            <br>
            <el-tag v-for="(item, index) in props.row.permList" :key="item.id+index" type="success">
              {{ item.title }}
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
            <el-button slot="reference" type="text" size="small" class="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <Pageable :total="total" :fetch-data-method="'fetchData'" @fetchData="fetchData" />

    <Dialog
      :detail-form-visible="detailFormVisible"
      @updateDialogVisible="updateDialogVisible"
      @handleDialogSave="handleDialogSave"
    >
      <el-form ref="detailForm" :model="detailForm">
        <el-form-item label="角色名称">
          <el-input v-model="detailForm.name" />
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input v-model="detailForm.key" />
        </el-form-item>
        <el-form-item label="权限">
          <el-select-tree
            v-model="detailForm.permIdList"
            width="300px"
            multiple
            clearable
            check-strictly
            default-expand-all
            :data="permTreeList"
            :props="defaultPermProps"
          />
        </el-form-item>
      </el-form>
    </Dialog>

  </div>
</template>

<script>
import { queryByPage, save, remove } from '@/api/role'
import Pageable from '@/components/Pageable'
import Dialog from '@/components/Dialog'
import { removeArrayElement } from '@/utils/index'
import { queryList as queryPermList } from '@/api/permission'
import ElSelectTree from 'el-select-tree'

export default {
  components: { Pageable, Dialog, ElSelectTree },
  data() {
    return {
      list: [],
      listLoading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      detailFormVisible: false,
      detailForm: { permIdList: [] },
      permTreeList: [],
      defaultPermProps: {
        children: 'children',
        label: 'title',
        value: 'id'
      }

    }
  },
  created() {
    this.fetchData(this.pageNum, this.pageSize)
    this.fetchPermData()
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
      this.detailForm = { permIdList: [] }
      this.detailFormVisible = true
    },
    handleEdit(row) {
      this.detailForm = { ...row }
      this.detailForm.permIdList = []
      if (row.permList) {
        row.permList.forEach(item => {
          this.detailForm.permIdList.push(item.id)
        })
      }
      this.detailFormVisible = true
    },
    handleDialogSave() {
      console.log(this.detailForm)
      save(this.detailForm).then(() => {
        this.updateDialogVisible(false)
        this.fetchData(this.pageNum, this.pageSize)
      })
    },
    updateDialogVisible(val) {
      this.detailFormVisible = val
    },
    handleRemove(row) {
      remove(row.id).then(() => {
        removeArrayElement(this.list, row.id)
      })
    },
    fetchPermData() {
      queryPermList().then(response => {
        const _this = this
        const list = response.data
        const permTreeList = []
        list.filter(item => item.parentId === null)
          .forEach(item => {
            _this.fillChildren(list, item)
            permTreeList.push(item)
          })
        this.permTreeList = permTreeList
        console.log(permTreeList)
      })
    },
    fillChildren(routeList, parent) {
      routeList.forEach(elem => {
        if (elem.parentId === parent.id) {
          this.fillChildren(routeList, elem)
          if (elem.children && elem.children.length === 0) {
            delete elem['children']
            delete elem['redirect']
          }
          if (!parent.children) {
            parent.children = []
          }
          parent.children.push(elem)
        }
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
    margin: 10px 10px 0 0;
  }

</style>
