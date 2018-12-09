import React, { PureComponent } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import PropTypes from 'prop-types';

export default class NumberInput extends PureComponent {
    static propTypes = {
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        onChange: PropTypes.func
    }

    static defaultProps = {
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
        step: 1,
        onChange: () => {}
    }

    constructor (props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    stepBy (step) {
        const { value } = this.state;
        this.change(value + step);
    }

    change (newer) {
        if (Number.isNaN(newer)) {
            return;
        }
        const value = Number.parseInt(`${newer || 0}`, 10);
        const { min, max, onChange } = this.props;
        if (value >= min && value <= max) {
            this.setState({ value });
            const { value: old } = this.state;
            onChange(value, old);
        }
    }

    render () {
        const { value } = this.state;
        const { step, min, max } = this.props;
        return (
            <View style={{
                flexDirection: 'row',
                borderRadius: 5,
                borderColor: '#ddd',
                borderWidth: 1,
                alignItems: 'center'
            }}
            >
                <TouchableOpacity
                    style={{ padding: 8, borderColor: '#ddd', borderRightWidth: 1 }}
                    disabled={value <= min}
                    onPress={() => this.stepBy(-step)}
                >
                    <Icon name="minus" color={value <= min ? '#ddd' : '#000'} />
                </TouchableOpacity>
                <TextInput
                    style={{ padding: 0, width: 50, textAlign: 'center' }}
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    onChangeText={val => this.change(val)}
                >{value}
                </TextInput>
                <TouchableOpacity
                    style={{ padding: 8, borderColor: '#ddd', borderLeftWidth: 1 }}
                    disabled={value >= max}
                    onPress={() => this.stepBy(step)}
                >
                    <Icon name="plus" color={value >= max ? '#ddd' : '#000'} />
                </TouchableOpacity>
            </View>
        );
    }
}
