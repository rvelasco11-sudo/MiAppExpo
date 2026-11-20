import { useState } from "react";
import { useRouter } from "expo-router";
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { validateLogin } from "../utils/validate-login";

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onRegister = () => {
    router.push({ pathname: "/register" });
  };

  const iniciarSesion = () => {
    const errors = validateLogin(email, password);
    if (errors.length > 0) {
      Alert.alert("Revisa tus datos", errors.join("\n\n"));
      return;
    }
    router.push("/home");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <Image
              source={require("../../assets/images/react-logo.png")}
              style={styles.image}
              accessibilityLabel="Logotipo de React Native"
            />
            <Text style={styles.title}>Iniciar sesión</Text>

            <Text nativeID="email-label" style={styles.label}>Correo electrónico</Text>
            <TextInput
              accessibilityLabel="Correo electrónico"
              accessibilityLabelledBy="email-label"
              style={styles.input}
              placeholder="tu@correo.com"
              placeholderTextColor="#666666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              autoComplete="email"
            />

            <Text nativeID="password-label" style={styles.label}>Contraseña</Text>
            <TextInput
              accessibilityLabel="Contraseña"
              accessibilityLabelledBy="password-label"
              style={styles.input}
              placeholder="Escribe tu contraseña"
              placeholderTextColor="#666666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              returnKeyType="go"
              onSubmitEditing={iniciarSesion}
            />
            <Text style={styles.hint}>
              Mínimo 8 caracteres, mayúsculas, minúsculas y un carácter especial.
            </Text>
            <Button title="Ingresar" onPress={iniciarSesion} color="#1976d2" />
            <View style={styles.registerButton}>
              <Button title="Registro" onPress={onRegister} color="#666666" />
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
  image: { width: 90, height: 80, resizeMode: "contain", alignSelf: "center", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#222222", textAlign: "center", marginBottom: 28 },
  label: { fontSize: 16, color: "#222222", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#999999", borderRadius: 4, padding: 12, fontSize: 16, color: "#222222", marginBottom: 18 },
  hint: { fontSize: 13, lineHeight: 19, color: "#555555", marginBottom: 20 },
  registerButton: { marginTop: 12 },
});
