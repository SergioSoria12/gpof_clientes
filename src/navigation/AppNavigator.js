import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/Splash/SplashScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import FormularioCitaScreen from '../screens/Formulario_citas/FormularioCitasScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="FormularioCita" component={FormularioCitaScreen} />

        </Stack.Navigator>
        
    );
}

