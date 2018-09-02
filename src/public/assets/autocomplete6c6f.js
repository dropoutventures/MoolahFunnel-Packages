function addressAutoComplete(name){
    this.Form ={
        "input.widget-AddressForm-Address":['street_number','route'],
        "input.widget-AddressForm-Address2":[],
        "input.widget-AddressForm-City":['locality','administrative_area_level_3','postal_town','sublocality_level_1'],
        "select.widget-AddressForm-Country":['country'],
        "select.widget-AddressForm-Province":['administrative_area_level_1'],
        "input.widget-AddressForm-Zipcode":['postal_code']
    };
    this.componentForm = {
        route: 'short_name',
        street_number: 'long_name',
        locality: 'long_name',
        postal_town:'short_name',
        administrative_area_level_3: 'short_name',
        administrative_area_level_1: 'short_name',
        sublocality_level_1:'short_name',
        country: 'short_name',
        postal_code: 'short_name'
    };
    this.lang='en';
    this.prefix='div.'+name;
    this.placeholder=null;
    this.setting={
        type:"get",
        showlayer:false,
        headers:{
        Authorization: "Dfo 73b315a006534e1382f5ddfe239e3445"
        }
    };
    this.BasicURL="https://tplwebapi.azurewebsites.net/";
    var my=this;
    this.initial=function(){
        var obj=$("<div class='"+my.prefix+" widget-address-list hidden'><ul></ul></div>");
        $("body").append(obj);
        my.placeholder=obj.children("ul").css("list-style","none").css("padding","0px").css("margin","0px");
	  if($.Request.QueryString("auto")!="0"){
        $(my.prefix+" input.widget-AddressForm-Address").on("keyup",function(){
        var offset=$(this).offset();
        obj.css("position","absolute").css("z-index",9999)
            .css("background","#fff").css("border","1px solid #ccc").css("border-radius","3px")
            .css("width",$(this).outerWidth())
            .css("left",offset.left).css("top",offset.top+$(this).outerHeight());
        $.endPoint.BasicURL=my.BasicURL;
        var addr="";
        for(var key in my.Form){
            var k=key.split('-')[key.split('-').length-1];
            k=(k=="Address")?"address1"
            :(k=="Address2")?""
            :(k=="City")?""
            :(k=="Zipcode")?""
            :(k=="Province")?"":k.toLowerCase();
            if(k!=""){
            var v=$(my.prefix+" "+key).val();
            addr+=k+"="+v+"&";
            }
        }
        $.endPoint.Ajax("api/gauto?"+addr+"address2=&address3=&lang="+my.lang,my.setting,my.showAutoAddress);
        });
        $("body *").on("focus",function(e){
            if($(e.target)!= $(my.prefix+" input.widget-AddressForm-Address") 
            && $(e.target)!=my.placeholder
            && $(e.target)!=obj){
                my.hideAutoAddress();
            }
        });
	}
    };
    this.hideAutoAddress=function(){
        my.placeholder.parent().addClass("hidden");
        my.placeholder.empty();
    };
    this.showAutoAddress=function(data){
        var win=window.event||event;
        window.event.preventDefault();
        my.placeholder.empty();
        data.forEach(function(dt){
        var txt=dt.address;
        var txts=[],n=0,mts=dt.matcheds;
        for(var i=0;i< mts.length;i++){
            if(mts[i].offset>n){
            txts.push(txt.substring(n,mts[i].offset));
            }
            txts.push("<strong>"+txt.substr(mts[i].offset,mts[i].length)+"</strong>");
            n=mts[i].offset+mts[i].length;
        }
        if(n< txt.length){
            txts.push(txt.substr(n));
        }
        txt=txts.join("");
        var obj=$("<li></li>").html(txt);
        obj.css("cursor","pointer").css("border-radius","3px").css("padding","3px 12px")
            .css("margin","0px").data("placeid",dt.placeId)
            .on("mouseover",function(){$(this).css("background-color","#bababa");})
            .on("mouseout",function(){$(this).css("background-color","#fff");})
            .on("click",my.fillAddress);
        my.placeholder.append(obj.css("cursor","pointer"));
        my.placeholder.parent().removeClass("hidden");
        });
    };
    this.fillAddress=function(){
        var placeid=$(this).data("placeid");
        if(placeid!=undefined && placeid!=null){
        $.endPoint.BasicURL=my.BasicURL;
        $.endPoint.Ajax("api/gaddress?lang="+my.lang+"&placeid="+placeid,my.setting,my.fillAddressDetail);
        }
        my.hideAutoAddress();
    };
    this.fillAddressDetail=function(data){
        window.event.preventDefault();
        for (var item in my.Form) {
        $(my.prefix+" "+ item).val('');
        $(my.prefix+" "+ item).attr("disabled",false);
        var val="";
        for(var name in my.Form[item]){
            var vals=data.filter(function(a){
                return a.types.filter(function(b){
                    return b==my.Form[item][name];
                }).length>0;
            });
            if(vals.length > 0){
                var nval=vals[0][my.componentForm[my.Form[item][name]]];
                if(my.Form[item].length>1){
                    if(val.trim()!=nval){
                        val+=(val!=""?" ":"")+nval;
                    }
                }else{
                    val+=(val!=""?" ":"")+nval;
                }
            }
        }
        $(my.prefix+" "+ item).val(val).trigger("focus");
        }
    };
    this.initial();
    return this;
}