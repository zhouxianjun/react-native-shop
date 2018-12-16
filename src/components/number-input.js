import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

@observer
class NumberInput extends Component {
    static propTypes = {
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        value: PropTypes.number,
        onChange: PropTypes.func
    }

    static defaultProps = {
        min: -Infinity,
        max: Infinity,
        step: 1,
        value: 0,
        onChange: () => {}
    }

    stepBy (step) {
        const { value } = this.props;
        this.change(value + step);
    }

    change (newer) {
        if (Number.isNaN(newer)) {
            return;
        }
        const value = Number.parseInt(`${newer || 0}`, 10);
        const {
            min, max, onChange, value: old
        } = this.props;
        if (value >= min && value <= max) {
            onChange(value, old);
        }
    }

    render () {
        const {
            step, min, max, value
        } = this.props;
        return (
            <View style={{
                flexDirection: 'row',
                borderRadius: 5,
                borderColor: '#ddd',
                borderWidth: 1,
                height: 30,
                alignItems: 'center'
            }}
            >
                <TouchableOpacity
                    style={{
                        paddingHorizontal: 8, borderColor: '#ddd', borderRightWidth: 1
                    }}
                    disabled={value <= min}
                    onPress={() => this.stepBy(-step)}
                >
                    <Icon name="md-remove" color={value <= min ? '#ddd' : '#000'} />
                </TouchableOpacity>
                <TextInput
                    style={{ padding: 0, width: 40, textAlign: 'center' }}
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    onChangeText={val => this.change(val)}
                >{value}
                </TextInput>
                <TouchableOpacity
                    style={{
                        paddingHorizontal: 8, borderColor: '#ddd', borderLeftWidth: 1
                    }}
                    disabled={value >= max}
                    onPress={() => this.stepBy(step)}
                >
                    <Icon name="md-add" color={value >= max ? '#ddd' : '#000'} />
                </TouchableOpacity>
            </View>
        );
    }
}

export default NumberInput;
