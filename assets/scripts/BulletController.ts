import {_decorator, BoxCollider2D, Collider2D, Component, Contact2DType} from 'cc';
import {EnemyController} from "db://assets/scripts/EnemyController";

/**
 * import {EnemyController} from "db://assets/scripts/EnemyController";
 */

const {ccclass, property} = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {
    @property
    speed: number = 800;

    start() {
        let collider = this.getComponent(BoxCollider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    update(dt: number) {
        let oldPosition = this.node.getPosition();
        // 编写子弹移动逻辑
        this.node.setPosition(oldPosition.x, oldPosition.y + 800 * dt)
        // 子弹飞出屏幕之后销毁掉
        if (this.node.getPosition().y > 852) {
            console.log("子弹销毁")
            this.destroy();
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


