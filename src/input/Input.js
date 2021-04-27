import React from 'react';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/styles';
import {Backdrop, Box, Button, Container, Divider, Fab, Snackbar, Tooltip, Typography} from "@material-ui/core";
import {VpnKeyTwoTone} from "@material-ui/icons";
import SendIcon from '@material-ui/icons/Send';
import AddIcon from '@material-ui/icons/Add';
import DescriptionIcon from '@material-ui/icons/Description';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CircularProgress from '@material-ui/core/CircularProgress';
import DocumentsList from "./DocumentsList";
import ChipInput from "material-ui-chip-input";
import {Alert, AlertTitle} from "@material-ui/lab";
import axios from "axios";
import Card from '@material-ui/core/Card';
import CardContent from "@material-ui/core/CardContent";
import {Remarkable} from "remarkable";

const styles = theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    submitButton: {
        alignItems: "center",
        backgroundColor: "#5cb85c",
        color: "white",
        '&:hover': {
            backgroundColor: "#3e8e3e",
        }
    },
    addDocumentFab: {
        position: 'fixed',
        bottom: 30,
        right: 90
    },
    submitFab: {
        backgroundColor: "#5cb85c",
        color: "white",
        position: 'fixed',
        bottom: 30,
        right: 25,
        '&:hover': {
            backgroundColor: "#3e8e3e",
        }
    },
    uploadFileFab: {
        position: 'fixed',
        bottom: 30,
        right: 155
    },
    documentsList: {
        display: "flex",
        justifyContent: 'space-between',
        padding: 0
    },
    uploadIcon: {
        marginTop: 7,
        marginBottom: 7,
        paddingRight: 15
    },
    input: {
        display: 'none'
    }
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
            showInputValidationAlert: false,
            loading: false,
            disableAddDocument: false
        };
        this.markdown = new Remarkable();
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

    onCloseInputValidationAlert() {
        this.setState({
            showInputValidationAlert: false
        });
    }

    getMarkdown(str) {
        let sentences = str.split('\n');
        for (let i = 0; i < sentences.length; i++) {
            sentences[i] = sentences[i].trim();
            if (sentences[i].startsWith('* ')) {
                sentences[i] += '\n';
                continue;
            }
            sentences[i] += '\\\n';
        }
        let formatStr = sentences.join('');
        return {__html: this.markdown.render(formatStr)};
    }

    submit() {
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
            console.log("Request:", request);
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
            ).then(async response => {
                console.log("Response:", response);
                this.setState({
                    loading: false
                });
                request['multi_summ'] = await this.getMarkdown(response['data']['multi_summ']);
                this.props.toOutput(request);
            }).catch(err => {
                console.log("Error:", err);
                this.setState({
                    loading: false,
                    showServerErrorAlert: true
                });
            });
        } else {
            this.setState({
                showInputValidationAlert: true
            });
        }
    }

    readUploadFiles(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.readAsText(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = reject;
        });
    }

    async uploadFiles(event) {
        try {
            let documents = [];
            for (let i = 0; i < event.target.files.length; i++)
                documents.push(await this.readUploadFiles(event.target.files[i]));
            this.setState({
                documents: documents
            });
        } catch (error) {
            console.log("Error:", error);
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <Card elevation={0}>
                    <CardContent>
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
                    </CardContent>
                </Card>
                <br/>
                <Divider variant="middle"/><br/>

                {/*Documents*/}
                <Card elevation={0}>
                    <CardContent>
                        <Container className={classes.documentsList}>
                            <Typography variant="h4" gutterBottom>
                                <DescriptionIcon/> <b>Danh sách các văn bản</b>
                            </Typography>
                            <input accept=".txt"
                                   className={classes.input}
                                   id="contained-button-file"
                                   multiple
                                   type="file"
                                   onChange={event => this.uploadFiles(event)}
                            />
                            <label htmlFor="contained-button-file">
                                <Button size="large"
                                        variant="outlined"
                                        startIcon={<CloudUploadIcon/>}
                                        className={classes.uploadIcon}
                                        component="span">
                                    <b>Đính kèm</b>
                                </Button>
                            </label>
                        </Container>
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
                        <br/>
                        <Box textAlign="center">
                            <Button size="large" className={classes.submitButton} startIcon={<SendIcon/>}
                                    onClick={() => {
                                        this.submit();
                                    }}>
                                <b>Tóm tắt</b>
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                <label htmlFor="contained-button-file">
                    <Tooltip title={<b>Đính kèm</b>}>
                        <Fab size="large" className={classes.uploadFileFab} component="span">
                            <CloudUploadIcon/>
                        </Fab>
                    </Tooltip>
                </label>
                <Tooltip title={<b>Thêm văn bản mới</b>}>
                    <Fab color='primary' size="large" className={classes.addDocumentFab}
                         onClick={() => this.addDocument()}
                         disabled={this.state.disableAddDocument}>
                        <AddIcon/>
                    </Fab>
                </Tooltip>
                <Tooltip title={<b>Tóm tắt</b>}>
                    <Fab size="large" className={classes.submitFab} onClick={() => {
                        this.submit();
                        this.props.toOutput();
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
                <Snackbar open={this.state.showInputValidationAlert}
                          autoHideDuration={3000}
                          onClose={() => this.onCloseInputValidationAlert()}>
                    <Alert severity="error" onClose={() => this.onCloseInputValidationAlert()}>
                        <AlertTitle><b>Lỗi</b></AlertTitle>
                        Lỗi dữ liệu đầu vào
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