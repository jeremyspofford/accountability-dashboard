#!/usr/bin/env node
/**
 * Analyze stock trades and add insider trading signals
 * Usage: node scripts/analyze-trades.js
 */

const fs = require('fs');
const path = require('path');

const TRADES_FILE = path.join(__dirname, '../src/data/trades-by-member.json');
const MEMBERS_FILE = path.join(__dirname, '../src/data/members.json');

// Thresholds for suspicious activity
const SUSPICIOUS_RETURN_THRESHOLD = 10; // 10% excess return
const RAPID_TRADING_DAYS = 7; // Multiple trades in same ticker within 7 days
const LARGE_TRADE_THRESHOLD = 50000; // $50k+

function calculateTradingSignals(memberTrades, bioguideId) {
  const signals = [];
  const tradesByTicker = {};
  
  // Group trades by ticker
  for (const trade of memberTrades) {
    if (!tradesByTicker[trade.ticker]) {
      tradesByTicker[trade.ticker] = [];
    }
    tradesByTicker[trade.ticker].push(trade);
  }
  
  // Analyze each trade
  for (const trade of memberTrades) {
    const flags = [];
    
    // Flag 1: Unusually high returns
    if (Math.abs(trade.excessReturn) > SUSPICIOUS_RETURN_THRESHOLD) {
      flags.push({
        type: 'unusual_return',
        severity: Math.abs(trade.excessReturn) > 20 ? 'high' : 'medium',
        description: `${trade.excessReturn > 0 ? 'Gained' : 'Lost'} ${Math.abs(trade.excessReturn).toFixed(1)}% excess return`,
        return_pct: trade.excessReturn
      });
    }
    
    // Flag 2: Large trade size
    if (trade.tradeSizeUsd > LARGE_TRADE_THRESHOLD) {
      flags.push({
        type: 'large_trade',
        severity: trade.tradeSizeUsd > 100000 ? 'high' : 'medium',
        description: `Large ${trade.transaction.toLowerCase()} of $${trade.tradeSizeUsd.toLocaleString()}`,
        amount: trade.tradeSizeUsd
      });
    }
    
    // Flag 3: Rapid trading in same stock
    const tickerTrades = tradesByTicker[trade.ticker];
    if (tickerTrades.length > 1) {
      const tradeDate = new Date(trade.tradedDate);
      const nearbyTrades = tickerTrades.filter(t => {
        const otherDate = new Date(t.tradedDate);
        const daysDiff = Math.abs((tradeDate - otherDate) / (1000 * 60 * 60 * 24));
        return daysDiff <= RAPID_TRADING_DAYS && t !== trade;
      });
      
      if (nearbyTrades.length > 0) {
        flags.push({
          type: 'rapid_trading',
          severity: 'medium',
          description: `${nearbyTrades.length + 1} trades in ${trade.ticker} within ${RAPID_TRADING_DAYS} days`,
          trade_count: nearbyTrades.length + 1
        });
      }
    }
    
    // Flag 4: Suspicious timing (sold before drop or bought before gain)
    if (trade.transaction === 'Sale' && trade.excessReturn < -5) {
      flags.push({
        type: 'suspicious_timing',
        severity: 'high',
        description: `Sold before ${Math.abs(trade.excessReturn).toFixed(1)}% drop`,
        pattern: 'avoided_loss'
      });
    } else if (trade.transaction === 'Purchase' && trade.excessReturn > 5) {
      flags.push({
        type: 'suspicious_timing',
        severity: 'high',
        description: `Bought before ${trade.excessReturn.toFixed(1)}% gain`,
        pattern: 'captured_gain'
      });
    }
    
    // Flag 5: Delayed disclosure (more than 30 days)
    const tradeDate = new Date(trade.tradedDate);
    const fileDate = new Date(trade.filedDate);
    const daysToFile = (fileDate - tradeDate) / (1000 * 60 * 60 * 24);
    
    if (daysToFile > 30) {
      flags.push({
        type: 'late_disclosure',
        severity: daysToFile > 45 ? 'high' : 'medium',
        description: `Filed ${Math.floor(daysToFile)} days after trade (STOCK Act requires 45 days)`,
        days_late: Math.floor(daysToFile - 45)
      });
    }
    
    // Add flags to trade
    if (flags.length > 0) {
      trade.suspicious_flags = flags;
      trade.risk_score = calculateRiskScore(flags);
    }
  }
  
  return memberTrades;
}

