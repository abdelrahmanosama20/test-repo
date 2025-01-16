import ShareButton from "./shareButton";
import EmailButton from "./emailButton";

const ShareComponent = ({ type, id }) => {
    const link = `http://localhost:3000/tourist/${type}/${id}`;
    const subject = `Check out this ${type}!`;
    const body = `I found this interesting ${type}: ${link}`;
  
    return (
      <div>
        <h3>Share this {type}</h3>
        {/* Copy link button */}
        <ShareButton link={link} />
  
        {/* Email button */}
        <EmailButton subject={subject} body={body} />
      </div>
    );
  };

export default ShareComponent;