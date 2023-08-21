import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5010';
const YOUR_USERNAME="username";
const YOUR_PASSWORD="password";


function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(1);
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`,{
        headers : {
          "Authorization":'Basic ' + btoa(unescape(encodeURIComponent(YOUR_USERNAME + ':' + YOUR_PASSWORD)))
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async () => {
    try {
      await axios.post(`${API_URL}/tasks`, { title, deadline, userId }, {
        headers : {
          "Authorization":'Basic ' + btoa(unescape(encodeURIComponent(YOUR_USERNAME + ':' + YOUR_PASSWORD)))
        }
      });
      fetchTasks();
      setTitle('');
      setUserId(1);
      setDeadline('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const toggleTaskStatus = async (taskId, done) => {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, { done: !done, userId }, {
        headers : {
          "Authorization":'Basic ' + btoa(unescape(encodeURIComponent(YOUR_USERNAME + ':' + YOUR_PASSWORD)))
        }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <div>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button onClick={createTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTaskStatus(task.id, task.done)}
            />
            {task.title} {task.deadline ? `- Deadline: ${task.deadline}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;