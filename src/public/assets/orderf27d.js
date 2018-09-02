$.extend({
    paymentForms:{
        Types:['CreditCard','PayPal','Boleto'],
        Items:{
            CreditCard:"div.widget-CreditCardForm",
            Shipping:"div.widget-AddressForm.shipping",
            Billing:"div.widget-AddressForm.billing",
            Boleto:"div[class^='Boleto']",
            Warranty:"div.widget-Warranty",
            PayPalBtn:"div[class^='paypalBtn']",
            CreditCardBtn:"div.ctaBtn",
            BoletoBtn:"div.ctaBtn"
        },
        GetItems:function(type){
            var a=$.paymentForms;
            switch(type.toLowerCase()){
                case "creditcard":
                    return $(a.Items.CreditCard+','+a.Items.Shipping+','+a.Items.Billing+','+a.Items.CreditCardBtn);
                case "paypal":
                    return $(a.Items.PayPalBtn);
                case "boleto":
                    return $(a.Items.Boleto+','+a.Items.BoletoBtn);
                default:
                    return null;
            }
        },
        show:function(name){
            var a=$.paymentForms;
            var dt=new Date();
            a.hide();
            a.Types.forEach(function(type){
                if(type.toLowerCase()==name.toLowerCase()){
                    a.GetItems(type).removeClass('hidden');
                    $('html,body').animate({scrollTop:$("div.widget-PaymentProcess."+name).offset().top},200);
                }
            });
        },
        hide:function(){
            var a=$.paymentForms;
            a.Types.forEach(function(type){
                if(a.GetItems(type)!=null){
                    a.GetItems(type).addClass('hidden');
                    try{
                        $.paymentProcessors[type].object.find(".error-message").addClass('hidden');
                        $.paymentProcessors[type].object.find(".input-error").removeClass('input-error');
                    }catch(ex){}
                }
            });
        }
    },
    order:{
        product:{},
        country:'',
        city:'',
        price:'',
        priceAmout:0,
        currency:'$',
        paymentProcessor:$.paymentProcessors,
        customerForm:null,
        cardForm:$.creditCardForm,
        addressForm:null,
        billingForm:null,
        warrantyForm:null,
        sameAsShipping:null,
        upsell:[],
        initial:function(){
            var a=$.order;
            $.completedLoading=false;
            $.paymentForms.hide();
            if($("div.widget-CustomerInfor") && $("div.widget-CustomerInfor").data("form")){
                a.customerForm=$.CustomerInfor[$("div.widget-CustomerInfor").data("form")];
            }
            if($($.paymentForms.Items.Shipping) && $($.paymentForms.Items.Shipping).data("form")){
                a.addressForm=$.AddressForm[$($.paymentForms.Items.Shipping).data("form")];
            }
            if($($.paymentForms.Items.Billing) && $($.paymentForms.Items.Billing).data("form")){
                a.billingForm=$.AddressForm[$($.paymentForms.Items.Billing).data("form")];
            }
            if($($.paymentForms.Items.Warranty) && $($.paymentForms.Items.Warranty).data("form")){
                a.warrantyForm=$.warrantyProduct[$($.paymentForms.Items.Warranty).data("form")];
            }
            a.sameAsShipping=$("div.widget-AddressForm.billing input.widget-AddressForm-Switch");
            $("div.ctaBtn").removeClass('hidden');
            $("div.paypalBtn").addClass('hidden');
            //var key=$.Local.get("webFormId");
            var WebFormID=webform.webkey;
            try{
                $.Local.set("webFormId",WebFormID);
                $.Local.set("crm-parentWebformId",WebFormID);
                var set = {
                    type: 'get',
                    async:false
                };
                $.endPoint.Ajax('campaigns/'+WebFormID+'/upsells', set, function(data){
                    a.upsell=Array.isArray(data)?data:[];
                    $.Local.set("upsells",JSON.stringify(data));
                    $.Local.set("crm-upsells",JSON.stringify(data));
                });
                //var url=webform.domain+"campaigns/"+WebFormID+"/customers/location";
                $.endPoint.Ajax("campaigns/"+WebFormID+"/customers/location",set, function(response) {
                    a.country= response.countryCode;
                    $.Local.set("crm-location",JSON.stringify(response));
                    a.setCountryCity();
                    a.showProducts();
                });
            }catch(ex){
                a.showProducts();
            }
            $('.ctaBtn').click(a.submit);
            $('.paypalBtn').click(a.submit);
            $.registerSession();
        },
        setCountryCity:function(){
            var a=$.order;
            $("input[name='City']").val("");
            if(a.addressForm.countryloaded && (a.billingForm==null || a.billingForm.countryloaded)){
                $("select[name='Country']").data("value",a.country);
                $("select[name='Country']").val(a.country);
                a.addressForm.provinceSet();
                if(a.billingForm!=null)a.billingForm.provinceSet();
            }else{
                setTimeout(a.setCountryCity,500);
            }
        },
        showProducts:function(){
            var a=$.order;
            var set={
                type:'get',
            };
            $.endPoint.Ajax('campaigns/'+webform.webkey+'/products/prices/'+a.country,set, a.setProducts);
        },
        setProducts:function(data){
            var a=$.order;
            if(data!=null && data.length>0){
                $(data).each(function(){
                    var dt=this;
                    var fvalue=dt.productPrices.DiscountedPrice.FormattedValue.replace(/\,/g,'').replace(/\./g,'');
                    var amount=dt.productPrices.DiscountedPrice.Value.toFixed(2).replace(/\./g,'');
                    a.currency=fvalue.replace(amount,"######");
                    var radio=$("input[id='Product_"+this.productId+"']");
                    var obj=radio.parentsUntil('div.productRadioListItem','div').parent();
                    obj.find('*').each(function(){
                        if($(this).children().length==0){
                            $(this).html($(this).html().toString().replace(/\{productPrice\}/g,dt.productPrices.DiscountedPrice.FormattedValue));    
                            $(this).html($(this).html().toString().replace(/\{discountPrice\}/g,dt.productPrices.UnitDiscountRate.FormattedValue));
                            $(this).html($(this).html().toString().replace(/\{productName\}/g,dt.productName));
                            $(this).html($(this).html().toString().replace(/\{discountrate\}/g,dt.productPrices.UnitDiscountRate.Value));
                            $(this).html($(this).html().toString().replace(/\{fullprice\}/g,dt.productPrices.FullRetailPrice.FormattedValue));
                            radio.data('info',dt);
                            if(radio.prop("checked")){
                                a.price=dt.productPrices.DiscountedPrice.FormattedValue;
                                a.priceAmout=dt.productPrices.DiscountedPrice.Value;
                                a.showWarranty();
                            }
                            $(this).change(function(){
                                if($(this).prop("checked")){
                                    a.price=$(this).data("info").productPrices.DiscountedPrice.FormattedValue;
                                    a.priceAmout=$(this).data("info").productPrices.DiscountedPrice.Value;
                                    a.showWarranty();
                                }
                            });
                        }
                    });
                });
            }
            $.clearToken($.order);
            $.convertHref();
            $.completedLoading=true;
        },
        showWarranty:function(){
            var a=$.order;
            if(a.warrantyForm!=null){
                if(getData(a.warrantyForm.FID,0)>0){
                    var funnelprice=a.warrantyForm.rate[getData(a.warrantyForm.FID,0)-1];
                    $($.paymentForms.Items.Warranty).find("span.warrantyprice").html(a.currency.replace("######",(Math.ceil(100*a.priceAmout*funnelprice)/100).toFixed(2)));
                }
            }
        },
        submit:function(){
            var a=$.order;
            if(a.beforeSubmit()){
                var data=a.postData();
                var set={
                    data:JSON.stringify(data),
                    success:a.afterSuccess,
                    loadImg:(data.payment.paymentProcessorId==5?"//cdn-fkf.emwebsys-h03.com/common/sitelibrary/base/images/paypal_loader.gif":""),
                    error: a.errorpost,
                    complete:function(){}
                };
                var url="orders/"+webform.webkey;
                $.Local.set("crm-isd",false);
                if($.Request.QueryString('isCardTest')){
                    url += "?behaviorId=2";
                    $.Local.set("crm-isd",true);
                } 
                $.endPoint.Ajax(url,set);
            }
            return false;
        },
        beforeSubmit:function(){
            var a=$.order;
            a.product=$("input[type='radio']:checked").data("info");
            var tnc=$("div.widget-tnc-checkbox input[type=checkbox]");
            if(tnc.length>0){
                if(tnc.prop("checked")==false)return false;
            }
            a.customerForm.checkForm();
            var paymentprocessor=a.paymentProcessor.form.paymentMethod;
            if(paymentprocessor!=undefined){
                switch(paymentprocessor.toLowerCase()){
                    case "creditcard":
                        a.cardForm.checkForm();
                        a.addressForm.checkForm();
                        var useSameAddress=(a.sameAsShipping==null || a.sameAsShipping.length==0)?true:a.sameAsShipping.prop("checked");
                        if(a.billingForm!=null && useSameAddress==false)a.billingForm.checkForm();
                        break;
                    case "boleto":
                    case "paypal":
                    default:break;
                }
            }
            if(a.product==undefined){
                return false;
            }
            if(paymentprocessor==undefined){
                return false;
            }
            if($(".input-error").length>0){
                return false;
            }
            return true;
        },
        postData:function(){
            var a=$.order;
            var paymentprocessor=a.paymentProcessor.form.paymentMethod;
            var cf=a.customerForm.form;
            var af=a.addressForm.form;
            var bf=a.billingForm==null?null:a.billingForm.form;
            var addr=null,bill=null;
            var useSameAddress=(a.sameAsShipping==null || a.sameAsShipping.length==0)?true:a.sameAsShipping.prop("checked");
            var pay={};
            var coupon=$("input[class*='Coupon']");
            var cus={
                email: getData(cf["Email"],"")==""?getData(af["Email"],""):getData(cf["Email"],""),
                phoneNumber: getData(cf["Phone"],"")==""?getData(af["Phone"],""):getData(cf["Phone"],""),
                firstName: getData(cf["FirstName"],"")==""?getData(af["FirstName"],""):getData(cf["FirstName"],""),
                lastName: getData(cf["LastName"],"")==""?getData(af["LastName"],""):getData(cf["LastName"],"")
            };
            switch(paymentprocessor.toLowerCase()){
                case "creditcard":
                    var cc=a.cardForm.form;
                    pay={
                        name:getData(cc.NameOnCard,"")==""?(cus.firstName+" "+cus.lastName):getData(cc.NameOnCard,""),
                        creditcard:cc.CreditCard,
                        creditCardBrand:cc.CreditCardType,
                        expiration:cc.ExpiryMonth+"/20"+cc.ExpiryYear,
                        cvv:cc.CVV
                    };
                    addr={
                        firstName: getData(af["FirstName"],"")==""?cus.firstName:getData(af["FirstName"],""),
                        lastName: getData(af["LastName"],"")==""?cus.lastName:getData(af["LastName"],""),
                        address1: getData(af["Address"],""),
                        address2: getData(af["Address2"],""),
                        city: getData(af["City"],""),
                        zipCode: getData(af["Zipcode"],""),
                        state: getData(af["Province"],""),
                        countryCode: getData(af["Country"],""),
                        phoneNumber: getData(af["Phone"],"")==""?cus.phoneNumber:getData(af["Phone"],"")
                    };
                    $.Local.set("crm-rawPostCustomer",JSON.stringify({"email":cus.email,"useShippingAddressForBilling":useSameAddress,"shippingAddress":addr}));
                    try{
                        bill={
                            firstName: getData(bf["FirstName"],"")==""?addr.firstName:getData(bf["FirstName"],""),
                            lastName: getData(bf["LastName"],"")==""?addr.lastName:getData(bf["LastName"],""),
                            address1: getData(bf["Address"],""),
                            address2: getData(bf["Address2"],""),
                            city: getData(bf["City"],""),
                            zipCode: getData(bf["Zipcode"],""),
                            state: getData(bf["Province"],""),
                            countryCode: getData(bf["Country"],""),
                            phoneNumber: getData(bf["Phone"],"")
                        };
                    }catch(ex){
                        bill=null;
                    };
                    $.Local.set("crm-payment.type","cc");
                    break;
                case "paypal":
                    pay={
                        paymentProcessorId:5
                    };
                    $.Local.set("crm-payment.type","paypal");
                    break;
                case "boleto":
                    pay={
                        paymentProcessorId:25
                    };
                    $.Local.set("crm-payment.type","boleto");
                default:break;
            }
            var anti=null;
            try{anti=JSON.parse($.Local.get("anti"));}catch(ex){anti=null;}
            $.Local.set("crm-anti",JSON.stringify(anti));
            $.Local.set("email",cus.email);
            var formData={
                couponCode: (coupon.val()!=undefined && coupon.val()!=null && coupon.val()!="")?coupon.val(): $.Request.QueryString('coupon'),
                shippingMethodId:(( a.product.shippings.length>0)? a.product.shippings[0].shippingMethodId:null),
                comment: '',
                useShippingAddressForBilling: useSameAddress,
                productId: a.product.productId,
                customer: cus,
                payment: pay,
                shippingAddress:addr,
                billingAddress:useSameAddress?null:bill,
                analyticsV2: $.makeit(),
                funnelBoxId: getData(a.warrantyForm.form["funnelID"],0),
                antiFraud: {
                    sessionId: getData(anti.sessionId)
                }
            };
            $.Local.set("nextUpsell",(a.upsell.length>0?0:-1));
            $.Local.set("crm-warrantyEnabled",getData(a.warrantyForm.form["funnelID"],0));
            return formData;
        },
        afterSuccess:function(data){
            var a=$.order;
            if(data!=null && data.success){
                $.Local.set("paymentProcessorId",getData(data.paymentProcessorId));
                $.Local.set("mainOrderNumber", getData(data.orderNumber));
                $.Local.set("orderNumber", getData(data.orderNumber));
                $.Local.set("cardId", getData(data.cardId));
                $.Local.set("customerId", getData(data.customerResult.customerId));
                $.Local.set("addressId", getData(data.customerResult.shippingAddressId));
                $.Local.set("crm-customerShippingId", getData(data.customerResult.shippingAddressId));
                $.Local.set("crm-customerBillingId", getData(data.orderNumber));
                $.Local.set("crm-customerCardId", getData(data.cardId));
                $.Local.set("crm-customerId", getData(data.customerResult.customerId));
                //var key=$.Local.get("webFormId");
                var WebFormID=webform.webkey;
                //$.Local.set(WebFormID);
                var order={
                    "orderNumber": getData(data.orderNumber,''),
                    "success": true,
                    "productName": a.product.productName,
                    "productPrices": a.product.productPrices,
                    "shippings": a.product.shippings,
                    "sku": a.product.sku,
                    "quantity": a.product.quantity,
                    "productId": a.product.productId,
                    "isMainOrder": true,
                    "wid": WebFormID,
                    "descriptor": getData(data.descriptor,'')
                };
                var orders=[];
                $.Local.set("urlsearch",location.search.substr(1));
                orders.push(order);
                $.Local.set("crm-orders",JSON.stringify(orders));
                $.Local.set("crm-upsellIndex",0);
                if(data.callBackUrl){
                    document.location=data.callBackUrl;
                }else if(data.paymentContinueResult && data.paymentContinueResult.actionUrl!==""){
                    document.location=data.paymentContinueResult.actionUrl;
                }else if(data.upsells.length>0 && data.upsells[0].upsellUrl!==""){
                    $.RedirectPage(data.upsells[0].upsellUrl,{});
                }else{
                    $.RedirectPage(webform.Success,{});
                }
            }else{
                a.errorpost();
            }
        },
        errorpost:function(){
            $.RedirectPage(webform.Decline,{});
        }
    }
});
$(document).ready($.order.initial);