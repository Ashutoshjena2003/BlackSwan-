const axios = require('axios');

const TD_KEY = process.env.TWELVE_DATA_KEY;
const TD_BASE = 'https://api.twelvedata.com';

// ─── Symbol Map ───────────────────────────────────────────────────────────────
const NAME_TO_SYMBOL = {
  // US Stocks
  'apple': 'AAPL', 'tesla': 'TSLA', 'nvidia': 'NVDA', 'microsoft': 'MSFT',
  'amazon': 'AMZN', 'google': 'GOOGL', 'alphabet': 'GOOGL', 'meta': 'META',
  'facebook': 'META', 'netflix': 'NFLX', 'disney': 'DIS', 'uber': 'UBER',
  'airbnb': 'ABNB', 'spotify': 'SPOT', 'snap': 'SNAP', 'snapchat': 'SNAP',
  'palantir': 'PLTR', 'coinbase': 'COIN', 'shopify': 'SHOP', 'salesforce': 'CRM',
  'oracle': 'ORCL', 'intel': 'INTC', 'amd': 'AMD', 'qualcomm': 'QCOM',
  'broadcom': 'AVGO', 'jpmorgan': 'JPM', 'jp morgan': 'JPM',
  'goldman sachs': 'GS', 'goldman': 'GS', 'morgan stanley': 'MS',
  'bank of america': 'BAC', 'visa': 'V', 'mastercard': 'MA', 'paypal': 'PYPL',
  'pfizer': 'PFE', 'moderna': 'MRNA', 'walmart': 'WMT', 'target': 'TGT',
  'costco': 'COST', 'boeing': 'BA', 'ford': 'F', 'general motors': 'GM',
  'rivian': 'RIVN', 'lucid': 'LCID', 'exxon': 'XOM', 'chevron': 'CVX',
  'starbucks': 'SBUX', 'mcdonalds': 'MCD', 'coca cola': 'KO', 'pepsi': 'PEP',
  'nike': 'NKE', 'adobe': 'ADBE', 'ibm': 'IBM', 'snowflake': 'SNOW',
  'crowdstrike': 'CRWD', 'servicenow': 'NOW', 'workday': 'WDAY', 'zoom': 'ZM',
  'robinhood': 'HOOD', 'sofi': 'SOFI', 'affirm': 'AFRM', 'doordash': 'DASH',
  'roblox': 'RBLX', 'lyft': 'LYFT', 'block': 'SQ', 'square': 'SQ',
  'datadog': 'DDOG', 'zscaler': 'ZS', 'twilio': 'TWLO', 'unity': 'U',

  // Indian Stocks (Yahoo Finance .NS suffix)
  'tcs': 'TCS.NS', 'tata consultancy': 'TCS.NS', 'tata consultancy services': 'TCS.NS',
  'reliance': 'RELIANCE.NS', 'reliance industries': 'RELIANCE.NS',
  'infosys': 'INFY.NS', 'wipro': 'WIPRO.NS',
  'hcl': 'HCLTECH.NS', 'hcl tech': 'HCLTECH.NS', 'hcl technologies': 'HCLTECH.NS',
  'hdfc bank': 'HDFCBANK.NS', 'hdfc': 'HDFCBANK.NS',
  'icici bank': 'ICICIBANK.NS', 'icici': 'ICICIBANK.NS',
  'sbi': 'SBIN.NS', 'state bank': 'SBIN.NS', 'state bank of india': 'SBIN.NS',
  'bajaj finance': 'BAJFINANCE.NS', 'bajaj': 'BAJFINANCE.NS',
  'maruti': 'MARUTI.NS', 'maruti suzuki': 'MARUTI.NS',
  'asian paints': 'ASIANPAINT.NS', 'itc': 'ITC.NS',
  'larsen': 'LT.NS', 'l&t': 'LT.NS', 'larsen and toubro': 'LT.NS',
  'tata motors': 'TATAMOTORS.NS', 'tata steel': 'TATASTEEL.NS',
  'adani': 'ADANIENT.NS', 'adani enterprises': 'ADANIENT.NS',
  'kotak': 'KOTAKBANK.NS', 'kotak bank': 'KOTAKBANK.NS',
  'axis bank': 'AXISBANK.NS',
  'sun pharma': 'SUNPHARMA.NS', 'sunpharma': 'SUNPHARMA.NS',
  'ongc': 'ONGC.NS', 'ntpc': 'NTPC.NS', 'power grid': 'POWERGRID.NS',
  'tech mahindra': 'TECHM.NS', 'ultratech': 'ULTRACEMCO.NS',
  'nestle india': 'NESTLEIND.NS', 'cipla': 'CIPLA.NS', 'dr reddy': 'DRREDDY.NS',
  'divis lab': 'DIVISLAB.NS', 'britannia': 'BRITANNIA.NS',
  'titan': 'TITAN.NS', 'bajaj auto': 'BAJAJ-AUTO.NS',

  // Crypto (Yahoo Finance format)
  'bitcoin': 'BTC-USD', 'btc': 'BTC-USD',
  'ethereum': 'ETH-USD', 'eth': 'ETH-USD',
  'solana': 'SOL-USD', 'sol': 'SOL-USD',
  'dogecoin': 'DOGE-USD', 'doge': 'DOGE-USD',
  'cardano': 'ADA-USD', 'ada': 'ADA-USD',
  'ripple': 'XRP-USD', 'xrp': 'XRP-USD',
  'binance coin': 'BNB-USD', 'bnb': 'BNB-USD',
  'avalanche': 'AVAX-USD', 'polygon': 'MATIC-USD',
  'chainlink': 'LINK-USD', 'polkadot': 'DOT-USD',
  'shiba inu': 'SHIB-USD', 'shib': 'SHIB-USD',

  // Commodities (Yahoo Finance futures)
  'gold': 'GC=F', 'silver': 'SI=F', 'platinum': 'PL=F', 'palladium': 'PA=F',
  'oil': 'CL=F', 'crude oil': 'CL=F', 'wti': 'CL=F', 'brent': 'BZ=F',
  'natural gas': 'NG=F', 'copper': 'HG=F', 'wheat': 'ZW=F', 'corn': 'ZC=F',

  // Forex (Yahoo Finance)
  'usd inr': 'USDINR=X', 'dollar rupee': 'USDINR=X', 'inr': 'USDINR=X',
  'eur usd': 'EURUSD=X', 'euro': 'EURUSD=X',
  'gbp usd': 'GBPUSD=X', 'pound': 'GBPUSD=X',
  'usd jpy': 'JPY=X', 'yen': 'JPY=X',
  'usd cad': 'CAD=X', 'usd aud': 'AUD=X',

  // ETFs
  'spy': 'SPY', 's&p 500': 'SPY', 'sp500': 'SPY',
  'qqq': 'QQQ', 'nasdaq etf': 'QQQ',
  'voo': 'VOO', 'vti': 'VTI', 'arkk': 'ARKK', 'dia': 'DIA',
};

