import React, { useCallback, useEffect } from 'react';
// TODO: Exercice 3 - Importer useTheme
import { useTheme } from '../context/ThemeContext';
// TODO: Exercice 4 - Importer useIntersectionObserver
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import LoadingSpinner from './LoadingSpinner';

/**
 * Composant d'affichage de la liste des posts
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.posts - Liste des posts à afficher
 * @param {boolean} props.loading - Indicateur de chargement
 * @param {boolean} props.hasMore - Indique s'il y a plus de posts à charger
 * @param {Function} props.onLoadMore - Fonction pour charger plus de posts
 * @param {Function} props.onPostClick - Fonction appelée au clic sur un post
 * @param {Function} props.onTagClick - Fonction appelée au clic sur un tag
 * @param {boolean} props.infiniteScroll - Mode de défilement infini activé ou non
 */
function PostList({
  posts = [],
  loading = false,
  hasMore = false,
  onLoadMore,
  onPostClick,
  onTagClick,
  infiniteScroll = true
}) {
  // TODO: Exercice 3 - Utiliser le hook useTheme
  const { theme } = useTheme();
  const cardThemeClass = theme === 'dark' ? 'bg-dark text-light border-secondary' : '';

  // TODO: Exercice 4 - Utiliser useIntersectionObserver pour le défilement infini
  const [sentinelRef, isIntersecting] = useIntersectionObserver({
    enabled: infiniteScroll && hasMore && !loading,
  });

  useEffect(() => {
    if (isIntersecting && onLoadMore) {
      onLoadMore();
    }
  }, [isIntersecting, onLoadMore]);

  // TODO: Exercice 3 - Utiliser useCallback pour les gestionnaires d'événements
  const handlePostClick = useCallback((post) => {
    if (onPostClick) {
      onPostClick(post);
    }
  }, [onPostClick]);

  const handleTagClick = useCallback((e, tag) => {
    e.stopPropagation(); // Éviter de déclencher le clic sur le post
    if (onTagClick) {
      onTagClick(tag);
    }
  }, [onTagClick]);

  // TODO: Exercice 1 - Gérer le cas où il n'y a pas de posts
  if (!loading && posts.length === 0) {
    return (
      <div className="post-list">
        <p className="text-center text-muted my-4">Aucun article trouvé.</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {/* TODO: Exercice 1 - Afficher la liste des posts */}
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {posts.map((post) => (
          <div className="col" key={post.id}>
            <div
              className={`card h-100 ${cardThemeClass}`}
              role="button"
              onClick={() => handlePostClick(post)}
            >
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">
                  {post.body.length > 150 ? `${post.body.slice(0, 150)}...` : post.body}
                </p>
                <div className="mb-2">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="badge bg-secondary me-1"
                      role="button"
                      onClick={(e) => handleTagClick(e, tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <small className="text-muted">
                  {post.reactions?.likes ?? 0} likes · {post.reactions?.dislikes ?? 0} dislikes
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Afficher le spinner de chargement */}
      {loading && <LoadingSpinner />}

      {/* TODO: Exercice 4 - Ajouter la référence pour le défilement infini */}
      {infiniteScroll && hasMore && !loading && (
        <div ref={sentinelRef} style={{ height: '1px' }} />
      )}

      {/* TODO: Exercice 1 - Ajouter le bouton "Charger plus" pour le mode non-infini */}
      {!infiniteScroll && hasMore && !loading && (
        <div className="d-flex justify-content-center my-4">
          <button className="btn btn-primary" onClick={onLoadMore}>
            Charger plus
          </button>
        </div>
      )}
    </div>
  );
}

// TODO: Exercice 3 - Utiliser React.memo pour optimiser les rendus
export default React.memo(PostList);
