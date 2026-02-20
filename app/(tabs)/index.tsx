import { createHomeStyles } from "@/assets/home.styles";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import TodoInput from "@/components/TodoInput";
import {
  deleteTodo,
  subscribeToTodos,
  toggleTodo,
  updateTodo,
} from "@/firebase/todoService";
import useTheme, { ColorScheme } from "@/hooks/useTheme";
import { Todo } from "@/types/todo";
import { LinearGradient } from "expo-linear-gradient";
import { Check, MoreHorizontal } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

export default function Index() {
  const { toggleDarkMode, colors } = useTheme();

  const homeStyles = createHomeStyles(colors);

  const [todos, setTodos] = useState<
    Array<Todo & { id: string; createdAt: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    const unsub = subscribeToTodos((data) => {
      setTodos(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleToggle = async (
    todo: Todo & { id: string; createdAt: number },
  ) => {
    try {
      await toggleTodo(todo.id, todo.isCompleted);
    } catch (e) {
      console.log("toggle error", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
    } catch (e) {
      console.log("delete error", e);
    }
  };

  const handleStartEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateTodo(id, editingText);
      setEditingId(null);
      setEditingText("");
    } catch (e) {
      console.log("update error", e);
    }
  };

  const showOptions = (item: Todo & { id: string; createdAt: number }) => {
    Alert.alert("", undefined, [
      { text: "Edit", onPress: () => handleStartEdit(item.id, item.text) },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDelete(item.id),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<Todo & { id: string; createdAt: number }>) => (
    <View style={homeStyles.todoItemWrapper}>
      <ScaleDecorator>
        <Pressable
          onLongPress={drag}
          disabled={isActive}
          style={[homeStyles.todoItem, { backgroundColor: colors.surface }]}
        >
          <TouchableOpacity
            style={homeStyles.checkbox}
            onPress={() => handleToggle(item)}
          >
            <View
              style={[
                homeStyles.checkboxInner,
                {
                  borderColor: item.isCompleted
                    ? colors.primary
                    : colors.border,
                  backgroundColor: item.isCompleted
                    ? colors.primary
                    : "transparent",
                },
              ]}
            >
              {item.isCompleted && <Check size={20} color="#fff" />}
            </View>
          </TouchableOpacity>

          <View style={homeStyles.todoTextContainer}>
            {editingId === item.id ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  flex: 1,
                }}
              >
                <TextInput
                  value={editingText}
                  onChangeText={setEditingText}
                  style={[
                    homeStyles.todoText,
                    { flex: 1, paddingVertical: 6, color: colors.text },
                  ]}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={() => handleSaveEdit(item.id)}
                  style={{ marginLeft: 8 }}
                >
                  <Text style={{ color: colors.primary }}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setEditingId(null);
                    setEditingText("");
                  }}
                  style={{ marginLeft: 8 }}
                >
                  <Text style={{ color: colors.textMuted }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text
                style={[
                  homeStyles.todoText,
                  {
                    textDecorationLine: item.isCompleted
                      ? "line-through"
                      : "none",
                    color: item.isCompleted ? colors.textMuted : colors.text,
                  },
                ]}
              >
                {item.text}
              </Text>
            )}
          </View>

          <TouchableOpacity onPress={() => showOptions(item)}>
            <MoreHorizontal size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </Pressable>
      </ScaleDecorator>
    </View>
  );

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={homeStyles.container}
    >
      <StatusBar barStyle={colors.statusBarStyle} />
      <SafeAreaView style={homeStyles.safeArea}>
        <Header />
        <TodoInput />
        {loading ? (
          <LoadingSpinner />
        ) : todos.length === 0 ? (
          <EmptyState />
        ) : (
          <DraggableFlatList
            data={todos}
            onDragEnd={({ data }) => {
              setTodos(data);
              // persist new order
              const ids = data.map((d) => d.id);
              // lazy import to avoid circulars
              import("@/firebase/todoService").then((mod) => {
                if (mod.reorderTodos) mod.reorderTodos(ids).catch(console.warn);
              });
            }}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={homeStyles.todoListContent}
            activationDistance={20}
            containerStyle={homeStyles.todoList}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  content: {
    fontSize: 52,
  },
  secondary: {
    fontSize: 24,
  },
});

const createStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      backgroundColor: colors.bg,
    },
    content: {
      fontSize: 22,
    },
  });
  return styles;
};
