import {_decorator, Component, Node, RichText} from 'cc';
import {DataManager} from "db://assets/scripts/common/DataManager";

const {ccclass, property} = _decorator;

@ccclass('KillAndDieBannerController')
export class KillAndDieBannerController extends Component {

    start() {

    }

    update(deltaTime: number) {
        let richText = this.node.getComponent(RichText);
        let dataManager = DataManager.getInstance();
        if (richText && dataManager) {
            richText.string = "杀敌：" + dataManager.kill + "|" + "阵亡：" + dataManager.die;
        }
    }
}


