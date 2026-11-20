import { useState } from "react";
import { useRouter } from "expo-router";
import {
  Alert, Button, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { validateRegister } from "../utils/validate-register";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registrar = () => {
    const errors = validateRegister(email, username, password, confirmPassword);
    if (errors.length > 0) {
      Alert.alert("Revisa tus datos", errors.join("\n\n"));
      return;
    }
    router.replace("/");
  };

  const volver = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  return (
    <SafeAreaView style={styles.screen} edges={["bottom", "left", "right"]}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              accessibilityLabel="Correo electrónico" style={styles.input}
              placeholder="tu@correo.com" placeholderTextColor="#666666"
              value={email} onChangeText={setEmail} keyboardType="email-address"
              autoCapitalize="none" autoCorrect={false} autoComplete="email"
            />
            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
              accessibilityLabel="Nombre de usuario" style={styles.input}
              placeholder="Escribe tu nombre de usuario" placeholderTextColor="#666666"
              value={username} onChangeText={setUsername}
              autoCapitalize="none" autoCorrect={false} autoComplete="username"
            />
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              accessibilityLabel="Contraseña" style={styles.input}
              placeholder="Escribe tu contraseña" placeholderTextColor="#666666"
              value={password} onChangeText={setPassword} secureTextEntry
              autoCapitalize="none" autoCorrect={false} autoComplete="new-password"
            />
            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              accessibilityLabel="Confirmar contraseña" style={styles.input}
              placeholder="Repite tu contraseña" placeholderTextColor="#666666"
              value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry
              autoCapitalize="none" autoCorrect={false} autoComplete="new-password"
              returnKeyType="done" onSubmitEditing={registrar}
            />
            <Text style={styles.hint}>Mínimo 8 caracteres, mayúsculas, minúsculas y un carácter especial. Las contraseñas deben coincidir.</Text>
            <Button title="Registrarse" onPress={registrar} color="#1976d2" />
            <View style={styles.backButton}>
              <Button title="Atrás" onPress={volver} color="#666666" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#ffffff" },
  container: { flexGrow: 1, justifyContent: "center", padding: 24 },
  form: { width: "100%", maxWidth: 360, alignSelf: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#222222", textAlign: "center", marginBottom: 28 },
  label: { fontSize: 16, color: "#222222", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#999999", borderRadius: 4, padding: 12, fontSize: 16, color: "#222222", marginBottom: 18 },
  hint: { fontSize: 13, lineHeight: 19, color: "#555555", marginBottom: 20 },
  backButton: { marginTop: 12 },
});
