function addressForm(obj){
    this.form={};
    this.object=$("#"+obj);
    this.countryloaded=false;
    var form=this.form;
    var me=this;
    this.initial=function(){
        var object = $("#"+obj);
        var objs = object.find("input, select");
        objs.each(function(){
           //enter to tab
           $(this).focus(function(){
                $(this).parent().find(".error-message").addClass("hidden");
                $(this).removeClass("input-error");
           }).keypress(function(e){
                var code = e.which || e.keyCode;
                $(this).parent().find(".error-message").addClass("hidden");
                $(this).removeClass("input-error");
                if(code == 13){
                    e.preventDefault();
                    var n=objs.index(this);
                    objs.eq(n).focus();
               }               
           }).change(function(){
                $(this).parent().find(".error-message").addClass("hidden");
                $(this).removeClass("input-error");
                if($(this).attr("required")){
                    if($(this).val()!=null && $(this).val() != ""){
                        if(!$(this).hasClass("input-error")){
                            form[this.name]=this.value;
                        }
                    }else{
                        $(this).addClass("input-error");
                        $(this).parent().find(".error-message").removeClass("hidden");
                    }
                }else{
                    if(!$(this).hasClass("input-error")){
                        form[this.name]=this.value;
                    }
                }               
           });
        });
        //tel
        var telInput =$("div#"+obj+" input#"+obj+"Phone"),
        errorMsg = telInput.parentsUntil(".widget-AddressForm-Phone","div").parent().find(".error-message");
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
          form["Phone"]="";
          $(telInput).addClass("input-error");
          $(errorMsg).removeClass("hidden");
          if ($.trim($(telInput).val())) {
            if ($(telInput).intlTelInput("isValidNumber")) {
                form["Phone"]=$.trim($(telInput).val());
                $(telInput).removeClass("input-error");
                $(errorMsg).addClass("hidden");
            }
          }
        });*/
        // on keyup / change flag: reset
        telInput.on("keyup change", reset);
		$("#"+obj+" input.widget-AddressForm-Switch").click(function(){
			if($(this).prop("checked")){
				$("#"+obj+" div.widget-AddressForm-Title,#"+obj+ " div.widget-AddressForm-Container").addClass("hidden");
			}else{
				$("#"+obj+" div.widget-AddressForm-Title,#"+obj+ " div.widget-AddressForm-Container").removeClass("hidden");
			}
		});
		$("#"+obj+" input.widget-AddressForm-Switch-off[type='radio']").click(function(){
			if($(this).prop("checked")){
				$("#"+obj+" div.widget-AddressForm-Title,#"+obj+ " div.widget-AddressForm-Container").removeClass("hidden");
			}else{
				$("#"+obj+" div.widget-AddressForm-Title,#"+obj+ " div.widget-AddressForm-Container").addClass("hidden");
			}
		});

        function countriesSet(){
            var set={
                type:"get",
                showlayer:false
            };
            $.endPoint.Ajax("campaigns/{api}/countries",set, me.setCountry);
        }
	function setTelCountry(){
		try{
		if(me.countryloaded==true){
			var objs=me.object.find("select.widget-AddressForm-Country");
			telInput.intlTelInput("setCountry", objs.val());
		}else{
			setTimeout(this,500);
		}
		}catch(ex){}
	}
        countriesSet();
    };
    this.setCountry=function(data){
        var objs=me.object.find("select.widget-AddressForm-Country");
        objs.empty();
        me.object.find("select.widget-AddressForm-Province").empty().append("<option value=''>---</option>");
        if(Array.isArray(data)){
            $(data).each(function () {
                if (this.countryName !== undefined){
                    objs.append($('<option>', {
                        value: this.countryCode,
                        text: this.countryName
                    }));
                }
            });
            if(objs.data('value')!=undefined && objs.data('value')!=null){
                objs.val(objs.data('value'));
                me.provinceSet();
            }
            //me.countryloaded=true;
            objs.unbind("change").bind("change",me.provinceSet);
        }
        me.countryloaded=true;
    };
    this.provinceSet=function(){
        var cntrs=me.object.find("select.widget-AddressForm-Country");
        var cntr=cntrs.val();
        var objs=me.object.find("select.widget-AddressForm-Province");
        var set={
            type:"get",
                showlayer:false
        };
        var lng=($.lang.toLowerCase()=="da")?"DA":($.lang.toLowerCase()=="ja")?"JA":($.lang.toLowerCase()=="ko")?"ko":"";
        $.endPoint.Ajax("campaigns/{api}/countrystates?countryCode="+cntr+(lng!=""?("&languageCode="+lng):""),set,function(data){
            objs.empty();
            try{
                objs.append($('<option>',{value:"",text:"---"}));
                for(var key in data){
                    objs.append($('<option>',{value:key,text:data[key]}));
                }
            }catch(ex){}
        });
    };
    this.checkForm=function(){
        var object = $("#"+obj);
        var objs = object.find("input, select");
        objs.each(function(){
            if($(this).attr("required")){
                if($(this).val()!=null && $(this).val() != ""){
                    if(!$(this).hasClass("input-error")){
                        form[this.name]=this.value;
                    }
                }else{
                    $(this).addClass("input-error");
                    $(this).parent().find(".error-message").removeClass("hidden");
                }
            }else{
                if(!$(this).hasClass("input-error")){
                    form[this.name]=this.value;
                }
            }               
        });
        /*var telInput =$("div#"+obj+" input#"+obj+"Phone"),
        errorMsg = telInput.parentsUntil(".widget-AddressForm-Phone","div").parent().find(".error-message");
        form["Phone"]="";
        $(telInput).addClass("input-error");
        $(errorMsg).removeClass("hidden");
        if ($.trim($(telInput).val())) {
            if ($(telInput).intlTelInput("isValidNumber")) {
                form["Phone"]=$.trim($(telInput).val());
                $(telInput).removeClass("input-error");
                $(errorMsg).addClass("hidden");
            }
        }*/
    };
    this.initial();
    return this;
}