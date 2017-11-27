<template>
 <div class="player" v-if="playList.length > 0">
   <div class="player-normal" v-show="fullScreen">
     <div class="song-bg" :style="{backgroundImage: 'url(' + currentSong.al.picUrl + ')'}"></div>
     <div class="player-normal-main">
       <div class="top">
         <mu-list-item :title="currentSong.name" :describeText="currentSong.ar[0].name" titleClass="songName" describeTextClass="singerName">
           <i @click="back" class="iconfont icon-back button-small" slot="left"></i>
           <i class="iconfont icon-share button-small" slot="right"></i>
         </mu-list-item>
       </div>
       <div @click="toggleLyric" v-show="!showLyric" class="middle">
         <div class="cd-box">
           <div class="cd-border">
             <img class="cd play" :class="{pause: !playing}" :src="currentSong.al.picUrl">
           </div>
         </div>
       </div>
       <div @click="toggleLyric" v-show="showLyric" class="lyric-wrap">
         <div class="lyric-box" :style="{top: lyricTop + 'rem'}">
           <p class="lyric-text" v-for="(item,index) in lyric" :class="{highLight: index === lyricIndex}">{{item.text}}</p>
         </div>
       </div>
       <div class="bottom">
         <div class="slider">
           <div class="slider-left">
             <span class="song-time">{{format(currentTime)}}</span>
           </div>
           <div class="slider-middle">
             <mu-slider @drag-start="startDrag" @dragStop="stopDrag" @change="changeTime" :value="sliderValue"></mu-slider>
           </div>
           <div class="slider-right">
             <span class="song-time">{{format(currentSong.dt/1000)}}</span>
           </div>
         </div>
         <mu-flexbox>
           <mu-flexbox-item>
               <i class="iconfont icon-loop button-small"></i>
           </mu-flexbox-item>
           <mu-flexbox-item>
               <i @click="prev" class="iconfont icon-prev button-middle"></i>
           </mu-flexbox-item>
           <mu-flexbox-item>
               <i @click="togglePlaying" class="iconfont button-big" :class="playIcon"></i>
           </mu-flexbox-item>
           <mu-flexbox-item>
               <i @click="next" class="button iconfont icon-next button-middle"></i>
           </mu-flexbox-item>
           <mu-flexbox-item>
               <i @click="openBottomSheet" class="iconfont icon-list button-small"></i>
           </mu-flexbox-item>
         </mu-flexbox>
       </div>
     </div>
   </div>
   <div class="player-mini" v-show="!fullScreen">
     <mu-list-item @click="showPlayerNormal(currentSong.id)" :title="currentSong.name" :describeText="currentSong.ar[0].name" titleClass="songName" describeTextClass="singerName">
       <img :src="currentSong.al.picUrl" slot="left" class="cover-mini">
       <div slot="right">
         <div class="button" @click.stop="togglePlaying">
           <i class="iconfont" :class="playIcon" style="font-size: 34px"></i>
         </div>
         <div class="button" @click.stop="openBottomSheet" style="padding-left: 8px">
           <i class="iconfont icon-list" style="font-size: 28px; text-align: right"></i>
         </div>
       </div>
     </mu-list-item>
   </div>
   <audio id="music" ref="audio" @timeupdate="updateTime" @canplay="ready" @error="error" @ended="next" preload="auto">
     <source :src="url" type="audio/mpeg">
   </audio>
   <mu-bottom-sheet :open="bottomSheet">
     <div class="mbs-top">
       <i @click="closeBottomSheet" class="iconfont icon-back"></i>
       <span class="mbs-title">播放列表</span>
     </div>
     <div class="mbs-box">
       <ul>
         <li @click="select(item.id)" v-for="item in playList" class="mbs-list">
           <p>
             <span class="name">{{item.name}}</span>
             <span class="artist">-{{item.ar[0].name}}</span>
           </p>
           <i class="iconfont icon-del"></i>
         </li>
       </ul>
     </div>
   </mu-bottom-sheet>
 </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import api from '../api'
  import MuListItem from "../../node_modules/muse-ui/src/list/listItem";
  import MuFlexbox from "../../node_modules/muse-ui/src/flexbox/flexbox";
  import MuFlexboxItem from "../../node_modules/muse-ui/src/flexbox/flexboxItem";
  import MuSlider from "../../node_modules/muse-ui/src/slider/slider";
  import MuBottomSheet from "../../node_modules/muse-ui/src/bottomSheet/bottomSheet";
  import MuList from "../../node_modules/muse-ui/src/list/list";
