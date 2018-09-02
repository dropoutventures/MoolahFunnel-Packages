$.extend({
  popup:{
    layer:null,
    form:null,
    input:null,
    yesBtn:null,
    noBtn:null,
    displaypopup:true,
    settings:{
      query:'',
      delayregister:0, 
      delayshow:2000, 
      hideaftershow:true, 
      displayfreq: 'always', 
      persistcookie: 'ex_pop_shown', 
      fxclass: 'rubberBand', 
      mobileshowafter: 100000
    },
    isTouch:false,
    crossdeviceclickevent:"",
    animatedcssclasses: ["bounce","flash","pulse","rubberBand","shake","swing","tada",
                        "wobble","jello","bounceIn","bounceInDown","bounceInLeft",
                        "bounceInRight","bounceInUp","fadeIn","fadeInDown","fadeInDownBig",
                        "fadeInLeft","fadeInLeftBig","fadeInRight","fadeInRightBig",
                        "fadeInUp","fadeInUpBig","flipInX","flipInY","lightSpeedIn",
                        "rotateIn","rotateInDownLeft","rotateInDownRight","rotateInUpLeft",
                        "rotateInUpRight","slideInUp","slideInDown","slideInLeft",
                        "slideInRight","zoomIn","zoomInDown","zoomInLeft","zoomInRight",
                        "zoomInUp","rollIn"],
    initial:function(options){
      var a=$.popup;
      a.layer=$("div.ex_pop");
      //$(document.body).append(a.layer);
      a.form=$("div.ex_pop>div.ex_pop_form");
      a.input=$("div.ex_pop>div.ex_pop_form>div.ex_pop_input>input[type=text]");
      a.yesBtn=$("div.ex_pop>div.ex_pop_form>div.ex_pop_input>button.ex_pop_btn");
      a.noBtn=$("div.ex_pop>div.ex_pop_form>a.ex_pop_nothankyou");    
      a.isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
      a.crossdeviceclickevent = a.isTouch? 'touchstart' : 'click';
      var s = $.extend({}, a.settings, options);
      if (s.fxclass == 'random'){
        s.randomizefxclass = true;
      }
      a.settings = s;
      a.input.change(function(){
        $(this).next(".error-message").addClass("hidden");
      });
      a.yesBtn.click(a.accept);
      a.noBtn.click(a.hidepopup);
      setTimeout(function(){
        $(document).on('mouseleave.registerexit', function(e){
          a.detectexit(e);
        });
        $(document).on('mouseenter.registerenter', function(e){
          a.detectenter(e);
        });
      }, s.delayregister);
      if (s.mobileshowafter > 0){
        $(document).one('touchstart', function(){
          setTimeout(function(){
            a.showpopup();
          }, s.mobileshowafter);			
        });
      }
    },
    Request:{
      QueryString: function (item) {
        var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        var rt = svalue ? svalue[1] : svalue;
        return rt === null? "" : rt;
      }
    },
    detectexit: function(e){
      var a=$.popup;
      if( e.clientY < 60 ){
        a.delayshowtimer = setTimeout(function(){$.popup.showpopup();}, this.settings.delayshow);
      }
    },
    detectenter: function(e){
      var a=$.popup;
      if( e.clientY < 60 ){
        clearTimeout(a.delayshowtimer);
      }
    },
    showpopup: function(){
      var a=$.popup;
      if(a.Request.QueryString(a.settings.query.split('=')[0])==""){
        if (a.form != null && a.displaypopup == true){
          if (a.settings.randomizefxclass === true){
            a.settings.fxclass = a.animatedcssclasses[Math.floor(Math.random()*a.animatedcssclasses.length)];
          }
          $(document.body).append(a.layer);
          a.layer.addClass('open');
          a.form.addClass(a.settings.fxclass);
          a.displaypopup = false;
          if (a.settings.hideaftershow){
            $(document).off('mouseleave.registerexit');
          }
        }
      }
    },
    hidepopup: function(){
      var a=$.popup;
      a.layer.removeClass('open');
      a.form.removeClass(a.settings.fxclass);
      a.displaypopup = true;
    },
    accept:function(){
      var a=$.popup;
      if(a.input.length>0 && (a.input.val()==null || a.input.val()=="")){
        a.input.next(".error-message").removeClass("hidden");
        return false;
      }else{
        var url=document.location.href;
        var txt=a.input.val();
        var key=a.settings.query;
        var dt=(location.search.length>0?location.search.substr(1):"").split("&");
        var data={};
        if(txt!=undefined && txt!=null){
          key=key.rplace("{value}",txt);
          //url+=(url.indexOf('?')>0?"&":"?")+key.rplace("{value}",txt);
        //}else{
          //url+=(url.indexOf('?')>0?"&":"?")+key;
        }
        key.split("&").forEach(function(a){dt.push(a)});
        dt.forEach(function(dt){
          var key=dt.split('=')[0];
          var value='';
          try{
            value=dt.substr(key.length+1);
          }catch(ex){value='';}
          if(key!='')data[key]=value;
        });
        var str="";
        var strs=[];
        for(var key in data){
          if(key!=''){
            strs.push(key+"="+data[key]);
          }
        }
        var str="?"+strs.join("&");
        url=document.location.origin+document.location.pathname+str;
        var frm = $("<a style='display:none;' target='_self'>exitpopup</a>").attr("href", url);
        $("body").append(frm);
        setTimeout(function(){frm[0].click();},300);
        return false;
      }
    }
  }
});