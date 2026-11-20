import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import ArtistBox from "./ArtistBox";
import type { Artist } from "@/types/artist";

export default function ArtistList({ artists }: { artists: Artist[] }) {
  const router = useRouter();
  const handlePress = (artist: Artist) => {
    router.push({ pathname: "/detail", params: { id: artist.id, name: artist.name, image: artist.image } });
  };
  return (
    <FlatList
      data={artists}
      contentContainerStyle={styles.container}
      keyExtractor={(artist) => artist.id}
      ListEmptyComponent={<Text style={styles.empty}>No hay artistas disponibles.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Ver detalle de ${item.name}`}
          testID={`artist-box-${item.name}`}
          onPress={() => handlePress(item)}
        >
          <ArtistBox artist={item} />
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, width: "100%", maxWidth: 600, alignSelf: "center" },
  empty: { textAlign: "center", fontSize: 16, color: "#555555", marginTop: 24 },
});
