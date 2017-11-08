<template>
  <div id="app">
    <q-header></q-header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import QHeader from 'components/q-header'
  import Player from 'components/player'

export default {
  name: 'app',
  components: {
    QHeader,
    Player
  }
}
</script>

<style>
#app {
  padding-top: 104px;
  padding-bottom: 54px;
  background-color: rgba(0,0,0,.02);
}
</style>
