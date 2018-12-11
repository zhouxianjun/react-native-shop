import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Progress } from 'antd-mobile-rn';

export default class LoadingBar extends PureComponent {
    constructor (props) {
        super(props);
        this.state = {
            percent: 0,
            barStyle: {},
            show: false
        };
    }

    start () {
        const { show } = this.state;
        if (show) {
            return;
        }
        this.timer = setInterval(() => {
            const { percent } = this.state;
            const newer = percent + Math.floor(Math.random() * 3 + 1);
            if (newer > 95) {
                this.clearTimer();
            }
            this.setState({ percent: newer, show: true });
        }, 200);
    }

    finish () {
        this.clearTimer();
        this.setState({ percent: 100, show: true });
        this.hide();
    }

    error () {
        this.clearTimer();
        this.setState({ percent: 100, show: true, barStyle: { borderColor: 'red' } });
        this.hide();
    }

    clearTimer () {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    hide () {
        setTimeout(() => {
            this.setState({ show: false });
            setTimeout(() => this.setState({ percent: 0 }), 200);
        }, 800);
    }

    render () {
        const { percent, barStyle, show } = this.state;
        return !show ? null : (
            <View style={{ height: 2 }}>
                <Progress percent={percent} barStyle={barStyle} />
            </View>
        );
    }
}