export default {
  components: {MuList, MuBottomSheet, MuSlider, MuFlexboxItem, MuFlexbox, MuListItem},
  data () {
    return {
      url: '',
      songReady: false,
      currentTime: 0,
      showLyric: false,
      lyric: [],
      lyricIndex: 0,
      slide: false,
      bottomSheet: false
    }
  },
  computed: {
    playIcon () {
      return this.playing? 'icon-pause': 'icon-play'
    },
    sliderValue () {
      return ((this.currentTime / (this.currentSong.dt/1000)) * 100).toFixed(2)
    },
    lyricTop () {
      return 10 - this.lyricIndex * 2
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'playing',
      'currentId',
      'currentSong',
      'currentIndex'
    ])
  },
  watch: {
    currentId (val) {
      this.$ajax.get(api.urlSingleSong(val)).then((res) => {
        this.url = res.data.data[0].url
        var audio = this.$refs.audio
        audio.load()
        this.$common.autoPlayMusic()
        this.$common.audioAutoPlay()
      })
      let index = this.playList.findIndex(function (value) {
        return value.id === val
      })
      this.$store.commit('setCurrentIndex', index)
      this.$ajax.get(api.urlLyric(val)).then((res) => {
        let list = []
        res.data.lrc.lyric.split(/\n/).forEach((val) => {
          let time = val.split("]")[0]
          let txt = val.split("]")[1]
          if(txt){
            list.push({
              timeLine: this.formatStr2num(time.substring(1,time.length)),
              text: txt
            })
          }
        })
        this.lyric = list
      })
    },
    currentIndex (val) {
      this.selectPlay({
        item: this.playList[val]
      })
    },
    '$route' (val) {
      if(val.fullPath.indexOf('?ids=') > 0) {
        this.$store.commit('setFullScreen', true)
      } else {
        this.$store.commit('setFullScreen', false)
      }
    },
    playing (flag) {
      let audio = this.$refs.audio
      flag? audio.play(): audio.pause()
    },
    currentTime (val) {
      var num = this.lyric.findIndex(function (value) {
        return value.timeLine === val
      })
      if(num >= 0) {
        this.lyricIndex = num
      }
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    togglePlaying () {
      if(!this.songReady) {
        return
      }
      this.$store.commit('setPlaying',!this.playing)

    },
    prev () {
      if(!this.songReady) {
        return
      }
      this.$store.commit('playPrev')
      this.songReady = false
    },
    next () {
      if(!this.songReady) {
        return
      }
      this.$store.commit('playNext')
      this.songReady = false
    },
    showPlayerNormal (id) {
      this.$router.push({path: this.$route.path + '?ids=' + id})
    },
    ready () {
      this.songReady = true
    },
    error () {
      this.songReady = true
      this.prev()
    },
    updateTime (e) {
      if(this.slide) {
        return
      }
      this.currentTime = parseInt(e.target.currentTime)
    },
    format (seconds) {
      seconds = parseInt(seconds)
      let minute = this.addZero(parseInt(seconds / 60))
      let second = this.addZero(seconds % 60)
      return `${minute}:${second}`

    },
    addZero (num) {
      return num < 10? '0' + num: num
    },
    changeTime (val) {
      this.currentTime = parseInt(((val/100) * (this.currentSong.dt/1000)))
    },
    startDrag () {
      this.slide = true
    },
    stopDrag () {
      this.$refs.audio.currentTime = this.currentTime
      this.slide = false
    },
    formatStr2num (str) {
      let minute = str.split(":")[0]
      let second = parseInt(str.split(":")[1])
      return minute * 60 + second
    },
    toggleLyric () {
      this.showLyric = !this.showLyric
    },
    select (id) {
      this.$ajax.get(api.urlSongDetail(id)).then((res) => {
        let item = res.data.songs[0]
        this.selectPlay({
          item: item
        })
      })
      this.closeBottomSheet()
    },
    closeBottomSheet () {
      this.bottomSheet = false
    },
    openBottomSheet () {
      this.bottomSheet = true
    },
    ...mapMutations([
      'setFullScreen',
      'setPlaying',
      'setCurrentId',
      'setCurrentIndex',
      'playNext',
      'playPrev'
    ]),
    ...mapActions([
      'selectPlay'
    ])
  }
}
</script>

