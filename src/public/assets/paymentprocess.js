function paymentProcessor(obj){
    $.paymentProcessors.form={};
    this.object=$("#"+obj);
    var me=this;
    function initial(){
        var obj=me.object.find("input");
        obj.change(function(){
            var form=$.paymentProcessors.form;
            if($(this).prop("checked")){
                form["paymentMethod"]=$(this).val();
                $.paymentForms.show($(this).val());
            }
        });
    }
    initial();
    return this;
}