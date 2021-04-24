import React from 'react';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/styles';
import {Box, Button, Divider, Fab, Snackbar, Tooltip, Typography, Backdrop} from "@material-ui/core";
import {VpnKeyTwoTone} from "@material-ui/icons";
import SendIcon from '@material-ui/icons/Send';
import AddIcon from '@material-ui/icons/Add';
import DescriptionIcon from '@material-ui/icons/Description';
import CircularProgress from '@material-ui/core/CircularProgress';
import DocumentsList from "./DocumentsList";
import ChipInput from "material-ui-chip-input";
import {Alert, AlertTitle} from "@material-ui/lab";
import axios from "axios";

const styles = theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
});

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: [],
            documents: [''],
            keywordError: false,
            documentErrors: [false],
            showMaxLengthAlert: false,
            showServerErrorAlert: false,
            loading: false,
            disableAddDocument: false
        };
        this.deleteDocument = this.deleteDocument.bind(this);
        this.updateDocument = this.updateDocument.bind(this);
    }

    addDocument() {
        let documents = this.state.documents;
        documents.push('');
        this.setState({
            documents: documents
        });
        if (documents.length === 6) {
            this.setState({
                disableAddDocument: true
            });
        }
    }

    deleteDocument(index) {
        let documents = this.state.documents;
        documents.splice(index, 1);
        this.setState({
            documents: documents
        });
        if (this.state.disableAddDocument)
            this.setState({
                disableAddDocument: false
            });
    }

    updateDocument(index, text) {
        let documents = this.state.documents;
        documents[index] = text;
        this.setState({
            documents: documents
        });
    }

    addKeyword(keyword) {
        let keywords = this.state.keywords;
        keywords.push(keyword);
        this.setState({
            keywords: keywords
        });
    }

    deleteKeyword(keyword, index) {
        let keywords = this.state.keywords;
        keywords.splice(index, 1)
        this.setState({
            keywords: keywords
        });
    }

    beforeAddKeyword(keyword) {
        if (keyword.length > 50) {
            this.setState({
                showMaxLengthAlert: true
            });
            return false;
        }
        return true;
    }

    onCloseMaxLengthAlert() {
        this.setState({
            showMaxLengthAlert: false
        });
    }

    onCloseServerErrorAlert() {
        this.setState({
            showServerErrorAlert: false
        });
    }

    submit(callback) {
        let validKeyword = this.state.keywords.length > 0;
        let validDocument = true;
        let documentErrors = [];
        for (let i = 0; i < this.state.documents.length; i++) {
            let document = this.state.documents[i];
            if (document.length <= 50) {
                validDocument = false;
                documentErrors.push(true);
            } else
                documentErrors.push(false);
        }
        this.setState({
            keywordError: !validKeyword,
            documentErrors: documentErrors
        });
        if (validKeyword && validDocument) {
            let request = {
                'query': this.state.keywords.join(' '),
                'tag': this.state.keywords,
                'doc': this.state.documents
            }
            this.setState({
                loading: true
            });
            axios.post('http://localhost:8000/', request,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                        'Content-Type': 'application/json'
                    },
                    timeout: 20000
                }
            ).then(response => {
                console.log(response);
                this.setState({
                    loading: false
                });
                request['multi_summ'] = response['data']['multi_summ'];
                callback(request);
            }).catch(err => {
                console.log(err);
                this.setState({
                    loading: false,
                    showServerErrorAlert: true
                });
            });
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                {/*Keywords*/}
                <Typography variant="h4" gutterBottom>
                    <VpnKeyTwoTone/> <b>Từ khóa tìm kiếm</b>
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <ChipInput
                            error={this.state.keywordError}
                            required
                            fullWidth
                            label="Danh sách từ khóa"
                            helperText={
                                <>
                                    Danh sách có ít nhất <b>1</b> từ khóa, cách nhau bởi dấu <b>ENTER</b>.<br/>
                                    Độ dài <b>tối đa</b> của từ khóa là <b>50</b>.
                                </>
                            }
                            variant="outlined"
                            value={this.state.keywords}
                            onAdd={chip => this.addKeyword(chip)}
                            onDelete={index => this.deleteKeyword(index)}
                            onBeforeAdd={chip => this.beforeAddKeyword(chip)}
                        />
                    </Grid>
                </Grid>
                <br/><br/>
                <Divider variant="middle"/><br/>

                {/*Documents*/}
                <Typography variant="h4" gutterBottom>
                    <DescriptionIcon/> <b>Danh sách các văn bản</b>
                </Typography>
                <Grid container spacing={3}>
                    <DocumentsList documents={this.state.documents}
                                   documentErrors={this.state.documentErrors}
                                   deleteDocument={this.deleteDocument}
                                   updateDocument={this.updateDocument}/>
                </Grid>
                <br/>

                {/*Buttons*/}
                <Box textAlign="right">
                    <Button size="small" color="primary" onClick={() => this.addDocument()}
                            startIcon={<AddIcon/>}
                            disabled={this.state.disableAddDocument}>
                        <b>Thêm văn bản mới</b>
                    </Button>
                </Box>
                <Box textAlign="center">
                    <Button size="large" onClick={() => {
                        this.submit(this.props.toOutput);
                    }}
                            style={{
                                alignItems: "center",
                                backgroundColor: "#5cb85c", color: "white",
                            }} startIcon={<SendIcon/>}>
                        <b>Tóm tắt</b>
                    </Button>
                </Box>
                <Tooltip title={<b>Thêm văn bản mới</b>}>
                    <Fab color='primary' size="large" onClick={() => this.addDocument()}
                         style={{
                             position: 'fixed', bottom: 30, right: 90,
                         }}
                         disabled={this.state.disableAddDocument}>
                        <AddIcon/>
                    </Fab>
                </Tooltip>
                <Tooltip title={<b>Tóm tắt</b>}>
                    <Fab size="large" onClick={() => {
                        this.submit();
                        this.props.toOutput();
                    }}
                         style={{
                             backgroundColor: "#5cb85c", color: "white",
                             position: 'fixed', bottom: 30, right: 25,
                         }}>
                        <SendIcon/>
                    </Fab>
                </Tooltip>

                {/*Alerts*/}
                <Snackbar open={this.state.showMaxLengthAlert}
                          autoHideDuration={3000}
                          onClose={() => this.onCloseMaxLengthAlert()}>
                    <Alert severity="error" onClose={() => this.onCloseMaxLengthAlert()}>
                        <AlertTitle><b>Lỗi</b></AlertTitle>
                        Độ dài tối đa của từ khóa là 50
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.showServerErrorAlert}
                          autoHideDuration={3000}
                          onClose={() => this.onCloseServerErrorAlert()}>
                    <Alert severity="error" onClose={() => this.onCloseServerErrorAlert()}>
                        <AlertTitle><b>Lỗi</b></AlertTitle>
                        Lỗi server
                    </Alert>
                </Snackbar>

                {/*Loading*/}
                <Backdrop className={classes.backdrop} open={this.state.loading}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Input);