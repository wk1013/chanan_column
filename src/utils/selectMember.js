import selectMemberApi from '@/api/interface/selectMemberApi.js'
export default {
    data() {
        return {
            language: 'zh-cn',
            defaultProps: {
                realName: 'realName', // key固定value为传入数据的用户名字段
                userId: 'userId', // key固定value为传入数据的用户id字段
                pId: 'pId', // key固定value为传入数据的用户父id字段
                logo: 'logo', // key固定value为传入数据的图标字段
                department: 'department', // key固定value为传入数据的部门字段
                type: 'type', // key固定value为传入数据的类型字段
                userType: 0, // key固定value为用户类型
            },
            forward: true, // 选用户时，用户是否向数组前添加，默认true向前添加,
            alreadySelectedMembers: [],
            firstLevelDeparts: [],//一级部门
            centerMembers: [],
            disabledList: [],
            curNode: null,
            pageIndex: 1
        }
    },
    methods: {
        addMember() {
            this.$refs.members.show();
        },
        confirm(list) {
            //点击确定后的回调
            console.log(list);
            // this.channelForm.managers = list.slice(0);
        },
        overflow() {
            console.log('超出最大长度');
        },
        //给部门添加一些属性
        addPropsForDepart(departs) {
            return departs.map(item => {
                item.checked = false;
                item.show = true;
                item.isLeaf = false;
                item.children = [];
                return item;
            });
        },
        //给成员添加一些属性
        addPropsForMember(members) {
            return members.map(item => {
                item.checked = false;
                item.show = true;
                return item;
            });
        },
        //点击部门加载部门成员
        getDepartMember(data) {
            this.curNode = data.curNode;
            this.centerMembers.length = 0;
            this.pageIndex = 1;
            let param = {
                departmentId: data.curNode ? data.curNode.userId : '',
                userName: data.name,
                pageIndex: this.pageIndex,
                pageSize: 15
            }
            this.getCenterMemberByOrganId(param);
        },
        //滚动加载更多成员
        loadMoreMember(data) {
            this.curNode = data.curNode;
            let param = {
                departmentId: this.curNode ? this.curNode.userId : '',
                userName: '',
                pageIndex: this.pageIndex++,
                pageSize: 15
            }
            this.getCenterMemberByOrganId(param);
        },

        //获取机构成员
        getCenterMemberByOrganId(param) {
            selectMemberApi.getOrganMemberRequest(param).then(result => {
                this.centerMembers = this.centerMembers.concat(this.addPropsForDepart(result.content));
            });
        },
        //获取一级部门或子部门
        getDeparts(param) {
            selectMemberApi.getDepartsRequest(param).then(result => {
                let ary = [];
                result.content.forEach(item => {
                    ary = ary.concat(item);
                })
                if (!param.departmentId) {
                    this.firstLevelDeparts = this.addPropsForDepart(ary);
                }
            }).catch(err => {
                console.log(err);
            });
        },
        //检索部门
        searchDepartByName(searchName) {
            this.firstLevelDeparts.length = 0;
            this.getDeparts({ departmentId: '', departmentName: searchName });
        },
        //懒加载获取子部门
        getChildrenDepart(param) {
            selectMemberApi.getDepartsRequest({ departmentId: param.node.data.userId, departmentName: '' }).then(result => {
                param.node.data.children = result.content;
                return param.resolve(param.node.data.children)
            }).catch(err => {
                console.log(err);
            });
        },
    },
    created() {
        //获取一级部门
        this.getDeparts({ departmentId: '', departmentName: '' });
        let param = {
            departmentId: '',
            userName: '',
            pageIndex: this.pageIndex,
            pageSize: 15
        }
        this.getCenterMemberByOrganId(param);
    }
}