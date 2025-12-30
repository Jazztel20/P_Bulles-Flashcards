import Deck from '#models/deck'
import Flashcard from '#models/flashcard'
import { flashcardValidator, flashcardMessagesProvider } from '#validators/flashcard_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class FlashcardsController {
  /**
   * Display a list of resource
   */
  public async index({ params, view, auth, session, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.deckId)

    if (!auth.user!.isAdmin && deck.userId !== auth.user!.id) {
      session.flash('error', 'Accès interdit.')
      return response.redirect().toRoute('home')
    }

    await deck.load('flashcards')
    return view.render('pages/flashcards/index', { deck, auth })
  }

  public async create({ params, view, auth, session, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.deckId)

    if (!auth.user!.isAdmin && deck.userId !== auth.user!.id) {
      session.flash('error', 'Accès interdit.')
      return response.redirect().toRoute('home')
    }

    return view.render('pages/flashcards/create', { deck, auth })
  }

  /**
   * Handle form submission for the create action
   */
  public async store({ params, request, response, auth, session }: HttpContext) {
    const deck = await Deck.findOrFail(params.deckId)

    if (!auth.user!.isAdmin && deck.userId !== auth.user!.id) {
      session.flash('error', 'Accès interdit.')
      return response.redirect().toRoute('home')
    }

    const data = await request.validateUsing(flashcardValidator, {
      messagesProvider: flashcardMessagesProvider,
    })

    const lastCard = await Flashcard.query()
      .where('deck_id', deck.id)
      .orderBy('position', 'desc')
      .first()

    const nextPosition = (lastCard?.position || 0) + 1

    await Flashcard.create({
      deckId: deck.id,
      question: data.question,
      answer: data.answer,
      position: nextPosition,
    })

    return response.redirect().toRoute('flashcards.index', { deckId: deck.id })
  }

  /**
   * Edit individual record
   */

  public async edit({ params, view, auth, session, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.deckId)

    if (!auth.user!.isAdmin && deck.userId !== auth.user!.id) {
      session.flash('error', 'Accès interdit.')
      return response.redirect().toRoute('home')
    }

    const card = await deck.related('flashcards').query().where('id', params.id).firstOrFail()

    return view.render('pages/flashcards/edit', { deck, card, auth })
  }

  /**
   * Handle form submission for the edit action
   */
  public async update({ params, request, response, auth, session }: HttpContext) {
    const deck = await Deck.findOrFail(params.deckId)

    if (!auth.user!.isAdmin && deck.userId !== auth.user!.id) {
      session.flash('error', 'Accès interdit.')
      return response.redirect().toRoute('home')
    }

    const card = await Flashcard.query()
      .where('id', params.id)
      .andWhere('deck_id', deck.id)
      .firstOrFail()

    const data = await request.validateUsing(flashcardValidator, {
      messagesProvider: flashcardMessagesProvider,
    })

    card.question = data.question
    card.answer = data.answer
    await card.save()

    return response.redirect().toRoute('flashcards.index', { deckId: deck.id })
  }

  /**
   * Delete record
   */

  public async destroy({ params, response, auth, session }: HttpContext) {
    const deck = await Deck.findOrFail(params.deckId)

    if (!auth.user!.isAdmin && deck.userId !== auth.user!.id) {
      session.flash('error', 'Accès interdit.')
      return response.redirect().toRoute('home')
    }

    const card = await Flashcard.query()
      .where('id', params.id)
      .andWhere('deck_id', deck.id)
      .firstOrFail()

    await card.delete()

    return response.redirect().toRoute('flashcards.index', { deckId: deck.id })
  }
}
