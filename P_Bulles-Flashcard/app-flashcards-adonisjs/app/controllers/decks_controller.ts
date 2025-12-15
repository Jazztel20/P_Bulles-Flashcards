import Deck from '#models/deck'
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
  async create({ view }: HttpContext) {
    return view.render('pages/decks/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'description'])

    await Deck.create({
      title: data.title,
      description: data.description ?? null,
      isPublished: false,
      // userId: null
    })

    return response.redirect('/')
  }

  /**
   * Show individual record
   */
  async show({}: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({}: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({}: HttpContext) {}
}
