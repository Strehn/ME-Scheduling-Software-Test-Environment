import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";
import { getCodes, createCode, deleteCode } from '../actions/billingActions';
import { compose } from 'redux';
import { connect } from "react-redux";

import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Button, Alert } from "reactstrap";

import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import DeleteOutline from '@material-ui/icons/DeleteOutline';




const tableIcons = {
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
};


class AdminTools extends Component {

  constructor(props) {
      super(props);
      this.state = {
          columns: [
              { title: 'Billing Code', field: 'code' },
              { title: 'Description', field: 'desc' },
          ]
      };
  }

  componentDidMount() {
      this.props.getCodes();
  }

    render(){
      const { classes } = this.props;

      const { codes, getCodes } = this.props.codes;

    return (
      
      <MaterialTable
          icons={tableIcons}
          title="Valid Billing Codes"
          columns={this.state.columns}
          data={codes}
          editable={{
              onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                      setTimeout(() => {
                          this.props.createCode(newData);
                          resolve()
                      }, 1000)
                  }),
              onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                      setTimeout(() => {
                          this.props.deleteCode(oldData._id)
                          resolve()
                      }, 1000)
                  }),
          }}
          options={{
              exportButton: false,
              search: true
          }}
      />
    );
}
}

AdminTools.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    codes: state.codes
});

// export default withAuthenticationRequired(AdminTools, {
//     onRedirecting: () => <Loading />,
// });

export default compose(
    connect(mapStateToProps, { getCodes, createCode, deleteCode })
)(AdminTools);
