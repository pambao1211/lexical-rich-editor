import { Button } from "antd";

type Props = {
  children: JSX.Element;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
};
const ButtonToggle = (props: Props) => {
  const { children, isActive, onClick, disabled = false } = props;

  const getColorByState = () => {
    if (disabled) {
      return "rgb(229, 231, 235)";
    }
    return isActive ? "#0F69E6" : "black";
  };

  return (
    <Button
      disabled={disabled}
      shape="default"
      onClick={onClick}
      style={{
        color: getColorByState(),
        padding: "1px 2px",
        border: "none",
        boxShadow: "none",
        backgroundColor: "transparent",
      }}>
      {children}
    </Button>
  );
};

export default ButtonToggle;
