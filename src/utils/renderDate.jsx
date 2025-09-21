import  {format,isToday,isYesterday} from "date-fns"
export default function renderDate(date){
    if(isToday(date)) return "Today";
    if(isYesterday(date)) return "Yesterday";
    return format(date,"dd MMM yyyy");
}