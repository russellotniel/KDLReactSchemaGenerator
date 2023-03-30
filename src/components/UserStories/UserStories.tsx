import React, { useState, useEffect, useRef } from "react";
import { UserStoriesGenerator } from "../../helpers/helpers";
import Checkbox from "./Checkbox";
import Logo from "../../images/KSF Logo SVG.svg";
import Logo2 from "../../images/Logo.png";

interface Props {
  loading: boolean;
  setLoading: (bool: boolean) => void;
  handleSystemFeatures: (features: string) => Promise<void>;
}

const Generator: React.FC<Props> = ({
  handleSystemFeatures,
  loading,
  setLoading,
}) => {
  const [input, setInput] = useState("");
  const [features, setFeatures] = useState([]);

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInput(event.target.value);
  };

  const sendMessage = async () => {
    console.log(input);
    setLoading(true);
    do {
      await processMessageToChatGPT(input);
    } while (loading != false);
  };

  async function processMessageToChatGPT(chatMessages: string) {
    await UserStoriesGenerator(chatMessages)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        const arr = data.choices[0].message.content
          .replace(/\n/g, "")
          .split("*")
          .filter((item: string) => item !== "")
          .map((item: string) => item.trim());
        if (arr.length >= 5) {
          setFeatures(arr);
          setLoading(false);
        } else {
          setLoading(true);
        }
      })
      .catch((e) => {
        alert("Error Occured. Please Try Again");
        setLoading(false);
      });
  }

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center">
        <img
          src={Logo2}
          className="text-center"
          style={{ width: "300px" }}
        />
		<h1 className="text-center" style={{ fontSize: "38px", paddingTop: "38px" }}>
        AI Augmentation
      </h1>
      </div>
      
      <h5 className="text-center mb-2" style={{color: "#5F5F5F", marginTop: "16px"}}>
        Write your objectives, and we can suggest a suitable system to help you
        accomplish them
      </h5>
      <textarea
        className="form-control"
        id="floatingTextarea"
        placeholder="As a restaurant owner looking to digitize my business, what end-to-end system do you recommend for me?"
        style={{ height: "135px", resize: "none" }}
        value={input}
        onChange={handleChange}
        disabled={loading}
      />
      <div className="p-2 text-center">
        <button
          className="btn btn-success w-50"
          onClick={sendMessage}
          disabled={loading}
        >
          <b>Generate</b>
        </button>
      </div>
      {features.length != 0 ? (
        <div className="container p-4">
          <p className="" style={{fontSize: "20px"}}>Please select the System</p>
          <Checkbox
            features={features}
            handleSystemFeatures={handleSystemFeatures}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Generator;
