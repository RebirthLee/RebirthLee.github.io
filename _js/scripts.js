window.jQuery = window.$ = require( "jquery" );
require( "velocity-animate/velocity.js" );
require( "lazysizes" );
require( "lazysizes/plugins/unveilhooks/ls.unveilhooks.js" );

// Jquery & Velocity JS included in GULP
$( document ).ready( function() {
    toggleMobileNav();
    ShowHideNav();
    formCheck();
    checkTabSelected();
} );

// Close modal if ESC is pressed
$( document ).keyup( function( e ) {
    e.keyCode === 27 ? removeModal() : null;
} );

$( window ).resize( function() {
    $( ".header" ).removeClass( "hide-nav" ); // Ensure nav will be shown on resize
    $( ".header__links" ).removeClass( "js--open" );
    $( ".header__toggle" ).removeClass( "--open");
    $( ".header__links" ).removeAttr( "style" ); // If mobile nav was collapsed, make sure it's show on DESK
    $( ".header__overlay" ).remove(); // Remove mobile navigation overlay in case it was opened
} );

function checkTabSelected() {
    var path = document.location.pathname.toLowerCase()
    const menus = $( ".header__link_a" )
    if (path[path.length - 1] === "/") {
        path = path.substring(0, path.length - 1)
    }
    for (var i = 0; i < menus.length; i++) {
        const item_a = $( menus[i] )
        var item_a_href = item_a.attr("href").toLowerCase()
        if (item_a_href[item_a_href.length - 1] === "/") {
            item_a_href = item_a_href.substring(0, item_a_href.length - 1)
        }
        if (path === item_a_href) {
            item_a.children().children().addClass("--select");
            break;
        }
    }
}

/*-------------------------------------------------------------------------*/
/* MOBILE NAVIGATION */
/* -----------------------------------------------------------------------*/

function toggleMobileNav() {
    $( ".header__toggle" ).click( function() {
      if ( !$( ".header__links" ).is( ".velocity-animating" ) ) {
        if ( $( ".header__links" ).hasClass( "js--open" ) ) {
            hideMobileNav();
        } else {
            openMobileNav();
        }
      }
    } );

    $( "body" ).on( "click", function( e ) {

      if ( e.target.classList.contains( "header__overlay" ) ) {
        hideMobileNav();
      }
    } );
}

function openMobileNav() {
    $( ".header__links" ).velocity( "slideDown", {
        duration: 300,
        easing: "ease-out",
        display: "block",
        visibility: "visible",
        begin: function() {
            $( ".header__toggle" ).addClass( "--open" );
            $( "body" ).append( "<div class='header__overlay'></div>" );
        },
        progress: function() {
            $( ".header__overlay" ).addClass( "--open" );
        },
        complete: function() {
            $( this ).addClass( "js--open" );
        }
    } );
}

function hideMobileNav() {
    $( ".header__overlay" ).remove();
    $( ".header__links" ).velocity( "slideUp", {
        duration: 300,
        easing: "ease-out",
        display: "none",
        visibility: "hidden",
        begin: function() {
            $( ".header__toggle" ).removeClass( "--open" );
        },
        progress: function() {
            $( ".header__overlay" ).removeClass( "--open" );
        },
        complete: function() {
            $( this ).removeClass( "js--open" );
            $( ".header__toggle, .header__overlay" ).removeClass( "--open" );
        }
    } );
}

/*-------------------------------------------------------------------------*/
/* SHOW/SCROLL NAVIGATION */
/* -----------------------------------------------------------------------*/

function FixNav(fix, header, nav) {
    if (fix) {
        if ( !header.hasClass( "fix-nav" ) ) {
            header.addClass( "fix-nav" );
        }

        if ( !nav.hasClass( "fix-nav" ) ) {
            nav.addClass( "fix-nav" );
        }
    } else {
        if ( header.hasClass( "fix-nav" ) ) {
            header.removeClass( "fix-nav" );
        }

        if ( nav.hasClass( "fix-nav" ) ) {
            nav.removeClass( "fix-nav" );
        }
    }
}

function ShowHideNav() {
    var previousScroll = 0, // previous scroll position
        $header = $( ".header" ), // just storing header in a variable
        $header_nav = $( ".header__links"),
        navHeight = $header.outerHeight(), // nav height
        detachPoint = 576 + 60, // after scroll past this nav will be hidden
        hideShowOffset = 6; // scroll value after which nav will be shown/hidden
        FixNav($( window ).scrollTop() != 0, $header, $header_nav);
    $( window ).scroll( function() {
        const fix = $( this ).scrollTop() != 0
        FixNav(fix, $header, $header_nav);
    } );
}

