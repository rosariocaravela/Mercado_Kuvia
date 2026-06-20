const router = require('./src/routes/storeRoutes');
console.log('stack count', router.stack.length);
router.stack.forEach((layer, index) => {
  if (layer.route) {
    console.log(index, layer.route.path, layer.route.methods);
  } else {
    console.log(index, '<middleware>', layer.name);
  }
});
