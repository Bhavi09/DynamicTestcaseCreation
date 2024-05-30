import React, { useState } from "react";
import Button from "@mui/material/Button";
import { notification } from "antd";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { addValueId,setBodyValue } from "../store/reducers";



 export default function AddResources({openDialogBox,setOpenDialogBox})
 {
    const dispatch = useDispatch();
    const valueIds = useSelector((state) => state.valueIdReducer.valueIds);
    const [jsonError, setJsonError] = useState(false);
    const [jsonContent, setJsonContent] = useState("");
    const [duplicateResourceIdError, setDuplicateResourceIdError] = useState(false);


    const handleClose = () => {
        setOpenDialogBox(false);
        setJsonError(false);
      };

      const handleResourceIdChange = (event) => {
        if (valueIds.includes(event.target.value)) {
          setDuplicateResourceIdError(true);
        } else {
          setDuplicateResourceIdError(false);
        }
      };

      const handleBodySubmit = (event) => {
        event.preventDefault();
        try {
          JSON.parse(jsonContent);
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const resourceId = formJson.resourceId;
          dispatch(addValueId(resourceId));
          dispatch(setBodyValue({ resourceId, formJson }));
          setJsonError(false);
          setDuplicateResourceIdError(false);
          handleClose();
          notification.success({
            message: "Success",
            description: "Resource has been created successfully",
            placement: "top",
          });
        } catch (error) {
          setJsonError(true);
        }
      };

      const handleResourceJsonChange = (event) => {
        setJsonContent(event.target.value);
        setJsonError(false);
      };

      return(

      <Dialog
        open={openDialogBox}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleBodySubmit,
        }}
      >
        <DialogTitle>Add Resource</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="resourceId"
            name="resourceId"
            label="Resource Id"
            fullWidth
            variant="standard"
            onChange={handleResourceIdChange}
            error={duplicateResourceIdError}
            helperText={
              duplicateResourceIdError ? "Resource Id already exists" : ""
            }
          />
          <TextField
            margin="dense"
            id="resource"
            name="resource"
            label="Resource"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            onChange={handleResourceJsonChange}
            error={jsonError}
            helperText={jsonError ? "Invalid JSON content" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            disabled={jsonError || duplicateResourceIdError}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      )
}
