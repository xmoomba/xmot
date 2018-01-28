javascript:
    invest = 0.0025;
$.post('https://www.binance.com/user/getMoneyLog.html', function(money) {
    $.each(money.data, function() {
        if (this.coin == 'BTC')
            invest += parseFloat(this.transferAmount);
    });
});
$('.coin').each(function() {
    $(this).parent().parent().attr('id', 'money_'+$(this).text());
});
timer=0;
clearInterval(timer);
timer = setInterval(function(){
    total = 0;
    $.post("https://www.binance.com/exchange/private/userAssetTransferBtc", function(data) {
        $.each(data, function(money, value) {
            if(money!='totalTransferBtc')
            {
                percentMoney = value * 100 / 0.005 - 100;
                percentMoneyText = '<span style="color:' + (percentMoney > 0 ? 'green' : 'red') +'">' + (percentMoney > 0 ? '+' : '') + percentMoney.toFixed(2) + '%' + '</span>';
                $('#money_'+money+' .equalValue').html(value + (money != 'BTC' ? ' ' + percentMoneyText : ''));
                total+=parseFloat(value);
            }
        });
        $.post("https://www.binance.com/exchange/private/userAsset", function(data) {
            $.each(data, function() {
                $('#money_'+this.asset+' .useable').html(this.free);
                $('#money_'+this.asset+' .locked').html(this.locked);
                $('#money_'+this.asset+' .total').html(parseFloat(this.free)+parseFloat(this.locked));
            });
        });
        total=Math.round(total*100000000000)/100000000000;
        $.get("https://www.binance.com/exchange/public/convert?from=BTC&to=USDT&amount="+total, function(data) {
            $('.total strong:nth-child(3)').html(Math.round(data.amount*100)/100+" $");
            $('.total strong:first').html(total+" BTC = "+Math.round((((total * 100)/invest)-100)*100)/100+"%");
        });
    });
},4000);OOO
