import React, { useState} from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "../Login/styles";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
    
    // Aquí puedes agregar la lógica de autenticación
    Alert.alert("Éxito", "Inicio de sesión exitoso");
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        placeholderTextColor= "#999"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor= "#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}