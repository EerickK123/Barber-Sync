// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
// import { Platform } from 'react-native';

// export async function registerForPushNotificationsAsync() {
//   if (!Device.isDevice) {
//     alert('Esto no funcionará en el simulador. Usa un dispositivo físico.');
//     return;
//   }

//   // 1. Pedir permisos
//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;
  
//   if (existingStatus !== 'granted') {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus !== 'granted') {
//     alert('Fallo al obtener permisos de notificación');
//     return;
//   }

//   // 2. Obtener el token (esto usa el projectId que pusimos en app.json)
//   try {
//     const projectId = "db6fad64-3c9c-4557-b3ff-6d6d60751204"; // Tu ID de app.json
//     const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
//     console.log("TU TOKEN ES:", token);
//     return token;
//   } catch (e) {
//     console.error("Error al obtener el token:", e);
//   }
// }