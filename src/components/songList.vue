<!--通用的歌曲列表组件-->
<!--
  props:
    lists 歌曲数据
    show-index 是否显示列表编号
-->
<template>
<div class="songList">
  <div class="songListBox">
    <mu-list>
      <mu-list-item @click="select(item.id)" v-for="(item,index) in lists" :key="item.id" :title="item.name" :describeText="joinDescribeText(item)" titleClass="songName" describeTextClass="singer-album" :describeLine="1">
        <span v-if="showIndex" slot="left" v-text="index < 9? '0' + (index+1): (index+1)"></span>
        <i class="iconfont icon-play" slot="right"></i>
        <mu-divider></mu-divider>
      </mu-list-item>
    </mu-list>
  </div>
</div>
</template>

<script>
  import api from '../api'
  import MuList from "../../node_modules/muse-ui/src/list/list";
  import MuListItem from "../../node_modules/muse-ui/src/list/listItem";
  import MuDivider from "../../node_modules/muse-ui/src/divider/divider";
  import {mapActions, mapGetters, mapMutations} from 'vuex'
export default {
  components: {MuDivider, MuListItem, MuList},
  props: {
    'lists' : Array,
    'show-index': Boolean
  },
  computed: {
    ...mapGetters([
      'playList',
      'currentIndex'
    ])
  },
  methods: {
    joinDescribeText (obj) {
      let artist = obj.artists
      let artistText = artist.length >= 2?artist[0].name + '/' + artist[1].name : artist[0].name
      return artistText + '-' + obj.album.name
    },
    select(id) {
      this.$router.push({path: this.$route.path + '?ids=' + id})
      this.$ajax.get(api.urlSongDetail(id)).then((res) => {
        let item = res.data.songs[0]
        this.selectPlay({
          item: item
        })
        // 判断播放歌曲在播放列表中是否存在，避免重复添加歌曲
        if(this.playList.findIndex(function (value) {
            return value.id === id
          }) < 0){
          this.$store.commit('setPlayList', item)
        }
      })
    },
    ...mapActions([
      'selectPlay'
    ]),
    ...mapMutations([
      'setPlayList'
    ])
  }
}
</script>

<style>
  .songListBox .mu-item {
    padding: 8px 56px 0 16px;
  }
  .songListBox .mu-item.show-left {
    padding-left: 44px;
  }
  .songListBox .mu-item-left {
    left: 10px;
    color: #b3b3b3;
    font-size: 18px;
  }
  .songListBox .songName {
    font-size: 17px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .songListBox .singer-album {
    font-size: 12px;
  }
  .songListBox .mu-divider {
    margin-top: 8px;
  }
  .songListBox .icon-play {
    font-size: 28px;
  }
</style>
