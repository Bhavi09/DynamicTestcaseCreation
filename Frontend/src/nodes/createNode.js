import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };
let counter = 0;

const options = [
  { value: 'Patient', label: 'Patient' },
  { value: 'Practitioner', label: 'Practitioner' },
  { value: 'Document', label: 'Document' },
];

function CreateNode({ data, isConnectable }) {
  const [selectedOption, setSelectedOption] = useState(data.value['resourceType'] || options[0].value);
  const [textValue, setTextValue] = useState(data.value || '');

  const onChange1 = (evt) => {
    const newValue = evt.target.value;
    setSelectedOption(newValue);
    setTextValue(newValue);
    data.value['resourceType'] = newValue;
  };

  const onChange2 = (evt) => {
    const newValue = evt.target.value;
    setTextValue(newValue);
    data.value['resource'] = newValue;
  };

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      <label htmlFor="dropdown">Resource:</label>
      <select id="dropdown" name="dropdown" value={selectedOption} onChange={onChange1}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <div>
        <label htmlFor="text2">Value Id:</label>
        <input id="text2" name="text2" value={textValue.resource} onChange={onChange2} className="nodrag" />
      </div>
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

export default CreateNode;
