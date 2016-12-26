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

  function _init() {
    _handlebarsExampleOfUsage(); // Метод, показываеющий как работать с handlebars-loader
  }

  self.ready = () => {
    _init();
    _api({url: '/api/products/1', data: {traits: [1,2,3]}, method: 'PUT'}).then((response) => { console.log(response); });

  };

  return self;
})(app.modules.init || {});