function detectAssetType(symbol) {
  if (symbol.endsWith('.NS') || symbol.endsWith('.BO')) return 'indian_stock';
  if (symbol.endsWith('=F')) return 'commodity';
  if (symbol.endsWith('=X')) return 'forex';
  if (symbol.includes('-USD') || symbol.includes('/USD')) return 'crypto';
  return 'stock';
}

function isYahooOnlySymbol(symbol, type) {
  // Indian stocks, commodities, forex always go to Yahoo
  return ['indian_stock', 'commodity', 'forex'].includes(type);
}

// ─── Symbol Resolution ────────────────────────────────────────────────────────
async function resolveSymbol(input) {
  const lower = input.toLowerCase().trim();

  if (NAME_TO_SYMBOL[lower]) {
    const sym = NAME_TO_SYMBOL[lower];
    return { symbol: sym, type: detectAssetType(sym), name: input };
  }

  const upper = input.trim().toUpperCase();
  if (/^[A-Z0-9\.\=\^\-\/]+$/.test(upper) && upper.length <= 12) {
    return { symbol: upper, type: detectAssetType(upper), name: input };
  }

  // Try Twelve Data search for US stocks
  try {
    const res = await axios.get(`${TD_BASE}/symbol_search`, {
      params: { symbol: input, apikey: TD_KEY },
      timeout: 8000
    });
    const results = res.data.data || [];
    if (results.length > 0) {
      const best = results.find(r => r.country === 'United States' && r.instrument_type === 'Common Stock')
        || results[0];
      return { symbol: best.symbol, type: 'stock', name: best.instrument_name || input };
    }
  } catch (err) {
    console.warn('[resolve] Twelve Data search failed:', err.message);
  }

  return { symbol: upper, type: 'stock', name: input };
}

