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
      const data = doc.data()
      boards.push({
        key: doc.id,
        data
      });
    });
    this.setState({
      boards,
      isLoading: false,
   });
  }
  render() {
    if(!this.state.boards.filter(item => item.data.driverId === this.props.user.id && item.data.hireStatus === 'ongoing' && moment(item.data.pickupDatetime).isAfter(new Date()) && !moment(item.data.pickupDatetime).isSame(new Date(),'day')).length){
        return(
            <View style={styles.activity}>
                <Text h3>No Upcoming Hires</Text>
            </View>
        )
    }   
    return (
      <ScrollView style={styles.container}>
          {
            this.state.boards.filter(item => item.data.driverId === this.props.user.id && item.data.hireStatus === 'ongoing' && moment(item.data.pickupDatetime).isAfter(new Date()) && !moment(item.data.pickupDatetime).isSame(new Date(),'day')).map((item, i) => (
              <ListItem
                style={styles.listItem}
                key={i}
                title={item.data.hireType === 'import' ?'Import Hire' + '  Destination: ' + item.data.destinationCity.toUpperCase() : 'Export Hire' + '  Destination: ' + item.data.containerPickupCity.toUpperCase()}
                subtitle={item.data.hireType === 'import' ? moment(item.data.pickupDatetime).format('MMM Do YYYY, h:mm a') : moment(item.data.pickupDatetime).format('MMM Do YYYY, h:mm a')}
                leftIcon={{name: 'truck', type: 'font-awesome'}}
                onPress={() => {
                  this.props.navigation.navigate('UpcomingHireDetails', {
                    hireId: item.key,
                    customerId: item.data.customerId,
                    userId: this.props.user.id
                  });
                }}
                bottomDivider
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
