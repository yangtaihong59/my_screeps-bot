import { errorMapper } from './modules/errorMapper'
import { mount } from './mount/mount';mount()
import { globalset } from './creepApi';globalset()
import { creepborncontrol } from './mount/creep/creep.born.control'
import { doing } from './utils'

export const loop = errorMapper(() => {

    creepborncontrol()
    
    // 所有建筑、creep、powerCreep 执行工作
    doing(Game.structures, Game.creeps, Game.powerCreeps)
})
