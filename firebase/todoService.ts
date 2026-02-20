// firebase/todoService.js
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { Todo } from "../types/todo";
import { db } from "./firebaseconfig";

// Get all todos (ordered descending by creation time)
export const getTodos = async (): Promise<
  Array<Todo & { id: string; createdAt: number }>
> => {
  const q = query(collection(db, "todos"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      text: data.text ?? "",
      isCompleted: data.isCompleted ?? false,
      createdAt: data.createdAt ?? 0,
    };
  });
};

// Add a todo
export const addTodo = async (text: string): Promise<string> => {
  const docRef = await addDoc(collection(db, "todos"), {
    text,
    isCompleted: false,
    createdAt: Date.now(),
  });
  return docRef.id;
};

// Toggle a todo
export const toggleTodo = async (
  id: string,
  isCompleted: boolean,
): Promise<void> => {
  const todoRef = doc(db, "todos", id);
  await updateDoc(todoRef, { isCompleted: !isCompleted });
};

// Update a todo
export const updateTodo = async (id: string, text: string): Promise<void> => {
  const todoRef = doc(db, "todos", id);
  await updateDoc(todoRef, { text });
};

// Delete a todo
export const deleteTodo = async (id: string): Promise<void> => {
  const todoRef = doc(db, "todos", id);
  await deleteDoc(todoRef);
};

// Clear all todos
export const clearAllTodos = async (): Promise<{ deletedCount: number }> => {
  const snapshot = await getDocs(collection(db, "todos"));
  let deletedCount = 0;
  for (const d of snapshot.docs) {
    await deleteDoc(doc(db, "todos", d.id));
    deletedCount++;
  }
  return { deletedCount };
};
