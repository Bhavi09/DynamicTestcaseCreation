import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };
let counter=0;

const options = [
    { value: 'Patient', label: 'Patient' },
    { value: 'Practitioner', label: 'Practitioner' },
    { value: 'Document', label: 'Document' },
  ];

function TextUpdaterNode({ data, isConnectable }) {

    const [selectedOption, setSelectedOption] = useState('');

    const [textValue, setTextValue] = useState(data.value || '');

    data.value['resourceType'] = options[0].value;

    
    const onChange1 = useCallback((evt) => {
      const newValue = evt.target.value;
      setSelectedOption(newValue);
      setTextValue(newValue);
      data.value['resourceType'] = newValue; // Update the value in the node's data
      console.log(data.value)
    }, [data]);
    
    const onChange2 = useCallback((evt) => {
        const newValue = evt.target.value;
        setTextValue(newValue);
        data.value["resource"] = newValue; // Update the value in the node's data
        console.log(data.value)
      }, [data]);

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
        <label htmlFor="text2">Resource:</label>
        <input id="text2" name="text2" onChange={onChange2} className="nodrag" />
      </div>
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

export default TextUpdaterNode;