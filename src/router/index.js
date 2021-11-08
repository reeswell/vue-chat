import {createRouter, createWebHistory} from 'vue-router'
import store from '../store/index'

const routes = [
  {
    path: '/',
    redirect: 'Chat'
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/Chats/chats'),
    meta: {
      keepAlive: false,
      index: 2,
      requiresAuth: true,
      tag: 'chat'
    }
  },
  {
    path: '/chat/searchLocal',
    name: 'SearchLocal',
    component: () => import('@/views/SearchLocal/searchLocal'),
    meta: {
      keepAlive: true,
      index: 4,
      requiresAuth: true,
      tag: 'search'
    }
  },
  {
    path: '/chat/searchFriend',
    name: 'SearchFriend',
    component: () => import('@/views/SearchFriend/searchFriend'),
    meta: {
      keepAlive: true,
      index: 6,
      requiresAuth: true
    }
  },
  {
    path: '/chat/friendDetail/:id',
    name: 'FriendDetail',
    component: () => import('@/views/FriendDetail/friendDetail'),
    meta: {
      keepAlive: true,
      index: 7,
      requiresAuth: true
    }
  },
  {
    path: '/chat/SendFriendValidate/:id',
    name: 'SendFriendValidate',
    component: () => import('@/views/SendFriendValidate/sendFriendValidate'),
    meta: {
      keepAlive: false,
      index: 8,
      requiresAuth: true
    }
  },
  {
    path: '/chat/searchGroup',
    name: 'SearchGroup',
    component: () => import('@/views/SearchGroup/searchGroup'),
    meta: {
      keepAlive: true,
      index: 6,
      requiresAuth: true
    }
  },
  {
    path: '/chat/sendGroupValidate/:id',
    name: 'SendGroupValidate',
    component: () => import('@/views/SendGroupValidate/sendGroupValidate'),
    meta: {
      keepAlive: false,
      index: 6,
      requiresAuth: true
    }
  },
  {
    path: '/chat/groupDetail/:id',
    name: 'GroupDetail',
    component: () => import('@/views/GroupDetail/groupDetail'),
    meta: {
      keepAlive: true,
      index: 6,
      requiresAuth: true
    }
  },
  {
    path: '/chat/createGroup',
    name: 'CreateGroup',
    component: () => import('@/views/CreateGroup/createGroup'),
    meta: {
      keepAlive: false,
      index: 6,
      requiresAuth: true
    }
  },

  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contacts/contacts'),
    meta: {
      keepAlive: false,

      index: 2,
      requiresAuth: true,
      tag: 'contact'
    }
  },
  {
    path: '/manager',
    name: 'Manager',
    component: () => import('@/views/Manager/manager'),
    meta: {
      keepAlive: false,
      index: 2,
      requiresAuth: true
    }
  },
  {
    path: '/manager/accountSafe',
    name: 'AccountSafe',
    component: () => import('@/views/AccountSafe/accountSafe'),
    meta: {
      keepAlive: false,
      index: 4,
      requiresAuth: true
    }
  },
  {
    path: '/manager/accountSafe/editPhone',
    name: 'EditPhone',
    meta: {
      keepAlive: false,
      index: 5,
      requiresAuth: true
    },
    component: () => import('@/views/EditPhone/editPhone')
  },
  {
    path: '/manager/accountSafe/editPassword',
    name: 'EditPassword',
    meta: {
      keepAlive: false,
      index: 5,
      requiresAuth: true
    },
    component: () => import('@/views/EditPassword/editPassword')
  },
  {
    path: '/manager/sysMes',
    name: 'SysMes',
    component: () => import('@/views/SysMes/sysMes'),
    meta: {
      keepAlive: false,
      index: 4,
      requiresAuth: true
    }
  },
  {
    path: '/manager/sysMes/applyDetail/:id',
    name: 'ApplyDetail',
    component: () => import('@/views/ApplyDetail/applyDetail'),
    meta: {
      keepAlive: false,
      index: 5,
      requiresAuth: true
    }
  },
  {
    path: '/manager/edit',
    name: 'Edit',
    meta: {
      keepAlive: false,
      index: 4,
      requiresAuth: true
    },
    component: () => import('@/views/Edit/edit')
  },

  {
    path: '/manager/edit/editName',
    name: 'EditName',
    meta: {
      keepAlive: false,
      index: 5,
      requiresAuth: true
    },
    component: () => import('@/views/EditName/editName')
  },
  {
    path: '/manager/edit/editGender',
    name: 'EditGender',
    meta: {
      keepAlive: false,
      index: 5,
      requiresAuth: true
    },
    component: () => import('@/views/EditGender/editGender')
  },
  {
    path: '/manager/edit/editEmail',
    name: 'EditEmail',
    meta: {
      keepAlive: false,
      index: 5,
      requiresAuth: true
    },
    component: () => import('@/views/EditEmail/editEmail')
  },
  {
    path: '/manager/edit/editAge',
    name: 'EditAge',
    meta: {
      keepAlive: false,
      index: 5,
      requiresAuth: true
    },
    component: () => import('@/views/EditAge/editAge')
  },
  {
    path: '/chat/mesPanel/:id',
    name: 'MesPanel',
    meta: {
      keepAlive: true,
      index: 5,
      requiresAuth: true
    },
    component: () => import('@/views/MesPanel/mesPanel')
  },
  {
    path: '/chat/mesPanel/friendsInfo/:id',
    name: 'FriendsInfo',
    meta: {
      keepAlive: false,
      index: 6,
      requiresAuth: true
    },
    component: () => import('@/views/FriendsInfo/friendsInfo')
  },
  {
    path: '/chat/mesPanel/groupInfo/:id',
    name: 'GroupInfo',
    meta: {
      keepAlive: false,
      index: 6,
      requiresAuth: true
    },
    component: () => import('@/views/GroupInfo/groupInfo')
  },
  {
    path: '/chat/mesPanel/friendsInfo/editRemark/:id',
    name: 'EditRemark',
    meta: {
      keepAlive: false,
      index: 7,
      requiresAuth: true
    },
    component: () => import('@/views/EditRemark/editRemark')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/login'),
    meta: {
      keepAlive: false,
      index: 20
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
// 未登录用户路由拦截
router.beforeEach((to, from, next) => {
  const loginStatus = store.state.loginStatus

  if (to.meta.requiresAuth) {
    if (loginStatus) {
      next()
    } else {
      store.dispatch('logOut')
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})

export default router