// ─── Twelve Data Fetcher (US stocks — richest data) ──────────────────────────
async function fetchFromTwelveData(symbol) {
  console.log(`[marketData] Trying Twelve Data for ${symbol}...`);
  const [quoteRes, statsRes] = await Promise.allSettled([
    axios.get(`${TD_BASE}/quote`, { params: { symbol, apikey: TD_KEY }, timeout: 8000 }),
    axios.get(`${TD_BASE}/statistics`, { params: { symbol, apikey: TD_KEY }, timeout: 8000 })
  ]);

  const qData = quoteRes.status === 'fulfilled' ? quoteRes.value.data : null;
  if (!qData || qData.status === 'error' || !qData.close) {
    throw new Error(qData?.message || 'Twelve Data returned no data');
  }

  const price = parseFloat(qData.close);
  const open = parseFloat(qData.open);
  const change = price - open;
  const changePct = (change / open) * 100;

  const stats = statsRes.status === 'fulfilled' ? statsRes.value.data?.statistics : null;
  const val = stats?.valuations_metrics || {};
  const fin = stats?.financials || {};
  const stk = stats?.stock_statistics || {};
  const wk52 = qData['52_week'] || {};

  console.log(`[marketData] ✅ Twelve Data success for ${symbol}`);
  return {
    price, change, changePct,
    high52: parseFloat(wk52.high) || price * 1.3,
    low52: parseFloat(wk52.low) || price * 0.7,
    volume: parseInt(qData.volume) || 0,
    marketCap: parseFloat(val.market_capitalization) || 0,
    pe: parseFloat(val.trailing_pe) || NaN,
    forwardPE: parseFloat(val.forward_pe) || NaN,
    eps: parseFloat(val.diluted_eps_ttm) || NaN,
    beta: parseFloat(stk.beta) || NaN,
    dividendYield: parseFloat(stk.dividend_yield) || NaN,
    profitMargin: parseFloat(fin.profit_margin) || NaN,
    operatingMargin: parseFloat(fin.operating_margin) || NaN,
    returnOnEquity: parseFloat(fin.return_on_equity) || NaN,
    analystTarget: NaN,
    longName: qData.name || symbol,
    currency: qData.currency || 'USD',
    exchange: qData.exchange || '',
    source: 'Twelve Data'
  };
}

