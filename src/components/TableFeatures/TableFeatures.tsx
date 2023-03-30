import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { PostgreSQLGenerator } from "../../helpers/helpers";
import { Button, Spinner } from "react-bootstrap";
import { Modal } from "react-bootstrap";

interface Props {
  features: string;
}

const SchemaEditor: React.FC<Props> = ({ features }) => {
  const [inputValue, setInputValue] = useState<string>(features);
  const [diagramHTML, setDiagramHTML] = useState<string>("");
  const [cursor, setCursor] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const [ddl, setDDL] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const input = ref.current;
    if (input) {
      input.value = features;
    }
    handleInputChange();
  }, []);

  useEffect(() => {
    const input = ref.current;
    if (input) {
      input.setSelectionRange(input.selectionStart, input.selectionStart);
    }
  }, [ref, cursor]);
  mermaid.initialize({ startOnLoad: true });

  const handleInputChange = async (): Promise<void> => {
    // const text = event.target.value;
    let text: string;
    let cursorPosition: number;
    if (ref.current) {
      text = ref.current.value;
    } else {
      text = "";
    }
    try {
      const diagram = await mermaid.render("schema", text);
      const svg = diagram.svg;
      setDiagramHTML(svg);
    } catch (e) {
      //   setDiagramHTML(e);
    }
  };

  mermaid.initialize({ startOnLoad: true });

  const generateSQL = async () => {
    setLoading(true);
    await PostgreSQLGenerator(inputValue)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setLoading(false);
        setDDL(data.choices[0].message.content);
        setOpen(true);
      })
      .catch((e) => {
        setLoading(false);
        alert("Error occured. Please try again!");
      });
  };

  const handleClose = () => setOpen(false);

  return (
    <div className="d-flex vh-100">
      <div style={{ width: "50vw", height: "100vh" }}>
        <h4 className="text-center mb-4">Mermaid erDiagram Code</h4>
        {/* <textarea ref={ref} style={{ height: '90vh' }} value={inputValue} onChange={(e) => handleInputChange(e)} className='form-control' /> */}
        <textarea
          ref={ref}
          style={{ height: "90vh" }}
          onChange={handleInputChange}
          className="form-control"
        />
        <div className="d-flex mt-2">
          <button
            className="d-flex btn btn-success"
            disabled={loading}
            onClick={generateSQL}
          >
            {loading ? "Generating..." : "Generate SQL"}
          </button>
          {loading ? (
            <div className="ms-3">
              <Spinner animation="border" role="status" variant="success">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : null}
        </div>
      </div>
      <div className="ms-5">
        <div className="justify-content-center align-items-center">
          <div
            dangerouslySetInnerHTML={{ __html: diagramHTML }}
            style={{ width: "50vw", height: "60vh" }}
          />
        </div>
      </div>

      <Modal
        show={open}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>PostgreSQL DDL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            value={ddl}
            disabled
            style={{ height: "30vh", width: "100%" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SchemaEditor;
