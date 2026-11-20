import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ArtistBox from "@/components/ArtistBox";

export default function Detail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[]; name?: string | string[]; image?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const name = (Array.isArray(params.name) ? params.name[0] : params.name)?.trim();
  const image = (Array.isArray(params.image) ? params.image[0] : params.image)?.trim() || "";
  const volver = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/home");
  };

  return (
    <SafeAreaView style={styles.screen} edges={["bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          {name ? (
            <>
              <ArtistBox artist={{ id: id || name, name, image }} large />
              <Text style={styles.description}>Estás viendo el detalle de {name}.</Text>
            </>
          ) : (
            <Text style={styles.description}>No se recibió el nombre del artista. Selecciona uno desde Inicio.</Text>
          )}
          <Button title="Volver al inicio" onPress={volver} color="#1976d2" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#ffffff" },
  container: { flexGrow: 1, justifyContent: "center", padding: 24 },
  content: { width: "100%", maxWidth: 440, alignSelf: "center" },
  description: { color: "#555555", fontSize: 16, lineHeight: 24, textAlign: "center", marginBottom: 28 },
});
