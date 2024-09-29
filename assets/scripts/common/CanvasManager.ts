import {_decorator, Button, Component, director, instantiate, Node, Prefab, RichText, tween, Vec3} from 'cc';

import {EventTypeEnum} from "db://assets/scripts/constants/EventTypeEnum"

const {ccclass, property} = _decorator;

@ccclass('EnemyProducer')
export class EnemyProducer extends Component {
    @property(Prefab)
    enemyPrefab: Prefab = null;
    @property(Button)
    restartBtn: Button | null = null;
    @property(RichText)
    killAndDie: RichText | null = null;
    // 敌机生产的开关
    private productEnemy = true;

    start() {
        // 如果玩家存活，那么每一秒产生一个敌机
        this.produceEnemy();
        // 监听玩家死亡事件
        director.on(EventTypeEnum.HERO_DIE, this.onHeroDie, this);
        // 监听复活
        director.on(EventTypeEnum.HERO_REVIVE, this.onHeroRevive, this);
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
        // 发布复活事件
        director.emit(EventTypeEnum.HERO_REVIVE);
    }

    private produceEnemy() {
        this.schedule(() => {
            if (!this.productEnemy) {
                return
            }
            let enemyIns = instantiate(this.enemyPrefab);
            enemyIns.setParent(director.getScene().getChildByName("Canvas"));
            const x = Math.floor(Math.random() * 421 - 210);
            enemyIns.setPosition(x, 850);
        }, 0.5)
    }

    // 当玩家阵亡时
    private onHeroDie() {
        // 将复活按钮移动到屏幕中间来
        const targetPosition = new Vec3(0, 0, 0);
        tween(this.restartBtn.node)
            .to(2, {position: targetPosition}, {easing: 'cubicOut'})
            .start();
        //
        this.productEnemy = false;
    }

    // 当监听到玩家复活的事件之后
    private onHeroRevive() {
        this.restartBtn.node.setPosition(new Vec3(358.852, 0, 0))
        this.productEnemy = true;
    }
}


