app.modules.catalogue = (function(self) {
  var _filter = {};

  function _init() {
    _renderProducts();
    _renderFilter();
  }

  function _api(data) {
    return $.ajax({
      url: data.url,
      data: data.data,
      contentType: 'application/json',
      dataType: 'json',
      method: data.method || 'GET',
      beforeSend: data.beforeSend
    });
  }

  function _renderProducts() {
    const template = require('../templates/catalogue.hbs');

    $('.js-catalogue-products-wrapper').html(template(app.config.products));
  }

  function _renderFilter() {
    const template = require('../templates/filter.hbs');

    $('.js-catalogue-filter-wrapper').html(template(app.config.traits));
  }

  function _updateFilter($checkbox) {
    var
      name = $checkbox.attr('name'),
      value = parseInt($checkbox.val()),
      checked = $checkbox.is(':checked');

    if (checked) {
      if (_filter.hasOwnProperty(name)) {
        !_filter[name].includes(value) && _filter[name].push(value);
      } else {
        _filter[name] = [value];
      }
    } else {
      _filter[name] && _filter[name].forEach(function(filterValue, index) {
        (filterValue === value) && _filter[name].splice(index, 1);
      });
    }

    _refreshProducts();
  }

  function _refreshProducts() {
    _api({
      url: '/api/products',
      data: _filter
    }).then(function(response) {
      app.config.products = response;
      _renderProducts();
    });
  }

  function _listener() {
    $(document)
      .on('click', '.js-catalogue-filter', function() {
        _updateFilter($(this));
      });
  }

  self.load = function() {
    _init();
    _listener();
  };

  return self;
})(app.modules.catalogue || {});