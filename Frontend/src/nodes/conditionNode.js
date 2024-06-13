import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";

function ConditionNode({ data, isConnectable }) {
  const [conditionValue, setConditionValue] = useState(data.value.condition || '');
  const [descriptionValue, setDescriptionValue] = useState(data.value.desc || '');

  const handleConditionValueChange = (event) => {
    setConditionValue(event.target.value);
    data.value["condition"] = event.target.value;
  };
  const handleDescriptionValueChange = (event) => {
    setDescriptionValue(event.target.value);
    data.value["desc"] = event.target.value;
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
          Condition
        </Typography>
      </Box>
      <TextField
        id="textfilled-basic"
        label="Condition"
        value={conditionValue}
        onChange={handleConditionValueChange}
        fullWidth
      />
      <TextField
        id="textfilled-basic"
        label="Description"
        value={descriptionValue}
        onChange={handleDescriptionValueChange}
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
        id="right-top"
        style={{ top: "20%" }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-bottom"
        style={{ top: "80%" }}
        isConnectable={isConnectable}
      />
    </Card>
  );
}

export default ConditionNode;
