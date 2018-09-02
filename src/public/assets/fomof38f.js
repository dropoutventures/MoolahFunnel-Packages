$.extend({
    Fomo:{
        customers:[],
        image:'',
        initial:function(data,image){
            var a=$.Fomo;
            var timer1 = new a.timer();
            $.get(data,function(json){
                a.customers = json.data;
            });
            a.image=image;
            timer1.start(function () {
                var b=$.Fomo;
                try {
                    b.showup(b.customers);
                } catch (e) {
                    console.log(e);
                }
            }, 8000, true);
        },
        timer:function () {
            var timer = {
                running: false,
                iv: 5000,
                timeout: false,
                cb: function () { },
                start: function (cb, iv, sd) {
                    var _this = this;
                    clearInterval(this.timeout);
                    this.running = true;
                    if (cb) { this.cb = cb; }
                    if (iv) { this.iv = iv; }
                    if (sd) { _this.execute(_this); }
                    else { this.timeout = setTimeout(function () { _this.execute(_this); }, this.iv); }
                },
                execute: function (e) {
                    if (!e.running) { return false; }
                    e.cb();
                    e.start();
                },
                stop: function () {
                    this.running = false;
                },
                setInterval: function (iv) {
                    clearInterval(this.timeout);
                    this.start(false, iv);
                }
            };
            return timer;
        },
        showup: function(customers) {
            var position = "left-bottom";
            if ($(window).width() < 1000) {
                position = "left-top";
            }
            var br = "";
            if ($(window).width() < 400) {
                br = "<br>";
            }
            var max = customers.length;
            var rand = Math.floor((Math.random() * max) + 1);
            var customer = customers[rand];
            if ($.notiny) {
                $.notiny({
                    text: customer.name + br + customer.in + customer.place + ", " + customer.country + "<br/>" + customer.buy + " <strong> " + customer.product + " </strong> ",
                    image: $.Fomo.image,
                    bottomPx: 10,
                    position: position,
                    // width: 400,
                    autohide: true,
                    // clickhide: true,
                    theme: "light"
                });
            }
        }
    }
});