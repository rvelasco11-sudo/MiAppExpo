import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import type { Artist } from "@/types/artist";

export default function ArtistBox({ artist, large = false }: { artist: Artist; large?: boolean }) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const showImage = Boolean(artist.image) && failedImage !== artist.image;
  return (
    <View style={[styles.box, large && styles.largeBox]}>
      {showImage ? (
        <Image
          source={{ uri: artist.image }}
          style={[styles.image, large && styles.largeImage]}
          accessibilityLabel={`Imagen de ${artist.name}`}
          testID="artist-image"
          onError={() => setFailedImage(artist.image)}
        />
      ) : (
        <View style={[styles.image, styles.placeholder, large && styles.largeImage]} accessibilityRole="image" accessibilityLabel={`Imagen no disponible para ${artist.name}`}>
          <Text style={styles.note}>♪</Text>
          <Text style={styles.placeholderText}>Sin imagen</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={[styles.name, large && styles.largeName]}>{artist.name}</Text>
        {!large && <Text style={styles.link}>Ver detalle →</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: "row", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dddddd", borderRadius: 8, overflow: "hidden", marginBottom: 12 },
  largeBox: { flexDirection: "column", borderWidth: 0, marginBottom: 24 },
  image: { width: 100, height: 100, resizeMode: "contain", backgroundColor: "#f1f3f5" },
  largeImage: { width: "100%", height: 240, borderRadius: 8 },
  info: { flex: 1, justifyContent: "center", padding: 16 },
  name: { fontSize: 18, fontWeight: "600", color: "#222222" },
  largeName: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  link: { color: "#1976d2", fontSize: 14, marginTop: 8 },
  placeholder: { justifyContent: "center", alignItems: "center" },
  note: { fontSize: 36, color: "#555555" },
  placeholderText: { fontSize: 12, color: "#555555" },
});
