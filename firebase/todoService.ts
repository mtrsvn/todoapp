// firebase/todoService.js
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
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

// Subscribe to real-time updates
export const subscribeToTodos = (
  onUpdate: (todos: Array<Todo & { id: string; createdAt: number }>) => void,
) => {
  const q = query(collection(db, "todos"), orderBy("createdAt", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        text: d.text ?? "",
        isCompleted: d.isCompleted ?? false,
        createdAt: d.createdAt ?? 0,
      };
    });
    onUpdate(data);
  });
  return unsubscribe;
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
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(doc(db, "todos", d.id)));
  await batch.commit();
  return { deletedCount: snapshot.docs.length };
};

// Reorder todos by updating their createdAt timestamps in a batch.
// `orderedIds` should be an array of todo ids in the new desired order (first = top).
export const reorderTodos = async (orderedIds: string[]): Promise<void> => {
  const batch = writeBatch(db);
  const now = Date.now();
  // Assign decreasing timestamps so the first item is newest (highest createdAt)
  for (let i = 0; i < orderedIds.length; i++) {
    const id = orderedIds[i];
    const todoRef = doc(db, "todos", id);
    const createdAt = now - i; // simple decreasing value
    batch.update(todoRef, { createdAt });
  }
  await batch.commit();
};
