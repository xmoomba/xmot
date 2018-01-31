javascript:
    var fixed, forceTrade, coin, targetBTC, targetOffset, state, i, running, lock, switchLock, timeout, actual, mine, target, mini, eqBTC, myBTC, buy, sell, currentPrice, lastPrice;

function init() {
    state = ['', '.', '..', '...'];
    i = 0;
    running = 0;
    lock = 0;
    switchLock = 0;
    timeout = 300;
    forceTrade = 0;


    $('.container').css('width', '1401px');
    $('.chart').css('padding-left', '100px');
    $('#xmot #stop').click();
    $('#xmot, .xdel').remove();
    $('.index-news').hide();
    $('#defaultStart').click();
    $('.item-title-btns span:nth-child(2)').click();

    $('.orderform-type span:nth-child(2)').click();
    $('.orderform-main.f-cb.marketOrder .f-fl:nth-child(1)').after('<div id="xmot" class="f-fl">'
       + '<h1 class="coin">XmoT</h1>'
        + '<br />'
        + '<input id="cycle" type="checkbox" checked>'
        + ' Cycle <input id="timeSwitch" value="10" type="text">'
        + '<br />'
        + '<input id="autoTrade" type="checkbox"> AutoTrade'
        + '<br />'
        + '<br />'
        + '<button id="start">start</button>'
        + '<button id="stop">stop</button>'
        + '<br />'
        + '<div style="margin:3px">'
        + 'Target <input id="inputTarget" value="0.005" type="text">'
        + '<br />'
        + 'Offset <input id="inputOffset" value="2" type="text">%'
        + '</div>'
        + '<div class="dot">Waiting</div>'
        + '<div id="cursorDiv">'
            + '<div id="cursor"></div>'
            + '<div class="left">'
                 + '<div class="inner">B</div>'
            + '</div>'
            + '<div  class="middle"></div>'
            + '<div class="right">'
                 + '<div class="inner">S</div>'
            + '</div>'
        + '</div>'
        + '<div class="display"></div>'
        + '<br />'
        + '<input id="debugMode" type="checkbox"> debug'
        + '<div class="debug"></div>'
        + '</div>');

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

    $('#xmot #start').on('click', function () {
        if (running == 0) {
            handler = setInterval(function () {
                $('#xmot .dot').html('Analyze' + state[i++ % 4]);
                if ((i % $('#timeSwitch').val() == 0 && switchLock == 0) || i > timeout) {
                    if ($('#cycle:checked').val() == 'on') {
                        $('#xmot .display').html('DO NOTHING');
                        $('#market_buyQuanity').val('-');
                        $('#market_sellQuanity').val('-');
						/* forceTrade = 0; -- ligne a inhiber si on veut Forcer le trade au Timeout */
						forceTrade = 0;
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
        /*lock = 1;*/
        coin = '';
        $('#xmot .display').html('SWITCHING...');
        $('#market_buyQuanity').val('-');
        $('#market_sellQuanity').val('-');
        $('#cursor').hide();
        /*setTimeout(function () {
            lock = 0;
        }, 1000);*/
    });

    $('#tradeHistory').after('<br />All trades<br /><div class="item-con" id="allHistory" style="margin-top:1px;">'
        +'<div class="scrollStyle ng-scope" style="overflow-y:auto;height:163px;" >'
        +'<table class="table">'
        +'<colgroup></colgroup>'
        +'<colgroup></colgroup>'
        +'<colgroup></colgroup>'
        +'<colgroup></colgroup>'
        +'<colgroup></colgroup>'
        +'<tbody>'
        +'</tbody>'
        +'</table>');

    $('.market-box .market-con').css('height', 'inherit');
    $('#tradeHistory .scrollStyle').css('height', '148px');
    $('#allHistory .scrollStyle').css('height', '348px').css('width', '340px');
    $('#allHistory').css('width', '350px');
    $('.main-aside').css('right', '-90px').css('width', '350px');
    genCss();

    loadData();
    switchCoin();
    loadHistory();
    $('#xmot #start').click();
}

/*** DISPLAY ***/

function addHistory(buy, coinz, nb, price, eqBTCc, datec) {
	if (nb != 0)
	{
		$('#allHistory table').prepend('<tr class="ng-scope" style="background: white none repeat scroll 0% 0%;">'
        + '<td class="f-right ng-binding '+ (buy ? 'green' : 'magenta') + '">'+nb+'</td>'
        +  '<td class="f-right ng-binding '+ (buy ? 'green' : 'magenta') + '">'+coinz+'</td>'
        +  '<td class="f-right ng-binding '+ (buy ? 'green' : 'magenta') + '">'+price+'</td>'
        +  '<td class="f-right ng-binding '+ (!buy ? 'green' : 'magenta') + '">'+eqBTCc+' mbtc</td>'
        +  '<td class="f-right ng-binding">'+ datec +'</td>'
        +  '</tr>');
		saveHistory();
	}
}



function loadHistory() {
    conf = getCookie('history_xmot');
    if (conf) {
        $.each(conf.split('|'), function() {
            tab = this.split('#');
                addHistory(tab[0] == '1' ? 1 : 0, tab[1], tab[2], tab[3], tab[4], tab[5]);
        });
    }
}

function saveHistory() {
    var tabHistory = [];
    $('#allHistory .scrollStyle table tr').each(function() {
        buy = $(this).find('td:first').hasClass('green') ? '1' : '0';
        nb = $(this).find('td:first').text();
        coinz = $(this).find('td:nth-child(2)').text();
        price = $(this).find('td:nth-child(3)').text();
        eqBTCc = $(this).find('td:nth-child(4)').text().split(' ')[0];
        datec = $(this).find('td:nth-child(5)').text();
        tabHistory.unshift(buy+'#'+coinz+'#'+nb+'#'+price+'#'+eqBTCc+'#'+datec);
        setCookie('history_xmot', tabHistory.join('|'));
    });
}

function genCss() {
    css = '<style>'
        + '.moneyConf { width:350px; }'
        + '#xmot { width:182px;padding:9px;border:1px solid black;text-align:center }'
        + '#xmot h1 { color:grey; }'
        + '#xmot #timeSwitch { width:30px;margin:3px;padding-left:2px }'
        + '#xmot #start {padding:4px }'
        + '#xmot #stop {margin-left:16px;padding:4px}'
        + '#xmot #inputTarget{ width:40px;margin:3px;padding-left:2px }'
        + '#xmot #inputOffset{ width:30px;margin:3px;padding-left:2px }'
        + '#xmot .dot { margin:10px; }'
        + '#xmot #cursor { position:absolute;top:0;width:3px;height:30px;left:50%;background-color:black }'
        + '#xmot #cursorDiv { position:relative;margin:10px 0}'
        + '#xmot #cursorDiv .left { display: inline-block;height:30px;background-color:#70a800;width:40px;}'
        + '#xmot #cursorDiv .left .inner { position: absolute;margin: 7px 14px;color:white}'
        + '#xmot #cursorDiv .middle { display: inline-block;height:30px;background-color:white;width:40px;}'
        + '#xmot #cursorDiv .right { display: inline-block;height:30px;background-color:#ea0070;width:40px;}'
        + '#xmot #cursorDiv .right .inner { position:absolute;margin: 7px 14px;color:white}'
        + '</style>';
    $('#xmot').append(css);
}

function debug() {
    if ($('#debugMode:checked').val() == 'on') {
        tab = '<div id="vartab">'
            + '<div><div class="var">coin</div><div class="val">' + coin + '</div></div>'
            + '<div><div class="var">running</div><div class="val">' + running + '</div></div>'
            + '<div><div class="var">i</div><div class="val">' + i + '</div></div>'
            + '<div><div class="var">switchLock</div><div class="val">' + switchLock + '</div></div>'
            + '<div><div class="var">actual</div><div class="val">' + actual + ' BTC</div></div>'
            + '<div><div class="var">mine</div><div class="val">' + mine + ' '+coin+'</div></div>'
            + '<div><div class="var">target</div><div class="val">' + target + ' '+coin+'</div></div>'
            + '<div><div class="var">mini</div><div class="val">' + mini + ' '+coin+'</div></div>'
            + '<div><div class="var">eqBTC</div><div class="val">' + eqBTC + ' BTC</div></div>'
            + '<div><div class="var">myBTC</div><div class="val">' + myBTC + ' BTC</div></div>'
            + '<div><div class="var">buy</div><div class="val">' + buy + ' '+coin+'</div></div>'
            + '<div><div class="var">sell</div><div class="val">' + sell + ' '+coin+'</div></div>'
            + '<div><div class="var">currentPrice</div><div class="val">' + currentPrice + ' BTC</div></div>'
            + '<div><div class="var">lastPrice</div><div class="val">' + lastPrice + ' B</div></div>'
            + '</div>';
        css = '<style>'
            + '#xmot #vartab { padding: 3px; font-size:10px; }'
            + '#xmot #vartab .var { width: 60px; border:  1px solid black; background: yellow; display: inline-block; padding:2px; }'
            + '#xmot #vartab .val { width: 85px;  border: 1px solid black;  background: white; display: inline-block; padding:2px; }'
            + '</style>';
        $('.debug').html(tab + css);
    }
    else {
        $('.debug').html('');
    }
}

function highlight() {
    var hour = 0;
    color = 'lightgrey';
    $('#tradeHistory table tr').each(function () {
        tmp = hour;
        hour = $(this).find('td:last-child').html();
        color = (tmp != hour ? (color == 'white' ? 'lightgrey' : 'white') : color);
        $(this).css('background', color);
    });
}

function initDisplay(str) {
    $('#xmot .display').html(str);
    $('#market_buyQuanity').val('-');
    $('#market_sellQuanity').val('-');
}

function infosDisplay() {
    $('#buyCoinEq').html(Math.round($($('.marketOrder .orderforms-hd div span').get(0)).text().split(' ')[2] / actual * 100000000) / 100000000);
    $('#sellCoinEq').html(eqBTC);
    percent = (eqBTC - targetBTC) / (targetBTC * targetOffset) * 100;
    percent = percent > 300 ? 300 : percent;
    percent = percent < -300 ? -300 : percent;
    $('#cursor').css('left', 49 + 13 * (percent) / 100 + '%');
    $('#cursor').show();
}


/*** SAVE / LOAD COOKIES ***/

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
    $('.market-con ul').prepend('<div class="xdel moneyConf"><input class="active" type="checkbox" style="margin:2px;">T<input class="conf_target" type="text" value="-" style="width:15px;margin:2px;"> O<input class="conf_offset" type="text" value="-" style="width:15px;margin:2px;"></div>');
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


/*** ALGO ***/

function switchCoin() {
	forceTrade = 0;
	i = 1;
	
    nextCoin = $('.market-con ul.selectedPro:visible').next('ul:visible');
    if (nextCoin.text() == '')
        $('.market-con ul:visible:first-child').click();
    else
        nextCoin.click();

    /* reinit */
    switchLock = 0;
    
	
}

function goTrade() {
	addHistory(buy > sell, coin, Math.abs(buy-sell).toFixed(fixed), actual, (actual*Math.abs(buy-sell)*1000).toFixed(3), new Date().toLocaleTimeString());
	if ($('#market_sellQuanity').val() > 0)
        $('.marketOrder .btn-sell').click();
    if ($('#market_buyQuanity').val() > 0)
        $('.marketOrder .btn-buy').click();
	currentPrice = '-';
	lastPrice = '-';
	initDisplay('DO NOTHING');
	forceTrade = 0;
    switchCoin();
}

function getCandles() {
    $.get('https://www.binance.com/api/v1/klines?symbol=' + coin + 'BTC&interval=1m', function (data) {
        currentPrice = data[499][4];
        lastPrice = data[498][1];
    });
}

function getCoin() {
    coin = $('.productSymbol').text().split('/')[0];
}

function xmotC() {
    getCoin();
    saveData();
    debug();
    highlight();

    $('#defaultStart').click();
    $('#inputTarget').val($('#conf_'+coin+' .conf_target').val() / 1000);
    $('#inputOffset').val($('#conf_'+coin+' .conf_offset').val());
    $('.coin').html(coin);

    targetBTC = $('#inputTarget').val();
    targetOffset = $('#inputOffset').val() / 100;
    fixed = 0;
    var tmppow = ($('#market_sellQuanity').next().next().text().split(' ')[2].split('.')[1]);
    if (tmppow == undefined) {
        multiplier = Math.pow(10, 1) / 10;
    }
    else
    {
        multiplier = Math.pow(10, tmppow.length);
        fixed = tmppow.length;
    }

    actual = $('.newest').text().split('\t')[17].trim();
    mine = Math.floor($('.marketOrder .orderforms-hd span.f-fr').text().split(' ')[7] * 100000000) / 100000000;
    target = Math.floor(targetBTC / actual * 100000000) / 100000000;
    mini = Math.ceil(0.0022 / $('.newest').text().split('\t')[17].trim() * 100000000) / 100000000;
    eqBTC = Math.round($($('.marketOrder .orderforms-hd div span').get(4)).text().split(' ')[2] * actual * 100000000) / 100000000;
    myBTC = $($('.marketOrder .orderforms-hd div span').get(0)).text().split(' ')[2];


    mini = Math.abs(target - mine) >= mini ? 0 : mini;
    buy = Math.floor(parseFloat(mini + (mine + targetOffset * target < target ? target - mine : 0)) * multiplier) / multiplier;
    sell = Math.floor(parseFloat(mini + (mine - targetOffset * target > target ? mine - target : 0)) * multiplier) / multiplier;

    infosDisplay();
	
	/* choose max margin to trigger goTrade */
	maxMarginBeforeForceTrade = 1.75;

    if ($('#conf_'+coin+' .active:checked').val() != 'on'){
        initDisplay('DISABLED');
        switchCoin();
    } else {
        initDisplay('Ok');
        getCandles();

        if ((mine == target) || (buy == sell) || parseFloat((actual * buy) - 0.0022) > parseFloat(myBTC) || i < 5 || currentPrice == '-') {
            
			/* pour forcer le trade si on sort de la marge */
            if (forceTrade == 1)
            {
				forceTrade = 0;
				/*i = 1;
				if ($('#autoTrade:checked').val() == 'on') {
					$('#market_buyQuanity').val(buy);
					$('#market_sellQuanity').val(sell);
                    goTrade();
                }*/
			} else {
				initDisplay('DO NOTHING');
                switchLock = 0;
            }
        } else {
            initDisplay('daaaaaaaaaaaah');

            switchLock = 1;
            forceTrade = 1;
            $('#market_buyQuanity').val(buy);
            $('#market_sellQuanity').val(sell);
            $('#xmot .display').html('<button onclick="goTrade()" id="go" style="padding: 2px">' + (buy > sell ? 'BUY ' : 'SELL ') + Math.round(Math.abs(buy - sell) * multiplier) / multiplier + ' ' + coin + '</button>');

            if ((buy > sell && actual > lastPrice) || (buy < sell && actual < lastPrice)) {
                /* TRAAAAAAAAAAAAAAAAAAAAAAAADE */
                if ($('#autoTrade:checked').val() == 'on') {
                    goTrade();
                }
            } else if ((Math.abs(mine - target)/mine) * 100 > coffset * maxMarginBeforeForceTrade) {
				if ($('#autoTrade:checked').val() == 'on') {
                    goTrade();
                }
			}
        }
    }
}

init();ooo;
