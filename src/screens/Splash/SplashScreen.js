import React, {useEffect} from "react";
import { View, Text, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import styles from "./styles"; // Adjust the path as necessary

export default function SplashScreen({navigation}) {
    Animatable.initializeRegistryWithDefinitions({
        flipHorizontal: {
          0: { rotateY: '0deg' },
          0.5: { rotateY: '180deg' },
          1: { rotateY: '360deg' },
        },
      });
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("Login")
        }, 6000); // 3 seconds delay before navigating to Login screen

        return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }, []);

    return (
        <View style={styles.container}>
           <Animatable.Image
                animation="flipHorizontal"
                iterationCount="infinite"
                duration={6000}
                easing="linear"
                source={require("../../../assets/images/clinicas/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />
            <Animatable.Text animation="fadeIn" delay={1500} style={styles.loadingText}>
                Cargando...
            </Animatable.Text>    
        </View>
    );
}