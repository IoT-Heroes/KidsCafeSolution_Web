import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import Dashboard from "@/pages/Dashboard.vue";
import AdminDashboard from "@/pages/AdminDashboard.vue";
import ChildProfile from "@/pages/ChildProfile.vue";
import Login from "@/pages/Login.vue";
import Visited from "@/pages/VisitedList.vue";
import Child from "@/pages/Child.vue";
import ArUser from "@/pages/ArUser.vue";

const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/",
    component: DashboardLayout,
    children: [
      {
        path: "dashboard_user",
        name: "사용자대시보드",
        component: Dashboard
      },
      {
        path: "dashboard_admin",
        name: "관리자대시보드",
        component: AdminDashboard
      },
      {
        path: "childprofile",
        name: "자녀목록",
        component: ChildProfile
      },
      {
        path: "visited",
        name: "방문기록",
        component: Visited
      },
      {
        path: "childRegister",
        name: "자녀등록",
        component: Child
      },
      {
        path: "ar_user",
        name: "사용자AR",
        component: ArUser
      }
      
    ]
  }
];

export default routes;