// ─── Yahoo Finance Fetcher (all assets — free, no key) ───────────────────────
async function fetchFromYahoo(symbol) {
  console.log(`[marketData] Trying Yahoo Finance for ${symbol}...`);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`;
  const res = await axios.get(url, {
    params: { interval: '1d', range: '1y' },
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
    timeout: 10000
  });

  const result = res.data?.chart?.result?.[0];
  if (!result) throw new Error('No data from Yahoo Finance');

  const meta = result.meta;
  const price = meta.regularMarketPrice;
  const prevClose = meta.chartPreviousClose || meta.previousClose || price;
  const change = price - prevClose;
  const changePct = (change / prevClose) * 100;

  console.log(`[marketData] ✅ Yahoo Finance success for ${symbol} — price: ${price}`);
  return {
    price, change, changePct,
    high52: meta.fiftyTwoWeekHigh || price * 1.3,
    low52: meta.fiftyTwoWeekLow || price * 0.7,
    volume: meta.regularMarketVolume || 0,
    marketCap: meta.marketCap || 0,
    pe: NaN, forwardPE: NaN, eps: NaN, beta: NaN,
    dividendYield: NaN, profitMargin: NaN, operatingMargin: NaN, returnOnEquity: NaN,
    analystTarget: NaN,
    longName: meta.longName || meta.shortName || symbol,
    currency: meta.currency || 'USD',
    exchange: meta.exchangeName || '',
    source: 'Yahoo Finance'
  };
}

// ─── Yahoo Fundamentals (quoteSummary) ───────────────────────────────────────
async function fetchYahooFundamentals(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}`;
    const res = await axios.get(url, {
      params: { modules: 'defaultKeyStatistics,financialData,summaryProfile' },
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      timeout: 10000
    });

    const s = res.data?.quoteSummary?.result?.[0];
    if (!s) return {};

    const ks = s.defaultKeyStatistics || {};
    const fd = s.financialData || {};
    const sp = s.summaryProfile || {};

    return {
      pe: ks.trailingPE?.raw,
      forwardPE: ks.forwardPE?.raw,
      eps: ks.trailingEps?.raw,
      beta: ks.beta?.raw,
      dividendYield: ks.dividendYield?.raw,
      profitMargin: fd.profitMargins?.raw,
      operatingMargin: fd.operatingMargins?.raw,
      returnOnEquity: fd.returnOnEquity?.raw,
      analystTarget: fd.targetMeanPrice?.raw,
      sector: sp.sector,
      industry: sp.industry,
    };
  } catch (err) {
    console.warn('[marketData] Yahoo fundamentals failed:', err.message);
    return {};
  }
}

// ─── Smart Fetch: Twelve Data first, Yahoo as fallback ───────────────────────
async function fetchQuoteWithFallback(symbol, type) {
  // Yahoo-only assets: Indian stocks, commodities, forex
  if (isYahooOnlySymbol(symbol, type)) {
    const data = await fetchFromYahoo(symbol);
    // Also enrich with Yahoo fundamentals for Indian stocks
    if (type === 'indian_stock') {
      const extras = await fetchYahooFundamentals(symbol);
      return { ...data, ...extras, source: 'Yahoo Finance' };
    }
    return data;
  }

  // For US stocks and crypto: try Twelve Data first, fall back to Yahoo
  try {
    const tdData = await fetchFromTwelveData(symbol);
    // Enrich with Yahoo fundamentals if TD missing some fields
    if (isNaN(tdData.pe) || isNaN(tdData.beta)) {
      const extras = await fetchYahooFundamentals(symbol);
      return {
        ...tdData,
        pe: isNaN(tdData.pe) ? extras.pe : tdData.pe,
        forwardPE: isNaN(tdData.forwardPE) ? extras.forwardPE : tdData.forwardPE,
        eps: isNaN(tdData.eps) ? extras.eps : tdData.eps,
        beta: isNaN(tdData.beta) ? extras.beta : tdData.beta,
        dividendYield: isNaN(tdData.dividendYield) ? extras.dividendYield : tdData.dividendYield,
        profitMargin: isNaN(tdData.profitMargin) ? extras.profitMargin : tdData.profitMargin,
        operatingMargin: isNaN(tdData.operatingMargin) ? extras.operatingMargin : tdData.operatingMargin,
        returnOnEquity: isNaN(tdData.returnOnEquity) ? extras.returnOnEquity : tdData.returnOnEquity,
        analystTarget: isNaN(tdData.analystTarget) ? extras.analystTarget : tdData.analystTarget,
        sector: tdData.sector || extras.sector,
        industry: tdData.industry || extras.industry,
        source: 'Twelve Data + Yahoo Finance'
      };
    }
    return tdData;
  } catch (tdErr) {
    console.warn(`[marketData] Twelve Data failed (${tdErr.message}), falling back to Yahoo...`);
    const yahooData = await fetchFromYahoo(symbol);
    // Enrich Yahoo with fundamentals
    const extras = await fetchYahooFundamentals(symbol);
    return { ...yahooData, ...extras, source: 'Yahoo Finance (fallback)' };
  }
}

