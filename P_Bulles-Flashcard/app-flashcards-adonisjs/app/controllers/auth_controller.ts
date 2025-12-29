import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  public async showLogin({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  public async handleLogin({ request, auth, response, session }: HttpContext) {
    const { username, password } = request.only(['username', 'password'])

    try {
      const user = await User.verifyCredentials(username, password)
      await auth.use('web').login(user)

      return response.redirect().toRoute('decks.index')
    } catch {
      session.flash('error', 'Identifiants invalides')
      return response.redirect().back()
    }
  }

  public async handleLogout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('auth.login')
  }
}
