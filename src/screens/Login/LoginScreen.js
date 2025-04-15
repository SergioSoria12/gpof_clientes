import React, { useState, useEffect} from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "./styles";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recordarCredenciales, setRecordarCredenciales] = useState(false); //Para recordar usuario logeado
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
  
    try {
      const response = await fetch('https://siminfo.es/augen/AppPacientes/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `usuario=${encodeURIComponent(username)}&contrasena=${encodeURIComponent(password)}`
      });
  
      const data = await response.json();
  
      if (data.status === 'ok') {

        //Si marcamos recordar usuario, nos guarda las credenciales
        if (recordarCredenciales) {
          await AsyncStorage.setItem('usuarioRecordado', username);
          await AsyncStorage.setItem('passwordRecordado', password);
        } else {
          await AsyncStorage.removeItem('usuarioRecordado');
          await AsyncStorage.removeItem('passwordRecordado');
        }

        // Guardamos token, id y nombre completo (en este ejemplo simulamos que llega el nombre en la respuesta)
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('idpaciente', data.idpaciente.toString());
        await AsyncStorage.setItem('nombre', data.nombre); // Si luego lo pasas desde el backend, usa data.nombre
  
        Alert.alert("Éxito", "Inicio de sesión exitoso");
        navigation.replace('Home');
      } else {
        Alert.alert("Error", data.mensaje || "Error de autenticación");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  //Funcion para que al abrir el login busquemos si habia usuario y contraseña guardado
  useEffect(() => {
    const cargarCredencialesGuardadas = async () => {
      const user = await AsyncStorage.getItem('usuarioRecordado');
      const pass = await AsyncStorage.getItem('passwordRecordado');
      
      if (user && pass) {
        setUsername(user);
        setPassword(pass);
        setRecordarCredenciales(true);
      }
    };
  
    cargarCredencialesGuardadas();
  }, []);
  
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
      <View style={styles.recordarContainer}>
        <TouchableOpacity onPress={() => setRecordarCredenciales(!recordarCredenciales)}>
          <Text style={styles.recordarTexto}>
            {recordarCredenciales ? '✅ ' : '⬜ '}Recordar usuario
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}