import {_decorator, Component, Node, Vec2} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('bgController')
export class BgController extends Component {
    start() {

    }

    /**
     *
     * @param deltaTime 每一帧的时间
     */
    update(deltaTime: number) {
        for (let child of this.node.children) {
            let chidrenX = child.getPosition().x;
            child.setPosition(child.position.x, child.position.y - (50 * deltaTime))
            if (child.position.y < -852) {
                child.setPosition(chidrenX,852)
            }
        }
    }
}


