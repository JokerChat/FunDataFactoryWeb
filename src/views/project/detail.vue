<template>
  <div class="app-container">
    <el-card class="project-detail-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="成员列表" name="user">
          <el-row>
            <el-col :span="16">
              <el-tooltip effect="dark" content="只有项目负责人和组长可以添加成员哦" placement="top">
                <el-button size="small" type="primary" @click="addUserProjectRole()">添加成员<i class="el-icon-question el-icon--right" /></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="8">
              <div style="width:100%;">
                <div id="project-left" style="width:55%;float:left;padding:0px 5px">
                  <el-input v-model="listQuery.search" size="small" clearable placeholder="请输入用户名或邮箱号" />
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
          <div style="padding: 20px;">
            <el-empty v-show="lists.length === 0" description="暂无数据, 快点击【添加成员】添加一下吧!" />
            <el-table
              v-show="lists.length > 0"
              size="small"
              :data="lists"
              style="width: 100%"
            >
              <el-table-column
                align="center"
                type="index"
                label="序号"
                min-width="100px"
              />
              <el-table-column
                prop="username"
                align="center"
                label="用户账号"
                width="100px"
              />
              <el-table-column
                prop="name"
                align="center"
                label="用户姓名"
                width="100px"
              />
              <el-table-column
                prop="email"
                align="center"
                label="邮箱号"
                width="200px"
              />
              <el-table-column
                prop="create_name"
                align="center"
                label="创建人"
                width="100px"
              />
              <el-table-column
                prop="create_time"
                align="center"
                label="创建时间"
                width="150px"
              />
              <el-table-column
                prop="project_role"
                align="center"
                label="用户权限"
                min-width="100px"
              >
                <template slot-scope="{row}">
                  <el-select v-model="row.project_role" size="mini" placeholder="请选择角色类型" style="width:80px" @change="selectChange(row)">
                    <el-option
                      v-for="item in role"
                      :key="item.type"
                      :label="item.name"
                      :value="item.type"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column fixed="right" align="center" label="操作" min-width="100px">
                <template slot-scope="{row}">
                  <el-popconfirm
                    title="确定要删除该角色吗?"
                    confirm-button-text="确定"
                    cancel-button-text="点错了"
                    cancel-button-type="Primary"
                    @confirm="deleteUserProjectRole(row.id)"
                  >
                    <el-button slot="reference" type="text" size="small"><svg-icon icon-class="delete" /></el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getProjectRoleData" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="项目设置" name="setting">
          <el-row :gutter="20">
            <el-col :span="16" :offset="4">
              <div style="padding: 20px;">
                <el-form ref="projectForm" :rules="projectRules" :model="projectForm" size="small" label-width="120px">
                  <el-form-item label="项目名称" prop="project_name">
                    <el-input v-model="projectForm.project_name" placeholder="请输入项目名称" />
                  </el-form-item>
                  <el-form-item label="脚本目录名" prop="directory">
                    <el-input v-model="projectForm.directory" placeholder="请输入项目脚本目录名" />
                  </el-form-item>
                  <el-form-item label="项目负责人" prop="owner">
                    <el-tooltip effect="dark" content="输入用户姓名/用户名/邮箱号即可搜索哦~" placement="top">
                      <el-select
                        v-model="projectForm.owner"
                        filterable
                        remote
                        clearable
                        reserve-keyword
                        placeholder="请选择项目负责人"
                        :remote-method="remoteOwnerSearch"
                        :loading="searchLoading"
                      >
                        <el-option
                          v-for="item in owners"
                          :key="item.id"
                          :label="`${item.username}(${item.email})`"
                          :value="item.username"
                        />
                      </el-select>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item label="项目拉取方式" prop="pull_type">
                    <el-select v-model="projectForm.pull_type" filterable clearable placeholder="请选择项目拉取方式" @change="typeChange(projectForm.pull_type)">
                      <el-option
                        v-for="item in types"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="git项目名" prop="git_project">
                    <el-input v-model="projectForm.git_project" placeholder="请输入git项目名" />
                  </el-form-item>
                  <el-form-item label="git地址" prop="git_url">
                    <el-input v-model="projectForm.git_url" placeholder="请输入git地址" />
                  </el-form-item>
                  <el-form-item label="git分支名" prop="git_branch">
                    <el-input v-model="projectForm.git_branch" placeholder="请输入git分支名" />
                  </el-form-item>
                  <el-form-item v-if="projectForm.pull_type===0" label="git账号" prop="git_account">
                    <el-input v-model="projectForm.git_account" placeholder="请输入git账号" />
                  </el-form-item>
                  <el-form-item v-if="projectForm.pull_type===0" label="git密码" prop="git_password">
                    <el-input
                      :key="passwordType"
                      ref="git_password"
                      v-model="projectForm.git_password"
                      :type="passwordType"
                      style="width:200px"
                      placeholder="请输入git密码"
                    />
                    <el-tooltip effect="dark" content="git密码采用AES加密存储, 请放心哦" placement="top">
                      <span @click="showPwd">
                        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                      </span>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item label="项目描述" prop="description">
                    <el-input v-model="projectForm.description" type="textarea" placeholder="请输入项目描述" />
                  </el-form-item>
                  <el-form-item v-if="projectForm.pull_type===1" label="公钥" prop="rsa_pub_key">
                    <el-input style="width:300px" v-model="projectForm.rsa_pub_key" :disabled="true"/>
                    <el-tooltip effect="dark" content="点击复制按钮即可复制公钥哦" placement="top">
                      <span>
                        <el-button size="mini" type="success" @click="copyKey(projectForm.rsa_pub_key)">复制</el-button>
                      </span>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item label="是否私有" prop="private">
                    <div>
                      <el-tooltip effect="dark" content="设置私有后, 只有超管、项目负责人、项目组长和组员才能看到哦" placement="top">
                        <el-switch v-model="projectForm.private" style="width:40px" />
                      </el-tooltip>
                    </div>
                  </el-form-item>
                  <div align="center">
                    <el-button type="primary" icon="el-icon-edit-outline" size="small" @click="updateSubmit('projectForm')">修改</el-button>
                  </div>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      title="新增成员"
      width="500px"
      :visible.sync="dialogFrom"
      :close-on-click-modal="false"
      @close="cancelSubmit('roleForm')"
    >
      <el-form ref="roleForm" :inline="true" :rules="rules" :model="roleForm" size="small">
        <el-form-item label="用户名" prop="user_id">
          <el-tooltip effect="dark" content="输入用户姓名/用户名/邮箱号即可搜索哦~" placement="top">
            <el-select
              v-model="roleForm.user_id"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入姓名/邮箱/账号搜索"
              style="width:150px"
              :remote-method="remoteUserSearch"
              :loading="searchLoading"
            >
              <el-option
                v-for="item in users"
                :key="item.id"
                :label="`${item.username}(${item.email})`"
                :value="item.id"
              />
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="角色" prop="project_role">
          <el-select v-model="roleForm.project_role" placeholder="请选择角色类型" style="width:150px">
            <el-option
              v-for="item in role"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
        <div align="center">
          <el-button type="primary" size="small" @click="addSubmit('roleForm')">确定</el-button>
          <el-button type="danger" size="small" @click="cancelSubmit('roleForm')">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Decrypt } from '@/utils/aes.js'
