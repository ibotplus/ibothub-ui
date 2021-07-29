<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-tree
          :data="treeList"
          node-key="id"
          :props="defaultProps"
          default-expand-all
        >
          <span slot-scope="{ node }" class="custom-tree-node" @click.stop="fetchUserData(pageNum, pageSize, node)">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                icon="el-icon-circle-plus-outline"
                @click.stop="handleCreate(node)"
              />

              <el-button
                type="text"
                icon="el-icon-edit"
                @click.stop="handleEdit(node)"
              />

              <el-popconfirm
                v-if="node.key!=='ROOT_COMPANY'"
                title="确定删除吗？"
                @onConfirm="handleRemove(node.key)"
              >
                <el-button
                  slot="reference"
                  type="text"
                  class="ibot-tree-btn"
                  @click.stop="()=>{}"
                >
                  <i class="el-icon-delete" />
                </el-button>
              </el-popconfirm>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="20">
        <el-table
          v-loading="listLoading"
          :data="userList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="用户名" width="*">
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
        </el-table>

        <Pageable :total="total" @fetchData="fetchUserData" />

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
                  v-for="(item, index) in deptList"
                  :key="index"
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryByPage, save, remove } from '@/api/dept'
import Dialog from '@/components/Dialog'
import { queryList as queryDeptList } from '@/api/dept'
import { queryByPage as queryUserByPage } from '@/api/user'
import Pageable from '@/components/Pageable'

export default {
  components: { Dialog, Pageable },
  data() {
    return {
      list: [],
      treeList: [],
      userList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      listLoading: false,
      detailFormVisible: false,
      detailForm: {
        name: ''
      },
      deptList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      }
    }
  },
  created() {
    this.fetchData()
    // this.fetchDeptList()
    this.fetchUserData(this.pageNum, this.pageSize)
  },
  methods: {
    fetchUserData(pageNum, pageSize, node) {
      this.listLoading = true
      const condition = {}
      if (node) {
        condition.deptId = node.key
      }
      queryUserByPage(pageNum, pageSize, condition).then(response => {
        this.userList = response.data.records
        this.total = response.data.total
        this.pageNum = response.data.current
        this.pageSize = response.data.size
        this.listLoading = false
      })
    },
    fetchData() {
      this.deptList = []
      this.treeList = []
      const _this = this

      // 渲染部门树
      queryDeptList().then((response) => {
        const list = response.data

        list.forEach((dept) => {
          this.deptList.push(dept)
        })

        list.filter(item => item.parentId === null)
          .forEach(item => {
            _this.fillChildren(list, item)
            _this.treeList.push(item)
          })
      })
    },
    fillChildren(list, parent) {
      list.forEach(elem => {
        if (elem.parentId === parent.id) {
          this.fillChildren(list, elem)
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
    handleCreate(node) {
      console.log(node)
      this.detailForm = { parentId: node.parent.key || '' }
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
    handleEdit(node) {
      this.detailForm = { id: node.key, name: node.label, parentId: node.parent.key || '', key: node.data.key }
      this.detailFormVisible = true
    },
    handleRemove(id) {
      remove(id).then(() => {
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
<style lang="css" scoped>
.ibot-tree-btn{
  margin-left: 10px;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
