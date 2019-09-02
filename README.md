![npm (scoped)](https://img.shields.io/npm/v/@salilvnair/jsxpa.svg?style=plastic)
# React Persistent Api Repository (jsxpa)

    React Persistent API Jsxpa is similar to
    Springboot JPA repository where we can define our custom
    repo with entity class as generic type and all of the
    default available crud functions can be directly used.

> Jsxpa supports typescript out of box and can be used in the pure react javascript projects.

#### 1. Create a normal model class

```javascript
export class Employee {
  firstName: string;
  lastName: string;
  designation: string;
}
```

#### 2. Create a repo for above model class extending `NeDBRepository` and implement the `returnEntityInstance` method like below

```javascript
import { NeDBRepository } from "@salilvnair/jsxpa";
import { Employee } from "../model/employee.model";

export class EmployeeRepo extends NeDBRepository<Employee> {
  // below method decides name of the file name where nedb will store the data
  // so basically it is a database file or a table name
  databaseName(): string {
    return "employee";
  }
}
```

#### 3. How to use it in any Typescript class

```javascript
import { EmployeeRepo } from './employee/repo/employee.repo';
import { Employee } from './employee/model/employee.model';

export class EmployeeService  {
  save(){
    let employeeRepo:EmployeeRepo = new EmployeeRepo();
    let employee:Employee = new Employee();
    employee.firstName = "John";
    employee.lastName = "Doe";
    employee.designation = "CEO";
    this.employeeRepo.save(employee);
  }
}
```

> _when the above code executes a folder named **jsxpa-data** will be created at the root path._

> _which will have a subfolder named **nedb** which in turn will have two subfolders named **config** and **database**._

> _config folder contains **nedb.config.json** which is generated as default config._

> _database folder is where the real data recides post save with file named as whatever given in the entity Database decorators value._