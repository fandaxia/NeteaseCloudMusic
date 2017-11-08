/**
 * Created by dashi on 2017/11/3.
 */
const state = {
  currentList: {}, // 选择的推荐歌单
  playing: true, // 歌曲播放状态，true: playing; false: paused
  fullScreen: false, // 播放器是否全屏显示
  playList: [], // 播放列表
  currentId: 0, // 当前播放歌曲的id
  currentSong: {}, // 当前播放的歌曲对象
  currentIndex: -1, // 当前播放歌曲对象在播放列表数组中的index
}

export default state
