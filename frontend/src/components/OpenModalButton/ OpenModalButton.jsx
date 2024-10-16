import { useModal } from '../../context/Modal'; // Adjust the path if necessary

function OpenModalButton({
  modalComponent, // Component to render inside the modal
  buttonText, // Text of the button that opens the modal
  onButtonClick, // Optional: callback function that will be called once the button is clicked
  onModalClose // Optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose); // Set the onModalClose callback
    setModalContent(modalComponent); // Set the modal content
    if (typeof onButtonClick === "function") onButtonClick(); // Invoke onButtonClick if it's a function
  };

  return <button onClick={onClick}>{buttonText}</button>; // Render the button
}

export default OpenModalButton;
