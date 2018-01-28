$('#tradeHistory').after('<br />All trades<br /><div class="item-con" id="allHistory" style="margin-top:1px;">'
    +'<div class="scrollStyle ng-scope" style="overflow-y:auto;height:163px;" >'
    +'<table class="table">'
    +'<colgroup style="width:25%"></colgroup>'
    +'<colgroup style="width:25%"></colgroup>'
    +'<colgroup style="width:35%"></colgroup>'
    +'<colgroup style="width:35%"></colgroup>'
    +'<tbody>'
    +'</tbody>'
    +'</table>');




function AddHistory(buy, coin, nb, eqBTC, price)
{
    $('#allHistory table').prepend('<tr class="ng-scope" style="background: white none repeat scroll 0% 0%;">'
        + '<td class="f-left ng-binding '+ (buy ? 'green' : 'magenta') + '">'+nb+' '+coin+'</td>'
        +  '<td class="f-right ng-binding">'+price+'</td>'
        +  '<td class="f-right ng-binding">'+eqBTC+' BTC</td>'
        +  '<td class="f-right ng-binding">12:36:10</td>'
        +  '</tr>');

}