$.fn.in_viewport = function() {
    var viewport_top = $(window).scrollTop();
    var viewport_bottom = viewport_top + $(window).height();
    var top_of_element = $(this).offset().top;
    var bottom_of_element = $(this).outerHeight() + top_of_element;

    if (bottom_of_element > viewport_top && top_of_element < viewport_bottom) {
        return true;
    } else {
        return false;
    }
};