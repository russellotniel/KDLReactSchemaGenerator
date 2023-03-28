interface Props {
  features: string;
  setStep: (num: number) => any;
}

const tableFeatures: React.FC<Props> = ({ features, setStep }) => {
  return (
    <div className="w-100">
      <div className="flex-column input-container h-75">
        <h4 className="text-center mb-2">Generated SQL</h4>
        <textarea
          className="form-control"
          // type='text'
          placeholder="Result"
          value={features}
          style={{ height: "400px", width: "400px", resize: "none" }}
          //   onChange={handleChange}
          //   disabled={loading}
        />
        <div className="text-end mt-2">
          <button
            className="btn btn-success mt-3"
            onClick={() => {
              setStep(1);
            }}
          >
            Back to Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default tableFeatures;
