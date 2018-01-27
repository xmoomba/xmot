javascript:$('.container').css('width', '1401px');
$('.chart').css('padding-left', '100px');
$('#xmot #stop').click();
$('#xmot, .xdel').remove();
$('.index-news').hide();
$('#defaultStart').click();
$('.item-title-btns span:nth-child(2)').click();

$('.orderform-type span:nth-child(2)').click();
$('.orderform-main.f-cb.marketOrder .f-fl:nth-child(1)').after('<div id="xmot" class="f-fl" style="width:182px;padding:9px;border: 1px solid black">'
    + '<center>'
    + '<h1 class="coin" style="color:grey;">XmoT</h1>'
    + '<br />'
    + '<input id="cycle" type="checkbox" checked>'
    + ' Cycle <input id="timeSwitch" value="10" type="text" style="width:30px;margin:3px;padding-left:2px">'
    + '<br />'
    + '<input id="autoTrade" type="checkbox"> AutoTrade'
    + '<br />'
    + '<br />'
    + '<button id="start" style="padding:4px">start</button>'
    + '<button id="stop" style="margin-left:16px;padding:4px">stop</button>'
    + '<br />'
    + '<div style="margin:3px">'
    + 'Target <input id="inputTarget" value="0.005" type="text" style="width:40px;margin:3px;padding-left:2px">'
    + '<br />'
    + 'Offset <input id="inputOffset" value="2" type="text" style="width:30px;margin:3px;padding-left:2px">%'
    + '</div>'
    + '<div class="dot" style="margin:10px;">Waiting</div>'
    + '<div style="position:relative;width:109px;margin:10px 0">'
    + '<div id="cursor" style="position:absolute;top:0;width:3px;height:30px;left:50%;background-color:black">'
    + '</div>'
    + '<div style="display: inline-block;height:30px;background-color:#70a800;width:40px;">'
    + '<div style="position:absolute;margin: 7px 14px;color:white">B</div>'
    + '</div>'
    + '<div style="display: inline-block;height:30px;background-color:white;width:20px;"></div>'
    + '<div style="display: inline-block;height:30px;background-color:#ea0070;width:40px;">'
    + '<div style="position:absolute;margin: 7px 14px;color:white">S</div>'
    + '</div>'
    + '</div>'
    + '<div class="display"></div>'
    + '<br />'
    + '<input id="debugMode" type="checkbox"> debug'
    + '<div class="debug"></div>'
    + '</center>'
    + '</div>');

var coin = $($('.marketOrder .orderforms-hd div label').get(0)).text().split(' ')[1];
$($('.marketOrder .orderforms-hd div').get(0)).after('<div class="xdel">'
    + '<span class="f-fr ng-binding">'
    + '<span class="coin">' + coin + '</span> '
    + 'Eq: <span id="buyCoinEq"></span>'
    + '</span>'
    + '</div>');
$($('.marketOrder .orderforms-hd div').get(2)).after('<div class="xdel">'
    + '<span class="f-fr ng-binding">'
    + 'BTC Eq: <span id="sellCoinEq"></span>'
    + '</span>'
    + '</div>');
$('.marketOrder .f-fl .field.percent').after('<div id="buyReadonly" class="xdel" style="margin-left:63px"></div>');
$('.marketOrder .f-fr .field.percent').after('<div id="sellReadonly" class="xdel" style="margin-left:63px"></div>');

function switchCoin() {
    nextCoin = $('.market-con ul.selectedPro:visible').next('ul:visible');
    if (nextCoin.text() == '')
        $('.market-con ul:visible:first-child').click();
    else
        nextCoin.click();

    /* reinit */
    switchLock = 0;
    i = 1;
}

