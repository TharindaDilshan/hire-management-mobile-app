import React from 'react'
import { View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { Text, Card, Button, Badge } from 'react-native-elements';
import Firebase from '../config/Firebase';
import { connect } from 'react-redux'
import moment from 'moment'
import { Row } from 'native-base';

class Dashboard extends React.Component {

    constructor() {
        super();
        this.ref = Firebase.firestore().collection('hires');
        this.unsubscribe = null;
        this.state = {
          isLoading: true,
          hires: []
        };
    }
    
    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }
    onCollectionUpdate = (querySnapshot) => {
        const hires = [];
        querySnapshot.forEach((doc) => {
          const { driverId, hireStatus,hireType, pickupDatetime, pickupLocation, customerId, customerName } = doc.data()
          hires.push({
            key: doc.id,
            driverId,
            hireStatus,
            hireType,
            pickupLocation,
            customerId,
            customerName,
            pickupDatetime: moment(pickupDatetime).format('MMM Do YYYY, h:mm:ss a'),
            pickupDate : pickupDatetime
          });
        });
        this.setState({
          hires,
          isLoading: false,
       });
    }

    static navigationOptions = {
        title: 'Dashboard', 
        headerLeft: null,
    };

    handleSignout = () => {
        Firebase.auth().signOut()
        this.props.navigation.navigate('Login')
    }

    render() {
        if(this.state.isLoading){
            return(
              <View style={styles.activity}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )
        } 
        const ongoingHire = this.state.hires.filter(item => item.driverId === this.props.user.id && item.hireStatus === 'ongoing' && moment(item.pickupDate).format('MMMM Do YYYY') === moment().format('MMMM Do YYYY') )
        const assignedHiresCount = this.state.hires.filter(item => item.driverId === this.props.user.id && item.hireStatus === 'driverPending').length
        const upcomingHiresCount = this.state.hires.filter(item => item.driverId === this.props.user.id && item.hireStatus === 'ongoing' && moment(item.pickupDate).format('MMMM Do YYYY') > moment().format('MMMM Do YYYY') ).length
        return (
            <ScrollView>
                <TouchableOpacity style={styles.signout} onPress={
                    this.handleSignout
                    }>
                    <Text style={styles.signoutButtonText}>Logout</Text>
                </TouchableOpacity>
                <Card style={styles.cardContainer}>
                    <View style={styles.subContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            this.props.navigation.navigate('AssignedHires')
                        }}>
                            <Text style={styles.buttonText}>NEW HIRE ASSIGNMENTS  </Text>
                            <Badge style={styles.badge} value={assignedHiresCount} status="primary" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            this.props.navigation.navigate('UpcomingHires');
                        }}>
                            <Text style={styles.buttonText}>UPCOMING HIRES  </Text>
                            <Badge style={styles.badge} value={upcomingHiresCount} status="primary" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            this.props.navigation.navigate('PastHires');
                        }}>
                            <Text style={styles.buttonText}>PAST HIRES</Text>
                        </TouchableOpacity>
                    </View> 
                </Card>
                
                {!ongoingHire.length ?
                    <Card style={styles.cardContainer}>
                        <View style={styles.subContainer}>
                            <View>
                                <Text h3>Ongoing Hire for {moment().format('MMM Do YYYY')}</Text>
                            </View>
                            <View>
                                <Text h5>There is no hire assigned for today!</Text>
                            </View>
                        </View> 
                        <View style={styles.detailButton}>
                            {/* <Button
                            large
                            backgroundColor={'#999999'}
                            color={'#FFFFFF'}
                            title='Party Hard'
                            buttonStyle={{backgroundColor: 'green'}}
                            onPress={()=> {}}
                            /> */}
                        </View>
                    </Card>
                : 
                    <Card style={styles.cardContainer}>
                        <View style={styles.subContainer}>
                            <View>
                                <Text h2>Ongoing Hire</Text>
                            </View>
                            <View>
                                <Text h5>{ongoingHire[0].hireType.toUpperCase()}</Text>
                            </View>
                            <View>
                                <Text h5>Customer: {ongoingHire[0].customerName}</Text>
                            </View>
                            <View>
                                <Text h5>Pickup Location: {ongoingHire[0].pickupLocation}</Text>
                            </View>
                            <View>
                                <Text h5>Date and TIme: {ongoingHire[0].pickupDatetime}</Text>
                            </View>
                        </View> 
                        <View style={styles.detailButton}>
                            <Button
                            large
                            backgroundColor={'#999999'}
                            color={'#FFFFFF'}
                            title='Manage Hire'
                            buttonStyle={{backgroundColor: 'green'}}
                            onPress={() => {
                                this.props.navigation.navigate('ManageOngoingHire',{
                                    hireId: ongoingHire[0].key,
                                    customerId: ongoingHire[0].customerId
                                }
                                );
                            }}
                            />
                        </View>
                    </Card>
                }    
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({

    cardContainer: {
        flex: 1,
        padding: 20
    },
    subContainer: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#CCCCCC',
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 7,
        marginBottom: 7,
        paddingVertical: 3,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
        width: '100%',
        height: 50,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
        paddingVertical: 8,
    },
    signoutButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    signout: {
        marginTop: 10,
        marginRight: 2,
        alignSelf: 'flex-end',
        marginBottom: 5,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        borderWidth: 1,
        borderRadius: 5,
        width: 60,
    },
    detailButton: {
        marginTop: 10
    }
})

const mapStateToProps = state => {
    return{
        user: state.user
    }
}

export default connect(mapStateToProps)(Dashboard)