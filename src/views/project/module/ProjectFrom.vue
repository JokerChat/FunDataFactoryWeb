<template>
  <el-dialog
    title="新增项目"
    width="40%"
    :visible.sync="dialogFrom"
    :close-on-click-modal="false"
    @close="cancelSubmit('projectForm')"
  >
    <el-form ref="projectForm" :rules="rules" :model="projectForm" size="small" label-width="120px">
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
            :remote-method="remoteUserSearch"
            :loading="searchLoading"
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="`${item.username}-${item.email}`"
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
      <el-form-item label="git项目" prop="git_project">
        <el-input v-model="projectForm.git_project" placeholder="请输入项目名称" />
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
      <el-form-item label="是否私有" prop="private">
        <div>
          <el-tooltip effect="dark" content="设置私有后, 只有超管、项目负责人、项目组长和组员才能看到哦" placement="top">
            <el-switch v-model="projectForm.private" style="width:40px" />
          </el-tooltip>
        </div>
      </el-form-item>
      <div align="center">
        <el-button type="primary" size="small" @click="addSubmit('projectForm')">确定</el-button>
        <el-button type="danger" size="small" @click="cancelSubmit('projectForm')">取消</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { insertProject } from '@/api/project'
import { searchUser } from '@/api/user'

export default {
  name: 'ProjectFrom',
  props: {
    getProject: {
      type: Function,
      default: null
    },
    dialogStatus: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogFrom: false,
      searchLoading: false,
      users: [],
      projectForm: {
        id: null,
        project_name: '',
        description: '',
        directory: '',
        owner: '',
        pull_type: null,
        git_url: '',
        git_branch: '',
        git_account: null,
        git_password: null,
        git_project: '',
        private: false
      },
      searchForm: {
        keyword: ''
      },
      types: [
        {
          type: 0,
          name: 'HTTP'
        },
        { type: 1,
          name: 'SSH'
        }
      ],
      rules: {
        project_name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        directory: [
          { required: true, message: '请输入项目脚本目录名', trigger: 'blur' }
        ],
        owner: [
          { required: true, message: '请选择项目负责人', trigger: 'change' }
        ],
        pull_type: [
          { required: true, message: '请选择拉取方式', trigger: 'change' }
        ],
        git_project: [
          { required: true, message: '请输入git地址', trigger: 'blur' }
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
      passwordType: 'password'
    }
  },
  methods: {
    addSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogStatus === 'add') {
            this.add(formName)
          }
        }
      })
    },
    cancelSubmit(formName) {
      // 等页面刷新完之后，再执行回调函数中的方法，因为this.dialogFrom = false 它是异步的
      this.$nextTick(() => {
        this.dialogFrom = false
      })
      this.users = []
      this.$refs[formName].resetFields()
    },
    async typeChange(type) {
      if (type === 1) {
        this.projectForm.git_account = null
        this.projectForm.git_password = null
      }
    },
    async add(formName) {
      const { msg } = await insertProject(this.projectForm)
      // this.$parent.lists.unshift(data)
      this.$message({
        message: msg,
        type: 'success'
      })
      await this.getProject()
      this.cancelSubmit(formName)
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
    }
  }
}
</script>

<style scoped lang="less"></style>
