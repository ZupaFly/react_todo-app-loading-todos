/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, setTodos }) => {
  const handleToggle = () => {
    setTodos(prevTodos =>
      prevTodos.map(t =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t,
      ),
    );
  };

  const handleDelete = () => {
    setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
  };

  return (
    <div className={`todo ${todo.completed ? 'completed' : ''}`} data-cy="Todo">
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          id={`todo-status-${todo.id}`}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
      </label>
      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={handleDelete}
        data-cy="TodoDelete"
      >
        ×
      </button>
    </div>
  );
};

export default TodoItem;
