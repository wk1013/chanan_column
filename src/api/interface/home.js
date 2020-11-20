import axios from '../instance';

// 获取专栏列表
export const getSpecial = params => axios.get('/spe/list', { params, });

//创建专栏
export const addSpecial = params => axios.post('/review/save', params);

//获取专栏详情
export const getSpecialDetail = params => axios.get('/spe/info', { params });

//编辑专栏
export const EditSpecialDetail = params => axios.put('/spe/update', params);

//订阅专栏
export const getSubscribe = params => axios.post('/sub/subscribe', params)

//取消订阅专栏
export const DeleteSubscribe = params => axios.delete('/sub/unsubscribe', { params })

//删除专栏
export const DeleteColumn = params => axios.delete('/spe/delete', { params })

//专栏知识检索
export const SearchKnowledge = params => axios.post('/spe/search', params)

//删除知识
export const DeleteKnow = params => axios.delete('/spe/deleteKnowledge', { params })

//增加知识数
export const AddNum = params => axios.post('/sub/addNum', params)

//减少知识数
export const DeleteNum = params => axios.post('/sub/lessNum', params)

//获取用户信息
export const getUserInfo = params => axios.post('/spe/getUserInfo', params)

//设置权限
export const getPower = params => axios.post('/colPower/setColPower', params)

//查询可以访问专栏的人员列表
export const getUserList = params => axios.get('/colPower/selectColPower', { params })

//个人中心专栏订阅列表
export const getUserSpecial = params => axios.get('/sub/list', { params })

export default {
  getSpecial,
  addSpecial,
  getSpecialDetail,
  EditSpecialDetail,
  getSubscribe,
  DeleteSubscribe,
  DeleteColumn,
  SearchKnowledge,
  DeleteKnow,
  AddNum,
  DeleteNum,
  getUserInfo,
  getPower,
  getUserList,
  getUserSpecial
}