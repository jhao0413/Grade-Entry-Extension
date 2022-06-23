$('.griddata-even').append("<div class='save' style='display:none'></div>");


$('.save').click(function () {
    console.log($(this).parent().find(`[name^='examGrade-'][name$='.score']`));
    $(this).parent().find(`[name^='examGrade-'][name$='.score']`).change()
}); 