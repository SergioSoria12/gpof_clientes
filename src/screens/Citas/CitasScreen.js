import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function CitasScreen() {
  const navigation = useNavigation();
  const [proximasCitas, setProximasCitas] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [indiceCitaSeleccionada, setIndiceCitaSeleccionada] = useState(null);

  const formatearFechaCompleta = (fechaStr, horaStr) => {
    const [year, month, day] = fechaStr.split('-');
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year} a las ${horaStr}`;
  };

  //Funcion para cargar las citas guardadas al abrir la pantalla citas
  useEffect(() => {
    const cargarCitas = async () => {
      try {
        const guardadas = await AsyncStorage.getItem('citas');
        if (guardadas) {
          console.log("📂 Citas cargadas localmente al hacer login:", JSON.parse(guardadas));
          setProximasCitas(JSON.parse(guardadas));
        } else {
          console.log("📂 No hay citas guardadas localmente");
        }
      } catch (err) {
        console.error("❌ Error al cargar citas:", err);
      }
    };
    cargarCitas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Próximas citas</Text>

      {proximasCitas.length === 0 ? (
        <View style={styles.sinCitas}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.sinCitasTexto}>No tienes citas próximas</Text>
        </View>
      ) : (
        <FlatList
          data={proximasCitas}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
            <Text style={styles.fecha}>{formatearFechaCompleta(item.fecha, item.hora)}</Text>
        
            <Text style={styles.nombrePaciente}>{item.nombre} {item.apellidos}</Text>
        
            <View style={styles.iconoTipo}>
              <Ionicons
                name={
                  item.tipo === 'presencial'
                    ? 'walk-outline'
                    : item.tipo === 'telefonica'
                    ? 'call-outline'
                    : 'videocam-outline'
                }
                size={18}
                color="#25476a"
              />
              <Text style={styles.tipoTexto}>
                {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
              </Text>
            </View>
        
            <View style={styles.infoFila}>
              <Ionicons name="person-outline" size={18} color="#555" />
              <Text style={styles.infoTexto}>{item.doctor}</Text>
            </View>

            <View style={styles.infoFila}>
              <Ionicons name="home-outline" size={18} color="#555" />
              <Text style={styles.infoTexto}>{item.clinica}</Text>
            </View>

            <View style={styles.infoFila}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#555" />
              <Text style={styles.infoTexto}>{item.aseguradora}</Text>
            </View>
        
            <TouchableOpacity
              style={styles.botonOpciones}
              onPress={() => {
                setCitaSeleccionada(item);
                setIndiceCitaSeleccionada(index);
                setMenuVisible(true);
              }}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#555" />
            </TouchableOpacity>
          </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.botonCita}
        onPress={() => navigation.navigate('FormularioCita', { setProximasCitas })}
      >
        <Text style={styles.botonTexto}>Pedir cita</Text>
      </TouchableOpacity>
        <Modal
            transparent
            visible={menuVisible}
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}
        >
            <TouchableOpacity
                style={styles.menuOverlay}
                onPress={() => setMenuVisible(false)}
                activeOpacity={1}
            >
                <View style={styles.menu}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                        setMenuVisible(false);
                        navigation.navigate('FormularioCita', {
                            setProximasCitas,
                            citaOriginal: citaSeleccionada,
                            indiceModificar: indiceCitaSeleccionada,
                            proximasCitas,
                        });
                    }}
                    >
                        <Ionicons name="create-outline" size={18} />
                        <Text style={styles.menuItemText}>Modificar cita</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                        Alert.alert(
                            'Cancelar cita',
                            '¿Estás seguro de que quieres cancelarla?',
                            [
                                { text: 'No', style: 'cancel' },
                                {
                                    text: 'Sí',
                                    onPress: async () => {
                                      try {
                                        const nuevas = [...proximasCitas];
                                        nuevas.splice(indiceCitaSeleccionada, 1);

                                        // 👉 Guardamos en local
                                        setProximasCitas(nuevas);
                                        await AsyncStorage.setItem('citas', JSON.stringify(nuevas)); // 👈 ACTUALIZA LOCAL
                                        console.log("✅ Cita eliminada y actualizado en local");

                                        // ✅ (OPCIONAL) Enviar al backend cuando la API esté lista
                                        /*
                                        const token = await AsyncStorage.getItem('token');
                                        const idPaciente = await AsyncStorage.getItem('idpaciente');
                                        const cita = citaSeleccionada;

                                        const formData = new FormData();
                                        formData.append('token', token);
                                        formData.append('idpaciente', idPaciente);
                                        formData.append('idcalendario', cita.idcalendario); // o lo que use tu backend

                                        const response = await fetch('https://TU_API_ELIMINAR_CITA.php', {
                                          method: 'POST',
                                          body: formData,
                                        });

                                        const data = await response.json();
                                        if (data.status !== 'ok') {
                                          console.warn("⚠️ Error del backend al eliminar cita:", data);
                                        } else {
                                          console.log("✅ Cita eliminada también en el servidor");
                                        }
                                        */

                                        setMenuVisible(false);
                                      }catch(error) {
                                        console.error("❌ Error al eliminar cita:", error);
                                        Alert.alert("Error", "Hubo un problema al eliminar la cita.");
                                      }
                                    },
                                },
                            ]
                        );
                        }}
                    >
                        <Ionicons name="trash-outline" size={18} />
                        <Text style={styles.menuItemText}>Cancelar cita</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => setMenuVisible(false)}
                    >
                        <Ionicons name="close-outline" size={18} />
                        <Text style={styles.menuItemText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    </View>
  );
}