import React, { useReducer } from 'react';

// 1. 定义状态
const initialState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
};

// 2. 定义 Action 类型
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';

// 3. 创建 Reducer 函数
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(item => item.id === newItem.id);

      if (existingItem) {
        const updatedCartItems = state.cartItems.map(item =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        return {
          ...state,
          cartItems: updatedCartItems,
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + newItem.price,
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { ...newItem, quantity: 1 }],
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + newItem.price,
        };
      }
    }
    case REMOVE_FROM_CART: {
      const itemId = action.payload;
      const itemToRemove = state.cartItems.find(item => item.id === itemId);

      if (!itemToRemove) {
        return state;
      }

      const updatedCartItems = state.cartItems.filter(item => item.id !== itemId);
      return {
        ...state,
        cartItems: updatedCartItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - itemToRemove.price * itemToRemove.quantity,
      };
    }
    case UPDATE_QUANTITY: {
      const { itemId, quantity } = action.payload;
      const updatedCartItems = state.cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: quantity } : item
      );

      const updatedTotalItems = updatedCartItems.reduce((total, item) => total + item.quantity, 0);
      const updatedTotalPrice = updatedCartItems.reduce((total, item) => total + item.price * item.quantity, 0);

      return {
        ...state,
        cartItems: updatedCartItems,
        totalItems: updatedTotalItems,
        totalPrice: updatedTotalPrice,
      };
    }
    default:
      return state;
  }
};

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const handleAddToCart = (item) => {
    dispatch({ type: ADD_TO_CART, payload: item });
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch({ type: REMOVE_FROM_CART, payload: itemId });
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    dispatch({ type: UPDATE_QUANTITY, payload: { itemId, quantity } });
  };

  // 示例商品列表
  const products = [
    { id: 1, name: '商品 A', price: 20 },
    { id: 2, name: '商品 B', price: 30 },
    { id: 3, name: '商品 C', price: 15 },
  ];

  return (
    <div>
      <h2>商品列表</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - 价格: {product.price}
            <button onClick={() => handleAddToCart(product)}>添加到购物车</button>
          </li>
        ))}
      </ul>

      <h2>购物车</h2>
      <ul>
        {state.cartItems.map(item => (
          <li key={item.id}>
            {item.name} - 数量: {item.quantity} - 价格: {item.price * item.quantity}
            <button onClick={() => handleRemoveFromCart(item.id)}>删除</button>
            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
            />
          </li>
        ))}
      </ul>
      <p>商品总数: {state.totalItems}</p>
      <p>总价格: {state.totalPrice}</p>
    </div>
  );
}

export default ShoppingCart;