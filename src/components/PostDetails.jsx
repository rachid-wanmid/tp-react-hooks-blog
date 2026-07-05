import React, { useMemo } from 'react';
// TODO: Exercice 3 - Importer useTheme
import { useTheme } from '../context/ThemeContext';

/**
 * Composant d'affichage détaillé d'un post
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.post - Le post à afficher
 * @param {Function} props.onClose - Fonction pour fermer les détails
 * @param {Function} props.onTagClick - Fonction appelée lors du clic sur un tag
 */
function PostDetails({ post, onClose, onTagClick }) {
  // TODO: Exercice 3 - Utiliser le hook useTheme
  const { theme } = useTheme();

  // TODO: Exercice 3 - Utiliser useMemo pour calculer les classes CSS
  const themeClasses = useMemo(() => ({
    card: theme === 'dark' ? 'bg-dark text-light border-secondary' : '',
    badge: theme === 'dark' ? 'bg-secondary' : 'bg-secondary',
    button: theme === 'dark' ? 'btn-outline-light' : 'btn-outline-secondary'
  }), [theme]);

  if (!post) return null;

  return (
    <div
      className="modal-backdrop-custom"
      onClick={onClose}
    >
      <div
        className={`card ${themeClasses.card}`}
        style={{ maxWidth: '700px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">{post.title}</h5>
          <button
            className={`btn btn-sm ${themeClasses.button}`}
            onClick={onClose}
            aria-label="Fermer"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="card-body">
          {/* TODO: Exercice 4 - Afficher le contenu du post */}
          <p className="card-text">{post.body}</p>

          {/* TODO: Exercice 4 - Afficher les réactions et l'utilisateur */}
          <p className="text-muted mb-2">
            Auteur #{post.userId} · {post.reactions?.likes ?? 0} likes · {post.reactions?.dislikes ?? 0} dislikes
          </p>

          {/* TODO: Exercice 4 - Afficher les tags */}
          <div>
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className={`badge ${themeClasses.badge} me-1`}
                role="button"
                onClick={() => onTagClick && onTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// TODO: Exercice 3 - Utiliser React.memo pour optimiser les rendus
export default React.memo(PostDetails);
