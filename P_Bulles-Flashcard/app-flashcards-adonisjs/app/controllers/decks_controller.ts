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
    return view.render('pages/home', { decks, auth })
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

  public async show({ params, view, auth, session, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)

    if (!auth.user!.isAdmin && deck.userId !== auth.user!.id) {
      session.flash('error', 'Accès interdit.')
      return response.redirect().toRoute('home')
    }

    return view.render('pages/decks/show', { deck, auth })
  }

  public async edit({ params, view, auth, session, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)

    if (!auth.user!.isAdmin && deck.userId !== auth.user!.id) {
      session.flash('error', 'Accès interdit.')
      return response.redirect().toRoute('home')
    }

    return view.render('pages/decks/edit', { deck, auth })
  }

  /**
   * Handle form submission for the edit action
   */
  public async update({ params, request, response, auth, session }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)

    if (!auth.user!.isAdmin && deck.userId !== auth.user!.id) {
      session.flash('error', 'Accès interdit.')
      return response.redirect().toRoute('home')
    }

    const data = await request.validateUsing(deckValidator)

    deck.title = data.title
    deck.description = data.description ?? null
    await deck.save()

    return response.redirect().toRoute('home')
  }

  /**
   * Delete record
   */
  public async destroy({ params, response, auth, session }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)

    if (!auth.user!.isAdmin && deck.userId !== auth.user!.id) {
      session.flash('error', 'Accès interdit.')
      return response.redirect().toRoute('home')
    }

    await deck.delete()
    return response.redirect().toRoute('home')
  }

  public async publish({ params, response, auth, session }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)

    if (!auth.user!.isAdmin && deck.userId !== auth.user!.id) {
      session.flash('error', 'Accès interdit.')
      return response.redirect().toRoute('home')
    }

    const countResult = await deck.related('flashcards').query().count('* as total')
    const total = Number(countResult[0].$extras.total)

    if (total === 0) {
      session.flash('error', 'Impossible de publier un deck sans flashcards.')
      return response.redirect().toRoute('home')
    }

    deck.isPublished = true
    await deck.save()

    return response.redirect().toRoute('home')
  }

  public async unpublish({ params, response, auth, session }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)

    if (!auth.user!.isAdmin && deck.userId !== auth.user!.id) {
      session.flash('error', 'Accès interdit.')
      return response.redirect().toRoute('home')
    }

    deck.isPublished = false
    await deck.save()

    return response.redirect().toRoute('home')
  }

  public async play({ params, view, auth, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)

    if (!auth.user && !deck.isPublished) {
      return response.redirect().toRoute('home')
    }

    await deck.load('flashcards')
    return view.render('pages/decks/play', { deck, auth })
  }
}
