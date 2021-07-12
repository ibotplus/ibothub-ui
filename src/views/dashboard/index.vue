<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <div class="dashboard-text">name: {{ name }}
        <span v-show="showClock"><i class="el-icon-alarm-clock" /> {{ currentTime }}</span>
      </div>
      <el-col :span="12">
        <el-card class="box-card">
          <h1><a href="https://cn.vuejs.org/v2/guide/instance.html" target="_blank">Vue生命周期</a></h1>
          <h3 v-for="(item, index) in cycleList" :key="index">
            <el-tag :type="item.type">{{ item.cycleName }}</el-tag> user name is {{ item.userName }}
          </h3>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <h1>Vue组件传参方式</h1>
          <MegicBox :user-name="cycleList[0].userName" @triggerShowClock="triggerShowClock" />
        </el-card>
      </el-col>

    </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MegicBox from './components/MegicBox'
import { format } from 'date-fns'

export default {
  name: 'Dashboard',
  components: { MegicBox },
  data() {
    return {
      cycleList: [],
      createdText: '',
      showClock: false,
      currentTime: 'undefined'
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created: function() {
    this.createdText = `user name is ${this.userName}, module name is: ${this.moduleName}`
    console.log(this.createdText)
    this.cycleList.push({ userName: '赵', type: 'warning', cycleName: 'created' })
    this.$nextTick(() => {
      window.setInterval(() => {
        this.currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      }, 1000)
    })
  },
  beforeMount: function() {
    this.cycleList.push({ userName: '钱', type: 'info', cycleName: 'beforeMount' })
  },
  mounted: function() {
    this.cycleList.push({ userName: '孙', type: 'success', cycleName: 'mounted' })
  },
  methods: {
    triggerShowClock: function() {
      this.showClock = !this.showClock
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
