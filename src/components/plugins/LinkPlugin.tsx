import { validateUrl } from "../../utils";
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";

const LinkPlugin = () => {
  return <LexicalLinkPlugin validateUrl={validateUrl} />;
};

export default LinkPlugin;
