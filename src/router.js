import Vue from "vue";
import Router from "vue-router";
import Home from "@/view/home";
import PhoneIndex from "@/view/pages/photo/index";
import Login from '@/view/login'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'phoneIndex',
      component: PhoneIndex,
    },
    // {
    //   path: "/PhoneIndex",
    //   name: "home",
    //   component: Home,
    //   redirect:'/PhoneIndex',
    //   children:[{
    //     path:'/PhoneIndex',
    //     name:'phoneIndex',
    //     component:PhoneIndex
    //   },{
    //     path: '/404',
    //     name: '404',
    //     component: () => import('@/view/404')
    //   },]
    // }
  ],
});

//路由守卫
router.beforeEach((to, from, next) => {
  //未找到路由
  if (!to.matched.length) {
    next("/404")
  }
  //找到了就放行路由
  next(true)//放行路由
})

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router;