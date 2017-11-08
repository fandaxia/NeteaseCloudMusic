/**
 * Created by dashi on 2017/11/4.
 */


export const selectPlay = function ({commit},{item}) {
  commit('setCurrentId', item.id)
  commit('setPlaying', true)
  commit('setCurrentSong', item)
}
