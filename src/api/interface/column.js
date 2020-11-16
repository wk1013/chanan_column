import axios from '../instance';

//获取后台专栏列表
export const getColumn = params => axios.get('/backstage/spe/list', { params });

//置顶/隐藏/标记为大V
export const getTSV = params => axios.put('/backstage/spe/tsv', params);

//取消置顶/隐藏/标记为大V
export const getCancelTSV = params => axios.put('/backstage/spe/cancel/tsv', params);

//专栏排序
export const getOrder = params => axios.put('/backstage/spe/orderUpTen', params)

//获取专栏信息
export const getColumnItem = params => axios.get('/backstage/spe/edit/' + params, null)

//编辑专栏
export const EditColumn = params => axios.put('/backstage/spe/edit/save', params)

export default {
  getColumn,
  getTSV,
  getCancelTSV,
  getOrder,
  getColumnItem,
  EditColumn
}