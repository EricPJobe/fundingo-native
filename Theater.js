import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Alert } from 'react-native';
import Seat from "./Seat";
import Legend from "./Legend";
import Titlebar from "./Titlebar";
import TouchableOpacity from "react-native-web/dist/exports/TouchableOpacity";

export default class Theater extends Component {
    numRows = 10;
    numSeats = 10;
    capacity = this.numRows * this.numSeats;
    reducedCapacity = Math.floor(this.capacity * 0.3);
    counter = 0;

    // Hard coded for POC
    occupiedSeatMap = [
        [false, false, false, false, true, true, false, false, false, false, ],
        [false, false, false, false, false, false, false, false, false, false, ],
        [false, false, false, true, true, true, false, false, true, false, ],
        [false, false, false, false, false, false, false, false, false, false, ],
        [false, true, true, false, true, true, true, false, false, false, ],
        [false, false, false, false, false, false, false, false, false, false, ],
        [false, true, true, false, false, true, true, true, false, false, ],
        [false, true, true, false, false, true, false, true, true, true, ],
        [false, false, false, false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, false, false, false, ],
    ];
    display = false;

    constructor(props) {
        super(props);
        this.state = {
            seats: [],
            occupiedSeats: [],
            isAtCapacity: false,
            isOverCapacity: false,
            numOccupied: 0,
        }
    }

    componentDidMount = () => {
        console.log("Initializing");
        this.initializeSeats();
        this.display = true;
    }

    // a -> m a
    initializeSeats = () => {
        let seats = [];
        for(let i=0; i<this.numRows; i++) {
            seats.push([]);
            for(let j=0; j<this.numSeats; j++) {
                seats[i].push({available: true, occupied: false, selected: false, disabled: false})
            }
        }
        this.assignOccupied(seats)
    }

    assignOccupied = (seats) => {
        let numOccupied = 0;
        this.occupiedSeatMap.forEach((row, i) => {
            row.forEach((seat, j) => {
                if (seat === true) {
                    seats[i][j].occupied = true;
                    seats[i][j].available = false;
                    numOccupied +=1;
                }
            });
        });
        this.calcSeats(seats, numOccupied);
    }

    // [[seat]] -> Int -> IO ()
    calcSeats = (seats, numOccupied) => {
        let atCapacity = this.state.atCapacity;
        console.log(seats);
        let assignedSeats = this.checkAvailability(seats);
        if (numOccupied >= this.reducedCapacity) {
            atCapacity = true;
        }
        this.setState({seats: assignedSeats, atCapacity: atCapacity, numOccupied: numOccupied });
    }

    checkAvailability = (seats) => {
        seats.forEach((row, i) => {
            row.forEach((seat, j) => {
                if (j > 0 && j < row.length - 1) {
                    seat.available =
                        seat.occupied === false &&
                        row[j - 1].occupied === false &&
                        row[j + 1].occupied === false;
                } else if (j === 0) {
                    seat.available =
                        seat.occupied === false &&
                        row[j + 1].occupied === false;
                } else if (j === row.length - 1) {
                    seat.available =
                        seat.occupied === false &&
                        row[j - 1].occupied === false;
                }
            });
        });
        return seats;
    }

    recalcSeats = () => {
        this.display = false;
        this.assignSelected();
        this.display = true;
    }

    assignSelected = ()  => {
        let {seats, numOccupied} = this.state;
        if (numOccupied <= this.reducedCapacity) {
            seats.forEach(row => {
                row.forEach(seat => {
                    if (seat.selected) {
                        seat.occupied = true;
                        seat.selected = false;
                    }
                });
            });
            numOccupied += this.counter;
            if (numOccupied === this.reducedCapacity) {
                this.setState({isAtCapacity:  true});
            } else if (numOccupied < this.reducedCapacity) {
                this.setState({isAtCapacity: false});
            }
        } else {
            this.setState({isOverCapacity: true});
        }
        this.calcSeats(seats, numOccupied);
    }

    selectSeat = (i, j) => {
        let seats = [...this.state.seats];
        if (!seats[i][j].selected && seats[i][j].available) {
            // console.log("selecting");
            seats[i][j].selected = true;
            seats[i][j].available = false;
            this.counter += 1;
        } else if (seats[i][j].selected) {
            // console.log("unselecting");
            seats[i][j].selected = false;
            seats[i][j].available = true;
            this.counter -= 1;
        }
        // console.log("numOccupied: " + this.state.numOccupied);
        // console.log("counter: " + this.counter);
        // console.log("reducedCapacity: " + this.reducedCapacity);
        if (this.state.numOccupied + this.counter === this.reducedCapacity) {
            // console.log("At capacity!");
            this.setState({isAtCapacity: true});
            this.lockdown();
        } else if (this.state.numOccupied + this.counter > this.reducedCapacity) {
            // console.log("Over capacity!");
            this.setState({isOverCapacity: true});
            this.lockdown();
        } else if (this.state.numOccupied - this.counter < this.reducedCapacity) {
            // console.log("Under capacity!");
            this.setState({isOverCapacity: false});
            this.setState({isAtCapacity:false});
            this.unlock();
        }
        this.setState({seats: seats});
    }

    lockdown = () => {
        let seats = this.state.seats;
        seats.forEach(row => {
            row.forEach(seat => {
                if (seat.available) {
                    seat.disabled = true;
                }
            });
        });
        this.setState({seats: seats});
        Alert.alert(
            this.state.isAtCapacity ? 'At Capacity' :
                this.state.isOverCapacity ? 'Over Capacity' : 'Error',
            this.state.isAtCapacity ? 'No more seats available!' :
                this.state.isOverCapacity ? `You have exceeded this theater's capacity. Please deselect ${this.state.numSelected - this.reducedCapacity} `: 'Error',
            [
                {
                    text: 'Dismiss',
                    onPress: () => console.log("Dismissed")
                }
            ]
        );
    }

    unlock = () => {
        let seats = this.state.seats;
        seats.forEach((row, i) => {
            row.forEach((seat, j) => {
                if (seat.disabled) {
                    seat.disabled = false;
                }
            });
        });
        this.setState({seats: seats});
    }

    render() {
        const seats = this.state.seats
        return (
            <View>
                <View>
                    <Titlebar />
                </View>
                <View style={styles.pickContainer}>
                    <View><Text style={styles.pickText}>PICK YOUR SEATS</Text></View>
                </View>
                <View style={[styles.container]}>
                    {seats.map( (row, i) => {
                        return (
                            <View key={i} style={{flexDirection: 'row'}}>
                                {row.map((seat, j) => {
                                    return (
                                        <TouchableWithoutFeedback key={j} onPress={() => this.selectSeat(i, j)}>
                                            <View>
                                                <Seat available={seat.available}
                                                      occupied={seat.occupied}
                                                      selected={seat.selected}
                                                      disabled={seat.disabled}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })}
                            </View>
                        )
                    })}
                </View>
                <View style={styles.container}>
                    <View>
                        <TouchableOpacity style={styles.selectButton} onPress={() => this.recalcSeats()}>
                            <View><Text style={{ color: 'white'}}>Confirm Seats</Text></View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Legend />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pickText: {
        fontWeight: 'bold'
    },
    pickContainer: {
        margin: 25,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: 1,
        borderBottomColor: 'lightgrey'
    },
    selectButton: {
        alignItems: 'center',
        backgroundColor: 'orange',
        padding: 10,
        margin: 25
    }
});




