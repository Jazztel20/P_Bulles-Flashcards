import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const DecksController = () => import('#controllers/decks_controller')
const FlashcardsController = () => import('#controllers/flashcards_controller')
const AuthController = () => import('#controllers/auth_controller')

/**
 * PUBLIC
 * - visible sans connexion
 */

// Page d'accueil publique : (idéalement) montrer les decks publiés uniquement
router.get('/', [DecksController, 'index']).as('home')

// Jouer sur un deck (si cahier des charges = jeu accessible publiquement sur decks publiés)
router.get('/decks/:id/play', [DecksController, 'play']).as('decks.play')

/**
 * AUTH (guest)
 */
router
  .get('/signup', [AuthController, 'showSignupForm'])
  .as('auth.signup')
  .use(middleware.guest())

router
  .post('/signup', [AuthController, 'handleSignup'])
  .as('auth.handleSignup')
  .use(middleware.guest())

router
  .get('/login', [AuthController, 'showLogin'])
  .as('auth.login')
  .use(middleware.guest())

router
  .post('/login', [AuthController, 'handleLogin'])
  .as('auth.handleLogin')
  .use(middleware.guest())

/**
 * AUTH (auth)
 * - seulement si connecté
 */
router
  .post('/logout', [AuthController, 'handleLogout'])
  .as('auth.handleLogout')
  .use(middleware.auth())

/**
 * PRIVATE (auth) : CRUD Decks + publish/unpublish + CRUD flashcards
 */
router
  .group(() => {
    // Decks
    router.get('/decks/create', [DecksController, 'create']).as('decks.create')
    router.post('/decks', [DecksController, 'store']).as('decks.store')

    router.get('/decks/:id', [DecksController, 'show']).as('decks.show')

    router.get('/decks/:id/edit', [DecksController, 'edit']).as('decks.edit')
    router.post('/decks/:id/update', [DecksController, 'update']).as('decks.updatePost')

    router.post('/decks/:id/delete', [DecksController, 'destroy']).as('decks.destroyPost')

    // Publier / Dépublier
    router.post('/decks/:id/publish', [DecksController, 'publish']).as('decks.publish')
    router.post('/decks/:id/unpublish', [DecksController, 'unpublish']).as('decks.unpublish')

    // Flashcards
    router.get('/decks/:deckId/flashcards', [FlashcardsController, 'index']).as('flashcards.index')

    router
      .get('/decks/:deckId/flashcards/create', [FlashcardsController, 'create'])
      .as('flashcards.create')
    router.post('/decks/:deckId/flashcards', [FlashcardsController, 'store']).as('flashcards.store')

    router
      .get('/decks/:deckId/flashcards/:id/edit', [FlashcardsController, 'edit'])
      .as('flashcards.edit')
    router
      .post('/decks/:deckId/flashcards/:id/update', [FlashcardsController, 'update'])
      .as('flashcards.updatePost')

    router
      .post('/decks/:deckId/flashcards/:id/delete', [FlashcardsController, 'destroy'])
      .as('flashcards.destroyPost')
  })
  .use(middleware.auth())