// ─── Formatters ──────────────────────────────────────────────────────────────
function formatMarketCap(num) {
  if (!num || isNaN(num) || num === 0) return 'N/A';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

function getCapLabel(num) {
  if (!num || num === 0) return 'N/A';
  if (num >= 200e9) return 'Mega Cap';
  if (num >= 10e9) return 'Large Cap';
  if (num >= 2e9) return 'Mid Cap';
  if (num >= 300e6) return 'Small Cap';
  return 'Micro Cap';
}

function getRangeLabel(price, low, high) {
  const range = high - low;
  if (!range) return 'N/A';
  const pct = ((price - low) / range) * 100;
  if (pct >= 80) return `Near 52w high (${pct.toFixed(0)}% of range)`;
  if (pct >= 40) return `Mid range (${pct.toFixed(0)}% of range)`;
  return `Near 52w low (${pct.toFixed(0)}% of range)`;
}

function fmt(val, suffix = '', prefix = '', decimals = 2) {
  if (val === undefined || val === null || isNaN(val)) return 'N/A';
  return `${prefix}${parseFloat(val).toFixed(decimals)}${suffix}`;
}

function getSectorLabel(type) {
  const map = { crypto: 'Cryptocurrency', commodity: 'Commodities', forex: 'Foreign Exchange', indian_stock: 'Indian Equity (NSE)' };
  return map[type] || 'Equity';
}

// ─── Main Export ─────────────────────────────────────────────────────────────
async function getMarketData(companyInput) {
  const resolved = await resolveSymbol(companyInput);
  const { symbol, type, name } = resolved;

  console.log(`[marketData] Resolved "${companyInput}" → ${symbol} (${type})`);

  const data = await fetchQuoteWithFallback(symbol, type);

  const changeDir = data.change >= 0 ? 'up' : 'down';
  const priceDecimals = data.price < 1 ? 6 : 2;
  const currencyPrefix = data.currency === 'INR' ? '₹' : (data.currency === 'EUR' ? '€' : '$');

  console.log(`[marketData] 📊 Source: ${data.source} | Price: ${data.price} | Change: ${data.change}`);

  return {
    ticker: symbol,
    companyName: data.longName || name || symbol,
    sector: data.sector || getSectorLabel(type),
    industry: data.industry || type,
    assetType: type,
    dataSource: data.source,
    isLive: true,
    quote: {
      price: `${currencyPrefix}${data.price.toFixed(priceDecimals)}`,
      priceRaw: data.price,
      change: `${data.change >= 0 ? '+' : ''}${data.change.toFixed(priceDecimals)} (${data.changePct.toFixed(2)}%)`,
      changeDir,
      volume: data.volume ? data.volume.toLocaleString() : 'N/A',
      currency: data.currency,
      exchange: data.exchange,
    },
    financials: {
      marketCap: formatMarketCap(data.marketCap),
      marketCapRaw: data.marketCap,
      marketCapLabel: getCapLabel(data.marketCap),
      peRatio: fmt(data.pe, '', '', 1),
      forwardPE: fmt(data.forwardPE, '', '', 1),
      eps: fmt(data.eps, '', currencyPrefix),
      dividendYield: !data.dividendYield || isNaN(data.dividendYield) ? 'None' : `${(data.dividendYield * 100).toFixed(2)}%`,
      profitMargin: !data.profitMargin || isNaN(data.profitMargin) ? 'N/A' : `${(data.profitMargin * 100).toFixed(1)}%`,
      operatingMargin: !data.operatingMargin || isNaN(data.operatingMargin) ? 'N/A' : `${(data.operatingMargin * 100).toFixed(1)}%`,
      returnOnEquity: !data.returnOnEquity || isNaN(data.returnOnEquity) ? 'N/A' : `${(data.returnOnEquity * 100).toFixed(1)}%`,
      beta: fmt(data.beta),
      analystTarget: !data.analystTarget || isNaN(data.analystTarget) ? 'N/A' : `${currencyPrefix}${data.analystTarget.toFixed(2)}`,
    },
    range52w: {
      display: `${currencyPrefix}${data.low52.toFixed(priceDecimals)} – ${currencyPrefix}${data.high52.toFixed(priceDecimals)}`,
      low: data.low52,
      high: data.high52,
      label: getRangeLabel(data.price, data.low52, data.high52)
    }
  };
}

module.exports = { getMarketData };