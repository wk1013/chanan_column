import axios from '../instanceS';

//获取部门列表
export const getDepartsRequest = params => axios.get('/channel/user/getDepartmentList', { params });

//获取用户列表
export const getOrganMemberRequest = params => axios.get('/channel/user/getUserList', { params });

export default {
  getDepartsRequest,
  getOrganMemberRequest
}