String.prototype.Trim = function () {
    if (this === undefined) return "";
    if (this === null) return "";
    return this.trim();
};
String.prototype.formatString = function (format) {
    var value='';
    switch(format){
        case '0000-0000-0000-0000':
            var vls=[];
            for(var i=0;i<this.length;i += 4 ) {
                if(vls.length<4){
                    vls.push(this.substring(i,i+4));
                }
            }
            value = vls.join('-');
            break;
        case '0000':
            value = (this.length>4)?this.substring(0,4):this;
            break;
        case '00/00':
            var vls=[]
            for(var i=0;i<this.length;i += 2 ) {
                if(vls.length<2){
                    vls.push(this.substring(i,i+2));
                }
            }
            value = vls.join('/');
            break;
         case '0000-****-****-0000':
            var vls=[];
            for(var i=0;i<this.length;i += 4) {
                if(vls.length<4){
                    if(vls.length>0 && vls.length<3){
                        vls.push("****");
                    }else{
                        vls.push(this.substring(i,i+4));
                    }
                }
            }
            value = vls.join('-');
            break;
        default:
            value=this;
            break;
    }
    return value;
};
String.prototype.isEmail = function (){
    if(this.trim().length === 0 )return false;
    var filter = /^([\w-\.\+]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,8}|[0-9]{1,3})(\]?)$/;
    if (filter.test(this)) {
        return true;
    }
    else {
        return false;
    }
}
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(search, pos) {
		return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
	};
}
$.fn.extend({
    MaskNumber: function(formatString){
        $(this).keypress(function(e){
            var code=e.which || e.keyCode;
            var value= "";
            if ((code>47 && code<58) //number
                || code==8 || code==46 //del
                || (code>36 && code<41) //forword
                || (code>15 && code<19) //shift ctrl atl
                || code==9 || code==13 //tab enter
            )
            {
                value= $(this).val().toString().replace(/\-/g,'').replace(/\//g,'').substring(0,formatString.length);
            }
            else {
                return false;
            }
            $(this).val(value.formatString(formatString));
            if(value.length>=formatString.length)e.preventDefault();
            return true;
        }).keyup(function(e){
            var value= "";
            value= $(this).val().toString().replace(/\-/g,'').replace(/\//g,'').substring(0,formatString.length);
            $(this).val(value.formatString(formatString));
            return true;
        });
    }
});
function getData(obj,value){
    var rt=null;
    try{
        if(obj==undefined) rt = null;
    }catch(ex){
        rt = null;
    }
    rt = obj;
    if(rt==null)rt=(value!=undefined?value:null);
    return rt;
}
$.extend({
    completedLoading:true,
    page:{},
    Request:{
        QueryString: function (item) {
            var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
            var rt = svalue ? svalue[1] : svalue;
            return rt === null? "" : rt;
        }
    },
    endPoint:{
        BasicURL:typeof(webform)=="undefined"?'':webform.domain,
        WebFormID:typeof(webform)=="undefined"?'':webform.webkey,
        CID:typeof(webform)=="undefined"?'':webform.CID,
        _lay: 0,
        _layObj:null,
        _lastTime:new Date(),
        cacheData:[],
        loaderImage:"//cdn-fkf.emwebsys-h03.com/common/sitelibrary/base/images/load.gif",
        ShowLayer: function (image) {
            if ($.endPoint._layObj === null) {
                var div = $("<div></div>").attr("id","_layFullpage");
                var img = $("<img src='"+((image==undefined || image==null || image=="")?$.endPoint.loaderImage:image)+"' width='192' height='192' border='0'/>");
                div.append(img);
                $(document.body).append(div);
                $.endPoint._layObj = div;
            }
            $.endPoint._lay++;
        },
        ClearLay: function () {
            if ($.endPoint._lay > 0) {
                $.endPoint._lay--;
                if ($.endPoint._lay < 1) {
                    $.endPoint._layObj.remove();
                    $.endPoint._layObj = null;
                }
            }
        },
        Ajax: function (url, setting,callback) {
            var a=$.endPoint;
            a.CID=(a.CID==undefined)?"":a.CID;
            var set = {
                type: 'post',
                contentType: 'application/json; charset=utf-8',
                datatype: 'json',
                //crossDomain: true,
                beforeSend:function(xhr){
                    xhr.setRequestHeader("X_CID",a.CID);
                },
                success:function(data){
                    var callbackdata={URL:url,Data:data};
                    callback(data);
                },
                //xhrFields: {
                //    withCredentials: true
                //},
                complete: function (request, textStatus) {
                    if (setting.showlayer === undefined || setting.showlayer === true) {
                        a.ClearLay();
                    }
                }
            };
            set = $.extend({}, set, setting);
            //var key=$.Local.get("webFormId");
            //a.WebFormID=(key!=undefined && key!=null && key!="")?key:a.WebFormID;
            $.ajax(a.BasicURL + url.replace("{api}",a.WebFormID), set);
            a.BasicURL=typeof(webform)=="undefined"?'':webform.domain;
            if (setting.showlayer === undefined || setting.showlayer === true) {
                a.ShowLayer(setting.loadImg);
                a._lastTime=new Date();
            }
            setInterval(function(){
                var a=$.endPoint;
                var dt=new Date();
                if(parseInt((dt-a._lastTime))>30000){
                    if ($.endPoint._lay > 0) {
                        $.endPoint._lay=0;
                        $.endPoint._layObj.remove();
                        $.endPoint._layObj = null;
                    }
                }
            },100);
        }
    },
    JumpPage:function(pageName,data){
        var frm=$("<form target='_self' style='display:none;'></form>").attr("action",pageName);
        for(var key in data){
            var obj=$("<input type='hidden' name='"+key+"' value='"+data[key]+"' />");
            frm.append(obj);
        }
        $("body").append(frm);
        frm.submit();
    },
    RedirectPage:function(page,data,target){
        var strs=[];
        var qs=location.search.length>0?location.search.substr(1):"";
        var qc=(page.indexOf("?")>0)?page.substr(page.indexOf("?")+1):"";
		var qss=qs.split('&');
		var qds={};
		qss.forEach(function(dt){
			var key=dt.split('=')[0];
			var value='';
			try{
				value=dt.split('=')[1];
			}catch(ex){value='';}
			if(key!='')qds[key]=value;
		});
		var qcs=qc.split('&');
		qcs.forEach(function(dt){
			var key=dt.split('=')[0];
			var value='';
			try{
				value=dt.split('=')[1];
			}catch(ex){value='';}
			if(key!=''){
				if(qds[key]!=undefined){
					qds[key]=value;
				}else{
					qds[key]=value;
				}
			}
		});
		for(var key in data){
			if(key!=''){
				qds[key]=data[key];
			}
		}
		for(var key in qds){		
            strs.push(key+"="+qds[key]);
        }
        var str=strs.join("&");

        if(document.location.href.indexOf("test-anno")>0){
            var cp=document.location.href.split("/");
            var pg=page.split("/");
            if(page.substr(0,1)=="/"){
                page="/test-anno"+page;
            }else if(page.indexOf("://")>0){
                pg.splice(3,0,"test-anno");
                page=pg.join("/");
            }
        }

        if(page.indexOf("?")>0){
            page=page.substring(0,page.indexOf('?'))+(str!=""?('?'+str):"");
        }else{
            page=page+(str!=""?('?'+str):"");
        }
        if(target=="_blank"){
            window.open(page);
        }else{
            document.location=page;
        }
          return false;
    },
    convertHref:function(){
        if(document.location.host.split(":")[0].toLowerCase()!="auth.dfocms.com"){
            var objs=$("a");
            objs.each(function(){
                if($(this).attr("href") && $(this).attr("href").toString().startsWith("javascript")==false){
                    var url=$(this).attr("href");
                    $(this).attr("href","javascript:void(0)");
                    if(url!=""){
                        $(this).click(function(){
                            $.RedirectPage(url,{},$(this).attr("target"));
                            return false;
                        });
                    }
                }
            });
         }
    },
    makeit: function() {
        var client = new ClientJS();
        var bs64 = "";
        var ua = client.getBrowserData().ua;
        var canvasPrint = client.getCanvasPrint();
        var customFP = "&CustomFingerprint=" + client.getCustomFingerprint(ua, canvasPrint).toString();
        var str = "";
        var map = [
            {
                name: "SoftwareVersion",
                fn: "getSoftwareVersion"
            },
            {
                name: "Fingerprint",
                fn: "getFingerprint",
            },
            {
                name: "UserAgentLowerCase",
                fn: "getUserAgentLowerCase",
            },
            {
                name: "Browser",
                fn: "getBrowser",
            },
            {
                name: "BrowserVersion",
                fn: "getBrowserVersion",
            },
            {
                name: "Engine",
                fn: "getEngine",
            },
            {
                name: "OS",
                fn: "getOS",
            },
            {
                name: "OSVersion",
                fn: "getOSVersion",
            },
            {
                name: "Device",
                fn: "getDevice",
            },
            {
                name: "DeviceType",
                fn: "getDeviceType",
            },
            {
                name: "DeviceVendor",
                fn: "getDeviceVendor",
            },
            {
                name: "CPU",
                fn: "getCPU",
            },
            {
                name: "isMobile",
                fn: "isMobile",
            },
            {
                name: "isMobileMajor",
                fn: "isMobileMajor",
            },
            {
                name: "isMobileAndroid",
                fn: "isMobileAndroid",
            },
            {
                name: "isMobileOpera",
                fn: "isMobileOpera",
            },
            {
                name: "isMobileWindows",
                fn: "isMobileWindows",
            },
            {
                name: "isMobileBlackBerry",
                fn: "isMobileBlackBerry",
            },
            {
                name: "isMobileIOS",
                fn: "isMobileIOS",
            },
            {
                name: "isIphone",
                fn: "isIphone",
            },
            {
                name: "isIpad",
                fn: "isIpad",
            },
            {
                name: "isIpod",
                fn: "isIpod",
            },
            {
                name: "ScreenPrint",
                fn: "getScreenPrint",
            },
            {
                name: "ColorDepth",
                fn: "getColorDepth",
            },
            {
                name: "CurrentResolution",
                fn: "getCurrentResolution",
            },
            {
                name: "AvailableResolution",
                fn: "getAvailableResolution",
            },
            {
                name: "DeviceXDPI",
                fn: "getDeviceXDPI",
            },
            {
                name: "DeviceYDPI",
                fn: "getDeviceYDPI",
            },
            {
                name: "Plugins",
                fn: "getPlugins",
            },
            {
                name: "isJava",
                fn: "isJava",
            },
            {
                name: "JavaVersion",
                fn: "getJavaVersion",
            },
            {
                name: "isFlash",
                fn: "isFlash",
            },
            {
                name: "FlashVersion",
                fn: "getFlashVersion",
            },
            {
                name: "isSilverlight",
                fn: "isSilverlight",
            },
            {
                name: "SilverlightVersion",
                fn: "getSilverlightVersion",
            },
            {
                name: "isMimeTypes",
                fn: "isMimeTypes",
            },
            {
                name: "MimeTypes",
                fn: "getMimeTypes",
            },
            {
                name: "Fonts",
                fn: "getFonts",
            },
            {
                name: "isLocalStorage",
                fn: "isLocalStorage",
            },
            {
                name: "isSessionStorage",
                fn: "isSessionStorage",
            },
            {
                name: "isCookie",
                fn: "isCookie",
            },
            {
                name: "TimeZone",
                fn: "getTimeZone",
            },
            {
                name: "Language",
                fn: "getLanguage",
            },
            {
                name: "SystemLanguage",
                fn: "getSystemLanguage",
            },
            {
                name: "isCanvas",
                fn: "isCanvas",
            },
            // {
            //     name: "CanvasPrint",
            //     fn: "getCanvasPrint",
            // }
        ];
        for (var i = 0; i <= map.length - 1; i++) {
            var val = client[map[i].fn]();
            var name = map[i].name;
            if (val) {
                val = val.toString();
            } else {
                val = "n/a";
            }
            str = str + "&" + name + "=" + encodeURIComponent(val);
        }
        str = str + customFP;
        str = str.substring(1);
        try {
            bs64 = window.btoa(str);
        } catch (er) {
            console.log("bs64 errr");
        }
        var analytics = {
            referringUrl: document.referrer,
            landingUrl: window.location.href,
            userStringData64: bs64
        };
        //window.SITE.helpers.storage.set("analytics", analytics);
        return analytics;
    },
    Local:{
        set:function(key,value){
            try{
                window.localStorage.removeItem(key);
            }catch(ex){}
            window.localStorage.setItem(key,value);
        },
        get:function(key){
            return window.localStorage.getItem(key);
        },
        has:function(key){
            try{
                if($.Local.get(key)!=undefined && $.Local.get(key)!=null){
                    return true;
                }
            }catch(ex){}
            return false;
        }
    },
    registerNewSession:function(){
        $.get("https://emanage-prod-antifraud-api.azurewebsites.net/api/risk/kount/collectorConfig",function(data){
                $.Local.set("anti",JSON.stringify(data));
        });
    },
    registerSession:function(){
        if (!$.Local.has("anti")) {
            $.registerNewSession();
        }
    },
    dialog:function(set){
        setting={
            title:"",
            body:"",
            bodyClass:"",
            width:"380px",
            buttons:[]
                /*button1:{
                    text:"",
                    class:"",
                    func:function
                }*/
        }
        setting = $.extend({}, setting, set);
        var overlay=$("<div></div>").css("position","fixed").css("top","0px").css("left","0px").css("width","100%").css("height","100%").css("display","table").css("background-color","rgba(10,10,10,0.45)").css("z-index","10000").css("overflow","auto");
        var laybase=$("<div></div>").css("display","table-cell").css("width","100%").css("height","100%").css("text-align","center").css("vertical-align","middle");
        overlay.append(laybase);
        var laypanel=$("<div></div>").addClass("panel panel-default").css("width","80%").css("max-width",setting.width).css("margin","0px auto").css("text-align","left");
        laybase.append(laypanel);
        var laybody=$("<div></div>").addClass("panel-body").css("position","relative");
        laypanel.append(laybody);
        if(setting.title!=null && setting.title!=""){
            var header=$("<h4></h4>").text(setting.title);
            laybody.append(header);
        }
        if(setting.body!=null && setting.body!=""){
            var body=$("<div></div>").append($(setting.body));
            if(setting.bodyClass!=null && setting.bodyClass!=""){
                body.addClass(setting.bodyClass);
            }
            laybody.append(body);
        }
        var closeBtn=$("<span></span>").append("<i class='fa fa-close'></i>")
                    .css("position","absolute").css("top","12px").css("right","12px");
        closeBtn.click(function(){
           overlay.remove(); 
        });
        laybody.append(closeBtn);
        if(setting.buttons.length > 0 ){
            var laybtns=$("<div></div>").css("padding","6px 9px").css("text-align","center");
            laybody.append(laybtns);
            for(var i=0;i < setting.buttons.length;i++){
                var btn = $("<button></button>").append($(setting.buttons[i].text)).addClass("btn").css("margin","6px");
                if(setting.buttons[i].class!=undefined && setting.buttons[i].class!=null ){
                    btn.addClass(setting.buttons[i].class);
                }
                btn.click(setting.buttons[i].func);
                btn.click(function(){overlay.remove()});
                laybtns.append(btn);
            }
        }
        laybase.click(function(){overlay.remove();});
        $("body").append(overlay);
    },
    clearToken:function(data, obj){
        var objs=(obj==undefined)?$('body *'):obj.find("*");
        objs.each(function(){
            if($(this).children().length==0){
		if(this.tagName.toLowerCase()!='script' && this.tagName.toLowerCase()!='style'){
                $(this).html($(this).html().toString().replace(/\{price\}/g, data.price == undefined ? "" : data.price));
                $(this).html($(this).html().toString().replace(/\{productPrice\}/g, data.price == undefined ? "" : data.price));
                $(this).html($(this).html().toString().replace(/\{fullprice\}/g, data.fullprice == undefined ? "" : data.fullprice));
                $(this).html($(this).html().toString().replace(/\{discountrate\}/g, data.discountrate== undefined ? "" : data.discountrate));
                $(this).html($(this).html().toString().replace(/\{#/g, '<strong class="deleteword">').replace(/\#}/g, '</strong>'));
                $(this).html($(this).html().toString().replace(/\{!/g,'<strong class="important">').replace(/\!}/g,'</strong>'));    
                $(this).html($(this).html().toString().replace(/\{/g,'<strong>').replace(/\}/g,'</strong>'));
		}
            }
        });
    }
});
_initLayer=null;
function _initpage(){
	if(document.body==null){
		setTimeout(_initpage,10);
	}else{
		$.endPoint.ShowLayer();
		setTimeout(function(){
			_initLayer=setInterval(function(){
		        var a=$.endPoint;
                var dt=new Date();
              	if(parseInt((dt-a._lastTime))>2000){
	 				if ($.endPoint._lay > 0) {
                        $.endPoint._lay=0;
                        $.endPoint._layObj.remove();
                        $.endPoint._layObj = null;
                    }
				}
                if($.completedLoading){
                    $.endPoint._lay=0;
                    if($.endPoint._layObj!=null)$.endPoint._layObj.remove();
                    $.endPoint._layObj = null;
                    clearInterval(_initLayer);
                }
			},100);
		},1000);
	}
}
_initpage();