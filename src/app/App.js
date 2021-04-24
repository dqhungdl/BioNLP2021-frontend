import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Raleway from '../static/raleway-vietnamese.woff2';
import header from '../static/header.png';
import background from '../static/background.jpg';
import Input from "../input/Input";
import Output from "../output/Output";
import "./App.css";
import {
    Container,
    createMuiTheme,
    Link,
    Paper,
    Typography,
    ThemeProvider,
    Divider
} from "@material-ui/core";

const theme = createMuiTheme({
    typography: {
        fontFamily: "'Open Sans', sans-serif"
    }
});

function Copyright() {
    return (
        <Typography variant="body1" color="textSecondary" align="center" style={{backgroundColor: "#808080"}}>
            <b>
                {'Copyright © '}
                <Link color="inherit" href="https://github.com/dqhungdl/BioNLP2021">
                    UETrice
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </b>
        </Typography>
    );
}

const styles = theme => ({
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    },
    background: {
        backgroundImage: `url(${background})`,
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
    },
    headerBackground: {
        backgroundImage: `url(${header})`,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    whiteTypography: {
        color: "white"
    },
    bodyPaper: {
        position: "relative",
        top: -30
    }
});

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showInput: true,
            showOutput: false,
            response: null
        }
        this.toInput = this.toInput.bind(this);
        this.toOutput = this.toOutput.bind(this);
    }

    toInput() {
        this.setState({
            showInput: true,
            showOutput: false
        });
    }

    toOutput(response) {
        this.setState({
            response: response
        });
        this.setState({
            showInput: false,
            showOutput: true
        });
    }

    render() {
        const {classes} = this.props;
        return (
            <ThemeProvider theme={theme}>
                <Container maxWidth='xl' className={classes.background}>
                    {/*style={{*/}
                    {/*    backgroundImage: `url(${background})`,*/}
                    {/*    backgroundRepeat: "no-repeat",*/}
                    {/*    backgroundAttachment: "fixed"*/}
                    {/*}}>*/}
                    {/*Header*/}
                    <Container maxWidth="lg" className={classes.headerBackground}>
                        <Container maxWidth="sm" component="main" className={classes.heroContent}>
                            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom
                                        className={classes.whiteTypography}>
                                <b>Hệ thống tóm tắt <br/>đa văn bản</b>
                            </Typography>
                            <Typography variant="h5" align="center" color="textSecondary" component="p"
                                        className={classes.whiteTypography}>
                                Tóm tắt đa văn bản dựa vào câu hỏi cho dữ liệu <br/>Tiếng Việt
                            </Typography>
                        </Container>
                    </Container>
                    {/*Body*/}
                    <Container maxWidth="lg">
                        <Paper elevation={10} className={classes.bodyPaper}>
                            <br/>
                            <Container maxWidth="md">
                                {
                                    this.state.showInput &&
                                    <Input toOutput={this.toOutput}/>
                                }
                                {
                                    this.state.showOutput &&
                                    <Output response={this.state.response}
                                            toInput={this.toInput}/>
                                }
                            </Container>
                            <br/><br/>
                        </Paper>
                        <br/>
                    </Container>
                </Container>

                {/*Footer*/}
                <footer className={classes.footer}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Đại học Công nghệ - Đại học quốc gia Hà Nội<br/>
                        Khoa Công nghệ thông tin
                    </Typography>
                    <Divider variant="inset"/>
                    <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                        Tác giả: Nguyễn Quốc An, Dương Quốc Hưng, Nguyễn Huy Sơn, Nguyễn Minh Quang
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                        Giáo viên hướng dẫn: Lê Hoàng Quỳnh, Cấn Duy Cát
                    </Typography>
                </footer>
                <Copyright/>
            </ThemeProvider>
        );
    }
}

export default withStyles(styles)(App);