function debug() {
    tab = '<div id="vartab">'
        + '<div><div class="var">coin</div><div class="val">' + coin + '</div></div>'
        + '<div><div class="var">running</div><div class="val">' + running + '</div></div>'
        + '<div><div class="var">i</div><div class="val">' + i + '</div></div>'
        + '<div><div class="var">lock</div><div class="val">' + lock + '</div></div>'
        + '<div><div class="var">switchLock</div><div class="val">' + switchLock + '</div></div>'
        + '<div><div class="var">actual</div><div class="val">' + actual + '</div></div>'
        + '<div><div class="var">mine</div><div class="val">' + mine + '</div></div>'
        + '<div><div class="var">target</div><div class="val">' + target + '</div></div>'
        + '<div><div class="var">mini</div><div class="val">' + mini + '</div></div>'
        + '<div><div class="var">eqBTC</div><div class="val">' + eqBTC + '</div></div>'
        + '<div><div class="var">myBTC</div><div class="val">' + myBTC + '</div></div>'
        + '<div><div class="var">buy</div><div class="val">' + buy + '</div></div>'
        + '<div><div class="var">sell</div><div class="val">' + sell + '</div></div>'
        + '<div><div class="var">bestbuy</div><div class="val">' + bestbuy + '</div></div>'
        + '<div><div class="var">bestsell</div><div class="val">' + bestsell + '</div></div>'
        + '<div><div class="var">currentPrice</div><div class="val">' + currentPrice + '</div></div>'
        + '<div><div class="var">lastPrice</div><div class="val">' + lastPrice + '</div></div>'
        + '</div>';
    css = '<style>'
        + '#xmot #vartab { padding: 3px; font-size:10px; }'
        + '#xmot #vartab .var { width: 60px; border:  1px solid black; background: yellow; display: inline-block; padding:2px; }'
        + '#xmot #vartab .val { width: 85px;  border: 1px solid black;  background: white; display: inline-block; padding:2px; }'
        + '</style>';
    $('.debug').html(tab + css);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function loadData() {
    $('.market-con ul').prepend('<div style="width:113%" class="xdel"><input class="active" type="checkbox" style="margin:2px;">T<input class="conf_target" type="text" value="-" style="width:10px;margin-right:2px;"> O<input class="conf_offset" type="text" value="-" style="width:10px;margin:0px;"></div>');
    $('.market-con ul li:nth-child(3)').css('width','20%');
    $('.market-con ul li:nth-child(4)').css('width','100%');
    $('.market-con ul li:nth-child(5)').css('width','50%');

    $('.market-con ul li:nth-child(3)').each(function() {
        $(this).parent().attr('id', 'conf_'+$(this).text().split('/')[0]);
        $(this).html($(this).text().split('/')[0]);
        $(this).css('width','50px;');
    });
    conf = getCookie('conf_xmot');
    $.each(conf.split('|'), function() {
        $('#conf_' + this.split('-')[0] + ' .conf_target').val(this.split('-')[1]);
        $('#conf_' + this.split('-')[0] + ' .conf_offset').val(this.split('-')[2]);
        $('#conf_' + this.split('-')[0] + ' .active').attr('checked','checked');

    })
}

loadData();
function saveData() {
    save = '';
    $('.market-con ul').each(function() {
        if ($(this).find('.active:checked').val() == 'on') {
            ctarget = $(this).find('.conf_target').val();
            coffset = $(this).find('.conf_offset').val();
            curr = $(this).find('li:nth-child(3)').text().split('/')[0];
            save += (save ? '|' : '') + curr + '-' + ctarget + '-' + coffset
        }
    });
    setCookie('conf_xmot', save);
}

switchCoin();
var targetBTC = $('#inputTarget').val();
var targetOffset = $('#inputOffset').val() / 100;
var state = ['', '.', '..', '...'];
var i = 0;
var running = 0;
var lock = 0;
var switchLock = 0;
timeout = 180;
var actual, mine, target, mini, eqBTC, myBTC, buy, sell, bestbuy, bestsell, currentPrice, lastPrice;

$('#xmot #start').on('click', function () {
   if (running == 0) {
        handler = setInterval(function () {
            $('#xmot .dot').html('Analyze' + state[i++ % 4]);
            if ((i % $('#timeSwitch').val() == 0 && switchLock == 0) || i > timeout) {
                if ($('#cycle:checked').val() == 'on') {
                    $('#xmot .display').html('DO NOTHING');
                    $('#market_buyQuanity').val('-');
                    $('#market_sellQuanity').val('-');
                    switchCoin();
                }
            }
            else if (lock == 0)
                xmotC();
        }, 1000);
        running = 1;
    }
});

$('#xmot #stop').on('click', function () {
    running = 0;
    clearInterval(handler);
    $('#xmot .display').html('INACTIVE');
    $('#xmot .dot').html('Waiting');
});

$('.market-con ul').click(function () {
    lock = 1;
    coin = '';
    $('#xmot .display').html('SWITCHING...');
    $('#market_buyQuanity').val('-');
    $('#market_sellQuanity').val('-');
    $('#cursor').hide();
    setTimeout(function () {
        lock = 0;
    }, 1000);
});

function go() {
    if ($('#market_sellQuanity').val() > 0)
        $('.marketOrder .btn-sell').click();
    if ($('#market_buyQuanity').val() > 0)
        $('.marketOrder .btn-buy').click();
    switchCoin();
}

function xmotC() {

    saveData();


    if ($('#debugMode:checked').val() == 'on')
        debug();
    else
        $('.debug').html('');


   /* highlight */
    var hour = 0;
    color = 'lightgrey';
    $('#tradeHistory table tr').each(function () {
        tmp = hour;
        hour = $(this).find('td:last-child').html();
        color = (tmp != hour ? (color == 'white' ? 'lightgrey' : 'white') : color);
        $(this).css('background', color);
    });

    $('#defaultStart').click();
    $('#cursor').show();
    coin = $($('.orderforms-hd div label').get(0)).text().split(' ')[1];
    $('#inputTarget').val($('#conf_'+coin+' .conf_target').val() / 1000);
    $('#inputOffset').val($('#conf_'+coin+' .conf_offset').val());


    $('.coin').html(coin);
    targetBTC = $('#inputTarget').val();
    targetOffset = $('#inputOffset').val() / 100;
    var tmppow = ($('#sellQuanity').next().next().text().split(' ')[2].split('.')[1]);
    if (tmppow == undefined)
        multiplier = Math.pow(10, 1) / 10;
    else
        multiplier = Math.pow(10, tmppow.length);

    actual = $('.newest').text().split('\t')[17].trim();
    mine = Math.floor($('.marketOrder .orderforms-hd span.f-fr').text().split(' ')[7] * 100000000) / 100000000;
    target = Math.floor(targetBTC / actual * 100000000) / 100000000;
    mini = Math.ceil(0.0022 / $('.newest').text().split('\t')[17].trim() * 100000000) / 100000000;
    eqBTC = Math.round($($('.marketOrder .orderforms-hd div span').get(4)).text().split(' ')[2] * actual * 100000000) / 100000000;
    myBTC = $($('.marketOrder .orderforms-hd div span').get(0)).text().split(' ')[2];

    $('#buyCoinEq').html(Math.round($($('.marketOrder .orderforms-hd div span').get(0)).text().split(' ')[2] / actual * 100000000) / 100000000);
    $('#sellCoinEq').html(eqBTC);
    percent = (eqBTC - targetBTC) / (targetBTC * targetOffset) * 100;
    percent = percent > 300 ? 300 : percent;
    percent = percent < -300 ? -300 : percent;
    $('#cursor').css('left', 49 + 13 * (percent) / 100 + '%');


    mini = Math.abs(target - mine) >= mini ? 0 : mini;
    buy = Math.floor(parseFloat(mini + (mine + targetOffset * target < target ? target - mine : 0)) * multiplier) / multiplier;
    sell = Math.floor(parseFloat(mini + (mine - targetOffset * target > target ? mine - target : 0)) * multiplier) / multiplier;

    bestbuy = $('.askTable tr:last-child td span span').text();
    bestsell = $('.bidTable tr:first-child td span span').text();

    $('#buyReadonly').html(Math.round(bestbuy * buy * 100000000000) / 100000000000);
    $('#sellReadonly').html(Math.round(bestsell * sell * 100000000000) / 100000000000);

    $('#market_buyQuanity').val(buy);
    $('#market_sellQuanity').val(sell);
    $('#xmot .display').html('<button onclick="go()" id="go" style="padding: 2px">' + (buy > sell ? 'BUY ' : 'SELL ') + Math.round(Math.abs(buy - sell) * multiplier) / multiplier + ' ' + coin + '</button>');


    if ($('#conf_'+coin+' .active:checked').val() != 'on'){
        $('#xmot .display').html('DISABLED');
        $('#market_buyQuanity').val('-');
        $('#market_sellQuanity').val('-');
        switchCoin();
    } else {
        if ((mine == target) || (buy == sell) || parseFloat((bestbuy * buy) - 0.0022) > parseFloat(myBTC)) {
            $('#xmot .display').html('DO NOTHING');
            $('#market_buyQuanity').val('-');
            $('#market_sellQuanity').val('-');
            switchLock = 0;
            currentPrice = '-';
            lastPrice = '-';
        } else {
            switchLock = 1;
            if ($('#autoTrade:checked').val() == 'on') {
                $.get('https://www.binance.com/api/v1/klines?symbol=' + coin + 'BTC&interval=1m', function (data) {
                    currentPrice = data[499][4];
                    lastPrice = data[498][1];
                    if ((buy > sell && currentPrice > lastPrice) || (buy < sell && currentPrice < lastPrice)) {
                        go();
                    }
                });
            }
        }
    }
}
$('#xmot #start').click();ooo;
