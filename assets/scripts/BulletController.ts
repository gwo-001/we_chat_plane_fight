import {_decorator, BoxCollider2D, Collider2D, Component, Contact2DType, RigidBody2D, Vec2} from 'cc';
import {EnemyController} from "db://assets/scripts/EnemyController";

/**
 * import {EnemyController} from "db://assets/scripts/EnemyController";
 */

const {ccclass, property} = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {
    @property(Vec2)
    velocity: Vec2 = null!;


    start() {
        let thisNode = this.node;
        if (!thisNode) {
            return;
        }
        // 给子弹赋予一个初速度
        let rigidBody2D = thisNode.getComponent(RigidBody2D);
        if (rigidBody2D) {
            rigidBody2D!.linearVelocity = this.velocity;
        }
        // 监听子弹的碰撞
        let collider = thisNode.getComponent(BoxCollider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    update(dt: number) {
        // // 子弹飞出屏幕之后销毁掉
        if (this.node.getPosition().y > 852) {
            this.node.destroy();
        }
    }

    // 碰撞开始时的回调
    onBeginContact(self: Collider2D, other: Collider2D) {
        if (other.tag !== 0) {
            return;
        }
        // 延迟销毁，确保安全。
        this.scheduleOnce(() => {
            self.node.destroy();
        }, 0);
    }

}


