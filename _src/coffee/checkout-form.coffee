module.exports = ()->
  if $('#createaccount').length > 0
    if $('#createaccount').is(':checked')
      $('.create-account').find('input, select').removeAttr('disabled')
    else
      $('.create-account').find('input, select').attr('disabled','disabled')
      $('.create-account').find('.form-group').removeClass('has-error has-danger')

  $('#createaccount').bind('change', ()->
    if $(this).is(':checked')
      $('.create-account').find('input, select').removeAttr('disabled')
    else
      $('.create-account').find('input, select').attr('disabled','disabled')
      $('.create-account').find('.form-group').removeClass('has-error has-danger')
    $('form').validator('update')  
  )

  $('#useShippingForm').bind('change', ()->
    shippingFields = $('.shipping-fields')
    if $(this).is(':checked')
      shippingFields.attr('disabled', "disabled")
      shippingFields.find('input, select').attr('disabled','disabled');
      shippingFields.find('.form-group').removeClass('has-error has-danger');
    else
      shippingFields.removeAttr('disabled')
      shippingFields.find('input, select').removeAttr('disabled');
      # shippingFields.find('input, select')[0].focus()
    $('form').validator('update')
  )
  $('#ship-to-different-address-checkbox').bind('change', ()->
    shippingFields = $('.shipping-fields')
    if !$(this).is(':checked')
      shippingFields.attr('disabled', "disabled")
      shippingFields.find('input, select').attr('disabled','disabled');
      shippingFields.find('.form-group').removeClass('has-error has-danger');
    else
      shippingFields.removeAttr('disabled')
      shippingFields.find('input, select').removeAttr('disabled');
      # shippingFields.find('input, select')[0].focus()
    $('form').validator('update')
  )
  if $('fieldset').is(':disabled')
    $('fieldset').find('input, select').attr('disabled','disabled');
