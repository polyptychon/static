module.exports = (imageParentSelector)->
  $("body").append(require("./photoswipe-template.jade"))
  PhotoSwipe = require("photoswipe");
  PhotoSwipeUI_Default = require("photoswipe/dist/photoswipe-ui-default")
  options =
  	history: false
  	barsSize:
      top: 0
      bottom: 0
  	focus: true
  	showHideOpacity: true
  	bgOpacity: 1

  collectionItemImages = $(imageParentSelector)
  pswpElement = document.querySelectorAll('.pswp')[0];

  collectionItemImages.bind('click', (e)->
    e.preventDefault()
    images = []
    collectionItemImages.each((index)->
      img = $(this).find('img')
      img.data('index', index)
      image = {
        src: img.data('src')  || img.attr("src"),
    		w: img.data('width')  || img.attr('width'),
    		h: img.data('height') || img.attr('height')
      }
      images.push(image)
    )
    options.index = $(this).find('img').data('index') || $(this).index()
    options.getThumbBoundsFn = (index) =>
      thumbnail = collectionItemImages.eq(index).find('img')[0]
      pageYScroll = window.pageYOffset || document.documentElement.scrollTop
      rect = thumbnail.getBoundingClientRect()
      return {x:rect.left, y:rect.top + pageYScroll, w:rect.width}

    photoSwipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, images, options);
    photoSwipe.init();
  )
