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
    backgroundColor: '#e0f0ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  citaTexto: {
    flex: 1,
    fontSize: 14,
  },
  botonAñadir: {
    backgroundColor: '#25476a',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
});