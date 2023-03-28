import React, { useEffect, useState } from "react";
import mermaid from "mermaid";

interface Props {
  features: string;
}

const SchemaEditor: React.FC<Props> = ({ features }) => {
  const [inputValue, setInputValue] = useState<string>(features);
  const [diagramHTML, setDiagramHTML] = useState<string>("");

  mermaid.initialize({ startOnLoad: true });

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): Promise<void> => {
    const text = event.target.value;
    try {
      const diagram = await mermaid.render("schema", text);
      const svg = diagram.svg;
      setDiagramHTML(svg);
    } catch (e) {
      //   setDiagramHTML(e);
    }
    setInputValue(text);
  };

  return (
    <div>
      <textarea
        value={inputValue}
        onChange={handleInputChange}
        className="form-control"
      />
      <div dangerouslySetInnerHTML={{ __html: diagramHTML }} />
    </div>
  );
};

export default SchemaEditor;
