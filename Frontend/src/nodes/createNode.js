import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };
const options = [
  { value: 'Patient', label: 'Patient' },
  { value: 'Practitioner', label: 'Practitioner' },
  { value: 'Document', label: 'Document' },
];

function CreateNode({ data, isConnectable }) {
  const [selectedOption, setSelectedOption] = useState(data.value['resourceType'] || options[0].value);
  const [textValue, setTextValue] = useState(data.value['text'] || '');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    data.value['resourceType'] = event.target.value;
  };

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
    data.value['valueId'] = event.target.value;
  };

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} id='b' />
      <div>
        <label htmlFor="text">Resource Type:</label>
        <select value={selectedOption} onChange={handleSelectChange} className="nodrag">
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="text">ValueId: </label>
        <input id="text" value={textValue} onChange={handleTextChange} className="nodrag" />
      </div>
      <button onClick={data.onDelete} style={{ marginTop: '10px' }}>Delete</button>
      <Handle type="source" position={Position.Bottom} id='b' isConnectable={isConnectable} />
    </div>
  );
}

export default CreateNode;
