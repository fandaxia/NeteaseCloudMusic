<template>
<div class="search">
  <div class="search-box">
    <div class="input-box">
      <div class="searchIcon icon-box">
        <i class="iconfont icon-search"></i>
      </div>
      <input @focus="close" type="text" class="input" v-model="keyword">
      <div @click="clear" class="closeBtn icon-box">
        <i class="iconfont icon-del"></i>
      </div>
    </div>
  </div>
  <div v-if="showResult" class="songListBox">
    <song-list :lists="resultLists" :show-index="false"></song-list>
  </div>
  <div v-show="!showResult" class="suggest-box">
    <h3 @click="searchStart" class="searchBtn">搜索“{{keyword}}”</h3>
    <ul>
      <li v-for="item in suggestLists" class="sug-li">
        <i class="iconfont icon-search"></i>
        <span @click="suggestSearch($event)" class="sug-text">{{item.artist}} {{item.name}}</span>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
  import api from '../api'
  import SongList from './songList'
export default {
  components: {
    SongList
  },
  data () {
    return {
      keyword: '',
      resultLists: [],
      suggestLists: [],
      showResult: false,
    }
  },
  created () {

  },
  watch : {
    keyword (val) {
      if(val == ''){
        this.suggestLists = []
        return
      }
      this.$ajax.get(api.urlSearchSuggest(val)).then((res) => {
        if(res.data.result.artists){
          let list = []
          res.data.result.artists.forEach(function (val) {
            list.push({
              artist: val.name,
              name: ''
            })
          })
          res.data.result.songs.forEach(function (val) {
            list.push({
              artist: val.artists[0].name,
              name: val.name
            })
          })
          this.suggestLists = list
        }
      })
    }
  },
  methods: {
    searchStart () {
      this.$ajax.get(api.urlSearch(this.keyword)).then((res) => {
        this.resultLists = res.data.result.songs
      })
      this.showResult = true
    },
    suggestSearch(e) {
      this.keyword = e.target.innerHTML
      this.searchStart()
    },
    clear () {
      this.keyword = ''
      this.showResult = false
    },
    close () {
      this.showResult = false
    }
  }
}
</script>

<style>
  .search-box {
    padding: 15px 10px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }
  .input-box {
    position: relative;
    width: 100%;
    height: 30px;
    padding: 0 30px;
    background-color: #eee;
    border-radius: 15px;
  }
  .search-box .input {
    width: 100%;
    height: 30px;
    border: 0;
    outline: none;
    background: transparent;
    font-size: 14px;
  }
  .icon-box {
    position: absolute;
    top: 0;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: #b0b0b0;
  }
  .searchIcon {
    left: 0;
  }
  .closeBtn {
    right: 0;
  }
  .search-box .icon-search {
    font-size: 20px;
  }
  .suggest-box .searchBtn {
    height: 50px;
    padding: 0 10px;
    font: 18px/50px Arial;
    color: #507daf;
    border-bottom: 1px solid #eee;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sug-li {
    display: -webkit-flex;
    display: flex;
    height: 45px;
    padding-left: 10px;
    line-height: 40px;
  }
  .sug-li .icon-search {
    font-size: 20px;
  }
  .sug-text {
    display: inline-block;
    margin: 0 10px;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-bottom: 1px solid #eee;
  }
  .songListBox {
    position: relative;
    z-index: 50;
  }
</style>
