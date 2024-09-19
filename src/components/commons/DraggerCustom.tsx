import Dragger, { DraggerProps } from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";

const DraggerCustom = (props: DraggerProps) => {
  return (
    <Dragger className="h-full" {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </Dragger>
  );
};

export default DraggerCustom;
