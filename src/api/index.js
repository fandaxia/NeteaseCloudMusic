/**
 * Created by dashi on 2017/10/29.
 */
const url = 'http://localhost:3000'

export default {
  urlRecommend () {
    return url + '/personalized'
  },
  urlNewSong () {
    return url + '/personalized/newsong'
  },
  urlHotSong () {
    return url + '/search?type=1&limit=100&keywords=热歌榜'
  },
  urlSongDetail (id) {
    return url + '/song/detail?ids=' + id
  },
  urlLyric (id) {
    return url + '/lyric?id=' + id
  },
  urlSingleSong (id) {
    return url + '/music/url?id=' + id
  },
  urlPlayList (id) {
    return url + '/playlist/detail?id=' + id
  },
  urlSearchSuggest (key) {
    return url + '/search/suggest?keywords=' + key
  },
  urlSearch (key) {
    return url + '/search?type=1&keywords=' + key
  }
}
