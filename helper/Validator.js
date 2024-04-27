class Validator {
    static validateTaskInfo(taskInfo) {
        if (
            taskInfo.hasOwnProperty("id") &&
            taskInfo.hasOwnProperty("title") &&
            taskInfo.hasOwnProperty("description") &&
            taskInfo.hasOwnProperty("completed")
        ) {
            if (taskInfo.title == "" ) {
                return {
                    status: false,
                    message: "Task info is malformed, please provide title",
                };
            }
            if (taskInfo.description == "") {
                return {
                    status: false,
                    message: "Task info is malformed, please provide description",
                };
            }
            if (taskInfo.completed && typeof taskInfo.completed !== "boolean") {
                return {
                    status: false,
                    message:
                        "Task info is malformed, please provide valid value for completed field",
                };
            }
            return {
                status: true,
                message: "Validated successfully",
            };
        } else {
            return {
                status: false,
                message: "Task info is malformed, please provide all the parameters",
            };
        }
    }
}
module.exports = Validator;