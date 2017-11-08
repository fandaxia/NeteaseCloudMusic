<template>
<div class="recommend">
  <div>
    <h3 class="title">推荐歌单</h3>
    <div class="songSheetBox">
      <mu-grid-list>
        <mu-grid-tile v-for="(item,index) in songSheets" :key="item.id" titleBarClass="titleBar" :rows="1" :cols="2/3">
          <img @click="goRList(item)" :src="item.picUrl" class="sheetImg">
          <p class="playCount">{{intPlayCount(item.playCount)}}</p>
          <p class="name">{{item.name}}</p>
        </mu-grid-tile>
      </mu-grid-list>
    </div>
    <h3 class="title">最新音乐</h3>
    <song-list :lists="newSongs" :show-index="false"></song-list>
  </div>
  <router-view></router-view>
</div>
</template>

<script>
  import api from '../api'
  import MuGridList from "../../node_modules/muse-ui/src/gridList/gridList";
  import MuGridTile from "../../node_modules/muse-ui/src/gridList/gridTile";
  import SongList from './songList'
  import {mapMutations} from 'vuex'

export default{
  components: {
    MuGridTile,
    MuGridList,
    SongList
  },
  data () {
    return {
      songSheets: [],
      newSongs: []
    }
  },
  created () {
    this.getRecommend()
    this.intPlayCount()
    this.getNewSongs()
  },
  methods: {
    getRecommend () {
      this.$ajax.get(api.urlRecommend()).then((res) => {
        this.songSheets = res.data.result
      })
    },
    intPlayCount (number) {
      if(number >= 100000){
        return Number(number/10000).toFixed(1) + '万'
      } else {
        return parseInt(number)
      }
    },
    getNewSongs () {
      this.$ajax.get(api.urlNewSong()).then((res) => {
        let list = []
        res.data.result.forEach(function (value) {
          list.push({
            id: value.id,
            name: value.name,
            artists: value.song.artists,
            album: value.song.album,
            duration: value.song.duration
          })
        })
        this.newSongs = list
      })
    },
    goRList (item) {
      this.$store.commit('setCurrentList', item)
      this.$router.push({path: this.$route.path + '/list?id=' + item.id })
    },
    ...mapMutations([
      'setCurrentList'
    ])
  }
}
</script>

<style>
  .recommend .title {
    margin: 14px 0 14px 0;
    padding-left: 6px;
    font-size: 18px;
    border-left: 2px solid red;
  }
  /*根据父级宽度的正方形div盒子*/
  .songSheetBox .mu-grid-tile {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    overflow: visible;
  }
  .songSheetBox .sheetImg {
    width: 100%;
    height: auto;
  }
  .songSheetBox .titleBar {
    display: none;
  }
  .songSheetBox .playCount {
    position: absolute;
    top: 0;
    width: 100%;
    color: #fff;
    font-size: 14px;
    padding: 4px 4px 0 0;
    text-align: right;
    background: -webkit-linear-gradient(top,rgba(0,0,0,.3),rgba(0,0,0,.05))
  }
  .songSheetBox .name {
    position: absolute;
    bottom: -38px;
    width: 100%;
    height: 38px;
    padding: 6px 4px 0 6px;
    color: #000;
    font-size: 14px;
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    /*移动端多行文本溢出末尾显示省略号*/
    display: -webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
  }
</style>
