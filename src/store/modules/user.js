import { getToken, setToken,removeToken,getName, setName,removeName } from '@/utils/auth'
import { userLogin } from '@/api/login/index'
const user = {
  state: {
    token: getToken(),
    name: getName()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        console.log('0：' + '请求接口')
        userLogin(userInfo).then(res => {
          setToken(res.token)
          setName(res.name)
          commit('SET_TOKEN', res.token)
          commit('SET_NAME', res.name)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //退出
    LogOut({ commit }){
      removeToken()
      removeName()
      commit('SET_TOKEN', '')
      commit('SET_NAME', '')
    }
  }
}

export default user
