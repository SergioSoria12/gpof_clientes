
<p align="center">
  <img src="assets/images/logo.png" width="200" alt="GPOF Clientes Logo">
</p>

#  GPOF Clientes App

Aplicación móvil desarrollada con **React Native** y **Expo** para la gestión de clientes, pensada para clínicas oftalmológicas.

---

## 📱 ¿Qué hace esta app?

- Muestra un **SplashScreen** con el logo de la empresa y animación
- Navega automáticamente a una pantalla de **Login**
- Login con campos de usuario y contraseña (validación básica)
- Navegación preparada para escalar a nuevas pantallas
- Estructura modular, ideal para crecer en funcionalidades

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/SergioSoria12/gpof_clientes.git
cd gpof_clientes
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar el proyecto con Expo

```bash
npm expo start
```

Se abrirá Expo Developer Tools en el navegador. Escanea el código QR con la app Expo Go en tu móvil Android.

## 📦 Estructura del proyecto

```bash
src/
├── components/        # Componentes reutilizables
├── navigation/        # Lógica de navegación con React Navigation
├── screens/           # Vistas principales de la app
│   ├── Splash/
│   │   ├── SplashScreen.js
│   │   └── styles.js
│   ├── Login/
│   │   ├── LoginScreen.js
│   │   └── styles.js
├── services/          # Conexión con APIs y lógica externa (en desarrollo)
├── context/           # Contextos globales para estado (auth, tema, etc.)
├── utils/             # Funciones auxiliares
assets/
└── images/            # Logos e imágenes de la aplicación
```

## 🛠️ Tecnologías utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Animatable](https://github.com/oblador/react-native-animatable)

## 📲 Generar APK para compartir

Para generar un archivo .apk que puedas compartir:

### 1. Configura EAS Build (solo la primera vez):

```bash
npx eas login
npx eas build:configure
```

### 2. Genera el APK:

```bash
npx eas build --platform android --profile preview
```

Cuando termine, te dará un enlace para descargar el .apk y compartirlo con otros usuarios.

## 👨‍💻 Desarrollado por

**[Sergio Soria](https://github.com/SergioSoria12)**