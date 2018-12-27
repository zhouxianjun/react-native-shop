import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';

const styles = StyleSheet.create({
    topNav: {
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        paddingHorizontal: 10,
        top: 0,
        paddingTop: statusBarHeight
    }
});

@observer
class ScrollSwitchNavView extends Component {
    static propTypes = {
        style: PropTypes.object,
        children: PropTypes.any,
        navs: PropTypes.array.isRequired
    }

    static defaultProps = {
        style: {},
        children: <View />
    }

    state = {
        y: 0
    }

    onScroll = (e) => {
        const { nativeEvent: { contentOffset: { y } } } = e;
        this.setState({ y });
    }

    render () {
        const {
            children, style, navs, ...props
        } = this.props;
        const { y } = this.state;
        return (
            <View style={style}>
                {
                    navs.filter(nav => nav.isShow(y))
                        .map(nav => (
                            <View key={nav.key} style={[styles.topNav, typeof nav.style === 'function' ? nav.style(y) : nav.style]}>
                                {
                                    typeof nav.component === 'function' ? nav.component(y) : nav.component
                                }
                            </View>
                        ))
                }
                <ScrollView ref={ref => this.scroll = ref} onScroll={this.onScroll} scrollEventThrottle={10} {...props}>
                    {children}
                </ScrollView>
            </View>
        );
    }
}

export default ScrollSwitchNavView;
