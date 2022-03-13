import Login from "../views/Login";
import Forbidden from "../views/403"
import Home from "../components/Home";

let routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: Forbidden
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        component: () => import('../views/Dashboard'),
        meta: {
          title: '系统首页'
        }
      },
      {
        path: '/sys/user',
        component: () => import('../views/sys/User'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: '/sys/role',
        component: () => import('../views/sys/Role'),
        meta: {
          title: '角色管理'
        }
      },
      {
        path: '/sys/menu',
        component: () => import('../views/sys/Menu'),
        meta: {
          title: '菜单管理'
        }
      },
      {
        path: '/sys/dept',
        component: () => import('../views/sys/Dept'),
        meta: {
          title: '部门管理'
        }
      },
      {
        path: '/sys-tool/swagger',
        component: () => import('../views/sys-tool/Swagger'),
        meta: {
          title: 'Swagger接口文档'
        }
      },
      {
        path: '/sys-tool/druid',
        component: () => import('../views/sys-tool/Druid'),
        meta: {
          title: 'Druid监控后台'
        }
      },
      {
        path: '/sys-tool/movie',
        component: () => import('../views/sys-tool/Movie'),
        meta: {
          title: 'Movie'
        }
      }
    ]
  },
]

export default routes;
