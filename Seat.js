import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCircle} from "@fortawesome/free-solid-svg-icons";

export default class Seat extends Component {
    constructor(props) {
        super(props);
    }

    OccupiedIcon = () => {
        if(this.props.occupied) {
            return (
                <View style={[styles.occupiedIcon]}>
                    <FontAwesomeIcon icon={faUserCircle} color={'white'} />
                </View>
            );
        }
    }

    render(props) {
        return (
            <View style={[
                styles.seat,
                this.props.disabled ? styles.disabled :
                    this.props.available ? styles.available :
                        this.props.selected ? styles.selected :
                            !this.props.available ? styles.unavailable : styles.error
            ]}>
                {this.OccupiedIcon()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    seat: {
        height: 20,
        width: 20,
        margin: 5,
        borderRadius: 2,
        cursor: 'pointer'
    },
    available: {
        backgroundColor: 'lightgreen'
    },
    unavailable: {
        backgroundColor: 'indianred',
        position: 'relative',
        cursor: 'default'
    },
    selected: {
        backgroundColor: 'deepskyblue'
    },
    disabled: {
        backgroundColor: 'lightgrey',
        cursor: 'default'
    },
    occupied: {
        backgroundColor: 'indianred',
        color: 'white'
    },
    error: {
        // backgroundColor: 'red',
        cursor: 'default'
    },
    occupiedIcon: {
        position: 'relative',
        top: 2,
        left: 2
    }
});

