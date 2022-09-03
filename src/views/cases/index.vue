<template>
  <div class="app-container">
    <el-card class="index-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in tableTabs"
          :key="index"
          :label="item.label"
          :name="item.name"
        >
          <span slot="label"><svg-icon :icon-class="item.class" /> {{ item.label }}</span>
        </el-tab-pane>
        <div class="app-container">
          <el-row :gutter="10">
            <el-col :span="18">
              <el-form ref="form" size="small" :inline="true" :model="listQuery">
                <el-form-item label="项目: ">
                  <el-select v-model="listQuery.project" clearable filterable placeholder="请选择项目" class="groupSelect">
                    <el-option
                      v-for="item in projects"
                      :key="item.id"
                      :label="item.project_name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="场景名称: ">
                  <el-select
                    v-model="listQuery.case_id"
                    style="width:220px"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    placeholder="请输入场景名称/描述/负责人"
                    :remote-method="remoteSearch"
                    :loading="searchLoading"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="`${item.group_name}-${item.title}`"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <div style="float: right;">
                    <el-button icon="el-icon-search" size="small" type="primary" @click="searchCase()">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="refresh()">重置</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="6">
              <el-form ref="form" size="small" :inline="true" :model="syncProject">
                <el-form-item>
                  <el-select v-model="syncProject.id" clearable filterable placeholder="请选择项目" class="groupSelect">
                    <el-option
                      v-for="item in projects"
                      :key="item.id"
                      :label="item.project_name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <div style="float: right;">
                    <el-button icon="el-icon-magic-stick" size="small" type="primary" @click="sync()">同步场景</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-empty v-show="lists.length === 0" :description="operationClass(listQuery.show)" />
        </div>
        <el-row :gutter="10">
          <el-col v-for="(item, i) in lists" :key="i" :lg="8" :xl="6" style="padding: 15px;">
            <el-card class="case-card" :body-style="{ padding: '10px' }" shadow="hover">
              <div style="padding: 10px;">
                <div @click="onSelect(item)">
                  <div style="width:100%;height:32px;">
                    <div id="left" style="width:75%;line-height:32px;height:32px;float:left;display:table-cell">
                      <span style="color: #409EFF;font-weight: bold">
                        {{ item.title }}
                      </span>
                    </div>
                    <div id="right" style="width:25%;float:left;">
                      <el-tag
                        type="success"
                        disable-transitions
                      >{{ item.group_name }}</el-tag>
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
                <div style="width:100%;height:32px;text-align:center">
                  <div id="like" style="width:50%;text-align: center;float:left;">
                    <el-button class="myButton" type="text" size="medium" @click="likeSubmit(item.id)"><svg-icon :icon-class="likeClass(item.like)" /></el-button>
                    <span style="font-size: 13px;font-weight: bold">{{ item.like_num }}</span>
                  </div>
                  <div id="collection" style="width:50%;text-align: center;float:left;">
                    <el-button class="myButton" type="text" size="medium" @click="collectionSubmit(item.id)"><svg-icon :icon-class="collectionClass(item.collection)" /></el-button>
                    <span style="font-size: 13px;font-weight: bold">{{ item.collection_num }}</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <pagination v-show="total>0" :total="total" :page-sizes="pageSizes" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getCaseList" />
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { group, getList, likeCase, collectionCase, getSearch } from '@/api/case'
import { allProject, syncProject, readProject } from '@/api/project'
import Pagination from '@/components/Pagination'

