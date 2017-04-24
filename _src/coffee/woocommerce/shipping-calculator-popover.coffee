module.exports = ()->
  popoverTitle = $('#shipping-calculator-head').html();
  popoverContent = $('#shipping-calculator-content').html();
  $('.shipping-calculator-button').popover({
    placement: 'top',
    html : true,
    trigger: 'manual'
    title: ()-> popoverTitle,
    content: ()-> popoverContent
  })
  $('#shipping-calculator-head').remove()
  $('#shipping-calculator-content').remove()

  popoverIsHidden = true
  $('.shipping-calculator-button').on('click', (e)->
    e.stopPropagation();
    if popoverIsHidden
      $('.shipping-calculator-button').popover('show')
      $('.popover').off('click').on('click', (e)->
        e.stopPropagation();
      )
      popoverIsHidden = false
  )
  $('html').on('click', (e)->
    $('.shipping-calculator-button').popover('hide')
    popoverIsHidden = true
  );
