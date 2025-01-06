import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class VantaContainer extends Component {
    @action
    initVanta () {
        VANTA.CLOUDS({
            el: '#vanta', // element selector string or DOM object reference
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            speed: 0.8,
            fpsLimit: 30
        })
    }
}
