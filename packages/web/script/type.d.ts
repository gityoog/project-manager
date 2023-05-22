declare namespace Express {
  interface Request {
    _parsedUrl: {
      query: string
    }
  }
}