$.extend({
    Affiliate:{
        initial:function(){
            var form=$("form.affiliate-form");
            if($.Request.QueryString("thankyou")=="1"){
                form.addClass("hidden");
            }
            $("#retURL").val(document.location.toString()+(document.location.search.indexOf("?")>-1?"&":"?")+"thankyou=1");
            var objs=form.find("input[type=text],input[type=email],textarea");
            objs.change(function(){
                if($(this).prop("required")){
                    if($(this).val()!=null && $(this).val()!=""){
                        $(this).next().removeClass("show");
                    }
                }else{
                    $(this).next().removeClass("show");
                }
            });
            form.submit(function(e){
                b=true;
                objs.each(function(){
                    if($(this).prop("required")){
                        if($(this).val()==null || $(this).val()==""){
                            $(this).next().addClass("show");
                            b=false;
                        }
                    }
                });
                if(b){
                    return;
                }else{
                    e.preventDefault();
                    return false;
                }
            });
        }
    }
});
