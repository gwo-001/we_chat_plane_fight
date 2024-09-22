import {_decorator, Component, director, instantiate, Node, Prefab} from 'cc';
import {HeroController} from "db://assets/scripts/HeroController";

const {ccclass, property} = _decorator;

@ccclass('EnemyProducer')
export class EnemyProducer extends Component {
    @property(Prefab)
    enemyPrefab: Prefab = null;

    start() {
        // 如果玩家存活，那么每一秒产生一个敌机
        this.schedule(() => {
            let heroController = this.getComponentInChildren(HeroController);
            if (!heroController || !heroController.getHeroAlive()) {
                return
            }
            let enemyIns = instantiate(this.enemyPrefab);
            enemyIns.setParent(director.getScene().getChildByName("Canvas"))
            const x = Math.floor(Math.random() * 421 - 210);
            enemyIns.setPosition(x, 850);
        }, 0.3)
    }

    update(deltaTime: number) {
        // 更新每一帧敌机的位置
        if (this.enemyPrefab) {

        }
    }


}


