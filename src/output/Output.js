import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {Box, Button, Container, Divider, Typography} from "@material-ui/core";
import AccordionList from "./AccordionList";
import Chip from '@material-ui/core/Chip';
import SubjectIcon from '@material-ui/icons/Subject';
import DescriptionIcon from '@material-ui/icons/Description';
import {VpnKeyTwoTone} from "@material-ui/icons";
import {Remarkable} from "remarkable";

class Output extends React.Component {
    constructor(props) {
        super(props);
        this.markdown = new Remarkable();
    }

    render() {
        return (
            <Container>
                <Card elevation={0}>
                    <CardContent>
                        <Typography gutterBottom variant="h4" component="h2">
                            <VpnKeyTwoTone/> <b>Từ khóa</b>
                        </Typography>
                        {
                            this.props.response['tag'].map(value => (
                                <>
                                    <Chip label={value} color="primary"/>{' '}
                                </>
                            ))
                        }
                    </CardContent>
                </Card>
                <Divider variant="middle"/>
                <Card elevation={0}>
                    <CardContent>
                        <Typography gutterBottom variant="h4" component="h2">
                            <SubjectIcon/> <b>Tóm tắt đa văn bản</b>
                        </Typography>
                        <Typography variant="h6" component="div">
                            {/*{this.props.response['multi_summ']}*/}
                            <p dangerouslySetInnerHTML={this.props.response['multi_summ']}/>
                        </Typography>
                    </CardContent>
                </Card>
                <Divider variant="middle"/>
                <Card elevation={0}>
                    <CardContent>
                        <Typography gutterBottom variant="h4" component="h2">
                            <DescriptionIcon/> <b>Các văn bản gốc</b>
                        </Typography>
                        <AccordionList documents={this.props.response['doc']}/>
                    </CardContent>
                </Card>
                <br/>
                <Box textAlign="center">
                    <Button variant="contained" onClick={() => this.props.toInput()}>
                        <b>Back</b>
                    </Button>
                </Box>
            </Container>
        )
    }
}

export default Output;