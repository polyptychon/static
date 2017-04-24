require "./highlight"
getQueryString = require "./getQueryString"

module.exports = () ->
  search = getQueryString('s')
  if search?
    $(".search-results").highlight(search)
    if search.length>1
      search.split(" ").forEach((searchWord)->
          $(".search-results").highlight(searchWord.trim())
      )
