import axios from '../instance';

//获取用户信息
export const getUserInfo = params => axios.post('/spe/getUserInfo', params);

//个人中心专栏订阅列表
export const getUserSpecial = params => axios.get('/sub/list', { params });

//获取我的待办详情
export const getMyToBeDone = params => axios.get('/review/myToDo', { params });

//获取我的发起详情
export const getMyInitiative = params => axios.get('/review/myInitiative', { params });

//获取我的已处理详情
export const getMyHandled = params => axios.get('/review/handled', { params });

//待办审批
export const getMyAudit = params => axios.post('/review/approval', params);

export default {
  getUserInfo,
  getUserSpecial,
  getMyToBeDone,
  getMyInitiative,
  getMyHandled,
  getMyAudit
}