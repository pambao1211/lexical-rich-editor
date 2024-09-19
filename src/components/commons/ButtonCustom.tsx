import { Button } from "antd";

interface Props {
  onClick?: () => void;
  children: JSX.Element;
}
const ButtonCustom = (props: Props) => {
  const { onClick, children } = props;
  return (
    <Button
      style={{
        padding: "1px 2px",
        border: "none",
        boxShadow: "none",
        backgroundColor: "transparent",
      }}
      onClick={onClick}>
      {children}
    </Button>
  );
};

export default ButtonCustom;