export default {
  name: 'CaseIndex',
  components: { Pagination },
  data() {
    return {
      pageSizes: [12, 24, 36, 48],
      tableTabs: [
        {
          label: '全部',
          name: 'all',
          class: 'all'
        },
        {
          label: '我创建的',
          name: 'my',
          class: 'my'
        },
        {
          label: '我喜欢的',
          name: 'like',
          class: 'like'
        },
        {
          label: '我收藏的',
          name: 'collection',
          class: 'collection'
        }
      ],
      options: [],
      activeName: 'all',
      total: 0,
      lists: [],
      groups: [],
      projects: [],
      listLoading: null,
      searchLoading: false,
      redirect: '/case/detail/',
      syncProject: {
        id: ''
      },
      listQuery: {
        page: 1,
        limit: 12,
        show: 'all',
        project: undefined,
        case_id: undefined
      }
    }
  },
  created() {
    this.getGroups()
    this.getAllProject()
    this.getCaseList()
  },
  methods: {
    async remoteSearch(query) {
      if (query !== '') {
        console.log(query)
        this.searchLoading = true
        setTimeout(async() => {
          const { data } = await getSearch(query)
          this.searchLoading = false
          this.options = data
        }, 200)
      } else {
        this.options = []
      }
    },
    handleClick(tab, event) {
      this.listQuery.show = tab.name
      this.getCaseList()
      console.log(tab.name)
      console.log(tab, event)
    },
    likeClass(type) {
      const likeMap = {
        false: 'like',
        true: 'liked'
      }
      return likeMap[type]
    },
    collectionClass(type) {
      const collectionMap = {
        false: 'collection',
        true: 'collected'
      }
      return collectionMap[type]
    },
    operationClass(type) {
      const descriptionMap = {
        'like': '亲, 请点赞一下场景吧~',
        'my': '亲, 请创建一下场景并同步吧~',
        'collection': '亲, 请收藏一下场景吧~',
        'all': '亲, 暂无场景数据, 请同步一下场景吧~'
      }
      return descriptionMap[type]
    },
    async getGroups() {
      const { data } = await group()
      this.groups = data
      this.groups.forEach((name, index) => {
        this.tableTabs.push(
          {
            name: name,
            label: name,
            class: 'group'
          }
        )
      })
    },
    async getAllProject() {
      const { data } = await allProject()
      this.projects = data
    },
    async getCaseList() {
      this.listLoading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,0.7)'
      })
      try {
        const { data } = await getList(this.listQuery)
        this.lists = data.lists
        this.total = data.total
        this.listLoading.close()
      } catch (err) {
        this.listLoading.close()
        console.log(err)
      }
    },
    // 查询
    searchCase() {
      this.getCaseList()
    },
    // 刷新
    refresh() {
      this.listQuery.page = 1
      this.listQuery.limit = 20
      this.listQuery.case_id = undefined
      this.listQuery.group = undefined
      this.listQuery.project = undefined
      this.syncProject.id = undefined
      this.syncProject.projectName = undefined
      this.getCaseList()
      // this.getGroups()
      this.getAllProject()
    },
    // 同步项目
    async sync() {
      if (this.syncProject.id === '') {
        this.$message.error('请选择项目！！！')
        return
      }
      try {
        this.syncLoading = this.$loading({
          lock: true,
          text: '拼命同步中',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        const { msg } = await syncProject(this.syncProject.id)
        await this.$alert(msg, '数据同步成功', {
          showClose: false,
          confirmButtonText: '知道了',
          type: 'success',
          dangerouslyUseHTMLString: true
        })
        this.syncLoading.close()
        await this.getCaseList()
        // await this.getGroups()
      } catch (err) {
        this.syncLoading.close()
        console.log(err)
      }
    },
    async onSelect(item) {
      console.log(item)
      await readProject(item.project_id)
      this.$router.push({ path: this.redirect + item.id, query: { title: item.title }})
      // this.$route.meta.title = item.title
    },
    async likeSubmit(id) {
      console.log(id)
      const { msg } = await likeCase(id)
      this.$message.success(msg)
      await this.getCaseList()
    },
    async collectionSubmit(id) {
      console.log(id)
      const { msg } = await collectionCase(id)
      this.$message.success(msg)
      await this.getCaseList()
    }
  }
}
</script>

<style>
.searchInput {
  width: 200px;
}
.groupSelect {
  width: 150px;
}
.text {
  font-size: 14px;
}
.item {
  padding: 20px 0;
  height: 32px;
  width: 100%;
}
.myButton.el-button--medium {
  padding: 10px 20px;
  font-size: 20px;
  border-radius: 4px;
}
.myButton.el-button--text {
  color: #333333;
  background: 0 0;
  padding-left: 0;
  padding-right: 0;
}
.case-card {
  border-radius: 10px;
}
.index-card {
  border-radius: 10px;
}
</style>
