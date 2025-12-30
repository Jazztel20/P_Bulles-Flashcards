import vine from '@vinejs/vine'
import { SimpleMessagesProvider } from '@vinejs/vine'

export const flashcardMessagesProvider = new SimpleMessagesProvider({
  'question.required': 'La question est obligatoire.',
  'question.minLength': 'La question est obligatoire.',
  'question.maxLength': 'La question ne peut pas dépasser 500 caractères.',

  'answer.required': 'La réponse est obligatoire.',
  'answer.minLength': 'La réponse est obligatoire.',
  'answer.maxLength': 'La réponse ne peut pas dépasser 500 caractères.',
})

export const flashcardValidator = vine.compile(
  vine.object({
    question: vine.string().trim().minLength(1).maxLength(500),
    answer: vine.string().trim().minLength(1).maxLength(500),
  })
)
