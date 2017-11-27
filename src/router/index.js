import Vue from 'vue'
import Router from 'vue-router'
import Rank from 'components/rank'
import Recommend from 'components/recommend'
import Search from 'components/search'
import RList from 'components/r-list'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':list',
          component: RList
        }
      ]
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
