<template>
  <div class="app-container">
    <el-card class="project-card">
      <el-form ref="form" size="small" :inline="true" :model="listQuery" class="demo-form-inline">
        <el-row>
          <el-col :span="16">
            <el-tooltip effect="dark" content="只有超级管理员和组长可以创建项目" placement="top">
              <el-button size="small" type="primary" @click="addProject()">创建项目<i class="el-icon-question el-icon--right" /></el-button>
            </el-tooltip>
          </el-col>
          <el-col :span="8">
            <div style="width:100%;">
              <div id="project-left" style="width:55%;float:left;padding:0px 5px">
                <el-input v-model="listQuery.search" size="small" clearable placeholder="请输入项目名" />
              </div>
              <div id="project-right" style="width:45%;float:right;padding:0px 5px">
                <el-button-group>
                  <el-button icon="el-icon-search" size="small" type="primary" @click="search">搜索</el-button>
                  <el-button icon="el-icon-refresh" size="small" type="primary" @click="refresh()">重置</el-button>
                </el-button-group>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-empty v-show="lists.length === 0" description="暂无项目, 快点击【创建项目】创建一个吧!" />
      <div :style="{padding:'20px 0'}">
        <el-row :gutter="10">
          <el-col v-for="(item, i) in lists" :key="i" :lg="8" :xl="6" style="padding: 15px;">
            <el-card class="project-card" :body-style="{ padding: '10px' }" shadow="hover">
              <div style="padding: 10px;">
                <div @click="onSelect(item)">
                  <div style="width:100%;height:32px;">
                    <div id="left" style="width:90%;line-height:32px;height:32px;float:left;display:table-cell">
                      <span style="color: #409EFF;font-weight: bold">
                        {{ item.project_name }}
                      </span>
                    </div>
                    <div id="right" style="width:10%;float:left;">
                      <el-dropdown size="small" placement="bottom-start" :show-timeout="100" @command="handleCommand">
                        <span>
                          <svg-icon icon-class="more" class-name="card-more-icon" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item :command="{item:item, event: 'setting'}"><svg-icon icon-class="setting" />
                            配置权限</el-dropdown-item>
                          <el-dropdown-item :command="{item:item, event: 'init'}"><svg-icon icon-class="init" />
                            初始化项目</el-dropdown-item>
                          <el-dropdown-item :command="{item:item, event: 'sync'}"><svg-icon icon-class="sync" />
                            同步项目</el-dropdown-item>
                          <el-dropdown-item :command="{item:item, event: 'delete'}"><svg-icon icon-class="delete" />
                            删除项目</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                  <div class="text item">
                    {{ item.description }}
                  </div>
                  <div class="text item">
                    <div id="owner" style="width:35%;text-align: left;float:left;">
                      {{ '负责人: ' + item.owner }}
                    </div>
                    <div id="updateTime" style="width:65%;text-align: right;float:left;">
                      <span style="color: #409eff">
                        {{ '更新时间: ' + item.update_time }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :page-sizes="pageSizes" :limit.sync="listQuery.limit" @pagination="getProject" />
      </div>
    </el-card>
    <ProjectFrom ref="ProjectFrom" :dialogStatus="dialogStatus" :getProject="getProject" />
  </div>
</template>

<script>
import { getProjectList, deleteProject, syncProject, initProject, readProject, operationProject } from '@/api/project'
import Pagination from '@/components/Pagination'
import ProjectFrom from './module/ProjectFrom'

export default {
  name: 'Project',
  components: { Pagination, ProjectFrom },
  filters: {
  },
  props: {
  },
  data() {
    return {
      pageSizes: [9, 18, 27, 45],
      total: 0,
      lists: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 18,
        search: null
      },
      redirect: '/system/project/',
      dialogStatus: '',
      syncLoading: null,
      initLoading: null,
      users: []
    }
  },
  created() {
    this.getProject()
  },
  methods: {
    // 获取项目列表
    async getProject() {
      this.listLoading = true
      try {
        const { data } = await getProjectList(this.listQuery)
        this.lists = data.lists
        this.total = data.total
        this.listLoading = false
      } catch (err) {
        this.listLoading = false
        console.log(err)
      }
    },
    // 搜索项目
    search() {
      this.getProject()
    },
    // 刷新按钮
    refresh() {
      this.listQuery.page = 1
      this.listQuery.limit = 20
      this.listQuery.search = null
      this.getProject()
    },
    async onSelect(item) {
      await operationProject(item.id)
      this.$router.push({ path: this.redirect + item.id })
    },
    // 删除项目
    remove(row) {
      this.$confirm('是否删除 ' + row.project_name + ' 项目 ? 此操作会将项目下的所有造数场景删除！！！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '点错了',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteProject(row.id)
        this.$message.success(msg)
        await this.getProject()
      }).catch(() => {
      })
    },
    // 同步项目
    sync(row) {
      this.$confirm('是否同步 ' + row.project_name + ' 项目 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消`',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        this.syncLoading = this.$loading({
          lock: true,
          text: '拼命同步中',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        const { msg } = await syncProject(row.id)
        await this.$alert(msg, '数据同步成功', {
          showClose: false,
          confirmButtonText: '知道了',
          type: 'success',
          lockScroll: false,
          dangerouslyUseHTMLString: true
        })
        this.syncLoading.close()
      }).catch((err) => {
        this.syncLoading.close()
        console.log(err)
      })
    },
    // 初始化项目
    init(row) {
      this.$confirm('是否初始化 ' + row.project_name + ' 项目 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消`',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        this.initLoading = this.$loading({
          lock: true,
          text: '拼命初始化中',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        const { msg } = await initProject(row.id)
        this.initLoading.close()
        await this.$alert(msg, '项目初始化成功', {
          showClose: false,
          confirmButtonText: '知道了',
          type: 'success'
        })
      }).catch((err) => {
        console.log(err)
        this.initLoading.close()
      })
    },
    // 新增项目
    addProject() {
      this.dialogStatus = 'add'
      this.$refs.ProjectFrom.dialogFrom = true
    },
    async handleCommand(command) {
      console.log(command)
      if (command.event === 'delete') {
        await operationProject(command.item.id)
        this.remove(command.item)
      } else if (command.event === 'init') {
        await readProject(command.item.id)
        this.init(command.item)
      } else if (command.event === 'sync') {
        await readProject(command.item.id)
        this.sync(command.item)
      } else if (command.event === 'setting') {
        await operationProject(command.item.id)
        this.$router.push({ path: this.redirect + command.item.id })
      }
    }
  }
}
</script>

<style>
.el-notification {white-space:pre-wrap !important; }
.project-card {
  border-radius: 10px;
}
.text {
  font-size: 14px;
}
.item {
  padding: 20px 0;
  height: 32px;
  width: 100%;
}
.card-more-icon {
  float:left;
  font-size: 30px;
}

</style>
