import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {Box, Button, Container, Divider, Typography} from "@material-ui/core";
import AccordionList from "./AccordionList";
import SubjectIcon from '@material-ui/icons/Subject';
import DescriptionIcon from '@material-ui/icons/Description';

class Output extends React.Component {
    render() {
        return (
            <Container>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h4" component="h2">
                            <SubjectIcon/> <b>Tóm tắt đa văn bản</b>
                            <Divider/>
                        </Typography>
                        <Typography variant="h6" component="p">
                            {this.props.response['multi_summ']}
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h4" component="h2">
                            <DescriptionIcon/> <b>Các văn bản gốc</b>
                            <Divider/>
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