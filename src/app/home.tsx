import { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ArtistList from "@/components/ArtistList";
import { getMusicData } from "@/services/api-client";
import type { Artist } from "@/types/artist";

export default function Home() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    getMusicData(controller.signal)
      .then((data) => { if (active) setArtists(data); })
      .catch((reason) => {
        if (active) setError(controller.signal.aborted
          ? "La consulta tardó demasiado. Vuelve a intentarlo."
          : reason instanceof Error ? reason.message : "No se pudieron cargar los artistas.");
      })
      .finally(() => {
        clearTimeout(timeout);
        if (active) setLoading(false);
      });
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [attempt]);

  return (
    <SafeAreaView style={styles.screen} edges={["bottom", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Artistas populares</Text>
        <Text style={styles.subtitle}>Last.fm · España</Text>
      </View>
      {loading ? (
        <View style={styles.message}>
          <ActivityIndicator accessibilityLabel="Cargando artistas" color="#1976d2" />
          <Text style={styles.text}>Cargando artistas…</Text>
        </View>
      ) : error ? (
        <View style={styles.message}>
          <Text accessibilityRole="alert" style={styles.text}>{error}</Text>
          <Button title="Reintentar" onPress={() => {
            setLoading(true);
            setError("");
            setAttempt((value) => value + 1);
          }} />
        </View>
      ) : <ArtistList artists={artists} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#ffffff" },
  header: { paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#222222" },
  subtitle: { fontSize: 15, color: "#555555", marginTop: 8 },
  message: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  text: { fontSize: 16, color: "#555555", textAlign: "center", marginVertical: 16 },
});
