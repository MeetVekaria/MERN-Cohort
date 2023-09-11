import { useEffect, useState } from "react";
import "./App.css";

function useTodos() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/todos").then((resp) => {
      resp.json().then((data) => {
        console.log(data);
        setTodos(data);
      });
    });

    setInterval(async () => {
      const resp = await fetch("http://localhost:3000/todos");
      const data = await resp.json();
      console.log(data);
      setTodos(data);
    }, 1000);
  }, []);

  return todos;
}

function App() {
  const todos = useTodos();

  return (
    <div>
      {todos.map((todo) => {
        return <Todo title={todo.title} description={todo.description}></Todo>;
      })}
    </div>
  );
}

function Todo(props) {
  return (
    <div>
      {props.title}
      {props.description}
      <button>Delete</button>
      <br />
      <br />
    </div>
  );
}

export default App;
