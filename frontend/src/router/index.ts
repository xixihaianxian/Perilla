import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { setupGuards } from './guards'

// Lazy-loaded routes
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { layout: 'default', title: '首页' },
  },
  {
    path: '/explore',
    name: 'Explore',
    component: () => import('@/views/ExploreView.vue'),
    meta: { layout: 'default', title: '探索' },
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchView.vue'),
    meta: { layout: 'default', title: '搜索' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { layout: 'auth', title: '登录', guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { layout: 'auth', title: '注册', guest: true },
  },
  {
    path: '/note/:id',
    name: 'NoteDetail',
    component: () => import('@/views/NoteDetailView.vue'),
    meta: { layout: 'default', title: '笔记详情' },
  },
  {
    path: '/note/create',
    name: 'NoteCreate',
    component: () => import('@/views/NoteCreateView.vue'),
    meta: { layout: 'default', title: '发布笔记', requiresAuth: true },
  },
  {
    path: '/note/edit/:id',
    name: 'NoteEdit',
    component: () => import('@/views/NoteEditView.vue'),
    meta: { layout: 'default', title: '编辑笔记', requiresAuth: true },
  },
  {
    path: '/user/:userId',
    name: 'UserProfile',
    component: () => import('@/views/UserProfileView.vue'),
    meta: { layout: 'default', title: '用户主页' },
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('@/views/MessagesView.vue'),
    meta: { layout: 'default', title: '私信', requiresAuth: true },
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/NotificationsView.vue'),
    meta: { layout: 'default', title: '通知', requiresAuth: true },
  },
  {
    path: '/me',
    name: 'Me',
    component: () => import('@/views/MeView.vue'),
    meta: { layout: 'default', title: '个人中心', requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { layout: 'admin', title: '管理后台', requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/admin/AdminUserManagement.vue'),
    meta: { layout: 'admin', title: '用户管理', requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/content',
    name: 'AdminContent',
    component: () => import('@/views/admin/AdminContentReview.vue'),
    meta: { layout: 'admin', title: '内容审核', requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/comments',
    name: 'AdminComments',
    component: () => import('@/views/admin/AdminCommentManagement.vue'),
    meta: { layout: 'admin', title: '评论管理', requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/reports',
    name: 'AdminReports',
    component: () => import('@/views/admin/AdminReportManagement.vue'),
    meta: { layout: 'admin', title: '举报管理', requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/tags',
    name: 'AdminTags',
    component: () => import('@/views/admin/AdminTagManagement.vue'),
    meta: { layout: 'admin', title: '标签管理', requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/topics',
    name: 'AdminTopics',
    component: () => import('@/views/admin/AdminTopicManagement.vue'),
    meta: { layout: 'admin', title: '话题管理', requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

setupGuards(router)

export default router
