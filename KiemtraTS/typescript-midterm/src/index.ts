import { randomUUID } from "node:crypto";

interface Customer {
  readonly id: string;
  name: string;
  tax: string;
  address: string;
}

class Employee {
  public readonly id: string;
  public name: string;

  public constructor(name: string) {
    this.id = randomUUID();
    this.name = name;
  }

  public receiveNoti(message: string): void {
    console.log(
      `${this.id} - ${this.name} received notification: ${message}`,
    );
  }
}

interface Project {
  readonly id: string;
  customerId: string;
  employeeId: string;
}

type CustomerUpdateData = Partial<Omit<Customer, "id">>;
type EmployeeUpdateData = Partial<Omit<Employee, "id" | "receiveNoti">>;
type ProjectUpdateData = Partial<Omit<Project, "id">>;

class CustomerService {
  private readonly customers: Customer[] = [];

  public create(customer: Omit<Customer, "id">): Customer {
    const newCustomer: Customer = {
      id: randomUUID(),
      ...customer,
    };

    this.customers.push(newCustomer);
    return newCustomer;
  }

  public updateById(
    id: string,
    data: CustomerUpdateData,
  ): Customer | null {
    const customer: Customer | undefined = this.customers.find(
      (item: Customer): boolean => item.id === id,
    );

    if (customer === undefined) {
      return null;
    }

    Object.assign(customer, data);
    return customer;
  }
}

class EmployeeService {
  private readonly employees: Employee[] = [];

  public create(
    employee: Omit<Employee, "id" | "receiveNoti">,
  ): Employee {
    const newEmployee: Employee = new Employee(employee.name);
    this.employees.push(newEmployee);
    return newEmployee;
  }

  public findById(id: string): Employee | null {
    const employee: Employee | undefined = this.employees.find(
      (item: Employee): boolean => item.id === id,
    );

    return employee ?? null;
  }

  public updateById(
    id: string,
    data: EmployeeUpdateData,
  ): Employee | null {
    const employee: Employee | null = this.findById(id);

    if (employee === null) {
      return null;
    }

    Object.assign(employee, data);
    return employee;
  }
}

class ProjectService {
  private readonly projects: Project[] = [];

  public constructor(private readonly employeeService: EmployeeService) {}

  public create(project: Omit<Project, "id">): Project {
    const newProject: Project = {
      id: randomUUID(),
      ...project,
    };

    this.projects.push(newProject);

    const employee: Employee | null = this.employeeService.findById(
      newProject.employeeId,
    );

    if (employee !== null) {
      employee.receiveNoti("Bạn vừa được gán vào dự án mới.");
    }

    return newProject;
  }

  public updateById(id: string, data: ProjectUpdateData): Project | null {
    const project: Project | undefined = this.projects.find(
      (item: Project): boolean => item.id === id,
    );

    if (project === undefined) {
      return null;
    }

    const employeeHasChanged: boolean =
      data.employeeId !== undefined &&
      data.employeeId !== project.employeeId;

    Object.assign(project, data);

    if (employeeHasChanged) {
      const newEmployee: Employee | null = this.employeeService.findById(
        project.employeeId,
      );

      if (newEmployee !== null) {
        newEmployee.receiveNoti(
          "Bạn đã được chuyển giao phụ trách dự án này.",
        );
      }
    }

    return project;
  }
}

