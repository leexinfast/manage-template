import { post,get } from '../http';

export const userLogin = p => post('sales/login', p);//登录

export const adminLogin = p => post('admin/login', p);//登录

export const getRouters = p => get("menu/router", p)//获取路由

export const redirect = p => post("admin/login/app", p)//重定向

export const reset = p => post("admin/pwd/reset", p)//修改密码

export const check = p => post("admin/pwd/check", p)//修改密码
