window.GFZohoCRMSettings = null;

(function ($) {
    GFZohoCRMSettings = function () {
        var self = this;

        this.init = function () {
            this.pageURL = gform_zohocrm_pluginsettings_strings.settings_url;

            this.bindDeauthorize();
            this.bindClearCache();
        }

        this.bindDeauthorize = function () {
            // De-Authorize Zoho CRM.
            $('#gform_zohocrm_deauth_button').on('click', function (e) {
                e.preventDefault();

                // Get button.
                var $button = $('#gform_zohocrm_deauth_button');

                // Confirm deletion.
                if (!confirm(gform_zohocrm_pluginsettings_strings.disconnect)) {
                    return false;
                }

                // Set disabled state.
                $button.attr('disabled', 'disabled');

                // De-Authorize.
                $.ajax( {
                    async:    false,
                    url:      ajaxurl,
                    dataType: 'json',
                    data:     {
                        action: 'gfzohocrm_deauthorize',
                        nonce:  gform_zohocrm_pluginsettings_strings.nonce_deauthorize
                    },
                    success:  function ( response ) {
                        if ( response.success ) {
                            window.location.href = self.pageURL;
                        } else {
                            alert( response.data.message );
                        }

                        $button.removeAttr( 'disabled' );
                    }
                } );

            });
        }

        this.bindClearCache = function() {
            $( '#gf_zohocrm_clear' ).on( 'click', function ( e ) {

                e.preventDefault();
                e.stopImmediatePropagation();

                var $button = $( this );
                $button.attr( 'disabled', true );

                $.ajax({
                    method: 'POST',
                    url: ajaxurl,
                    data: {
                        action: 'gfzohocrm_clear_cache',
                        nonce: gform_zohocrm_pluginsettings_strings.nonce_clear_cache,
                    },
                    success: function( response ) {
                        if ( 'last_clearance' in response.data ) {
                            jQuery('.success-alert-container').fadeIn();
                            $( '#last_cache_clearance .time' ).text( response.data.last_clearance );
                        }
                    },
                    error: function () {
                        jQuery('.error-alert-container').fadeIn();
                    },
                    complete: function () {
                        $button.attr( 'disabled', false );
                        setTimeout( function () { jQuery('.alert-container').fadeOut(); }, 10000 );
                    }
                });
            });
        };

        this.init();
    }

    $(document).ready(GFZohoCRMSettings);
})(jQuery);
