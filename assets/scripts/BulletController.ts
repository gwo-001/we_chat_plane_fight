import {_decorator, BoxCollider2D, Collider2D, Component, Contact2DType, RigidBody2D, UITransform, Vec2} from 'cc';
import {EnemyController} from "db://assets/scripts/EnemyController";

/**
 * import {EnemyController} from "db://assets/scripts/EnemyController";
 */

const {ccclass, property} = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {
    @property(Vec2)
    velocity: Vec2;


    start() {
        let thisNode = this.node;
        // 监听子弹的碰撞
        let collider = thisNode.getComponent(BoxCollider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
        // 给子弹赋予一个初速度
        thisNode.getComponent(RigidBody2D)!.linearVelocity = this.velocity
    }

    update(dt: number) {
        // // 子弹飞出屏幕之后销毁掉
        if (this.node.getPosition().y > 852) {
            console.log("子弹销毁")
            this.node.destroy();
        }
    }

    // 碰撞开始时的回调
    onBeginContact(self: Collider2D, other: Collider2D) {
        if (other.tag === 0) {
            // 调用一下敌机的摧毁动画
            let enemyController = other.node.getComponent(EnemyController);
            if (enemyController) {
                enemyController.enemyDie()
                // self.node.destroy();
            }
            // self.node.destroy();
        }
    }

}


