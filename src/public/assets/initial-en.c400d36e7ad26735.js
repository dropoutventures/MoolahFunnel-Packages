webform={
    domain:"https://sales-api.ecrm-prod-environment.p.azurewebsites.net/api/",
    webkey:"4ae95dab-93f1-417c-987a-6e6aeabda2da",
    upsells:[
        "485beb59-dbc2-4e81-a0ba-facc789229f1",
        "8861e629-fef4-40af-a68b-ff2e6e2e8ce8"
    ],
    Decline:"decline.html",
    Success:"confirm.html",
    ProductName:"Wireless Car Charger",
    CompanyName:"BlueSky Investments LLC",
    CompanyProduct:"EnergixCharge",
    CompanyWebsite:"www.energixcharge.com",
    CompanyFullWebsite:"https://www.energixcharge.com/en/index.html",
    SupportEmail:"support@energixcharge.com",
    Phone:"1 (201) 565-3003",
    CompanyAddress:"PORTAL DE LAS CUMBRES F-12 SAN JUAN, PR 00926", 
    ReturnAddress:"Product Returns Center c/o BlueSky, PO Box 692208 Orlando, FL 32869",
    GTMID:"GTM-PPHLLHL",
    CID:"D503FAF4-4E18-4062-AAB5-00D2D99416E4"
}
$.extend({
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
        }else if(document.location.href.indexOf("test.")>0 &&
                page.indexOf("dmca.com") == -1 &&
                page.indexOf("facebook.com") == -1 &&
                page.indexOf("twitter.com") == -1 && 
                page.indexOf("instagram.com") == -1){
            if(page.indexOf("://www.")>0){
                page = page.replace("://www.","://test.");
            }else if(page.indexOf("://")>0){
                page = page.replace("://","://test.");
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
	core: {
		initial: function(){
			$(".footer-number > a").attr("href","../../en/contact-us.html");
		},
	}
});

$(document).ready(function(){
	$.core.initial();
});