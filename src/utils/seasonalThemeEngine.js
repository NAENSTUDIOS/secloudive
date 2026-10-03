/**
 * ============================================================================
 * SeCloudive Auto Seasonal & Regional Climate Theme Engine
 * Automatically detects hemisphere, climate zone, current season, and weather
 * dynamics purely in background via timezone, month, date, and geolocation telemetry.
 * Zero manual intervention required — 100% automated background detection.
 * ============================================================================
 */

// Timezone heuristics for Southern Hemisphere
const SOUTHERN_HEMISPHERE_TZ_PREFIXES = [
  'Australia/',
  'Pacific/Auckland',
  'Pacific/Chatham',
  'Pacific/Fiji',
  'America/Sao_Paulo',
  'America/Buenos_Aires',
  'America/Santiago',
  'America/Montevideo',
  'America/Asuncion',
  'America/Lima',
  'America/La_Paz',
  'Africa/Johannesburg',
  'Africa/Maputo',
  'Africa/Windhoek',
  'Africa/Gaborone',
  'Africa/Harare',
  'Indian/Mauritius',
  'Antarctica/'
];

// Timezone heuristics for Tropical / Monsoon zones
const TROPICAL_MONSOON_TZ = [
  'Asia/Kolkata',
  'Asia/Calcutta',
  'Asia/Colombo',
  'Asia/Dhaka',
  'Asia/Bangkok',
  'Asia/Ho_Chi_Minh',
  'Asia/Jakarta',
  'Asia/Manila',
  'Asia/Yangon',
  'Africa/Lagos',
  'Africa/Nairobi',
  'Africa/Accra'
];

// Timezone heuristics for Polar / Sub-Arctic zones
const ARCTIC_TZ = [
  'America/Anchorage',
  'Atlantic/Reykjavik',
  'Europe/Oslo',
  'Europe/Helsinki',
  'Europe/Stockholm',
  'America/Nuuk',
  'Asia/Yakutsk'
];

/**
 * Detects regional hemisphere and climate classification
 */
