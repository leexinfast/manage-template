import Cookies from 'js-cookie'

const TokenKey = 'token'
const Name = 'name'
const Routers = 'routers'

//token
export function getToken() {
  return sessionStorage.getItem(TokenKey)
}
export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}
export function removeToken(token) {
  return sessionStorage.removeItem(TokenKey, token)
}

//name
export function getName() {
  return sessionStorage.getItem(Name)
}
export function setName(name) {
  return sessionStorage.setItem(Name, name)
}
export function removeName(name) {
  return sessionStorage.removeItem(Name, name)
}

export function getAddRouters() {
  // console.log(localStorage.getItem(JSON.parse(Routers)))
  return localStorage.getItem(Routers)
}
export function setAddRouters(routers) {
  return localStorage.setItem(Routers, routers)
}


