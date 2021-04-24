import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Raleway from '../static/raleway-vietnamese.woff2';
import header from '../static/header.png';
import background from '../static/background.jpg';
import Input from "../input/Input";
import Output from "../output/Output";
import {
    Container,
    createMuiTheme,
    Link,
    Paper,
    Typography,
    ThemeProvider,
    Divider
} from "@material-ui/core";

const raleway = {
    fontFamily: 'Raleway',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 400,
    src: `
    local('Raleway'),
    local('Raleway-Regular'),
    url(${Raleway}) format('woff2')
  `,
    unicodeRange:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Raleway, Arial',
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': [raleway],
            },
        },
    },
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
    headerBackground: {
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
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
                <Container maxWidth='xl' className={classes.headerBackground}>
                           {/*style={{*/}
                           {/*    backgroundImage: `url(${background})`,*/}
                           {/*    backgroundRepeat: "no-repeat",*/}
                           {/*    backgroundAttachment: "fixed"*/}
                           {/*}}>*/}
                    {/*Header*/}
                    <Container maxWidth="lg" style={{
                        backgroundImage: `url(${header})`,
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8
                    }}>
                        <Container maxWidth="sm" component="main" className={classes.heroContent}>
                            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom
                                        style={{color: "white"}}>
                                <b>Hệ thống tóm tắt <br/>đa văn bản</b>
                            </Typography>
                            <Typography variant="h5" align="center" color="textSecondary" component="p"
                                        style={{color: "white"}}>
                                Tóm tắt đa văn bản dựa vào câu hỏi cho dữ liệu <br/>Tiếng Việt
                            </Typography>
                        </Container>
                    </Container>
                    {/*Body*/}
                    <Container maxWidth="lg">
                        <Paper elevation={10} style={{
                            position: "relative",
                            top: -30
                        }}>
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
                <footer className={classes.footer} style={{backgroundColor: "white"}}>
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