function assertCondition(
  condition: boolean,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function runTest<T>(name: string, callback: () => T): T {
  try {
    const result: T = callback();
    console.log(`✅ ${name}: PASSED`);
    return result;
  } catch (error: unknown) {
    const message: string =
      error instanceof Error ? error.message : String(error);

    console.error(`❌ ${name}: FAILED - ${message}`);
    throw error;
  }
}

function captureConsoleLog<T>(callback: () => T): {
  logs: string[];
  result: T;
} {
  const logs: string[] = [];
  const originalConsoleLog: typeof console.log = console.log;

  console.log = (...args: unknown[]): void => {
    const message: string = args.map(String).join(" ");
    logs.push(message);
    originalConsoleLog(...args);
  };

  try {
    const result: T = callback();
    return { logs, result };
  } finally {
    console.log = originalConsoleLog;
  }
}

function isUuid(value: string): boolean {
  const uuidRegex: RegExp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(value);
}

const customerService: CustomerService = new CustomerService();
const employeeService: EmployeeService = new EmployeeService();
const projectService: ProjectService = new ProjectService(employeeService);

console.log("\n===== BẮT ĐẦU KIỂM THỬ =====\n");

// Test Case 1:
const customer: Customer = runTest<Customer>(
  "Test Case 1 - Tạo Customer",
  (): Customer => {
    const createdCustomer: Customer = customerService.create({
      name: "Công ty ABC",
      tax: "0312345678",
      address: "Quận 1, TP. Hồ Chí Minh",
    });

    assertCondition(createdCustomer.id.length > 0, "Customer phải có id.");
    assertCondition(isUuid(createdCustomer.id), "Customer id phải là UUID.");
    assertCondition(
      createdCustomer.name === "Công ty ABC",
      "Tên Customer không chính xác.",
    );

    return createdCustomer;
  },
);

// Test Case 2:
runTest<Customer>(
  "Test Case 2 - Cập nhật Customer",
  (): Customer => {
    const updatedCustomer: Customer | null = customerService.updateById(
      customer.id,
      {
        address: "Thành phố Thủ Đức, TP. Hồ Chí Minh",
      },
    );

    assertCondition(updatedCustomer !== null, "Không tìm thấy Customer.");
    assertCondition(
      updatedCustomer.address === "Thành phố Thủ Đức, TP. Hồ Chí Minh",
      "Địa chỉ Customer chưa được cập nhật.",
    );

    return updatedCustomer;
  },
);

// Test Case 3:
const [employee1, employee2]: readonly [Employee, Employee] = runTest<
  readonly [Employee, Employee]
>("Test Case 3 - Tạo Employee", (): readonly [Employee, Employee] => {
  const firstEmployee: Employee = employeeService.create({
    name: "Nguyễn Văn An",
  });

  const secondEmployee: Employee = employeeService.create({
    name: "Trần Thị Bình",
  });

  assertCondition(isUuid(firstEmployee.id), "Employee 1 phải có UUID.");
  assertCondition(isUuid(secondEmployee.id), "Employee 2 phải có UUID.");
  assertCondition(
    firstEmployee.id !== secondEmployee.id,
    "Hai Employee phải có id khác nhau.",
  );

  return [firstEmployee, secondEmployee] as const;
});

// Test Case 4:
runTest<void>("Test Case 4 - Tìm Employee", (): void => {
  const foundEmployee: Employee | null = employeeService.findById(employee1.id);
  const notFoundEmployee: Employee | null = employeeService.findById(
    "00000000-0000-4000-8000-000000000000",
  );

  assertCondition(
    foundEmployee === employee1,
    "Phải trả về đúng Employee cần tìm.",
  );
  assertCondition(
    notFoundEmployee === null,
    "ID không tồn tại phải trả về null.",
  );
});

// Test Case 5:
const project: Project = runTest<Project>(
  "Test Case 5 - Tạo Project",
  (): Project => {
    const { logs, result: createdProject } = captureConsoleLog<Project>(
      (): Project =>
        projectService.create({
          customerId: customer.id,
          employeeId: employee1.id,
        }),
    );

    assertCondition(isUuid(createdProject.id), "Project id phải là UUID.");

    const expectedMessage: string = `${employee1.id} - ${employee1.name} received notification: Bạn vừa được gán vào dự án mới.`;

    assertCondition(
      logs.includes(expectedMessage),
      "Employee phụ trách chưa nhận đúng thông báo.",
    );

    return createdProject;
  },
);

// Test Case 6:
runTest<Project>(
  "Test Case 6 - Đổi nhân viên phụ trách Project",
  (): Project => {
    const { logs, result: updatedProject } = captureConsoleLog<Project | null>(
      (): Project | null =>
        projectService.updateById(project.id, {
          employeeId: employee2.id,
        }),
    );

    assertCondition(updatedProject !== null, "Không tìm thấy Project.");
    assertCondition(
      updatedProject.employeeId === employee2.id,
      "employeeId của Project chưa được cập nhật.",
    );

    const expectedMessage: string = `${employee2.id} - ${employee2.name} received notification: Bạn đã được chuyển giao phụ trách dự án này.`;

    assertCondition(
      logs.includes(expectedMessage),
      "Employee mới chưa nhận đúng thông báo.",
    );

    return updatedProject;
  },
);

// Test Case 7:
runTest<Project>(
  "Test Case 7 - Cập nhật Project nhưng không đổi Employee",
  (): Project => {
    const secondCustomer: Customer = customerService.create({
      name: "Công ty XYZ",
      tax: "0398765432",
      address: "Quận Hải Châu, Đà Nẵng",
    });

    const { logs, result: updatedProject } = captureConsoleLog<Project | null>(
      (): Project | null =>
        projectService.updateById(project.id, {
          customerId: secondCustomer.id,
        }),
    );

    assertCondition(updatedProject !== null, "Không tìm thấy Project.");
    assertCondition(
      updatedProject.customerId === secondCustomer.id,
      "customerId của Project chưa được cập nhật.",
    );
    assertCondition(
      logs.length === 0,
      "Không được gọi receiveNoti khi employeeId không thay đổi.",
    );

    return updatedProject;
  },
);

// Test Case 8:
runTest<void>(
  "Test Case 8 - Cập nhật dữ liệu không tồn tại",
  (): void => {
    const nonexistentId: string = "00000000-0000-4000-8000-111111111111";

    const customerResult: Customer | null = customerService.updateById(
      nonexistentId,
      { address: "Địa chỉ mới" },
    );

    const employeeResult: Employee | null = employeeService.updateById(
      nonexistentId,
      { name: "Tên mới" },
    );

    const projectResult: Project | null = projectService.updateById(
      nonexistentId,
      { customerId: customer.id },
    );

    assertCondition(customerResult === null, "Customer phải trả về null.");
    assertCondition(employeeResult === null, "Employee phải trả về null.");
    assertCondition(projectResult === null, "Project phải trả về null.");
  },
);

// Test Case 9:
runTest<Project>(
  "Test Case 9 - Employee không tồn tại",
  (): Project => {
    const { logs, result: createdProject } = captureConsoleLog<Project>(
      (): Project =>
        projectService.create({
          customerId: customer.id,
          employeeId: "00000000-0000-4000-8000-222222222222",
        }),
    );

    assertCondition(isUuid(createdProject.id), "Project phải có UUID.");
    assertCondition(
      logs.length === 0,
      "Không được gửi thông báo khi Employee không tồn tại.",
    );

    return createdProject;
  },
);

console.log("\n===== TẤT CẢ TEST CASE ĐỀU PASSED =====\n");
