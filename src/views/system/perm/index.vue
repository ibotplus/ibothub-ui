<template>
  <div class="app-container">

    <el-row class="zx-btn-bar">
      <el-button type="primary" @click="handleCreate()">新增</el-button>
      <el-button type="primary">导出</el-button>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="treeList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="权限名称" width="300">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="权限标识" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路径" width="300">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column label="排序" width="80">
        <template slot-scope="scope">
          {{ scope.row.order }}
        </template>
      </el-table-column>
      <el-table-column label="redirect" width="200">
        <template slot-scope="scope">
          {{ scope.row.redirect }}
        </template>
      </el-table-column>
      <el-table-column label="类型" width="120">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="菜单" width="80">
        <template slot-scope="scope">
          {{ scope.row.isMenu===1?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
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

    <Dialog
      :detail-form-visible="detailFormVisible"
      @updateDialogVisible="updateDialogVisible"
      @handleDialogSave="handleDialogSave"
    >
      <el-form ref="detailForm" :model="detailForm">
        <el-form-item label="上级权限">
          <el-input v-model="detailForm.parentId" />
        </el-form-item>
        <el-form-item label="权限名称">
          <el-input v-model="detailForm.title" />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="detailForm.key" />
        </el-form-item>
        <el-form-item label="访问路径">
          <el-input v-model="detailForm.path" />
        </el-form-item>
        <el-form-item label="跳转路径">
          <el-input v-model="detailForm.redirect" :disabled="detailForm.isLayout=='0'" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="detailForm.order" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="detailForm.iconFont" />
        </el-form-item>
        <el-form-item label="Layout">
          <el-radio v-model="detailForm.isLayout" :label="1">是</el-radio>
          <el-radio v-model="detailForm.isLayout" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否是菜单">
          <el-radio v-model="detailForm.isMenu" :label="1">是</el-radio>
          <el-radio v-model="detailForm.isMenu" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="类型（分类/模块/按钮）">
          <el-radio v-model="detailForm.type" label="CATEGORY">分类</el-radio>
          <el-radio v-model="detailForm.type" label="MODULE">模块</el-radio>
          <el-radio v-model="detailForm.type" label="BUTTON">按钮</el-radio>
        </el-form-item>
      </el-form>
    </Dialog>

  </div>
</template>

<script>
import { queryList, save, remove } from '@/api/permission'
import Dialog from '@/components/Dialog'
import { removeArrayElement } from '@/utils/index'

export default {
  components: { Dialog },
  data() {
    return {
      treeList: [],
      listLoading: true,
      detailFormVisible: false,
      detailForm: { }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      queryList().then(response => {
        const _this = this
        const list = response.data
        const treeList = []
        list.filter(item => item.parentId === null)
          .forEach(item => {
            _this.fillChildren(list, item)
            treeList.push(item)
          })
        this.treeList = treeList
        this.listLoading = false
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
    },
    async handleDialogSave() {
      console.log(this.detailForm)
      if (this.detailForm.isLayout === '1') {
        this.detailForm.component = 'Layout'
      } else {
        this.detailForm.component = null
      }
      await save(this.detailForm)
      this.updateDialogVisible(false)
      this.fetchData()
    },
    updateDialogVisible(val) {
      this.detailFormVisible = val
    },
    handleCreate() {
      this.detailForm = { isLayout: 0, isMenu: 1, type: 'CATEGORY', order: 1 }
      this.updateDialogVisible(true)
    },
    handleEdit(row) {
      if (row.component === null) {
        row.isLayout = 0
      } else {
        row.isLayout = 1
      }
      this.detailForm = { ...row }
      this.updateDialogVisible(true)
    },
    async handleRemove(row) {
      await remove(row.id)
      this.fetchData()
    }
  }
}
</script>
