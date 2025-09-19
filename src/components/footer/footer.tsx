
type Props={
    title:string
}
Footer.defaultProps={
    title:'我是footer'
}
export default function Footer(item:Props){
    return <>
        {item.title}
    </>
}