import { createHomeStyles } from "@/assets/home.styles";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import TodoInput from "@/components/TodoInput";
import {
  deleteTodo,
  subscribeToTodos,
  toggleTodo,
} from "@/firebase/todoService";
import useTheme, { ColorScheme } from "@/hooks/useTheme";
import { Todo } from "@/types/todo";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const { toggleDarkMode, colors } = useTheme();

  const homeStyles = createHomeStyles(colors);

  const [todos, setTodos] = useState<
    Array<Todo & { id: string; createdAt: number }>
  >([]);
  const [loading, setLoading] = useState(true);

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

  const renderItem = ({
    item,
  }: {
    item: Todo & { id: string; createdAt: number };
  }) => (
    <View style={homeStyles.todoItemWrapper}>
      <View style={[homeStyles.todoItem, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={homeStyles.checkbox}
          onPress={() => handleToggle(item)}
        >
          <View
            style={[
              homeStyles.checkboxInner,
              {
                borderColor: item.isCompleted ? colors.primary : colors.border,
                backgroundColor: item.isCompleted
                  ? colors.primary
                  : "transparent",
              },
            ]}
          >
            {item.isCompleted && (
              <Ionicons name="checkmark" size={20} color="#fff" />
            )}
          </View>
        </TouchableOpacity>
        <View style={homeStyles.todoTextContainer}>
          <Text
            style={[
              homeStyles.todoText,
              {
                textDecorationLine: item.isCompleted ? "line-through" : "none",
                color: item.isCompleted ? colors.textMuted : colors.text,
              },
            ]}
          >
            {item.text}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
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
          <FlatList
            data={todos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={homeStyles.todoListContent}
            style={homeStyles.todoList}
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
