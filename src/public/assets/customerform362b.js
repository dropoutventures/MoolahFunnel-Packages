function customerForm(obj){
    this.form={};
    var form=this.form;
    function getPrevElement(input){
        try{
            //var ob = input.parentElement.previousElementSibling.getElementsByClassName("error-message");
            var ob = input.parentElement.getElementsByClassName("error-message");
                                if(input.className.indexOf("widget-CustomerInfor-Phone ")>-1){
		ob=input.parentElement.parentElement.getElementsByClassName("error-message");
                                }
            if(ob.length>0){
                if(hasClass(ob[0],"error-message"))return ob[0];
            }
        }catch(ex){}
        return null;
    };
    function addClass(object, className){
        if(object!=null && object!=undefined){
            if(object.className.split(' ').indexOf(className)==-1){
                object.className += " "+className;
            }
        }
    };
    function removeClass(object, className){
        if(object!=null && object!=undefined){
            if(object.className.split(' ').indexOf(className)>-1){
                object.className =object.className.replace(className,"");
            }
        }
    };
    function hasClass(object,className){
        if(object!=null && object!=undefined){
            return object.className.split(' ').indexOf(className)>-1;
        }
        return false;
    };
    this.initial=function(){
        var object = document.getElementById(obj);
        var objs = object.getElementsByTagName("input");
        for(var i = 0;i < objs.length;i++){
            //enter to tab
            objs[i].addEventListener("keypress",function(e) {
                var code = e.which || e.keyCode;
                addClass(getPrevElement(this), "hidden");
                removeClass(this,"input-error");
                if(code == 13){
                    e.preventDefault();
                    var tab = 0;
                    for(var n = 0;n < objs.length;n ++){
                        if(objs[n] == this) {
                            tab = n;
                            break;
                        }
                    }
                    obs[tab + 1].focus();
               }
            });
            function onchange(){
                addClass(getPrevElement(this), "hidden");
                removeClass(this,"input-error");
                if(this.attributes["required"] != undefined){
                    if(this.value != ""){
                        form[this.name]=this.value;
                    }else{
                        addClass(this,"input-error");
                        removeClass(getPrevElement(this),"hidden");
                    }
                }else{
                    if(!hasClass(this,"input-error")){
                        form[this.name]=this.value;
                    }
                }
            }
            objs[i].addEventListener("change", onchange);
            objs[i].addEventListener("blur", onchange);
        }
        //email field
        var objs = object.getElementsByClassName("widget-CustomerInfor-Email");
        if(objs.length > 0){
            function checkemail(){
                var sEmail = this.value.toString();
                if (sEmail.isEmail()) {
                    removeClass(this,"input-error");
                    addClass(getPrevElement(this),"hidden");
                } else {
                    addClass(this,"input-error");
                    removeClass(getPrevElement(this),"hidden");
                }
            }
            objs[0].addEventListener("change",checkemail);
            objs[0].addEventListener("blur",checkemail);
        }
        //tel
        var telInput =$("div#"+obj+" input#"+obj+"Phone"),
        errorMsg = telInput.parentsUntil(".widget-CustomerInfor-PhoneForm","div").parent().find(".error-message");
        // initialise plugin
        $(telInput).intlTelInput({
          utilsScript: "https://cdn-fkf.emwebsys-h03.com/common/sitelibrary/widget/intltelinput/jss/utils.js"
        });
        var reset = function() {
          $(telInput).removeClass("input-error");
          $(errorMsg).addClass("hidden");
        };
        // on blur: validate
        /*$(telInput).blur(function() {
          reset();
          if ($.trim($(telInput).val())) {
            if ($(telInput).intlTelInput("isValidNumber")) {
                form["Phone"]=$.trim($(telInput).val());
            } else {
                form["Phone"]="";
                $(telInput).addClass("input-error");
                $(errorMsg).removeClass("hidden");
            }
          }else{
                form["Phone"]="";
                $(telInput).addClass("input-error");
                $(errorMsg).removeClass("hidden");
          }
        });*/
        // on keyup / change flag: reset
        telInput.on("keyup change", reset);
    };
    this.checkForm=function(){
        var object = document.getElementById(obj);
        var objs = object.getElementsByTagName("input");
        for(var i = 0;i < objs.length;i++){
            form[objs[i].name]="";
            if(objs[i].attributes["required"] != undefined){
                if(objs[i].value != ""){
                    if(!hasClass(objs[i],"input-error")){
                        form[objs[i].name]=objs[i].value;
                    }
                }else{
                    addClass(objs[i],"input-error");
                    removeClass(getPrevElement(objs[i]),"hidden");
                }
            }else{
                if(!hasClass(objs[i],"input-error")){
                    form[objs[i].name]=objs[i].value;
                }
            }
        }
        var objs = object.getElementsByClassName("widget-CustomerInfor-Email");
        if(objs.length > 0){
            var sEmail = objs[0].value.toString();
            if (sEmail.isEmail()) {
                removeClass(objs[i],"input-error");
                addClass(getPrevElement(objs[i]),"hidden");
            } else {
                addClass(objs[i],"input-error");
                removeClass(getPrevElement(objs[i]),"hidden");
            }
        }
        /*var telInput =$("div#"+obj+" input#"+obj+"Phone"),
        errorMsg = telInput.parentsUntil(".widget-CustomerInfor-PhoneForm","div").parent().find(".error-message");
        $(telInput).removeClass("input-error");
        $(errorMsg).addClass("hidden");
        if ($.trim($(telInput).val())) {
            if ($(telInput).intlTelInput("isValidNumber")) {
                form["Phone"]=$.trim($(telInput).val())
            } else {
                form["Phone"]="";
                $(telInput).addClass("input-error");
                $(errorMsg).removeClass("hidden");
            }
        }else{
            form["Phone"]="";
            $(telInput).addClass("input-error");
            $(errorMsg).removeClass("hidden");
        }*/
    };
    this.initial();
    return this;
}