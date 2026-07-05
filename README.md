# TP React Hooks - Application de Blog

Ce TP a pour objectif de mettre en pratique l'utilisation des Hooks React (useState, useEffect, useCallback, useMemo) ainsi que la création de Hooks personnalisés à travers une application de blog simple.

## Installation et configuration initiale

1. Cloner le dépôt :
```bash
git clone https://github.com/pr-daaif/tp-react-hooks-blog.git
cd tp-react-hooks-blog
```

2. Créer votre propre dépôt sur Github et changer le remote :
```bash
# Supprimer le remote origine
git remote remove origin

# Ajouter votre nouveau remote
git remote add origin https://github.com/[votre-username]/tp-react-hooks-blog.git

# Premier push
git push -u origin main
```

3. Installer les dépendances :
```bash
npm install
```

4. Lancer l'application :
```bash
npm start
```

## Instructions pour le TP

Pour chaque exercice :
1. Lisez attentivement l'énoncé
2. Implémentez la solution
3. Testez votre implémentation (pensez à faire des copies d'écran)
4. Mettez à jour la section correspondante dans ce README avec :
   - Une brève explication de votre solution
   - Des captures d'écran montrant le fonctionnement
   - Les difficultés rencontrées et comment vous les avez résolues
5. Commitez vos changements avec un message descriptif

### Exercice 1 : État et Effets 
#### Objectif : Implémenter l'affichage et la recherche de posts

- [ ] 1.1 Compléter le hook `usePosts` pour récupérer les posts depuis l'API dummyjson.com
- [ ] 1.2 Implémenter le composant `PostList` pour afficher les posts
- [ ] 1.3 Ajouter la fonctionnalité de recherche par titre ou contenu dans `PostSearch`
- [ ] 1.4 Documenter votre solution ici

_Votre réponse pour l'exercice 1 :_
```
Solution :
- usePosts : construit l'URL de l'API selon le filtre (recherche, tag, ou
  liste normale), fait le fetch, et gère loading/error. Un useEffect relance
  le fetch à chaque fois que searchTerm change.
- PostList : affiche chaque post dans une carte (titre, extrait, tags,
  réactions), affiche un message si la liste est vide, et le spinner
  pendant le chargement.
- PostSearch : champ de recherche qui envoie sa valeur au parent à chaque
  frappe, avec un bouton pour l'effacer.

Exemple : si on tape "love" dans la recherche, usePosts appelle
https://dummyjson.com/posts/search?q=love et PostList affiche seulement
les posts qui contiennent "love".

Difficultés rencontrées :
- Ne pas mélanger les résultats d'une recherche avec ceux de la précédente
  → on repart de zéro (reset) à chaque nouveau filtre.
- Le clic sur un tag ne doit pas aussi ouvrir le post → e.stopPropagation().

[Ajoutez vos captures d'écran]
```

### Exercice 2 : Hooks Personnalisés
#### Objectif : Créer des hooks réutilisables

- [ ] 2.1 Créer le hook `useDebounce` pour optimiser la recherche
- [ ] 2.2 Créer le hook `useLocalStorage` pour persister les préférences utilisateur
- [ ] 2.3 Utiliser ces hooks dans l'application
- [ ] 2.4 Documenter votre solution ici

_Votre réponse pour l'exercice 2 :_
```
Solution :
- useDebounce : attend un délai (500ms) après la dernière frappe avant de
  mettre à jour la valeur retournée, pour éviter d'appeler l'API à chaque
  caractère tapé.
- useLocalStorage : fonctionne comme useState, mais lit la valeur initiale
  depuis localStorage et la réécrit à chaque changement, pour garder la
  préférence même après un rechargement de page.

Exemple : usePosts utilise useDebounce(searchTerm, 500), donc si on tape
"love" rapidement, l'API n'est appelée qu'une fois, 500ms après la dernière
lettre tapée. App.jsx utilise useLocalStorage pour retenir le choix
"défilement infini" même si on recharge la page.

Difficultés rencontrées :
- Bien annuler (clearTimeout) le timeout précédent dans useDebounce, sinon
  plusieurs mises à jour inutiles s'accumulent.
- localStorage peut échouer (navigation privée) → accès entourés d'un
  try/catch.

[Ajoutez vos captures d'écran]
```

### Exercice 3 : Optimisation et Context
#### Objectif : Gérer le thème global et optimiser les rendus

- [ ] 3.1 Créer le `ThemeContext` pour gérer le thème clair/sombre
- [ ] 3.2 Implémenter le composant `ThemeToggle`
- [ ] 3.3 Utiliser `useCallback` et `useMemo` pour optimiser les performances
- [ ] 3.4 Documenter votre solution ici

_Votre réponse pour l'exercice 3 :_
```
Solution :
- ThemeContext : garde le thème ("light"/"dark") dans useLocalStorage pour
  qu'il soit retenu après rechargement, et fournit toggleTheme() via
  useTheme() pour basculer.
- ThemeToggle : bouton qui affiche "Mode sombre"/"Mode clair" et appelle
  toggleTheme au clic.
- Optimisation : PostList et PostSearch utilisent useCallback pour leurs
  gestionnaires (évite de recréer les fonctions à chaque rendu) et sont
  exportés avec React.memo (évite un re-render si les props n'ont pas
  changé). Dans usePosts, buildApiUrl est mémorisée avec useCallback et les
  tags uniques sont calculés avec useMemo (recalcul seulement si posts
  change).

Exemple : au clic sur ThemeToggle, le thème passe de "light" à "dark",
ThemeContext le sauvegarde dans localStorage, et App.jsx applique
data-theme="dark" sur le conteneur → le CSS (App.css) change le fond en
sombre et les cartes de PostList passent en bg-dark.

Difficultés rencontrées :
- Bien mettre useTheme() dans un composant enfant du ThemeProvider (créé un
  composant AppContent séparé de App pour que useTheme fonctionne).

[Ajoutez vos captures d'écran]
```

### Exercice 4 : Fonctionnalités avancées
#### Objectif : Ajouter des fonctionnalités de chargement et détail

- [ ] 4.1 Implémenter le chargement infini des posts avec `useIntersectionObserver`
- [ ] 4.2 Créer le composant `PostDetails` pour afficher les détails d'un post
- [ ] 4.3 Ajouter la fonctionnalité de filtrage par tags
- [ ] 4.4 Documenter votre solution ici

_Votre réponse pour l'exercice 4 :_
```
Solution :
- useIntersectionObserver : observe un élément (une petite div "sentinelle")
  et retourne [ref, isIntersecting]. Dans PostList, cette sentinelle est
  placée en bas de la liste ; quand elle devient visible (isIntersecting),
  un useEffect appelle onLoadMore pour charger la page suivante.
- PostDetails : affiche le contenu complet d'un post (body, auteur,
  réactions, tags cliquables) en popup superposé (fond sombre + carte
  centrée), avec un bouton ou un clic à l'extérieur pour fermer.
- Sélection d'un post : usePosts expose selectedPost/selectPost/
  clearSelectedPost. Un clic sur une carte dans PostList appelle
  selectPost(post.id), qui fait GET /posts/{id} et affiche PostDetails.
- Filtrage par tags : usePosts calcule availableTags (déjà fait en ex3), et
  App.jsx garde un état selectedTag passé à usePosts({ tag: selectedTag }).
  Le sélecteur de tags dans PostSearch et les badges cliquables dans
  PostList/PostDetails appellent tous le même handler handleTagSelect.

Exemple : on clique sur un post → ses détails s'affichent en popup avec ses
tags. On clique sur le tag "history" → selectedTag devient "history",
usePosts recharge via /posts/tag/history, et PostSearch affiche "history"
comme sélectionné dans le menu déroulant.

Difficultés rencontrées :
- Éviter de déclencher onLoadMore en boucle : le useEffect ne se relance que
  si isIntersecting ou onLoadMore changent, et l'observer n'est actif que si
  infiniteScroll est activé et qu'il reste des posts (hasMore).
- Faire en sorte qu'un même clic sur un tag fonctionne à la fois depuis la
  liste et depuis les détails : un seul handler (handleTagSelect) est
  réutilisé partout.
- Le mode sombre ne couvrait au départ que le conteneur central → complété
  en appliquant aussi data-theme sur document.body (dans ThemeContext).

[Ajoutez vos captures d'écran]
```

## Structure détaillée du projet

```
📁 ./
├─ 📄 README.md
├─ 📄 package.json
├─ 📁 public/
│  └─ 📄 index.html
└─ 📁 src/
   ├─ 📄 App.js               # Composant principal de l'application
   ├─ 📄 App.css              # Styles CSS de l'application
   ├─ 📁 components/
   │  ├─ 📄 PostList.js       # Liste des posts
   │  ├─ 📄 PostSearch.js     # Barre de recherche
   │  ├─ 📄 PostDetails.js    # Détails d'un post
   │  ├─ 📄 ThemeToggle.js    # Bouton pour changer de thème
   │  └─ 📄 LoadingSpinner.js # Indicateur de chargement
   ├─ 📁 hooks/
   │  ├─ 📄 usePosts.js       # Hook pour gérer les posts
   │  ├─ 📄 useDebounce.js    # Hook pour débouncer les valeurs
   │  ├─ 📄 useLocalStorage.js # Hook pour gérer le localStorage
   │  └─ 📄 useIntersectionObserver.js # Hook pour le chargement infini
   ├─ 📁 context/
   │  └─ 📄 ThemeContext.js   # Contexte pour le thème
   ├─ 📄 index.css
   └─ 📄 index.js
```

## Ressources utiles

- Documentation de l'API: [https://dummyjson.com/docs/posts](https://dummyjson.com/docs/posts)
- Documentation React Hooks: [https://fr.reactjs.org/docs/hooks-intro.html](https://fr.reactjs.org/docs/hooks-intro.html)
- Guide sur les hooks personnalisés: [https://fr.reactjs.org/docs/hooks-custom.html](https://fr.reactjs.org/docs/hooks-custom.html)

## Rendu

- Ajoutez l'URL de votre dépôt Github dans **Classroom** et envoyez la réponse dès le démarrage de votre projet.
- Les push doivent se faire au fur et à mesure que vous avancez dans votre projet.
- Le README.md doit être à jour avec vos réponses et captures d'écran.
- Chaque exercice doit faire l'objet d'au moins un commit avec un message mentionnant le numéro de l'exercice.

---

# Documentation de l'API dummyjson - Posts

Pour réaliser ce TP, vous utiliserez l'API dummyjson.com qui fournit des données fictives de posts de blog. Voici les points d'entrée que vous utiliserez :

## Points d'entrée API

### Récupérer tous les posts
```
GET https://dummyjson.com/posts
```

Paramètres de requête optionnels :
- `limit` : nombre de posts à récupérer (défaut: 30)
- `skip` : nombre de posts à sauter (pour la pagination)

Exemple : `https://dummyjson.com/posts?limit=10&skip=10`

### Récupérer un post spécifique
```
GET https://dummyjson.com/posts/{id}
```

Exemple : `https://dummyjson.com/posts/1`

### Rechercher des posts
```
GET https://dummyjson.com/posts/search?q={terme}
```

Exemple : `https://dummyjson.com/posts/search?q=love`

### Récupérer les posts par tag
```
GET https://dummyjson.com/posts/tag/{tag}
```

Exemple : `https://dummyjson.com/posts/tag/history`

## Format de réponse

### Liste de posts

```json
{
  "posts": [
    {
      "id": 1,
      "title": "His mother had always taught him",
      "body": "His mother had always taught him not to ever think of himself as better than others. He'd tried to live by this motto. He never looked down on those who were less fortunate or whose decisions had led them astray.",
      "userId": 9,
      "tags": ["history", "american", "crime"],
      "reactions": 2
    },
    ...
  ],
  "total": 150,
  "skip": 0,
  "limit": 30
}
```

### Post unique

```json
{
  "id": 1,
  "title": "His mother had always taught him",
  "body": "His mother had always taught him not to ever think of himself as better than others. He'd tried to live by this motto. He never looked down on those who were less fortunate or whose decisions had led them astray.",
  "userId": 9,
  "tags": ["history", "american", "crime"],
  "reactions": 2
}
```

## Conseils d'utilisation

- Pour la pagination, utilisez les paramètres `limit` et `skip`
- Pour calculer le nombre total de pages, utilisez la formule : `Math.ceil(total / limit)`
- Pour implémenter le défilement infini, chargez plus de posts quand l'utilisateur atteint le bas de la page
- Pour la recherche, utilisez le point d'entrée `/posts/search` avec le paramètre `q`
- Vous pouvez combiner les paramètres de recherche avec les paramètres de pagination
