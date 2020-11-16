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

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/specialSearch',
    name: 'specialSearch',
    component: SpecialSearch
  },
  {
    path: '/personSearch',
    name: 'personSearch',
    component: PersonSearch
  },
  {
    path: '/know',
    name: 'know',
    component: Know
  },
  {
    path: '/specialDetail',
    name: 'specialDetail',
    component: SpecialDetail
  },
  {
    path: '/personDetail',
    name: 'personDetail',
    component: PersonDetail
  },
  {
    path: '/knowList',
    name: 'knowList',
    component: KnowList
  },
  {
    path: '/knowupload',
    name: 'knowupload',
    component: KnowUpload
  },
  {
    path: '/column',
    name: 'column',
    component: Column
  }
];

const router = new VueRouter({
  routes
});

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router;
