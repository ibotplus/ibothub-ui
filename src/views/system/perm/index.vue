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
      <el-table-column label="redirect" width="300">
        <template slot-scope="scope">
          {{ scope.row.redirect }}
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

  </div>
</template>

<script>
import { queryByPage } from '@/api/permission'

export default {
  data() {
    return {
      treeList: [],
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      queryByPage(1, 10).then(response => {
        const _this = this
        const list = response.data.records
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
    }
  }
}
</script>
