import React, { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSelector } from "react-redux";
import App from "../App";

const handleStyle = { left: 10 };
const validators = [
  { label: "String Validator", value: "StringValidator" },
  { label: "Number Validator", value: "NumberValidator" },
  { label: "Expression Validator", value: "ExpressionValidator" },
];
function VerifyNode({ data, isConnectable }) {
  const options = App.showAllOperationIds();

  // const [selectedOperationId, setSelectedOperationId] = useState("");
  const [selectedValidator, setSelectedValidator] = useState("");
  const [expectedDataValue, setExpectedDataValue] = useState("");
  const [actualDataValue, setActualDataValue] = useState("");
  const [operationIdValue, setOperationIdValue] = useState("");

  // const handleOperationIdChange = (event) => {
  //   setSelectedOperationId(event.target.value);
  //   data.value['actualData'] = event.target.value;
  // };

  const handleValidatorChange = (event) => {
    setSelectedValidator(event.target.value);
    data.value["handler"] = event.target.value;
  };

  const handleActualDataChange = (event) => {
    setActualDataValue(event.target.value);
    data.value["actualData"] = event.target.value;
  };

  const handleExpectedDataChange = (event) => {
    setExpectedDataValue(event.target.value);
    data.value["expectedData"] = event.target.value;
  };

  const handleOperationIdDataChange = (event) => {
    setOperationIdValue(event.target.value);
    data.value["operationId"] = event.target.value;
  }

  return (
    <Card
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        minWidth: 300,
        minHeight: 100,
      }}
    >
      <Handle type="target" position={Position.Top} id="b" />
      <Typography gutterBottom variant="h6" component="div">
        Verify
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Validators</InputLabel>
        <Select
          value={selectedValidator}
          label="Validators"
          onChange={handleValidatorChange}
          className="nodrag"
        >
          {validators.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <FormControl fullWidth>
    <InputLabel>Actual Result</InputLabel>
    <Select
      value={selectedOperationId}
      label="Operation Id"
      onChange={handleOperationIdChange}
      className="nodrag"
    >
      {options.length === 0 ? (
            <MenuItem disabled>No record found</MenuItem>
          ) : (options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      )))}
    </Select>
  </FormControl> */}
      <TextField
        id="textfilled-basic"
        label="Actual Data"
        value={actualDataValue}
        onChange={handleActualDataChange}
        fullWidth
      />
      <TextField
        id="textfilled-basic"
        label="Expected Data"
        value={expectedDataValue}
        onChange={handleExpectedDataChange}
        fullWidth
      />

      <TextField
        fullWidth
        id="standard-required"
        label="Operation Id"
        value={operationIdValue}
        onChange={handleOperationIdDataChange}
        variant="standard"
      />
      <Button variant="contained" onClick={data.onDelete} sx={{ marginTop: 2 }}>
        Delete
      </Button>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </Card>
  );
}

export default VerifyNode;
