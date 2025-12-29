import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  public async showLogin({ view, auth }: HttpContext) {
    return view.render('pages/auth/login', { auth })
  }

  public async handleLogin({ request, auth, session, response }: HttpContext) {
    const username = request.input('username')
    const password = request.input('password')

    // 1) Trouver l'utilisateur
    const user = await User.findBy('username', username)

    // 2) Si user inexistant → message
    if (!user) {
      session.flash('errors', { login: 'Nom d’utilisateur ou mot de passe incorrect.' })
      return response.redirect().back()
    }

    // 3) Vérifier le mot de passe avec la méthode fournie par withAuthFinder
    const isValidPassword = await User.verifyCredentials(username, password)
      .then(() => true)
      .catch(() => false)

    if (!isValidPassword) {
      session.flash('errors', { login: 'Nom d’utilisateur ou mot de passe incorrect.' })
      return response.redirect().back()
    }

    // 4) Login en session
    await auth.use('web').login(user)

    return response.redirect().toRoute('home')
  }

  public async handleLogout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('home')
  }

  public async showSignupForm({ view, auth }: HttpContext) {
    return view.render('pages/auth/signup', { auth })
  }

  public async handleSignup({ request, response }: HttpContext) {
    const data = request.only(['username', 'password'])

    await User.create({
      username: data.username,
      password: data.password,
      isAdmin: false,
    })

    return response.redirect().toRoute('auth.login')
  }
}
