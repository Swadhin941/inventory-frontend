const EditButton = ({ onClick, disabled }) => {
    return (
      <button className="action-btn" onClick={onClick} disabled={disabled}>
        Edit
      </button>
    );
  };
  
  export default EditButton;