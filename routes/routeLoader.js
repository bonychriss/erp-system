const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  const routesPath = path.join(__dirname);
  const routeFiles = fs.readdirSync(routesPath).filter(file =>
    file !== 'routeLoader.js' && file.endsWith('.js')
  );

  routeFiles.forEach(file => {
    const route = require(path.join(routesPath, file));

    if (typeof route === 'function') {
      const basePath = `/api/${file.replace('.js', '')}`;
      app.use(basePath, route);
      console.log(`🛣️  Loaded route: ${basePath}`);
    } else {
      console.warn(`⚠️  Skipped ${file} because it does not export a router function.`);
    }
  });
};
