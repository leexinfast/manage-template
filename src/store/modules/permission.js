import { constantRouterMap } from '@/router'



const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      // console.log(state.routers)
    }
  },
  actions: {
    GenerateRoutes({ commit },data) {
      return new Promise(resolve => {
        commit('SET_ROUTERS', data);
        resolve()
      })
    }
  }
}

export default permission
