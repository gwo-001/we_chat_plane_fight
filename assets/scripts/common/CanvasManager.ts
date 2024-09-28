import {_decorator, Button, Component, director, instantiate, Node, Prefab, RichText, Vec3} from 'cc';
import {HeroController} from "db://assets/scripts/HeroController";
import {EnemyController} from "db://assets/scripts/EnemyController";

const {ccclass, property} = _decorator;

@ccclass('EnemyProducer')
export class EnemyProducer extends Component {
    @property(Prefab)
    enemyPrefab: Prefab = null;
    @property(Button)
    restartBtn: Button | null = null;
    @property(RichText)
    killAndDie: RichText | null = null;


    start() {
        // 如果玩家存活，那么每一秒产生一个敌机
        this.schedule(() => {
            let heroController = this.getComponentInChildren(HeroController);
            if (!heroController || !heroController.getHeroAlive()) {
                return
            }
            let enemyIns = instantiate(this.enemyPrefab);
            enemyIns.setParent(director.getScene().getChildByName("Canvas"));
            const x = Math.floor(Math.random() * 421 - 210);
            enemyIns.setPosition(x, 850);
        }, 0.5)
    }

    update(deltaTime: number) {
    }

    protected onLoad() {
        this.restartBtn.node.on("click", this.restartBtnClick, this);
    }

    private restartBtnClick() {
        let hero = this.node.getChildByName("hero");
        if (!hero) {
            return;
        }
        // 复活英雄
        hero.getComponent(HeroController)?.reviveHero()
        // 复活按钮移开
        this.restartBtn.node.setPosition(358.852, 0);
    }


}


