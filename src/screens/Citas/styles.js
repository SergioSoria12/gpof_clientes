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
    color: '#25476a',
  },
  sinCitas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sinCitasTexto: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    position: 'relative',
  },
  fecha: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#25476a',
    marginBottom: 5,
  },
  nombrePaciente: {
    color: '#25476a',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
  },
  iconoTipo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  tipoTexto: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
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
  botonOpciones: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  menuItemText: {
    fontSize: 16,
  },
});