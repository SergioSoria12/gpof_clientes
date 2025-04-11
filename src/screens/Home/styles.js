import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    header: {
      flexDirection: 'row',
      paddingVertical: 30,
      
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      width: 150,
      height: 45,
      resizeMode: 'contain',
      marginTop: 5,
      
    },
    headerIcons: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 12,
    },
    saludo: {
        paddingLeft: 20,
    },
    saludoTexto: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
    },
    ayudaTexto: {
        fontSize: 25,
        color: '#25476a',
        marginTop: 4,
        marginBottom: 20,
    },
  });