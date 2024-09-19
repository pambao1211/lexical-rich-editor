import Select from "antd/es/select";
import { twMerge } from "tailwind-merge";
import { SelectProps } from "antd/lib";

interface Props extends SelectProps {
  options: { label: string | React.ReactNode; value: string }[];
  searchPlaceHolder?: string;
  onValueChange: (value: string) => void;
}

const SelectCustom = (props: Props) => {
  const { options, searchPlaceHolder, onValueChange, className, ...rest } =
    props;

  return (
    <Select
      dropdownStyle={{
        pointerEvents: "auto",
      }}
      className={twMerge("w-[200px]", className)}
      showSearch={false}
      placeholder={searchPlaceHolder}
      optionFilterProp="children"
      onChange={onValueChange}
      options={options}
      {...rest}
    />
  );
};

export default SelectCustom;
