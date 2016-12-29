app.modules.init = ((self) => {

  function _api(data) {
    return $.ajax({
      url: data.url,
      data: JSON.stringify(data.data),
      contentType: 'application/json',
      dataType: 'json',
      method: data.method || 'GET',
      beforeSend: data.beforeSend
    });
  }

  function _handlebarsExampleOfUsage() {
    const titleTemplate = require('../templates/title_example.hbs');
    $('.js-title-example').html(titleTemplate({title: 'Javascript tutorial part 2'}));
  }

  function _getProducts() {
    _api({url: '/api/products'}).then((response) => { app.config.products = response; });
  }

  function _getTraits() {
    _api({url: '/api/traits'}).then((response) => { app.config.traits = response; });
  }

  function _init() {
    _getProducts();
    _getTraits();
    _handlebarsExampleOfUsage(); // Метод, показываеющий как работать с handlebars-loader
  }

  self.ready = () => {
    _init();
  };

  return self;
})(app.modules.init || {});
