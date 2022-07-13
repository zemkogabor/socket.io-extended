module.exports = async (req, res, next) => {
  if (req.headers.apikey !== process.env.CLIENT_API_KEY) {
    res.statusCode = 401
    return res.json({ message: 'Unauthorized' })
  }

  return next()
}
