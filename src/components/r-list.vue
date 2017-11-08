<template>
<div class="r-list">
  <mu-appbar title="歌单">
    <i @click="back" class="iconfont icon-back" slot="left"></i>
  </mu-appbar>
  <div class="listTop">
    <div class="top-bg" :style="{backgroundImage: 'url(' + currentList.picUrl + ')'}"></div>
    <div class="img-box">
      <img :src="currentList.picUrl" class="cover">
    </div>
    <p class="list-name">{{currentList.name}}</p>
    <div class="creator-info">
      <img :src="creator.avatarUrl" class="creator-avatar">
      <span class="creator-name">{{creator.nickname}}</span>
    </div>
  </div>
  <div class="list-box">
    <song-list :lists="songList" :show-index="true"></song-list>
  </div>
</div>
</template>

<script>
  import SongList from './songList'
  import api from '../api'
  import { mapGetters } from 'vuex'
  import MuAppbar from "../../node_modules/muse-ui/src/appBar/appBar";
export default {
  components: {
    MuAppbar, SongList
  },
  data () {
    return {
      songList: [],
      creator: {}
    }
  },
  computed: {
    ...mapGetters([
      'currentList'
    ])
  },
  created () {
    this.getPlayList()
  },
  methods: {
    getPlayList () {
      this.$ajax.get(api.urlPlayList(this.currentList.id)).then((res) => {
        let list = []
        this.creator = res.data.playlist.creator
        res.data.playlist.tracks.forEach(function (value) {
          list.push({
            id: value.id,
            name: value.name,
            artists: value.ar,
            album: value.al,
            duration: value.dt
          })
        })
        this.songList = list
      })
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style>
  .r-list {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding-bottom: 54px;
    z-index: 150;
    background-color: #fff;
  }
  .listTop {
    height: 10rem;
    overflow: hidden;
    position: relative;
  }
  .listTop .top-bg {
    height: 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: auto 100%;
    -webkit-transform: scale(3);
    transform: scale(3);
    -webkit-transform-origin: center;
    transform-origin: center;
    -webkit-filter: brightness(.6) blur(6px);
    overflow: hidden;
    z-index: -1;
  }
  .listTop .img-box {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    width: 7rem;
    height: 7rem;
    -webkit-box-shadow: 0 0 10px #ccc;
  }
  .listTop .cover {
    width: 100%;
    height: 100%;
  }
  .listTop .list-name {
    position: absolute;
    top: 1.5rem;
    right: 1rem;
    width: 9.5rem;
    height: 4rem;
    color: #fff;
    font: 18px/22px Arial;
  }
  .listTop .creator-info {
    position: absolute;
    top: 6rem;
    right: 1rem;
    width: 9.5rem;
    height: 2rem;
  }
  .creator-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
  .creator-name {
    font: 14px/2rem Arial;
    vertical-align: top;
    color: rgba(255,255,255,.7);
  }
  .r-list .list-box {
    background-color: rgba(0,0,0,.02);
  }
</style>
