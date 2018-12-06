import React from 'react';
import {
    View, Text, FlatList, StyleSheet
} from 'react-native';
import { SearchBar } from 'antd-mobile-rn';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
    cateItem: {
        height: 40,
        fontSize: 18,
        padding: 10
    }
});
const data = Array.from({ length: 30 }).map((item, index) => Object.assign({
    key: `key-${index}`,
    name: `name-${index + 1}`
}));
export default () => (
    <View style={{ flex: 1 }}>
        <SearchBar placeholder="搜索" />
        <View style={{ flex: 1 }}>
            <FlatList data={data} renderItem={({ item }) => <Text style={styles.cateItem}>{`aa${item.name}`}</Text>} />
        </View>
    </View>
);
