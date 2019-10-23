import React from 'react'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Login from '../screens/Login'
import Profile from '../screens/Profile'
import Dashboard from '../screens/Dashboard'
import PastHires from '../screens/PastHires'
import PastHireDetails from '../screens/PastHireDetails'
import AssignedHires from '../screens/AssignedHires'
import AssignedHireDetails from '../screens/AssignedHireDetails'
import UpcomingHires from '../screens/UpcomingHires'
import UpcomingHireDetails from '../screens/UpcomingHireDetails'
import ManageOngoingHire from '../screens/ManageOngoingHire'

const SwitchNavigator = createStackNavigator(
    {   
        Login: {
            screen: Login
        },
        Profile: {
            screen: Profile
        },
        Dashboard: {
            screen: Dashboard
        },
        PastHires: {
            screen: PastHires
        },
        PastHireDetails: {
            screen: PastHireDetails,
        },
        AssignedHires: {
            screen: AssignedHires
        },
        AssignedHireDetails: {
            screen: AssignedHireDetails
        },
        UpcomingHires: {
            screen: UpcomingHires
        },
        UpcomingHireDetails: {
            screen: UpcomingHireDetails
        },
        ManageOngoingHire: {
            screen:ManageOngoingHire
        }
    },
    {
        initialRouteName: 'Login'
    }
)

export default createAppContainer(SwitchNavigator)