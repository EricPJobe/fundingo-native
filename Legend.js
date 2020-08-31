import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Seat from "./Seat";

export default class Legend extends Component {
    render() {
        return (
          <View style={styles.container}>
              <View><Text>Legend:</Text></View>
              <View style={styles.legendItem}>
                  <Seat available={true}/>
                  <Text style={styles.legendText}>Available</Text>
              </View>
              <View style={styles.legendItem}>
                  <Seat available={false}/>
                  <Text style={styles.legendText}>Unavailable due to COVID</Text>
              </View>
              <View style={styles.legendItem}>
                  <Seat selected={true}/>
                  <Text style={styles.legendText}>Selected</Text>
              </View>
              <View style={styles.legendItem}>
                  <Seat occupied={true}/>
                  <Text style={styles.legendText}>Occupied</Text>
              </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        left: 32,
        top: 15,
        flexDirection: 'column',
        borderBottom: "solid 1px lightgrey",
    },
    legendItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5
    },
    legendText: {
        fontSize: 12
    }
});
