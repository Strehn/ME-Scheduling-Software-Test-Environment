import React, { Component, Fragment } from 'react';
import MaterialTable from 'material-table';
import { compose } from 'redux';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUpcomingResID, deleteReservation } from "../../actions/upcomingResActions";
import { getPastResID } from "../../actions/pastResActions";

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

import { withAuth0 } from "@auth0/auth0-react";
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

class UserReservationsTable extends Component {
  constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Start Time', field: 'start' },
                { title: 'End Time', field: 'end' },
                { title: 'Machine', field: 'machine' },
                { title: 'Billing Code', field: 'billingCode' },
                { title: 'Graduate', field: 'grad' }
            ]
        }
    }

    componentDidMount() {
        this.props.getUpcomingResID(this.props.auth0.user.name);
        this.props.getPastResID(this.props.auth0.user.name);
    }

    render(){

      const { user } = this.props.auth0;

      const { classes } = this.props;
      const { upcomingreservations, getUpcomingResID } = this.props.upcomingreservations;
      const { pastreservations, getPastResID } = this.props.pastreservations;

      upcomingreservations.sort(function(a,b){
        return new Date(a.start) - new Date(b.start);
      });

      pastreservations.sort(function(a,b){
        return new Date(b.end) - new Date(a.end);
      });

      return(
        <Fragment>
        <Grid className={classes.dropdown} item xs={12}>
        <MaterialTable
          icons={tableIcons}
          title="Upcoming Reservations"
          columns={this.state.columns}
          data={upcomingreservations}
          editable={{
              onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                      setTimeout(() => {
                          this.props.deleteReservation(oldData._id, oldData)
                          resolve()
                      }, 1000)
                  }),
          }}
          options={{
              exportButton: false,
              search: false
          }}
      />
      </Grid>
      <Grid className={classes.dropdown} item xs={12}>
      <MaterialTable
        icons={tableIcons}
        title="Past Reservations"
        columns={this.state.columns}
        data={pastreservations}
        options={{
            exportButton: true,
            search: false
        }}
    />
    </Grid>
    </Fragment>
    );
    }

}

UserReservationsTable.propTypes = {
    classes: PropTypes.object.isRequired,
    upcomingreservations: PropTypes.object.isRequired,
    pastreservations: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    upcomingreservations: state.upcomingreservations,
    pastreservations: state.pastreservations
});

export default compose(
    withStyles(styles),
    connect(mapStateToProps, { getUpcomingResID, getPastResID, deleteReservation })
)(withAuth0(UserReservationsTable));
