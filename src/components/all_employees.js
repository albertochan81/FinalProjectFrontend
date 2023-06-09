import React, { Component } from "react";
import EmployeeDataService from "../services/employee.service";
import { Link } from "react-router-dom";

import TaskDataService from "../services/task.service";

export default class EmployeeList extends Component {
  constructor(props) {
    super(props);
    this.getEmployee = this.getEmployee.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveEmployee = this.setActiveEmployee.bind(this);
    this.removeAllEmployees = this.removeAllEmployees.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);


    this.state = {
      employees: [],
      currentEmployee: null,
      currentIndex: -1,
      searchTitle: "",
    
    tasks: [],
    currentTask: null,
    currentTaskIndex: -1,
    searchDescription: "",
  };
  }

  componentDidMount() {
    this.getEmployee();
    this.getTask();
  }

  getEmployee() {
    EmployeeDataService.getAll()
      .then(response => {
        this.setState({
          employees: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteEmployee() {    
    EmployeeDataService.delete(this.state.currentEmployee.id)
    
      .then(response => {
        console.log(response.data);
        const updatedEmployees = this.state.employees.filter(
          employee => employee.id !== this.state.currentEmployee.id
        );
        this.setState({
          employees: updatedEmployees,
          currentEmployee: null,
          currentIndex: -1
        });
      })
      .catch(e => {
        console.log(e);
      });
  }
  
  getTask() {
    TaskDataService.getAll()
      .then(response => {
        this.setState({
          tasks: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.getEmployee();
    this.setState({
      currentEmployee: null,
      currentIndex: -1
    });
  }

  setActiveEmployee(employee, index) {
    this.setState({
      currentEmployee: employee,
      currentIndex: index
    });
  }

  removeAllEmployees() {
    EmployeeDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchTitle, employees, currentEmployee, currentIndex, tasks } = this.state;

    return (
      <div className="list row">
        <div className="col-md-6">
          <h4>Employee List</h4>

          <ul className="list-group">
          {employees && employees.length > 0 ? employees.map((employee, index) => (
            <li
            className={ "list-group-item " + (index === currentIndex ? "active" : "") }
            onClick={() => this.setActiveEmployee(employee, index)}
            key={index}
            >
            {employee.first_name + " " + employee.last_name}
            <button
              className="m-3 btn btn-sm btn-danger"
              onClick={this.deleteEmployee}>
                <b>X</b>
              </button>
            </li>
          ))
          : 
            <li className="list-group-item">
              <div><p>{"There are currently no employees listed."}</p></div>
            </li>
            }
          </ul>

          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllEmployees}
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {currentEmployee ? (
            <div>
              <h4>Employee</h4>
              <div>
                <label>
                  <strong>Name:</strong>
                </label>{" "}
                {currentEmployee.first_name + " " + currentEmployee.last_name}
              </div>
              <div>
                <label>
                  <strong>Department:</strong>
                </label>{" "}
                {currentEmployee.department}
              </div>

              <div>
                <label>
                  <strong>Tasks:</strong>
                </label>
                {tasks.filter(task => task.employeeId === currentEmployee.id).length === 0 ? (
                  <p>No tasks assigned</p>
                ):
                tasks.filter(task => task.employeeId === currentEmployee.id).map((task) => (
                  
                      <li>
                        {(task.description)}
                      </li>
                      
                ))} 
                
                    
             
              </div>

              <Link
                to={"/employees/" + currentEmployee.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Click on a Employee to see info </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
