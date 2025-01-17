// caching routes 
const sensitiveCacheControl = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
  };


module.exports = {sensitiveCacheControl};