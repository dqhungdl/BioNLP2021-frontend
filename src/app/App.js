import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import header from '../static/header.png';
import Input from "../input/Input";
import Output from "../output/Output";
import "./App.css";
import {
    Container,
    createMuiTheme,
    Link,
    Paper,
    Typography,
    ThemeProvider, Divider
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SchoolIcon from '@material-ui/icons/School';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PeopleIcon from '@material-ui/icons/People';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

const theme = createMuiTheme({
    typography: {
        fontFamily: "'Open Sans', sans-serif"
    }
});

function Copyright() {
    return (
        <Typography variant="body1" color="textSecondary" align="center"
                    style={{color: "white", backgroundColor: "#181a1b"}}>
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
        backgroundColor: "#292c2f",
        padding: theme.spacing(1),
    },
    background: {
        backgroundColor: "#e6e6e6",
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
    },
    headerBackground: {
        backgroundImage: `url(${header})`,
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
        }, () => {
            this.setState({
                showInput: false,
                showOutput: true
            });
        });
    }

    render() {
        const {classes} = this.props;
        return (
            <ThemeProvider theme={theme}>
                <Container maxWidth='xl' className={classes.background} style={{padding: 0}}>
                    {/*Header*/}
                    <Container maxWidth='xl' className={classes.headerBackground} style={{padding: 0}}>
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
                            <Container maxWidth="md" style={{padding: 0}}>
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
                    <Grid container spacing={3} justify="center">
                        <Grid item xs={3}>
                            <Paper elevation={0} className={classes.footer}>
                                <Grid container align="center" justify="center" direction="column">
                                    <Grid item>
                                        <Typography variant='h6' className={classes.whiteTypography}>
                                            <PeopleIcon/><br/>
                                            <b>Tác giả</b>
                                        </Typography>
                                        <Typography className={classes.whiteTypography}>
                                            Nguyễn Quốc An<br/>
                                            Dương Quốc Hưng<br/>
                                            Nguyễn Huy Sơn<br/>
                                            Nguyễn Minh Quang
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper elevation={0} className={classes.footer}>
                                <Grid container spacing={3} align="center" justify="center" direction="column">
                                    <Grid item xs={12}>
                                        <Typography className={classes.whiteTypography}>
                                            <SchoolIcon/>
                                        </Typography>
                                        <Typography variant="h6" className={classes.whiteTypography}>
                                            <b>Đại học Công nghệ - Đại học quốc gia Hà Nội</b>
                                        </Typography>
                                        <Typography className={classes.whiteTypography}>
                                            Khoa Công nghệ thông tin
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography className={classes.whiteTypography}>
                                            <LocationOnIcon/>
                                        </Typography>
                                        <Typography className={classes.whiteTypography}>
                                            144 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội, Việt Nam
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Divider orientation="vertical"/>
                        <Grid item xs={3}>
                            <Paper elevation={0} className={classes.footer}>
                                <Grid container spacing={3} align="center" justify="center" direction="column">
                                    <Grid item>
                                        <Typography variant='h6' className={classes.whiteTypography}>
                                            <SupervisorAccountIcon/><br/>
                                            <b>Giáo viên hướng dẫn</b>
                                        </Typography>
                                        <Typography className={classes.whiteTypography}>
                                            MSc. Cấn Duy Cát<br/>
                                            MSc. Lê Hoàng Quỳnh
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </footer>
                <Copyright/>
            </ThemeProvider>
        );
    }
}

export default withStyles(styles)(App);