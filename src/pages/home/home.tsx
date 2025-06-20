import React from "react"
import styles from './home.module.css'
import classNames from 'classnames'
 interface ButtonProps{
    text:string,
    onClick:(event:React.MouseEvent)=>void,
    disabled?:boolean,
    varaiant?:'primaty'|number
 }
const T = ({ text, onClick, disabled }: ButtonProps) => {
   return <button onClick={onClick} disabled={disabled}>{text}</button>
}

const click=(e:React.MouseEvent)=>{
    console.log("e",e)
}
export default function (){
    return <div className={classNames(styles['local-btn'],'p-6 bg-[black] bg-[red]')}>
        <T text="按钮" onClick={(e) => { click(e) }} />
        我是首页
    </div>
}