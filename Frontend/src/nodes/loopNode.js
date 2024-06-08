import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";

function LoopNode({ data, isConnectable }) {
  const [indexValue, setIndexValue] = useState(data.value.index || '');
  const [startValue, setStartValue] = useState(data.value.start || '');
  const [endValue, setEndValue] = useState(data.value.end || '');

  const handleIndexValueChange = (event) => {
    setIndexValue(event.target.value);
    data.value["index"] = event.target.value;
  };
  const handleStartValueChange = (event) => {
    setStartValue(event.target.value);
    data.value["start"] = event.target.value;
  };
  const handleEndValueChange = (event) => {
    setEndValue(event.target.value);
    data.value["end"] = event.target.value;
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4 + 8,
        width: 200,
      },
    },
  };

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
      <Handle type="target" position={Position.Top} id="top" />
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#1976d2",
          padding: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ color: "white" }}
        >
          Loop
        </Typography>
      </Box>
      <TextField
        id="textfilled-basic"
        label="Index"
        value={indexValue}
        onChange={handleIndexValueChange}
        fullWidth
      />
      <TextField
        id="textfilled-basic"
        label="Start"
        value={startValue}
        onChange={handleStartValueChange}
        fullWidth
      />
      <TextField
        id="textfilled-basic"
        label="End"
        value={endValue}
        onChange={handleEndValueChange}
        fullWidth
      />

      <Button variant="contained" onClick={data.onDelete} sx={{ marginTop: 2 }}>
        Delete
      </Button>
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-center"
        style={{ top: "50%" }}
        isConnectable={isConnectable}
      />
    </Card>
  );
}

export default LoopNode;
