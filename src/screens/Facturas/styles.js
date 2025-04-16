import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 10,
    color: '#25476a',
  },
  cardFactura: {
    backgroundColor: '#e6f0ff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    elevation: 4, // sombra en Android
    shadowColor: '#000', // sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'relative',
  },
  
  facturaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  
  facturaLabel: {
    fontWeight: 'bold',
    color: '#25476a',
    fontSize: 14,
    marginLeft: 6,
  },
  
  facturaValor: {
    color: '#333',
    fontSize: 14,
  },
  
  facturaAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  
  iconoAccion: {
    marginLeft: 10,
  },
});
