// import { startTransition, useOptimistic, useState, useCallback, useRef, useMemo, useDeferredValue } from 'react'

// type Comment = {
//   id: number
//   text: string
//   status: string
// }

// function addCommentDefault(text: string): Promise<void> {
//   console.log('成功', text)
//   return new Promise<void>((resolve) => {
//     setTimeout(() => {
//       resolve()
//     }, 2000)
//   })
// }

// export default function CommentList() {
//   const [comments, setComments] = useState<Comment[]>([])
//   const isOptimistic = useRef(false)

//   const [optimisticComments, addOptimisticComment] = useOptimistic<
//     Comment[],
//     Comment
//   >(comments, (currentComments, newComment) => {
//     if (isOptimistic.current) {
//       return [
//         ...currentComments,
//         {
//           ...newComment,
//           status: 'pending', // 标记为 pending 状态
//         },
//       ]
//     }
//     return currentComments
//   })

//   const deferredComments = useDeferredValue(optimisticComments);

//   const handleAddComment = useCallback(async (text: string) => {
//     const newComment = {
//       id: Date.now(),
//       text,
//       status: 'sending',
//     }

//     // addOptimisticComment(newComment) // 立即更新 UI
//     isOptimistic.current = true
//     startTransition(() => {
//       addOptimisticComment(newComment) // 立即更新 UI
//     })

//     try {
//       await addCommentDefault(text) // 发送请求到服务器
//       // 如果成功，更新 comments 状态
//       setComments((prevComments) => {
//         const updatedComments = [...prevComments, { ...newComment, status: 'success21' }]
//         // isOptimistic.current = false
//         // startTransition(() => {
//         //   addOptimisticComment({ ...newComment, status: 'success1' })
//         // })
//         return updatedComments
//       })
//     } catch (error) {
//       // 如果失败，需要回滚 optimisticComments
//       console.error('Failed to add comment:', error)
//     }
//   }, [setComments, addOptimisticComment])

//   const memoizedComments = useMemo(() => deferredComments.map((comment) => (
//     <div key={comment.id}>
//       {comment.text} ({comment.status})
//     </div>
//   )), [deferredComments]);

//   return (
//     <div>
//       {memoizedComments}
//       <button onClick={() => handleAddComment('New comment')}>
//         Add Comment
//       </button>
//     </div>
//   )
// }




// import { useState, useCallback, useOptimistic, startTransition } from 'react'

// function simulateNetworkRequest(value: number): Promise<number> {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // 模拟成功或失败
//       const success = Math.random() > 0.2 // 80% 的概率成功
//       if (success) {
//         resolve(value)
//       } else {
//         reject(new Error('Network request failed'))
//       }
//     }, 500) // 模拟 500ms 的延迟
//   })
// }

// export default function Counter() {
//   const [count, setCount] = useState(0)

//   const [optimisticCount, addOptimistic] = useOptimistic(
//     count,
//     (currentState, optimisticValue: number) => currentState + optimisticValue
//   )

//   const increment = useCallback(async () => {
//     const optimisticValue = 1 // 乐观地增加 1

//     addOptimistic(optimisticValue) // 立即更新 UI

//     try {
//       await simulateNetworkRequest(optimisticCount + optimisticValue) // 发送请求到服务器
//       setCount(optimisticCount + optimisticValue)
//     } catch (error) {
//       // 如果失败，回滚
//       console.error('Increment failed:', error)
//       // 这里简单地重新设置为之前的 count，实际应用中可能需要更复杂的错误处理
//       setCount(count)
//     }
//   }, [optimisticCount, addOptimistic, count])

//   return (
//     <div>
//       <h1>Counter: {optimisticCount}</h1>
//       <button onClick={increment}>Increment</button>
//     </div>
//   )
// }
import { useState, useCallback, useOptimistic, startTransition } from 'react'

function simulateNetworkRequest(value: number): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟成功或失败
      const success = Math.random() > 0.2 // 80% 的概率成功
      if (success) {
        resolve(value)
      } else {
        reject(new Error('Network request failed'))
      }
    }, 500) // 模拟 500ms 的延迟
  })
}

export default function Counter() {
  const [count, setCount] = useState(0)

  const [optimisticCount, addOptimistic] = useOptimistic(
    count,
    (currentState, optimisticValue: number) => currentState + optimisticValue
  )

  const increment = useCallback(async () => {
    const optimisticValue = 1 // 乐观地增加 1

    addOptimistic(optimisticValue) // 立即更新 UI

    try {
      const newValue = await simulateNetworkRequest(count + optimisticValue) // 发送请求到服务器，使用未更新的 count
      setCount(newValue) // 使用服务器返回的实际值更新 count
    } catch (error) {
      // 如果失败，回滚
      console.error('Increment failed:', error)
      // 这里简单地重新设置为之前的 count，实际应用中可能需要更复杂的错误处理
      setCount(count)
    }
  }, [count, addOptimistic])

  return (
    <div>
      <h1>Counter: {optimisticCount}</h1>
      <button onClick={increment}>Increment</button>
    </div>
  )
}