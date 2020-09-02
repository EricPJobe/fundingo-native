import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class Titlebar extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View ><Text style={styles.title}>FUNDINGO</Text></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'orange',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        margin: 10
    }
});
