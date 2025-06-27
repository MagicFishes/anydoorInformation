// import { useSyncExternalStore } from 'react';

// export default function ChatIndicator() {
//   const isOnline = useSyncExternalStore(subscribe, getSnapshot);
//   return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'} <span onClick={subscribe}>取消监听</span></h1>;
// }

// function getSnapshot() {
//   return navigator.onLine;
// }

// function subscribe(callback) {
//   window.addEventListener('online', callback);
//   window.addEventListener('offline', callback);
//   return () => {
//     window.removeEventListener('online', callback);
//     window.removeEventListener('offline', callback);
//   };
// }

// import { useSyncExternalStore, useState, useEffect } from 'react';

// export default function ChatIndicator() {
//   const [unsubscribe, setUnsubscribe] = useState<null | (() => void)>(null);
//   const isOnline = useSyncExternalStore(subscribe, getSnapshot);

//   useEffect(() => {
//     // 在组件挂载时，调用 subscribe 函数，并将返回的取消订阅函数保存到 state 中
//     const unsub = subscribe(forceUpdate);
//     setUnsubscribe(() => unsub); // 使用函数式更新，确保保存的是最新的 unsub

//     // 组件卸载时，取消订阅
//     return () => {
//       if (unsubscribe) {
//         unsubscribe();
//       }
//     };
//   }, []); // 依赖项为空数组，确保只在挂载和卸载时执行

//   // 用于触发组件更新的函数，传递给 subscribe
//   function forceUpdate() {
//     // 强制组件重新渲染
//     setUnsubscribe(prev => prev); // 通过更新 state 来触发重新渲染
//   }

//   const handleUnsubscribeClick = () => {
//     // 点击 "取消监听" 按钮时，调用取消订阅函数
//     if (unsubscribe) {
//       unsubscribe();
//       setUnsubscribe(null); // 清空 unsubscribe，防止重复调用
//     }
//   };

//   function getSnapshot() {
//     return navigator.onLine;
//   }

//   function subscribe(callback) {
//     window.addEventListener('online', callback);
//     window.addEventListener('offline', callback);
//     return () => {
//       window.removeEventListener('online', callback);
//       window.removeEventListener('offline', callback);
//     };
//   }

//   return (
//     <h1>
//       {isOnline ? '✅ Online' : '❌ Disconnected'}
//       <span onClick={handleUnsubscribeClick} style={{ cursor: 'pointer', marginLeft: '10px' }}>
//         取消监听
//       </span>
//     </h1>
//   );
// }
import { useSyncExternalStore, useState, useEffect } from 'react';

export default function ChatIndicator() {
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const isOnline = useSyncExternalStore(isSubscribed ? subscribe : () => {}, getSnapshot); // 条件订阅

  useEffect(() => {
    let unsub = null;
    if (isSubscribed) {
      unsub = subscribe(forceUpdate);
      setUnsubscribe(() => unsub);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isSubscribed]); // 依赖项为 isSubscribed

  function forceUpdate() {
    setUnsubscribe(prev => prev);
  }

  const handleUnsubscribeClick = () => {
    if (unsubscribe) {
      unsubscribe();
      setUnsubscribe(null);
    }
    setIsSubscribed(false); // 取消订阅
  };

  function getSnapshot() {
    return navigator.onLine;
  }

  function subscribe(callback) {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  }

  return (
    <h1>
      {isOnline ? '✅ Online' : '❌ Disconnected'}
      <span onClick={handleUnsubscribeClick} style={{ cursor: 'pointer', marginLeft: '10px' }}>
        取消监听
      </span>
    </h1>
  );
}