import Login from "../views/Login";
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
    ]
  },
]

export default routes;
