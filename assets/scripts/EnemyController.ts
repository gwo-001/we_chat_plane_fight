import {
    _decorator,
    BoxCollider2D,
    Collider2D,
    Component,
    Contact2DType,
    Node,
    resources,
    Sprite,
    SpriteFrame
} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {

    start() {
    }

    update(dt: number) {
        if (this.node.getPosition().y < 0) {
            this.destroy();
            console.log("敌机已经被摧毁")
        }
    }

    /**
     * 敌机死亡
     */
    enemyDie() {
        // 加载被摧毁的图片
        resources.load("enemy0_die/spriteFrame", SpriteFrame, (err, sp) => {
            this.node.getComponent(Sprite).spriteFrame = sp;
        })
        // 禁用死亡敌机的碰撞
        let boxCollider2D = this.getComponent(BoxCollider2D);
        boxCollider2D.enabled = false;
        // 300 毫米后销毁
        this.scheduleOnce(() => {
            this.node.destroy()
        }, 0.5)
    }

}


