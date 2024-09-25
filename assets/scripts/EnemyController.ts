import {
    _decorator,
    BoxCollider2D,
    Collider2D,
    Component,
    Contact2DType,
    Node,
    resources,
    RigidBody2D,
    Sprite,
    SpriteFrame,
    Vec2
} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {

    private velocity: Vec2 =new Vec2(0,-10);

    start() {
        let rigidBody2D = this.node.getComponent(RigidBody2D);
        if (rigidBody2D) {
            rigidBody2D.linearVelocity = this.velocity;
        }
    }

    update(dt: number) {
        if (this.node.getPosition().y < 0) {
            this.destroy();
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


