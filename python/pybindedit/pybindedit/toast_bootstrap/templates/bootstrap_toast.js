function showToast(title, content){
    $("#toast-title").text(title);
    $(".toast-body").text(content);
    $('.toast').toast('show');
}