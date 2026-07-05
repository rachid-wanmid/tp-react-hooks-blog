import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={toggleTheme}
      aria-label="Changer de thème"
    >
      {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
    </button>
  );
}
