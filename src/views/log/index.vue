<template>
  <div class="app-container">
    <el-card class="log-card">
      <el-form ref="listQuery" size="small" :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="请求id:">
          <el-input v-model="listQuery.requests_id" style="width: 200px" clearable placeholder="请输入32位请求id" />
        </el-form-item>
        <el-form-item label="调用方式:">
          <el-select v-model="listQuery.call_type" clearable filterable style="width: 100px">
            <el-option
              v-for="(item,key) in callMap"
              :key="key"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="执行状态:">
          <el-select v-model="listQuery.run_status" clearable filterable style="width: 100px">
            <el-option
              v-for="(item,key) in statusMap"
              :key="key"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="业务分组:">
          <el-select v-model="listQuery.group" clearable filterable style="width: 100px">
            <el-option
              v-for="item in groups"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目名:">
          <el-select v-model="listQuery.project" clearable filterable placeholder="请选择项目" style="width: 150px">
            <el-option
              v-for="item in projects"
              :key="item.id"
              :label="item.project_name"
              :value="item.project_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="查询信息:">
          <el-input v-model="listQuery.search" style="width: 230px" clearable placeholder="请输入场景标题/方法/日志信息" />
        </el-form-item>
        <el-form-item>
          <div style="float: right;">
            <el-button icon="el-icon-search" size="small" type="primary" @click="search()">查询</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="refresh('listQuery')">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div :style="{padding:'20px 0'}">
        <el-table v-loading="listLoading" :data="lists" style="width: 100%" size="small">
          <el-table-column align="center" prop="requests_id" label="请求ID" width="250px" />
          <el-table-column align="center" prop="project_name" label="项目名称" width="150px" />
          <el-table-column align="center" prop="directory" label="脚本目录" width="80px" />
          <el-table-column align="center" prop="group_name" label="业务线" width="80px" />
          <el-table-column align="center" prop="title" :show-overflow-tooltip="true" label="场景标题" width="130px" />
          <el-table-column align="center" prop="name" label="方法名" width="130px" />
          <el-table-column align="center" prop="path" label="脚本路径" width="180px" />
          <el-table-column align="center" prop="call_type" label="调用方式" width="100px">
            <template slot-scope="{row}">
              <el-tag
                :type="row.call_type === 0 ? 'success' :
                  row.call_type === 1 ? 'warning' :'primary'"
                effect="plain"
                size="small"
                disable-transitions
              >{{ row.call_type | callName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="run_status" label="执行状态" width="100px">
            <template slot-scope="{row}">
              <el-tag
                :type="row.run_status === 0 ? 'success' :
                  row.run_status === 1 ? 'warning' : 'danger'"
                size="small"
                disable-transitions
              >{{ row.run_status | statusName }}</el-tag>
            </template>
          </el-table-column>
<!--          <el-table-column align="center" prop="run_param_in" :show-overflow-tooltip="true" label="实际请求" width="100px" />-->
<!--          <el-table-column align="center" prop="run_param_out" :show-overflow-tooltip="true" label="实际返回" width="100px" />-->
<!--          <el-table-column align="center" prop="run_log" :show-overflow-tooltip="true" label="执行日志" width="300px" />-->
<!--          <el-table-column align="center" prop="create_id" label="执行人编码" min-width="100px" />-->
          <el-table-column align="center" prop="create_name" label="执行人" min-width="100px" />
          <el-table-column align="center" prop="create_time" label="执行时间" min-width="150px" />
          <el-table-column fixed="right" align="center" label="操作" min-width="80px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="detail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getRunLog" />
      </div>
      <el-drawer
        :title="title"
        size="50%"
        :visible.sync="drawer"
        direction="rtl"
        :before-close="handleClose"
        :destroy-on-close="true"
      >
        <div :style="{padding:'0 20px'}">
          <el-descriptions :column="3" size="medium">
            <el-descriptions-item label="项目名称">{{ logRow.project_name }}</el-descriptions-item>
            <el-descriptions-item label="脚本目录">{{ logRow.path }}</el-descriptions-item>
            <el-descriptions-item label="业务线">{{ logRow.group_name }}</el-descriptions-item>
            <el-descriptions-item label="场景标题">{{ logRow.title }}</el-descriptions-item>
            <el-descriptions-item label="方法名">{{ logRow.name }}</el-descriptions-item>
            <el-descriptions-item label="脚本路径">{{ logRow.path }}</el-descriptions-item>
            <el-descriptions-item label="调用方式">
              <el-tag
                :type="logRow.call_type === 0 ? 'success' :
                  logRow.call_type === 1 ? 'warning' :'primary'"
                effect="plain"
                size="small"
                disable-transitions
              >{{ logRow.call_type | callName }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="执行状态">
              <el-tag
                :type="logRow.run_status === 0 ? 'success' :
                  logRow.run_status === 1 ? 'warning' : 'danger'"
                size="small"
                disable-transitions
              >{{ logRow.run_status | statusName }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="执行人">{{ logRow.create_name }}</el-descriptions-item>
<!--            <el-descriptions-item label="执行人编码">{{ logRow.create_code }}</el-descriptions-item>-->
            <el-descriptions-item label="执行时间">{{ logRow.create_time }}</el-descriptions-item>

          </el-descriptions>
          <el-tabs v-model="actualTab" @tab-click="actualClick">
            <el-tab-pane label="实际请求" name="actualRequest">
              <edit-monaco ref="actualRequestExample" v-model="actual_request" :readonly="readonly" />
            </el-tab-pane>
            <el-tab-pane v-if="actual_response !== null" label="实际返回" name="actualResponse">
              <edit-monaco ref="actualResponseExample" v-model="actual_response" :readonly="readonly" />
            </el-tab-pane>
            <el-tab-pane v-if="actual_log !== null" label="运行日志" name="actualLog">
              <edit-monaco ref="actualLogExample" v-model="actual_log" :readonly="readonly" lang="markdown" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-drawer>
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import EditMonaco from '@/components/Code/monaco'
import { group, getLogList } from '@/api/case'
import { allProject } from '@/api/project'

export default {
  name: 'CaseLog',
  components: { Pagination, EditMonaco },
  filters: {
    callName(type) {
      const Map = {
        0: '平台调用',
        1: '外链调用',
        2: 'RPC调用'
      }
      return Map[type]
    },
    statusName(type) {
      const Map = {
        0: '执行成功',
        1: '执行异常',
        2: '执行失败'
      }
      return Map[type]
    }
  },
  props: {
    readonly: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      actualTab: 'actualRequest',
      drawer: false,
      title: '',
      actual_request: '',
      actual_response: '',
      actual_log: '',
      total: 0,
      lists: null,
      logRow: {},
      groups: [],
      callMap: {
        0: '平台调用',
        1: '外链调用',
        2: 'RPC调用'
      },
      statusMap: {
        0: '执行成功',
        1: '执行异常',
        2: '执行失败'
      },
      projects: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search: undefined,
        group: undefined,
        requests_id: undefined,
        project: undefined,
        call_type: undefined,
        run_status: undefined
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getRunLog()
    this.getAllProject()
    this.getGroups()
  },
  methods: {
    async getRunLog() {
      this.listLoading = true
      try {
        const { data } = await getLogList(this.listQuery)
        this.lists = data.lists
        this.total = data.total
        this.listLoading = false
      } catch (err) {
        this.listLoading = false
        console.log(err)
      }
    },
    async getGroups() {
      const { data } = await group()
      this.groups = data
    },
    async getAllProject() {
      const { data } = await allProject()
      this.projects = data
    },
    search() {
      console.log(this.listQuery)
      this.getRunLog()
    },
    refresh() {
      this.listQuery.page = 1
      this.listQuery.limit = 20
      this.listQuery.search = undefined
      this.listQuery.requests_id = undefined
      this.listQuery.group = undefined
      this.listQuery.project = undefined
      this.listQuery.call_type = null
      this.listQuery.run_status = undefined
      this.getRunLog()
      this.getAllProject()
      this.getGroups()
    },
    detail(row) {
      const _this = this
      this.logRow = row
      this.drawer = true
      // 实际返回
      if (row.run_param_out !== null) {
        this.actual_response = JSON.stringify(JSON.parse(row.run_param_out), null, '\t')
      } else {
        this.actual_response = row.run_param_out
      }
      // 实际请求
      this.actual_request = JSON.stringify(JSON.parse(row.run_param_in), null, '\t')
      // 运行日志
      this.actual_log = this.logRow.run_log
      setTimeout(function() {
        _this.$refs.actualRequestExample.layout()
      }, 50)
      this.title = '【' + row.requests_id + '】' + '运行日志详情'
    },
    handleClose(done) {
      this.actual_response = ''
      this.actual_request = ''
      this.actual_log = ''
      this.actualTab = 'actualRequest'
      done()
    },
    actualClick(tab, event) {
      let t
      clearTimeout(t)
      const _this = this
      if (tab.name === 'actualRequest') {
        t = setTimeout(function() {
          _this.$refs.actualRequestExample.layout()
        }, 50)
      } else if (tab.name === 'actualResponse') {
        t = setTimeout(function() {
          _this.$refs.actualResponseExample.layout()
        }, 50)
      } else if (tab.name === 'actualLog') {
        t = setTimeout(function() {
          _this.$refs.actualLogExample.layout()
        }, 50)
      }
    }
  }
}
</script>

<style>
.log-card {
  border-radius: 10px;
}
</style>
