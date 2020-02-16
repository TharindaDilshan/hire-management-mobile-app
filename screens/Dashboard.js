import React from 'react'
// import { View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { Text, Card, Button, Badge } from 'react-native-elements';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Alert,
    ScrollView,
    ActivityIndicator
  } from 'react-native';
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
        console.log(this.props.user)
    }
    onCollectionUpdate = (querySnapshot) => {
        const hires = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          hires.push({
            key: doc.id,
            data
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
        headerTitleStyle: {
            fontSize: 20,
            textAlign: "center",
            flex: 1
        }
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
        const ongoingHire = this.state.hires.filter(item => item.data.driverId === this.props.user.id && item.data.hireStatus === 'ongoing' && moment(item.data.pickupDatetime).isSame(new Date(),'day'))
        const assignedHiresCount = this.state.hires.filter(item => item.data.driverId === this.props.user.id && item.data.hireStatus === 'driverPending').length
        const upcomingHiresCount = this.state.hires.filter(item => item.data.driverId === this.props.user.id && item.data.hireStatus === 'ongoing' && moment(item.data.pickupDatetime).isAfter(moment(new Date())) && !moment(item.data.pickupDatetime).isSame(new Date(),'day')).length
        return (
            <ScrollView>
                <TouchableOpacity style={styles.card} onPress={() => {this.props.navigation.navigate('AssignedHires')}}>
                    <Image style={styles.image} source={require("../assets/appointment-reminders.png")}/> 
                    <View style={styles.cardContent}>
                        <Text style={styles.name}>New Hire Assignments</Text>
                        <TouchableOpacity style={styles.followButton} onPress={()=> {this.props.navigation.navigate('AssignedHires')}}>
                        <Text style={styles.followButtonText}>{assignedHiresCount}</Text>  
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} onPress={() => {this.props.navigation.navigate('UpcomingHires')}}>
                    <Image style={styles.image} source={require("../assets/event-accepted-tentatively.png")}/> 
                    <View style={styles.cardContent}>
                        <Text style={styles.name}>Upcoming Hires</Text>
                        <TouchableOpacity style={styles.followButton} onPress={()=> {this.props.navigation.navigate('UpcomingHires')}}>
                        <Text style={styles.followButtonText}>{upcomingHiresCount}</Text>  
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} onPress={() => {this.props.navigation.navigate('PastHires')}}>
                    <Image style={styles.image} source={require('../assets/time-machine--v1.png')}/> 
                    <View style={styles.cardContent}>
                        <Text style={styles.name}>Past Hires</Text>
                    </View>
                </TouchableOpacity>
                
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
                    </Card>
                : 
                    <Card style={styles.cardContainer}>
                        <View style={styles.subContainer}>
                            <View>
                                <Text h2>Ongoing Hire</Text>
                            </View>
                            <View>
                                <Text h5>{ongoingHire[0].data.hireType.toUpperCase()}</Text>
                            </View>
                            <View>
                                <Text h5>Customer: {ongoingHire[0].data.customerName}</Text>
                            </View>
                            <View>
                                <Text h5>Pickup Location: {ongoingHire[0].data.pickupLocation}</Text>
                            </View>
                            <View>
                                <Text h5>Date and TIme: {ongoingHire[0].data.pickupDatetime}</Text>
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
                                    customerId: ongoingHire[0].data.customerId,
                                    userId: this.props.user.id
                                }
                                );
                            }}
                            />
                        </View>
                    </Card>
                }
                <View style={{paddingTop: 15}}>
                    <TouchableOpacity style={styles.signoutButtonBottom} onPress={
                        this.handleSignout
                        }>
                        <Text style={styles.signoutButtonText}>Logout</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity style={styles.signoutButtonBottom} 
                        onPress={() => {
                            this.props.navigation.navigate('Profile',{
                            }
                            );
                        }}
                    >
                        <Text style={styles.signoutButtonText}>Profile</Text>
                    </TouchableOpacity>         
                </View> 
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
        color: 'white',
        textAlignVertical: 'center'
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
    signoutButtonBottom: {
        marginTop: 10,
        margin: 5,
        marginBottom: 5,
        paddingVertical: 12,
        paddingTop: 10,
        alignItems: 'center',
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        borderWidth: 1,
        borderRadius: 5,
    },
    detailButton: {
        marginTop: 10
    },
    // test
    contentList:{
        flex:1,
      },
      cardContent: {
        marginLeft:20,
        marginTop:10
      },
      image:{
        height: 50,
        width: 50,
        alignSelf:'center'
      },
    
      card:{
        shadowColor: '#00000021',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    
        marginLeft: 20,
        marginRight: 20,
        marginTop:20,
        backgroundColor:"white",
        padding: 10,
        flexDirection:'row',
        borderRadius:30,
      },
    
      name:{
        fontSize:28,
        flex:1,
        alignSelf:'center',
        color:"#3399ff",
        fontWeight:'bold'
      },
      count:{
        fontSize:20,
        flex:1,
        alignSelf:'center',
        color:"#6666ff"
      },
      followButton: {
        marginTop:10,
        height:35,
        width:100,
        padding:10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:30,
        backgroundColor: "white",
        borderWidth:1,
        borderColor:"#0ea1c9",
      },
      followButtonText:{
        color: "#0ea1c9",
        fontSize:20,
      },
})

const mapStateToProps = state => {
    return{
        user: state.user
    }
}

export default connect(mapStateToProps)(Dashboard)