<style>
  .player .mu-item.show-left {
    padding: 8px 88px 8px 56px;
  }
  .player .mu-item-left {
    left: 8px;
  }
  .player .mu-item-right {
    width: 80px;
    right: 8px;
  }
  .player .songName {
    font-size: 17px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .player .singerName {
    font-size: 12px;
  }
  .player .mu-flexbox-item {
    text-align: center;
  }
  .player-normal .button-small {
    font-size: 22px;
  }
  .player-normal .button-middle {
    font-size: 26px;
  }
  .player-normal .button-big {
    font-size: 40px;
  }
  .player-normal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    z-index: 200;
  }
  .player-normal .song-bg {
    height: 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: auto 100%;
    -webkit-transform: scale(1.5);
    transform: scale(1.5);
    -webkit-transform-origin: center top;
    transform-origin: center top;
    -webkit-filter: brightness(.3) blur(5px);
    overflow: hidden;
    z-index: -1;
  }
  .player-normal-main {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    padding-top: 10px;
  }
  .player-normal .songName {
    color: #fff;
  }
  .player-normal .iconfont {
    color: rgba(255,255,255,.8);
  }
  .player-normal .singerName {
    color: #ccc;
  }
  .middle {
    width: 100%;
    padding: 2.5rem;
  }
  .middle .cd-box {
    box-sizing: content-box;
    width: 14rem;
    height: 14rem;
    border: 0.5rem solid rgba(255,255,255,.2);
    border-radius: 50%;
  }
  .middle .cd-border {
    box-sizing: content-box;
    width: 10rem;
    height: 10rem;
    border: 2rem solid #000;
    border-radius: 50%;
  }
  .middle .cd {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .cd.play {
    animation: rotate 20s linear infinite;
  }
  .cd.pause {
    animation-play-state: paused;
  }
  .lyric-wrap {
    position: relative;
    height: 20rem;
    overflow: hidden;
  }
  .lyric-box {
    width: 100%;
    top: 10rem;
    position: absolute;
    transition: 1s;
  }
  .lyric-text {
    text-align: center;
    height: 2rem;
    font: 14px/1rem Arial;
    color: #bbb;
  }
  .lyric-wrap .highLight {
    color: #fff;
  }
  .player-normal .bottom {
    position: absolute;
    bottom: 20px;
    width: 100%;
  }
  .bottom .slider {
    width: 100%;
    overflow: hidden;
    padding-bottom: 10px;
  }
  .slider-left, .slider-right {
    float: left;
    width: 15%;
    height: 24px;
    text-align: center;
    line-height: 24px;
  }
  .song-time {
    font-size: 10px;
  }
  .slider-left .song-time {
    color: rgba(255,255,255,.8);
  }
  .slider-right .song-time {
    color: rgba(255,255,255,.5);
  }
  .slider-middle {
    float: left;
    width: 70%;
    height: 24px;
  }
  .player-mini {
    position: fixed;
    bottom: -1px;
    width: 100%;
    background-color: #fff;
    z-index: 200;
  }
  .player-mini .cover-mini {
    width: 100%;
    height: auto;
  }
  .player-mini .button {
    float: left;
    width: 36px;
    height: 36px;
  }
  .player-mini .button .iconfont {
    line-height: 36px;
  }
  @keyframes rotate {
    0% {transform: rotate(0)}
    100% {transform: rotate(360deg)}
  }
  .mbs-top {
    display: flex;
    height: 45px;
    padding-left: 10px;
    line-height: 45px;
    font-size: 20px;
    border-bottom: 2px solid #ccc;
  }
  .mbs-top .icon-back {
    font-size: 26px;
  }
  .mbs-title {
    margin-left: 10px;
  }
  .mbs-list {
    display: flex;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ddd;
  }
  .mbs-list p {
    display: inline-block;
    display: flex;
    flex-grow: 1;
    padding-left: 5px;
    overflow: hidden;
  }
  .mbs-list .icon-del {
    padding: 0 10px;
    color: #b0b0b0;
  }
  .mbs-list .name {
    display: inline-block;
    height: 100%;
    max-width: 240px;
    font-size: 15px;
  }
  .mbs-list .artist {
    display: inline-block;
    height: 100%;
    font-size: 12px;
    color: #bbb;
  }
  .mbs-list span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mbs-box {
    max-height: 20rem;
    overflow: hidden;
    overflow-y: scroll;
    margin-right: -20px;
    padding-right: 20px;
  }
</style>
