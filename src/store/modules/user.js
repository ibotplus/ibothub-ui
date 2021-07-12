import { login, logout, getInfo, routes } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import adminAvatar from '@/assets/images/admin.jpg'
import Layout from '@/layout'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    accessRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTES: (state, accessRoutes) => {
    state.accessRoutes = accessRoutes
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        console.log('token -> ' + data)
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('用户信息获取失败')
        }

        const { usernameCN } = data

        commit('SET_NAME', usernameCN)
        commit('SET_AVATAR', adminAvatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // 获取用户菜单
  getAccessRoutes({ commit, state }) {
    return new Promise((resolve, reject) => {
      routes(state.token).then(response => {
        console.log(response)
        const { data } = response

        if (!data || data.length === 0) {
          commit('SET_ROUTES', [])
          return resolve([])
        }

        const userRoutes = getUserRoutes(data)

        commit('SET_ROUTES', userRoutes)
        resolve(userRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

/**
 * 通过一个平铺的菜单集合，返回一个树状菜单
 * @param {*} routeList
 */
function getUserRoutes(routeList) {
  const routeTreeList = []
  const accessList = []
  routeList
    .filter(elem => elem.key !== 'dashboard')
    .forEach(elem => {
      const item = {
        id: elem.id,
        parentId: elem.parentId,
        path: '/' + elem.path,
        component: elem.component === 'Layout' ? Layout : resolve => require([`@/views/${elem.path}/index`], resolve),
        redirect: elem.redirect,
        meta: { title: elem.title, icon: elem.iconFont },
        children: []
      }
      accessList.push(item)
    })

  // routeTreeList
  accessList.forEach(elem => {
    if (elem.parentId === null) {
      fillChildren(accessList, elem)
      routeTreeList.push(Object.assign({}, elem))
    }
  })

  // 404 page must be placed at the end !!!
  routeTreeList.push({ path: '*', redirect: '/404', hidden: true })
  return routeTreeList
}

/**
 * 递归处理菜单 children
 * @param {*} routeList
 * @param {*} parent
 */
/* private*/function fillChildren(routeList, parent) {
  routeList.forEach(elem => {
    if (elem.parentId === parent.id) {
      fillChildren(routeList, elem)
      if (elem.children && elem.children.length === 0) {
        delete elem['children']
        delete elem['redirect']
      }
      parent.children.push(elem)
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

