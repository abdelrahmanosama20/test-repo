const EmailButton = ({ subject, body }) => {
    const emailHref = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
    return (
      <a href={emailHref}>
        <button>Send via Email</button>
      </a>
    );
  };
  
export default EmailButton;