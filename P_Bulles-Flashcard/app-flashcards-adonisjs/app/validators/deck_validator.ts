import vine from '@vinejs/vine'

export const deckValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(100),
    description: vine.string().trim().maxLength(255).optional(),
  })
)
