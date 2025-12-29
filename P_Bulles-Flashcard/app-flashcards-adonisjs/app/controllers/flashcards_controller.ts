import Deck from '#models/deck'
import Flashcard from '#models/flashcard'
import { flashcardValidator } from '#validators/flashcard_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class FlashcardsController {
  /**
   * Display a list of resource
   */
  public async index({ params, view, auth }: HttpContext) {
    const deck = await Deck.findOrFail(params.deckId)
    await deck.load('flashcards')
    return view.render('pages/flashcards/index', { deck, auth })
  }

  public async create({ params, view, auth }: HttpContext) {
    const deck = await Deck.findOrFail(params.deckId)
    return view.render('pages/flashcards/create', { deck, auth })
  }

  /**
   * Handle form submission for the create action
   */
  public async store({ params, request, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.deckId)
    const data = await request.validateUsing(flashcardValidator)

    // position auto (optionnel mais utile)
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

  public async edit({ params, view, auth }: HttpContext) {
    const deck = await Deck.findOrFail(params.deckId)

    const card = await deck.related('flashcards').query().where('id', params.id).firstOrFail()

    return view.render('pages/flashcards/edit', { deck, card, auth })
  }

  /**
   * Handle form submission for the edit action
   */
  public async update({ params, request, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.deckId)

    const card = await Flashcard.query()
      .where('id', params.id)
      .andWhere('deck_id', deck.id)
      .firstOrFail()

    const data = await request.validateUsing(flashcardValidator)

    card.question = data.question
    card.answer = data.answer
    await card.save()

    return response.redirect().toRoute('flashcards.index', { deckId: deck.id })
  }

  /**
   * Delete record
   */

  public async destroy({ params, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.deckId)

    const card = await Flashcard.query()
      .where('id', params.id)
      .andWhere('deck_id', deck.id)
      .firstOrFail()

    await card.delete()
    return response.redirect().toRoute('flashcards.index', { deckId: deck.id })
  }
}