function calculateRiskScore(flags) {
  let score = 0;
  for (const flag of flags) {
    if (flag.severity === 'high') score += 3;
    else if (flag.severity === 'medium') score += 2;
    else score += 1;
  }
  return Math.min(score, 10); // Cap at 10
}

function generateMemberSummary(memberTrades) {
  const totalTrades = memberTrades.length;
  const flaggedTrades = memberTrades.filter(t => t.suspicious_flags).length;
  const totalRisk = memberTrades.reduce((sum, t) => sum + (t.risk_score || 0), 0);
  const avgReturn = memberTrades.reduce((sum, t) => sum + t.excessReturn, 0) / totalTrades;
  
  const suspiciousTypes = {};
  for (const trade of memberTrades) {
    if (trade.suspicious_flags) {
      for (const flag of trade.suspicious_flags) {
        suspiciousTypes[flag.type] = (suspiciousTypes[flag.type] || 0) + 1;
      }
    }
  }
  
  return {
    total_trades: totalTrades,
    flagged_trades: flaggedTrades,
    flag_rate: ((flaggedTrades / totalTrades) * 100).toFixed(1),
    total_risk_score: totalRisk,
    avg_risk_per_trade: (totalRisk / totalTrades).toFixed(2),
    avg_excess_return: avgReturn.toFixed(2),
    suspicious_patterns: suspiciousTypes,
    overall_suspicion_level: totalRisk > 50 ? 'high' : totalRisk > 20 ? 'medium' : 'low'
  };
}

function main() {
  console.log('Loading trades and member data...');
  const trades = JSON.parse(fs.readFileSync(TRADES_FILE, 'utf8'));
  const members = JSON.parse(fs.readFileSync(MEMBERS_FILE, 'utf8'));
  
  // Create member lookup
  const memberLookup = {};
  for (const member of members) {
    memberLookup[member.bioguide_id] = member;
  }
  
  console.log(`Analyzing trades for ${Object.keys(trades).length} members...`);
  let processedMembers = 0;
  let totalFlagged = 0;
  
  const memberSummaries = {};
  
  for (const [bioguideId, memberTrades] of Object.entries(trades)) {
    const analyzed = calculateTradingSignals(memberTrades, bioguideId);
    trades[bioguideId] = analyzed;
    
    // Generate summary
    const summary = generateMemberSummary(analyzed);
    memberSummaries[bioguideId] = summary;
    
    totalFlagged += summary.flagged_trades;
    processedMembers++;
    
    if (processedMembers % 50 === 0) {
      console.log(`Processed ${processedMembers} members...`);
    }
  }
  
  // Write updated trades
  fs.writeFileSync(TRADES_FILE, JSON.stringify(trades, null, 2));
  
  // Write summary report
  const summaryFile = path.join(__dirname, '../src/data/trading-summaries.json');
  fs.writeFileSync(summaryFile, JSON.stringify(memberSummaries, null, 2));
  
  console.log(`✅ Analyzed ${processedMembers} members' trades`);
  console.log(`📊 Flagged ${totalFlagged} suspicious trades`);
  console.log(`📝 Summary written to trading-summaries.json`);
  
  // Top suspicious traders
  const topTraders = Object.entries(memberSummaries)
    .filter(([id, s]) => s.total_risk_score > 10)
    .sort((a, b) => b[1].total_risk_score - a[1].total_risk_score)
    .slice(0, 10);
  
  console.log('\n🚨 Top 10 Most Suspicious Traders:');
  for (const [bioguideId, summary] of topTraders) {
    const member = memberLookup[bioguideId];
    if (member) {
      console.log(`  ${member.full_name} (${member.party}-${member.state}): Risk Score ${summary.total_risk_score}, ${summary.flagged_trades}/${summary.total_trades} flagged`);
    }
  }
}

main();
