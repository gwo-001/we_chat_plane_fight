import {_decorator, Button, Component, Node, tween, Vec3} from 'cc';
import {HeroController} from "db://assets/scripts/HeroController";

const {ccclass, property} = _decorator;

@ccclass('restartBtnController')
export class restartBtnController extends Component {

    @property(Node)
    hero: Node = null;

    protected onLoad() {
        let button = this.node.getComponent(Button);
        if (button) {
            button.node.on(Button.EventType.CLICK, this.reviveHero, this);
            console.log("按钮点击事件已注册");
        } else {
            console.error("未找到按钮组件");
        }
    }

    start() {

    }

    update(deltaTime: number) {

    }

    reviveHero(button: Button) {
        console.log("复活英雄")
        if (this.hero) {
            this.hero.getComponent(HeroController)?.reviveHero();
        } else {
            console.error("未找到英雄节点");
        }
        const btnOriginalPosition = new Vec3(358.852, 0, 0);
        tween(this.node)
            .to(2, {position: btnOriginalPosition}, {easing: 'cubicOut'})
            .start();
    }
}


