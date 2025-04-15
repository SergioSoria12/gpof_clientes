import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#25476a',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  picker: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 15,
    color: '#000', 
    paddingHorizontal: 10,
    height: 50,
    fontSize: 16,
  },
  selectItem: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
  },
  selected: {
    backgroundColor: '#cce4ff',
  },
  clinicaCard: {
    backgroundColor: '#e6f0ff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#25476a',
  },
  clinicaTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#25476a',
    marginBottom: 4,
  },
  botonCita: {
    backgroundColor: '#25476a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
  },
  citaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  
  modalVentana: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#25476a',
    marginBottom: 15,
  },
  
  modalCitaCard: {
    width: '100%',
    backgroundColor: '#e6f0ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  
  citaTexto: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  botonAñadir: {
    backgroundColor: '#25476a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  botonCerrar: {
    marginTop: 10,
  },
  
  botonCerrarTexto: {
    color: '#25476a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorTexto: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});