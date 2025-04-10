import React, {useEffect} from "react";
import { View, Text, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import styles from "./styles"; // Adjust the path as necessary

export default function SplashScreen({navigation}) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("Login")
        }, 3000); // 3 seconds delay before navigating to Login screen

        return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }, []);

    return (
        <View style={styles.container}>
            <Animatable.Image
                animation="fadeIn"
                duration={2000}
                source={require("../../../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />
            <Animatable.Text animation="fadeIn" delay={1000} style={styles.loadingText}>
                Cargando...
            </Animatable.Text>    
        </View>
    );
}