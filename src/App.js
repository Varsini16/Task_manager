import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import './App.css'


const Settings = ({ darkMode, setDarkMode }) => {
  return (
    <div className={`p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <div className="flex items-center">
        <label className="mr-4">Enable Dark Mode:</label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          className="toggle-dark-mode"
        />
      </div>
    </div>
  );
};

const App = () => {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || []);
  const [taskText, setTaskText] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [notification, setNotification] = useState("");


  const addTask = () => {
    if (!taskText.trim()) return;
    const newTask = { id: Date.now(), text: taskText, completed: false };
    setTasks([...tasks, newTask]);
    setTaskText("");
    showNotification("Task added!");
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));
    setTasks(updatedTasks);
    showNotification("Task updated!");
  };

  const deleteTask = (id) => {
    const remainingTasks = tasks.filter((task) => task.id !== id);
    setTasks(remainingTasks);
    showNotification("Task deleted!");
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

 
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className={`min-h-screen flex flex-col items-center p-6 ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        
        {notification && (
          <div className="notification-bar bg-green-500 text-white p-2 w-full fixed top-0 left-0 flex justify-center items-center text-center">
            {notification}
          </div>
        )}

      
        <div className="flex justify-between w-full mb-4">
          <Link to="/" className="p-2 rounded bg-blue-500 text-white">Home</Link>
          <Link to="/settings" className="p-2 rounded bg-green-500 text-white">Settings</Link>
        </div>

        <Routes>
       
          <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />

         
          <Route
            path="/"
            element={
              <>
                <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="border p-2 rounded w-64 bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
                    placeholder="Enter a task..."
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                  />
                  <button
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                    onClick={addTask}
                  >
                    Add Task
                  </button>
                </div>

                <ul className="mt-4 w-80">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className={`flex justify-between items-center p-2 mt-2 rounded ${task.completed ? "bg-green-400" : "bg-gray-300"} dark:bg-gray-700`}
                    >
                      <span
                        onClick={() => toggleTask(task.id)}
                        className={`cursor-pointer ${task.completed ? "line-through" : ""}`}
                      >
                        {task.text}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="bg-red-500 text-white px-2 rounded"
                      >
                        ✖
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
