import vine from '@vinejs/vine'

export const createDeckValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(100),
    description: vine.string().trim().maxLength(255).optional(),
  })
)

export const updateDeckValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(100),
    description: vine.string().trim().maxLength(255).optional(),
  })
)
