class Config {
  static ins = new Config()
  constructor() {
    return Config.ins
  }

  errorHandler?: (e: string | Error) => void
  registerErrorHandler(errorHandler: (e: string | Error) => void) {
    this.errorHandler = errorHandler
  }
}
export const config = Config.ins
