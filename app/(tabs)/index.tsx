import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={[styles.content, { color: "#ffffff" }]}>Hello World</Text>
      <Text style={[styles.secondary, { color: "#ffffff" }]}>
        Made with React Native Expo
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1d1e",
    gap: 10,
  },
  content: {
    fontSize: 52,
  },
  secondary: {
    fontSize: 24,
  },
});
