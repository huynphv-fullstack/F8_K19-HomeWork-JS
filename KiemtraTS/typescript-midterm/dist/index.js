import { randomUUID } from "node:crypto";
class Employee {
    id;
    name;
    constructor(name) {
        this.id = randomUUID();
        this.name = name;
    }
    receiveNoti(message) {
        console.log(`${this.id} - ${this.name} received notification: ${message}`);
    }
}
class CustomerService {
    customers = [];
    create(customer) {
        const newCustomer = {
            id: randomUUID(),
            ...customer,
        };
        this.customers.push(newCustomer);
        return newCustomer;
    }
    updateById(id, data) {
        const customer = this.customers.find((item) => item.id === id);
        if (customer === undefined) {
            return null;
        }
        Object.assign(customer, data);
        return customer;
    }
}
class EmployeeService {
    employees = [];
    create(employee) {
        const newEmployee = new Employee(employee.name);
        this.employees.push(newEmployee);
        return newEmployee;
    }
    findById(id) {
        const employee = this.employees.find((item) => item.id === id);
        return employee ?? null;
    }
    updateById(id, data) {
        const employee = this.findById(id);
        if (employee === null) {
            return null;
        }
        Object.assign(employee, data);
        return employee;
    }
}
class ProjectService {
    employeeService;
    projects = [];
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    create(project) {
        const newProject = {
            id: randomUUID(),
            ...project,
        };
        this.projects.push(newProject);
        const employee = this.employeeService.findById(newProject.employeeId);
        if (employee !== null) {
            employee.receiveNoti("Bạn vừa được gán vào dự án mới.");
        }
        return newProject;
    }
    updateById(id, data) {
        const project = this.projects.find((item) => item.id === id);
        if (project === undefined) {
            return null;
        }
        const employeeHasChanged = data.employeeId !== undefined &&
            data.employeeId !== project.employeeId;
        Object.assign(project, data);
        if (employeeHasChanged) {
            const newEmployee = this.employeeService.findById(project.employeeId);
            if (newEmployee !== null) {
                newEmployee.receiveNoti("Bạn đã được chuyển giao phụ trách dự án này.");
            }
        }
        return project;
    }
}
function assertCondition(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
function runTest(name, callback) {
    try {
        const result = callback();
        console.log(`✅ ${name}: PASSED`);
        return result;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`❌ ${name}: FAILED - ${message}`);
        throw error;
    }
}
function captureConsoleLog(callback) {
    const logs = [];
    const originalConsoleLog = console.log;
    console.log = (...args) => {
        const message = args.map(String).join(" ");
        logs.push(message);
        originalConsoleLog(...args);
    };
    try {
        const result = callback();
        return { logs, result };
    }
    finally {
        console.log = originalConsoleLog;
    }
}
function isUuid(value) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
}
const customerService = new CustomerService();
const employeeService = new EmployeeService();
const projectService = new ProjectService(employeeService);
console.log("\n===== BẮT ĐẦU KIỂM THỬ =====\n");
// Test Case 1:
const customer = runTest("Test Case 1 - Tạo Customer", () => {
    const createdCustomer = customerService.create({
        name: "Công ty ABC",
        tax: "0312345678",
        address: "Quận 1, TP. Hồ Chí Minh",
    });
    assertCondition(createdCustomer.id.length > 0, "Customer phải có id.");
    assertCondition(isUuid(createdCustomer.id), "Customer id phải là UUID.");
    assertCondition(createdCustomer.name === "Công ty ABC", "Tên Customer không chính xác.");
    return createdCustomer;
});
// Test Case 2:
runTest("Test Case 2 - Cập nhật Customer", () => {
    const updatedCustomer = customerService.updateById(customer.id, {
        address: "Thành phố Thủ Đức, TP. Hồ Chí Minh",
    });
    assertCondition(updatedCustomer !== null, "Không tìm thấy Customer.");
    assertCondition(updatedCustomer.address === "Thành phố Thủ Đức, TP. Hồ Chí Minh", "Địa chỉ Customer chưa được cập nhật.");
    return updatedCustomer;
});
// Test Case 3:
const [employee1, employee2] = runTest("Test Case 3 - Tạo Employee", () => {
    const firstEmployee = employeeService.create({
        name: "Nguyễn Văn An",
    });
    const secondEmployee = employeeService.create({
        name: "Trần Thị Bình",
    });
    assertCondition(isUuid(firstEmployee.id), "Employee 1 phải có UUID.");
    assertCondition(isUuid(secondEmployee.id), "Employee 2 phải có UUID.");
    assertCondition(firstEmployee.id !== secondEmployee.id, "Hai Employee phải có id khác nhau.");
    return [firstEmployee, secondEmployee];
});
// Test Case 4:
runTest("Test Case 4 - Tìm Employee", () => {
    const foundEmployee = employeeService.findById(employee1.id);
    const notFoundEmployee = employeeService.findById("00000000-0000-4000-8000-000000000000");
    assertCondition(foundEmployee === employee1, "Phải trả về đúng Employee cần tìm.");
    assertCondition(notFoundEmployee === null, "ID không tồn tại phải trả về null.");
});
// Test Case 5:
const project = runTest("Test Case 5 - Tạo Project", () => {
    const { logs, result: createdProject } = captureConsoleLog(() => projectService.create({
        customerId: customer.id,
        employeeId: employee1.id,
    }));
    assertCondition(isUuid(createdProject.id), "Project id phải là UUID.");
    const expectedMessage = `${employee1.id} - ${employee1.name} received notification: Bạn vừa được gán vào dự án mới.`;
    assertCondition(logs.includes(expectedMessage), "Employee phụ trách chưa nhận đúng thông báo.");
    return createdProject;
});
// Test Case 6:
runTest("Test Case 6 - Đổi nhân viên phụ trách Project", () => {
    const { logs, result: updatedProject } = captureConsoleLog(() => projectService.updateById(project.id, {
        employeeId: employee2.id,
    }));
    assertCondition(updatedProject !== null, "Không tìm thấy Project.");
    assertCondition(updatedProject.employeeId === employee2.id, "employeeId của Project chưa được cập nhật.");
    const expectedMessage = `${employee2.id} - ${employee2.name} received notification: Bạn đã được chuyển giao phụ trách dự án này.`;
    assertCondition(logs.includes(expectedMessage), "Employee mới chưa nhận đúng thông báo.");
    return updatedProject;
});
// Test Case 7:
runTest("Test Case 7 - Cập nhật Project nhưng không đổi Employee", () => {
    const secondCustomer = customerService.create({
        name: "Công ty XYZ",
        tax: "0398765432",
        address: "Quận Hải Châu, Đà Nẵng",
    });
    const { logs, result: updatedProject } = captureConsoleLog(() => projectService.updateById(project.id, {
        customerId: secondCustomer.id,
    }));
    assertCondition(updatedProject !== null, "Không tìm thấy Project.");
    assertCondition(updatedProject.customerId === secondCustomer.id, "customerId của Project chưa được cập nhật.");
    assertCondition(logs.length === 0, "Không được gọi receiveNoti khi employeeId không thay đổi.");
    return updatedProject;
});
// Test Case 8:
runTest("Test Case 8 - Cập nhật dữ liệu không tồn tại", () => {
    const nonexistentId = "00000000-0000-4000-8000-111111111111";
    const customerResult = customerService.updateById(nonexistentId, { address: "Địa chỉ mới" });
    const employeeResult = employeeService.updateById(nonexistentId, { name: "Tên mới" });
    const projectResult = projectService.updateById(nonexistentId, { customerId: customer.id });
    assertCondition(customerResult === null, "Customer phải trả về null.");
    assertCondition(employeeResult === null, "Employee phải trả về null.");
    assertCondition(projectResult === null, "Project phải trả về null.");
});
// Test Case 9:
runTest("Test Case 9 - Employee không tồn tại", () => {
    const { logs, result: createdProject } = captureConsoleLog(() => projectService.create({
        customerId: customer.id,
        employeeId: "00000000-0000-4000-8000-222222222222",
    }));
    assertCondition(isUuid(createdProject.id), "Project phải có UUID.");
    assertCondition(logs.length === 0, "Không được gửi thông báo khi Employee không tồn tại.");
    return createdProject;
});
console.log("\n===== TẤT CẢ TEST CASE ĐỀU PASSED =====\n");
