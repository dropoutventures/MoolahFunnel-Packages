$.extend({
    creditCardForm: {
        form:{},
        //years:[],
        curYear:(new Date()).getFullYear().toString().substr(-2),
        curMonth:("0" + ((new Date()).getMonth()+1).toString()).substr(-2),
        checkCreditCard :function (cardnumber, cardname) {
            var a=$.creditCardForm;
            var ccErrorNo = 0;
            var ccErrors = [];
            ccErrors[0] = "Unknown card type";
            ccErrors[1] = "No card number provided";
            ccErrors[2] = "Credit card number is in invalid format";
            ccErrors[3] = "Credit card number is invalid";
            ccErrors[4] = "Credit card number has an inappropriate number of digits";
            ccErrors[5] = "Warning! This credit card number is associated with a scam attempt";

            var cards = new Array();
            cards[0] = {
                name: "Visa",
                length: "13,16",
                prefixes: "4",
                checkdigit: true
            };
            cards[1] = {
                name: "Master",
                length: "16",
                prefixes: "51,52,53,54,55",
                checkdigit: true
            };
            cards[2] = {
                name: "DinersClub",
                length: "14,16",
                prefixes: "36,38,54,55",
                checkdigit: true
            };
            cards[3] = {
                name: "CarteBlanche",
                length: "14",
                prefixes: "300,301,302,303,304,305",
                checkdigit: true
            };
            cards[4] = {
                name: "AmEx",
                length: "15",
                prefixes: "34,37",
                checkdigit: true
            };
            cards[5] = {
                name: "Discover",
                length: "16",
                prefixes: "6011,622,64,65",
                checkdigit: true
            };
            cards[6] = {
                name: "JCB",
                length: "16",
                prefixes: "35",
                checkdigit: true
            };
            cards[7] = {
                name: "enRoute",
                length: "15",
                prefixes: "2014,2149",
                checkdigit: true
            };
            cards[8] = {
                name: "Solo",
                length: "16,18,19",
                prefixes: "6334,6767",
                checkdigit: true
            };
            cards[9] = {
                name: "Switch",
                length: "16,18,19",
                prefixes: "4903,4905,4911,4936,564182,633110,6333,6759",
                checkdigit: true
            };
            cards[10] = {
                name: "Maestro",
                length: "12,13,14,15,16,18,19",
                prefixes: "5018,5020,5038,6304,6759,6761,6762,6763",
                checkdigit: true
            };
            cards[11] = {
                name: "VisaElectron",
                length: "16",
                prefixes: "4026,417500,4508,4844,4913,4917",
                checkdigit: true
            };
            cards[12] = {
                name: "LaserCard",
                length: "16,17,18,19",
                prefixes: "6304,6706,6771,6709",
                checkdigit: true
            };
            var cardType = -1;
            for (var i = 0; i < cards.length; i++) {
                if (cardname.toLowerCase() == cards[i].name.toLowerCase()) {
                    cardType = i;
                    break;
                }
            }
            if (cardType == -1) {
                ccErrorNo = 0;
                return false;
            }
            if (cardnumber.length == 0) {
                ccErrorNo = 1;
                return false;
            }
            cardnumber = cardnumber.replace(/\s/g, "");
            var cardNo = cardnumber;
            var cardexp = /^[0-9]{13,19}$/;
            if (!cardexp.exec(cardNo)) {
                ccErrorNo = 2;
                return false;
            }
            if (cards[cardType].checkdigit) {
                var checksum = 0;
                var mychar = "";
                var j = 1;
                var calc;
                for (i = cardNo.length - 1; i >= 0; i--) {
                    calc = Number(cardNo.charAt(i)) * j;
                    if (calc > 9) {
                        checksum = checksum + 1;
                        calc = calc - 10;
                    }
                    checksum = checksum + calc;
                    if (j == 1) { j = 2 } else { j = 1 };
                }
                if (checksum % 10 != 0) {
                    ccErrorNo = 3;
                    return false;
                }
            }
            if (cardNo == '5490997771092064') {
                ccErrorNo = 5;
                return false;
            }
            var LengthValid = false;
            var PrefixValid = false;
            var undefined;
            var prefix = new Array();
            var lengths = new Array();
            prefix = cards[cardType].prefixes.split(",");
            for (i = 0; i < prefix.length; i++) {
                var exp = new RegExp("^" + prefix[i]);
                if (exp.test(cardNo)) PrefixValid = true;
            }
            if (!PrefixValid) {
                ccErrorNo = 3;
                return false;
            }
            lengths = cards[cardType].length.split(",");
            for (j = 0; j < lengths.length; j++) {
                if (cardNo.length == lengths[j]) LengthValid = true;
            }
            if (!LengthValid) {
                ccErrorNo = 4;
                return false;
            }
            return true;
        },
        verifyCreditCard:function(cardnumber) {
            var a=$.creditCardForm;
            if (a.checkCreditCard(cardnumber, "Visa")) return "Visa";
            if (a.checkCreditCard(cardnumber, "Master")) return "Master";
            /*if (a.checkCreditCard(cardnumber, "DinersClub")) return "DinersClub";
            if (a.checkCreditCard(cardnumber, "CarteBlanche")) return "CarteBlanche";*/
            if (a.checkCreditCard(cardnumber, "AmEx")) return "AmEx";
            /*if (a.checkCreditCard(cardnumber, "Discover")) return "Discover";
            if (a.checkCreditCard(cardnumber, "JCB")) return "JCB";
            if (a.checkCreditCard(cardnumber, "enRoute")) return "enRoute";
            if (a.checkCreditCard(cardnumber, "Switch")) return "Switch";
            if (a.checkCreditCard(cardnumber, "Solo")) return "Solo";
            if (a.checkCreditCard(cardnumber, "Maestro")) return "Maestro";
            if (a.checkCreditCard(cardnumber, "VisaElectron")) return "VisaElectron";
            if (a.checkCreditCard(cardnumber, "LaserCard")) return "LaserCard";*/
        },
        initial:function() {
            var a=$.creditCardForm;
            //var currentYear = (new Date()).getFullYear();
            //for( i=0; i < 10; i++) {
            //    a.years.push(currentYear.toString());
            //    currentYear++;
            //}
            $('input').keypress(function(e){
                var code=e.which || e.keyCode;
                if(code==13){
                    e.preventDefault();
                    var objs=$("input");
                    var n=objs.index($(this))+1;
                    objs.eq(n).focus();
                }else{
                    $(this).parent().find('.error-message').addClass("hidden");   
                    $(this).removeClass("input-error");
                }
            });
            $('.widget-CreditCardNameOnCard').change(function(){
                var value=$(this).val();
                if(value===null || value===""){
                    a.form.NameOnCard="";
                    $(this).addClass("input-error");
                    $(this).parent().find('.error-message').removeClass("hidden");
                }
                else
                {
                    a.form.NameOnCard=value;
                    $(this).parent().find('.error-message').addClass("hidden");   
                    $(this).removeClass("input-error");
                }
            });
            $('.widget-CreditCardNumber').MaskNumber('0000-0000-0000-0000');
            $('.widget-CreditCardNumber').keypress(function(e){
                if(a.form.CreditCard!=undefined && a.form.CreditCard!=null && a.form.CreditCard!=""){
                    $(this).val(a.form.CreditCard);
                    a.form.CreditCard="";
                }
            }).change(function(){
                var value=$(this).val().toString().replace(/\-/g,'');
                var val=a.verifyCreditCard(value);
                if(val===undefined || val===null){
                    a.form.CreditCard="";
                    a.form.CreditCardType="";
                    $(this).val(value.formatString('0000-0000-0000-0000'));
                    $(this).addClass("input-error");
                    $(this).parent().find('.error-message').removeClass("hidden");
                }else{
                    a.form.CreditCard=value;
                    a.form.CreditCardType=val;
                    $(this).parent().find('.error-message').addClass("hidden");   
                    $(this).removeClass("input-error").val(value.formatString('0000-****-****-0000'));
                }
            });
            $('.widget-CreditCardExpiry').MaskNumber('00/00');
            $('.widget-CreditCardExpiry').keypress(function(e){
                if(a.form.ExpiryMonth!=undefined && a.form.ExpiryMonth!=null && a.form.ExpiryMonth!=""){
                    $(this).val(a.form.ExpiryMonth + '/' + a.form.ExpiryYear);
                    a.form.ExpiryMonth="";
                    a.form.ExpiryYear="";
                }
            }).change(function(){
                var values=$(this).val().toString().split("/");
                a.form.ExpiryMonth = "";
                a.form.ExpiryYear = "";
                if(values.length!=2){
                    $(this).addClass("input-error");
                    $(this).parent().find('.error-message').removeClass("hidden");
                }
                else if(parseInt(values[0])<0 || parseInt(values[0])>12){
                    $(this).addClass("input-error");
                    $(this).parent().find('.error-message').removeClass("hidden");
                }
                else if(parseInt(values[1] + values[0])<parseInt(a.curYear + a.curMonth)){
                    $(this).addClass('input-error');
                    $(this).parent().find('.error-message').removeClass('hidden');
                }
                else
                {
                    a.form.ExpiryMonth = values[0];
                    a.form.ExpiryYear = values[1];
                    $(this).parent().find('.error-message').addClass('hidden');   
                    $(this).removeClass('input-error');
                }
            });
            //$('.widget-CreditCardCVV').MaskNumber('0000');
            $('.widget-CreditCardCVV').keypress(function(e){
                if(a.form.CVV!=undefined && a.form.CVV!=null && a.form.CVV!=""){
                    //$(this).val(a.form.CVV);
                    a.form.CVV="";
                }
                              // return true;
            }).change(function(){
                var value=$(this).val().toString().replace(/\-/g,'');
                if(value.length<3 || value.length>4){
                    $(this).addClass('input-error');
                    $(this).parent().find('.error-message').removeClass('hidden');
                }
                else
                {
                    //a.form.CVV=value;
                    $(this).parent().find('.error-message').addClass('hidden');   
                    $(this).removeClass('input-error');
                }
            });
            $('i.cvv-help').click(function(){
                var html=$("<div style='font-weight:600;'></div>");
                html.append("<span>The security code is a three digit number, located on the back of any Visa <sup>®</sup> or MasterCard <sup>®</sup> on the right side of the signature strip as illustrated.</span><br />");
                html.append("<strong>Last 3 Digits of account number panel:</strong><br />");
                html.append("<object type='image/svg+xml' data='https://www.mirrorcastmedia.com/pub-assets/images/svg/card.6de64a8719acfd96.svg' width='205px' height='120px' class='card'></object>");
                html.append("<br /><br /><span>Visa <sup>®</sup> and MasterCard <sup>®</sup></span>");
                var setting={
                    title:"Where can I find my Security Code?",
                    body:html,
                    bodyClass:"dialogCVVContent"
                };
                $.dialog(setting);
            });
        },
        checkForm:function(){
            var a=$.creditCardForm;
            var nod=$('.widget-CreditCardNameOnCard');
            var value=nod.val();
            if(value===null || value===""){
                a.form.NameOnCard="";
                $(nod).addClass("input-error");
                $(nod).parent().find('.error-message').removeClass("hidden");
            }
            else
            {
                a.form.NameOnCard=value;
                $(nod).parent().find('.error-message').addClass("hidden");   
                $(nod).removeClass("input-error");
            }
            var ccn=$('.widget-CreditCardNumber');
            var value=a.form.CreditCard!=undefined?a.form.CreditCard:"";
            value=value==""?ccn.val().toString().replace(/\-/g,''):value;
            var val=a.verifyCreditCard(value);
            a.form.CreditCard="";
            if(val===undefined || val===null){
                $(ccn).val(value.formatString('0000-0000-0000-0000'));
                $(ccn).addClass("input-error");
                $(ccn).parent().find('.error-message').removeClass("hidden");
            }
            else
            {
                a.form.CreditCard=value;
                $(ccn).parent().find('.error-message').addClass("hidden");   
                $(ccn).removeClass("input-error").val(value.formatString('0000-****-****-0000'));
            }
            var cce=$('.widget-CreditCardExpiry');
            var values=cce.val().toString().split("/");
            a.form.ExpiryMonth = "";
            a.form.ExpiryYear = "";
            if(values.length!=2){
                $(cce).addClass("input-error");
                $(cce).parent().find('.error-message').removeClass("hidden");
            }
            else if(parseInt(values[0])<0 || parseInt(values[0])>12){
                $(cce).addClass("input-error");
                $(cce).parent().find('.error-message').removeClass("hidden");
            }
            else if(parseInt(values[1] + values[0])<parseInt(a.curYear + a.curMonth)){
                $(cce).addClass('input-error');
                $(cce).parent().find('.error-message').removeClass('hidden');
            }
            else
            {
                a.form.ExpiryMonth = values[0];
                a.form.ExpiryYear = values[1];
                $(cce).parent().find('.error-message').addClass('hidden');   
                $(cce).removeClass('input-error');
            }
            var ccc=$('.widget-CreditCardCVV');
            var value=ccc.val().toString();
            a.form.CVV="";
            if(value.length<3 || value.length>4){
                $(ccc).addClass('input-error');
                $(ccc).parent().find('.error-message').removeClass('hidden');
            }
            else
            {
                a.form.CVV=value;
                $(ccc).parent().find('.error-message').addClass('hidden');   
                $(ccc).removeClass('input-error');
            }
        }
    }
});
$(document).ready($.creditCardForm.initial);