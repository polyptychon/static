module.exports = ()->
  $('[data-toggle="popover-extended"]').each(()->
    popoverTitle = $($(this).data('html-title')).html();
    popoverContent = $($(this).data('html-content')).html();
    $(this).popover({
      html : true,
      trigger: 'manual'
      title: ()-> popoverTitle,
      content: ()-> popoverContent
    })
    $($(this).data('html-title')).remove()
    $($(this).data('html-content')).remove()
  )

  popoverIsHidden = true
  $('[data-toggle="popover-extended"]').on('click', (e)->
    _this = $(this)
    e.stopPropagation();
    if popoverIsHidden
      _this.popover('show')
      $('.popover').off('click').on('click', (e)->
        e.stopPropagation();
      )
      popoverIsHidden = false
  )
  $('html').on('click', (e)->
    $('[data-toggle="popover-extended"]').popover('hide')
    popoverIsHidden = true
  );
