import {_decorator, Component, director, Node} from 'cc';
import {EnemyController} from "db://assets/scripts/EnemyController";

const {ccclass, property} = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {
    @property
    speed: number = 800;

    start() {
        // director.
    }

    update(dt: number) {
        let oldPosition = this.node.getPosition();
        // 编写子弹移动逻辑
        this.node.setPosition(oldPosition.x, oldPosition.y + 800 * dt)
        // 子弹飞出屏幕之后销毁掉
        if (this.node.getPosition().y > 852) {
            this.node.destroy();
        }
    }

    onCollisionEnter(other) {
        // 如果碰撞的是敌机
        if (other.tag === 1) {
            this.node.destroy();
        }

    }
}


