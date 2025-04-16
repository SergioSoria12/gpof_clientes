import React, {useEffect, useState} from "react";
import { View, Text, Image, TouchableOpacity, Linking, Alert} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CitasScreen from "../Citas/CitasScreen";
import FacturasScreen from "../Facturas/FacturasScreen";
import RecetasScreen from "../Recetas/RecetasScreen";
import JustificanteScreen from "../Justificante/JustificanteScreen";
import MasScreen from "../Mas/MasScreen";

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
    const navigation = useNavigation();
    const [nombre, setNombre] = React.useState("Usuario");
  
    React.useEffect(() => {
      const fetchNombre = async () => {
        const nombreGuardado = await AsyncStorage.getItem("nombre");
        if (nombreGuardado) setNombre(nombreGuardado);
      };
      fetchNombre();
    }, []);
  
    const handleLlamarClinica = () => {
      Linking.openURL("tel:+34961111222");
    };
  
    const handleLogout = () => {
      Alert.alert("Cerrar sesión", "¿Estás seguro de que quieres cerrar sesión?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.multiRemove(['token', 'idpaciente', 'nombre']);//Borramos solo seseión
            
            // ✅ Log para comprobar si las citas siguen guardadas
            const citasGuardadas = await AsyncStorage.getItem('citas');
            if (citasGuardadas) {
              console.log("📌 Citas guardadas localmente tras logout:", JSON.parse(citasGuardadas));
            } else {
              console.log("⚠️ No hay citas guardadas localmente tras logout");
            }

            navigation.replace("Login");
          },
        },
      ]);
    };
  
    const Header = () => (
      <View style={styles.header}>
        <Image
          source={require("../../../assets/images/clinicas/logo_clinica.png")}
          style={styles.logo}
        />
  
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleLlamarClinica} style={styles.iconButton}>
            <Ionicons name="call-outline" size={24} color="#25476a" />
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#25476a" />
          </TouchableOpacity>
  
          <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
            <Ionicons name="log-out-outline" size={24} color="#25476a" paddingRight= "10"/>
          </TouchableOpacity>
        </View>
      </View>
    );
  
    const Bienvenida = () => (
      <View style={styles.saludo}>
        <Text style={styles.saludoTexto}>Bienvenido {nombre}</Text>
        <Text style={styles.ayudaTexto}>¿En qué podemos ayudarte?</Text>
      </View>
    );
  
    return (
      <View style={{ flex: 1 }}>
        <Header />
        <Bienvenida />
  
        {/* NAVBAR y contenido central */}
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarActiveTintColor: "#25476a",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: { paddingBottom: 5, height: 60 },
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              let iconName;
              switch (route.name) {
                case "Citas":
                  iconName = "calendar-outline";
                  break;
                case "Facturas":
                  iconName = "card-outline";
                  break;
                case "Recetas":
                  iconName = "medkit-outline";
                  break;
                case "Justificante":
                  iconName = "document-text-outline";
                  break;
                case "Más":
                  iconName = "ellipsis-horizontal-outline";
                  break;
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Citas" component={CitasScreen} />
          <Tab.Screen name="Facturas" component={FacturasScreen} />
          <Tab.Screen name="Recetas" component={RecetasScreen} />
          <Tab.Screen name="Justificante" component={JustificanteScreen} />
          <Tab.Screen name="Más" component={MasScreen} />
        </Tab.Navigator>
      </View>
    );
  }