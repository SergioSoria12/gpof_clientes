import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import styles from './styles';

export default function FormularioCitaScreen({ route, navigation }) {
  const { setProximasCitas,  citaOriginal, indiceModificar, proximasCitas } = route.params;

  // Funcion para formatear fecha 
  const formatearFechaCompleta = (fechaStr, horaStr) => {
    const [year, month, day] = fechaStr.split('-');
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year} a las ${horaStr}`;
  };

  // Funcion para comprobar si la hora esta dentro del rango
  const horaDentroDeRango = (hora, desde, hasta) => {
    const [h, m] = hora.split(':').map(Number);
    const [hd, md] = desde.split(':').map(Number);
    const [hh, mh] = hasta.split(':').map(Number);
  
    const minutos = h * 60 + m;
    const minDesde = hd * 60 + md;
    const minHasta = hh * 60 + mh;
  
    return minutos >= minDesde && minutos <= minHasta;
  };
  
  const [paciente, setPaciente] = useState(
    citaOriginal
      ? { 
        ...citaOriginal,
        fecha: new Date(citaOriginal.fecha)
       }
      : {
          dni: '',
          telefono: '',
          nombre: '',
          apellidos: '',
          email: '',
          tipo: '',
          clinica: '',
          doctor: '',
          aseguradora: '',
          fecha: new Date(),
          desde: '',
          hasta: ''
        }
  );

  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarDesde, setMostrarDesde] = useState(false);
  const [mostrarHasta, setMostrarHasta] = useState(false);
  const [mostrarCitas, setMostrarCitas] = useState(false);
  const [disponibles, setDisponibles] = useState([]);

  const formatFecha = (date) => {
    return date.toISOString().split("T")[0]; // "2025-04-24"
  };

  const simularCitas = () => {
    const diaSeleccionado = formatFecha(paciente.fecha);

    //Citas simuladas en varios dias
    const simuladas = [
        { fecha: '2025-04-22', hora: '13:25', tipo: paciente.tipo },
        { fecha: '2025-04-23', hora: '14:15', tipo: paciente.tipo },
        { fecha: '2025-04-23', hora: '15:30', tipo: paciente.tipo },
        { fecha: '2025-04-24', hora: '10:00', tipo: paciente.tipo },
        { fecha: '2025-04-24', hora: '11:45', tipo: paciente.tipo },
    ];

    // Formato fecha seleccionada
    const citasFiltradas = simuladas.filter(cita =>
        cita.fecha === diaSeleccionado &&
        horaDentroDeRango(cita.hora, paciente.desde, paciente.hasta)
    );

    if (citasFiltradas.length === 0) {
        Alert.alert("Sin disponibilidad", "No hay citas disponibles, seleccione otro día/hora");
        setDisponibles([]);
        setMostrarCitas(false);
    } else {
        setDisponibles(citasFiltradas);
        setMostrarCitas(true);
    }
  };

  const confirmarCita = (cita) => {
    const nueva = {
      ...paciente,
      fecha: cita.fecha,
      hora: cita.hora,
      // Aseguramos campos explícitos en caso de que paciente no los tenga
      dni: paciente.dni || '',
      nombre: paciente.nombre || '',
      apellidos: paciente.apellidos || '',
      telefono: paciente.telefono || '',
      email: paciente.email || ''
    };
    setProximasCitas(prev => {
        if (typeof indiceModificar === 'number') {
          const copia = [...prev];
          copia[indiceModificar] = nueva;
          return copia;
        } else {
          return [...prev, nueva];
        }
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.titulo}>Pedir cita</Text>

      {['dni', 'telefono', 'nombre', 'apellidos', 'email'].map(campo => (
        <TextInput
          key={campo}
          placeholder={campo.toUpperCase()}
          style={styles.input}
          value={paciente[campo]}
          onChangeText={(text) => setPaciente({ ...paciente, [campo]: text })}
        />
      ))}

      <Text style={styles.label}>Tipo de cita</Text>
      <Picker
        selectedValue={paciente.tipo}
        onValueChange={(value) => setPaciente({ ...paciente, tipo: value })}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona tipo de cita" value="" />
        <Picker.Item label="👣 Presencial" value="presencial" />
        <Picker.Item label="📞 Telefónica" value="telefonica" />
        <Picker.Item label="🎥 Videollamada" value="videollamada" />
      </Picker>

      <Text style={styles.label}>Clínica</Text>
      <Picker
        selectedValue={paciente.clinica}
        onValueChange={(value) => setPaciente({ ...paciente, clinica: value })}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona clínica" value="" />
        <Picker.Item label="Augen Denia - Denia, C/Marquesado 23" value="Denia" />
        <Picker.Item label="Augen Alicante - Alicante, Av. Salamanca 10" value="Alicante" />
      </Picker>

      <Text style={styles.label}>Doctor</Text>
      <Picker
        selectedValue={paciente.doctor}
        onValueChange={(value) => setPaciente({ ...paciente, doctor: value })}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona doctor" value="" />
        <Picker.Item label="Dr. López" value="Dr. López" />
        <Picker.Item label="Dra. Martínez" value="Dra. Martínez" />
        <Picker.Item label="Dr. Ortega" value="Dr. Ortega" />
      </Picker>

      <Text style={styles.label}>Aseguradora</Text>
      <Picker
        selectedValue={paciente.aseguradora}
        onValueChange={(value) => setPaciente({ ...paciente, aseguradora: value })}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona aseguradora" value="" />
        <Picker.Item label="Sanitas" value="Sanitas" />
        <Picker.Item label="Adeslas" value="Adeslas" />
        <Picker.Item label="DKV" value="DKV" />
        <Picker.Item label="Mapfre" value="Mapfre" />
      </Picker>

      <Text style={styles.label}>Fecha</Text>
      <TouchableOpacity onPress={() => setMostrarCalendario(true)}>
        <Text style={styles.input}>{paciente.fecha.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {mostrarCalendario && (
        <DateTimePicker
          value={paciente.fecha}
          mode="date"
          display="default"
          onChange={(e, selected) => {
            setMostrarCalendario(false);
            if (selected) setPaciente({ ...paciente, fecha: selected });
          }}
        />
      )}

      {/* Time Pickers */}
      <Text style={styles.label}>Desde</Text>
      <TouchableOpacity onPress={() => setMostrarDesde(true)}>
        <Text style={styles.input}>{paciente.desde || 'Selecciona hora de inicio'}</Text>
      </TouchableOpacity>
      {mostrarDesde && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={(e, selected) => {
            setMostrarDesde(false);
            if (selected) {
              const hora = selected.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              setPaciente({ ...paciente, desde: hora });
            }
          }}
        />
      )}

      <Text style={styles.label}>Hasta</Text>
      <TouchableOpacity onPress={() => setMostrarHasta(true)}>
        <Text style={styles.input}>{paciente.hasta || 'Selecciona hora de fin'}</Text>
      </TouchableOpacity>
      {mostrarHasta && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={(e, selected) => {
            setMostrarHasta(false);
            if (selected) {
              const hora = selected.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              setPaciente({ ...paciente, hasta: hora });
            }
          }}
        />
      )}

      <TouchableOpacity style={styles.botonCita} onPress={simularCitas}>
        <Text style={styles.botonTexto}>Buscar citas disponibles</Text>
      </TouchableOpacity>

      {mostrarCitas && disponibles.map((cita, index) => (
        <View key={index} style={styles.citaItem}>
          <Text style={styles.citaTexto}>{formatearFechaCompleta(cita.fecha, cita.hora)} - {cita.tipo}</Text>
          <TouchableOpacity style={styles.botonAñadir} onPress={() => confirmarCita(cita)}>
            <Text style={styles.botonTexto}>Añadir</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
