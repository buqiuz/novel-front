import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // createWebHistory 路由模式路径不带#号(生产环境下不能直接访问项目，需要 nginx 转发)
  // createWebHashHistory 路由模式路径带#号
  history: createWebHashHistory(), 
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home')
    },
    {
      path:'/payment',
      name: 'payment',
      component: () => import('@/views/Payment')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login')
    },


    {
      path: '/bookclass',
      name: 'bookclass',
      component: () => import('@/views/BookClass')
    },
    {
      path: '/book_rank',
      name: 'bookRank',
      component: () => import('@/views/BookRank')
    },
    {
      path: '/book/:id',
      name: 'book',
      component: () => import('@/views/Book')
    },
    {
      path: '/chapter_list/:bookId',
      name: 'chapterList',
      component: () => import('@/views/ChapterList')
    },
    {
      path: '/book/:id/:chapterId',
      name: 'bookContent',
      component: () => import('@/views/BookContent')
    },
    {
      path: '/user/setup',
      name: 'userSetup',
      component: () => import('@/views/UserSetup')
    },
    {
      path: '/user/comment',
      name: 'userComment',
      component: () => import('@/views/UserComment')
    },
    {
      path: '/user/record',
      name: 'userRecord',
      component: () => import('@/views/UserRecord')
    },
    {
      path: '/user/history',
      name: 'userHistory',
      component: () => import('@/views/UserHistory')
    },
    {
      path: '/user/bookshelf',
      name: 'userBookshelf',
      component: () => import('@/views/UserBookshelf')
    },
    {
      path: '/author/register',
      name: 'authorRegister',
      component: () => import('@/views/author/Register')
    },
    {
      path: '/author/book_list',
      name: 'authorBookList',
      component: () => import('@/views/author/BookList')
    },
    {
      path: '/author/book_add',
      name: 'authorBookAdd',
      component: () => import('@/views/author/BookAdd')
    },
    {
      path: '/author/book_add',
      name: 'authorBookEdit',
      component: () => import('@/views/author/BookEdit')
    },
    {
      path: '/author/chapter_list',
      name: 'authorChapterList',
      component: () => import('@/views/author/ChapterList')
    },
    {
      path: '/author/chapter_add',
      name: 'authorChapterAdd',
      component: () => import('@/views/author/ChapterAdd')
    },
    {
      path: '/author/chapter_update',
      name: 'authorChapterUpdate',
      component: () => import('@/views/author/ChapterUpdate')
    }
  ]
})

// 解决 vue 中路由跳转时，总是从新页面中间开始显示
router.afterEach((to,from,next) => {
  window.scrollTo(0,0)
})

export default router