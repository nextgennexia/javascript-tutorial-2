app.modules.init = ((self) => {

  function _api(data) {
    return $.ajax({
      url: data.url,
      data: data.data,
      dataType: 'json',
      type: data.type || 'GET',
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
  };

  return self;
})(app.modules.init || {});
