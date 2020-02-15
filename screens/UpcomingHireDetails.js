import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import { List, ListItem, Text, Card, Button } from 'react-native-elements';
import Firebase from '../config/Firebase';
import moment from 'moment'

class UpcomingHireDetails extends Component {
  static navigationOptions = {
    title: 'Hire Details',
  };
  
  constructor() {
    super();
    this.state = {
      isLoading: true,
      hire: {},
      key: ''
    };
    
  }
  
  componentDidMount() {
    const { navigation } = this.props;
    const ref = Firebase.firestore().collection('hires').doc(navigation.getParam('hireId'));
    const refCustomer = Firebase.firestore().collection('customers').doc(navigation.getParam('customerId'));
    ref.get().then((doc) => {
      if (doc.exists) {
        this.setState({
          hire: doc.data(),
          key: doc.id,
        //   isLoading: false
        });
      } else {
        console.log("No such document!");
      }
    });
    refCustomer.get().then((docCustomer) => {
        if (docCustomer.exists) {
          this.setState({
            customer: docCustomer.data(),
            customerKey: docCustomer.id,
            isLoading: false
          });
        } else {
          console.log("No such document!");
        }
      });

  }

  rejectHire(key) {
    this.setState({
      isLoading: true,
    });
    const { navigation } = this.props; 
    const updateRef = Firebase.firestore().collection('hires').doc(key);
    updateRef.update({
      hireStatus: 'request',
    }).then(() => {
      const notifRef = Firebase.firestore().collection('notifications')
      let data = {
        to: 'Yk1pyMHhAQhk3PhGS6JRxcNSHdT2',
        from: navigation.getParam('userId'),
        data: 'Driver Rejected Hire Request',
        link: '/admin/hires/' + key,
        type: 'driver rejected',
        createdAt: new Date()
      }
      notifRef.add(data).then(() => {
        this.props.navigation.navigate('UpcomingHires');
      })
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
      this.setState({
        isLoading: false,
      });
    });
  }
  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    return (
      <ScrollView>
        {this.state.hire.hireType === 'import' ? 
          <Card style={styles.container}>
            <View style={styles.subContainer}>
              <View>
                <Text h3>{this.state.hire.hireType.toUpperCase()}{"\n"}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Date: {moment(this.state.hire.pickupDatetime).format('MMM Do YYYY, h:mm:ss a')}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Customer: {this.state.hire.customerName}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Vehicle: {this.state.hire.vehicleNo}</Text>
              </View>
            </View>
            <View style={styles.subContainer}>
              <View alignItems="center">
                <Text h3>Container Details{"\n"}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Container Type: {this.state.hire.containerType}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Pickup Date: {moment(this.state.hire.pickupDatetime).format('MMM Do YYYY, h:mm a')}</Text>
              </View>
              <View>
                <Text h4>{"\n"}Container Location</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>AddressLine 1: {this.state.hire.containerPickupAddressLine1} </Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>AddressLine 2: {this.state.hire.containerPickupAddressLine2} </Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>City: {this.state.hire.containerPickupCity} </Text>
              </View>
            </View>
            <View style={styles.subContainer}>
              <View alignItems="center">
                <Text h3>Cargo Details{"\n"}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Cargo Type(s): {this.state.hire.cargoType}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Cargo Weight: {this.state.hire.netWeight}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Vessel Arrival Date: {moment(this.state.hire.vesselArrivalDatetime).format('MMM Do YYYY, h:mm a')}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Unloading Port: {this.state.hire.unloadingPort}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Unloading Terminal: {this.state.hire.unloadingTerminal}</Text>
              </View>
            </View>
            <View style={styles.subContainer}>
              <View alignItems="center">
                <Text h3>Destination Address{"\n"}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>AddressLine 1: {this.state.hire.destinationAddressLine1}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>AddressLine 2: {this.state.hire.destinationAddressLine2}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>City: {this.state.hire.destinationCity}</Text>
              </View>
            </View>
            <View style={styles.subContainer}>
              <View alignItems="center">
                <Text h3>Customer Details{"\n"}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Customer Name: {this.state.customer.firstName + " " + this.state.customer.lastName}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Mobile: {this.state.customer.mobile}</Text>
              </View>
            </View>
            <View style={styles.subContainer}>
              <View alignItems="center"> 
                <Text h3>Remarks{"\n"}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>{this.state.hire.remarks}</Text>
              </View>
            </View>
            <View style={styles.detailButton}>
                <Button
                large
                backgroundColor={'#999999'}
                color={'#FFFFFF'}
                leftIcon={{name: 'delete'}}
                title='Reject Hire'
                buttonStyle={{backgroundColor: 'red'}}
                onPress={() => this.rejectHire(this.state.key)} />
            </View>
          </Card>
        :
        <Card style={styles.container}>
          <View style={styles.subContainer}>
              <View>
                <Text h3>{this.state.hire.hireType.toUpperCase()}{"\n"}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Date: {moment(this.state.hire.pickupDatetime).format('MMM Do YYYY, h:mm a')}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Customer: {this.state.hire.customerName}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Vehicle: {this.state.hire.vehicleNo}</Text>
              </View>
            </View>
            <View style={styles.subContainer}>
              <View alignItems="center">
                <Text h3>Container Details{"\n"}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Container Type: {this.state.hire.containerType}</Text>
              </View>
              <View>
                <Text h4>{"\n"}Container Location</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>AddressLine 1: {this.state.hire.containerPickupAddressLine1}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>AddressLine 2: {this.state.hire.containerPickupAddressLine2}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>City: {this.state.hire.containerPickupCity}</Text>
              </View>
            </View>
            <View style={styles.subContainer}>
              <View alignItems="center">
                <Text h3>Cargo Details{"\n"}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Cargo Type(s): {this.state.hire.cargoType}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Cargo Weight: {this.state.hire.netWeight}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Cargo Pickup Date: {moment(this.state.hire.pickupDatetime).format('MMM Do YYYY, h:mm a')}</Text>
              </View>
              <View>
                <Text h4>{"\n"}Cargo Pickup Location</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>AddressLine 1: {this.state.hire.cargoLocationAddressLine1}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>AddressLine 2: {this.state.hire.cargoLocationAddressLine2}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>City: {this.state.hire.cargoLocationCity}</Text>
              </View>
            </View>
            <View style={styles.subContainer}>
              <View alignItems="center">
                <Text h3>Loading Details{"\n"}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Loading Port: {this.state.hire.loadingPort} </Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Loading Terminal: {this.state.hire.loadingTerminal} </Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Vessel: {this.state.hire.vessel} </Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Loading Date: {moment(this.state.hire.loadingDatetime).format('MMM Do YYYY, h:mm a')} </Text>
              </View>
            </View>
            <View style={styles.subContainer}>
              <View alignItems="center">
                <Text h3>Customer Details{"\n"}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Customer Name: {this.state.customer.firstName + " " + this.state.customer.lastName}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>Mobile: {this.state.customer.mobile}</Text>
              </View>
            </View>
            <View style={styles.subContainer}>
              <View alignItems="center">
                <Text h3>Remarks{"\n"}</Text>
              </View>
              <View>
                <Text h5 style={{fontSize:20}}>{this.state.hire.remarks}</Text>
              </View>
            </View>
            <View style={styles.detailButton}>
                <Button
                large
                backgroundColor='red'
                color={'#FFFFFF'}
                leftIcon={{name: 'delete'}}
                title='Reject Hire'
                buttonStyle={{backgroundColor: 'red'}}
                onPress={() => this.rejectHire(this.state.key)} />
            </View>
        </Card>
        }
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    paddingTop: 20,
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
  detailButton: {
    marginTop: 10
  }
})

export default UpcomingHireDetails;