require './jquery.blockUI'
throttle = require('lodash.throttle')
equal = require('deep-equal')

module.exports = ()->
  return if not wc_checkout_params?.update_order_review_nonce?
  getData= ()->
    country		  = $( '#billing_country' ).val()
    state			  = $( '#billing_state' ).val()
    postcode	  = $( 'input#billing_postcode' ).val()
    city			  = $( '#billing_city' ).val()
    address		  = $( 'input#billing_address_1' ).val()
    address_2   = $( 'input#billing_address_2' ).val()
    s_country		= country
    s_state			= state
    s_postcode	= postcode
    s_city			= city
    s_address		= address
    s_address_2 = address_2

    if ( $( '#ship-to-different-address-checkbox' ).is( ':checked' ) )
      s_country		= $( '#shipping_country' ).val()
      s_state			= $( '#shipping_state' ).val()
      s_postcode	= $( 'input#shipping_postcode' ).val()
      s_city			= $( '#shipping_city' ).val()
      s_address		= $( 'input#shipping_address_1' ).val()
      s_address_2	= $( 'input#shipping_address_2' ).val()

    data = {
      security:				if wc_checkout_params?.update_order_review_nonce? then wc_checkout_params.update_order_review_nonce else null,
      payment_method: $( 'input[name="payment_method"]:checked' ).val()
      country:				country,
      state:					state,
      postcode:				postcode,
      city:						city,
      address:				address,
      address_2:			address_2,
      s_country:			s_country,
      s_state:				s_state,
      s_postcode:			s_postcode,
      s_city:					s_city,
      s_address:			s_address,
      s_address_2:		s_address_2,
      post_data:			$( 'form.checkout' ).serialize()
    };

  data = {}
  inputs = '#billing_country, #billing_state, input#billing_postcode, #billing_city, #ship-to-different-address-checkbox, #shipping_country, #shipping_state, input#shipping_postcode, #shipping_city'
  onInputChange = ()->
    return if (equal(data, getData()))
    $('form.checkout').block({
      message: null,
      overlayCSS: {
        background: '#fff',
        opacity: 0.6
      }
    });
    $('.stepper-list li').addClass('disabled')
    data = getData()
    $.ajax({
      type:		'POST',
      url:		wc_checkout_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'update_order_review' ),
      data:		data,
    }).then((data)->
      $('form.checkout').unblock()
      $('.stepper-list li').removeClass('disabled')
      if ( 'true' == data.reload )
        window.location.reload();
        return;
      $( '.woocommerce-NoticeGroup-updateOrderReview' ).remove();

      if ( data && data.fragments )
        if data.fragments['.woocommerce-checkout-review-order-table']
          orderTable = $(data.fragments['.woocommerce-checkout-review-order-table'])
          $('.sub-total > tbody').replaceWith(orderTable.find('.sub-total').html())

        $('form .tab-pane.active').validator({disable:false}).validator('update')

        $('.form-row').addClass('form-group')
    )

  $(inputs).on('change', throttle(onInputChange, 1000))
