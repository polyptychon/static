/*global wc_country_select_params */
var getAccText = require('../accText');

module.exports = function() {
	// wc_country_select_params is required to continue, ensure the object exists
	if ( typeof wc_country_select_params === 'undefined' ) {
		return false;
	}

	function getEnhancedSelectFormatString() {
		var formatString = {
			formatMatches: function( matches ) {
				if ( 1 === matches ) {
					return wc_country_select_params.i18n_matches_1;
				}

				return wc_country_select_params.i18n_matches_n.replace( '%qty%', matches );
			},
			formatNoMatches: function() {
				return wc_country_select_params.i18n_no_matches;
			},
			formatAjaxError: function() {
				return wc_country_select_params.i18n_ajax_error;
			},
			formatInputTooShort: function( input, min ) {
				var number = min - input.length;

				if ( 1 === number ) {
					return wc_country_select_params.i18n_input_too_short_1;
				}

				return wc_country_select_params.i18n_input_too_short_n.replace( '%qty%', number );
			},
			formatInputTooLong: function( input, max ) {
				var number = input.length - max;

				if ( 1 === number ) {
					return wc_country_select_params.i18n_input_too_long_1;
				}

				return wc_country_select_params.i18n_input_too_long_n.replace( '%qty%', number );
			},
			formatSelectionTooBig: function( limit ) {
				if ( 1 === limit ) {
					return wc_country_select_params.i18n_selection_too_long_1;
				}

				return wc_country_select_params.i18n_selection_too_long_n.replace( '%qty%', limit );
			},
			formatLoadMore: function() {
				return wc_country_select_params.i18n_load_more;
			},
			formatSearching: function() {
				return wc_country_select_params.i18n_searching;
			}
		};
		return formatString;
	}

	// Select2 Enhancement if it exists
	if ( $().select2 ) {
		var wc_country_select_select2 = function() {
			$( 'select.country_select:visible, select.state_select:visible' ).each( function() {
				var select2_args = $.extend({
					placeholderOption: 'first',
					width: '100%'
				}, getEnhancedSelectFormatString() );

				$( this ).select2( select2_args );
				$( '.select2-container' ).addClass('form-control');
			});
		};

		wc_country_select_select2();

		$( document.body ).bind( 'country_to_state_changed', function() {
			wc_country_select_select2();
		});
	}

	/* State/Country select boxes */
	var states_json = wc_country_select_params.countries.replace( /&quot;/g, '"' ),
		states = $.parseJSON( states_json );

	$( document.body ).on( 'change', 'select.country_to_state, input.country_to_state', function() {
		// Grab wrapping element to target only stateboxes in same 'group'
		var $wrapper    = $( this ).closest('.woocommerce-billing-fields, .woocommerce-shipping-fields, .woocommerce-shipping-calculator');

		if ( ! $wrapper.length ) {
			$wrapper = $( this ).closest('.form-row').parent();
		}

		var country     = $( this ).val(),
			$statebox   = $wrapper.find( '#billing_state, #shipping_state, #calc_shipping_state' ),
			$parent     = $statebox.parent(),
			input_name  = $statebox.attr( 'name' ),
			input_id    = $statebox.attr( 'id' ),
			value       = $statebox.val(),
			placeholder = $statebox.attr( 'placeholder' ) || $statebox.attr( 'data-placeholder' ) || '';

		if ( states[ country ] ) {
			if ( $.isEmptyObject( states[ country ] ) ) {

				$statebox.parent().hide().find( '.select2-container' ).remove();
				$statebox.replaceWith( '<input type="hidden" class="hidden" name="' + input_name + '" id="' + input_id + '" value="" placeholder="' + placeholder + '" />' );

				$( document.body ).trigger( 'country_to_state_changed', [ country, $wrapper ] );

			} else {

				var options = '',
					state = states[ country ];

				for( var index in state ) {
					if ( state.hasOwnProperty( index ) ) {
						options = options + '<option value="' + index + '">' + getAccText(state[ index ]) + '</option>';
					}
				}

				$statebox.parent().show();

				if ( $statebox.is( 'input' ) ) {
					// Change for select
					if ($statebox.parent().hasClass('input-group')) {
						$statebox.replaceWith( '<select required name="' + input_name + '" id="' + input_id + '" class="state_select form-control" data-placeholder="' + placeholder + '"></select>' );
					} else {
						$statebox.replaceWith( '<div class="input-group"><select required name="' + input_name + '" id="' + input_id + '" class="state_select form-control" data-placeholder="' + placeholder + '"></select><div class="help-block with-errors"></div></div>' );
					}

					$statebox = $wrapper.find( '#billing_state, #shipping_state, #calc_shipping_state' );
				}

				$statebox.html( '<option value="">' + getAccText(wc_country_select_params.i18n_select_state_text) + '</option>' + options );
				$statebox.val( value ).change();

				$( document.body ).trigger( 'country_to_state_changed', [country, $wrapper ] );

			}
		} else {
			if ( $statebox.is( 'select' ) ) {

				$parent.show().find( '.select2-container' ).remove();
				$statebox.replaceWith( '<input type="text" class="input-text form-control" name="' + input_name + '" id="' + input_id + '" placeholder="' + placeholder + '" />' );

				$( document.body ).trigger( 'country_to_state_changed', [country, $wrapper ] );

			} else if ( $statebox.is( 'input[type="hidden"]' ) ) {

				$parent.show().find( '.select2-container' ).remove();
				$statebox.replaceWith( '<input type="text" class="input-text form-control" name="' + input_name + '" id="' + input_id + '" placeholder="' + placeholder + '" />' );

				$( document.body ).trigger( 'country_to_state_changed', [country, $wrapper ] );

			}
		}

		$( document.body ).trigger( 'country_to_state_changing', [country, $wrapper ] );
		$( '.select2-container' ).addClass('form-control');
	});

	$(function() {
		$( ':input.country_to_state' ).change();
	});

}
