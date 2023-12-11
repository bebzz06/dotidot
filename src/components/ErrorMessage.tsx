interface IErrorMessageProps {
  message: string;
}
const ErrorMessage: React.FC<IErrorMessageProps> = ({ message }) => {
  return <p data-testid="message-container">Error : {message}</p>;
};
export default ErrorMessage;
