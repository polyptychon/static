module.exports = (affixMaxTop=100)->
  return if $('[data-spy="affix"]').length == 0
  require "bootstrap-sass/assets/javascripts/bootstrap/affix"
  affixMaxTop = $('[data-spy="affix"]').data('top') || affixMaxTop
  $('[data-spy="affix"]').css('top', "#{affixMaxTop}px")
  $('[data-spy="affix"]').width($('[data-spy="affix"]').width())

  bottom = $('body').height() - ($('[data-spy="affix"]').offset().top + $('[data-spy="affix"]').outerHeight())
  if $('[data-spy="affix"]').data('offset-bottom-target')
    target = $($('[data-spy="affix"]').data('offset-bottom-target'))
    if target.length>0
      if target.outerHeight()<$('[data-spy="affix"]').outerHeight()
        $('[data-spy="affix"]').css('position', 'relative')
        $('[data-spy="affix"]').css('top', '0px')
        $('[data-spy="affix"]').width('auto')
        return
      bottom = $('body').height() - (target.offset().top + target.outerHeight() - affixMaxTop)

  $(window).bind('resize', ()->
    if ($(window).width()<=990)
      $('[data-spy="affix"]').css('position', 'relative')
      $('[data-spy="affix"]').css('top', '0px')
      $('[data-spy="affix"]').width('auto')
  )
  $('[data-spy="affix"]').affix(offset: {
    top: $('[data-spy="affix"]').offset().top - affixMaxTop
    bottom: bottom || $('[data-spy="affix"]').data('offset-bottom') || 0
  })
  $('[data-spy="affix"]').bind('affix.bs.affix',
    ()->
      if ($(window).width()<=990)
        $(this).css('position', 'relative')
        $(this).css('top', '0px')
        $(this).width('auto')
      else
        $(this).css('top', "#{affixMaxTop}px")
        $(this).width($(this).width())
        $(this).css('position', 'fixed')
  )
  $('[data-spy="affix"]').bind('affix-top.bs.affix',
    ()->
      $(this).css('position', 'relative')
      $(this).css('top', '0px')
      $(this).width('auto')
  )
