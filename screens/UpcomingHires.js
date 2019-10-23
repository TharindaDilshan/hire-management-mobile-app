import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native";
import Firebase from '../config/Firebase'
import {  ListItem, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux'
import moment from 'moment'

class UpcomingHires extends Component {
  
  constructor() {
    super();
    this.ref = Firebase.firestore().collection('hires');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      boards: []
    };
  }

  static navigationOptions = {
    title: 'Upcoming Hires',
  };

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }
  onCollectionUpdate = (querySnapshot) => {
    const boards = [];
    querySnapshot.forEach((doc) => {
      const { driverId, hireStatus,hireType, pickupDatetime, pickupLocation, customerId } = doc.data()
      boards.push({
        key: doc.id,
        driverId,
        hireStatus,
        hireType,
        pickupLocation,
        customerId,
        pickupDatetime: moment(pickupDatetime).format('MMM Do YYYY, h:mm:ss a'),
        pickupDate : pickupDatetime
      });
    });
    this.setState({
      boards,
      isLoading: false,
   });
  }
  render() {
    if(!this.state.boards.filter(item => item.driverId === this.props.user.id && item.hireStatus === 'ongoing' && moment(item.pickupDate).format('MMMM Do YYYY') > moment().format('MMMM Do YYYY') ).length){
        return(
            <View style={styles.activity}>
                <Text h3>No Upcoming Hires</Text>
            </View>
        )
    }   
    return (
      <ScrollView style={styles.container}>
          {
            this.state.boards.filter(item => item.driverId === this.props.user.id && item.hireStatus === 'ongoing' && moment(item.pickupDate).format('MMMM Do YYYY') > moment().format('MMMM Do YYYY')  ).map((item, i) => (
              <ListItem
                style={styles.listItem}
                key={i}
                title={item.pickupDatetime + '  ' + item.hireType.toUpperCase() + '  ' + item.pickupLocation.toUpperCase()}
                leftIcon={{name: 'book', type: 'font-awesome'}}
                onPress={() => {
                  this.props.navigation.navigate('UpcomingHireDetails', {
                    hireId: item.key,
                    customerId: item.customerId
                  });
                }}
              />
            ))
          }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingBottom: 22,
   paddingTop: 30
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
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
  heading: {
    textAlign: 'center',
    fontSize: 22
  },
})

const mapStateToProps = state => {
  return{
      user: state.user
  }
}

export default connect(mapStateToProps)(UpcomingHires)
