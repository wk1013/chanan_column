import Vue from "vue";
import VueRouter from "vue-router";
import Home from '@/views/Home.vue'
const SpecialSearch = () => import('@/views/Special/specialsearch.vue');
const PersonSearch = () => import('@/views/Person/personsearch.vue');
const Know = () => import('@/views/Know/know.vue');
const SpecialDetail = () => import('@/views/Special/specialdetail.vue');
const PersonDetail = () => import('@/views/Person/persondetail.vue');
const KnowList = () => import('@/views/Know/knowlist.vue');
const Column = () => import('@/views/Column/column.vue');
const KnowUpload = () => import('@/views/Know/knowupload.vue');
const UserColumn = () => import('@/views/User/userspecial.vue');
const AuditColumn = () => import('@/views/Audit/audit.vue');
const AuditDoneColumn = () => import('@/views/Audit/auditdone.vue');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: "专栏广场"
    }
  },
  {
    path: '/specialSearch',
    name: 'specialSearch',
    component: SpecialSearch,
    meta: {
      title: "主题专栏检索"
    }
  },
  {
    path: '/personSearch',
    name: 'personSearch',
    component: PersonSearch,
    meta: {
      title: "人物专栏检索"
    }
  },
  {
    path: '/knowledgeSearch',
    name: 'knowledgeSearch',
    component: Know,
    meta: {
      title: "专栏知识检索"
    }
  },
  {
    path: '/specialDetail',
    name: 'specialDetail',
    component: SpecialDetail,
    meta: {
      title: "专栏详情"
    }
  },
  {
    path: '/personDetail',
    name: 'personDetail',
    component: PersonDetail,
    meta: {
      title: "专栏详情"
    }
  },
  {
    path: '/knowledgeList',
    name: 'knowledgeList',
    component: KnowList,
    meta: {
      title: "专栏文档管理"
    }
  },
  {
    path: '/knowledgeupload',
    name: 'knowledgeupload',
    component: KnowUpload,
    meta: {
      title: "专栏知识上传"
    }
  },
  {
    path: '/backstage/column',
    name: 'column',
    component: Column
  },
  {
    path: '/personal/column',
    name: 'usercolumn',
    component: UserColumn
  },
  {
    path: '/personal/column_audit',
    name: '/auditcolumn',
    component: AuditColumn
  },
  {
    path: '/personal/column_audit_done',
    name: '/auditdonecolumn',
    component: AuditDoneColumn
  },
];

const router = new VueRouter({
  routes
});

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}
export default router;
