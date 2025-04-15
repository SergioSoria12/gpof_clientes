import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#25476a",
        marginBottom: 40,
        textAlign: 'center',
    },
    input: {
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderColor: "#25476a",
        borderWidth: 1,
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#25476a',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 10,
        borderColor: '#25476a',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    recordarContainer: {
        marginVertical: 10,
        alignItems: 'center',
      },
      recordarTexto: {
        fontSize: 16,
        color: '#25476a',
      },
});