import { projectDetail, getRoleList, insertProjectRole, updateProjectRole, updateProject, deleteProjectRole } from '@/api/project'
import { searchUser } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
  name: 'Projecdetail',
  components: { Pagination },
  props: {},
  data() {
    return {
      searchLoading: false,
      lists: [],
      listQuery: {
        page: 1,
        limit: 20,
        project_id: this.$route.params.id,
        search: null
      },
      users: [],
      owners: [],
      types: [
        {
          type: 0,
          name: 'HTTP'
        },
        { type: 1,
          name: 'SSH'
        }
      ],
      dialogFrom: false,
      total: 0,
      projectForm: {
        id: this.$route.params.id,
        project_name: '',
        description: '',
        directory: '',
        owner: '',
        git_url: '',
        pull_type: null,
        git_branch: '',
        git_account: null,
        git_project: '',
        rsa_pub_key: null,
        git_password: null,
        private: false
      },
      passwordType: 'password',
      role: [
        {
          type: 0,
          name: '组员'
        },
        { type: 1,
          name: '组长'
        }
      ],
      projectRules: {
        git_project: [
          { required: true, message: '请输入git项目名', trigger: 'blur' }
        ],
        project_name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        cases: [
          { required: true, message: '请输入项目脚本目录名', trigger: 'blur' }
        ],
        owner: [
          { required: true, message: '请选择项目负责人', trigger: 'change' }
        ],
        pull_type: [
          { required: true, message: '请选择拉取方式', trigger: 'change' }
        ],
        git_url: [
          { required: true, message: '请输入git地址', trigger: 'blur' }
        ],
        git_branch: [
          { required: true, message: '请输入git分支名', trigger: 'blur' }
        ],
        git_account: [
          { required: true, message: '请输入git账号', trigger: 'blur' }
        ],
        git_password: [
          { required: true, message: '请输入git密码', trigger: 'blur' }
        ],
        private: [
          { required: true }
        ]
      },
      rules: {
        project_role: [
          { required: true, message: '请选择角色类型', trigger: 'change' }
        ],
        user_id: [
          { required: true, message: '请选择用户', trigger: 'change' }
        ]
      },
      roleForm: {
        user_id: '',
        project_role: null,
        project_id: this.$route.params.id
      },
      activeName: 'user',
      searchForm: {
        keyword: ''
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getProjectRoleData()
    // this.getProjectDetail()
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === 'user') {
        this.getProjectRoleData()
      } else if (tab.name === 'setting') {
        this.getProjectDetail().then(() => {
          this.remoteOwnerSearch(this.projectForm.owner)
        })
      }
    },
    search() {
      this.getProjectRoleData()
    },
    refresh() {
      this.listQuery.page = 1
      this.listQuery.limit = 20
      this.listQuery.search = null
      this.getProjectRoleData()
    },
    addUserProjectRole() {
      this.dialogFrom = true
    },
    addSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.add(formName)
        }
      })
    },
    cancelSubmit(formName) {
      // 等页面刷新完之后，再执行回调函数中的方法，因为this.dialogFrom = false 它是异步的
      this.$nextTick(() => {
        this.dialogFrom = false
      })
      this.$refs[formName].resetFields()
      this.users = []
      console.log(this.roleForm)
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.git_password.focus()
      })
    },
    updateSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.update()
        }
      })
    },
    async update() {
      console.log(this.projectForm)
      const { msg } = await updateProject(this.projectForm)
      // this.$parent.lists.unshift(data)
      this.$message({
        message: msg,
        type: 'success'
      })
      await this.getProjectDetail()
    },
    async add(formName) {
      const { msg } = await insertProjectRole(this.roleForm)
      this.$message({
        message: msg,
        type: 'success'
      })
      this.cancelSubmit(formName)
      await this.getProjectRoleData()
    },
    async deleteUserProjectRole(id) {
      const { msg } = await deleteProjectRole(id)
      this.$message({
        message: msg,
        type: 'success'
      })
      await this.getProjectRoleData()
    },
    async selectChange(row) {
      const { msg } = await updateProjectRole(row)
      this.$message({
        message: msg,
        type: 'success'
      })
      await this.getProjectRoleData()
    },
    async typeChange(type) {
      if (type === 1) {
        this.projectForm.git_account = null
        this.projectForm.git_password = null
      }
      // 切换时清除表单验证
      this.$refs.projectForm.clearValidate()
    },
    copyKey(key) {
      const _this = this
      this.$copyText(key).then(function(e) {
        _this.$notify({
          title: '成功',
          message: '公钥复制成功',
          type: 'success'
        })
      }, function(e) {
        _this.$notify({
          title: '失败',
          message: '公钥复制失败',
          type: 'error'
        })
        console.log(e)
      })
    },
    async getProjectDetail() {
      const { data } = await projectDetail(this.$route.params.id)
      this.projectForm = data
      if (this.projectForm.git_password !== null) {
        const decrypt_pwd = Decrypt(this.projectForm.git_password)
        this.projectForm.git_password = decrypt_pwd
      }
    },
    async getProjectRoleData() {
      const { data } = await getRoleList(this.listQuery)
      this.lists = data.lists
      this.total = data.total
    },
    async remoteUserSearch(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(async() => {
          this.searchForm.keyword = query
          const { data } = await searchUser(this.searchForm)
          this.searchLoading = false
          this.users = data
        }, 200)
      } else {
        this.users = []
      }
    },
    async remoteOwnerSearch(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(async() => {
          this.searchForm.keyword = query
          const { data } = await searchUser(this.searchForm)
          this.searchLoading = false
          this.owners = data
        }, 200)
      } else {
        this.owners = []
      }
    }
  }
}
</script>

<style>
.project-detail-card {
  border-radius: 10px;
}
</style>
