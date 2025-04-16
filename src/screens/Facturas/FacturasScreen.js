import React, {useEffect, useState} from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./styles";
import { Ionicons } from '@expo/vector-icons';


export default function FacturasScreen() {
    const [facturas, setFacturas] = useState([]);

    useEffect(() => {
        const obtenerFacturas = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) throw new Error('Token no disponible');
        
                const formData = new FormData();
                formData.append('token', token);
        
                const response = await fetch('https://siminfo.es/augen/AppPacientes/get_facturas.php', {
                  method: 'POST',
                  body: formData,
                });
        
                if (!response.ok) {
                  throw new Error(`Error del servidor: ${response.status}`);
                }
                
                const rawText = await response.text(); 

                const data = JSON.parse(rawText); // 👈 Luego intentas convertirlo

                console.log("✅ Facturas recibidas:", data);
          
                if (data.status === 'ok') {
                  setFacturas(data.facturas || []);
                } else {
                  console.warn("⚠️ No se encontraron facturas:", data.message);
                  setFacturas([]); // Limpia el estado si no hay facturas
                }
          
              } catch (error) {
                console.error("❌ Error al obtener facturas:", error);
                Alert.alert('Error', 'No se pudieron cargar las facturas');
            }
        };
        
        obtenerFacturas();
    }, []);

    const formatearFecha = (fechaStr) => {
        const [fecha] = fechaStr.split(' ');
        const [year, month, day] = fecha.split('-');
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
    };

    // Función para ver o compartir el PDF (Descomentar cuando este la API lista)
    /*const verODescargarFactura = async (idfactura, accion = 'ver') => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Token no disponible');

            const formData = new FormData();
            formData.append('token', token);
            formData.append('idfactura', idfactura);

            console.log('📤 Enviando solicitud para factura ID:', idfactura);

            const response = await fetch('https://siminfo.es/augen/AppPacientes/get_pdf_factura.php', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`❌ Error del servidor: ${response.status}`);
            }

            const blob = await response.blob();
            console.log('✅ Blob recibido de la API:', blob);

            // Crear un archivo local
            const fileUri = FileSystem.documentDirectory + `factura-${idfactura}.pdf`;
            await FileSystem.writeAsStringAsync(
            fileUri,
            await blob.text(),
            { encoding: FileSystem.EncodingType.UTF8 }
        );

        console.log('📁 Archivo guardado en:', fileUri);

        if (accion === 'ver' || accion === 'descargar') {
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(fileUri);
                console.log(`🔍 ${accion === 'ver' ? 'Vista previa' : 'Compartido'} de la factura`);
            } else {
                Alert.alert('No disponible', 'No se puede compartir/ver este archivo en este dispositivo');
            }
        }
        } catch (error) {
        console.error("❌ Error al obtener/ver/guardar factura:", error.message);
        Alert.alert('Error', 'No se pudo procesar la factura');
        }
    };*/

    //Vista de la factura
    const renderFactura = ({ item }) => (
        <View style={styles.cardFactura}>
         <View style={[styles.facturaFila, { justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Ionicons name="receipt-outline" size={18} color="#25476a" />
                <Text style={styles.facturaLabel}>Factura Nº: </Text>
                <Text style={styles.facturaValor}>{item.idfactura}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
                {/*onPress={() => verODescargarFactura(item.idfactura, 'ver')} SUSTITUIR CUANDO ESTE LA API LISTA*/}
                <TouchableOpacity onPress={() => Alert.alert('Ver factura', `Visualizar factura ${item.idfactura}`)}>
                <Ionicons name="reader-outline" size={22} color="#25476a" style={styles.iconoAccion} />
                </TouchableOpacity>
                {/*onPress={() => verODescargarFactura(item.idfactura, 'descargar')} SUSTITUIR CUANDO ESTE LA API LISTA*/}
                <TouchableOpacity onPress={() => Alert.alert('Descargar factura', `Descargar PDF de factura ${item.idfactura}`)}>
                <Ionicons name="cloud-download-outline" size={22} color="#25476a" style={styles.iconoAccion} />
                </TouchableOpacity>
            </View>
        </View>
          <View style={styles.facturaFila}>
            <Ionicons name="calendar-outline" size={18} color="#25476a" />
            <Text style={styles.facturaLabel}>Fecha: </Text>
            <Text style={styles.facturaValor}>{formatearFecha(item.fecha)}</Text>
          </View>
          <View style={styles.facturaFila}>
            <Ionicons name="pricetag-outline" size={18} color="#25476a" />
            <Text style={styles.facturaLabel}>Serie: </Text>
            <Text style={styles.facturaValor}>{item.serie || 'N/A'}</Text>
          </View>
          <View style={styles.facturaFila}>
            <Ionicons name="cash-outline" size={18} color="#25476a" />
            <Text style={styles.facturaLabel}>Total: </Text>
            <Text style={styles.facturaValor}>{item.total}€</Text>
          </View>
          <View style={styles.facturaFila}>
            <Ionicons
              name={item.cobrada === '1' ? 'checkmark-circle-outline' : 'close-circle-outline'}
              size={18}
              color={item.cobrada === '1' ? 'green' : 'red'}
            />
            <Text style={styles.facturaLabel}>Estado: </Text>
            <Text style={styles.facturaValor}>{item.cobrada === '1' ? 'Cobrada' : 'No cobrada'}</Text>
          </View>
        </View>
    );  
    
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Mis facturas</Text>
            <FlatList
                data={facturas}
                keyExtractor={(item) => item.idfactura.toString()}
                renderItem={renderFactura}
                contentContainerStyle={{ paddingBottom: 80 }}
            />
      </View>
    );
}