app.modules.traits = (function(self) {
  var
    _$assignProductsPopup = $('.js-popup-wrapper'),
    _traits, _oldAssignedProducts, _newAssignedProducts;

  function _init() {
    _traits = app.config.traits.data;
    _renderTraits();
  }

  function _renderTraits() {
    const template = require('../templates/traits_form.hbs');

    $('.js-traits-wrapper').html(template({data: _traits}));
  }

  function _renderAssignedProducts(id) {
    const template = require('../templates/products_assignation.hbs');

    _$assignProductsPopup.html(template({
      products: _getLightProducts(id),
      traitId: id
    })).dialog({
      resizable: false,
      modal: true,
      dialogClass: 'products-assignment-popup'
    });
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

  function _getLightProducts(id) {
    var trait = _findTrait(id);

    return app.config.products.data.map(function(product) {
      return {
        id: product.id,
        name: product.name,
        checked: trait['allowed_products'].includes(product.id)
      }
    });
  }

  function _findTrait(id) {
    return _traits.find(function(trait) {
      return trait.id === id;
    });
  }

  Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
  };

  function _saveForm(form) {
    var $form = $(form);

    _traits.forEach(function(trait, index) {
      var newTrait = _serializeData($form).find(function(item) { return item.id === trait.id; });

      if (newTrait && newTrait.values) {
        trait.name = newTrait.name;
        trait.slug = newTrait.slug;
        trait.values = newTrait.values;
      } else {
        _traits.splice(index, 1);
      }
    });

    _api({
      url: '/api/traits',
      method: 'POST',
      data: JSON.stringify(_traits)
    });
  }

  function _saveProductsAssignation(traitId) {
    var
      assignments,
      trait = _findTrait(traitId);

    _oldAssignedProducts = trait['allowed_products'];

    assignments = {
      markedForPost: _newAssignedProducts.diff(_oldAssignedProducts),
      markedForDelete: _oldAssignedProducts.diff(_newAssignedProducts)
    };

    assignments.markedForDelete.forEach(function(id) {
      _api({url: '/api/traits/' + traitId + '/products/' + id, method: 'DELETE'}).then(function(response) { $.extend(trait, response); });
    });

    assignments.markedForPost.forEach(function(id) {
      _api({url: '/api/traits/' + traitId + '/products/' + id, method: 'POST'}).then(function(response) { $.extend(trait, response); });
    });

    _$assignProductsPopup.dialog('close');
  }

  function _listener() {
    $(document)
      .on('submit', '.js-traits-form', function(event) {
        _saveForm(this);
        event.preventDefault();
      })
      .on('submit', '.js-products-assignation', function(event) {
        var $form = $(this);

        _newAssignedProducts = $form.serializeArray().map(function(item) {
          return Number(item.value);
        });
        _saveProductsAssignation($form.data('id'));
        event.preventDefault();
      })
      .on('click', '.js-remove-trait-value', function() {
        $(this).closest('.js-trait-value').remove();
      })
      .on('click', '.js-remove-trait-row', function() {
        $(this).closest('.js-trait-row').remove();
      })
      .on('click', '.js-add-trait-value', function() {
        const template = require('../templates/traits_value.hbs');

        $(this).before(template());
      })
      .on('click', '.js-add-trait-row', function() {
        const template = require('../templates/traits_row.hbs');

        $(this).before(template());
      })
      .on('click', '.js-assign-products', function() {
        _renderAssignedProducts(Number($(this).closest('.js-trait-row').find('.js-trait-id').val()));
      });
  }

  self.load = function() {
    _init();
    _listener();
  };

  return self;
})(app.modules.traits || {});