 export default function renderMessage(text){
    const urlRegex=/(https?:\/\/[^\s]+)/g;
    // split text into parts : plain text and links
    const parts=text.split(urlRegex);
    return parts.map((part,i)=>{
        if(part.match(urlRegex)){
            return (
                <a 
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                title="follow this link"
                className="text-blue-600 underline hover:text-blue-800"
                >{part}</a>
            )
        }
        return <span key={i}>{part}</span>
    });
}