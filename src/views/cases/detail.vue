<template>
  <div class="app-container">
    <el-row :gutter="5">
      <el-col v-model="item" :span="14">
        <div style="padding:10px">
          <el-card class="request-card">
            <div slot="header">
              <el-row type="flex" :gutter="20" align="middle">
                <el-col :span="12">
                  <span style="font-weight: bold">{{ item.title }}</span>
                </el-col>
                <el-col :span="4">
                  <el-button size="small" type="primary" round icon="el-icon-link" @click="rpcCase">RPC调用</el-button>
                </el-col>
                <el-col :span="4">
                  <el-button size="small" type="primary" round icon="el-icon-edit" :loading="saveLoading" @click="saveCase()">保存场景</el-button>
                </el-col>
                <el-col :span="4">
                  <el-button size="small" type="primary" round icon="el-icon-video-play" :loading="loading" @click="runCase()">运行</el-button>
                </el-col>
              </el-row>
            </div>
            <el-descriptions :column="2" size="small">
              <el-descriptions-item label="负责人">{{ item.owner }}</el-descriptions-item>
              <el-descriptions-item label="业务分组">
                <el-tag size="small" type="success">{{ item.group_name }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="方法名">{{ item.name }}</el-descriptions-item>
              <el-descriptions-item label="所在项目">
                <el-tag size="small">{{ item.project_name }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="描述信息">
                {{ item.description }}
              </el-descriptions-item>
              <el-descriptions-item label="创建人">
                <el-tag size="small" type="info">{{ item.create_name }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                <el-tag size="small" type="warning">{{ item.create_time }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="更新时间">
                <el-tag size="small" type="warning">{{ item.update_time }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
            <div class="case_text case_item">
              <el-tabs v-model="activeTab" @tab-click="handleClick">
                <el-tab-pane label="参数组合" name="params">
                  <el-table
                    :data="params_list"
                    border
                    size="small"
                  >
                    <el-table-column
                      align="center"
                      prop="name"
                      label="场景名称"
                      width="120px"
                    />
                    <el-table-column
                      align="center"
                      prop="create_name"
                      label="创建人"
                      width="100px"
                    />
                    <el-table-column
                      align="center"
                      prop="create_time"
                      label="创建时间"
                      width="140px"
                    />
                    <el-table-column
                      align="center"
                      prop="update_name"
                      label="更新人"
                      width="100px"
                    />
                    <el-table-column
                      align="center"
                      prop="update_time"
                      label="更新时间"
                      width="140px"
                    />
                    <el-table-column align="center" label="操作" width="160px">
                      <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editCasesParams(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="fillCasesParams(scope.row)">填充</el-button>
                        <el-button type="text" size="small" @click="callCasesParams(scope.row)">外调</el-button>
                        <el-button type="text" size="small" @click="deleteCasesParams(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <pagination v-show="total>0" small :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getCasesParams" />
                </el-tab-pane>
                <el-tab-pane label="请求参数" name="request">
                  <el-table
                    :data="request_list"
                    border
                    size="small"
                    row-key="id"
                    :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
                  >
                    <el-table-column
                      align="center"
                      prop="field"
                      label="名称"
                      width="150px"
                    />
                    <el-table-column
                      align="center"
                      prop="type"
                      label="类型"
                      width="100px"
                    />
                    <el-table-column
                      align="center"
                      prop="optional"
                      label="是否必填"
                      width="100px"
                    >
                      <template slot-scope="{row}">
                        <el-tag
                          :type="row.optional === true ? 'danger' : 'success'"
                          disable-transitions
                        >{{ row.optional | required }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="defaultValue"
                      label="示例值"
                      width="100px"
                    />
                    <el-table-column
                      align="center"
                      prop="description"
                      label="描述"
                      width="auto"
                    />
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="请求示例" name="requestExample">
                  <edit-monaco ref="editRequestExample" v-model="item.example_param_in" readonly="false" />
                </el-tab-pane>
                <el-tab-pane label="返回参数" name="response">
                  <el-table
                    :data="response_list"
                    border
                    size="small"
                    row-key="id"
                    :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
                  >
                    <el-table-column
                      align="center"
                      prop="field"
                      label="名称"
                      width="150px"
                    />
                    <el-table-column
                      align="center"
                      prop="type"
                      label="类型"
                      width="100px"
                    />
                    <el-table-column
                      align="center"
                      prop="optional"
                      label="是否必填"
                      width="100px"
                    >
                      <template slot-scope="{row}">
                        <el-tag
                          :type="row.optional === true ? 'danger' : 'success'"
                          disable-transitions
                        >{{ row.optional | required }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="defaultValue"
                      label="示例值"
                      width="100px"
                    />
                    <el-table-column
                      align="center"
                      prop="description"
                      label="描述"
                      width="auto"
                    />
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="返回示例" name="responseExample">
                  <edit-monaco ref="editResponseExample" v-model="item.example_param_out" :readonly="readonly" />
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="10">
        <div style="padding:10px">
          <el-card v-if="actual_response===''" class="response-card">
            <el-empty v-if="actual_response===''" description="请运行一下该场景" />
          </el-card>
          <el-card v-if="actual_response!==''" class="response-card">
            <div slot="header" style="width:100%;height:32px;">
              <div id="left2" style="width:100%;line-height:32px;height:32px;float:left;display:table-cell">
                <span style="font-weight: bold">{{ result }}</span>
              </div>
            </div>
            <div class="case_text case_item">
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
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogStatus ==='add'?'新增参数组合':'编辑参数组合'"
      width="40%"
      :visible.sync="dialogFrom"
      :close-on-click-modal="false"
      @close="cancelSubmit('paramsForm')"
    >
      <el-form ref="paramsForm" :rules="rules" :model="paramsForm" size="small">
        <el-form-item label="参数组合名称" prop="name">
          <el-input v-model="paramsForm.name" />
        </el-form-item>
        <edit-monaco v-show="dialogStatus !=='add'" ref="editParamsForm" v-model="paramsForm.params" :readonly="readonly" />
        <div align="center">
          <el-button type="primary" size="small" @click="addSubmit('paramsForm')">确定</el-button>
          <el-button type="danger" size="small" @click="cancelSubmit('paramsForm')">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { detail, getParmasList, run, deleteParams, updateParams, insertParams } from '@/api/case'
import EditMonaco from '@/components/Code/monaco'
import { v4 } from 'uuid'

export default {
  name: 'CaseDetail',
  components: {
    EditMonaco, Pagination
  },
  // beforeRouteUpdate(to, from, next) {
  //   next()
  //   this.getCaseDetail()
  // },
  filters: {
    required(type) {
      const requiredMap = {
        true: '否',
        false: '是'
      }
      return requiredMap[type]
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
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        cases_id: ''
      },
      dialogStatus: '',
      dialogFrom: false,
      paramsForm: {
        id: null,
        cases_id: null,
        params: '',
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入参数组合名称', trigger: 'blur' }
        ]
      },
      item: {
        id: undefined,
        example_param_in: '',
        example_param_out: '',
        param_in: '',
        param_out: '',
        group_name: '',
        project_id: '',
        title: '',
        path: '',
        name: '',
        project_name: '',
        cases: ''
      },
      loading: false,
      saveLoading: false,
      actual_response: '',
      actual_request: '',
      actual_log: null,
      response_list: [],
      request_list: [],
      params_list: [],
      activeTab: 'request',
      actualTab: 'actualResponse',
      result: '',
      requests_id: ''
    }
  },
  computed: {
  },
  watch: {
    // '$route': function(to, from) {
    //   // 监听路由变化，重新刷新数据
    //   Object.assign(this.$data, this.$options.data())
    //   this.getCaseDetail()
    // }
    // $route:
    //   {
    //     handler: function(val, oldVal) {
    //       this.getCaseDetail()
    //     }
    //   }
  },
  created() {
    this.getCaseDetail()
  },
  methods: {
    async getCaseDetail() {
      this.listLoading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,0.7)'
      })
      try {
        const { data } = await detail(this.$route.params.id)
        this.item = data
        if (this.item.param_out != null) {
          this.response_list = JSON.parse(this.item.param_out)
        }
        if (this.item.param_in != null) {
          this.request_list = JSON.parse(this.item.param_in)
        }
        // 格式化示例请求参数
        this.item.example_param_out = JSON.stringify(JSON.parse(this.item.example_param_out), null, '\t')
        // 格式化示例返回参数
        this.item.example_param_in = JSON.stringify(JSON.parse(this.item.example_param_in), null, '\t')
        this.listLoading.close()
      } catch (err) {
        this.listLoading.close()
        console.log('出错了')
        console.log(err)
      }
    },
    async runCase() {
      try {
        this.loading = true
        // 生成32位请求id
        this.requests_id = v4().replaceAll('-', '')
        console.log(this.requests_id)
        const _this = this
        const run_data = {
          cases_id: this.item.id,
          group_name: this.item.group_name,
          title: this.item.title,
          project_id: this.item.project_id,
          path: this.item.path,
          method: this.item.name,
          params: JSON.parse(this.item.example_param_in),
          project: this.item.git_project,
          directory: this.item.directory,
          requests_id: this.requests_id
        }
        const { data } = await run(run_data)
        // 实际返回
        if (data.actual_response !== null) {
          this.actual_response = JSON.stringify(data.actual_response, null, '\t')
        } else {
          this.actual_response = data.actual_response
        }
        // 实际请求
        this.actual_request = JSON.stringify(data.actual_request, null, '\t')
        console.log(data.result)
        console.log(data)
        // 运行日志
        this.actual_log = data.log
        if (data.result === 0) {
          this.result = `【${this.requests_id}】脚本执行成功！！！耗时：${data.cost}！！！`
        } else if (data.result === 1) {
          this.result = `【${this.requests_id}】脚本执行异常！！！耗时：${data.cost}！！！`
        } else {
          this.result = `【${this.requests_id}】脚本执行失败！！！耗时：${data.cost}！！！`
        }
        console.log(this.result)
        if (data.result !== 2) {
          // 执行成功后跳转到实际返回tab
          this.actualTab = 'actualResponse'
          // 渲染数据
          setTimeout(function() {
            _this.$refs.actualResponseExample.layout()
          }, 50)
        } else {
          this.actualTab = 'actualLog'
          // 渲染数据
          setTimeout(function() {
            _this.$refs.actualLogExample.layout()
          }, 50)
        }
        // 执行成功后跳转到返回参数tab
        this.activeTab = 'response'
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    saveCase() {
      this.dialogStatus = 'add'
      this.dialogFrom = true
    },
    addSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogStatus === 'add') {
            this.add(formName)
          } else {
            this.edit(formName)
          }
        }
      })
    },
    async add(formName) {
      this.paramsForm.cases_id = this.item.id
      this.paramsForm.params = this.item.example_param_in
      const { msg } = await insertParams(this.paramsForm)
      this.$message({
        message: msg,
        type: 'success'
      })
      this.cancelSubmit(formName)
    },
    async edit(formName) {
      const { msg } = await updateParams(this.paramsForm)
      this.$message({
        message: msg,
        type: 'success'
      })
      this.cancelSubmit(formName)
      await this.getCasesParams()
    },
    cancelSubmit(formName) {
      // 等页面刷新完之后，再执行回调函数中的方法，因为this.dialogFrom = false 它是异步的
      this.$nextTick(() => {
        this.dialogFrom = false
      })
      this.$refs[formName].resetFields()
    },
    handleClick(tab, event) {
      let t
      clearTimeout(t)
      const _this = this
      if (tab.name === 'requestExample') {
        // this.$refs.editRequestExample.layout()
        t = setTimeout(function() {
          _this.$refs.editRequestExample.layout()
        }, 50)
      } else if (tab.name === 'responseExample') {
        t = setTimeout(function() {
          _this.$refs.editResponseExample.layout()
        }, 50)
      } else if (tab.name === 'actualResponse') {
        t = setTimeout(function() {
          _this.$refs.actualResponseExample.layout()
        }, 50)
      } else if (tab.name === 'params') {
        this.getCasesParams()
      }
    },
    actualClick(tab, event) {
      let t
      clearTimeout(t)
      const _this = this
      if (tab.name === 'actualRequest') {
        // this.$refs.editRequestExample.layout()
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
    },
    async getCasesParams() {
      this.listQuery.cases_id = this.item.id
      const { data } = await getParmasList(this.listQuery)
      this.params_list = data.lists
      this.total = data.total
    },
    editCasesParams(row) {
      const _this = this
      this.dialogStatus = 'edit'
      this.dialogFrom = true
      this.paramsForm.cases_id = this.item.id
      this.paramsForm.id = row.id
      this.paramsForm.name = row.name
      this.paramsForm.params = JSON.stringify(JSON.parse(row.params), null, '\t')
      // 渲染数据
      setTimeout(function() {
        _this.$refs.editParamsForm.layout()
      }, 50)
    },
    async deleteCasesParams(row) {
      const { msg } = await deleteParams(row.id)
      this.$message.success(msg)
      await this.getCasesParams()
    },
    fillCasesParams(row) {
      const _this = this
      this.activeTab = 'requestExample'
      // 格式化json
      this.item.example_param_in = JSON.stringify(JSON.parse(row.params), null, '\t')
      // 渲染数据
      setTimeout(function() {
        _this.$refs.editRequestExample.layout()
      }, 50)
      this.$message.success('填充成功')
    },
    callCasesParams(row) {
      const _this = this
      console.log(process.env.VUE_APP_BASE_API)
      const out_url = process.env.VUE_APP_BASE_API + 'cases/out?id=' + row.out_id
      this.$copyText(out_url).then(function(e) {
        _this.$notify({
          title: '成功',
          message: '外调链接复制成功',
          type: 'success'
        })
      }, function(e) {
        _this.$notify({
          title: '失败',
          message: '外调链接复制失败',
          type: 'error'
        })
        console.log(e)
      })
    },
    rpcCase() {
      const _this = this
      const out_url = process.env.VUE_APP_BASE_API + 'cases/rpc/' + this.item.name
      this.$copyText(out_url).then(function(e) {
        _this.$notify({
          title: '成功',
          message: 'RPC调用链接复制成功',
          type: 'success'
        })
        console.log(e)
      }, function(e) {
        _this.$notify({
          title: '失败',
          message: 'RPC调用链接复制失败',
          type: 'error'
        })
        console.log(e)
      })
    }
  }

}
</script>

<style>
.case_text {
  font-size: 14px;
}

.case_item {
  margin-bottom: 18px;
}

.request-card {
  width: 100%;
}
.response-card {
  width: 100%;
}
.el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
