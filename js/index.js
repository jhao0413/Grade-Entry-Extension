$('.result-area').after('<div id="save" style="display:none"></div>');

$('#save').click(function () {
    $(`[name^='examGrade-'][name$='.score']`).change();
}); 