const versions = [
  '1.52.0', '1.51.0', '1.50.1', '1.50.0', '1.49.1', '1.49.0',
  '1.48.2', '1.48.1', '1.48.0', '1.47.2', '1.47.0', '1.46.0',
  '1.45.0', '1.44.0', '1.43.0', '1.42.0', '1.41.0', '1.40.0'
];

async function check() {
  for (const v of versions) {
    try {
      const url = `https://playwright.azureedge.net/builds/driver/playwright-${v}-win32_x64.zip`;
      const res = await fetch(url, { method: 'HEAD' });
      if (res.status === 200) {
        console.log(`FOUND: ${v} -> ${res.status}`);
      } else {
        console.log(`${v} -> ${res.status}`);
      }
    } catch (e) {
      console.log(`${v} -> ${e.message}`);
    }
  }
}

check();
