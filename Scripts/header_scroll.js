// Send to top on refresh to avoid wacky animation, uncomment on bug discovery
window.onbeforeunload = function () {
    $(window).scrollTop(0);
}

// init some handy global vars
var target = document.getElementById('hello_world');
var scrolled = false;
var anim_playing = true;
var height, width;
var isMobile = false;

init();

// initialize some standard functions
function init () {
    height = $(window).height();
    width = $(window).width();
    if (width <= 1125) {
        isMobile = true;
    }
    cursor_blink();
    hello_world();
}

//Update height width on resize
$(window).resize(function () {
    height = $(window).height();
    width = $(window).width();
})

// make underscore blink to look like terminal cursor
function cursor_blink() {
    let visible = true;
    let underscore = document.getElementById('hello_underscore');
    window.setInterval(function() {
        if (visible === true) {
            underscore.className = 'hidden'
            visible = false;
        } else {
            underscore.className = ''
            visible = true;
        }
    }, 450)
}

// animate typing string to target
function hello_world() {
    let string = "Hello World...        I'm Kshitij";
    let color = "#2185C5";
    let letterCount = 0;
    anim_playing = true;
    scolled = false;
    target.setAttribute('style', 'color:' + color);
    if (isMobile === false) {
        setInterval(function () {
            if (anim_playing === false && scrolled === true) {
                letterCount = string.length + 1;
            }
            if (anim_playing === false && scrolled === false) {
                letterCount = string.length + 1;
            }
            if (anim_playing === true && scrolled === true) {
                scrolled = false;
                letterCount = 0;
            }
            if (letterCount < string.length + 1 && anim_playing === true) {
                target.innerHTML = string.substring(0, letterCount);
                setTimeout(function() {
                        letterCount ++;
                }, 700)
            }
        }, 100)
    }
    else {
        setInterval(function () {
            if (anim_playing === false && scrolled === true) {
                letterCount = string.length + 1;
            }
            if (anim_playing === false && scrolled === false) {
                letterCount = string.length + 1;
            }
            if (anim_playing === true && scrolled === true) {
                letterCount = string.length + 1;
            }
            if (letterCount < string.length + 1 && anim_playing === true) {
                target.innerHTML = string.substring(0, letterCount);
                setTimeout(function() {
                        letterCount ++;
                }, 700)
            }
        }, 100)
    }
}

// change CSS based on scroll position
$(window).scroll(function() {
    let position = $(this).scrollTop();
    let opacity_val = -1 * (((position - 0.8*height)/(height)) - 1);
    let new_op = opacity_val.toString()
    if (opacity_val >= 0 && position < 4 * height) {
        $('#gray_bg').css('opacity', new_op);
    } else {
        $('#gray_bg').css('opacity', '0');
    }
    if (position === 0 && scrolled === true) {
        if (anim_playing === false) {
            scrolled = false;
            anim_playing = true;
            hello_world();
        }
    }
    if (position > height) {
        $('.scroll_top_btn').fadeIn(300, function() {
            $('.scroll_top_btn').removeClass('displayNone');
        });
        if (anim_playing === false && isMobile === false) {
            scrolled = true;
            target.innerHTML = '';
        }
        if (anim_playing === true && isMobile === false) {
            scrolled = false;
            anim_playing = false;
            target.innerHTML = '';
        }
    }
    if (position < height) {
        $('.scroll_top_btn').fadeOut(300, function() {
            $('.scroll_top_btn').addClass("displayNone");
        });
    }
});

// Scroll to top with button
$('.scroll_top_btn').click(function () {
    $('body, html').animate({
        scrollTop: 0
    }, {
        duration: $(window).scrollTop()/1.5
    }, {
        easing: "easeout"
    });
})
