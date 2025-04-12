import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from '../pages/Landing/Landing';
import HODDashboard from '../pages/HOD/HODDashboard';
import FacultyDashboard from '../pages/Faculty/FacultyDashboard';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/hod-dashboard" component={HODDashboard} />
        <Route path="/faculty-dashboard" component={FacultyDashboard} />
      </Switch>
    </Router>
  );
};

export default Routes;
