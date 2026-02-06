#!/usr/bin/env tsx
/**
 * Add impact_analysis to all trump-promises.json entries
 */

import * as fs from 'fs';
import * as path from 'path';

const dataPath = path.join(__dirname, '../src/data/trump-promises.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Impact analysis mapping based on promise categories
const impactMap: Record<string, any> = {
  tariffs: {
    workers: 'negative',
    middle_class: 'negative',
    wealthy: 'neutral',
    corporations: 'mixed',
    environment: 'neutral'
  },
  immigration_restriction: {
    workers: 'negative',
    middle_class: 'negative',
    wealthy: 'neutral',
    corporations: 'negative',
    environment: 'neutral'
  },
  tax_cuts_wealthy: {
    workers: 'negative',
    middle_class: 'negative',
    wealthy: 'positive',
    corporations: 'positive',
    environment: 'neutral'
  },
  deregulation: {
    workers: 'negative',
    middle_class: 'negative',
    wealthy: 'positive',
    corporations: 'positive',
    environment: 'negative'
  },
  fossil_fuels: {
    workers: 'mixed',
    middle_class: 'negative',
    wealthy: 'positive',
    corporations: 'positive',
    environment: 'negative'
  },
  healthcare_cuts: {
    workers: 'negative',
    middle_class: 'negative',
    wealthy: 'positive',
    corporations: 'positive',
    environment: 'neutral'
  },
  military_spending: {
    workers: 'mixed',
    middle_class: 'negative',
    wealthy: 'neutral',
    corporations: 'positive',
    environment: 'neutral'
  },
  civil_rights_rollback: {
    workers: 'negative',
    middle_class: 'mixed',
    wealthy: 'neutral',
    corporations: 'neutral',
    environment: 'neutral'
  },
  neutral_policy: {
    workers: 'mixed',
    middle_class: 'mixed',
    wealthy: 'mixed',
    corporations: 'mixed',
    environment: 'mixed'
  }
};

// Categorize each promise type
const promiseCategories: Record<string, string> = {
  'tariffs-china': 'tariffs',
  'tariffs-universal': 'tariffs',
  'tariffs-mexico-canada': 'tariffs',
  'end-trade-deficits': 'neutral_policy',
  'bring-jobs-back': 'neutral_policy',
  'border-wall': 'immigration_restriction',
  'mass-deportation': 'immigration_restriction',
  'end-birthright-citizenship': 'immigration_restriction',
  'remain-in-mexico': 'immigration_restriction',
  'end-catch-and-release': 'immigration_restriction',
  'death-penalty-traffickers': 'neutral_policy',
  'extreme-vetting': 'immigration_restriction',
  'ban-sanctuary-cities': 'immigration_restriction',
  'end-ukraine-war': 'neutral_policy',
  'nato-funding': 'neutral_policy',
  'china-tough': 'neutral_policy',
  'middle-east-peace': 'neutral_policy',
  'iran-deal': 'neutral_policy',
  'strengthen-alliances': 'neutral_policy',
  'lower-prices': 'neutral_policy',
  'no-tax-tips': 'neutral_policy',
  'no-tax-overtime': 'neutral_policy',
  'no-tax-social-security': 'neutral_policy',
  'extend-tax-cuts': 'neutral_policy',
  'corporate-tax-cut': 'tax_cuts_wealthy',
  'deregulation': 'deregulation',
  'interest-rates-lower': 'neutral_policy',
  'energy-dominance': 'fossil_fuels',
  'paris-climate-exit': 'fossil_fuels',
  'anwr-drilling': 'fossil_fuels',
  'end-ev-mandate': 'fossil_fuels',
  'energy-independence': 'fossil_fuels',
  'abolish-dept-education': 'deregulation',
  'end-woke-education': 'civil_rights_rollback',
  'patriotic-education': 'neutral_policy',
  'end-tenure': 'deregulation',
  'school-choice': 'neutral_policy',
  'end-dei': 'civil_rights_rollback',
  'repeal-obamacare': 'healthcare_cuts',
  'lower-drug-prices': 'neutral_policy',
  'health-transparency': 'neutral_policy',
  'protect-medicare': 'neutral_policy',
  'drain-swamp': 'deregulation',
  'schedule-f': 'deregulation',
  'term-limits-congress': 'neutral_policy',
  'ban-lobbying': 'neutral_policy',
  'downsize-bureaucracy': 'deregulation',
  'relocate-agencies': 'neutral_policy',
  'end-weaponization-doj': 'neutral_policy',
  'pardon-j6': 'civil_rights_rollback',
  'war-on-cartels': 'neutral_policy',
  'law-and-order': 'neutral_policy',
  'end-crime-wave': 'neutral_policy',
  'police-immunity': 'civil_rights_rollback',
  'military-spending-increase': 'military_spending',
  'end-woke-military': 'civil_rights_rollback',
  'missile-defense': 'military_spending',
  'space-force': 'military_spending',
  'veteran-healthcare': 'neutral_policy',
  'free-speech': 'neutral_policy',
  'section-230': 'neutral_policy',
  'protect-2a': 'neutral_policy',
  'ban-transgender-sports': 'civil_rights_rollback',
  'end-transgender-youth': 'civil_rights_rollback',
  'protect-religious-liberty': 'neutral_policy',
  'ban-critical-race-theory': 'civil_rights_rollback',
  'baby-bonuses': 'neutral_policy'
};

// Add impact_analysis to each promise
for (const promise of data.promises) {
  if (!promise.impact_analysis) {
    const category = promiseCategories[promise.id] || 'neutral_policy';
    promise.impact_analysis = { ...impactMap[category] };
  }
}

// Write back
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('✅ Added impact_analysis to all promises');
