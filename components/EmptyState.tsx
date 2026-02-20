import { createHomeStyles } from "@/assets/home.styles";
import useTheme from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Clipboard } from "lucide-react-native";
import { Text, View } from "react-native";

const EmptyState = () => {
  const { colors } = useTheme();

  const homeStyles = createHomeStyles(colors);

  return (
    <View style={homeStyles.emptyContainer}>
      <LinearGradient
        colors={colors.gradients.empty}
        style={homeStyles.emptyIconContainer}
      >
        <Clipboard size={60} color={colors.textMuted} />
      </LinearGradient>
      <Text style={homeStyles.emptyText}>No todos yet!</Text>
      <Text style={homeStyles.emptySubtext}>
        Add your first todo above to get started
      </Text>
    </View>
  );
};
export default EmptyState;
