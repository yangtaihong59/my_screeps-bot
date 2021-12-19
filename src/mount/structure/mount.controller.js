export const mountController = function () {
    
    // 将拓展签入 Tower 原型
    _.assign(StructureController.prototype, controllerExtension)
}
// 自定义的 Tower 的拓展
const controllerExtension = {
    //工作
    work(){
        if (Game.time % 20) return
        this.stateScanner()
    },      
    /**
     * 统计自己的等级信息
     * 
     * @returns 为 true 时说明自己等级发生了变化
     */
    stateScanner() {
        let hasLevelChange = false
        if (!Memory.stats.rooms[this.room.name]) Memory.stats.rooms[this.room.name] = {}

        // 统计升级进度
        Memory.stats.rooms[this.room.name].controllerRatio = (this.progress / this.progressTotal) * 100

        // 统计房间等级
        if (Memory.stats.rooms[this.room.name].controllerLevel !== this.level) hasLevelChange = true
        Memory.stats.rooms[this.room.name].controllerLevel = this.level

        return hasLevelChange
    }
}