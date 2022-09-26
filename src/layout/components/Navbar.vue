<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-tooltip effect="dark" content="点我联系作者哦~" placement="top">
        <div class="right-menu-item hover-effect">
          <svg-icon icon-class="weixin" @click="click" />
        </div>
      </el-tooltip>
      <el-dropdown class="avatar-container" trigger="click">
        <el-tooltip effect="dark" content="点我获取更多教程~" placement="top">
          <div class="avatar-wrapper">
            <img src="@/icons/svg/sunhuo.png" class="user-avatar">
            <i class="el-icon-caret-bottom" />
          </div>
        </el-tooltip>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/case/index">
            <el-dropdown-item>
              场景列表
            </el-dropdown-item>
          </router-link>
          <router-link to="/system/user">
            <el-dropdown-item>用户管理</el-dropdown-item>
          </router-link>
          <router-link to="/system/project">
            <el-dropdown-item>项目管理</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzI2MjU0Mzg4MA==&action=getalbum&album_id=2379389965001687041">
            <el-dropdown-item>数据工厂教程</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  data() {
    return {
      images: {
        weixin: require('@/icons/svg/sunhuo.png')
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // 退出登录清空所有的tagsView
      await this.$store.dispatch('tagsView/delAllViews')
      // 去除重定向功能
      this.$router.push(`/login`)
    },
    click() {
      this.$alert('<div style="text-align: center;"><img height="400" width="325" src="/static/img.png" alt=""></div>', '联系我', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '知道了',
        closeOnPressEscape: true,
        closeOnClickModal: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 18px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
