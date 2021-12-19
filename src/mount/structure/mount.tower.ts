

export const mountTower = function () {
    
    // 将拓展签入 Tower 原型
    _.assign(StructureTower.prototype, towerExtension)
}
// 自定义的 Tower 的拓展
const towerExtension = {
    //工作
    work(){
        if(this.towerattack() == 'ERR_NO_TARGET'){
            this.towerrepair()
        }else{
            this.towerattack(1000,1000)
        }
    },      
    //攻击
    towerattack(){
        var closestHostile = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            this.attack(closestHostile);
        }
        else{
            return 'ERR_NO_TARGET'
        }
    },
    //维修
    towerrepair(ramparthit,wallhit){
        var closestDamagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, {
            filter:(structure)=>{
                return structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_RAMPART && structure.structureType !=STRUCTURE_WALL;

            }
        });
        if(closestDamagedStructure) {
            this.repair(closestDamagedStructure);
        }else{
            return 'ERR_NO_TARGET'
        }
    }
}