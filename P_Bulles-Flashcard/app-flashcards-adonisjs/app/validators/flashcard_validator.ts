import vine from '@vinejs/vine'

export const flashcardValidator = vine.compile(
  vine.object({
    question: vine.string().trim().minLength(1).maxLength(500),
    answer: vine.string().trim().minLength(1).maxLength(500),
  })
)
