import Deck from '#models/deck'
import { deckValidator } from '#validators/deck_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class DecksController {
  /**
   * Display the list of the decks
   */
  public async index({ view, auth }: HttpContext) {
        const query = Deck.query().orderBy('title', 'asc')
        // Invité uniquement les decks publiés
        if (!auth.user) {
          query.where('is_publihed', true)
        }
        // User connecté non admin voit uniquement ses decks
        else if (!auth.user.isAdmin) {
          query.where('user_id', auth.user.id)
        }
        // User connecté admin voit tout
        const decks = await query
        return view.render('pages/home', { decks, auth})
  }

  public async create({ view, auth }: HttpContext) {
    return view.render('pages/decks/create', { auth })
  }

  /**
   * Handle form submission for the create action
   */
  public async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(deckValidator)

    await Deck.create({
      title: data.title,
      description: data.description ?? null,
      isPublished: false,
      userId: auth.user!.id,
    })

    return response.redirect('/')
  }

  /**
   * Show individual record
   */

  public async show({ params, view, auth }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    return view.render('pages/decks/show', { deck, auth })
  }

  public async edit({ params, view, auth }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    return view.render('pages/decks/edit', { deck, auth })
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

  public async publish({ params, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    deck.isPublished = true
    await deck.save()
    return response.redirect().toRoute('decks.index')
  }

  public async unpublish({ params, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    deck.isPublished = false
    await deck.save()
    return response.redirect().toRoute('decks.index')
  }

  public async play({ params, view, auth }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    await deck.load('flashcards')
    return view.render('pages/decks/play', { deck, auth })
  }
}
