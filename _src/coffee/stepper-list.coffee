module.exports = (selector = 'form')->
  stepperList = $('.stepper-list')
  return if stepperList.length == 0

  $(selector).bind('validated.bs.validator', (e)->
    checkSelector = if stepperList.hasClass('stepper-tabs') then $(selector).find('.tab-pane.active') else $(selector)
    stepperList.find('.active').addClass('enabled')

    if checkSelector.find('.has-error').length > 0
      stepperList.find('.active').addClass('error')
      stepperList.find('[role="tab"]').addClass('disabled')
    else
      stepperList.find('.active').removeClass('error')
      stepperList.find('.active').next().find('[role="tab"]').removeClass('disabled')
      stepperList.find('.active, .enabled').find('[role="tab"]').removeClass('disabled')
  )

  stepperTabs = $('.stepper-tabs')

  return if stepperTabs.length == 0

  stepperTabs.find('[role="tab"]').on('show.bs.tab', (e) ->
    billingInputs = $('.woocommerce-billing-fields').find('input, select').not(':checkbox').not(':password')
    billingInputsValues = '';
    billingInputs.each(()->
      if $(this).is('select')
        billingInputsValues += "<div>#{$(this).find('option:selected').text()}</div>"
      else
        billingInputsValues += "<div>#{$(this).val()}</div>"
    )
    shippingInputs = $('.woocommerce-shipping-fields').find('input, select').not(':checkbox').not(':password')
    shippingInputsValues = '';
    shippingInputs.each(()->
      if $(this).is('select')
        shippingInputsValues += "<div>#{$(this).find('option:selected').text()}</div>"
      else
        shippingInputsValues += "<div>#{$(this).val()}</div>"
    )
    shippingInputsValues = billingInputsValues if $('#useShippingForm').length>0 && $('#useShippingForm').is(':checked')
    shippingInputsValues = billingInputsValues if $('#ship-to-different-address-checkbox').length>0 && !$('#ship-to-different-address-checkbox').is(':checked')

    $('#confirmBillingAddress').html(billingInputsValues)
    $('#confirmShippingAddress').html(shippingInputsValues)
  )

  stepperTabs.find('[role="tab"]').on('click.bs.tab.data-api', (e)->
    e.preventDefault()
    e.stopImmediatePropagation()
    $(selector).find('.tab-pane.active').validator({disable:false}).validator('update').validator('validate')
    if $(selector).find('.tab-pane.active').find('.has-error').length == 0
      $(this).tab('show')
      $(this).parent().addClass('enabled')
  )
  stepperTabs.parent().find('#termsConditions').bind('change', ()->
    $(selector).find('.tab-pane.active').validator({disable:false}).validator('update').validator('validate')
  )

  $('.tab-content').find('button[type="submit"]').bind('click', (e)->
    $(selector).find('.tab-pane.active').validator({disable:false}).validator('update').validator('validate')

    if stepperList.find('.active').next().length > 0
      e.preventDefault()

    if $(selector).find('.tab-pane.active').find('.has-error').length == 0

      stepperTabs.find('li.active').addClass('enabled')
      stepperTabs.find('li.active').next().addClass('enabled')

      $('.tab-pane.active').addClass('enabled')
      $('.tab-pane.active').removeClass('disabled')

      nextTab = stepperList.find('.active').next().find('[role="tab"]')

      if nextTab.length>0
        nextTab.removeClass('disabled')
        nextTab.tab('show')
  )
