const ShareButton = ({ link }) => {
    const copyLinkToClipboard = () => {
      navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    };
  
    return (
      <div>
        <button onClick={copyLinkToClipboard}>Copy Link</button>
      </div>
    );
  };

  export default ShareButton;
