/**
 * Created by dashi on 2017/11/4.
 */
const mutations = {
  setCurrentList (state, item) {
    state.currentList = item
  },
  setPlaying (state, flag) {
    state.playing = flag
  },
  setFullScreen (state, flag) {
    state.fullScreen = flag
  },
  setPlayList (state, item) {
    state.playList.push(item)
  },
  setCurrentId (state, id) {
    state.currentId = id
  },
  setCurrentSong (state, item) {
    state.currentSong = item
  },
  setCurrentIndex (state, index) {
    state.currentIndex = index
  },
  playNext (state) {
    state.currentIndex++
    if(state.currentIndex >= state.playList.length){
      state.currentIndex = 0
    }
  },
  playPrev (state) {
    state.currentIndex--
    if(state.currentIndex < 0){
      state.currentIndex = state.playList.length - 1
    }
  }
}

export default mutations
