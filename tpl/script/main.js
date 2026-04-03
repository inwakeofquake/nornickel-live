$(document).ready(function(){
    $('.custom-select').each(function(){
        try {
            $(this).select2({
                placeholder: $(this).attr('placeholder'),
                closeOnSelect: $(this).parents('.filter').length ? false : true,
                allowClear: true,
                language: "ru"
            }).on('select2:select', function (e) {
                if($(this).parents('.filter').length) {
                    window.location.href = window.location.href.split('?')[0] + '?tag=' + $(this).val();
                }
            }).on('select2:close', function (e) {
                if($(this).parents('.filter').length && $(this).val() === '') {
                    window.location.href = window.location.href.split('?')[0];
                }
            });
        } catch(e) {
            console.log(e);
        }
    });
    
    // Сортировка и фильтрация
    $('.filter__btn a').click(function(e){
        e.preventDefault();
        
        let params = getUrlVars($(this).attr('href'));
        
        $('#filters select').each(function(){
            if($(this).val() !== '') {
                params[$(this).attr('name')] = $(this).val();
            }
        });
        
        window.location.href = window.location.href.split('?')[0] + '?' + $.param(params);
        
        return false;
    });
    
    // Голосование с ипользованием cookie
    $('.add-vote-cookie').click(function(e){
        e.preventDefault();
        
        if($(this).hasClass('locked')) {
            return false;
        }
        
        try {
            let $elem = $(this);
            let url = $(this).attr('href').split('?')[0];
            let data = $(this).attr('href').indexOf('?') !== -1 ? getUrlVars($(this).attr('href').split('?')[1]) : {};
            
            $elem.addClass('locked').css('pointer-events', 'none');
            
            $.post(url, data, function(result){
                if(typeof result.success !== 'undefined' && result.success === true) {
                    $elem.addClass('active');
                
                    if(typeof result.votes !== 'undefined') {
                        $elem.parent().siblings('.table__item-num').text(result.votes);
                    } else {
                        let val = $elem.parent().siblings('.table__item-num').text();
                            val = !isNaN(parseInt(val)) ? (parseInt(val) + 1)  : 1;
                            $elem.parent().siblings('.table__item-num').text(val);
                    }
                }
            }).always(function(){
                $elem.removeClass('locked')
            });
        } catch (e) {
            console.log(e);
        }
        
        return false;
    });
    
    // Голосование
    $('.add-vote').click(function(e){
        e.preventDefault();
        
        if($(this).hasClass('locked')) {
            return false;
        }
        
        try {
            let $elem = $(this);
            let url = $(this).attr('href').split('?')[0];
            let data = $(this).attr('href').indexOf('?') !== -1 ? getUrlVars($(this).attr('href').split('?')[1]) : {};
            
            $elem.addClass('locked').css('pointer-events', 'none');
            
            $.post(url, data, function(result){
                if(typeof result.success !== 'undefined' && result.success === true) {
                    $elem.css('pointer-events', 'none').addClass('active');
                    
                    if(typeof result.votes !== 'undefined') {
                        $elem.parent().siblings('.table__item-num').text(result.votes);
                    } else {
                        let val = $elem.parent().siblings('.table__item-num').text();
                            val = !isNaN(parseInt(val)) ? (parseInt(val) + 1)  : 1;
                            $elem.parent().siblings('.table__item-num').text(val);
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }
        
        return false;
    });
    
    // Форма регистрации
    $(".form__btn").on("click", function(e) {
        e.preventDefault();
        $(".form__btn").addClass("form__btn--none");
        $(".form__hidden").addClass("form__hidden--active");
    });
    
    $('[name="anonimus"]').on("change", function(e) {
        e.preventDefault();
        $(this).val() === "1" ? $(".form__hidden").addClass("form__hidden--active") : $(".form__hidden").removeClass("form__hidden--active");
    });
    
    // Форма регистрации
    $('#registration-form').on('submit', function(e){
        e.preventDefault();
        let $form = $(this);
        let data = getFormData($(this));
        
        $('#registration-form-error').text('');
        $form.find('.error').text('');
        
        data[$(this).find(':submit').attr('name')] = 1;
        
        $.post($(this).attr('action'), data, function(data){
            if(typeof data.success === 'undefined') {
                $('#registration-form-error').text('Произошла ошибка, повторите попытку');
            }
            
            if(typeof data.message !== 'undefined' && data.success === false) {
                $('#registration-form-error').text('Форма содержит ошибки');
            }
            
            if(typeof data.errors === 'object') {
                $.each(data.errors, function(index, value) {
                    $form.find('[name="' + index + '"]').parent().find('.error').text(value);
                });
            }
            
            if(data.success === true) {
                $('[data-fancybox-close]').click();
                try {
                    $.fancybox.open({
                        src: '#popup-registration-success'
                    });
                } catch(e) {
                    console.log(e);
                }
            }
        }).fail(function(){
            $('#registration-form-error').text('Произошла ошибка, повторите попытку');
        });
        
        return false;
    });
    
    try {
        // https://github.com/jedfoster/Readmore.js
        $('.table__item-text').readmore({
            moreLink: '<a href="#">... Читать далее</a>',
            lessLink: '<a href="#">Скрыть текст</a>'
        });
    } catch(e) {
        console.log(e);
    }
    
    
    // Прокрутка для фильтров
    let h_header = $('.header').height();
    if($('#filters').length && window.location.href.indexOf('?') !== -1) {
        if($(window).width() < 1024) {
            setTimeout(function(){
                $(window).scrollTop($('#filters').offset().top);
            }, 100);
        }
    }
    
    if($(window).width() > 1024) {
        // Верхнее меню
        let mt_header = !isNaN(parseInt($('.header').css('margin-top'))) ? parseInt($('.header').css('margin-top')) : 0;
        let $header_next = $('.header').next();
        let header_next_top = $header_next.length ? $header_next.offset().top : 0;
        
        $(window).scrollTop() > mt_header ? $('.header').addClass('fixed') : $('header.header').removeClass('fixed');
        $(window).scrollTop() > mt_header ? $header_next.css('margin-top', header_next_top) : $header_next.css('margin-top', 0);
        
        $(window).scroll(function(e){
            $(window).scrollTop() > mt_header ? $('.header').addClass('fixed') : $('header.header').removeClass('fixed');
            $(window).scrollTop() > mt_header ? $header_next.css('margin-top', header_next_top) : $header_next.css('margin-top', 0);
        });
    }
    
    try {
        const swiperVideo = new Swiper('.swiperVideo', {
          // Optional parameters
          direction: 'horizontal',
          loop: true,
             slidesPerView: 3,
        
              spaceBetween: 10,
          // Navigation arrows
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
           breakpoints: {
            // mobile + tablet - 320-990
            220: {
              slidesPerView: 1
            },
            520: {
              slidesPerView: 2
            },
            // desktop >= 991
            991: {
              slidesPerView: 3
            }
          }
        
         
        });
    } catch(e) {
        console.log(e);
    }
});

// Прокрутка окна при нажатии на якорь
$(document).on('click', 'a[href^="#"]', function(e){
    let $target = $($(this).attr('href'));
    
    if($target.length) {
        e.preventDefault();
        
        let hh = $(window).width() > 1024 && $('.header').length ? $('.header').height() : 0;
        
        try {
            $('html, body').animate({ scrollTop: $target.offset().top - hh}, 1000);
        } catch(e) {
            console.log(e);
        }
        
        return false;
    }
});

// Отправка форм
$(document).on('af_complete', function(event, response) {
    var form = response.form;
    
    // Если у формы определённый id
    if (typeof response.success !== 'undefined' && response.success === true) {
        $('[data-fancybox-close]').click();

        form.find('select').val('').change();
        form.find('.error_place').html('');

        if(form.attr('id') === 'form_question') {
            try {
                $.fancybox.open({
                    src: '#popup-question-success'
                });
            } catch(e) {
                console.log(e);
            }
        } else if (form.attr('id') === 'answer-form') {
            try {
                $.fancybox.open({
                    src: '#popup-success-answer'
                });

                setTimeout(function(){
                    window.location.reload();
                }, 1500);
            } catch(e) {
                console.log(e);
            }
        } else {
            try {
                $('#popup-success .popup-title').html(typeof response.message !== 'undefined' && response.message !== '' ? response.message : 'Форма отправлена');

                $.fancybox.open({
                    src: '#popup-success'
                });
            } catch(e) {
                console.log(e);
            }
        }
    } else {
        if(typeof response.data === 'object') {
            $.each(response.data, function(index, value) {
                form.find('[name="' + index + '"]').parent().find('.error_place').html(value);
            });
        }
    }
});

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function getUrlVars(url) {
    var hash;
    var myJson = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0]] = hash[1];
        // If you want to get in native datatypes
        // myJson[hash[0]] = JSON.parse(hash[1]); 
    }
    return myJson;
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

$(function() {
	var marquee = $("#marquee"); 
	marquee.css({"overflow": "hidden", "width": "100%"});
	marquee.wrapInner("<span>");
	marquee.find("span").css({ "width": "50%", "display": "inline-block", "text-align":"center" }); 
	marquee.append(marquee.find("span").clone());
	marquee.wrapInner("<div>");
	marquee.find("div").css("width", "200%");
	var reset = function() {
		$(this).css("margin-left", "0%");
		$(this).animate({ "margin-left": "-100%" }, 12000, 'linear', reset);
	};
	reset.call(marquee.find("div"));
});

function setEqualHeight($this)
{
    $this.each(function(){
        let tallestcolumn = 0;
        let columns = $(this).children();
        columns.each(function(){
            currentHeight = $(this).outerHeight();
            if(currentHeight > tallestcolumn) {
                tallestcolumn = currentHeight;
            }
        });
        columns.outerHeight(tallestcolumn);
    });
}

try {
    setEqualHeight($(".prime__bottom-info"));
} catch(e) {
    console.log(e);
}





















































































