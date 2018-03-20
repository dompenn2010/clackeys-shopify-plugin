export function updateVerb(verb) {
  return {
    type: 'UPDATE_VERB',
    payload: {
      verb,
    },
  };
}

export function updatePath(path) {
  return {
    type: 'UPDATE_PATH',
    payload: {
      path,
    },
  };
}

export function updateParams(params) {
  return {
    type: 'UPDATE_PARAMS',
    payload: {
      params,
    },
  };
}

function grabFirstThreeOrders(orders){
  var i = 0,
    res = [];
  for(i; i < 5; i++){
    res.push(orders.orders[i]);
  }

  debugger;
  return res;
}

function getVariantCount(orders){
  
  
  
}


function restructureOrders(rawOrders){
  var orders = [];
  var variants = {};
  var products = {};
  
  rawOrders.orders.forEach(function(orderI){
    var order = {};
    
    order.order_id = orderI.id;
    order.email = orderI.email;
    order.order_number = orderI.order_number;
    order.products = [];
      
      orderI.line_items.forEach(function(productI){
        var product = {};
        
        product.variant_id = productI.variant_id;
        product.product_id = productI.product_id;
        product.variant_title = productI.variant_title;
        product.title = productI.title;
        product.quantity = productI.quantity;
        
        if (products[product.title]){
          products[product.title].quantity+= product.quantity;
          
        }else{
          var aProduct = {
            product_id: product.product_id,
            quantity: product.quantity
          } 
          products[product.title] = aProduct;
        }

        if (variants[product.variant_title]){
          variants[product.variant_title].quantity+= product.quantity;
          
        }else{
          var aVariant = {
            variant_id: product.variant_id,
            quantity: product.quantity
          } 
          
          variants[product.variant_title] = aVariant;
        }       
        order.products.push(product);
      });

    orders.push(order);
  });
  var combined = {
    products: products,
    variants: variants
  };
  return combined;  
}

/*
    orders[
      order# : {
        id
        email
        order_number
        products : [        
          product_id : {
            title
            variants: [
              variant_id: {
                variant_title
                quantity
              },
            ] 
          },        
        ]
      }
    }
*/




export function sendRequest(requestFields) {
  const { verb, path, params } = requestFields;

  const fetchOptions = {
    method: verb,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
  }

  if (verb !== 'GET') {
    fetchOptions['body'] = params
  }

  return dispatch => {
    dispatch(requestStartAction());

    return fetch(`/api${path}`, fetchOptions)
      .then(response => response.json())
     // .then(response => grabFirstThreeOrders(response))
      .then(response => restructureOrders(response))
      .then(json => dispatch(requestCompleteAction(json)))
      .catch(error => {
        dispatch(requestErrorAction(error));
      });
  };
}

function requestStartAction() {
  return {
    type: 'REQUEST_START',
    payload: {},
  };
}

function requestCompleteAction(json) {
  const responseBody = JSON.stringify(json, null, 2);

  return {
    type: 'REQUEST_COMPLETE',
    payload: {
      responseBody
    },
  };
}

function requestErrorAction(requestError) {
  return {
    type: 'REQUEST_ERROR',
    payload: {
      requestError,
    },
  };
}
