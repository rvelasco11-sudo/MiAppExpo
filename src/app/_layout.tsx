import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: "Registro" }} />
      <Stack.Screen name="home" options={{ title: "Inicio" }} />
      <Stack.Screen name="detail" options={{ title: "Detalle" }} />
    </Stack>
  );
}
