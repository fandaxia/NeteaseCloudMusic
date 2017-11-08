<template>
<div class="m-header">
  <div class="fixed-box">
    <mu-appbar title="网易云音乐">
      <i class="iconfont icon-logo" slot="left"></i>
    </mu-appbar>
    <mu-tabs :value="selected" class="main-tabs" @change="changeRouter">
      <mu-tab value="recommend">推荐音乐</mu-tab>
      <mu-tab value="rank">热歌榜</mu-tab>
      <mu-tab value="search">搜索</mu-tab>
    </mu-tabs>
  </div>
</div>
</template>

<script>
  import MuTabs from "../../node_modules/muse-ui/src/tabs/tabs";
  import MuTab from "../../node_modules/muse-ui/src/tabs/tab";
  import MuAppbar from "../../node_modules/muse-ui/src/appBar/appBar";

export default {
  components: {MuAppbar, MuTab, MuTabs},
  data () {
    return {
      selected: 'recommend'
    }
  },
  created () {
    this.selected = this.$route.path.split('/')[1]
  },
  methods: {
    changeRouter (val) {
      this.selected = val;
      this.$router.replace({ path: '/' + val})
    }
  }
}
</script>

<style scoped>
  .m-header .fixed-box {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 100;
  }
  .m-header .icon-logo {
    font-size: 28px;
  }
.m-header .main-tabs {
  background-color: #fff;
}
.m-header .mu-tab-link {
  color: rgba(0,0,0,0.8);
  font-size: 16px;
}
.m-header .mu-tab-active {
  color: #EF5450;
}
</style>
