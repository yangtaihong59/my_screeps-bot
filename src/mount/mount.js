//const mountCreep = require('./mount.creep')
// const mountFlag = require('./mount.flag')
// const mountRoom = require('./mount.room')
import { mountCreep } from './creep/mount.creep'
import { mountSpawn } from './structure/mount.spawn'
import { mountTower } from './structure/mount.tower'
import { mountController } from './structure/mount.controller'
// 挂载所有的额外属性和方法

export const mount = function () {
//module.exports = function () {
  
    console.log('[mount] 重新挂载拓展')
    initStorage()
    mountCreep()
    mountSpawn()
    mountTower()
    mountController()
    // mountFlag()
    // mountRoom()
    // 其他更多拓展...
//}
}

/**
 * 初始化存储
 */
 function initStorage() {
  if (!Memory.rooms) Memory.rooms = {}
  else delete Memory.rooms.undefined

  if (!Memory.stats) Memory.stats = { rooms: {} }
  if (!Memory.creepConfigs) Memory.creepConfigs = {}
  if (!global.routeCache) global.routeCache = {}
  if (!global.resourcePrice) global.resourcePrice = {}
}