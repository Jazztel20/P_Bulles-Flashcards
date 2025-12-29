import Deck from '#models/deck'
import { deckValidator } from '#validators/deck_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class DecksController {
  /**
   * Display the list of the decks
   */
  public async index({ view }: HttpContext) {
    const decks = await Deck.query().orderBy('title', 'asc')
    return view.render('pages/home', { decks })
  }

  /**
   * Display form to create a new record
   */
  public async create({ view }: HttpContext) {
    return view.render('pages/decks/create')
  }

  /**
   * Handle form submission for the create action
   */
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(deckValidator)

    await Deck.create({
      title: data.title,
      description: data.description ?? null,
      isPublished: false,
    })

    return response.redirect('/')
  }

  /**
   * Show individual record
   */
  public async show({ params, view }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    return view.render('pages/decks/show', { deck })
  }

  /**
   * Edit individual record
   */
  public async edit({ params, view }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    return view.render('pages/decks/edit', { deck })
  }

  /**
   * Handle form submission for the edit action
   */
  public async update({ params, request, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    const data = await request.validateUsing(deckValidator)

    deck.title = data.title
    deck.description = data.description ?? null
    await deck.save()

    return response.redirect('/')
  }

  /**
   * Delete record
   */
  public async destroy({ params, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    await deck.delete()
    return response.redirect('/')
  }
}
