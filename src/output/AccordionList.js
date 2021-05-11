import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import {Typography} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class AccordionList extends React.Component {
    render() {
        return (
            <>
                {
                    this.props.documents.map((value, index) => (
                        <Accordion key={"document-" + (index + 1).toString()}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography variant="h5">
                                    <b>{"Văn bản " + (index + 1).toString()}</b>
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="h6">
                                    <div key={"document-" + (index + 1).toString()} dangerouslySetInnerHTML={value}/>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))
                }
            </>
        );
    }

}

export default AccordionList;