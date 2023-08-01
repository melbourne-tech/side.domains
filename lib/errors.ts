export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'NotFoundError'
  }
}

export class ValidationError<T = any> extends Error {
  errors: any

  constructor(message: string, errors: any) {
    super(message)

    this.name = 'ValidationError'
    this.errors = errors
  }
}
