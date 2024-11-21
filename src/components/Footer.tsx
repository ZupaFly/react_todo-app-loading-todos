import React from 'react';
import { Todo } from '../types/Todo';

interface FooterProps {
  todos: Todo[];
  filter: string;
  onFilterChange: (newFilter: string) => void;
  onClearCompleted: () => void;
}

const Footer: React.FC<FooterProps> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span
        className="todo-count"
        data-cy="TodosCounter"
      >{`${todos.filter(todo => !todo.completed).length} items left`}</span>
      <nav className="filter" data-cy="Filter">
        {['all', 'active', 'completed'].map(filterType => (
          <button
            key={filterType}
            className={`filter__link ${filter === filterType ? 'selected' : ''}`}
            onClick={() => onFilterChange(filterType)}
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
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
