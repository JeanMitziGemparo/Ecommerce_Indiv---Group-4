(function($){
  'use strict';

  function parsePrice(text){ if(!text) return 0; var t = text.replace(/[₱$,\s]/g,'').replace(/,/g,''); var n = Number(t); return isNaN(n)?0:n; }

  function productFromCard(card){
    var $card = $(card);
    var titleEl = $card.find('.card-title');
    var title = titleEl.length ? titleEl.text().trim() : $card.find('h5').text().trim() || 'Product';
    var priceEl = $card.find('.card-text');
    var price = priceEl.length ? parsePrice(priceEl.text()) : 0;
    var img = $card.find('img').attr('src') || '';
    var desc = $card.find('p').text().trim() || $card.find('img').attr('alt') || '';
    var addBtn = $card.find('a.add-to-cart');
    var id = addBtn.length && addBtn.attr('data-product-id') ? addBtn.attr('data-product-id') : null;
    if (!id){ var viewLink = $card.find('a.text-decoration-none, a.btn-outline-secondary'); id = viewLink.length ? (viewLink.attr('href')||title) : title; }
    return { id: id, title: title, price: price, image: img, description: desc, qty: 1 };
  }

  function showProduct(product){
    var $pv = $('#productViewModal');
    if (!$pv.length) return;
    $('#pvImage').attr('src', product.image || '');
    $('#pvTitle').text(product.title || '');
    $('#pvPrice').text(product.price ? ('₱' + product.price.toLocaleString()) : '');
    $('#pvDesc').text(product.description || '');
    var bsModal = new bootstrap.Modal($pv[0]);
    bsModal.show();

    var $addBtn = $('#pvAddBtn');
    $addBtn.off('click').on('click', function(){
      if(window.Cart && window.Cart.addToCart){ 
        window.Cart.addToCart(product); 
        if (window.Toast && window.Toast.show) window.Toast.show(product.title + ' added to cart'); 
        else try{ alert(product.title + ' added to cart'); }catch(e){} 
        bsModal.hide(); 
      } else { 
        var cart = JSON.parse(localStorage.getItem('nethshop_cart_v1')||'[]'); 
        cart.push(product); 
        localStorage.setItem('nethshop_cart_v1', JSON.stringify(cart)); 
        if (window.Toast && window.Toast.show) window.Toast.show(product.title + ' added to cart'); 
        else try{ alert(product.title + ' added to cart'); }catch(e){} 
        bsModal.hide(); 
      }
    });

    var $pvBuy = $('#pvBuyBtn');
    if (!$pvBuy.length){
      $pvBuy = $('<button id="pvBuyBtn" class="btn btn-success ms-2">Buy now</button>');
      $addBtn.after($pvBuy);
    }
    $pvBuy.off('click').on('click', function(){
      try { 
        if (window.Cart && window.Cart.addToCart) window.Cart.addToCart(product); 
        else { 
          var cart = JSON.parse(localStorage.getItem('nethshop_cart_v1')||'[]'); 
          cart.push(product); 
          localStorage.setItem('nethshop_cart_v1', JSON.stringify(cart)); 
        } 
      } catch(e){}
      var checkoutPath = (location.pathname.indexOf('/products/') !== -1) ? '../checkout.php' : 'checkout.php';
      window.location.href = checkoutPath;
    });
  }

  $(document).ready(function(){
    $('.card.h-100').each(function(){
      var $card = $(this);
      var prod = productFromCard(this);
      var $viewBtn = $card.find('a.btn-outline-secondary').length ? $card.find('a.btn-outline-secondary') : $card.find('a.card-title');
      if ($viewBtn.length){
        $viewBtn.off('click').on('click', function(e){ 
          e.preventDefault(); 
          e.stopPropagation(); 
          showProduct(prod); 
        });
      }
      var $addBtn = $card.find('a.add-to-cart').length ? $card.find('a.add-to-cart') : $card.find('a.btn-primary');
      if ($addBtn.length){
        $addBtn.off('click').on('click', function(e){ 
          e.preventDefault(); 
          e.stopPropagation(); 
          if (!window.IS_AUTH) {
            var modalEl = document.getElementById('loginModal');
            if (modalEl && window.bootstrap) { window.bootstrap.Modal.getOrCreateInstance(modalEl).show(); }
            else {
              var base = (function(){
                if (window.BASE_PATH) return window.BASE_PATH;
                var segs = (location.pathname || '/').split('/').filter(Boolean);
                return segs.length ? ('/' + segs[0]) : '';
              })();
              window.location.href = base + '/index.php?loginRequired=1';
            }
            return;
          }
          var pid = $addBtn.attr('data-product-id'); 
          if (pid) prod.id = pid;
          if(window.Cart && window.Cart.addToCart){ 
            window.Cart.addToCart(prod); 
            if (window.Toast && window.Toast.show) window.Toast.show(prod.title + ' added to cart'); 
            else try{ alert(prod.title + ' added to cart'); }catch(e){} 
          } else { 
            var cart = JSON.parse(localStorage.getItem('nethshop_cart_v1')||'[]'); 
            cart.push(prod); 
            localStorage.setItem('nethshop_cart_v1', JSON.stringify(cart)); 
            if (window.Toast && window.Toast.show) window.Toast.show(prod.title + ' added to cart'); 
            else try{ alert(prod.title + ' added to cart'); }catch(e){} 
          } 
        });
      }
      var $actions = $card.find('.card-body');
      if ($actions.length){
        if (!$card.find('.buy-now').length){
          var $buy = $('<a href="#" class="btn btn-success w-100 mt-2 buy-now">Buy now</a>');
          try { 
            var copyId = ($addBtn.length && $addBtn.attr) ? $addBtn.attr('data-product-id') : null; 
            if (copyId) $buy.attr('data-product-id', copyId); 
          } catch(e){}
          $actions.append($buy);
          $buy.off('click').on('click', function(ev){ 
            ev.preventDefault(); 
            ev.stopPropagation(); 
            if (!window.IS_AUTH) {
              var modalEl = document.getElementById('loginModal');
              if (modalEl && window.bootstrap) { window.bootstrap.Modal.getOrCreateInstance(modalEl).show(); }
              else {
                var base = (function(){
                  if (window.BASE_PATH) return window.BASE_PATH;
                  var segs = (location.pathname || '/').split('/').filter(Boolean);
                  return segs.length ? ('/' + segs[0]) : '';
                })();
                window.location.href = base + '/index.php?loginRequired=1';
              }
              return;
            }
            var pid = $buy.attr('data-product-id'); 
            if (pid) prod.id = pid; 
            try { 
              if (window.Cart && window.Cart.addToCart) window.Cart.addToCart(prod); 
              else { 
                var cart = JSON.parse(localStorage.getItem('nethshop_cart_v1')||'[]'); 
                cart.push(prod); 
                localStorage.setItem('nethshop_cart_v1', JSON.stringify(cart)); 
              } 
            } catch(e){}
            var checkoutPath = (location.pathname.indexOf('/products/') !== -1) ? '../checkout.php' : 'checkout.php';
            window.location.href = checkoutPath;
          });
        }
      }
    });

    var $productPageImg = $('.product-img');
    if ($productPageImg.length){
      var title = $('h1').length ? $('h1').text().trim() : document.title;
      var priceText = $('.lead').length ? $('.lead').text() : '';
      var price = parsePrice(priceText);
      var descNodes = $('main p');
      var desc = descNodes.map(function(){ return $(this).text().trim(); }).get().join('\n');
      var $addBtn = $('.add-to-cart').length ? $('.add-to-cart') : $('a.btn-primary');
      if ($addBtn.length){
        var product = { id: location.pathname + '#' + title, title: title, price: price, image: $productPageImg.attr('src') || '', description: desc, qty: 1 };
        var pid = $addBtn.attr('data-product-id'); 
        if (pid) product.id = pid;
        $addBtn.off('click').on('click', function(e){ 
          e.preventDefault(); 
          if (!window.IS_AUTH) {
            var modalEl = document.getElementById('loginModal');
            if (modalEl && window.bootstrap) { window.bootstrap.Modal.getOrCreateInstance(modalEl).show(); }
            else {
              var base = (function(){
                if (window.BASE_PATH) return window.BASE_PATH;
                var segs = (location.pathname || '/').split('/').filter(Boolean);
                return segs.length ? ('/' + segs[0]) : '';
              })();
              window.location.href = base + '/index.php?loginRequired=1';
            }
            return;
          }
          if(window.Cart && window.Cart.addToCart){ 
            window.Cart.addToCart(product); 
            if (window.Toast && window.Toast.show) window.Toast.show(product.title + ' added to cart'); 
            else try{ alert(product.title + ' added to cart'); }catch(e){} 
          } else { 
            var cart = JSON.parse(localStorage.getItem('nethshop_cart_v1')||'[]'); 
            cart.push(product); 
            localStorage.setItem('nethshop_cart_v1', JSON.stringify(cart)); 
            if (window.Toast && window.Toast.show) window.Toast.show(product.title + ' added to cart'); 
            else try{ alert(product.title + ' added to cart'); }catch(e){} 
          } 
        });
        if (!$('.buy-now[data-product-id="'+product.id+'"]').length){
          var $buyNowBtn = $('<a href="#" class="btn btn-success ms-2 buy-now">Buy now</a>');
          $addBtn.after($buyNowBtn);
          $buyNowBtn.off('click').on('click', function(ev){ 
            ev.preventDefault(); 
            if (!window.IS_AUTH) {
              var modalEl = document.getElementById('loginModal');
              if (modalEl && window.bootstrap) { window.bootstrap.Modal.getOrCreateInstance(modalEl).show(); }
              else {
                var base = (function(){
                  if (window.BASE_PATH) return window.BASE_PATH;
                  var segs = (location.pathname || '/').split('/').filter(Boolean);
                  return segs.length ? ('/' + segs[0]) : '';
                })();
                window.location.href = base + '/index.php?loginRequired=1';
              }
              return;
            }
            try { 
              if (window.Cart && window.Cart.addToCart) window.Cart.addToCart(product); 
              else { 
                var cart = JSON.parse(localStorage.getItem('nethshop_cart_v1')||'[]'); 
                cart.push(product); 
                localStorage.setItem('nethshop_cart_v1', JSON.stringify(cart)); 
              } 
            } catch(e){}
            var checkoutPath = (location.pathname.indexOf('/products/') !== -1) ? '../checkout.php' : 'checkout.php';
            window.location.href = checkoutPath;
          });
        }
      }
    }
  });

})(window.jQuery);
