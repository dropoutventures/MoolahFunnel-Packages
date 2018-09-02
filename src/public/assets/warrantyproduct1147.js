function warrantyProduct(obj){
    this.form={};
    this.rate=[0.1,0.2,0.2,0.2,0.2,0.3,0.5,0.15,0.25,0.35,0.4,0.45,0.55,0.6];
    this.object=$("#"+obj);
    this.FID=0;
    var form=this.form;
    var me=this;
    this.initial=function(obj){
        var object = $("#"+obj+" input.widget-Warranty-WarrantyProduct");
        me.FID=object.val();
        object.change(function(){
            if($(this).prop("checked")){
                form["warranty"]=true;
                form["funnelID"]=$(this).val();
            }else{
                form["warranty"]=false;
                form["funnelID"]=0;
            }
        });
        var objbody=$("#"+obj+" div.widget-Warranty-Body");
        var txt=objbody.html().replace("{warrantyprice}","<span class='warrantyprice'></span>");
        txt=txt.replace(/\{#/g, '<strong class="deleteword">').replace(/\#}/g, '</strong>');
        txt=txt.replace(/\{!/g,'<strong class="important">').replace(/\!}/g,'</strong>');    
        txt=txt.replace(/\{/g,'<strong>').replace(/\}/g,'</strong>');
        objbody.html(txt);
    };
    this.initial(obj);
    return this;
}