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

  public async handleSignup({ request, response, session }: HttpContext) {
    const username = String(request.input('username') || '').trim()
    const password = String(request.input('password') || '')
    const passwordConfirm = String(request.input('passwordConfirm') || '')

    const errors: Record<string, string> = {}

    // Username
    if (!username) {
      errors.username = 'Le nom d’utilisateur est obligatoire.'
    } else if (username.length < 3 || username.length > 50) {
      errors.username = 'Le nom d’utilisateur doit contenir entre 3 et 50 caractères.'
    }

    // Password
    if (!password) {
      errors.password = 'Le mot de passe est obligatoire.'
    } else if (password.length < 4 || password.length > 100) {
      errors.password = 'Le mot de passe doit contenir entre 4 et 100 caractères.'
    }

    // Confirm
    if (!passwordConfirm) {
      errors.passwordConfirm = 'La confirmation du mot de passe est obligatoire.'
    } else if (passwordConfirm !== password) {
      errors.passwordConfirm = 'Les mots de passe ne correspondent pas.'
    }

    // Username unique (seulement si username déjà “valide”)
    if (!errors.username) {
      const existingUser = await User.findBy('username', username)
      if (existingUser) {
        errors.username = 'Ce nom d’utilisateur est déjà utilisé.'
      }
    }

    // Si erreurs → flash + back
    if (Object.keys(errors).length > 0) {
      session.flash('errors', errors)
      session.flash('input', { username }) // pour old('username')
      return response.redirect().back()
    }

    await User.create({
      username,
      password,
      isAdmin: false,
    })

    session.flash('success', 'Compte créé. Vous pouvez vous connecter.')
    return response.redirect().toRoute('auth.login')
  }
}
