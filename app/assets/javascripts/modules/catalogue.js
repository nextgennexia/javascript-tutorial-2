app.modules.catalogue = (function(self) {
  var
    _filter = {},
    _$assignTraitsPopup = $('.js-popup-wrapper');

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

  function _getAssignedTraits(id) {
    var
      traits = [],
      product;

    product = app.config.products.data.find(function (product) {
      return product.id === id;
    });

    app.config.traits.data.forEach(function(trait) {
      trait['allowed_products'].includes(id) && traits.push(trait);
    });

    traits.forEach(function(trait) {
      var currentProductTrait = product.traits.find(function(productTrait) {
        trait.id = Number(trait.id);
        productTrait.id = Number(productTrait.id);

        return productTrait.id === trait.id;
      });

      trait.values.forEach(function(value) {
        var hasChecked = currentProductTrait.values.some(function(productTraitValue) {
          productTraitValue.id = Number(productTraitValue.id);
          value.id = Number(value.id);

          return value.id === productTraitValue.id;
        });
        value.checked = hasChecked;
      });
    });

    return traits;
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

  function _renderAssignedTraits(id) {
    const template = require('../templates/traits_assignation.hbs');

    _$assignTraitsPopup.html(template({
      traits: _getAssignedTraits(id),
      productId: id
    })).dialog({
      resizable: false,
      modal: true,
      dialogClass: 'traits-assignment-popup'
    });
  }

  function _serializeData($form) {
    var
      data = [],
      dataLastIndex,
      valuesLastIndex;

    $form.serializeArray().forEach(function(item) {
      var compositeAttr = item.name.split(/[[\]]{1,2}/);

      compositeAttr.length--; //последний элемент фиктивный, не нужен
      if (item.name === 'id') {
        data.push({});
        dataLastIndex = data.length - 1;
      }
      if (compositeAttr.length > 1) {
        if (!data[dataLastIndex][compositeAttr[0]]) {
          data[dataLastIndex][compositeAttr[0]] = [];
        }
        if (compositeAttr[1] === 'id') {
          data[dataLastIndex][compositeAttr[0]].push({});
          valuesLastIndex = data[dataLastIndex][compositeAttr[0]].length - 1;
        }
        data[dataLastIndex][compositeAttr[0]][valuesLastIndex][compositeAttr[1]] = compositeAttr[1] === 'id' ? Number(item.value) : item.value;
      } else {
        data[dataLastIndex][item.name] = item.name === 'id' ? Number(item.value) : item.value;
      }
    });

    return data;
  }

  function _saveTraitsAssignation(productId, traits) {
    var product;

    product = app.config.products.data.find(function (product) {
      return product.id === productId;
    });

    product.traits = traits;

    _api({
      url: '/api/products/' + productId,
      method: 'PUT',
      data: JSON.stringify(product)
    }).then(function(response) { product = response; });

    _$assignTraitsPopup.dialog('close');
  }

  function _listener() {
    $(document)
      .on('click', '.js-catalogue-filter', function() {
        _updateFilter($(this));
      })
      .on('click', '.js-assign-traits', function() {
        _renderAssignedTraits(Number($(this).closest('.js-catalogue-item').data('id')));
      })
      .on('submit', '.js-traits-assignation', function(event) {
        var $form = $(this);

        _saveTraitsAssignation($form.data('id'), _serializeData($form));
        event.preventDefault();
      });
  }

  self.load = function() {
    _init();
    _listener();
  };

  return self;
})(app.modules.catalogue || {});