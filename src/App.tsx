/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      setError(null);

      try {
        const todosFromApi = await getTodos();

        setTodos(todosFromApi);
      } catch {
        setError('Unable to load todos');
      } finally {
        setLoading(false);
      }
    };

    if (USER_ID) {
      loadTodos();
    }
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTodoTitle.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          title: newTodoTitle.trim(),
          completed: false,
          userId: 0,
        },
      ]);
      setNewTodoTitle('');
    }
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);

    setTodos(todos.map(todo => ({ ...todo, completed: !allCompleted })));
  };

  const handleFilterChange = (newFilter: string) => setFilter(newFilter);

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            aria-label="Mark all as completed"
            className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
            onClick={handleToggleAll}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {loading ? (
            <div className="loader">Loading...</div>
          ) : (
            filteredTodos.map(todo => (
              <div
                key={todo.id}
                className={`todo ${todo.completed ? 'completed' : ''}`}
                data-cy="Todo"
              >
                <label
                  className="todo__status-label"
                  htmlFor={`todo-status-${todo.id}`}
                >
                  <input
                    id={`todo-status-${todo.id}`}
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() => {
                      setTodos(
                        todos.map(t =>
                          t.id === todo.id
                            ? { ...t, completed: !t.completed }
                            : t,
                        ),
                      );
                    }}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              {['all', 'active', 'completed'].map(filterType => (
                <button
                  key={filterType}
                  className={`filter__link ${filter === filterType ? 'selected' : ''}`}
                  onClick={() => handleFilterChange(filterType)}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.every(todo => !todo.completed)}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {error && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setError(null)}
          />
          {error}
        </div>
      )}
    </div>
  );
};
