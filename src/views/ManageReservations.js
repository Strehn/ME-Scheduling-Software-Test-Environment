import React, { Component, Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";
import { getUpcomingReservations, deleteReservation } from "../actions/upcomingResActions";
import { getPastReservations } from "../actions/pastResActions"
import { compose } from 'redux';
import { connect } from "react-redux";

import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Button, Alert } from "reactstrap";

import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import { forwardRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';


const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const styles = theme => ({
    dropdown: {
        justifyContent: 'flex-start',
        padding: theme.spacing(4)
    },
});

class ManageReservations extends Component {

  constructor(props) {
      super(props);
      this.state = {
          columns: [
              { title: 'Start Date', field: 'start' },
              { title: 'End Date', field: 'end' },
              { title: 'User', field: 'user.name' },
              { title: 'Grad', field: 'grad.name' },
              { title: 'Machine ID', field: 'resourceId' },
              { title: 'Billing Code', field: 'billingCode.code' }
          ]
      }
  }

  componentDidMount() {
      this.props.getUpcomingReservations();
      this.props.getPastReservations();
  }

    render(){
      const { classes } = this.props;
      const { upcomingreservations, getUpcomingReservations } = this.props.upcomingreservations;
      const { pastreservations, getPastReservations } = this.props.pastreservations;

    return (
      <Fragment>
      <MaterialTable
          icons={tableIcons}
          title="Upcoming Reservations"
          columns={this.state.columns}
          data={upcomingreservations}
          editable={{
              onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                      setTimeout(() => {
                          this.props.deleteReservation(oldData._id)
                          resolve()
                      }, 1000)
                  }),
          }}
          options={{
              exportButton: true,
              search: true
          }}
      />

      <MaterialTable
          icons={tableIcons}
          title="Past Reservations"
          columns={this.state.columns}
          data={pastreservations}
          options={{
              exportButton: true,
              search: true
          }}
      />
      </Fragment>
    );
}
}

ManageReservations.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    codes: state.codes,
    upcomingreservations: state.upcomingreservations,
    pastreservations: state.pastreservations
});

// export default withAuthenticationRequired(AdminTools, {
//     onRedirecting: () => <Loading />,
// });

export default compose(
    withStyles(styles),
    connect(mapStateToProps, { getUpcomingReservations, getPastReservations, deleteReservation })
)(ManageReservations);