/*-------------------------------------------------------------------------*/
/* HANDLE MODAL */
/* -----------------------------------------------------------------------*/

function openModal() {
    $( "body" ).css( "overflow", "hidden" );
    $( ".modal, .modal__overlay" ).show().css( "display", "flex" );
    $( ".modal__inner" ).velocity( { translateY: 0, opacity: 1 } );
    $( ".modal__overlay" ).velocity( { opacity: 1 }, 100 );
}

function removeModal() {
    $( "body" ).css( { "overflow": "visible" } );
    $( ".modal, .modal__overlay, .modal__inner" ).velocity( { opacity: 0 }, function() {
        $( ".modal" ).css( { opacity: 1 } );
        $( ".modal__inner" ).css( {
            "-webkit-transform": "translateY(200px)",
            "-ms-transform": "translateY(200px)",
            transform: "translateY(200px)"
        } );
        $( ".modal, .modal__overlay" ).hide();
        $( ".modal__body" ).empty();
    } );
}

$( ".js-modal-close" ).click( function() {
    removeModal();
} );

$( ".modal__overlay" ).click( function() {
    removeModal();
} );

/*-------------------------------------------------------------------------*/
/* FORM VALIDATION */
/* -----------------------------------------------------------------------*/

function formCheck() {
    $( ".js-submit" ).click( function( e ) {

        e.preventDefault();

        var $inputs = $( ".form__input input" );
        var textarea = $( ".form__input textarea" );
        var isError = false;

        $( ".form__input" ).removeClass( "error" );
        $( ".error-data" ).remove();

        for ( var i = 0; i < $inputs.length; i++ ) {
            var input = $inputs[ i ];
            if ( $( input ).attr( "required", true ) && !validateRequired( $( input ).val() ) ) {

                addErrorData( $( input ), "This field is required" );

                isError = true;
            }
            if ( $( input ).attr( "required", true ) && $( input ).attr( "type" ) === "email" && !validateEmail( $( input ).val() ) ) {
                addErrorData( $( input ), "Email address is invalid" );
                isError = true;
            }
            if ( $( textarea ).attr( "required", true ) && !validateRequired( $( textarea ).val() ) ) {
                addErrorData( $( textarea ), "This field is required" );
                isError = true;
            }
        }
        if ( isError === false ) {
            $( "#contactForm" ).submit();
        }
    } );
}

// Validate if the input is not empty
function validateRequired( value ) {
    if ( value === "" ) {
      return false;
    }
    return true;
}

// Validate if the email is using correct format
function validateEmail( value ) {
    if ( value !== "" ) {
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test( value );
    }
    return true;
}

// Add error message to the input
function addErrorData( element, error ) {
    element.parent().addClass( "error" );
    element.after( "<span class='error-data'>" + error + "</span>" );
}


/*-------------------------------------------------------------------------*/
/* AJAX FORM SUBMIT
/* Formspree now only supports AJAX for Gold Users
/* https://github.com/formspree/formspree/pull/173
/* Uncomment if you want to use AJAX Form submission and you're a gold user
/* -----------------------------------------------------------------------*/

// $( "#contactForm" ).submit( function( e ) {

//     e.preventDefault();

//     var $btn = $( ".js-submit" ),
//         $inputs = $( ".form__input input" ),
//         $textarea = $( ".form__input textarea" ),
//         $name = $( "input#name" ).val(),
//         $url = $( "#contactForm" ).attr( "action" );

//     $.ajax( {

//         url: $url,
//         method: "POST",
//         data: $( this ).serialize(),
//         dataType: "json",

//         beforeSend: function() {
//             $btn.prop( "disabled", true );
//             $btn.text( "Sending..." );
//         },
//         // eslint-disable-next-line no-unused-vars
//         success: function( data ) {
//             $inputs.val( "" );
//             $textarea.val( "" );
//             $btn.prop( "disabled", false );
//             $btn.text( "Send" );
//             openModal();
//             $( ".modal__body" ).append(
//               "<h1>Thanks " +
//               $name +
//               "!</h1><p>Your message was successfully sent! Will get back to you soon.</p>"
//             );

//         },
//         error: function( err ) {
//             $( ".modal, .modal__overlay" ).addClass( "--show" );
//             $( ".modal__body" ).append(
//               "<h1>Aww snap!</h1><p>Something went wrong, please try again. Error message: </p>" +
//               err
//             );
//         }
//     } );
// } );
