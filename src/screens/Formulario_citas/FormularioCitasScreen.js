import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

export default function FormularioCitaScreen({ route, navigation }) {
  const { setProximasCitas,  citaOriginal, indiceModificar } = route.params;
  const clinicas = [
    { idclinica: 'Denia', nombre: 'Clínica Denia - Carrer de la Vía, 34d - Bajo' },
    { idclinica: 'Moraira', nombre: 'Clínica Moraira - Plaza del Palangre, 3' }
  ];

  // Funcion para formatear fecha completa
  const formatearFechaCompleta = (fechaStr, horaStr) => {
    if (!fechaStr || !horaStr) return "Fecha u hora inválida";
  
    const [year, month, day] = fechaStr.split("-");
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year} a las ${horaStr}`;
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

   //Función para marcar los campos como error al insertar mal el texto
   const [errores, setErrores] = useState({
    dni: false,
    telefono: false,
    email: false,
   });
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarDesde, setMostrarDesde] = useState(false);
  const [mostrarHasta, setMostrarHasta] = useState(false);
  const [disponibles, setDisponibles] = useState([]);
   //Funcion para el modal de mostrar las citas disponibles
   const [modalVisible, setModalVisible] = useState(false);


 

   //Funciones de validación en los campos del formulario
   const validarDNI = (dni) => /^[0-9]{8}[A-Za-z]$/.test(dni);
   const validarTelefono = (telefono) => /^[0-9]{9,}$/.test(telefono);
   const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   const formatFecha = (date) => {
    return date.toISOString().split("T")[0]; // "2025-04-24"
  };

  const simularCitas = async () => {  
    const citasRecibidas = await obtenerCitasDisponiblesDesdeBackend();

    if (citasRecibidas.length === 0) {
      Alert.alert("Sin disponibilidad", "No hay citas disponibles, seleccione otro día/hora");
      setDisponibles([]);
      setModalVisible(false);
    } else {
      setDisponibles(citasRecibidas);
      setModalVisible(true);
    }
  };

  const confirmarCita = async (cita) => {
    const doctorSeleccionado = doctoresAPI.find(d => d.idempleado === paciente.doctor);
    const aseguradoraSeleccionada = aseguradorasAPI.find(a => a.idaseguradora === paciente.aseguradora);
    const clinicaSeleccionada = clinicas.find(c => c.idclinica === paciente.clinica);

    const nueva = {
      ...paciente,
      fecha: cita.fecha,
      hora: cita.hora,
      doctor: doctorSeleccionado ? doctorSeleccionado.nombre : paciente.doctor,
      aseguradora: aseguradoraSeleccionada ? aseguradoraSeleccionada.aseguradora : paciente.aseguradora,
      clinica: clinicaSeleccionada ? clinicaSeleccionada.nombre : paciente.clinica,
      // Aseguramos campos explícitos en caso de que paciente no los tenga
      dni: paciente.dni || '',
      nombre: paciente.nombre || '',
      apellidos: paciente.apellidos || '',
      telefono: paciente.telefono || '',
      email: paciente.email || ''
    };
    
    // 🚫 Desactivamos la llamada al backend (la dejaré comentada para cuando esté lista)
    //await enviarCitaAlBackend(nueva);

    setProximasCitas(prev => {
      const actualizadas = typeof indiceModificar === 'number'
        ? [...prev.slice(0, indiceModificar), nueva, ...prev.slice(indiceModificar + 1)]
        : [...prev, nueva];

        AsyncStorage.setItem('citas', JSON.stringify(actualizadas))// ✅ Guardamos localmente
          .then(() => {
            console.log("✅ Citas guardadas localmente:", actualizadas);
          })
          .catch(err => {
            console.error("❌ Error guardando citas:", err);
          });       
    
      return actualizadas;
    });

    navigation.goBack();
  };

 
  //Función para validar que todo el formulario esta ok y activa el botón de ver las citas
  const formularioValido = () => {
    return (
      validarDNI(paciente.dni) &&
      validarTelefono(paciente.telefono) &&
      validarEmail(paciente.email) &&
      paciente.tipo &&
      paciente.clinica &&
      paciente.doctor &&
      paciente.aseguradora &&
      paciente.fecha &&
      paciente.desde &&
      paciente.hasta
    );
  };

  
  // 👇 ESTADOS PARA DATOS DE LA API
  const [doctoresAPI, setDoctoresAPI] = useState([]);
  const [aseguradorasAPI, setAseguradorasAPI] = useState([]);

  // 👇 LLAMADA A LA API AL ABRIR FORMULARIO
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const doctores = await fetchDoctores();
        const aseguradoras = await fetchAseguradoras();

        setDoctoresAPI(doctores);
        setAseguradorasAPI(aseguradoras);

         // Si estamos editando una cita, convertimos los textos a IDs
        if (citaOriginal) {
          const doctor = doctores.find(d => d.nombre === citaOriginal.doctor);
          const aseguradora = aseguradoras.find(a => a.aseguradora === citaOriginal.aseguradora);
          const clinica = clinicas.find(c => c.nombre === citaOriginal.clinica);

          setPaciente(prev => ({
            ...prev,
            doctor: doctor ? doctor.idempleado : '',
            aseguradora: aseguradora ? aseguradora.idaseguradora : '',
            clinica: clinica ? clinica.idclinica : '',
          }));
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };
    obtenerDatos();
  }, []);

  // 🧪 FUNCIONES PARA PEDIR DATOS A LA API (DOCTORES)
  const fetchDoctores = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      const formData = new FormData();
      formData.append('token', token);
  
      const response = await fetch('https://siminfo.es/augen/AppPacientes/get_doctores.php', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Doctores recibidos:", data);
      return data.doctores;
    } catch (error) {
      console.error("❌ Error al obtener doctores:", error.message);
      return [];
    }
  };
   // 🧪 FUNCIONES PARA PEDIR DATOS A LA API (ASEGURADORAS)
  const fetchAseguradoras = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      const formData = new FormData();
      formData.append('token', token);
  
      const response = await fetch('https://siminfo.es/augen/AppPacientes/get_aseguradoras.php', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Aseguradoras recibidas:", data);
      return data.aseguradoras;
    } catch (error) {
      console.error("❌ Error al obtener aseguradoras:", error.message);
      return [];
    }
  };

  //Funcion para hacer la llamada al backend para recibir las citas disponibles
  const obtenerCitasDisponiblesDesdeBackend = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      const formData = new FormData();
      formData.append('token', token);
      formData.append('idclinica', paciente.clinica);
      formData.append('idaseguradora', paciente.aseguradora);
      formData.append('idempleado', paciente.doctor);
      formData.append('fecha', formatFecha(paciente.fecha)); // YYYY-MM-DD
      formData.append('desde', paciente.desde); // ej: "10:00"
      formData.append('hasta', paciente.hasta); // ej: "16:00"

      console.log("📦 Datos enviados al backend:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
        
      const response = await fetch('https://siminfo.es/augen/AppPacientes/get_citas.php', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      console.log(response);
      const data = await response.json();
      console.log("✅ Citas recibidas del backend:", data);
  
    // 🔁 Extraer fecha y hora por separado + añadir tipo desde el formulario
    const citasFormateadas = (data.citas || []).map(cita => {
      const [fecha, horaCompleta] = cita.fecha.split(" ");
      const hora = horaCompleta?.slice(0, 5); // "10:00"

      return {
        ...cita,
        fecha,
        hora,
        tipo: paciente.tipo // Le añadimos el tipo desde lo que seleccionó el paciente
      };
    });

    return citasFormateadas;
  
    } catch (error) {
      console.error("❌ Error al obtener citas disponibles:", error.message);
      return [];
    }
  };
  //FUNCION PARA ENVIAR LAS CITAS GUARDADAS A LA API
  const enviarCitaAlBackend = async (cita) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const idpaciente = await AsyncStorage.getItem('idpaciente');
  
      if (!token || !idpaciente) {
        throw new Error("Falta token o idpaciente");
      }
  
      const formData = new FormData();
      formData.append('token', token);
      formData.append('idpaciente', idpaciente);
      formData.append('dni', cita.dni);
      formData.append('telefono', cita.telefono);
      formData.append('nombre', cita.nombre);
      formData.append('apellidos', cita.apellidos);
      formData.append('email', cita.email);
      formData.append('tipo', cita.tipo);
      formData.append('clinica', cita.clinica);
      formData.append('doctor', cita.doctor);
      formData.append('aseguradora', cita.aseguradora);
      formData.append('fecha', cita.fecha);
      formData.append('hora', cita.hora);
  
      const response = await fetch('https://siminfo.es/augen/AppPacientes/guardar_cita.php', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      console.log("✅ Cita guardada en el backend:", data);
  
      return data;
    } catch (error) {
      console.error("❌ Error al guardar cita:", error.message);
    }
  };

 


  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.titulo}>Pedir cita</Text>

      {['dni', 'telefono', 'nombre', 'apellidos', 'email'].map(campo => (
        <View key={campo} style={{ marginBottom: 10 }}>
          <TextInput
            key={campo}
            placeholder={campo.toUpperCase()}
            style={[
              styles.input,
              errores[campo] && styles.inputError
            ]}
            value={paciente[campo]}
            onChangeText={(text) => {
              setPaciente({ ...paciente, [campo]: text });

              //Validamos en tiempo real
              if(campo === 'dni') {
                setErrores((prev) => ({ ...prev, dni: !validarDNI(text) }));
              }else if (campo === 'telefono') {
                setErrores((prev) => ({ ...prev, telefono: !validarTelefono(text) }));
              }else if (campo === 'email') {
                setErrores((prev) => ({ ...prev, email: !validarEmail(text) }));
              }
            }}
          />

          {/*Mensaje de error debajo de los campos*/}
          {errores[campo] && (
            <Text style={styles.errorTexto}>
            {campo === 'dni' && 'DNI inválido'}
            {campo === 'telefono' && 'Teléfono inválido'}
            {campo === 'email' && 'Email inválido'}
            </Text>
          )}
        </View>
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
        <Picker.Item label="👨‍💻 Videollamada" value="videollamada" />
      </Picker>

      <Text style={styles.label}>Clínica</Text>
      <Picker
        selectedValue={paciente.clinica}
        onValueChange={(value) => setPaciente({ ...paciente, clinica: value })}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona clínica" value="" />
        {clinicas.map((clinica) => (
          <Picker.Item
            key={clinica.idclinica}
            label={clinica.nombre}
            value={clinica.idclinica}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Doctor</Text>
      <Picker
        selectedValue={paciente.doctor}
        onValueChange={(value) => setPaciente({ ...paciente, doctor: value })}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona doctor" value="" />
        {doctoresAPI.map((doctor) => (
          <Picker.Item
            key={doctor.idempleado}
            label={doctor.nombre}
            value={doctor.idempleado}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Aseguradora</Text>
      <Picker
        selectedValue={paciente.aseguradora}
        onValueChange={(value) => setPaciente({ ...paciente, aseguradora: value })}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona aseguradora" value="" />
        {aseguradorasAPI
          .filter(item => item.aseguradora !== null)
          .map((aseg) => (
            <Picker.Item
              key={aseg.idaseguradora}
              label={aseg.aseguradora}
              value={aseg.idaseguradora}
            />
        ))}
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

      <TouchableOpacity 
        style={[
          styles.botonCita,
        !formularioValido() && {backgroundColor: '#ccc'}
        ]}
         disabled={!formularioValido()}
         onPress={simularCitas}>
        <Text style={styles.botonTexto}>Buscar citas disponibles</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalVentana}>
            <Text style={styles.modalTitulo}>Citas disponibles</Text>

            <ScrollView style={{ maxHeight: 300 }}>
              {disponibles.map((cita, index) => (
                <View key={index} style={styles.modalCitaCard}>
                  <Text style={styles.citaTexto}>
                    {formatearFechaCompleta(cita.fecha, cita.hora)} - {cita.tipo}
                  </Text>
                  <TouchableOpacity
                    onPress={() => confirmarCita(cita)}
                    style={styles.botonAñadir}
                  >
                    <Text style={styles.botonTexto}>Pedir</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.botonCerrar}
            >
              <Text style={styles.botonCerrarTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
    
  );
}
