import React from 'react';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import {Box, Button} from "@material-ui/core";

class DocumentsList extends React.Component {
    render() {
        return (
            <>
                {
                    this.props.documents.map((value, index) => (
                        <Grid item xs={12} key={"document-" + (index + 1).toString()}>
                            {
                                this.props.documents.length > 1 &&
                                <Box textAlign="right">
                                    <Button size="small" color="secondary"
                                            onClick={() => this.props.deleteDocument(index)}>
                                        <b>Xóa</b>
                                    </Button>
                                </Box>
                            }
                            <TextField
                                error={this.props.documentErrors[index]}
                                label={"Văn bản " + (index + 1).toString()}
                                variant="outlined"
                                rows={8}
                                value={value}
                                multiline
                                fullWidth
                                required
                                onChange={event => this.props.updateDocument(index, event.target.value)}
                                helperText={this.props.documentErrors[index] ? "Độ dài tối thiểu của văn bản là 50" : null}/>
                        </Grid>
                    ))
                }
            </>
        );
    }

}

export default DocumentsList;