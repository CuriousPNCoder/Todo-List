import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/todos");
      setTodos(response.data.filter((todo) => !isNaN(parseInt(todo.id))));
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewTodo(e.target.value);
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      try {
        const response = await axios.post("http://localhost:3001/todos", {
          title: newTodo,
          completed: false,
        });
        setTodos([...todos, response.data]);
        setNewTodo("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const handleCheckboxChange = async (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);

    try {
      await axios.put(`http://localhost:3001/todos/${id}`, {
        completed: updatedTodos.find((todo) => todo.id === id).completed,
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/todos/${id}`);
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f0f0f0",
      }}>
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "400px",
        }}>
        <h2>Todo List</h2>
        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            value={newTodo}
            onChange={handleInputChange}
            placeholder="Enter a new todo"
            style={{
              marginRight: 10,
              padding: "8px 12px",
              fontSize: 16,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
          <button
            onClick={handleAddTodo}
            style={{
              padding: "8px 12px",
              fontSize: 16,
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "lightgreen")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "green")}>
            Add Todo
          </button>
        </div>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {todos.map((todo) => (
            <li
              key={parseInt(todo.id)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleCheckboxChange(todo.id)}
                />
                <span
                  style={{
                    marginLeft: 10,
                    textDecoration: todo.completed ? "line-through" : "none",
                    color: todo.completed ? "grey" : "black",
                  }}>
                  {todo.title}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}>
                <FaTrash style={{ color: "red", fontSize: 16 }} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
