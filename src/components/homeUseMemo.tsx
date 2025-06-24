import React, { useCallback, useMemo, useState } from "react";

export default function() {
    const [count,setCount]=useState(0)
    const changeCount = useCallback(() => {
        console.log("111");
        setCount(c => c + 1);
    }, [count]);
    console.log("homeUseMemo 组件渲染了");
	return (
    <div onClick={changeCount} >usememo{count}</div>);
}