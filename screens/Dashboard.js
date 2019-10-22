import React from 'react'
import { View, Button, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native'
import Firebase from '../config/Firebase'

class Dashboard extends React.Component {

    static navigationOptions = {
        title: 'Dashboard', 
        headerRight: (
            <Button>Test</Button>
        )
    };

    handleSignout = () => {
        Firebase.auth().signOut()
        this.props.navigation.navigate('Login')
    }

    render() {
        return (
            <View style={styles.container}> 
                <TouchableOpacity style={styles.signout} onPress={
                    this.handleSignout
                }>
                    <Text style={styles.signoutButtonText}>Logout</Text>
                </TouchableOpacity>
                <View style={styles.view}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        this.props.navigation.navigate('AssignedHires')
                    }}>
                        <Text style={styles.buttonText}>Assigned Hires</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        this.props.navigation.navigate('UpcomingHires');
                    }}>
                        <Text style={styles.buttonText}>Upcoming Hires</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        this.props.navigation.navigate('PastHires');
                    }}>
                        <Text style={styles.buttonText}>Past Hires</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 30,
        marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 1,
        borderRadius: 5,
        width: 200
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
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
        marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        borderWidth: 1,
        borderRadius: 5,
        width: 60,
    }
})

export default Dashboard