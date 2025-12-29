/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const DecksController = () => import('#controllers/decks_controller')

router.get('/', [DecksController, 'index']).as('decks.index')

router.get('/decks/create', [DecksController, 'create']).as('decks.create')
router.post('/decks', [DecksController, 'store']).as('decks.store')

router.get('/decks/:id', [DecksController, 'show']).as('decks.show')

router.get('/decks/:id/edit', [DecksController, 'edit']).as('decks.edit')
router.post('/decks/:id/update', [DecksController, 'update']).as('decks.updatePost')

router.post('/decks/:id/delete', [DecksController, 'destroy']).as('decks.destroyPost')



const FlashcardsController = () => import('#controllers/flashcards_controller')

router.get('/decks/:deckId/flashcards', [FlashcardsController, 'index']).as('flashcards.index')

router.get('/decks/:deckId/flashcards/create', [FlashcardsController, 'create']).as('flashcards.create')
router.post('/decks/:deckId/flashcards', [FlashcardsController, 'store']).as('flashcards.store')

router.get('/decks/:deckId/flashcards/:id/edit', [FlashcardsController, 'edit']).as('flashcards.edit')
router.put('/decks/:deckId/flashcards/:id', [FlashcardsController, 'update']).as('flashcards.update')

router.delete('/decks/:deckId/flashcards/:id', [FlashcardsController, 'destroy']).as('flashcards.destroy')