const eachMonthOfInterval = require('date-fns/eachMonthOfInterval');
const format = require('date-fns/format');
const { Parser } = require('json2csv');
const fs = require('fs');
const eachWeekOfInterval = require('date-fns/eachWeekOfInterval');

//1. Import coingecko-api
const CoinGecko = require('coingecko-api');

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

// Month Interval
var interval = eachMonthOfInterval({
  start: new Date(2016, 7, 1),
  end: new Date(2021, 7, 1)
});

// Week Interval
const interval2 = eachWeekOfInterval({
  start: new Date(2020, 5, 7),
  end: new Date(2021, 7, 1),
});

const prices = [];

//3. Make calls
var func = async(myInterval) => {
  // let coins = await CoinGeckoClient.coins.all();
  // console.log(coins);

  for (let index = 0; index < myInterval.length; index++) {
    const crypto = {};
    const element = myInterval[index];
    const formattedDate = format(element, 'dd-MM-yyyy');

    let coin = await CoinGeckoClient.coins.fetchHistory('bitcoin', {
      date: formattedDate,
    });

    crypto.date = formattedDate;
    crypto.price = coin.data?.market_data?.current_price.usd || null;
    
    prices.push(crypto);

    console.log(index);
  }
};

const csv = async() => {
  try {
    const parser = new Parser({fields: ['date', 'price']});
    const csv = parser.parse(prices);
    console.log(csv);
    await fs.writeFileSync('./bitcoin.csv', csv);
  } catch (err) {
    console.error(err);
  }
}

func(interval)
  .then(() => csv())
  .catch(error => console.log(error));
