<template>
<div class="rank">
  <div class="hotTop">
    <div class="hotIcon"></div>
  </div>
  <song-list :lists="showLists" :show-index="true"></song-list>
  <div class="loadMore" @click="loadMoreLists">{{loadText}}</div>
</div>
</template>

<script>
  import api from '../api'
  import SongList from './songList'
export default {
  components: { SongList },
  data () {
    return {
      hotSongs: [],
      showLists: [],
      num: 0,
      loadText: '点击加载更多'
    }
  },
  created () {
    this.getHotSongs()
  },
  methods: {
    getHotSongs () {
      this.$ajax.get(api.urlHotSong()).then((res) => {
        this.hotSongs = res.data.result.tracks
        this.showLists = this.hotSongs.slice(0,20)
      })
    },
    loadMoreLists () {
      if(this.showLists.length < this.hotSongs.length){
        this.num++
        this.showLists = this.hotSongs.slice(0,20*(this.num+1))
      } else {
        this.loadText = '已加载全部歌曲'
      }
    }
  }
}
</script>

<style>
  .rank .hotTop {
    position: relative;
    padding-top: 38.9%;
    box-sizing: border-box;
    overflow: hidden;
    background: url("http://s3.music.126.net/m/s/img/hot_music_bg_2x.jpg?f01a252389c26bcf016816242eaa6aee") no-repeat;
    background-size: contain;
  }
  .rank .hotIcon {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 142px;
    height: 67px;
    background: url("../assets/index_icon_2x.png");
    background-position: -24px -30px;
    background-size: 166px 97px;
  }
  .rank .loadMore {
    height: 40px;
    font: 16px/40px Arial;
    text-align: center;
  }
</style>
