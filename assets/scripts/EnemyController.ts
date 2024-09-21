import {_decorator, BoxCollider2D, Component, Node, resources, Sprite, SpriteFrame} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {
    start() {
        // let boxCollider2D = this.node.getComponent(BoxCollider2D);
        // if (boxCollider2D) {
        //     console.log("敌机的2D碰撞存在")
        // }

    }

    update(dt: number) {

    }

    /**
     * 敌机死亡
     */
    enemyDie() {
        // 加载被摧毁的图片
        resources.load("enemy0_die/spriteFrame", SpriteFrame, (err, sp) => {
            this.node.getComponent(Sprite).spriteFrame = sp;
        })
        // 300 毫米后销毁
        this.scheduleOnce(() => {
            this.node.destroy()
        }, 0.5)
    }
}


