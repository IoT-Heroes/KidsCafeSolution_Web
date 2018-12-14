<template>
  <div class="wrapper" :class="{'nav-open': $sidebar.showSidebar}">
    <side-bar>
      <sidebar-link to="/dashboard_user" v-if="this.isAuthor() === false">
        <md-icon>dashboard</md-icon>
        <p>대시보드</p>
      </sidebar-link>

      <sidebar-link to="/visited" v-if="this.isAuthor() === false">
        <md-icon>library_books</md-icon>
        <p>방문기록</p>
      </sidebar-link>

      <sidebar-link to="/ar_user" v-if="this.isAuthor() === false">
        <md-icon>content_paste</md-icon>
        <p>AR이용</p>
      </sidebar-link>

      <sidebar-link to="/childRegister" v-if="this.isAuthor() === false">
        <md-icon>person</md-icon>
        <p>자녀등록</p>
      </sidebar-link> 

      <sidebar-link to="/dashboard_admin" v-if="this.isAuthor() === true">
        <md-icon>dashboard</md-icon>
        <p>대시보드</p>
      </sidebar-link>

      <sidebar-link to="/" v-if="this.isAuthor() === true">
        <md-icon>person</md-icon>
        <p>키즈밴드 등록</p>
      </sidebar-link>
      
      <!-- 메뉴 권한 참고       -->
      <!-- methods에서 선연한 isAuthor == 'T' 일떄 y/n로 바꿔야함 -->
      <!-- methods에서 선연한 isAuthor() == true -> 관리자 false -> 사용자 -->

    </side-bar>

    <div class="main-panel">
       <top-navbar></top-navbar>
      <dashboard-content></dashboard-content>
    </div>
  </div>
</template>
  
<style lang="scss">
</style>
<script>

import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./Content.vue";

var auth;


export default {
  components: {
    TopNavbar,
    DashboardContent
  },
  data() {
    return{
      authority: String
    }
  },
  methods: {
    isAuthor() {
      this.authority = auth;
      if(this.authority == true) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    var userInfo = localStorage.getItem("userInfo");
    auth = JSON.parse(userInfo).isAuthor;
  }
};
</script>