export function detectRegionAndClimate() {
  let timeZone = 'UTC';
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (e) {
    timeZone = 'UTC';
  }

  const isSouthern = SOUTHERN_HEMISPHERE_TZ_PREFIXES.some(prefix => timeZone.startsWith(prefix));
  const isTropicalMonsoon = TROPICAL_MONSOON_TZ.includes(timeZone);
  const isArctic = ARCTIC_TZ.includes(timeZone);

  const now = new Date();
  const month = now.getMonth() + 1; // 1 = Jan, 12 = Dec
  const day = now.getDate();

  let seasonKey = 'spring';
  let climateType = 'Temperate North';
  let seasonName = 'Cyber Vernal Spring';
  let atmosphericTag = 'OPTIMAL ATMOSPHERIC DYNAMICS';

  if (isTropicalMonsoon) {
    climateType = 'Tropical Monsoon Zone';
    // Monsoon season: June to September
    if (month >= 6 && month <= 9) {
      seasonKey = 'monsoon';
      seasonName = 'Equatorial Monsoon Shimmer';
      atmosphericTag = 'CYBER MONSOON RAIN DYNAMICS';
    } else if (month >= 10 && month <= 11) {
      seasonKey = 'autumn';
      seasonName = 'Post-Monsoon Golden Glow';
      atmosphericTag = 'POST-MONSOON RETREAT';
    } else if (month >= 12 || month <= 2) {
      seasonKey = 'winter';
      seasonName = 'Mild Tropical Winter Bloom';
      atmosphericTag = 'TEMPERATE WINTER COOL';
    } else {
      seasonKey = 'dry_heat';
      seasonName = 'High-Solar Radiant Summer';
      atmosphericTag = 'TROPICAL SOLAR INTENSITY';
    }
  } else if (isSouthern) {
    climateType = 'Austral Southern Hemisphere';
    // Southern hemisphere seasons are inverted
    if (month >= 12 || month <= 2) {
      seasonKey = 'summer';
      seasonName = 'Austral High-Solar Summer';
      atmosphericTag = 'SOUTHERN SOLSTICE RADIANCE';
    } else if (month >= 3 && month <= 5) {
      seasonKey = 'autumn';
      seasonName = 'Austral Amber Autumn';
      atmosphericTag = 'SOUTHERN FOLIAGE & EMBER';
    } else if (month >= 6 && month <= 8) {
      seasonKey = 'winter';
      seasonName = 'Austral Polar Frost Winter';
      atmosphericTag = 'SOUTHERN POLAR GLINT';
    } else {
      seasonKey = 'spring';
      seasonName = 'Austral Vernal Cyber-Bloom';
      atmosphericTag = 'SOUTHERN REBIRTH DYNAMICS';
    }
  } else {
    // Northern Hemisphere (Default / Global)
    if (isArctic) {
      climateType = 'Boreal Arctic Zone';
    } else {
      climateType = 'Northern Hemisphere Temperate';
    }

    if (month === 12 || month === 1 || month === 2) {
      seasonKey = 'winter';
      seasonName = isArctic ? 'Boreal Aurora Borealis Winter' : 'Glacial Cyber Frost Winter';
      atmosphericTag = 'CRYSTALLINE SUB-ZERO AESTHETIC';
    } else if (month >= 3 && month <= 5) {
      seasonKey = 'spring';
      seasonName = 'Emerald Cyber-Bloom Spring';
      atmosphericTag = 'VERNAL BIOMASS REGENERATION';
    } else if (month >= 6 && month <= 8) {
      seasonKey = 'summer';
      seasonName = 'Hyper-Radiant Solar Summer';
      atmosphericTag = 'HIGH-BANDWIDTH SOLAR SURGE';
    } else {
      seasonKey = 'autumn';
      seasonName = 'Amber Cyber-Ember Autumn';
      atmosphericTag = 'GOLDEN EQUINOX SPECTRUM';
    }
  }

  // Visual Palette Specs tailored to Dark-Mode Glassmorphism
  const palettes = {
    winter: {
      primaryAccent: '#38bdf8', // Ice Cyan
      secondaryAccent: '#818cf8', // Aurora Violet
      ambientGlow: 'rgba(56, 189, 248, 0.12)',
      particleType: 'frost-crystal',
      borderTint: 'rgba(56, 189, 248, 0.35)',
      badgeIcon: '❄️',
      heroGrad: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(99, 102, 241, 0.08) 100%)'
    },
    spring: {
      primaryAccent: '#10b981', // Emerald Spring
      secondaryAccent: '#38bdf8', // Sky
      ambientGlow: 'rgba(16, 185, 129, 0.12)',
      particleType: 'cyber-bloom',
      borderTint: 'rgba(16, 185, 129, 0.35)',
      badgeIcon: '🌸',
      heroGrad: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)'
    },
    summer: {
      primaryAccent: '#0284c7', // Deep Azure
      secondaryAccent: '#f59e0b', // Solar Gold
      ambientGlow: 'rgba(245, 158, 11, 0.10)',
      particleType: 'solar-flare',
      borderTint: 'rgba(56, 189, 248, 0.35)',
      badgeIcon: '☀️',
      heroGrad: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)'
    },
    autumn: {
      primaryAccent: '#f59e0b', // Amber Gold
      secondaryAccent: '#f43f5e', // Crimson Ember
      ambientGlow: 'rgba(245, 158, 11, 0.12)',
      particleType: 'amber-ember',
      borderTint: 'rgba(245, 158, 11, 0.35)',
      badgeIcon: '🍁',
      heroGrad: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(244, 63, 94, 0.08) 100%)'
    },
    monsoon: {
      primaryAccent: '#06b6d4', // Monsoon Cyan
      secondaryAccent: '#3b82f6', // Rain Indigo
      ambientGlow: 'rgba(6, 182, 212, 0.14)',
      particleType: 'rain-shimmer',
      borderTint: 'rgba(6, 182, 212, 0.35)',
      badgeIcon: '🌧️',
      heroGrad: 'linear-gradient(135deg, rgba(6, 182, 212, 0.16) 0%, rgba(59, 130, 246, 0.10) 100%)'
    },
    dry_heat: {
      primaryAccent: '#f97316', // Warm Orange
      secondaryAccent: '#eab308', // Solar
      ambientGlow: 'rgba(249, 115, 22, 0.12)',
      particleType: 'heat-shimmer',
      borderTint: 'rgba(249, 115, 22, 0.35)',
      badgeIcon: '✨',
      heroGrad: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 179, 8, 0.08) 100%)'
    }
  };

  const palette = palettes[seasonKey] || palettes.spring;

  return {
    timeZone,
    month,
    day,
    isSouthern,
    climateType,
    seasonKey,
    seasonName,
    atmosphericTag,
    palette
  };
}

/**
 * Injects CSS custom properties into document root dynamically
 */
export function applySeasonalThemeToDOM() {
  if (typeof document === 'undefined') return null;

  const telemetry = detectRegionAndClimate();
  const root = document.documentElement;

  root.style.setProperty('--season-primary', telemetry.palette.primaryAccent);
  root.style.setProperty('--season-secondary', telemetry.palette.secondaryAccent);
  root.style.setProperty('--season-glow', telemetry.palette.ambientGlow);
  root.style.setProperty('--season-border', telemetry.palette.borderTint);
  root.style.setProperty('--season-hero-grad', telemetry.palette.heroGrad);

  // Set data attributes for responsive CSS targeting
  root.setAttribute('data-season', telemetry.seasonKey);
  root.setAttribute('data-climate-zone', telemetry.climateType);

  return telemetry;
}
